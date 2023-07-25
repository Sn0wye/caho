import { type ReactNode } from 'react';

interface AlertTopbarProps {
  icon?: ReactNode;
  label: string;
}

export function AlertTopbar({ icon, label }: AlertTopbarProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2 bg-geist-orange px-8 py-2 font-mono text-sm font-black text-zinc-950">
      {icon}
      <span className="bg-zinc-950 px-2 py-2 leading-none text-zinc-50">
        AVISO IMPORTANTE
      </span>
      <span>{label}</span>
    </div>
  );
}
