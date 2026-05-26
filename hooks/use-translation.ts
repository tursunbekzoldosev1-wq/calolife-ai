import { useLanguage } from '@/lib/language-provider';
import { t, type Language } from '@/lib/i18n';

/**
 * Hook to use translations in components
 * Usage: const tr = useTranslation(); then tr('home')
 */
export function useTranslation() {
  const { language } = useLanguage();
  
  return (key: Parameters<typeof t>[0]): string => {
    return t(key, language);
  };
}
