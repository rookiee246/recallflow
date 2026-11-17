const DB="recallflow-v1", STORE="topics";
let db, topics=[], intervals=[1,2,4,7,14,30], notifiedKey="";
const $=id=>document.getElementById(id);
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const dateAt=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const fmt=s=>new Date(s+"T12:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:"id"});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function all(){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function put(x){return new Promise((resolve,reject)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).put(x);r.onsuccess=resolve;r.onerror=()=>reject(r.error)})}
function remove(id){return new Promise((resolve,reject)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).delete(id);r.onsuccess=resolve;r.onerror=()=>reject(r.error)})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function schedule(t){return intervals.map(day=>({day,date:dateAt(t.studyDate,day-1),done:!!t.done?.[day]}))}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2400)}
function dueItems(){const now=today(),out=[];for(const t of topics)for(const r of schedule(t)){if(r.date<=now&&!r.done)out.push({t,r})}return out.sort((a,b)=>a.r.date.localeCompare(b.r.date)||a.t.topic.localeCompare(b.t.topic))}
function render(){
 const now=today(),due=dueItems(),done=topics.reduce((n,t)=>n+schedule(t).filter(r=>r.date===now&&r.done).length,0);
 $("dueCount").textContent=due.length;$("activeCount").textContent=topics.length;$("doneCount").textContent=done;
 $("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"}).toUpperCase();
 $("topicTotal").textContent=`${topics.length} topic${topics.length===1?"":"s"}`;
 $("dueList").innerHTML=due.length?due.map(({t,r})=>`<article class="card"><div class="cardtop"><div><h3>${esc(t.topic)}</h3><div class="meta">${esc(t.subject)} · ${r.date<now?"Originally due "+fmt(r.date):"Due today"} · Day ${r.day}</div></div><span class="pill ${r.date<now?"late":""}">${r.date<now?"Overdue":"Due"}</span></div>${t.note?`<p class="meta">${esc(t.note)}</p>`:""}<div class="actions"><button class="smallbtn done" data-action="complete" data-id="${t.id}" data-day="${r.day}">Mark revised ✓</button><button class="smallbtn" data-action="view" data-id="${t.id}">Details</button></div></article>`).join(""):`<div class="empty">You're all caught up for today.<br>Add something you studied to start its revision cycle.</div>`;
 $("topicList").innerHTML=topics.length?topics.slice().sort((a,b)=>b.studyDate.localeCompare(a.studyDate)).map(t=>{const rs=schedule(t),completed=rs.filter(x=>x.done).length;return `<article class="card"><div class="cardtop"><div><h3>${esc(t.topic)}</h3><div class="meta">${esc(t.subject)} · Studied ${fmt(t.studyDate)}</div></div><span class="pill">${completed}/${rs.length} revised</span></div><div class="meta">Next: ${rs.find(x=>!x.done)?.date?fmt(rs.find(x=>!x.done).date):"Cycle complete"}</div><div class="actions"><button class="smallbtn" data-action="view" data-id="${t.id}">Revision dates</button><button class="smallbtn" data-action="delete" data-id="${t.id}">Delete</button></div></article>`}).join(""):`<div class="empty">No topics yet. Add your first study session above.</div>`;
}
function showDetails(t){const rs=schedule(t);alert(`${t.topic} · ${t.subject}\nStudied: ${fmt(t.studyDate)}\n\n`+rs.map(r=>`Day ${r.day} · ${fmt(r.date)} · ${r.done?"Completed":r.date<today()?"Overdue":r.date===today()?"Due today":"Upcoming"}`).join("\n")+(t.note?`\n\nNote: ${t.note}`:""))}
async function init(){
 db=await openDB();topics=await all();$("studyDate").value=today();
 try{const saved=JSON.parse(localStorage.getItem("rf-intervals"));if(Array.isArray(saved)&&saved.length)intervals=saved}catch{}
 $("intervals").value=intervals.join(", ");render();
 if("serviceWorker" in navigator && location.protocol!=="file:")navigator.serviceWorker.register("sw.js").catch(()=>{});
 // If the app is open at the reminder check, show a local notification once per day.
 const due=dueItems();if(due.length&&Notification.permission==="granted"&&localStorage.getItem("rf-notified")!==today()){new Notification("RecallFlow: revisions due",{body:`You have ${due.length} revision${due.length===1?"":"s"} waiting.`});localStorage.setItem("rf-notified",today())}
}
$("studyForm").addEventListener("submit",async e=>{e.preventDefault();const t={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),topic:$("topic").value.trim(),subject:$("subject").value,studyDate:$("studyDate").value,note:$("note").value.trim(),done:{},createdAt:new Date().toISOString()};if(!t.topic||!t.studyDate)return;await put(t);topics=await all();$("topic").value="";$("note").value="";$("studyDate").value=today();render();toast("Added. Your revision dates are ready.")});
document.addEventListener("click",async e=>{const b=e.target.closest("[data-action]");if(!b)return;const t=topics.find(x=>x.id===b.dataset.id);if(!t)return;if(b.dataset.action==="complete"){t.done=t.done||{};t.done[b.dataset.day]=true;await put(t);topics=await all();render();toast("Revision marked complete.")}else if(b.dataset.action==="view")showDetails(t);else if(b.dataset.action==="delete"&&confirm(`Delete "${t.topic}" and its revision history?`)){await remove(t.id);topics=await all();render();toast("Topic deleted.")}});
$("settingsOpen").onclick=()=>$("settingsDialog").showModal();
$("saveSettings").onclick=async()=>{const vals=$("intervals").value.split(",").map(x=>Number(x.trim()));if(!vals.length||vals.some(x=>!Number.isInteger(x)||x<1)||new Set(vals).size!==vals.length){toast("Use unique positive whole numbers, separated by commas.");return}intervals=vals.sort((a,b)=>a-b);localStorage.setItem("rf-intervals",JSON.stringify(intervals));$("intervals").value=intervals.join(", ");render();toast("Revision cycle saved.");};
$("notifyBtn").onclick=async()=>{if(!("Notification"in window)){$("notifyStatus").textContent="Notifications are not supported in this browser.";return}const p=await Notification.requestPermission();$("notifyStatus").textContent=p==="granted"?"Notifications enabled. Open RecallFlow to check and notify you about due revisions.":"Notification permission was not granted."};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({app:"RecallFlow",version:1,intervals,topics},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`recallflow-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href)};
$("importFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data.topics))throw Error();if(!confirm(`Import ${data.topics.length} topics? Matching IDs will be replaced.`))return;for(const t of data.topics)if(t.id&&t.topic&&t.studyDate)await put(t);if(Array.isArray(data.intervals)){intervals=data.intervals;localStorage.setItem("rf-intervals",JSON.stringify(intervals));$("intervals").value=intervals.join(", ")}topics=await all();render();toast("Backup imported.")}catch{toast("That backup file could not be read.")}e.target.value=""};
$("allTopicsBtn").onclick=()=>$("topicList").scrollIntoView({behavior:"smooth"});
init().catch(err=>{console.error(err);toast("Could not start local database. Try refreshing.")});
