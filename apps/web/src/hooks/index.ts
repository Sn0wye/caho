import { useState } from 'react';
import { type Error } from '@caho/schemas';
import { toast } from '@/components/ui/use-toast';

type MutateOpts<Error> = {
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export function useAction<TData = unknown, TError extends Error = Error>(
  action: (data: TData) => Promise<void | TError>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<TError | null>(null);

  const mutate = async (data: TData, opts?: MutateOpts<TError>) => {
    setIsLoading(true);
    setIsError(false);

    const error = await action(data);

    if (error) {
      setIsError(true);
      setError(error);

      opts?.onError?.(error);

      toast({
        variant: 'destructive',
        description: error.message
      });
    }

    setIsLoading(false);
  };

  return {
    mutate,
    isLoading,
    isError,
    error
  };
}
