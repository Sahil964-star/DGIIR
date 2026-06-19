import type {
  ComplaintStats,
  TopConcern,
  PriorityStats,
  DistrictRisk,
  ResolutionStats,
} from '../types/complaints';

// ---------------------------------------------------------------------------
// MOCK DATA — Replace queryFn bodies with real axios calls once backend is ready
// Future endpoints:
//   GET /api/dashboard/stats
//   GET /api/dashboard/top-concerns
//   GET /api/dashboard/priority
//   GET /api/dashboard/district-risk
//   GET /api/dashboard/resolution
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Complaint Stats ────────────────────────────────────────────────────────
export async function fetchComplaintStats(): Promise<ComplaintStats> {
  await delay(300);
  return {
    total: 3245,
    resolved: 2168,
    inProgress: 812,
    overdue: 265,
    resolvedPct: 66.8,
    inProgressPct: 25.0,
    overduePct: 8.2,
  };
}

// ─── Top Concerns ────────────────────────────────────────────────────────────
export async function fetchTopConcerns(): Promise<TopConcern[]> {
  await delay(300);
  return [
    { rank: 1,  name: 'Water Supply Issues',          count: 562, trend: 18, trendUp: true  },
    { rank: 2,  name: 'Road Damage / Potholes',        count: 438, trend: 12, trendUp: true  },
    { rank: 3,  name: 'Garbage Overflow',              count: 367, trend: 15, trendUp: true  },
    { rank: 4,  name: 'Drainage / Sewage Issues',      count: 298, trend: 10, trendUp: true  },
    { rank: 5,  name: 'Street Light Failure',          count: 256, trend:  5, trendUp: false },
    { rank: 6,  name: 'Power Outage',                  count: 221, trend:  8, trendUp: false },
    { rank: 7,  name: 'Public Transport Issues',       count: 172, trend:  7, trendUp: false },
    { rank: 8,  name: 'Noise Pollution',               count: 121, trend:  3, trendUp: false },
    { rank: 9,  name: 'Building / Construction Issues',count:  96, trend:  4, trendUp: false },
    { rank: 10, name: 'Other Sanitation Issues',       count:  88, trend:  6, trendUp: true  },
  ];
}

// ─── Priority Stats ──────────────────────────────────────────────────────────
export async function fetchPriorityStats(): Promise<PriorityStats> {
  await delay(250);
  return { high: 320, medium: 1102, low: 1823 };
}

// ─── District Risk (Delhi districts) ─────────────────────────────────────────
export async function fetchDistrictRisk(): Promise<DistrictRisk[]> {
  await delay(350);
  return [
    { id: 'central',        name: 'Central',        riskLevel: 'critical',  complaintCount: 412 },
    { id: 'north',          name: 'North',          riskLevel: 'concern',   complaintCount: 289 },
    { id: 'north-east',     name: 'North East',     riskLevel: 'critical',  complaintCount: 376 },
    { id: 'east',           name: 'East',           riskLevel: 'concern',   complaintCount: 301 },
    { id: 'new-delhi',      name: 'New Delhi',      riskLevel: 'watch',     complaintCount: 198 },
    { id: 'north-west',     name: 'North West',     riskLevel: 'watch',     complaintCount: 245 },
    { id: 'west',           name: 'West',           riskLevel: 'watch',     complaintCount: 267 },
    { id: 'south-west',     name: 'South West',     riskLevel: 'healthy',   complaintCount: 143 },
    { id: 'south',          name: 'South',          riskLevel: 'healthy',   complaintCount: 124 },
    { id: 'south-east',     name: 'South East',     riskLevel: 'concern',   complaintCount: 278 },
    { id: 'shahdara',       name: 'Shahdara',       riskLevel: 'critical',  complaintCount: 389 },
  ];
}

// ─── Resolution Stats ─────────────────────────────────────────────────────────
export async function fetchResolutionStats(): Promise<ResolutionStats> {
  await delay(300);
  return {
    avgHours: 48,
    improvement: 12,
    trend: [
      { date: '2025-04-18', hours: 72 },
      { date: '2025-04-25', hours: 68 },
      { date: '2025-05-02', hours: 63 },
      { date: '2025-05-09', hours: 59 },
      { date: '2025-05-16', hours: 55 },
      { date: '2025-05-17', hours: 48 },
    ],
  };
}
