// src/components/atoms/SearchInput/index.tsx
import styles from './SearchInput.module.css';

type SearchInputProps = {
  placeholder?: string;
};

export const SearchInput = ({
  placeholder = 'Search...',
}: SearchInputProps) => {
  return (
    <input type="text" placeholder={placeholder} className={styles.input} />
  );
};
