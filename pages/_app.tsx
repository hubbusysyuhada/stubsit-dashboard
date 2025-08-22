import "@/style/global.css"
import "@/style/globals.scss"
import Wrapper from "@/components/wrapper";
import { useEffect } from "react";
import { AppProps } from "next/app";

export default function MyApp({ Component }: AppProps) {
  return (
    <div className="flex min-h-screen">
      <Wrapper>
        <Component />
      </Wrapper>
    </div>
  );
}