import { getConfig, saveConfig, type ApiConfig } from './config';
import { api } from './api';

export type ConnectionState = 'checking' | 'online' | 'offline';
export interface AutoConnectResult { config: ApiConfig; online: boolean; tried: string[] }

const PROBE_TIMEOUT_MS = 5000;

/** 依次探测候选后端地址，命中第一个可用的就自动写入配置，用户无需手动填写 API 链接。 */
export async function autoConnect(): Promise<AutoConnectResult> {
  const current = getConfig();
  const candidates = [current.baseUrl, '/api/v1', 'http://127.0.0.1:8000/api/v1', 'http://localhost:8000/api/v1']
    .filter((baseUrl, index, list) => baseUrl && list.indexOf(baseUrl) === index);
  for (const baseUrl of candidates) {
    const config: ApiConfig = { ...current, mode: 'real', baseUrl, timeoutMs: Math.min(current.timeoutMs, PROBE_TIMEOUT_MS) };
    try {
      await api.health(config);
      let saved = config;
      try { saved = saveConfig({ ...current, mode: 'real', baseUrl }); } catch { /* 存储失败时仅在当前会话生效 */ }
      return { config: saved, online: true, tried: candidates };
    } catch {
      // 继续探测下一个候选地址
    }
  }
  return { config: current, online: false, tried: candidates };
}
