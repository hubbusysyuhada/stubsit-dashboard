'use client';

import { CssVarsProvider } from '@mui/joy';
import Sidebar from './sidebar';
import Toast from './toast';

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssVarsProvider defaultMode="system" disableTransitionOnChange>
        <Sidebar />
        <div className="py-7 px-5 w-full overflow-y-auto max-h-screen">{children}</div>
        <Toast />
      </CssVarsProvider>
    </>
  );
}
