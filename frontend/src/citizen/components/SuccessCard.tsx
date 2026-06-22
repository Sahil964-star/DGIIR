interface Props {
  complaintId: string;
  onReset: () => void;
}

export default function SuccessCard({ complaintId, onReset }: Props) {
  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-8 animate-fadeIn">
      {/* Animated Checkmark Icon */}
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
        <svg className="w-8 h-8 animate-scaleUp" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Complaint Submitted Successfully!
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
        Thank you for reporting this issue. Citizens like you help make our district safer and cleaner.
      </p>

      {/* Complaint Ticket Card */}
      <div className="w-full max-w-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 mb-8 shadow-sm">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
          Complaint Ticket ID
        </span>
        <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 select-all tracking-wider mb-3">
          {complaintId}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          Save this ID to check your complaint status later.
        </div>
      </div>

      {/* File another action */}
      <button
        type="button"
        onClick={onReset}
        className="w-full max-w-xs flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200"
      >
        File Another Complaint
      </button>
    </div>
  );
}
