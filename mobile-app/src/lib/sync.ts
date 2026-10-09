import { supabase } from '@/lib/supabase';

export type SyncResult = { ok: true } | { ok: false; error: string };

export type RemoteState = {
  moduleProgress: Record<string, number>;
  badgeIds: string[];
};

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Merges local (possibly offline-ahead) progress with what's on the server, never regressing progress. */
export function mergeModuleProgress(
  local: Record<string, number>,
  remote: Record<string, number>
): Record<string, number> {
  const merged: Record<string, number> = { ...local };
  for (const [moduleId, remoteValue] of Object.entries(remote)) {
    const clamped = clampProgress(remoteValue);
    merged[moduleId] = Math.max(merged[moduleId] ?? 0, clamped);
  }
  return merged;
}

/** Unions badge ids earned locally and remotely — badges are never revoked, so union + dedupe is always correct. */
export function mergeBadgeIds(local: string[], remote: string[]): string[] {
  return Array.from(new Set([...local, ...remote]));
}

export async function upsertModuleProgress(
  userId: string | null,
  moduleId: string,
  progress: number
): Promise<SyncResult> {
  if (!userId) return { ok: false, error: 'no-session' };
  if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
    return { ok: false, error: 'invalid-progress' };
  }

  try {
    const { error } = await supabase.from('module_progress').upsert(
      { user_id: userId, module_id: moduleId, progress, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,module_id' }
    );
    if (error) {
      console.error('upsertModuleProgress failed', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('upsertModuleProgress unexpected error', err);
    return { ok: false, error: 'unexpected-error' };
  }
}

export async function awardBadge(userId: string | null, badgeId: string): Promise<SyncResult> {
  if (!userId) return { ok: false, error: 'no-session' };
  if (!badgeId) return { ok: false, error: 'invalid-badge-id' };

  try {
    const { error } = await supabase.from('badges_earned').upsert(
      { user_id: userId, badge_id: badgeId, earned_at: new Date().toISOString() },
      { onConflict: 'user_id,badge_id', ignoreDuplicates: true }
    );
    if (error) {
      console.error('awardBadge failed', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('awardBadge unexpected error', err);
    return { ok: false, error: 'unexpected-error' };
  }
}

export async function recordQuizAttempt(
  userId: string | null,
  moduleId: string,
  scorePct: number,
  passed: boolean
): Promise<SyncResult> {
  if (!userId) return { ok: false, error: 'no-session' };
  if (!Number.isFinite(scorePct) || scorePct < 0 || scorePct > 100) {
    return { ok: false, error: 'invalid-score' };
  }

  try {
    const { error } = await supabase.from('quiz_attempts').insert({
      user_id: userId,
      module_id: moduleId,
      score: scorePct,
      passed,
      attempted_at: new Date().toISOString(),
    });
    if (error) {
      console.error('recordQuizAttempt failed', error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('recordQuizAttempt unexpected error', err);
    return { ok: false, error: 'unexpected-error' };
  }
}

/** Pulls remote progress/badges for merging into the local store. Returns null on any failure so the caller keeps the local cache as-is. */
export async function pullRemoteState(userId: string | null): Promise<RemoteState | null> {
  if (!userId) return null;

  try {
    const [progressRes, badgesRes] = await Promise.all([
      supabase.from('module_progress').select('module_id, progress').eq('user_id', userId),
      supabase.from('badges_earned').select('badge_id').eq('user_id', userId),
    ]);

    if (progressRes.error || badgesRes.error) {
      console.error('pullRemoteState failed', progressRes.error ?? badgesRes.error);
      return null;
    }

    const moduleProgress: Record<string, number> = {};
    for (const row of progressRes.data ?? []) {
      moduleProgress[row.module_id] = row.progress;
    }
    const badgeIds = (badgesRes.data ?? []).map((row) => row.badge_id);

    return { moduleProgress, badgeIds };
  } catch (err) {
    console.error('pullRemoteState unexpected error', err);
    return null;
  }
}
