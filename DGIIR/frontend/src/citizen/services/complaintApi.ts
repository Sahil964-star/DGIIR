import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL });

export interface ComplaintPayload {
  title:       string;
  description: string;
  lat?:        number;
  lng?:        number;
  accuracy?:   number;
  photo?:      File | null;
  voice?:      Blob | null;
}

export interface ComplaintResponse {
  complaintId: string;
  status:      string;
  createdAt:   string;
  message:     string;
}

/** Submit a new citizen complaint */
export async function submitComplaint(payload: ComplaintPayload): Promise<ComplaintResponse> {
  const form = new FormData();
  form.append('title',       payload.title);
  form.append('description', payload.description);
  if (payload.lat       != null) form.append('lat',      String(payload.lat));
  if (payload.lng       != null) form.append('lng',      String(payload.lng));
  if (payload.accuracy  != null) form.append('accuracy', String(payload.accuracy));
  if (payload.photo)             form.append('photo',    payload.photo);
  if (payload.voice)             form.append('voice',    payload.voice, 'voice.webm');

  const { data } = await api.post<ComplaintResponse>('/complaints', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Fetch a complaint by its ID */
export async function getComplaint(id: string) {
  const { data } = await api.get(`/complaints/${id}`);
  return data;
}
