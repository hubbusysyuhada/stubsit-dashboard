import type { CommonLayoutParamsType } from '@/types/global';

export default function CenterLayout({ children }: CommonLayoutParamsType) {
  return (
    <div className="h-full flex flex-col align-center justify-center">
      <div className="flex justify-center">{children}</div>
    </div>
  );
}
