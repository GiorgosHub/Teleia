(function(){
var d=document,rm=matchMedia('(prefers-reduced-motion:reduce)').matches,$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
/* logo / "to top" links: always scroll to the very top, smoothly */
d.addEventListener('click',function(e){var l=e.target.closest&&e.target.closest('a[href="#top"]');if(!l)return;
 e.preventDefault();e.stopPropagation();scrollTo({top:0,behavior:rm?'auto':'smooth'});history.replaceState(null,'',location.pathname+location.search)},true);
/* scroll progress */
var bar=d.querySelector('.progress');
function sp(){var h=d.documentElement;bar.style.transform='scaleX('+(h.scrollTop/(h.scrollHeight-h.clientHeight||1))+')'}
addEventListener('scroll',sp,{passive:true});sp();
/* reveal with stagger */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
$('.facts li,.svc article,.proj,.person,.milestones li,.tools li,.sec-head,.form,.cta h2').forEach(function(el,i){el.classList.add('rv');el.style.setProperty('--d',(i%4)*.08+'s');io.observe(el)});
/* count-up */
$('.facts b').forEach(function(b){var n=parseInt(b.textContent,10);if(isNaN(n)||String(n)!==b.textContent.trim())return;
 new IntersectionObserver(function(e,o){if(!e[0].isIntersecting)return;o.disconnect();var t0=performance.now();
 (function f(t){var p=Math.min((t-t0)/1200,1);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}).observe(b)});
if(rm)return;
/* cursor, blobs parallax, tilt */
var c=d.querySelector('.cur'),bl=$('.blobs i'),mx=0,my=0,cx=0,cy=0;
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;
 bl.forEach(function(b,i){b.style.transform='translate('+((e.clientX/innerWidth-.5)*(i?-60:60))+'px,'+((e.clientY/innerHeight-.5)*40)+'px)'})});
(function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;c.style.transform='translate('+(cx-17)+'px,'+(cy-17)+'px)';requestAnimationFrame(loop)})();
d.addEventListener('mouseover',function(e){c.classList.toggle('big',!!e.target.closest('a,button,.proj-pic,.tools li'))});
$('.proj-pic').forEach(function(p){
 p.addEventListener('mousemove',function(e){var r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;p.style.transform='perspective(900px) rotateY('+x*10+'deg) rotateX('+-y*10+'deg)'});
 p.addEventListener('mouseleave',function(){p.style.transform=''})});
/* magnetic buttons + confetti */
$('.btn').forEach(function(b){
 b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=(e.clientX-r.left-r.width/2)*.2+'px '+(e.clientY-r.top-r.height/2)*.3+'px'});
 b.addEventListener('mouseleave',function(){b.style.translate=''});
 b.addEventListener('click',function(e){var cols=['#B5172B','#FFC93C','#1FC16B','#111'];
  for(var i=0;i<22;i++){var s=d.createElement('i');s.className='conf';s.style.background=cols[i%4];s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';d.body.appendChild(s);
   var a=Math.random()*6.28,v=80+Math.random()*120;
   s.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+Math.cos(a)*v+'px,'+(Math.sin(a)*v+90)+'px) rotate('+Math.random()*720+'deg)',opacity:0}],{duration:900,easing:'ease-out'}).onfinish=function(){this.effect.target.remove()}}})});
})();
