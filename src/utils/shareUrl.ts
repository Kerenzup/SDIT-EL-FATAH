import { FoundationProfile } from '../types';

/**
 * Generate a dynamic shareable URL containing encoded foundation profile parameters
 * so that any recipient opening the link gets the exact foundation name and details.
 */
export function generateSharedUrl(profile: FoundationProfile): string {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ais-pre-ynz4in4zs55g3zuhzgo3by-524317516269.asia-southeast1.run.app';
  const pathname = typeof window !== 'undefined' && window.location.pathname ? window.location.pathname : '/';
  
  const baseUrl = `${origin}${pathname}`;

  try {
    const essentialProfile = {
      name: profile.name,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      legalNumber: profile.legalNumber,
      pembinaName: profile.pembinaName,
      leaderName: profile.leaderName,
      secretaryName: profile.secretaryName,
      treasurerName: profile.treasurerName,
      headmasterName: profile.headmasterName,
    };

    const jsonStr = JSON.stringify(essentialProfile);
    const encodedData = btoa(encodeURIComponent(jsonStr));
    const fnParam = encodeURIComponent(profile.name);

    return `${baseUrl}?fn=${fnParam}&p=${encodedData}`;
  } catch (err) {
    return `${baseUrl}?fn=${encodeURIComponent(profile.name)}`;
  }
}

/**
 * Parse URL search parameters on app initialization to hydrate foundation profile
 * if the app was opened via a shared link with parameters.
 */
export function parseProfileFromUrl(INITIAL_FOUNDATION_PROFILE: FoundationProfile): FoundationProfile | null {
  if (typeof window === 'undefined' || !window.location.search) return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const pParam = params.get('p');
    const fnParam = params.get('fn');

    let parsedProfile: Partial<FoundationProfile> = {};

    if (pParam) {
      try {
        const decodedJson = decodeURIComponent(atob(pParam));
        const json = JSON.parse(decodedJson);
        if (json && typeof json === 'object') {
          parsedProfile = json;
        }
      } catch (e) {
        console.warn('Failed to parse base64 profile param p:', e);
      }
    }

    if (fnParam && !parsedProfile.name) {
      parsedProfile.name = fnParam;
    }

    if (parsedProfile.name) {
      return {
        ...INITIAL_FOUNDATION_PROFILE,
        ...parsedProfile,
      };
    }
  } catch (err) {
    console.error('Error reading URL profile search params:', err);
  }

  return null;
}
