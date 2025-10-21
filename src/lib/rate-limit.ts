import { getServiceSupabase } from './supabase';

const RATE_LIMIT_WINDOW_HOURS = 24;
const MAX_REQUESTS_PER_DAY = 30;

export async function checkRateLimit(
  ipAddress: string,
  actionType: string = 'create_notice'
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = getServiceSupabase();

  // Calculate window start time
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);

  // Get existing rate limit records
  const { data, error } = await supabase
    .from('rate_limits')
    .select('action_count')
    .eq('ip_address', ipAddress)
    .eq('action_type', actionType)
    .gte('window_start', windowStart.toISOString());

  if (error) {
    console.error('Error checking rate limit:', error);
    // Allow request on error to avoid blocking legitimate users
    return { allowed: true, remaining: MAX_REQUESTS_PER_DAY };
  }

  const totalCount = data?.reduce((sum, record) => sum + (record.action_count || 0), 0) || 0;

  if (totalCount >= MAX_REQUESTS_PER_DAY) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_REQUESTS_PER_DAY - totalCount };
}

export async function incrementRateLimit(
  ipAddress: string,
  actionType: string = 'create_notice'
): Promise<void> {
  const supabase = getServiceSupabase();

  // Try to insert or update
  const { error } = await supabase.from('rate_limits').upsert(
    {
      ip_address: ipAddress,
      action_type: actionType,
      action_count: 1,
      window_start: new Date().toISOString(),
    },
    {
      onConflict: 'ip_address,action_type,window_start',
      ignoreDuplicates: false,
    }
  );

  if (error) {
    // If upsert fails, try to increment existing record
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('id, action_count')
      .eq('ip_address', ipAddress)
      .eq('action_type', actionType)
      .order('window_start', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      await supabase
        .from('rate_limits')
        .update({
          action_count: (existing.action_count || 0) + 1,
        })
        .eq('id', existing.id);
    }
  }
}

export function getClientIp(request: Request): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a placeholder (in production, this should be handled by your reverse proxy)
  return 'unknown';
}

export async function cleanupOldRateLimits(): Promise<void> {
  const supabase = getServiceSupabase();

  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - RATE_LIMIT_WINDOW_HOURS * 2);

  await supabase
    .from('rate_limits')
    .delete()
    .lt('window_start', cutoffDate.toISOString());
}
