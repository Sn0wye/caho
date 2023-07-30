'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface GoToPreviousPageButtonProps {}

export function GoToPreviousPageButton({}: GoToPreviousPageButtonProps) {
  const router = useRouter();

  function handlePreviousPage() {
    return router.back();
  }

  return <Button onClick={handlePreviousPage}>Voltar</Button>;
}
