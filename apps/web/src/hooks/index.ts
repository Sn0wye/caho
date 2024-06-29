import { useState } from 'react';
import type { ErrorSchema } from '@caho/schemas';
import { toast } from '@/components/ui/use-toast';

type MutateOpts<Error> = {
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export function useAction<
  TData = unknown,
  TResponse = unknown,
  TError extends ErrorSchema = ErrorSchema
>(action: (data: TData) => Promise<TError | TResponse>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<TError | null>(null);

  const mutate = async (data: TData, opts?: MutateOpts<TError>) => {
    setIsLoading(true);
    setIsError(false);

    const response = await action(data);

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
