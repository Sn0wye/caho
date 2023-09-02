import { CardsLoader } from '../illustrations/cards-loader';
import { Grid } from '../illustrations/grid';

interface GameLoadingProps {}

export function GameLoading({}: GameLoadingProps) {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <section className="z-10 flex flex-1 flex-col items-center justify-center gap-12 bg-gradient-to-b from-white/80 from-50% to-white/10 dark:from-zinc-950/90 dark:from-50% dark:to-zinc-950/30">
        <CardsLoader />

        <header className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold sm:text-2xl">Carregando sala</h3>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Isso não deve demorar. Aguarde um momento.
          </span>
        </header>
      </section>

      <Grid className="absolute scale-125 stroke-zinc-200 object-cover dark:stroke-zinc-900" />
    </div>
  );
}
