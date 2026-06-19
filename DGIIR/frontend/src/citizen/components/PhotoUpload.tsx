import React, { useCallback, useRef, useState } from 'react';

interface Props {
  onChange: (file: File | null) => void;
}

export default function PhotoUpload({ onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) { setPreview(null); onChange(null); return; }
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onChange(file);
    },
    [onChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed 
          cursor-pointer transition-all duration-200 min-h-[140px] select-none
          ${dragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'}
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-56 object-cover rounded-xl"
          />
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.375 4.5h17.25A1.125 1.125 0 0121.75 5.625v12.75A1.125 1.125 0 0120.625 19.5H3.375A1.125 1.125 0 012.25 18.375V5.625A1.125 1.125 0 013.375 4.5z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag &amp; drop
            </p>
            <p className="text-xs text-slate-400">JPG, PNG, WebP — up to 20 MB</p>
          </>
        )}
      </div>

      {preview && (
        <button
          type="button"
          onClick={() => { setPreview(null); onChange(null); if (inputRef.current) inputRef.current.value = ''; }}
          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          ✕ Remove photo
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
