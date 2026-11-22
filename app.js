(function(){
var $=function(i){return document.getElementById(i)};
var KEY="duitku-v1";
var POTS=[{k:"needs",n:"Needs",t:"s"},{k:"wants",n:"Wants",t:"s"},{k:"emerg",n:"Emergency Fund",t:"v"},{k:"inv",n:"Investment",t:"v"}];
var CATS=["Food","Transport","Bills","Shopping","Entertainment","Health","Other"];
var IC={
needs:'<path fill="#a3e635" d="M12 2.5 1.5 12H5v9.5h5.5V15h3v6.5H19V12h3.5z"/>',
wants:'<path fill="#e11d1d" d="M12 8C9 3.5 5 4.5 5.5 6.5S9.5 9 12 8zm0 0c3-4.5 7-3.5 6.5-1.5S14.5 9 12 8z"/><rect x="2.5" y="8" width="19" height="4" rx="1" fill="#e11d1d"/><rect x="4" y="12.5" width="16" height="9" rx="1" fill="#e11d1d"/><rect x="11" y="8" width="2" height="13.5" fill="#1a1a1a"/>',
emerg:'<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" stroke="#ff5a1f" stroke-width="4.2" stroke-linecap="round" fill="none"/>',
inv:'<ellipse cx="11.5" cy="13" rx="8" ry="6" fill="#ff8fd0"/><path d="M15 8l2.5-3.5 1 4.5z" fill="#ff8fd0"/><ellipse cx="20" cy="13.5" rx="2.2" ry="2" fill="#ff8fd0"/><rect x="6.5" y="17" width="3" height="4" rx="1" fill="#ff8fd0"/><rect x="13" y="17" width="3" height="4" rx="1" fill="#ff8fd0"/><rect x="8" y="8.2" width="5" height="1.3" rx=".6" fill="#1a1a1a"/><circle cx="16" cy="11.5" r=".9" fill="#1a1a1a"/>'};
function tile(k,s){var i=Math.round(s*.6);return '<span class="tile" style="width:'+s+'px;height:'+s+'px"><svg width="'+i+'" height="'+i+'" viewBox="0 0 24 24" aria-hidden="true">'+IC[k]+'</svg></span>'}
function today(){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
var S={income:0,pct:{needs:50,wants:30,emerg:10,inv:10},tx:[],month:today().slice(0,7)};
var D={pot:"needs",amt:0,open:""};
try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);S.income=o.income||0;if(o.pct)S.pct=o.pct;S.tx=o.tx||[];}}catch(e){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({income:S.income,pct:S.pct,tx:S.tx}));}catch(e){}}
function num(v){return parseInt(String(v).replace(/\D/g,""),10)||0}
function fmt(n){return Math.abs(Math.round(n)).toLocaleString("id-ID")}
function rp(n){return (n<0?"-":"")+"Rp. "+fmt(n)}
function fmtIn(el){var n=num(el.value);el.value=n?n.toLocaleString("id-ID"):""}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function potOf(k){return POTS.filter(function(p){return p.k===k})[0]||POTS[0]}
function mtx(){return S.tx.filter(function(t){return t.date.slice(0,7)===S.month})}
function dim(){var p=S.month.split("-");return new Date(+p[0],+p[1],0).getDate()}
function mlabel(){var p=S.month.split("-");return new Date(+p[0],+p[1]-1,1).toLocaleDateString("en-US",{month:"long",year:"numeric"})}
function shift(d){var p=S.month.split("-"),x=new Date(+p[0],+p[1]-1+d,1);S.month=x.getFullYear()+"-"+("0"+(x.getMonth()+1)).slice(-2)}
function toast(t){var e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("show")},1700)}

