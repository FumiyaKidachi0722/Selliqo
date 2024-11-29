// src/components/templates/Signup/index.tsx
import { AuthSwitcher } from '@/components/organisms/AuthSwitcher';

export const SignupTemplate = () => (
  <div>
    <AuthSwitcher isInitialLogin={false} />
  </div>
);
