import axios, { AxiosInstance } from 'axios';
import { Agent as HttpsAgent } from 'node:https';
import type { RpcConfig } from '../types/index.js';

export function buildHttpClient(config: RpcConfig): AxiosInstance {
  const {
    host = '127.0.0.1',
    port = 9332,
    user,
    pass,
    protocol = 'http',
    timeout = 30_000,
    rejectUnauthorized = true,
    axiosOptions = {},
  } = config;

  const httpsAgent =
    protocol === 'https' && rejectUnauthorized === false
      ? new HttpsAgent({ rejectUnauthorized: false })
      : undefined;

  return axios.create({
    baseURL: `${protocol}://${host}:${port}`,
    timeout,
    auth: { username: user, password: pass },
    headers: { 'Content-Type': 'application/json' },
    httpsAgent,
    ...axiosOptions,
  });
}
