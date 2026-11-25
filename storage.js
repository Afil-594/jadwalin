import {DEFAULT_DATA,DAY_KEYS} from './routine.js';
import {clone,uid,prune} from './tracking.js';
const STORAGE_KEY='daily-routine-data-v1';
export function normalizeData(raw){
 const defaults=clone(DEFAULT_DATA);const data={...defaults,version:2,timeFormat:raw?.timeFormat==='12'?'12':'24',notionUrl:typeof raw?.notionUrl==='string'?raw.notionUrl:defaults.notionUrl,history:{}};
 for(const day of DAY_KEYS){const rows=raw?.schedules?.[day];const seen=new Set();data.schedules[day]=(Array.isArray(rows)?rows:defaults.schedules[day]).filter(a=>Array.isArray(a)&&a.slice(0,3).length===3&&a.slice(0,3).every(x=>typeof x==='string')).map(a=>{let id=typeof a[3]==='string'&&a[3]&&!seen.has(a[3])?a[3]:uid();seen.add(id);return [...a.slice(0,3),id];});const w=raw?.workouts?.[day];if(w&&typeof w==='object')data.workouts[day]={name:typeof w.name==='string'?w.name:'',time:typeof w.time==='string'?w.time:''};}
 for(const [key,record] of Object.entries(raw?.history||{})){if(!/^\d{4}-\d{2}-\d{2}$/.test(key)||!Array.isArray(record?.activities))continue;data.history[key]={activities:record.activities.filter(a=>a&&['id','start','end','title'].every(k=>typeof a[k]==='string')).map(a=>({id:a.id,start:a.start,end:a.end,title:a.title,done:a.done===true}))};}
 prune(data);return data;
}
export function saveData(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
export function loadData(){let raw;try{raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch(e){console.warn('Unable to read saved routines',e);}return normalizeData(raw);}
export function resetData(){return normalizeData(null);}
export function exportData(data){const blob=new Blob([JSON.stringify({app:'Jadwalin',exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`jadwalin-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export async function importData(file){const parsed=JSON.parse(await file.text());const raw=parsed?.data??parsed;if(!raw||!raw.schedules||!raw.workouts||!DAY_KEYS.every(d=>Array.isArray(raw.schedules[d])&&raw.schedules[d].every(a=>Array.isArray(a)&&a.length>=3&&a.slice(0,3).every(x=>typeof x==='string'))))throw Error('Invalid Jadwalin backup.');return normalizeData(raw);}
