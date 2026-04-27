import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { setupServerActionHooks } from 'zsa-react-query';

const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery
} = setupServerActionHooks({
  hooks: {
    useQuery: useQuery,
    useMutation: useMutation,
    useInfiniteQuery: useInfiniteQuery
  }
});

export {
  useServerActionInfiniteQuery,
  useServerActionMutation,
  useServerActionQuery
};