function upd(){
var tx=mtx(),u={},tot=0,sp=0,now=0,td=today();
POTS.forEach(function(p){u[p.k]=0});
tx.forEach(function(t){u[t.pot]=(u[t.pot]||0)+t.amount;tot+=t.amount;if(potOf(t.pot).t==="s"){sp+=t.amount;if(t.date===td)now+=t.amount}});
var inc=S.income;
$("bal").textContent=(inc||tot)?rp(inc-tot):"Rp. 000.0";
if(!inc)$("hint").textContent="Set your monthly income to start.";
else{var left=Math.max(1,dim()-new Date().getDate()+1),bud=inc*((+S.pct.needs||0)+(+S.pct.wants||0))/100,lim=Math.max(0,(bud-(sp-now))/left);
$("hint").textContent="Today -"+rp(now)+"  ·  Limit "+rp(lim)+"/day"}
var h="";
POTS.forEach(function(p){
var al=inc*(+S.pct[p.k]||0)/100,us=u[p.k],pc=al>0?Math.min(100,us/al*100):0,over=p.t==="s"&&al>0&&us>al,msg;
if(over)msg="Over "+rp(us-al);else if(p.t==="v"&&al>0&&us>=al)msg="Goal reached ✓";else msg="Remains "+rp(Math.max(0,al-us));
h+='<div class="pot'+(over?' over':'')+'" data-add="'+p.k+'">'+tile(p.k,64)+'<div class="pm"><b>'+p.n+'</b><div class="trk"><i style="width:'+pc+'%"></i><u style="left:'+pc+'%"></u></div><small>'+msg+'</small></div></div>'});
$("pots").innerHTML=h}

function addSheet(){
var h='<div class="grab"></div><h3>Add transaction</h3><label for="amt">Amount (Rp.)</label><input id="amt" type="text" inputmode="numeric" placeholder="0" autocomplete="off" value="'+(D.amt?D.amt.toLocaleString("id-ID"):'')+'"><label>Pot</label><div class="pp">';
POTS.forEach(function(p){h+='<button class="pc'+(D.pot===p.k?' on':'')+'" data-pot="'+p.k+'">'+tile(p.k,40)+'<span>'+p.n+'</span></button>'});
h+='</div><div id="cw" style="display:'+(potOf(D.pot).t==="s"?'block':'none')+'"><label for="cat">Category</label><select id="cat">';
CATS.forEach(function(c){h+='<option>'+c+'</option>'});
return h+'</select></div><label for="note">Note (optional)</label><input id="note" type="text" maxlength="60" placeholder="e.g. lunch"><label for="dt">Date</label><input id="dt" type="date" value="'+today()+'"><button class="save" id="save">Save</button>'}

function allocSheet(){
var h='<div class="grab"></div><h3>Allocation</h3><p class="sumline" style="margin:0 0 14px">Split your income across 4 pots.</p>';
POTS.forEach(function(p){h+='<div class="ar">'+tile(p.k,40)+'<span class="n">'+p.n+'</span><input type="number" inputmode="decimal" min="0" max="100" data-pct="'+p.k+'" value="'+S.pct[p.k]+'"><span>%</span></div>'});
return h+'<div class="sumline" id="psum"></div><button class="save" data-close="1">Done</button>'}
function psum(){var s=0;POTS.forEach(function(p){s+=+S.pct[p.k]||0});var e=$("psum");if(e)e.innerHTML='Total <b>'+s+'%</b>'+(s===100?' ✓':' · should be 100%')}

