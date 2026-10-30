export interface RpcConfig {
  host?: string;
  port?: number;
  user: string;
  pass: string;
  protocol?: 'http' | 'https';
  timeout?: number;
  rejectUnauthorized?: boolean;
  axiosOptions?: import('axios').AxiosRequestConfig;
}

export interface CallOptions {
  /** Per-call timeout in ms, overriding the client's `timeout`. */
  timeout?: number;
  /** Target a named wallet via the `/wallet/<name>` endpoint. */
  wallet?: string;
}

export interface RpcRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params: unknown[];
}

export interface RpcResponse<T = unknown> {
  result: T | null;
  error: RpcError | null;
  id: number | string;
}

export interface RpcError {
  code: number;
  message: string;
}

export interface BatchCall {
  method: string;
  params?: unknown[];
}

export interface BatchResult<T = unknown> {
  result: T | null;
  error: RpcError | null;
}
