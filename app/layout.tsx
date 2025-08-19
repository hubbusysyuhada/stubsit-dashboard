import type { Metadata } from "next";
import "./global.css";
import "./globals.scss";
import Wrapper from "./components/wrapper";
export const metadata: Metadata = {
  title: "Stubsit",
  description: "Stub Your API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen">
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
