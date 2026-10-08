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


/* Pass A: incremental representative-screen foundations.
   This does not change original product flow handlers, chart calculations or transaction detail. */
(function(){
 const name=location.pathname.split("/").pop();
 const kind={ "home.html":"home","transactions.html":"transactions","runway.html":"runway" }[name];
 // Input zoom guard is safe across all copied pages; visual header work is only
 // active on the three representative pages in this pass.
 document.body.classList.add("v2-zoomguard");
 if(!kind)return;
 const railFoot=document.querySelector("#squeebs-v2-rail .v2-foot");
 if(railFoot){
   const comparison=document.createElement("a");
   comparison.href="../approved/"+name;
   comparison.target="_blank";
   comparison.rel="noopener noreferrer";
   comparison.textContent="Compare approved original ↗";
   railFoot.appendChild(document.createElement("div")).appendChild(comparison);
 }
 document.body.classList.add("v2-pass-a");
 document.body.dataset.v2Page=kind;
 const page=document.querySelector(".app");
 const header=page&&page.querySelector(".header, .head");
 if(!header)return;
 const iconPaths={
   eye:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
   sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
   moon:'<path d="M20.8 14A9 9 0 0 1 10 3.2 9 9 0 1 0 20.8 14z"/>'
 };
 function svg(t){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-linecap:round;stroke-linejoin:round">'+iconPaths[t]+"</svg>"}
 function stored(key){try{return sessionStorage.getItem("squeebs-pass-a-"+key)}catch(_){return null}}
 function remember(key,value){try{sessionStorage.setItem("squeebs-pass-a-"+key,value)}catch(_){}}
 const actions=document.createElement("div");actions.className="v2-header-actions";
 const originalActions=header.querySelector(".header-actions, .head-actions, .actions");
 const status=header.querySelector(".status-dot");
 const originalEye=kind==="runway"?header.querySelector("#privacy"):null;
 if(originalEye){originalEye.classList.add("v2-existing-privacy");actions.appendChild(originalEye)}
 else{
   const eye=document.createElement("button");
   eye.type="button";eye.className="v2-tool";eye.id="passAPrivacy";
   eye.innerHTML=svg("eye");
   eye.setAttribute("aria-label","Hide overview figures");eye.setAttribute("aria-pressed","false");
   eye.title="Hide overview figures";actions.appendChild(eye);
 }
 if(status)actions.appendChild(status);
 const menuButton=document.createElement("button");
 menuButton.type="button";menuButton.id="passAMenu";menuButton.className="v2-tool";
 menuButton.setAttribute("aria-label","Open navigation and settings");
 menuButton.setAttribute("aria-expanded","false");
 menuButton.title="Navigation and settings";
 menuButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
 actions.appendChild(menuButton);
 if(originalActions&&originalActions!==header){originalActions.remove()}
 header.appendChild(actions);
 const menu=document.createElement("div");
 menu.id="v2-menu";
 menu.hidden=true;
 menu.innerHTML='<div class="v2-menu-panel" role="dialog" aria-modal="true" aria-label="Navigation and preferences">'+
  '<div class="v2-menu-head"><b>Navigation & settings</b><button type="button" class="v2-menu-close" aria-label="Close menu">×</button></div>'+
  '<div class="v2-menu-label">Dashboard</div><nav class="v2-menu-links" aria-label="Dashboard destinations">'+
   [['home.html','Home'],['transactions.html','Transactions'],['insights.html','Insights'],['planning.html','Planning']].map(([href,label])=>'<a href="'+href+'"'+(href===name?' class="active" aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav>'+
  '<div class="v2-menu-label">Planning</div><nav class="v2-menu-links" aria-label="Planning destinations">'+
   [['planning.html','Cash Forecast'],['runway.html','Runway'],['reserves.html','Reserves'],['scenarios.html','Scenarios'],['afford.html','Can I afford this?']].map(([href,label])=>'<a href="'+href+'"'+(href===name?' class="active" aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav>'+
  '<div class="v2-menu-label">Appearance</div><div class="v2-theme-row"><button type="button" data-v2-theme="dark">Dark</button><button type="button" data-v2-theme="light">Light</button></div>'+
  '<div class="v2-menu-note">This is a reversible mobile navigation experiment. The approved original still uses the bottom navigation.</div></div>';
 document.body.appendChild(menu);
 function openMenu(){menu.hidden=false;menuButton.setAttribute("aria-expanded","true");menu.querySelector(".v2-menu-close").focus();}
 function closeMenu(){if(menu.hidden)return;menu.hidden=true;menuButton.setAttribute("aria-expanded","false");menuButton.focus();}
 menuButton.addEventListener("click",()=>menu.hidden?openMenu():closeMenu());
 menu.addEventListener("click",e=>{if(e.target===menu||e.target.closest(".v2-menu-close"))closeMenu();});
 window.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden)closeMenu();});
 const privacy=originalEye||document.querySelector("#passAPrivacy");
 function syncPrivacy(){
   const on=kind==="runway"?document.body.classList.contains("private"):document.body.classList.contains("v2-privacy");
   privacy.setAttribute("aria-pressed",String(on));
   privacy.setAttribute("aria-label",on?"Reveal overview figures":"Hide overview figures");
   privacy.title=on?"Reveal overview figures":"Hide overview figures";
   remember("privacy",on?"on":"off");
 }
 if(originalEye){
   originalEye.addEventListener("click",syncPrivacy);
   if(stored("privacy")==="on"&&!document.body.classList.contains("private"))originalEye.click();
   else syncPrivacy();
 }else{
   privacy.addEventListener("click",()=>{
     document.body.classList.toggle("v2-privacy");
     syncPrivacy();
   });
   if(stored("privacy")==="on")document.body.classList.add("v2-privacy");
   syncPrivacy();
 }
 function applyTheme(next){
   document.body.dataset.v2Theme=next;
   const light=next==="light";
   menu.querySelectorAll("[data-v2-theme]").forEach(btn=>{
     const selected=btn.dataset.v2Theme===next;
     btn.classList.toggle("active",selected);
     btn.setAttribute("aria-pressed",String(selected));
   });
   remember("theme",next);
 }
 menu.querySelectorAll("[data-v2-theme]").forEach(btn=>btn.addEventListener("click",()=>{
   applyTheme(btn.dataset.v2Theme);
   closeMenu();
 }));
 applyTheme(stored("theme")==="light"?"light":"dark");

 /* Lock the underlying document for any stacked mobile sheet, full-screen
    transaction inspector, or header menu. The topmost panel remains scrollable. */
 let scrollLocked=false,previousScroll=0;
 function hasOverlay(){
   return !menu.hidden||Boolean(document.querySelector(".sheet-backdrop.show, #sheet.open, #inspector.show"));
 }
 function updateScrollLock(){
   const shouldLock=hasOverlay();
   if(shouldLock===scrollLocked)return;
   scrollLocked=shouldLock;
   if(shouldLock){
     previousScroll=window.scrollY||window.pageYOffset||0;
     document.body.style.setProperty("--v2-scroll-top",(-previousScroll)+"px");
     document.body.classList.add("v2-scroll-lock");
     document.documentElement.classList.add("v2-pass-a-lock");
   }else{
     document.body.classList.remove("v2-scroll-lock");
     document.documentElement.classList.remove("v2-pass-a-lock");
     document.body.style.removeProperty("--v2-scroll-top");
     window.scrollTo(0,previousScroll);
   }
 }
 const observer=new MutationObserver(updateScrollLock);
 observer.observe(document.body,{attributes:true,attributeFilter:["class","hidden"],subtree:true});
 updateScrollLock();
})();
