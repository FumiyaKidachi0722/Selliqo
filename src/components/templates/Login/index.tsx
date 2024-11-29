// src/components/templates/Login/index.tsx
import { AuthSwitcher } from '@/components/organisms/AuthSwitcher';

export const LoginTemplate = () => (
  <div>
    <AuthSwitcher isInitialLogin={true} />
  </div>
);
