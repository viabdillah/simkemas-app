import { createRemoteJWKSet, jwtVerify } from 'jose';

// URL Public Key Google/Firebase (Tetap sama)
const FIREBASE_JWKS_URL = new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');

const JWKS = createRemoteJWKSet(FIREBASE_JWKS_URL);

interface DecodedToken {
  uid: string;
  email?: string;
  [key: string]: any;
}

export const verifyFirebaseToken = async (token: string, projectId: string): Promise<DecodedToken | null> => {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    
    // [FIX UTAMA DI SINI]
    // Firebase ID Token menyimpan User ID di dalam claim 'sub' (subject).
    // Kita harus mapping 'sub' ke 'uid' agar tidak undefined.
    return {
      uid: payload.sub as string, // <-- INI KUNCINYA
      email: payload.email as string | undefined,
      ...payload
    };

  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};