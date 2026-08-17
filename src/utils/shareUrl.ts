import { FoundationProfile } from '../types';

export const SHARED_PRODUCTION_URL = 'https://ais-pre-ynz4in4zs55g3zuhzgo3by-524317516269.asia-southeast1.run.app';

/**
 * Resolves the cleanest and most accessible base URL.
 * Prevents internal agent-proxy links that cause blank pages for external staff.
 */
export function getCleanAppBaseUrl(): string {
  if (typeof window === 'undefined') return SHARED_PRODUCTION_URL;
  
  const origin = window.location.origin || '';
  
  // If running inside internal AI Studio agent proxy or localhost, fallback to official shared production URL
  if (origin.includes('agent-proxy') || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === 'null' || !origin) {
    return SHARED_PRODUCTION_URL;
  }
  
  return origin;
}

/**
 * Generate a dynamic shareable URL for staff and public visitors.
 */
export function generateSharedUrl(profile?: FoundationProfile, targetTab?: string, targetRole?: string): string {
  const baseUrl = getCleanAppBaseUrl();
  const params = new URLSearchParams();

  if (targetTab) {
    params.set('tab', targetTab);
    params.set('view', 'erp');
  } else if (targetRole) {
    params.set('role', targetRole);
    params.set('view', 'erp');
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parse URL search parameters on app initialization to hydrate foundation profile and routing
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
        console.warn('Notice: Base64 profile param parse skipped:', e);
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
