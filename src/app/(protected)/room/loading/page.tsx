import { CardsLoader } from '@/components/illustrations/cards-loader';

interface Props {}

export default function LoadingPage({}: Props) {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-8">
      <CardsLoader />
      <h1>Loading...</h1>
    </main>
  );
}
