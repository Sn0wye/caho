import { GoToPreviousPageButton } from '../go-to-previous-page-button';

interface DashboardPageHeaderProps {
  title: string;
  subtitle: string;
  previousPageButton?: boolean;
}

export function DashboardPageHeader({
  title,
  subtitle,
  previousPageButton
}: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8 ">
      <div className="flex w-full flex-col gap-3">
        <h1 className="text-5xl font-extrabold">{title}</h1>
        <span className="text-lg !leading-relaxed dark:text-zinc-500 md:text-xl">
          {subtitle}
        </span>
      </div>

      {previousPageButton && <GoToPreviousPageButton />}
    </header>
  );
}
