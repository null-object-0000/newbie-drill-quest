import{d as a,r as s,q as t,h as e,j as i,l,c,w as u,i as n,o as d,a as f,g as o,f as r,k as y,F as _,m as p,p as m,e as k,t as v,u as q,v as h,x as b,y as g,s as C}from"./index-DhZVacqj.js";import{_ as x}from"./_plugin-vue_export-helper.BCo6x5W8.js";const j=x(a({__name:"index",setup(a){const x=s(t.value.map((a=>({id:a.id,title:a.name,description:a.description,questionCount:a.questions.length,difficulty:a.questions.reduce(((a,s)=>(a[s.difficulty]=(a[s.difficulty]||0)+1,a)),{})})))),j=s(e.value),w=async()=>{try{const{result:s}=await b({scanType:["qrCode"]});try{const a=JSON.parse(s);t.value=t.value.filter((s=>s.id!==a.id)).concat(a),g(),x.value=t.value.map((a=>({id:a.id,title:a.name,description:a.description,questionCount:a.questions.length,difficulty:a.questions.reduce(((a,s)=>(a[s.difficulty]=(a[s.difficulty]||0)+1,a)),{})}))),C({title:"导入成功",icon:"success"})}catch(a){C({title:"题库格式错误",icon:"none"})}}catch(s){C({title:"扫码失败",icon:"none"})}};return i((()=>{l()})),(a,s)=>{const t=o,e=n,i=k;return d(),c(e,{class:"container"},{default:u((()=>[f(e,{class:"header"},{default:u((()=>[f(t,{class:"import-btn",onClick:w},{default:u((()=>[r("导入题库")])),_:1})])),_:1}),f(e,{class:"question-bank-list"},{default:u((()=>[(d(!0),y(_,null,p(x.value,((a,s)=>(d(),c(e,{class:m(["bank-item",{active:a.id===j.value}]),key:s,onClick:s=>(a=>{h(a.id),j.value=a.id})(a)},{default:u((()=>[f(e,{class:"bank-content"},{default:u((()=>[f(i,{class:"bank-title"},{default:u((()=>[r(v(a.title),1)])),_:2},1024),f(i,{class:"bank-description"},{default:u((()=>[r(v(a.description),1)])),_:2},1024),f(e,{class:"bank-info"},{default:u((()=>[f(i,{class:"question-count"},{default:u((()=>[r(v(a.questionCount)+"题",1)])),_:2},1024),f(e,{class:"difficulty-tags"},{default:u((()=>[a.difficulty.easy?(d(),c(i,{key:0,class:"tag easy"},{default:u((()=>[r("简单 "+v(a.difficulty.easy),1)])),_:2},1024)):q("",!0),a.difficulty.medium?(d(),c(i,{key:1,class:"tag medium"},{default:u((()=>[r("中等 "+v(a.difficulty.medium),1)])),_:2},1024)):q("",!0),a.difficulty.hard?(d(),c(i,{key:2,class:"tag hard"},{default:u((()=>[r("困难 "+v(a.difficulty.hard),1)])),_:2},1024)):q("",!0)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:2},1032,["class","onClick"])))),128))])),_:1})])),_:1})}}}),[["__scopeId","data-v-0b5e70ce"]]);export{j as default};
