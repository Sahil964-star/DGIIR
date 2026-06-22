import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PhotoUpload from '../components/PhotoUpload';
import GpsCapture from '../components/GpsCapture';
import VoiceRecorder from '../components/VoiceRecorder';
import SuccessCard from '../components/SuccessCard';
// @ts-ignore
import { complaintApi } from '../../api/complaintApi';
// @ts-ignore
import { metaApi } from '../../api/metaApi';

interface GpsCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface AIInsights {
  category: string;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severityScore: number;
  keywords: string[];
  summary: string;
  department: string;
  district: string;
  detectedObjects: string[];
  isFlagged: boolean;
  requiresEscalation: boolean;
}

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  HIGH:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  MEDIUM:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  LOW:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function ComplaintFormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [gps, setGps] = useState<GpsCoords | null>(null);
  const [voice, setVoice] = useState<Blob | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const { data: districtsData, isLoading: isLoadingDistricts } = useQuery<any>({
    queryKey: ['districts'],
    queryFn: metaApi.getDistricts,
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDistrictId('');
    setAddress('');
    setPhoto(null);
    setGps(null);
    setVoice(null);
    setError(null);
    setSubmittedId(null);
    setAiInsights(null);
    setShowAiPanel(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !districtId) {
      setError('Please provide title, description, and district.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Single multipart request — backend AI classifies everything together
      const response = await complaintApi.createComplaint({
        title,
        description,
        districtId,
        address: address || undefined,
        latitude: gps?.lat,
        longitude: gps?.lng,
        image: photo ?? undefined,
      });

      const newComplaintId = response.data?.complaint?.id || response.data?.id;
      const insights: AIInsights | null = response.data?.aiInsights ?? null;

      // If voice note was recorded, upload it separately
      if (voice && newComplaintId) {
        const fd = new FormData();
        fd.append('media', voice, 'voice.webm');
        try {
          await complaintApi.uploadMedia(newComplaintId, fd);
        } catch {
          // non-fatal
        }
      }

      setSubmittedId(newComplaintId);
      setAiInsights(insights);
      setShowAiPanel(true);
    } catch (err: any) {
      console.error(err);
      const serverErr =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to submit complaint. Please check your connection.';
      setError(serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-indigo-50/30 dark:from-slate-900 dark:to-slate-900/50 py-10 px-4 sm:px-6 flex items-start justify-center">
      <div className="w-full max-w-xl space-y-4">

        {/* AI Success panel */}
        {submittedId && aiInsights && showAiPanel && (
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-xl overflow-hidden p-6 space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Complaint Submitted Successfully</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI analysis complete — see routing details below</p>
              </div>
            </div>

            {/* Flagged warning */}
            {aiInsights.isFlagged && (
              <div className="flex gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>This complaint has been flagged for manual review by Operations due to low AI confidence or a district mismatch.</span>
              </div>
            )}

            {/* AI Summary */}
            {aiInsights.summary && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 italic">
                "{aiInsights.summary}"
              </div>
            )}

            {/* Key metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Category</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{aiInsights.category}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Department Routed To</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{aiInsights.department || '—'}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Priority</p>
                <span className={`inline-block mt-0.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${PRIORITY_STYLES[aiInsights.priority] || ''}`}>
                  {aiInsights.priority}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Severity Score</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{aiInsights.severityScore}/100</p>
              </div>
            </div>

            {/* Confidence bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <span>AI Confidence</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{aiInsights.confidence}%</span>
              </div>
              <ConfidenceBar value={aiInsights.confidence} />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {aiInsights.confidence >= 90 ? 'High confidence — auto-routed to department.' :
                 aiInsights.confidence >= 60 ? 'Moderate confidence — routed, may be reviewed.' :
                 'Low confidence — sent to Operations for manual review.'}
              </p>
            </div>

            {/* Keywords */}
            {aiInsights.keywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Detected Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {aiInsights.keywords.map((kw) => (
                    <span key={kw} className="text-xs px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detected objects (if image was analyzed) */}
            {aiInsights.detectedObjects.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Image Analysis Detected</p>
                <div className="flex flex-wrap gap-1.5">
                  {aiInsights.detectedObjects.map((obj) => (
                    <span key={obj} className="text-xs px-2.5 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full font-medium">
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Escalation badge */}
            {aiInsights.requiresEscalation && (
              <div className="flex gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm font-medium">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI has flagged this for escalation to senior management.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Submit Another
              </button>
              <a
                href="/citizen/my-reports"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition"
              >
                View My Reports
              </a>
            </div>
          </div>
        )}

        {/* Success card fallback (no AI data) */}
        {submittedId && !showAiPanel && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8">
            <SuccessCard complaintId={submittedId} onReset={resetForm} />
          </div>
        )}

        {/* Main form */}
        {!submittedId && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  Submit a Complaint
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  Report local concerns to district administration. Our AI will automatically classify and route your complaint.
                </p>
              </div>

              {/* AI auto-classification notice */}
              <div className="flex gap-3 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/25 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.21 3.21 0 00-.547 1.703v.166a3 3 0 01-3 3H10.5a3 3 0 01-3-3v-.166c0-.64-.23-1.26-.548-1.703l-.346-.347z" />
                </svg>
                <span>
                  <strong>AI-powered routing:</strong> No need to select a category. Our AI will automatically determine the category, priority, and responsible department from your description.
                </span>
              </div>

              {/* Error */}
              {error && (
                <div className="flex gap-2 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-950/35">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. No water supply in Rohini Sector 7 for 3 days"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
              </div>

              {/* District only — no category */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  required
                  disabled={isLoadingDistricts}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                >
                  <option value="" disabled>{isLoadingDistricts ? 'Loading...' : 'Select District'}</option>
                  {districtsData?.data?.districts?.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Landmark / Address
                </label>
                <input
                  type="text"
                  placeholder="Optional — helps AI verify the district"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the issue — include impact, duration, and any hazards. The more detail you provide, the more accurately the AI can classify it."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                  Attach Photo
                  <span className="ml-2 text-xs font-normal text-indigo-500">(AI will analyze for issue detection)</span>
                </label>
                <PhotoUpload onChange={setPhoto} />
              </div>

              {/* GPS + Voice */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <GpsCapture onChange={setGps} />
                <VoiceRecorder onChange={setVoice} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analysing & Submitting…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.21 3.21 0 00-.547 1.703v.166a3 3 0 01-3 3H10.5a3 3 0 01-3-3v-.166c0-.64-.23-1.26-.548-1.703l-.346-.347z" />
                    </svg>
                    Submit & Analyse with AI
                  </>
                )}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
