import { AlertTopBar } from '@/components/alert-top-bar';
import { Navbar } from '@/components/navbar';
import { NewGameCardForm } from '@/components/new-game-card-form';
import { Separator } from '@/components/ui/separator';

export default async function CreateNewGamePage() {
  return (
    <div className="flex h-full min-h-screen w-screen flex-col items-center">
      <Navbar />
      <AlertTopBar label="Essa joça tá em BETA. Não fode." />
      <main className="flex h-full w-full max-w-7xl grow flex-col gap-8 p-8">
        <header className="flex w-full flex-col gap-3 md:max-w-xl">
          <h1 className="text-5xl font-extrabold">Nova sala</h1>
          <span className="text-lg !leading-relaxed dark:text-zinc-500 md:text-xl">
            Algum subtítulo que o nosso qualificado time de desenvolvedores não
            pensou... Quer saber, use sua imaginação!
          </span>
        </header>

        <Separator className="w-full" />

        <NewGameCardForm />
      </main>
    </div>
  );
}
