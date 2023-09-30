import { AlertTopBar } from '@/components/alert-top-bar';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from 'config/site';

export default async function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <AlertTopBar label="Cheguei na web! Agora é para valer ein... Vai arregar?" />

      <main className="flex w-full max-w-5xl flex-1 flex-col gap-16">
        <Navbar />

        <section className="flex max-w-[70%] flex-col gap-6">
          <Badge variant="secondary" className="w-fit">
            {siteConfig.descriptionShort}
          </Badge>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl md:text-6xl">
              {siteConfig.nameLong}
            </h1>
            <span className="max-w-[70%] text-base leading-10 text-muted-foreground md:text-lg">
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
