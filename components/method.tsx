import { MethodType } from '@/types/global';
import { useMemo } from 'react';

export default function MethodBadge({
  type,
  fontSize,
  minWidth,
}: {
  type: MethodType;
  fontSize?: string;
  minWidth?: string;
}) {
  const classes = useMemo(
    () =>
      [
        `bungee method-${type.toLowerCase()}`,
        fontSize || 'text-[10px]',
        minWidth || 'min-w-[42px]',
      ].join(' '),
    [type, fontSize, minWidth]
  );
  return (
    <>
      <p className={classes}>{type}</p>
    </>
  );
}
