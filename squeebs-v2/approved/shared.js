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
