import { siteConfig } from 'config/site';
import { AlertTopBar } from '@/components/alert-top-bar';
import { Navbar } from '@/components/navbar';

export default async function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col justify-center">
      <Navbar />
      <AlertTopBar label="Cheguei na web! Agora é para valer ein... Vai arregar?" />

      <main className="flex h-full grow items-center px-8 py-4">
        <section className="flex flex-col gap-4 lg:max-w-2xl">
          <span className="w-fit bg-geist-pink px-1.5 py-0.5 text-xs font-bold text-zinc-950 sm:text-sm md:text-base">
            {siteConfig.descriptionShort}
          </span>
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-8xl lg:max-w-md">
            {siteConfig.nameLong}
          </h1>
          <span className="mt-4 !leading-relaxed dark:text-zinc-500 md:text-lg">
            {siteConfig.descriptionLong}
          </span>
        </section>
      </main>
    </div>
  );
}
