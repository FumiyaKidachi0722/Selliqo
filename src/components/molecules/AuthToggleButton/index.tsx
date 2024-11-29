// src/components/molecules/AuthToggleButton/index.tsx
import styles from './AuthToggleButton.module.css';

type AuthToggleButtonProps = {
  isLogin: boolean;
  onToggle: () => void;
};

export const AuthToggleButton = ({
  isLogin,
  onToggle,
}: AuthToggleButtonProps) => (
  <button onClick={onToggle} className={styles.toggleButton}>
    {isLogin ? 'サインアップはこちら' : 'ログインはこちら'}
  </button>
);
