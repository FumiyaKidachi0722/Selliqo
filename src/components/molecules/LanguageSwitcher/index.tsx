import { useLanguage } from '@/hooks/useLanguage';

import styles from './LanguageSwitcher.module.css';

export const LanguageSwitcher = () => {
  const { changeLanguage, currentLang } = useLanguage();

  return (
    <div>
      <button
        className={styles.button}
        onClick={() => changeLanguage('en')}
        disabled={currentLang === 'en'}
      >
        English
      </button>
      <button
        className={styles.button}
        onClick={() => changeLanguage('ja')}
        disabled={currentLang === 'ja'}
      >
        日本語
      </button>
    </div>
  );
};
