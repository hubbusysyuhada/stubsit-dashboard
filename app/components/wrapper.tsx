'use client';

import { CssVarsProvider } from "@mui/joy";
import Sidebar from "./sidebar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <>
    <CssVarsProvider defaultMode="system" disableTransitionOnChange>
      <Sidebar/>
      <div className="pt-7 px-4 w-full">
        { children }
      </div>
    </CssVarsProvider>
  </>
}
