import{d as e,r as a,G as l,j as s,K as t,c as u,w as c,i as o,o as d,a as n,e as i,f,L as m,M as r,g as p,N as _,s as v,O as b,P as g,Q as y}from"./index-ByU0O722.js";import{c as V}from"./index.BnqdJQK1.js";import{_ as x}from"./_plugin-vue_export-helper.BCo6x5W8.js";const K=x(e({__name:"config",setup(e){const x=a({baseURL:l.value.baseURL,apiKey:l.value.apiKey,model:l.value.model,temperature:l.value.temperature}),K=async()=>{await V(x.value)&&(_(x.value),v({title:"配置已保存",icon:"success"}))},U=()=>{b(),x.value={...l.value},v({title:"已重置为默认配置",icon:"success"})},h=e=>{x.value.temperature=e.detail.value},I=()=>{g({title:"确认清空",content:"确定要清空所有练习记录吗？此操作不可恢复。",success:e=>{e.confirm&&(y(),v({title:"记录已清空",icon:"success"}))}})};return s((()=>{t(),x.value={...l.value}})),(e,a)=>{const l=i,s=m,t=o,_=r,v=p;return d(),u(t,{class:"config-page"},{default:c((()=>[n(t,{class:"config-section"},{default:c((()=>[n(l,{class:"section-title"},{default:c((()=>[f("AI 配置")])),_:1}),n(t,{class:"config-form"},{default:c((()=>[n(t,{class:"form-item"},{default:c((()=>[n(l,{class:"label"},{default:c((()=>[f("API 地址")])),_:1}),n(s,{class:"input",type:"text",modelValue:x.value.baseURL,"onUpdate:modelValue":a[0]||(a[0]=e=>x.value.baseURL=e),placeholder:"请输入 API 地址"},null,8,["modelValue"])])),_:1}),n(t,{class:"form-item"},{default:c((()=>[n(l,{class:"label"},{default:c((()=>[f("API Key")])),_:1}),n(s,{class:"input",type:"text",modelValue:x.value.apiKey,"onUpdate:modelValue":a[1]||(a[1]=e=>x.value.apiKey=e),placeholder:"请输入 API Key"},null,8,["modelValue"])])),_:1}),n(t,{class:"form-item"},{default:c((()=>[n(l,{class:"label"},{default:c((()=>[f("模型")])),_:1}),n(s,{class:"input",type:"text",modelValue:x.value.model,"onUpdate:modelValue":a[2]||(a[2]=e=>x.value.model=e),placeholder:"请输入模型名称"},null,8,["modelValue"])])),_:1}),n(t,{class:"form-item"},{default:c((()=>[n(l,{class:"label"},{default:c((()=>[f("温度")])),_:1}),n(_,{class:"slider",value:x.value.temperature,onChange:h,min:0,max:2,step:.1,"show-value":""},null,8,["value"])])),_:1}),n(t,{class:"button-group"},{default:c((()=>[n(v,{class:"save-btn",onClick:K},{default:c((()=>[f("保存配置")])),_:1}),n(v,{class:"reset-btn",onClick:U},{default:c((()=>[f("重置默认")])),_:1})])),_:1})])),_:1})])),_:1}),n(t,{class:"config-section"},{default:c((()=>[n(l,{class:"section-title"},{default:c((()=>[f("挑战管理")])),_:1}),n(t,{class:"config-form"},{default:c((()=>[n(v,{class:"clear-btn",onClick:I},{default:c((()=>[f("清空练习记录")])),_:1})])),_:1})])),_:1})])),_:1})}}}),[["__scopeId","data-v-4fc8e296"]]);export{K as default};
