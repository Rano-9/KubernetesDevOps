export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

const BASE_URL = process.env.BASE_URL || ""

async function request<TResponse>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // 1. Build URL with query parameters safely
  const url = new URL(endpoint, BASE_URL);
  url.port = "1235"
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // 2. Normalize HeadersInit using the Headers class
  const headers = new Headers(customHeaders);
  headers.set('Accept', 'application/json');

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. Execute fetch
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  // 4. Handle empty responses (common for 204 No Content on DELETE/PATCH)
  if (response.status === 204) {
    return undefined as TResponse;
  }

  let data = await response.text()


  // 5. Throw structured error on 4xx/5xx
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, data);
  }

  
    try {return JSON.parse(data) as TResponse}
    catch{return data as TResponse} 
  
}

// Export clean method helpers
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> =>
    request<T>('GET', endpoint, options),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T> =>
    request<T>('POST', endpoint, { ...options, body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T> =>
    request<T>('PATCH', endpoint, { ...options, body }),

  delete: <T = void>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>('DELETE', endpoint, options),
};
