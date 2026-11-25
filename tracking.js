import {DAY_KEYS} from './routine.js';
export const clone = v => JSON.parse(JSON.stringify(v));
export const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function shift(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x;}
export function monday(d){return shift(d,-((d.getDay()+6)%7));}
export const validTime = s => typeof s==='string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
export const usable = rows => (rows||[]).filter(a=>validTime(a[0])&&validTime(a[1])&&a[0]!==a[1]&&a[2].trim());
export function prune(data,now=new Date()){
 const start=dateKey(monday(now)),end=dateKey(now);let changed=false;
 if(!data.history||typeof data.history!=='object'||Array.isArray(data.history)){data.history={};changed=true;}
 for(const k of Object.keys(data.history))if(k<start||k>end){delete data.history[k];changed=true;}
 return changed;
}
export function todayRecord(data,now=new Date()){
 const key=dateKey(now);let changed=prune(data,now);const rows=usable(data.schedules[DAY_KEYS[now.getDay()]]);
 const old=data.history[key];const done=new Map((old?.activities||[]).map(a=>[a.id,a.done]));
 const record={activities:rows.map(a=>({id:a[3],start:a[0],end:a[1],title:a[2],done:done.get(a[3])===true}))};
 if(JSON.stringify(old)!==JSON.stringify(record)){data.history[key]=record;changed=true;}
 return {record:data.history[key],changed};
}
export function completion(record){const total=record?.activities.length||0,done=record?.activities.filter(a=>a.done).length||0;return {total,done,pct:total?Math.round(done/total*100):0};}
function occurrences(data,day){return usable(data.schedules[DAY_KEYS[day.getDay()]]).map(a=>{const start=new Date(day),end=new Date(day);const [sh,sm]=a[0].split(':').map(Number),[eh,em]=a[1].split(':').map(Number);start.setHours(sh,sm,0,0);end.setHours(eh,em,0,0);if(end<=start)end.setDate(end.getDate()+1);return {a,start,end};});}
export function currentNext(data,now=new Date()){
 const all=[];for(let i=-1;i<=7;i++)all.push(...occurrences(data,shift(now,i)));all.sort((a,b)=>a.start-b.start);
 const current=all.filter(x=>x.start<=now&&now<x.end).at(-1)||null;
 const next=all.find(x=>x.start>now)||null;
 return {current,next,elapsed:current?Math.max(0,Math.min(100,(now-current.start)/(current.end-current.start)*100)):0};
}
