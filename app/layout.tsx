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
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet"/>
      <body className="flex min-h-screen">
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
