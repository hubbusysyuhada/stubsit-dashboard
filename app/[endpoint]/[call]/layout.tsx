import { CommonLayoutParamsType } from "@/types/global";
import React from "react";

export default function AboutLayout({children}: CommonLayoutParamsType) {
  return <div className="wrapper">
    { children }
  </div>
}