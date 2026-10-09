/* Shared additive navigation only. All original page scripts remain unchanged. */
(function(){
  const pages=[["home.html","Home","⌂"],["transactions.html","Transactions","☷"],["insights.html","Insights","▥"],["planning.html","Planning","▣"]];
  const plans=[["planning.html","Cash Forecast"],["runway.html","Runway"],["reserves.html","Reserves"],["scenarios.html","Scenarios"],["afford.html","Can I afford this?"]];
  const current=location.pathname.split("/").pop().replace(/[?#].*$/,"");
  const isPlanning=plans.some(([f])=>f===current);
  if(current==="insights.html")document.body.classList.add("v2-insights");
  const destination=(index)=>pages[index]?.[0]||"home.html";
  function links(){
    return pages.map(([href,name,icon])=>{
      const selected=href===current||(name==="Planning"&&isPlanning);
      return '<a class="v2-link'+(selected?" active":"")+'" href="'+href+'"'+(selected?' aria-current="page"':'')+'><span class="v2-glyph">'+icon+"</span>"+name+"</a>";
    }).join("");
  }
  const sub=plans.map(([href,name])=>'<a class="v2-link'+(current===href?" active":"")+'" href="'+href+'"'+(current===href?' aria-current="page"':'')+">"+name+"</a>").join("");
  const rail='<aside id="squeebs-v2-rail" aria-label="Squeebs desktop navigation">'+
  '<div class="v2-brand"><div class="v2-mark">S</div><div><div class="v2-name">Squeebs</div><div class="v2-byline">v2 design review</div></div></div>'+
  '<div class="v2-caption">Dashboard</div><nav aria-label="Main sections">'+links()+'</nav>'+
  '<div class="v2-caption">Planning</div><nav class="v2-planning" aria-label="Planning sections">'+sub+'</nav>'+
  '<div class="v2-rule"></div><div class="v2-caption">Administration</div>'+
  '<div class="v2-foot">Approved screens, unchanged<br>Illustrative synthetic data<br>Admin workflows remain in the existing app</div></aside>';
  document.body.insertAdjacentHTML("afterbegin",rail);
  /* Make the legacy mobile nav elements actually traverse the approved screens.
     This changes navigation only, not the underlying screen components. */
  document.querySelectorAll(".bottomnav, .bottom-nav, nav.nav").forEach(nav=>{
    const items=Array.from(nav.querySelectorAll(".navitem, .nav-btn"));
    items.slice(0,4).forEach((el,index)=>{
      const href=destination(index);
      if(el.tagName==="A"){el.setAttribute("href",href);return;}
      el.setAttribute("role","link");
      el.setAttribute("tabindex",el.getAttribute("tabindex")||"0");
      el.setAttribute("aria-label","Go to "+pages[index][1]);
      el.addEventListener("click",e=>{
        e.preventDefault();e.stopImmediatePropagation();
        location.href=href;
      },true);
      el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();location.href=href;}});
    });
  });
})();


/* Pass A complete: one additive, responsive shared header for approved v2 screens.
   Original financial flows, charts and handlers are retained unchanged. */