function reportSheet(){
var tx=mtx().sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:b.id-a.id});
var h='<div class="grab"></div><div class="mnav"><button data-m="-1" aria-label="Previous month">‹</button><b>'+mlabel()+'</b><button data-m="1" aria-label="Next month">›</button></div>';
if(!tx.length)return h+'<p class="empty">No transactions this month.</p>';
var dt={},cats={},ct=0,mx=0,sum=0,n=dim(),i,v;
tx.forEach(function(t){if(potOf(t.pot).t==="s"){dt[t.date]=(dt[t.date]||0)+t.amount;var c=t.cat||"Other";cats[c]=(cats[c]||0)+t.amount;ct+=t.amount}});
for(i=1;i<=n;i++){v=dt[S.month+"-"+("0"+i).slice(-2)]||0;sum+=v;if(v>mx)mx=v}
if(mx>0){h+='<h4>Daily spending</h4><div class="dchart">';
for(i=1;i<=n;i++){v=dt[S.month+"-"+("0"+i).slice(-2)]||0;h+='<div class="dc"><i class="'+(v>0?'':'z')+'" style="height:'+(v>0?Math.max(3,Math.round(v/mx*90)):2)+'px"></i><span>'+(i===1||i%5===0?i:'')+'</span></div>'}
h+='</div><div class="dstat"><span>Average <b>'+rp(sum/n)+'</b></span><span>Highest <b>'+rp(mx)+'</b></span></div>';
h+='<h4>By category</h4>';
Object.keys(cats).sort(function(a,b){return cats[b]-cats[a]}).forEach(function(k){h+='<div class="cat"><span>'+esc(k)+'</span><div class="bar"><i style="width:'+(cats[k]/ct*100)+'%"></i></div><span>'+rp(cats[k])+'</span></div>'})}
h+='<h4>Transactions</h4>';
var last="";
tx.forEach(function(t){
if(t.date!==last){last=t.date;h+='<div class="day"><span>'+new Date(t.date+"T00:00").toLocaleDateString("en-US",{weekday:"short",day:"numeric",month:"short"})+'</span><span>'+(dt[t.date]?'Spent '+rp(dt[t.date]):'')+'</span></div>'}
var p=potOf(t.pot),sp=p.t==="s";
h+='<div class="tx">'+tile(t.pot,34)+'<div class="m"><b>'+esc(t.note||t.cat||p.n)+'</b><small>'+p.n+(t.cat?' · '+esc(t.cat):'')+'</small></div><div class="a">'+(sp?'-':'+')+rp(t.amount)+'</div><button data-del="'+t.id+'" aria-label="Delete">✕</button></div>'});
return h}

function open(type,pot){
if(pot)D.pot=pot;
D.open=type;
var s=$("sheet");
s.innerHTML=type==="add"?addSheet():type==="alloc"?allocSheet():reportSheet();
if(type==="alloc")psum();
s.scrollTop=0;$("ov").classList.add("on");s.classList.add("on");
if(type==="add")setTimeout(function(){var a=$("amt");if(a&&!D.amt)a.focus()},320)}
function close(){
$("ov").classList.remove("on");$("sheet").classList.remove("on");
S.month=today().slice(0,7);D.open="";upd()}

document.addEventListener("input",function(e){
var t=e.target;
if(t.id==="inc"){fmtIn(t);S.income=num(t.value);persist();upd()}
else if(t.id==="daily"||t.id==="amt"){fmtIn(t)}
else if(t.hasAttribute&&t.hasAttribute("data-pct")){S.pct[t.getAttribute("data-pct")]=Math.max(0,Math.min(100,parseFloat(t.value)||0));persist();psum();upd()}
});
function quick(){
var a=num($("daily").value);
if(!a){toast("Type an amount first");return}
D.amt=a;$("daily").value="";open("add",D.pot)}
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.id==="daily")quick()});
document.addEventListener("click",function(e){
if(e.target.id==="ov"){close();return}
var b=e.target.closest("button,[data-add]");if(!b)return;
var d;
if(b.id==="go")quick();
else if((d=b.getAttribute("data-add"))){D.amt=0;open("add",d)}
else if((d=b.getAttribute("data-open")))open(d);
else if(b.getAttribute("data-close"))close();
else if((d=b.getAttribute("data-m"))){shift(+d);$("sheet").innerHTML=reportSheet()}
else if((d=b.getAttribute("data-pot"))){D.pot=d;document.querySelectorAll(".pc").forEach(function(c){c.classList.toggle("on",c===b)});$("cw").style.display=potOf(d).t==="s"?"block":"none"}
else if((d=b.getAttribute("data-del"))){S.tx=S.tx.filter(function(t){return String(t.id)!==d});persist();$("sheet").innerHTML=reportSheet();upd()}
else if(b.id==="save"){
var amt=num($("amt").value);
if(!amt){toast("Enter an amount");return}
var sp=potOf(D.pot).t==="s",dt=$("dt").value||today();
S.tx.push({id:Date.now(),date:dt,amount:amt,pot:D.pot,cat:sp?$("cat").value:"",note:$("note").value.trim().slice(0,60)});
persist();D.amt=0;close();toast("Saved ✓")}
});
if(S.income){$("inc").value=S.income.toLocaleString("id-ID")}
upd();
})();
