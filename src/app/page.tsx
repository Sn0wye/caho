import { createCaller } from '@/utils/caller';

export default async function Home() {
  const caller = createCaller();
  const res = await caller.example();

  return <div>{res}</div>;
}
