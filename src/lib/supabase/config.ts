const PLACEHOLDER_PATTERNS = [
  "your-project",
  "your-project-id",
  "xxxxxxxx",
  "example.supabase.co",
  "placeholder",
];

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) return false;

  const normalized = url.toLowerCase();
  if (!normalized.startsWith("https://") || !normalized.includes(".supabase.co")) {
    return false;
  }

  if (PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return false;
  }

  return true;
}

export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms = 1500,
  fallback: T
): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    Promise.resolve(promise)
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(fallback);
      });
  });
}
