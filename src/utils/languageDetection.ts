import { languages, defaultLang } from './i18n';

// Country to language mapping based on primary languages
const countryToLanguage: Record<string, string> = {
  // Spanish speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 
  'VE': 'es', 'CL': 'es', 'EC': 'es', 'BO': 'es', 'PY': 'es',
  'UY': 'es', 'GT': 'es', 'CU': 'es', 'DO': 'es', 'HN': 'es',
  'NI': 'es', 'CR': 'es', 'PA': 'es', 'SV': 'es', 'GQ': 'es',
  
  // Portuguese speaking countries
  'BR': 'pt', 'PT': 'pt', 'AO': 'pt', 'MZ': 'pt', 'GW': 'pt',
  'CV': 'pt', 'ST': 'pt', 'TL': 'pt', 'MO': 'pt',
  
  // English speaking countries (fallback to English, not default Spanish)
  'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en',
  'IE': 'en', 'ZA': 'en', 'SG': 'en', 'IN': 'en', 'PH': 'en',
  'MY': 'en', 'MT': 'en', 'CY': 'en', 'JM': 'en', 'TT': 'en',
};

/**
 * Detects user's preferred language based on browser Accept-Language header
 * Follows RFC 7231 standard
 */
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return defaultLang;
  
  // Get browser languages in order of preference
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    // Extract language code (e.g., 'en-US' -> 'en')
    const langCode = lang.split('-')[0].toLowerCase();
    
    // Check if we support this language
    if (langCode in languages) {
      return langCode;
    }
  }
  
  return defaultLang;
}

/**
 * Detects user's country and maps to preferred language
 * Uses IP geolocation services
 */
export async function detectCountryLanguage(): Promise<string> {
  try {
    // Try multiple geolocation services for reliability
    const services = [
      'https://ipapi.co/country_code/',
      'https://api.country.is/',
      'https://ipinfo.io/country'
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service, { 
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        
        if (!response.ok) continue;
        
        let countryCode: string;
        
        if (service.includes('country.is')) {
          const data = await response.json();
          countryCode = data.country;
        } else {
          countryCode = (await response.text()).trim();
        }
        
        // Map country to language
        const language = countryToLanguage[countryCode.toUpperCase()];
        if (language) {
          return language;
        }
        
        break; // Got a response, no need to try other services
      } catch (error) {
        console.warn(`Geolocation service ${service} failed:`, error);
        continue;
      }
    }
  } catch (error) {
    console.warn('All geolocation services failed:', error);
  }
  
  return defaultLang;
}

/**
 * Gets user's saved language preference from localStorage
 */
export function getSavedLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem('cofoundy-preferred-language');
  } catch {
    return null;
  }
}

/**
 * Saves user's language preference to localStorage
 */
export function saveLanguagePreference(language: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('cofoundy-preferred-language', language);
  } catch (error) {
    console.warn('Could not save language preference:', error);
  }
}

/**
 * Main function to detect optimal language for user
 * Follows this priority order:
 * 1. Saved user preference (localStorage)
 * 2. Browser language preference (Accept-Language)
 * 3. Country-based language (IP geolocation)
 * 4. Default language (Spanish)
 */
export async function detectOptimalLanguage(): Promise<string> {
  // 1. Check saved preference first
  const savedLang = getSavedLanguage();
  if (savedLang && savedLang in languages) {
    return savedLang;
  }
  
  // 2. Check browser language preference
  const browserLang = detectBrowserLanguage();
  if (browserLang !== defaultLang) {
    return browserLang;
  }
  
  // 3. Try geolocation as fallback
  const countryLang = await detectCountryLanguage();
  if (countryLang !== defaultLang) {
    return countryLang;
  }
  
  // 4. Default to Spanish
  return defaultLang;
}

/**
 * Redirects user to appropriate language URL
 */
export function redirectToLanguage(detectedLang: string, currentPath: string = '/'): void {
  if (typeof window === 'undefined') return;
  
  // Don't redirect if already on the correct language
  const currentLang = getCurrentLanguageFromPath();
  if (currentLang === detectedLang) return;
  
  // Save the detected language as preference
  saveLanguagePreference(detectedLang);
  
  // Construct new URL
  let newPath = currentPath;
  
  // Remove current language prefix if present
  const langPattern = new RegExp(`^/(${Object.keys(languages).join('|')})`);
  newPath = newPath.replace(langPattern, '');
  
  // Add new language prefix (except for default language)
  if (detectedLang !== defaultLang) {
    newPath = `/${detectedLang}${newPath}`;
  }
  
  // Ensure path starts with /
  if (!newPath.startsWith('/')) {
    newPath = '/' + newPath;
  }
  
  // Redirect
  window.location.href = newPath;
}

/**
 * Gets current language from URL path
 */
export function getCurrentLanguageFromPath(): string {
  if (typeof window === 'undefined') return defaultLang;
  
  const path = window.location.pathname;
  const langMatch = path.match(/^\/([a-z]{2})\//);
  
  if (langMatch && langMatch[1] in languages) {
    return langMatch[1];
  }
  
  return defaultLang;
} 