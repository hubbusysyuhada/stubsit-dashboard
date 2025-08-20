import { MethodType } from "@/types/global";
import { Bungee } from 'next/font/google'
import { useMemo } from "react";
const bungee = Bungee({weight: '400', subsets: ['latin']})

export default function MethodBadge({ type, fontSize, minWidth }: { type: MethodType; fontSize?: string; minWidth?: string }) {
  const classes = useMemo(() => [bungee.className, `method-${type.toLowerCase()}`, fontSize || 'text-[10px]', minWidth || 'min-w-[42px]'].join(' '), [type, fontSize, minWidth],)
  return <>
    <p className={classes}>{type}</p>
  </>
}