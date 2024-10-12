// src/components/atoms/Button/index.tsx
import React from 'react';

import styles from './Button.module.css';

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: string;
};

export const Button = ({
  label,
  onClick,
  variant = 'primary',
}: ButtonProps) => {
  const buttonClass = variant === 'primary' ? styles.primary : styles.secondary;

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  );
};
