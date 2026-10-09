import { z } from 'zod';

import type { LanguageCode } from '@/i18n';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const REQUEST_TIMEOUT_MS = 20000;

export const MESSAGE_CHECK_MAX_LENGTH = 1000;
export const DEFAULT_GENERATED_DRILL_COUNT = 3;
const MIN_GENERATED_DRILL_COUNT = 1;
const MAX_GENERATED_DRILL_COUNT = 5;

export type DeepSeekErrorReason =
  | 'missing-key'
  | 'invalid-input'
  | 'invalid-key'
  | 'rate-limited'
  | 'network'
  | 'invalid-response'
  | 'unexpected-error';

const CheckMessageSchema = z.object({
  verdict: z.enum(['scam', 'legit', 'unsure']),
  confidence: z.enum(['low', 'medium', 'high']),
  redFlags: z.array(z.string()),
  explanation: z.string(),
});

export type CheckMessageResult =
  | ({ ok: true } & z.infer<typeof CheckMessageSchema>)
  | { ok: false; error: DeepSeekErrorReason };

const GeneratedDrillSchema = z.object({
  channel: z.enum(['SMS', 'WhatsApp', 'Email', 'Call']),
  from: z.string(),
  body: z.string(),
  isScam: z.boolean(),
  explain: z.string(),
});
const GeneratedDrillsSchema = z.object({ drills: z.array(GeneratedDrillSchema) });

export type GeneratedDrill = z.infer<typeof GeneratedDrillSchema>;
export type GenerateDrillsResult = { ok: true; drills: GeneratedDrill[] } | { ok: false; error: DeepSeekErrorReason };

const CHECK_MESSAGE_SYSTEM_PROMPT = `You are a cybersecurity literacy tutor helping South African students decide whether a message they received is a scam. Common SA-specific scam patterns include: fake SARS/SASSA refund or grant notices, bank impersonation (FNB, Capitec, Absa, Standard Bank, Nedbank), WhatsApp family-emergency/new-number scams, fake delivery/OTP requests, loadshedding-themed phishing, and fake job offers. Analyze the message the student pastes and respond with ONLY a JSON object matching this shape, no other text: {"verdict": "scam" | "legit" | "unsure", "confidence": "low" | "medium" | "high", "redFlags": string[], "explanation": string}. "redFlags" should be short, specific phrases drawn from the message itself (empty array if none). "explanation" should be one or two plain-language sentences a student with no security background can understand.`;

// Names the model recognises for each app language. English needs no instruction at all.
const REPLY_LANGUAGE_NAME: Partial<Record<LanguageCode, string>> = {
  zu: 'isiZulu',
  nso: 'Sepedi (Northern Sotho)',
  ts: 'Xitsonga',
};

function checkMessagePrompt(lang: LanguageCode): string {
  const name = REPLY_LANGUAGE_NAME[lang];
  if (!name) return CHECK_MESSAGE_SYSTEM_PROMPT;
  return `${CHECK_MESSAGE_SYSTEM_PROMPT} Write the "explanation" in ${name}, in plain everyday ${name} a student would use. Keep each "redFlags" phrase exactly as it appears in the message. The JSON keys and the "verdict" and "confidence" values must stay in English exactly as listed.`;
}

function generateDrillsPrompt(count: number, lang: LanguageCode): string {
  const name = REPLY_LANGUAGE_NAME[lang];
  const languageInstruction = name
    ? ` Write each "body" and "explain", and any descriptive "from" label, in ${name}, in the plain everyday ${name} such a message would really use. Keep brand names, web addresses, phone numbers and rand amounts exactly as they would really appear. The JSON keys and the "channel" values must stay in English exactly as listed.`
    : '';
  return `Generate exactly ${count} short practice messages for South African students to practice spotting scams, mixing scams and legitimate messages. Ground them in real SA-context patterns: SARS/SASSA impersonation, SA bank impersonation (FNB, Capitec, Absa, Standard Bank, Nedbank), WhatsApp family-emergency scams, fake delivery/OTP requests, loadshedding-themed phishing, fake job offers, or a believable legitimate notice. Respond with ONLY a JSON object matching this shape, no other text: {"drills": [{"channel": "SMS" | "WhatsApp" | "Email" | "Call", "from": string, "body": string, "isScam": boolean, "explain": string}]}. "explain" is one plain-language sentence a student can learn from. Do not claim these are real reported incidents.${languageInstruction}`;
}

type DeepSeekCallResult = { ok: true; content: string } | { ok: false; error: DeepSeekErrorReason };

async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<DeepSeekCallResult> {
  const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
  if (!apiKey) return { ok: false, error: 'missing-key' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return { ok: false, error: 'invalid-key' };
      if (response.status === 429) return { ok: false, error: 'rate-limited' };
      console.error('DeepSeek request failed with status', response.status);
      return { ok: false, error: 'network' };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      console.error('DeepSeek response missing message content', data);
      return { ok: false, error: 'invalid-response' };
    }
    return { ok: true, content };
  } catch (err) {
    console.error('DeepSeek request errored', err);
    return { ok: false, error: 'network' };
  } finally {
    clearTimeout(timeout);
  }
}

/** Checks a pasted message for scam indicators. Never throws — a missing key, network failure, or an unparseable model reply all become a tagged error the UI can show honestly instead of crashing or hanging. */
export async function checkMessage(message: string, lang: LanguageCode = 'en'): Promise<CheckMessageResult> {
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > MESSAGE_CHECK_MAX_LENGTH) {
    return { ok: false, error: 'invalid-input' };
  }

  const result = await callDeepSeek(checkMessagePrompt(lang), trimmed);
  if (!result.ok) return result;

  try {
    const parsed = CheckMessageSchema.parse(JSON.parse(result.content));
    return { ok: true, ...parsed };
  } catch (err) {
    console.error('DeepSeek checkMessage: unexpected response shape', err);
    return { ok: false, error: 'invalid-response' };
  }
}

/** Generates fresh, clearly-labeled AI practice drills in a South African context. Supplements the real, sourced drills in src/data/drills.ts — never presented as real reported scams. */
export async function generateSADrills(
  count: number = DEFAULT_GENERATED_DRILL_COUNT,
  lang: LanguageCode = 'en'
): Promise<GenerateDrillsResult> {
  const clampedCount = Math.min(MAX_GENERATED_DRILL_COUNT, Math.max(MIN_GENERATED_DRILL_COUNT, Math.trunc(count)));

  const result = await callDeepSeek(generateDrillsPrompt(clampedCount, lang), `Generate ${clampedCount} practice messages now.`);
  if (!result.ok) return result;

  try {
    const parsed = GeneratedDrillsSchema.parse(JSON.parse(result.content));
    return { ok: true, drills: parsed.drills };
  } catch (err) {
    console.error('DeepSeek generateSADrills: unexpected response shape', err);
    return { ok: false, error: 'invalid-response' };
  }
}
