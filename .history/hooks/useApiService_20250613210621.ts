import { ApiError, apiService } from '@/lib/apiService';
import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ZodSchema } from 'zod';

interface UseApiServiceOptions<TResponseData, TError = ApiError> {
  queryKey?: QueryKey;
  queryParams?: Record<string, string | number | boolean | undefined>;
  tanstackQueryOptions?: Omit<UseQueryOptions<TResponseData, TError, TResponseData, QueryKey>, 'queryKey' | 'queryFn'>;
}

export function useApiQuery<TResponseData, TError = ApiError>(
  url: string,
  responseSchema: ZodSchema<TResponseData>,
  options: UseApiServiceOptions<TResponseData, TError> = {}
) {
  const { queryKey: explicitQueryKey, queryParams, tanstackQueryOptions } = options;
  const inferredQueryKey: QueryKey = [url, queryParams || {}];
  const finalQueryKey = explicitQueryKey || inferredQueryKey;

  return useQuery<TResponseData, TError, TResponseData, QueryKey>({
    queryKey: finalQueryKey,
    queryFn: () => apiService(url, responseSchema, { method: 'GET', queryParams }),
    ...(tanstackQueryOptions || {}),
  });
}

export function useApiMutation<
  TResponseData = unknown,
  TRequestBody = unknown,
  TError = ApiError,
  TContext = unknown
>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET',
  url: string,
  responseSchema: ZodSchema<TResponseData>,
  mutationOptions?: Omit<UseMutationOptions<TResponseData, TError, TRequestBody, TContext>, 'mutationFn'>
): UseMutationResult<TResponseData, TError, TRequestBody, TContext> {
  return useMutation<TResponseData, TError, TRequestBody, TContext>({
    mutationFn: async (variables: TRequestBody) => {
      return apiService<TResponseData, TRequestBody>(url, responseSchema, {
        method,
        body: variables,
      });
    },
    ...(mutationOptions || {}),
  });
} 