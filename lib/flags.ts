export function isEnabled(flag: string): boolean {
  const raw = process.env[`FEATURE_${flag.toUpperCase()}`];
  if (raw === undefined) return true; // default on for dev
  return raw === "1" || raw?.toLowerCase() === "true";
}
