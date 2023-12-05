import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getUser } from '@/auth';

export default async function FinishedGamePage() {
  const user = await getUser();
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <main className="flex h-screen w-screen items-center justify-center px-8 py-4">
      <section className="flex h-full w-full max-w-7xl grow items-center justify-between">
        <aside className="flex w-full max-w-xl flex-col gap-8">
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-8xl">
            Parabéns, {firstName}! <br /> Uma bela bosta.
          </h1>
          <span className="mt-4 !leading-relaxed dark:text-zinc-500 md:text-xl">
            Tua quantidade de acertos foi tão impressionante quanto a
            experiência de um cego em um tiroteio.
          </span>

          <div className="flex w-full items-center gap-4">
            <Button size="lg">Jogar novamente</Button>
            <Button size="lg" variant="ghost">
              Arregar... (AKA. Voltar para o Lobby)
            </Button>
          </div>
        </aside>

        <Image
          src="/finished-emoji.png"
          alt="Seu troféu!"
          width={320}
          height={320}
        />
      </section>
    </main>
  );
}
