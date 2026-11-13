import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {createApp} from '../server/index.mjs';
import {resolveAgentConfig} from '../server/agent/config.mjs';
import {fixture} from './fixtures/deepseek-topic.mjs';
const listen=server=>new Promise(r=>server.listen(0,'127.0.0.1',r));
const close=server=>new Promise(r=>server.close(r));
test('DeepSeek 环境变量兼容现有Agent，显式配置保持优先',()=>{
  const config=resolveAgentConfig({DEEPSEEK_API_KEY:'test-key'});
  assert.equal(config.enabled,true);assert.equal(config.model,'deepseek-flash');assert.equal(config.baseUrl,'https://api.deepseek.com');assert.equal(config.apiKey,'test-key');
  assert.equal(resolveAgentConfig({DEEPSEEK_API_KEY:'test-key',AGENT_ENABLED:'false'}).enabled,false);
  assert.equal(resolveAgentConfig({DEEPSEEK_API_KEY:'test-key'},{enabled:false}).enabled,false);
});
test('目录外新学科模型生成、隐藏答案、评分、讲解、复测和动态主题重启恢复',async()=>{
  const dir=await mkdtemp(tmpdir()+'/zhixi-web08-');let calls=0;
  const mock=http.createServer(async(req,res)=>{let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);assert.equal(body.response_format.type,'json_object');calls++;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(fixture())}}]}));});
  await listen(mock);
  const llm={baseUrl:`http://127.0.0.1:${mock.address().port}`,model:'test-model',apiKey:'test-key',timeoutMs:1000,maxRetries:0};
  let app=createApp({storePath:dir+'/sessions.json',llm});await listen(app);
  let base=`http://127.0.0.1:${app.address().port}/api/v1`;
  const post=async(route,body)=>{const response=await fetch(base+route,{method:'POST',body:JSON.stringify(body)});const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data;};
  try {
    const first=await post('/diagnose/start',{question:'为什么植物需要光合作用？',profile:{role:'中学生',field:'生物'}});
    assert.match(first.summary,/DeepSeek/);assert.match(first.summary,/待.*核验/);assert.ok(first.graph.nodes.some(n=>n.id==='photo'));assert.ok(!JSON.stringify(first.quiz).includes('answer'));assert.equal(first.sources[0].verified,false);
    await close(app);app=createApp({storePath:dir+'/sessions.json',llm});await listen(app);base=`http://127.0.0.1:${app.address().port}/api/v1`;
    const result=await post('/diagnose/submit',{sessionId:first.sessionId,answers:{q1:'b',q2:'a'}});assert.equal(result.weakPoints.length,2);assert.ok(result.learningPath.length);
    assert.match((await post('/learn/explain',{sessionId:first.sessionId,nodeId:'energy'})).explanation,/光合作用/);
    const second=await post('/diagnose/retest',{sessionId:first.sessionId});assert.notEqual(second.quiz[0].prompt,first.quiz[0].prompt);assert.equal(calls,1);
  }finally{await close(app);await close(mock);await rm(dir,{recursive:true,force:true});}
});

test('生成图谱允许目标之后的迁移节点，仍拒绝环和断开的节点',async()=>{
 const {validateTopic}=await import('../server/deepseek.mjs');
 const t=fixture();
 t.nodes.push({id:'transfer',label:'迁移应用',desc:'将光合作用用于解释植物生长。',layer:3});
 t.edges.push({from:'photo',to:'transfer'});
 t.path.push({id:'stepTransfer',nodeId:'transfer',title:'迁移',minutes:4,kind:'迁移练习',intro:'解释光照变化的影响。',sections:[{heading:'练习',body:'结合具体例子解释光照变化。'}]});
 assert.equal(validateTopic(t).nodes.length,4);
 const cycle=structuredClone(t);cycle.edges.push({from:'transfer',to:'energy'});assert.throws(()=>validateTopic(cycle));
 const disconnected=structuredClone(t);disconnected.edges=disconnected.edges.filter(e=>e.to!=='transfer');assert.throws(()=>validateTopic(disconnected));
});