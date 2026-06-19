import { useRef, useState } from 'react';

interface Props {
  onChange: (blob: Blob | null) => void;
}

type RecordState = 'idle' | 'recording' | 'done';

export default function VoiceRecorder({ onChange }: Props) {
  const [state, setState]       = useState<RecordState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds]   = useState(0);

  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<BlobPart[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRef.current = recorder;
      setState('recording');
      setSeconds(0);

      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access was denied. Please allow it in your browser settings.');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setState('done');
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setSeconds(0);
    setState('idle');
    onChange(null);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
      <div className="flex items-center gap-3">
        {/* Status dot */}
        <div className={`w-3 h-3 rounded-full transition-colors ${
          state === 'recording' ? 'bg-red-500 animate-pulse' :
          state === 'done'      ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
        }`} />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {state === 'idle'      && 'Voice recording (optional)'}
          {state === 'recording' && `Recording… ${fmt(seconds)}`}
          {state === 'done'      && 'Recording saved'}
        </span>

        <div className="ml-auto flex gap-2">
          {state === 'idle' && (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm-2 6a1 1 0 102 0V4a1 1 0 10-2 0v6z" />
              </svg>
              Start
            </button>
          )}
          {state === 'recording' && (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <rect x="4" y="4" width="12" height="12" rx="1" />
              </svg>
              Stop
            </button>
          )}
          {state === 'done' && (
            <button
              type="button"
              onClick={clearRecording}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              ✕ Remove
            </button>
          )}
        </div>
      </div>

      {audioUrl && (
        <audio controls src={audioUrl} className="w-full h-8 rounded-lg" />
      )}
    </div>
  );
}
