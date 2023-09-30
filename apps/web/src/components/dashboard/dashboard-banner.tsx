import { RoomsForms } from '../illustrations/rooms-forms';
import { Button } from '../ui/button';

interface DashboardBannerProps {
  firstName: string;
}

export function DashboardBanner({ firstName }: DashboardBannerProps) {
  return (
    <div className="w-full overflow-clip rounded-md bg-gradient-to-r from-accent/10 via-accent/10 to-accent">
      <div className="flex flex-1 flex-col-reverse items-center justify-between gap-12 p-8 md:flex-row md:items-start md:gap-8">
        <section className="flex flex-1 flex-col justify-between gap-8 lg:max-w-lg">
          <header className="flex flex-col gap-4">
            <h2 className="text-4xl font-normal text-secondary-foreground">
              Olá,{' '}
              <span className="font-semibold">
                {firstName}!
              </span>
            </h2>
            <span className="text-lg leading-relaxed text-muted-foreground">
              Algum subtítulo que o nosso qualificado time de desenvolvedores
              não pensou... Quer saber, use sua imaginação!
            </span>
          </header>

          <div className="flex items-center gap-4">
            <Button size="lg">Criar uma nova sala</Button>
            <Button size="lg" variant="ghost">
              Outras opções
            </Button>
          </div>
        </section>
        <figure className="-mt-32 w-1/2 md:-mt-24 md:h-60 md:w-auto lg:-mt-40 lg:h-80">
          <RoomsForms />
        </figure>
      </div>
    </div>
  );
}
