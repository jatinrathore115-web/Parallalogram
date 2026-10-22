// Lanternfish Parade transition. Keeps the original lesson card artwork and underwater scene.
(function(){
const W=1672,H=941,SCALE=1920/W,TAU=Math.PI*2,CARD={x:836,y:466,w:1604,h:888,radius:60,stroke:4.5}; // the coral cove's rounded frame
const COVE=new Image();COVE.src='assets/images/coral-cove.webp'; // the scene the lesson plays on (fills the page)
const reduced=!!(matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
  function cardPrint(ctx) {
    const w = CARD.w, h = CARD.h, L = -w / 2, R = w / 2, B = h / 2;
    const ink = 'rgba(43, 123, 214, 0.18)', soft = 'rgba(43, 123, 214, 0.11)', wash = 'rgba(43, 123, 214, 0.07)';
    const FLOOR = 318, CREST = 190;
    ctx.save();
    ctx.beginPath(); ctx.roundRect(L + 5, -B + 5, w - 10, h - 10, CARD.radius - 4); ctx.clip();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(L - 10, B + 20); ctx.lineTo(L - 10, FLOOR);
    ctx.bezierCurveTo(L + 70, FLOOR, L + 90, CREST, L + 215, CREST);
    ctx.bezierCurveTo(L + 340, CREST, L + 360, FLOOR, L + 440, FLOOR);
    ctx.bezierCurveTo(L + 680, FLOOR, L + 760, FLOOR + 9, L + 940, FLOOR + 9);
    ctx.bezierCurveTo(L + 1120, FLOOR + 9, L + 1200, FLOOR, R + 10, FLOOR);
    ctx.lineTo(R + 10, B + 20); ctx.closePath();
    ctx.fillStyle = wash; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.stroke();
    const kelp = (x, base, height, dir, leaves) => {
      const p = [[x, base], [x + 24 * dir, base - height * 0.35], [x - 16 * dir, base - height * 0.7], [x + 8 * dir, base - height]];
      const at = (t) => { const u = 1 - t, k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]; return [0, 1].map((i) => k[0] * p[0][i] + k[1] * p[1][i] + k[2] * p[2][i] + k[3] * p[3][i]); };
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
      ctx.lineWidth = 3.5; ctx.strokeStyle = ink; ctx.stroke();
      ctx.fillStyle = soft;
      for (let i = 0; i < leaves; i += 1) {
        const t = 0.9 - i * 0.2, side = i % 2 ? -dir : dir, a0 = at(t), a1 = at(t + 0.04);
        const a = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]) + side * 0.8;
        ctx.beginPath(); ctx.ellipse(a0[0] + Math.cos(a) * 12, a0[1] + Math.sin(a) * 12, 13, 5.5, a, 0, TAU); ctx.fill();
      }
    };
    kelp(L + 40, 299, 150, 1, 4); kelp(L + 70, 271, 84, -1, 3); kelp(R - 40, FLOOR, 160, 1, 4);
    const trail = (x, y0, n, dir) => {
      for (let i = 0, y = y0; i < n; i += 1, y -= 52 + i * 8) {
        const rad = 4 + i * 1.3, bx = x + Math.sin(i * 1.9) * 9 * dir;
        ctx.beginPath(); ctx.arc(bx, y, rad, 0, TAU); ctx.lineWidth = 2.5; ctx.strokeStyle = ink; ctx.stroke();
        ctx.beginPath(); ctx.arc(bx - rad * 0.35, y - rad * 0.35, rad * 0.24, 0, TAU); ctx.fillStyle = ink; ctx.fill();
      }
    };
    trail(L + 46, 120, 7, 1); trail(R - 36, 130, 7, -1);
    const fish = (x, y, dir, k) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * k, k);
      ctx.beginPath(); ctx.ellipse(0, 0, 26, 12, 0, 0, TAU); ctx.moveTo(-22, 0); ctx.lineTo(-40, -13); ctx.lineTo(-40, 13); ctx.closePath();
      ctx.fillStyle = ink; ctx.fill();
      ctx.beginPath(); ctx.arc(12, -3, 2.8, 0, TAU); ctx.fillStyle = 'rgba(255, 248, 232, 0.95)'; ctx.fill();
      ctx.restore();
    };
    fish(L + 340, -262, 1, 1.25); fish(L + 236, -318, 1, 0.95); fish(L + 222, -222, 1, 0.72); fish(R - 150, -342, -1, 0.9);
    ctx.restore();
  }
  // the card (shadow, cream face, dark edge, print) drawn once at full size, in screen pixels
  let cardImg = null;
  function cardSprite() {
    if (cardImg) return cardImg;
    const pad = 20, c = document.createElement('canvas');
    c.width = Math.ceil((CARD.w + 2 * pad) * SCALE); c.height = Math.ceil((CARD.h + 2 * pad + 10) * SCALE);
    const x = c.getContext('2d');
    x.scale(SCALE, SCALE); x.translate(CARD.w / 2 + pad, CARD.h / 2 + pad);
    x.lineJoin = 'round'; x.lineCap = 'round';
    x.beginPath(); x.roundRect(-CARD.w / 2, -CARD.h / 2, CARD.w, CARD.h, CARD.radius);
    x.fillStyle = 'rgba(0, 20, 60, 0.22)'; x.save(); x.translate(0, 9); x.fill(); x.restore();
    x.fillStyle = '#fff8e8'; x.fill();
    x.lineWidth = CARD.stroke; x.strokeStyle = '#3b1d00'; x.stroke();
    cardPrint(x);
    cardImg = { c: c, pad: pad };
    return cardImg;
  }

