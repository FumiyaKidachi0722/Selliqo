// src/components/molecules/SearchBar/index.tsx
import { Button } from '@/components/atoms/Button';
import { SearchInput } from '@/components/atoms/SearchInput';

import styles from './SearchBar.module.css';

export const SearchBar = () => {
  const handleSearch = () => {
    console.log('Search initiated');
  };

  return (
    <div className={styles.container}>
      <SearchInput />
      <Button label="Search" onClick={handleSearch} />
    </div>
  );
};
