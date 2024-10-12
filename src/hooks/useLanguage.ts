// src/hooks/useLanguage.ts
import { usePathname, useRouter } from 'next/navigation';

export const useLanguage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = pathname.split('/')[1] || 'ja';

  const changeLanguage = (newLang: string) => {
    const pathWithoutLang = pathname.replace(/^\/(en|ja)/, '') || '/';
    router.push(`/${newLang}${pathWithoutLang}`);
  };

  const navigate = (path: string) => {
    router.push(`/${currentLang}${path}`);
  };

  return { currentLang, changeLanguage, navigate };
};
