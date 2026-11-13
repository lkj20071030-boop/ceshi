import {resolveAgentConfig} from './agent/config.mjs';
import {createLlmClient} from './agent/llm.mjs';
const config=resolveAgentConfig();
try {
  if(!config.apiKey)throw new Error('没有读取到 API Key。请在本项目运行 Configure-DeepSeek.cmd，然后重试。');
  if(!config.enabled)throw new Error('Agent 未启用。请检查 server/.env 的 AGENT_ENABLED、模型地址与模型名。');
  const client=createLlmClient({...config,maxRetries:0,maxTokens:80});
  const result=await client.complete([{role:'user',content:'连接检查：请只回复 OK。'}]);
  if(!result.content.trim())throw new Error('模型返回空内容');
  console.log(JSON.stringify({ok:true,model:result.model,latencyMs:result.latencyMs,key:'已读取，未显示'},null,2));
} catch(e) {console.error(e.status===401?'DeepSeek 拒绝了此 Key（401），请检查密钥是否完整、有效。':e.status===402?'DeepSeek API 账户余额不足（402）。':e.message);process.exitCode=1;}
