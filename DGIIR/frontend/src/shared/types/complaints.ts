// ─── Complaint Stats ────────────────────────────────────────────────────────
export interface ComplaintStats {
  total: number;
  resolved: number;
  inProgress: number;
  overdue: number;
  resolvedPct: number;
  inProgressPct: number;
  overduePct: number;
}

// ─── Top Concerns ────────────────────────────────────────────────────────────
export interface TopConcern {
  rank: number;
  name: string;
  count: number;
  trend: number;      // % change vs last 7 days (positive = up, negative = down)
  trendUp: boolean;
}

// ─── Priority ────────────────────────────────────────────────────────────────
export interface PriorityStats {
  high: number;
  medium: number;
  low: number;
}

// ─── District Risk ───────────────────────────────────────────────────────────
export type RiskLevel = 'healthy' | 'watch' | 'concern' | 'critical';

export interface DistrictRisk {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  complaintCount: number;
}

// ─── Resolution Time ─────────────────────────────────────────────────────────
export interface ResolutionTrend {
  date: string;
  hours: number;
}

export interface ResolutionStats {
  avgHours: number;
  improvement: number;   // hours improved vs last 30 days
  trend: ResolutionTrend[];
}

// ─── Status Bar Chart ────────────────────────────────────────────────────────
export interface StatusChartData {
  name: string;
  value: number;
  fill: string;
}
