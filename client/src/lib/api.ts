// Konfigurasi URL Backend (Sesuaikan jika port berubah)
export const API_URL = 'http://localhost:8787';

interface FetchOptions extends RequestInit {
  token?: string;
}

// Wrapper fetcher yang otomatis handle JSON & Error
export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  // Setup Headers Default
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Auto-attach Token
      ...headers,
    },
    ...rest,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config as RequestInit);
    const data = await response.json();

    if (!response.ok) {
      // Lempar error agar ditangkap catch block di UI
      throw new Error(data.error || 'Terjadi kesalahan pada server');
    }

    return data as T;
  } catch (error: any) {
    throw new Error(error.message || 'Gagal menghubungi server');
  }
}