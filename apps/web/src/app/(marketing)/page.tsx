import Link from 'next/link';
import { siteConfig } from 'config/site';
import { AlertTopBar } from '@/components/alert-top-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/app/(marketing)/_components/navbar';

export default async function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <AlertTopBar label="Cheguei na web! Agora é para valer ein... Vai arregar?" />

      <main className="flex w-full max-w-5xl flex-1 flex-col gap-16">
        <Navbar />

        <section className="flex max-w-[70%] flex-col gap-6">
          <Badge variant="secondary" size="fit">
            {siteConfig.descriptionShort}
          </Badge>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl md:text-6xl">
              {siteConfig.nameLong}
            </h1>
            <span className="max-w-[70%] text-base leading-10 text-zinc-500 md:text-lg">
              {siteConfig.descriptionLong}
            </span>
          </div>

          <Button asChild size="lg" className="mt-4 w-fit">
            <Link href="/dashboard">Começar</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
