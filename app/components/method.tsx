import { MethodType } from "@/types/global";
import { Bungee } from 'next/font/google'
import { useMemo } from "react";
const bungee = Bungee({weight: '400'})

export default function MethodBadge({ type }: { type: MethodType }) {
  const classes = useMemo(() => [bungee.className, `method-${type.toLowerCase()}`, 'text-[10px]', 'min-w-[42px]'].join(' '), [type],)
  return <>
    <p className={classes}>{type}</p>
  </>
}