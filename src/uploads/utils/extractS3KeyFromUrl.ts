export const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.slice(1));
  } catch {
    return null;
  }
};
