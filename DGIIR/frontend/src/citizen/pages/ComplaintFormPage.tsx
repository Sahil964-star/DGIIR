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

export default function ComplaintFormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [gps, setGps] = useState<GpsCoords | null>(null);
  const [voice, setVoice] = useState<Blob | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const { data: districtsData, isLoading: isLoadingDistricts } = useQuery<any>({
    queryKey: ['districts'],
    queryFn: metaApi.getDistricts
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<any>({
    queryKey: ['categories'],
    queryFn: metaApi.getCategories
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDistrictId('');
    setCategoryId('');
    setAddress('');
    setPhoto(null);
    setGps(null);
    setVoice(null);
    setError(null);
    setSubmittedId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !districtId || !categoryId) {
      setError('Please provide all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await complaintApi.createComplaint({
        title,
        description,
        districtId,
        categoryId,
        address: address || undefined,
        latitude: gps?.lat,
        longitude: gps?.lng
      });
      
      const newComplaintId = response.data?.id || response.id;
      
      if (photo || voice) {
        const formData = new FormData();
        if (photo) formData.append('media', photo);
        if (voice) formData.append('media', voice, 'voice.webm');
        await complaintApi.uploadMedia(newComplaintId, formData);
      }
      
      setSubmittedId(newComplaintId);
    } catch (err: any) {
      console.error(err);
      const serverErr = err.response?.data?.error || err.response?.data?.message || 'Failed to submit complaint. Please check your connection.';
      setError(serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-55 bg-gradient-to-tr from-slate-100 to-indigo-50/30 dark:from-slate-900 dark:to-slate-900/50 py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8">
        
        {submittedId ? (
          <SuccessCard complaintId={submittedId} onReset={resetForm} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Submit a Complaint
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                Report local concerns directly to district administration. Please specify location, upload a photo, or leave a voice note if possible.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="flex gap-2 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-950/35">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Broken water pipe, Illegal waste disposal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={isLoadingCategories}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                >
                  <option value="" disabled>{isLoadingCategories ? 'Loading...' : 'Select Category'}</option>
                  {categoriesData?.data?.categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Landmark / Address
              </label>
              <input
                type="text"
                placeholder="Optional address details"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Describe the issue, its impact, exact landmark details, and how long it's been active..."
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
              </label>
              <PhotoUpload onChange={setPhoto} />
            </div>

            {/* Location and Voice Controls Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <GpsCapture onChange={setGps} />
              <VoiceRecorder onChange={setVoice} />
            </div>

            {/* Submit Button */}
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
                  Submitting Complaint...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
