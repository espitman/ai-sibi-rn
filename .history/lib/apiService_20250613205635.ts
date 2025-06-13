import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ZodSchema } from 'zod';

interface ApiServiceOptions<TRequestBody> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  queryParams?: Record<string, string | number | boolean | undefined>;
  body?: TRequestBody;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  errorData?: any;

  constructor(message: string, status: number, errorData?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorData = errorData;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const API_BASE_URL = 'https://api.example.com/api/v1'; // Replace with your actual API base URL

export async function apiService<TResponseData, TRequestBody = unknown>(
  url: string,
  zodSchema: ZodSchema<TResponseData>,
  options: ApiServiceOptions<TRequestBody> = {}
): Promise<TResponseData> {
  const { method = 'GET', queryParams, body, headers = {} } = options;

  let fullUrl = `${API_BASE_URL}${url}`;

  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
    if (params.toString()) {
      fullUrl += `?${params.toString()}`;
    }
  }

  // Get the token from AsyncStorage
  const token = await AsyncStorage.getItem('token');

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON or empty
        errorData = { message: response.statusText };
      }
      
      // Handle 401 Unauthorized by redirecting to login
      if (response.status === 401) {
        await AsyncStorage.removeItem('token'); // Clear the token
        router.replace('/(auth)/login');
        throw new ApiError('Unauthorized - Please login', response.status, errorData);
      }
      
      throw new ApiError(
        errorData?.message || `API request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle cases like 204 No Content for DELETE, where response.json() would fail
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      const parsed = zodSchema.safeParse(undefined);
      if (parsed.success) {
        return parsed.data;
      } else {
        console.error("Zod validation error on empty response:", parsed.error.errors);
        throw new ApiError('Zod validation failed on empty response', response.status, parsed.error.flatten());
      }
    }

    const responseData = await response.json();
    const validationResult = zodSchema.safeParse(responseData);

    if (!validationResult.success) {
      console.error("Zod validation error:", validationResult.error.errors);
      throw new ApiError('Response validation failed', response.status, validationResult.error.flatten());
    }

    return validationResult.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Network or unexpected error in apiService:', error);
    throw new ApiError(error instanceof Error ? error.message : 'An unknown network error occurred', 0, error);
  }
} 