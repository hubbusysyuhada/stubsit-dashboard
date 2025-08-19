import { CommonLayoutParamsType } from "@/types/global";
import React from "react";

export default function AboutLayout({children}: CommonLayoutParamsType) {
  return <div className="pt-7 px-4 w-full">
    { children }
  </div>
}