import { AlertTopBar } from '@/components/alert-top-bar';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from 'config/site';

export default async function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <AlertTopBar label="Cheguei na web! Agora é para valer ein... Vai arregar?" />

      <main className="flex flex-col gap-16 w-full max-w-5xl flex-1">
        <Navbar />

        <section className="flex max-w-[70%] flex-col gap-6">
          <Badge variant="secondary" size="fit">
            {siteConfig.descriptionShort}
          </Badge>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl md:text-6xl">
              {siteConfig.nameLong}
            </h1>
            <span className="text-base max-w-[70%] leading-10 text-zinc-500 md:text-lg">
              {siteConfig.descriptionLong}
            </span>
          </div>

          <Button size="lg" className="mt-4 w-fit">
            Começar
          </Button>
        </section>
      </main>
    </div>
  );
}