let sprite=null,scene=null,curtain=null,raf=0,active=false,doneOnce=false,startAt=0,complete=null,soundTimers=[];
const ctxs=()=>{if(!scene||!scene.isConnected)scene=document.querySelector('.op-scene');if(!curtain||!curtain.isConnected)curtain=document.querySelector('.op-curtain');return [scene&&scene.getContext('2d'),curtain&&curtain.getContext('2d')];};
function cardSprite(){return COVE.complete&&COVE.naturalWidth?{c:COVE}:null;}
function oldCardSprite(){if(sprite)return sprite;const pad=20,c=document.createElement('canvas');c.width=Math.ceil((CARD.w+pad*2)*SCALE);c.height=Math.ceil((CARD.h+pad*2+10)*SCALE);const x=c.getContext('2d');x.scale(SCALE,SCALE);x.translate(CARD.w/2+pad,CARD.h/2+pad);x.lineJoin='round';x.lineCap='round';x.beginPath();x.roundRect(-CARD.w/2,-CARD.h/2,CARD.w,CARD.h,CARD.radius);x.fillStyle='rgba(0,20,60,.22)';x.save();x.translate(0,9);x.fill();x.restore();x.fillStyle='#fff8e8';x.fill();x.lineWidth=CARD.stroke;x.strokeStyle='#3b1d00';x.stroke();cardPrint(x);return sprite={c,pad};}
const fish=Array.from({length:10},(_,i)=>({i,h:['#73f4ff','#75ffe0','#b5fff1','#ffe7a3'][i%4],s:.8+(i%4)*.1,p:i*.61}));
const dust=Array.from({length:24},(_,i)=>({x:i*239%W,y:i*173%H,r:1.2+i%3*.55,p:i*1.7}));
function point(u){const x0=CARD.x-CARD.w/2+34,x1=CARD.x+CARD.w/2-34,y0=CARD.y-CARD.h/2+34,y1=CARD.y+CARD.h/2-34,r=46,sw=x1-x0-2*r,sh=y1-y0-2*r,arc=Math.PI*r/2,total=2*sw+2*sh+4*arc;let d=((u%1)+1)%1*total;if(d<sw)return[x0+r+d,y0];d-=sw;if(d<arc){let a=-Math.PI/2+d/r;return[x1-r+Math.cos(a)*r,y0+r+Math.sin(a)*r];}d-=arc;if(d<sh)return[x1,y0+r+d];d-=sh;if(d<arc){let a=d/r;return[x1-r+Math.cos(a)*r,y1-r+Math.sin(a)*r];}d-=arc;if(d<sw)return[x1-r-d,y1];d-=sw;if(d<arc){let a=Math.PI/2+d/r;return[x0+r+Math.cos(a)*r,y1-r+Math.sin(a)*r];}d-=arc;if(d<sh)return[x0,y1-r-d];d-=sh;let a=Math.PI+d/r;return[x0+r+Math.cos(a)*r,y0+r+Math.sin(a)*r];}
function drawFish(c,f,x,y,a,alpha,t){c.save();c.translate(x,y+Math.sin(t*3+f.p)*3);c.rotate(a);c.scale(f.s,f.s);c.globalAlpha=alpha;c.shadowColor=f.h;c.shadowBlur=16;c.fillStyle=f.h;let wag=Math.sin(t*12+f.p)*4;c.beginPath();c.moveTo(-14,0);c.lineTo(-28,-10+wag);c.lineTo(-26,0);c.lineTo(-28,10+wag);c.closePath();c.fill();let g=c.createRadialGradient(2,-3,1,0,0,19);g.addColorStop(0,'#fff');g.addColorStop(.3,f.h);g.addColorStop(1,'rgba(40,180,210,.35)');c.fillStyle=g;c.beginPath();c.ellipse(0,0,18,10,0,0,TAU);c.fill();c.shadowBlur=0;c.fillStyle='#123b50';c.beginPath();c.arc(10,-2,1.7,0,TAU);c.fill();c.restore();}
function draw(now){if(!active)return;const [a,b]=ctxs();if(!a||!b)return;const duration=reduced?1.1:5.2,sec=Math.min(duration,(now-startAt)/1000)*(5.2/duration),t=sec/5.2;a.setTransform(1,0,0,1,0,0);a.clearRect(0,0,scene.width,scene.height);a.setTransform(SCALE,0,0,SCALE,0,0);b.setTransform(1,0,0,1,0,0);b.clearRect(0,0,curtain.width,curtain.height);b.setTransform(SCALE,0,0,SCALE,0,0);
const dim=ease(sec/.6)*(1-ease((sec-4.2)/.8));a.fillStyle='rgba(5,24,54,'+(.24*dim)+')';a.fillRect(0,0,W,H);a.save();a.globalCompositeOperation='screen';for(let i=0;i<3;i++){let x=230+i*590+Math.sin(sec*.45+i)*28,g=a.createLinearGradient(x,0,x+170,H*.8);g.addColorStop(0,'rgba(145,235,255,'+(.06*dim)+')');g.addColorStop(1,'rgba(145,235,255,0)');a.fillStyle=g;a.beginPath();a.moveTo(x-35,0);a.lineTo(x+35,0);a.lineTo(x+200,H*.8);a.lineTo(x+55,H*.8);a.fill();}dust.forEach(p=>{a.globalAlpha=(.14+.12*Math.sin(sec+p.p))*dim;a.fillStyle='#c8faff';a.beginPath();a.arc(p.x+Math.sin(sec+p.p)*5,(p.y-sec*14+H)%H,p.r,0,TAU);a.fill();});a.restore();
const enter=ease((sec-.6)/1.2),leave=ease((sec-4)/.8);fish.forEach((f,i)=>{const q=point((i+.5)/fish.length),side=i%4,ox=side===0?-230:side===1?210:side===2?150:-190,oy=side===0?-180:side===1?-70:side===2?160:100,u=ease((sec-.55-i*.035)/1.1);let x,y;if(sec<1.8){const t0=1-u,cx=(W-q[0])*.5+q[0]-.35*ox,cy=(H-q[1])*.5+q[1]-.35*oy;x=t0*t0*(q[0]+ox*2.5)+2*t0*u*cx+u*u*q[0];y=t0*t0*(q[1]+oy*2.5)+2*t0*u*cy+u*u*q[1];}else{x=q[0]+ox*2.4*leave;y=q[1]+oy*2.4*leave;}const alpha=Math.min(1,enter*(1-leave)*.95);const angle=Math.atan2(oy,ox);a.save();a.globalCompositeOperation='lighter';a.globalAlpha=alpha*.46;a.strokeStyle=f.h;a.lineWidth=2.4;a.shadowColor=f.h;a.shadowBlur=12;a.beginPath();a.moveTo(x-Math.cos(angle)*36,y-Math.sin(angle)*36);a.quadraticCurveTo(x-Math.cos(angle)*16+7,y-Math.sin(angle)*16-8,x,y);a.stroke();a.restore();drawFish(a,f,x,y,angle,alpha,sec);});
const progress=Math.max(0,Math.min(1,(sec-1.8)/1.2));if(progress){a.save();a.globalCompositeOperation='lighter';a.lineWidth=3.4;a.lineCap='round';a.strokeStyle='rgba(106,250,239,'+(.8*(1-leave))+')';a.shadowColor='#69f7ef';a.shadowBlur=20;const perimeter=2*((CARD.w-68-92)+(CARD.h-68-92))+2*Math.PI*46;a.setLineDash([perimeter*progress,perimeter*2]);a.beginPath();a.roundRect(CARD.x-CARD.w/2+34,CARD.y-CARD.h/2+34,CARD.w-68,CARD.h-68,46);a.stroke();a.setLineDash([]);let pulse=Math.exp(-Math.pow((sec-3.1)/.2,2));a.globalAlpha=pulse*.5;a.lineWidth=20;a.strokeStyle='#d7fff3';a.stroke();a.restore();}
const panel=ease((sec-3)/1),sp=cardSprite();if(panel&&sp){b.save();b.globalAlpha=panel;b.filter='blur('+((1-panel)*7)+'px)';b.translate(W/2,H/2);b.scale(1.04-.04*panel,1.04-.04*panel);b.drawImage(sp.c,-W/2,-H/2,W,H);b.restore();}
if(sec>=5.2){active=false;doneOnce=true;soundTimers.forEach(clearTimeout);soundTimers=[];const cb=complete;complete=null;if(cb)cb();return;}raf=requestAnimationFrame(draw);}
const Opening={get open(){return doneOnce;},instant(){if(raf)cancelAnimationFrame(raf);soundTimers.forEach(clearTimeout);soundTimers=[];raf=0;active=false;doneOnce=true;const [a,b]=ctxs();if(a)a.clearRect(0,0,scene.width,scene.height);if(b){b.setTransform(1,0,0,1,0,0);b.clearRect(0,0,curtain.width,curtain.height);b.setTransform(SCALE,0,0,SCALE,0,0);const put=()=>{const s=cardSprite();if(s)b.drawImage(s.c,0,0,W,H);};if(cardSprite())put();else COVE.addEventListener('load',put,{once:true});}},play(sound,done){if(active||doneOnce){if(done)done();return;}if(reduced){this.instant();if(done)done();return;}active=true;doneOnce=false;startAt=performance.now();complete=done;try{sound&&sound('bubbles');}catch(e){}soundTimers=[setTimeout(()=>{if(active)try{sound&&sound('shimmer');}catch(e){}},1900),setTimeout(()=>{if(active)try{sound&&sound('chime');}catch(e){}},3150)];raf=requestAnimationFrame(draw);},cancel(){if(raf)cancelAnimationFrame(raf);soundTimers.forEach(clearTimeout);soundTimers=[];raf=0;active=false;complete=null;}};window.Opening=Opening;
})();
