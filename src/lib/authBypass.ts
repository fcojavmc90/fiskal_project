const DEFAULT_BYPASS = false;

export function isAuthBypassed() {
  const envEnabled = process.env.NEXT_PUBLIC_AUTH_BYPASS === '1';
  if (!envEnabled) return false;
  if (typeof window !== 'undefined') {
    const flag = localStorage.getItem('fk_auth_bypass');
    if (flag === '1') return true;
    if (flag === '0') return false;
  }
  return DEFAULT_BYPASS;
}
