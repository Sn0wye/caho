'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function GoToPreviousPageButton() {
  const router = useRouter();

  function handlePreviousPage() {
    return router.back();
  }

  return <Button onClick={handlePreviousPage}>Voltar</Button>;
}