(function(){
 const filename=location.pathname.split("/").pop();
 const pages={
  "home.html":{type:"home",privacy:null},
  "transactions.html":{type:"transactions",privacy:null},
  "insights.html":{type:"insights",privacy:"new"},
  "planning.html":{type:"planning",privacy:"app-private"},
  "runway.html":{type:"runway",privacy:"body-private"},
  "reserves.html":{type:"reserves",privacy:"body-private"},
  "scenarios.html":{type:"scenarios",privacy:"body-private"},
  "afford.html":{type:"afford",privacy:"body-mask"}
 };
 const config=pages[filename];if(!config)return;
 document.body.classList.add("v2-zoomguard","v2-pass-a");
 document.body.dataset.v2Page=config.type;
 const app=document.querySelector(".app");
 const headers=config.type==="insights"?Array.from(document.querySelectorAll(".topbar")):
  [app?.querySelector(".header, .head")].filter(Boolean);
 if(!headers.length)return;
 const iconPaths={
  eye:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>'
 };
 const svg=t=>'<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-linecap:round;stroke-linejoin:round">'+iconPaths[t]+"</svg>";
 const remembered=k=>{try{return sessionStorage.getItem("squeebs-pass-a-"+k)}catch(e){return null}};
 const save=(k,v)=>{try{sessionStorage.setItem("squeebs-pass-a-"+k,v)}catch(e){}};
 const privacyButtons=[],menuButtons=[];
 const nativePrivacy=(header)=>{
  if(config.privacy==="new"||!config.privacy)return null;
  return header.querySelector("#privacy, #privacyBtn");
 };
 headers.forEach(header=>{
  const oldGroup=header.querySelector(".header-actions, .head-actions, .actions");
  const originalPrivacy=nativePrivacy(header);
  const status=header.querySelector(".status-btn, #statusDot, #dataStatus, #fresh, #status, .status-dot");
  const group=document.createElement("div");group.className="v2-header-actions";
  let eye=originalPrivacy;
  if(!eye){
   eye=document.createElement("button");eye.type="button";eye.className="v2-tool v2-privacy-toggle";
   eye.innerHTML=svg("eye");
  }
  eye.classList.add("v2-privacy-toggle");
  eye.setAttribute("aria-pressed","false");
  group.appendChild(eye);privacyButtons.push(eye);
  if(status)group.appendChild(status);
  const menu=document.createElement("button");
  menu.type="button";menu.className="v2-tool v2-menu-toggle";
  menu.innerHTML=svg("menu");menu.title="Navigation & settings";
  menu.setAttribute("aria-label","Open navigation and settings");
  menu.setAttribute("aria-expanded","false");
  group.appendChild(menu);menuButtons.push(menu);
  oldGroup?.remove();
  header.appendChild(group);
 });
 const readPrivate=()=>{
  if(config.privacy==="app-private")return app.classList.contains("private");
  if(config.privacy==="body-private")return document.body.classList.contains("private");
  if(config.privacy==="body-mask")return document.body.classList.contains("mask");
  return document.body.classList.contains("v2-privacy");
 };
 const reflectPrivate=()=>{
  const on=readPrivate();
  privacyButtons.forEach(btn=>{
   btn.setAttribute("aria-pressed",String(on));
   btn.setAttribute("aria-label",on?"Reveal overview figures":"Hide overview figures");
   btn.title=on?"Reveal overview figures":"Hide overview figures";
  });
  save("privacy",on?"on":"off");
 };
 privacyButtons.forEach(button=>{
  if(config.privacy==="new"||!config.privacy){
   button.addEventListener("click",()=>{document.body.classList.toggle("v2-privacy");reflectPrivate()});
  }else button.addEventListener("click",reflectPrivate);
 });
 if(remembered("privacy")==="on"&&!readPrivate())privacyButtons[0].click();
 else reflectPrivate();
 const menu=document.createElement("div");menu.id="v2-menu";menu.hidden=true;
 const link=(href,label)=>'<a href="'+href+'"'+(href===filename?' class="active" aria-current="page"':'')+'>'+label+'</a>';
 menu.innerHTML='<div class="v2-menu-panel" role="dialog" aria-modal="true" aria-label="Navigation and preferences">'+
  '<div class="v2-menu-head"><b>Navigation & settings</b><button type="button" class="v2-menu-close" aria-label="Close menu">×</button></div>'+
  '<div class="v2-menu-label">Dashboard</div><nav class="v2-menu-links" aria-label="Dashboard navigation">'+
   link("home.html","Home")+link("transactions.html","Transactions")+link("insights.html","Insights")+link("planning.html","Planning")+'</nav>'+
  '<div class="v2-menu-label">Planning</div><nav class="v2-menu-links" aria-label="Planning navigation">'+
   link("planning.html","Cash Forecast")+link("runway.html","Runway")+link("reserves.html","Reserves")+link("scenarios.html","Scenarios")+link("afford.html","Can I afford this?")+'</nav>'+
  '<div class="v2-menu-label">Appearance</div><div class="v2-theme-row"><button type="button" data-v2-theme="dark">Dark</button><button type="button" data-v2-theme="light">Light</button></div>'+
  '<div class="v2-menu-note">Your approved views and calculations are unchanged. Light mode is a design preview.</div></div>';
 document.body.appendChild(menu);
 const openMenu=()=>{menu.hidden=false;menuButtons.forEach(b=>b.setAttribute("aria-expanded","true"));menu.querySelector(".v2-menu-close").focus()};
 const closeMenu=()=>{if(menu.hidden)return;menu.hidden=true;menuButtons.forEach(b=>b.setAttribute("aria-expanded","false"));menuButtons[0].focus()};
 menuButtons.forEach(b=>b.addEventListener("click",()=>menu.hidden?openMenu():closeMenu()));
 menu.addEventListener("click",e=>{if(e.target===menu||e.target.closest(".v2-menu-close"))closeMenu()});
 window.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
 const setTheme=theme=>{
  document.body.dataset.v2Theme=theme;
  menu.querySelectorAll("[data-v2-theme]").forEach(b=>{
   const on=b.dataset.v2Theme===theme;
   b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));
  });
  save("theme",theme);
 };
 menu.querySelectorAll("[data-v2-theme]").forEach(b=>b.addEventListener("click",()=>{setTheme(b.dataset.v2Theme);closeMenu()}));
 setTheme(remembered("theme")==="light"?"light":"dark");
 const railFoot=document.querySelector("#squeebs-v2-rail .v2-foot");
 if(railFoot){
  const line=document.createElement("div"),a=document.createElement("a");
  a.href="../pass-a/"+filename;a.target="_blank";a.rel="noopener noreferrer";
  a.textContent="Compare prior Pass A ↗";line.appendChild(a);railFoot.appendChild(line);
 }
 let locked=false,scroll=0;
 const hasOverlay=()=>!menu.hidden||Boolean(document.querySelector(
  ".sheet-backdrop.show, .sheet-backdrop.open, #sheet.open, #sheetbg.show, #sheetbg.open, #modal.open, #inspector.show"
 ));
 const syncScroll=()=>{
  const next=hasOverlay();if(next===locked)return;
  locked=next;
  if(next){
   scroll=window.scrollY||window.pageYOffset||0;
   document.body.style.setProperty("--v2-scroll-top",-scroll+"px");
   document.body.classList.add("v2-scroll-lock");
   document.documentElement.classList.add("v2-pass-a-lock");
  }else{
   document.body.classList.remove("v2-scroll-lock");
   document.documentElement.classList.remove("v2-pass-a-lock");
   document.body.style.removeProperty("--v2-scroll-top");
   window.scrollTo(0,scroll);
  }
 };
 const observer=new MutationObserver(syncScroll);
 observer.observe(document.body,{attributes:true,attributeFilter:["class","hidden"],subtree:true});
 syncScroll();
})();