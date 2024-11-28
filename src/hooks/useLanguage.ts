// src/hooks/useLanguage.ts
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useLanguage = () => {
  const pathname = usePathname();
  const router = useRouter();

  // 初期の言語を localStorage から取得、存在しなければ pathname を解析して設定
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || pathname.split('/')[1] || 'ja';
    }
    return 'ja';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLang); // 言語を保存
    }
  }, [currentLang]);

  const changeLanguage = (newLang: string) => {
    const pathWithoutLang = pathname.replace(/^\/(en|ja)/, '') || '/';
    setCurrentLang(newLang); // 状態を更新
    router.push(`/${newLang}${pathWithoutLang}`);
  };

  const navigate = (path: string) => {
    router.push(`/${currentLang}${path}`);
  };

  return { currentLang, changeLanguage, navigate };
};
