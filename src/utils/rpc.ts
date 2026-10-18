import { AxiosInstance, AxiosError } from 'axios';
import type {
  CallOptions,
  RpcRequest,
  RpcResponse,
  BatchCall,
  BatchResult,
} from '../types/index.js';

export class RpcCallError extends Error {
  public readonly code: number;
  public readonly httpStatus?: number;

  constructor(message: string, code: number, httpStatus?: number) {
    super(message);
    this.name = 'RpcCallError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

function toAxiosConfig({ timeout }: CallOptions) {
  return timeout !== undefined ? { timeout } : undefined;
}

export async function callRpc<T = unknown>(
  http: AxiosInstance,
  method: string,
  params: unknown[] = [],
  options: CallOptions = {},
): Promise<T> {
  const request: RpcRequest = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  };

  try {
    const { data } = await http.post<RpcResponse<T>>(
      '/',
      request,
      toAxiosConfig(options),
    );

    if (data.error) {
      throw new RpcCallError(data.error.message, data.error.code);
    }

    return data.result as T;
  } catch (err) {
    if (err instanceof RpcCallError) throw err;

    const axiosErr = err as AxiosError<RpcResponse<T>>;
    const status = axiosErr.response?.status;
    const rpcError = axiosErr.response?.data?.error;

    // litecoind replies to failed calls with HTTP 500/404 and a JSON-RPC error body
    if (rpcError && typeof rpcError === 'object') {
      throw new RpcCallError(rpcError.message, rpcError.code, status);
    }

    if (status === 401)
      throw new RpcCallError('Unauthorized: check user/pass', -401, 401);
    if (status === 403) throw new RpcCallError('Forbidden', -403, 403);
    if (status === 500 && typeof axiosErr.response?.data === 'string') {
      throw new RpcCallError(axiosErr.response.data, -500, 500);
    }

    throw new RpcCallError(
      `RPC request failed: ${axiosErr.message}`,
      -1,
      status,
    );
  }
}

export async function callRpcBatch(
  http: AxiosInstance,
  calls: BatchCall[],
  options: CallOptions = {},
): Promise<BatchResult[]> {
  if (calls.length === 0) return [];

  const requests: RpcRequest[] = calls.map((call, i) => ({
    jsonrpc: '2.0',
    id: `${Date.now()}-${i}`,
    method: call.method,
    params: call.params ?? [],
  }));

  try {
    const { data } = await http.post<RpcResponse[]>(
      '/',
      requests,
      toAxiosConfig(options),
    );

    if (!Array.isArray(data)) {
      throw new RpcCallError('Expected array response for batch request', -1);
    }

    const byId = new Map(data.map((r) => [r.id, r]));

    return requests.map((req) => {
      const res = byId.get(req.id);
      if (!res)
        return {
          result: null,
          error: { code: -1, message: 'Missing response for request' },
        };
      return { result: res.result, error: res.error };
    });
  } catch (err) {
    if (err instanceof RpcCallError) throw err;
    const axiosErr = err as AxiosError;
    throw new RpcCallError(
      `RPC batch request failed: ${axiosErr.message}`,
      -1,
      axiosErr.response?.status,
    );
  }
}
