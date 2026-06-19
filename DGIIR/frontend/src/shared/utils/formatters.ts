// ─── Number Formatting ───────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return n.toLocaleString('en-IN');
  return n.toString();
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

// ─── Date & Time ─────────────────────────────────────────────────────────────
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();
}

// ─── Greeting ────────────────────────────────────────────────────────────────
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ─── Trend ───────────────────────────────────────────────────────────────────
export function trendSign(trendUp: boolean): string {
  return trendUp ? '↑' : '↓';
}
