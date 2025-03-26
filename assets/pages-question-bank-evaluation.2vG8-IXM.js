import{D as e,E as o,G as s,H as t,d as a,r as n,z as l,A as c,c as r,w as i,i as u,B as d,I as f,s as p,o as w,a as v,u as g,e as h,f as y,k as m,F as _,m as b,t as k,g as U,n as x}from"./index-ByU0O722.js";import{_ as S}from"./_plugin-vue_export-helper.BCo6x5W8.js";function O(e,o,t=!1){const a={baseURL:s.value.baseURL,apiKey:s.value.apiKey},n=function(e,o){return`作为技术面试官，请对以下回答进行评估，并严格分步返回结果：\n\n            问题：${e}\n            答案：${o}\n\n            请按以下步骤返回 JSON 结果，每一步均为完整对象：\n            1. 评分（仅含分数）：\n            {"score": 0-100的整数}\n            \n            2. 评价（分数+评价）：\n            {"score": 同上, "feedback": "面试官口吻的详细评价，中文，非空"}\n            \n            3. 建议（分数+评价+建议）：\n            {"score": 同上, "feedback": 同上, "suggestions": "导师口吻的改进建议，中文，非空"}\n            \n            4. 范例（分数+评价+建议+范例）：\n            {"score": 同上, "feedback": 同上, "suggestions": 同上, "example": "标准答案示例，中文，非空"}\n            \n            5. 最终结果（含追问判断）：\n            {"score": 同上, "feedback": 同上, "suggestions": 同上, "example": 同上, "needFollowUp": true/false, "followUpQuestion": "不要随意追问，若需追问，此处为非空中文问题"}\n            \n            注意：\n            1. score 需综合准确性（0-40）、完整性（0-30）、清晰度（0-20）、逻辑性（0-10）评分。\n            2. 所有文本字段必须为非空中文，禁止缺失或混合其他语言。\n            3. 以面试官角度考虑该面试者是否值得追问或引导，若需要则将 needFollowUp 设置为 true，否则为 false。\n            3. needFollowUp 为 true 时，followUpQuestion 必须是与原问题强相关、能进一步考察候选人技术深度的追问问题，避免开放式提问。\n            `}(e,o);return{config:a,data:{model:s.value.model,temperature:s.value.temperature,response_format:{type:"json_object"},messages:[{role:"system",content:"你是一位经验丰富的技术面试官，善于评估候选人的回答并提供建设性的反馈。"},{role:"user",content:n}],stream:t}}}function F(e){return{score:e.score,feedback:e.feedback||"",suggestions:e.suggestions||"",example:e.example||"",needFollowUp:e.needFollowUp||!1,followUpQuestion:e.followUpQuestion||""}}function N(e){try{const o=JSON.parse(e);if("object"==typeof o&&null!==o)return e}catch{}let o=e;o.endsWith(",")&&(o=o.slice(0,-1)),o.startsWith("{")||(o="{"+o),o.endsWith('"')?o+="}":o.endsWith('"')||o.endsWith("}")||(o+='"}');try{return JSON.parse(o),o}catch{return null}}async function E(e,s,a){return new Promise(((n,l)=>{const{config:c,data:r}=O(e,s);let i="",u=F({});const d=o({url:"ws://localhost:18780",complete:()=>{}});d.onOpen((()=>{d.send({data:JSON.stringify({...r,...c}),fail:e=>{console.error("发送消息失败:",e),l(new Error("发送消息失败"))}})})),d.onMessage((e=>{var o,s,t,c,r;try{const p=JSON.parse(e.data);if(p.error)return d.close({}),void l(new Error(p.error));if(null==(t=null==(s=null==(o=p.choices)?void 0:o[0])?void 0:s.delta)?void 0:t.content){i+=p.choices[0].delta.content;const e=N(i);if(e)try{const o=JSON.parse(e);u=F(o),a(u)}catch(f){console.warn("解析 JSON 结果失败:",f)}}"stop"===(null==(r=null==(c=p.choices)?void 0:c[0])?void 0:r.finish_reason)&&(d.close({}),n(u))}catch(f){console.error("处理消息时出错:",f)}})),d.onError((async()=>{console.warn("WebSocket 连接失败，降级使用 HTTP 请求");try{u=await async function(e,o){return new Promise(((s,a)=>{const{config:n,data:l}=O(e,o);t({url:`${n.baseURL}/v1/chat/completions`,method:"POST",header:{"Content-Type":"application/json",Authorization:`Bearer ${n.apiKey}`},timeout:18e4,data:l,success:e=>{try{const o=e.data.choices[0].message.content;s(F(JSON.parse(o)))}catch(o){a(new Error("解析评估结果失败"))}},fail:()=>a(new Error("请求评估失败"))})}))}(e,s),a(u),n(u)}catch(o){l(o)}})),d.onClose((()=>{u.score>=0&&n(u)}))}))}async function J(o,s,t=()=>{}){try{if("web"===e().uniPlatform)try{return await async function(e,o,s){var t,a,n,l,c;const{config:r,data:i}=O(e,o,!0);let u="",d=F({});const f=await fetch(`${r.baseURL}/v1/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r.apiKey}`,Accept:"text/event-stream"},body:JSON.stringify(i)});if(!f.ok||!f.body)throw new Error(f.ok?"Response body is null":`HTTP error! status: ${f.status}`);const p=f.body.getReader(),w=new TextDecoder;for(;;){const{done:e,value:o}=await p.read();if(e)break;const r=w.decode(o,{stream:!0});for(const i of r.split("\n").filter((e=>e.trim()))){if(!i.startsWith("data: "))continue;const e=i.slice(6);if("[DONE]"!==e)try{const o=JSON.parse(e);if(o.error)throw new Error(o.error);if(null==(n=null==(a=null==(t=o.choices)?void 0:t[0])?void 0:a.delta)?void 0:n.content){u+=o.choices[0].delta.content;const e=N(u);if(e)try{d=F(JSON.parse(e)),s(d)}catch(v){console.warn("解析 JSON 结果失败:",v)}}if("stop"===(null==(c=null==(l=o.choices)?void 0:l[0])?void 0:c.finish_reason))return d}catch(v){console.error("解析 SSE 数据时出错:",v)}}}return d}(o,s,t)}catch(a){console.warn("SSE 连接失败，降级使用 WebSocket:",a)}return await E(o,s,t)}catch(a){throw console.error("评估失败:",a),a}}const Q=S(a({__name:"evaluation",setup(e){const o=n({score:-1,feedback:"",suggestions:"",example:"",needFollowUp:!1});l((()=>{var e;const s=null==(e=d())?void 0:e.proxy,t=null==s?void 0:s.getOpenerEventChannel();t&&t.on?t.on("evaluateAnswer",(async e=>{try{const s=await J(e.question,e.answer,(e=>{o.value={score:void 0===e.score?-1:e.score,feedback:e.feedback||"",suggestions:e.suggestions||"",example:e.example||"",needFollowUp:e.needFollowUp||!1,followUpQuestion:e.followUpQuestion||""}}));o.value=s,s.score>=0&&f({questionContent:e.question,questionDifficulty:e.difficulty,questionCategory:e.category,questionIsFollowUp:e.isFollowUp||!1,answer:e.answer,score:s.score,feedback:s.feedback,suggestions:s.suggestions,example:s.example,timestamp:Date.now()})}catch(s){console.error("评估失败",s),p({title:"评估失败，请重试",icon:"none"})}})):c({url:"/pages/index/index"})}));const s=()=>{var e;(null==(e=o.value)?void 0:e.followUpQuestion)&&x({url:"/pages/question-bank/answer",success:e=>{var s;e.eventChannel.emit("setQuestion",{question:null==(s=o.value)?void 0:s.followUpQuestion,isFollowUp:!0})}})};return(e,t)=>{const a=h,n=u,l=U;return w(),r(n,{class:"content"},{default:i((()=>[v(n,{class:"evaluation-section"},{default:i((()=>[v(n,{class:"evaluation-card"},{default:i((()=>[v(n,{class:"score-section"},{default:i((()=>[v(a,{class:"score-label"},{default:i((()=>[y("得分")])),_:1}),v(a,{class:"score-value"},{default:i((()=>[o.value.score<0||!o.value.feedback?(w(),r(a,{key:0,class:"loading-container"},{default:i((()=>[v(a,{class:"loading-text"},{default:i((()=>[y("评估中")])),_:1}),v(a,{class:"loading-dots"},{default:i((()=>[(w(),m(_,null,b(3,(e=>v(a,{class:"dot"},{default:i((()=>[y(".")])),_:1}))),64))])),_:1})])),_:1})):(w(),r(a,{key:1},{default:i((()=>[y(k(o.value.score),1)])),_:1}))])),_:1})])),_:1}),o.value.score<0||!o.value.feedback?(w(),r(n,{key:0,class:"placeholder-sections"},{default:i((()=>[(w(),m(_,null,b(3,(e=>v(n,{class:"placeholder-section"},{default:i((()=>[v(n,{class:"placeholder-title"}),v(n,{class:"placeholder-content"})])),_:1}))),64))])),_:1})):(w(),r(n,{key:1},{default:i((()=>[o.value.feedback?(w(),r(n,{key:0,class:"feedback-section"},{default:i((()=>[v(a,{class:"feedback-title"},{default:i((()=>[y("评价")])),_:1}),v(a,{class:"feedback-content"},{default:i((()=>[y(k(o.value.feedback),1)])),_:1})])),_:1})):g("",!0),o.value.suggestions?(w(),r(n,{key:1,class:"suggestions-section"},{default:i((()=>[v(a,{class:"suggestions-title"},{default:i((()=>[y("建议")])),_:1}),v(a,{class:"suggestions-content"},{default:i((()=>[y(k(o.value.suggestions),1)])),_:1})])),_:1})):g("",!0),o.value.example?(w(),r(n,{key:2,class:"example-section"},{default:i((()=>[v(a,{class:"example-title"},{default:i((()=>[y("范例")])),_:1}),v(a,{class:"example-content"},{default:i((()=>[y(k(o.value.example),1)])),_:1})])),_:1})):g("",!0),o.value.needFollowUp?(w(),r(n,{key:3,class:"follow-up-section"},{default:i((()=>[v(a,{class:"follow-up-title"},{default:i((()=>[y("追问")])),_:1}),v(a,{class:"follow-up-content"},{default:i((()=>[y(k(o.value.followUpQuestion),1)])),_:1})])),_:1})):g("",!0)])),_:1}))])),_:1})])),_:1}),o.value.needFollowUp?(w(),r(l,{key:0,class:"follow-up-btn",onClick:s},{default:i((()=>[y("继续回答")])),_:1})):g("",!0)])),_:1})}}}),[["__scopeId","data-v-1c90a666"]]);export{Q as default};
