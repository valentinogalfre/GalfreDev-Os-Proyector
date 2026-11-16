const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./mirror-DC36xRfT.js","./link-BPBa3GBK.js","./fx-jxpsInfS.js"])))=>i.map(i=>d[i]);
var Md=Object.defineProperty;var Sd=(s,e,t)=>e in s?Md(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var qe=(s,e,t)=>Sd(s,typeof e!="symbol"?e+"":e,t);import{l as gh,c as yd}from"./link-BPBa3GBK.js";const bd="modulepreload",Ed=function(s,e){return new URL(s,e).href},yc={},bc=function(e,t,n){let i=Promise.resolve();if(t&&t.length>0){let c=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=c(t.map(u=>{if(u=Ed(u,n),u in yc)return;yc[u]=!0;const h=u.endsWith(".css"),d=h?'[rel="stylesheet"]':"";if(n)for(let p=a.length-1;p>=0;p--){const _=a[p];if(_.href===u&&(!h||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${d}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":bd,h||(f.as="script"),f.crossOrigin="",f.href=u,l&&f.setAttribute("nonce",l),document.head.appendChild(f),h)return new Promise((p,_)=>{f.addEventListener("load",p),f.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return i.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};const Ul="186",Td=0,Ec=1,wd=2,pr=1,Ad=2,ur=3,Hi=0,fn=1,Wt=2,fi=0,zi=1,zn=2,Tc=3,wc=4,Rd=5,Ps=100,Cd=101,Pd=102,Ld=103,Id=104,Nd=200,Dd=201,Ud=202,Fd=203,_h=204,xh=205,Od=206,Bd=207,zd=208,Hd=209,Vd=210,kd=211,Gd=212,Wd=213,Xd=214,ko=0,Go=1,Wo=2,vr=3,Xo=4,qo=5,Yo=6,Ko=7,Fl=0,qd=1,Yd=2,Hn=0,Ol=1,vh=2,Mh=3,Bl=4,Sh=5,yh=6,bh=7,Ac="attached",Kd="detached",Eh=300,ss=301,Os=302,Ya=303,Ka=304,Fa=306,gn=1e3,Jn=1001,Ta=1002,Xt=1003,Th=1004,hr=1005,Yt=1006,xa=1007,jn=1008,yn=1009,wh=1010,Ah=1011,Mr=1012,zl=1013,ti=1014,Ln=1015,kn=1016,Hl=1017,Vl=1018,Sr=1020,Rh=35902,Ch=35899,Ph=1021,Lh=1022,In=1023,gi=1026,ns=1027,kl=1028,Gl=1029,rs=1030,Wl=1031,Xl=1033,va=33776,Ma=33777,Sa=33778,ya=33779,$o=35840,Qo=35841,Zo=35842,Jo=35843,jo=36196,el=37492,tl=37496,nl=37488,il=37489,wa=37490,sl=37491,rl=37808,al=37809,ol=37810,ll=37811,cl=37812,ul=37813,hl=37814,dl=37815,fl=37816,pl=37817,ml=37818,gl=37819,_l=37820,xl=37821,vl=36492,Ml=36494,Sl=36495,yl=36283,bl=36284,Aa=36285,El=36286,yr=2300,br=2301,$a=2302,Rc=2303,Cc=2400,Pc=2401,Lc=2402,$d=2500,Qd=0,Ih=1,Tl=2,Zd=3200,Er=0,Jd=1,Bi="",It="srgb",pn="srgb-linear",Ra="linear",Et="srgb",Qa=7680,jd=519,ef=512,tf=513,nf=514,ql=515,sf=516,rf=517,Yl=518,af=519,Nh=35044,Dh=35048,Ic="300 es",ei=2e3,Tr=2001;function of(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function lf(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function wr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function cf(){const s=wr("canvas");return s.style.display="block",s}const Nc={};function Ca(...s){const e="THREE."+s.shift();console.log(e,...s)}function Uh(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function He(...s){s=Uh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ke(...s){s=Uh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Ns(...s){const e=s.join(" ");e in Nc||(Nc[e]=!0,He(...s))}function uf(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const hf={[ko]:Go,[Wo]:Yo,[Xo]:Ko,[vr]:qo,[Go]:ko,[Yo]:Wo,[Ko]:Xo,[qo]:vr};class as{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Dc=1234567;const mr=Math.PI/180,Bs=180/Math.PI;function Vn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(an[s&255]+an[s>>8&255]+an[s>>16&255]+an[s>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]).toLowerCase()}function it(s,e,t){return Math.max(e,Math.min(t,s))}function Kl(s,e){return(s%e+e)%e}function df(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function ff(s,e,t){return s!==e?(t-s)/(e-s):0}function gr(s,e,t){return(1-t)*s+t*e}function pf(s,e,t,n){return gr(s,e,1-Math.exp(-t*n))}function mf(s,e=1){return e-Math.abs(Kl(s,e*2)-e)}function gf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function _f(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function xf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function vf(s,e){return s+Math.random()*(e-s)}function Mf(s){return s*(.5-Math.random())}function Sf(s){s!==void 0&&(Dc=s);let e=Dc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function yf(s){return s*mr}function bf(s){return s*Bs}function Ef(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Tf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function wf(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Af(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),h=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":s.set(o*u,l*h,l*d,o*c);break;case"YZY":s.set(l*d,o*u,l*h,o*c);break;case"ZXZ":s.set(l*h,l*d,o*u,o*c);break;case"XZX":s.set(o*u,l*p,l*f,o*c);break;case"YXY":s.set(l*f,o*u,l*p,o*c);break;case"ZYZ":s.set(l*p,l*f,o*u,o*c);break;default:He("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Tt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Rf={DEG2RAD:mr,RAD2DEG:Bs,generateUUID:Vn,clamp:it,euclideanModulo:Kl,mapLinear:df,inverseLerp:ff,lerp:gr,damp:pf,pingpong:mf,smoothstep:gf,smootherstep:_f,randInt:xf,randFloat:vf,randFloatSpread:Mf,seededRandom:Sf,degToRad:yf,radToDeg:bf,isPowerOfTwo:Ef,ceilPowerOfTwo:Tf,floorPowerOfTwo:wf,setQuaternionFromProperEuler:Af,normalize:Tt,denormalize:Bn},gc=class gc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};gc.prototype.isVector2=!0;let Be=gc;class xi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(h!==_||l!==d||c!==f||u!==p){let g=l*d+c*f+u*p+h*_;g<0&&(d=-d,f=-f,p=-p,_=-_,g=-g);let m=1-o;if(g<.9995){const S=Math.acos(g),w=Math.sin(S);m=Math.sin(m*S)/w,o=Math.sin(o*S)/w,l=l*m+d*o,c=c*m+f*o,u=u*m+p*o,h=h*m+_*o}else{l=l*m+d*o,c=c*m+f*o,u=u*m+p*o,h=h*m+_*o;const S=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=S,c*=S,u*=S,h*=S}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+u*h+l*f-c*d,e[t+1]=l*p+u*d+c*h-o*f,e[t+2]=c*p+u*f+o*d-l*h,e[t+3]=u*p-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),h=o(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:He("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>h){const f=2*Math.sqrt(1+n-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-n-h);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(it(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const _c=class _c{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-r*i),h=2*(r*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=i+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Za.copy(this).projectOnVector(e),this.sub(Za)}reflect(e){return this.sub(Za.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};_c.prototype.isVector3=!0;let L=_c;const Za=new L,Uc=new xi,xc=class xc{constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],_=i[0],g=i[3],m=i[6],S=i[1],w=i[4],M=i[7],b=i[2],y=i[5],R=i[8];return r[0]=a*_+o*S+l*b,r[3]=a*g+o*w+l*y,r[6]=a*m+o*M+l*R,r[1]=c*_+u*S+h*b,r[4]=c*g+u*w+h*y,r[7]=c*m+u*M+h*R,r[2]=d*_+f*S+p*b,r[5]=d*g+f*w+p*y,r[8]=d*m+f*M+p*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,p=t*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=h*_,e[1]=(i*c-u*n)*_,e[2]=(o*n-i*a)*_,e[3]=d*_,e[4]=(u*t-i*l)*_,e[5]=(i*r-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ns("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ja.makeScale(e,t)),this}rotate(e){return Ns("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ja.makeRotation(-e)),this}translate(e,t){return Ns("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ja.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};xc.prototype.isMatrix3=!0;let Qe=xc;const Ja=new Qe,Fc=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Oc=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cf(){const s={enabled:!0,workingColorSpace:pn,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Et&&(i.r=pi(i.r),i.g=pi(i.g),i.b=pi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Et&&(i.r=Ds(i.r),i.g=Ds(i.g),i.b=Ds(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Bi?Ra:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ns("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ns("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[pn]:{primaries:e,whitePoint:n,transfer:Ra,toXYZ:Fc,fromXYZ:Oc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:It},outputColorSpaceConfig:{drawingBufferColorSpace:It}},[It]:{primaries:e,whitePoint:n,transfer:Et,toXYZ:Fc,fromXYZ:Oc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:It}}}),s}const ot=Cf();function pi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ds(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let us;class Pf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{us===void 0&&(us=wr("canvas")),us.width=e.width,us.height=e.height;const i=us.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=wr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=pi(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(pi(t[n]/255)*255):t[n]=pi(t[n]);return{data:t,width:e.width,height:e.height}}else return He("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Lf=0;class $l{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Vn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(ja(i[a].image)):r.push(ja(i[a]))}else r=ja(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function ja(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Pf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(He("Texture: Unable to serialize Texture."),{})}let If=0;const eo=new L;class Kt extends as{constructor(e=Kt.DEFAULT_IMAGE,t=Kt.DEFAULT_MAPPING,n=Jn,i=Jn,r=Yt,a=jn,o=In,l=yn,c=Kt.DEFAULT_ANISOTROPY,u=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=Vn(),this.name="",this.source=new $l(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Be(0,0),this.repeat=new Be(1,1),this.center=new Be(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(eo).x}get height(){return this.source.getSize(eo).y}get depth(){return this.source.getSize(eo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){He(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){He(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Eh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gn:e.x=e.x-Math.floor(e.x);break;case Jn:e.x=e.x<0?0:1;break;case Ta:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case gn:e.y=e.y-Math.floor(e.y);break;case Jn:e.y=e.y<0?0:1;break;case Ta:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Kt.DEFAULT_IMAGE=null;Kt.DEFAULT_MAPPING=Eh;Kt.DEFAULT_ANISOTROPY=1;const vc=class vc{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,M=(f+1)/2,b=(m+1)/2,y=(u+d)/4,R=(h+_)/4,x=(p+g)/4;return w>M&&w>b?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=y/n,r=R/n):M>b?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=y/i,r=x/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=R/r,i=x/r),this.set(n,i,r,t),this}let S=Math.sqrt((g-p)*(g-p)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(S)<.001&&(S=1),this.x=(g-p)/S,this.y=(h-_)/S,this.z=(d-u)/S,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this.w=it(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this.w=it(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};vc.prototype.isVector4=!0;let Ct=vc;class Nf extends as{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Yt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Kt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Yt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new $l(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nn extends Nf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Fh extends Kt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Df extends Kt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Ua=class Ua{constructor(e,t,n,i,r,a,o,l,c,u,h,d,f,p,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,u,h,d,f,p,_,g)}set(e,t,n,i,r,a,o,l,c,u,h,d,f,p,_,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ua().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),a=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,p=o*u,_=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+p*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,p=c*u,_=c*h;t[0]=d+_*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-p,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,p=c*u,_=c*h;t[0]=d-_*o,t[4]=-a*h,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,p=o*u,_=o*h;t[0]=l*u,t[4]=p*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*u,t[4]=_-d*h,t[8]=p*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+p,t[10]=d-_*h}else if(e.order==="XZY"){const d=a*l,f=a*c,p=o*l,_=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=a*u,t[9]=f*h-p,t[2]=p*h-f,t[6]=o*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Uf,e,Ff)}lookAt(e,t,n){const i=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),wi.crossVectors(n,vn),wi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),wi.crossVectors(n,vn)),wi.normalize(),Br.crossVectors(vn,wi),i[0]=wi.x,i[4]=Br.x,i[8]=vn.x,i[1]=wi.y,i[5]=Br.y,i[9]=vn.y,i[2]=wi.z,i[6]=Br.z,i[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],_=n[6],g=n[10],m=n[14],S=n[3],w=n[7],M=n[11],b=n[15],y=i[0],R=i[4],x=i[8],T=i[12],A=i[1],I=i[5],N=i[9],U=i[13],P=i[2],B=i[6],V=i[10],q=i[14],Q=i[3],X=i[7],Y=i[11],j=i[15];return r[0]=a*y+o*A+l*P+c*Q,r[4]=a*R+o*I+l*B+c*X,r[8]=a*x+o*N+l*V+c*Y,r[12]=a*T+o*U+l*q+c*j,r[1]=u*y+h*A+d*P+f*Q,r[5]=u*R+h*I+d*B+f*X,r[9]=u*x+h*N+d*V+f*Y,r[13]=u*T+h*U+d*q+f*j,r[2]=p*y+_*A+g*P+m*Q,r[6]=p*R+_*I+g*B+m*X,r[10]=p*x+_*N+g*V+m*Y,r[14]=p*T+_*U+g*q+m*j,r[3]=S*y+w*A+M*P+b*Q,r[7]=S*R+w*I+M*B+b*X,r[11]=S*x+w*N+M*V+b*Y,r[15]=S*T+w*U+M*q+b*j,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],_=e[7],g=e[11],m=e[15],S=l*f-c*d,w=o*f-c*h,M=o*d-l*h,b=a*f-c*u,y=a*d-l*u,R=a*h-o*u;return t*(_*S-g*w+m*M)-n*(p*S-g*b+m*y)+i*(p*w-_*b+m*R)-r*(p*M-_*y+g*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+i*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],_=e[13],g=e[14],m=e[15],S=t*o-n*a,w=t*l-i*a,M=t*c-r*a,b=n*l-i*o,y=n*c-r*o,R=i*c-r*l,x=u*_-h*p,T=u*g-d*p,A=u*m-f*p,I=h*g-d*_,N=h*m-f*_,U=d*m-f*g,P=S*U-w*N+M*I+b*A-y*T+R*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/P;return e[0]=(o*U-l*N+c*I)*B,e[1]=(i*N-n*U-r*I)*B,e[2]=(_*R-g*y+m*b)*B,e[3]=(d*y-h*R-f*b)*B,e[4]=(l*A-a*U-c*T)*B,e[5]=(t*U-i*A+r*T)*B,e[6]=(g*M-p*R-m*w)*B,e[7]=(u*R-d*M+f*w)*B,e[8]=(a*N-o*A+c*x)*B,e[9]=(n*A-t*N-r*x)*B,e[10]=(p*y-_*M+m*S)*B,e[11]=(h*M-u*y-f*S)*B,e[12]=(o*T-a*I-l*x)*B,e[13]=(t*I-n*T+i*x)*B,e[14]=(_*w-p*b-g*S)*B,e[15]=(u*b-h*w+d*S)*B,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,p=r*h,_=a*u,g=a*h,m=o*h,S=l*c,w=l*u,M=l*h,b=n.x,y=n.y,R=n.z;return i[0]=(1-(_+m))*b,i[1]=(f+M)*b,i[2]=(p-w)*b,i[3]=0,i[4]=(f-M)*y,i[5]=(1-(d+m))*y,i[6]=(g+S)*y,i[7]=0,i[8]=(p+w)*R,i[9]=(g-S)*R,i[10]=(1-(d+_))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=hs.set(i[0],i[1],i[2]).length();const o=hs.set(i[4],i[5],i[6]).length(),l=hs.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Un.copy(this);const c=1/a,u=1/o,h=1/l;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=u,Un.elements[5]*=u,Un.elements[6]*=u,Un.elements[8]*=h,Un.elements[9]*=h,Un.elements[10]*=h,t.setFromRotationMatrix(Un),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=ei,l=!1){const c=this.elements,u=2*r/(t-e),h=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===ei)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Tr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=ei,l=!1){const c=this.elements,u=2/(t-e),h=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===ei)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Tr)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ua.prototype.isMatrix4=!0;let Je=Ua;const hs=new L,Un=new Je,Uf=new L(0,0,0),Ff=new L(1,1,1),wi=new L,Br=new L,vn=new L,Bc=new Je,zc=new xi;class _i{constructor(e=0,t=0,n=0,i=_i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(it(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-it(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(it(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-it(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(it(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-it(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:He("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Bc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zc.setFromEuler(this),this.setFromQuaternion(zc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_i.DEFAULT_ORDER="XYZ";class Oh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Of=0;const Hc=new L,ds=new xi,si=new Je,zr=new L,Ks=new L,Bf=new L,zf=new xi,Vc=new L(1,0,0),kc=new L(0,1,0),Gc=new L(0,0,1),Wc={type:"added"},Hf={type:"removed"},fs={type:"childadded",child:null},to={type:"childremoved",child:null};class vt extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=Vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vt.DEFAULT_UP.clone();const e=new L,t=new _i,n=new xi,i=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Je},normalMatrix:{value:new Qe}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.multiply(ds),this}rotateOnWorldAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.premultiply(ds),this}rotateX(e){return this.rotateOnAxis(Vc,e)}rotateY(e){return this.rotateOnAxis(kc,e)}rotateZ(e){return this.rotateOnAxis(Gc,e)}translateOnAxis(e,t){return Hc.copy(e).applyQuaternion(this.quaternion),this.position.add(Hc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vc,e)}translateY(e){return this.translateOnAxis(kc,e)}translateZ(e){return this.translateOnAxis(Gc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?zr.copy(e):zr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(Ks,zr,this.up):si.lookAt(zr,Ks,this.up),this.quaternion.setFromRotationMatrix(si),i&&(si.extractRotation(i.matrixWorld),ds.setFromRotationMatrix(si),this.quaternion.premultiply(ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wc),fs.child=e,this.dispatchEvent(fs),fs.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hf),to.child=e,this.dispatchEvent(to),to.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),si.multiply(e.parent.matrixWorld)),e.applyMatrix4(si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wc),fs.child=e,this.dispatchEvent(fs),fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,e,Bf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,zf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}vt.DEFAULT_UP=new L(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class nn extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Vf={type:"move"};class no{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vf)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new nn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Bh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},Hr={h:0,s:0,l:0};function io(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ge{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=It){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ot.workingColorSpace){if(e=Kl(e,1),t=it(t,0,1),n=it(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=io(a,r,e+1/3),this.g=io(a,r,e),this.b=io(a,r,e-1/3)}return ot.colorSpaceToWorking(this,i),this}setStyle(e,t=It){function n(r){r!==void 0&&parseFloat(r)<1&&He("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:He("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);He("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=It){const n=Bh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):He("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=pi(e.r),this.g=pi(e.g),this.b=pi(e.b),this}copyLinearToSRGB(e){return this.r=Ds(e.r),this.g=Ds(e.g),this.b=Ds(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=It){return ot.workingToColorSpace(on.copy(this),e),Math.round(it(on.r*255,0,255))*65536+Math.round(it(on.g*255,0,255))*256+Math.round(it(on.b*255,0,255))}getHexString(e=It){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(on.copy(this),t);const n=on.r,i=on.g,r=on.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(i-r)/h+(i<r?6:0);break;case i:l=(r-n)/h+2;break;case r:l=(n-i)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=It){ot.workingToColorSpace(on.copy(this),e);const t=on.r,n=on.g,i=on.b;return e!==It?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ai),this.setHSL(Ai.h+e,Ai.s+t,Ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ai),e.getHSL(Hr);const n=gr(Ai.h,Hr.h,t),i=gr(Ai.s,Hr.s,t),r=gr(Ai.l,Hr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new ge;ge.NAMES=Bh;class Dr{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ge(e),this.density=t}clone(){return new Dr(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class zh extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _i,this.environmentIntensity=1,this.environmentRotation=new _i,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Fn=new L,ri=new L,so=new L,ai=new L,ps=new L,ms=new L,Xc=new L,ro=new L,ao=new L,oo=new L,lo=new Ct,co=new Ct,uo=new Ct;class Pn{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Fn.subVectors(e,t),i.cross(Fn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Fn.subVectors(i,t),ri.subVectors(n,t),so.subVectors(e,t);const a=Fn.dot(Fn),o=Fn.dot(ri),l=Fn.dot(so),c=ri.dot(ri),u=ri.dot(so),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,p=(a*u-o*l)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ai.x),l.addScaledVector(a,ai.y),l.addScaledVector(o,ai.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return lo.setScalar(0),co.setScalar(0),uo.setScalar(0),lo.fromBufferAttribute(e,t),co.fromBufferAttribute(e,n),uo.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(lo,r.x),a.addScaledVector(co,r.y),a.addScaledVector(uo,r.z),a}static isFrontFacing(e,t,n,i){return Fn.subVectors(n,t),ri.subVectors(e,t),Fn.cross(ri).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),ri.subVectors(this.a,this.b),Fn.cross(ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Pn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Pn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Pn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;ps.subVectors(i,n),ms.subVectors(r,n),ro.subVectors(e,n);const l=ps.dot(ro),c=ms.dot(ro);if(l<=0&&c<=0)return t.copy(n);ao.subVectors(e,i);const u=ps.dot(ao),h=ms.dot(ao);if(u>=0&&h<=u)return t.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(ps,a);oo.subVectors(e,r);const f=ps.dot(oo),p=ms.dot(oo);if(p>=0&&f<=p)return t.copy(r);const _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ms,o);const g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return Xc.subVectors(r,i),o=(h-u)/(h-u+(f-p)),t.copy(i).addScaledVector(Xc,o);const m=1/(g+_+d);return a=_*m,o=d*m,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Wn{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vr.copy(n.boundingBox)),Vr.applyMatrix4(e.matrixWorld),this.union(Vr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($s),kr.subVectors(this.max,$s),gs.subVectors(e.a,$s),_s.subVectors(e.b,$s),xs.subVectors(e.c,$s),Ri.subVectors(_s,gs),Ci.subVectors(xs,_s),Gi.subVectors(gs,xs);let t=[0,-Ri.z,Ri.y,0,-Ci.z,Ci.y,0,-Gi.z,Gi.y,Ri.z,0,-Ri.x,Ci.z,0,-Ci.x,Gi.z,0,-Gi.x,-Ri.y,Ri.x,0,-Ci.y,Ci.x,0,-Gi.y,Gi.x,0];return!ho(t,gs,_s,xs,kr)||(t=[1,0,0,0,1,0,0,0,1],!ho(t,gs,_s,xs,kr))?!1:(Gr.crossVectors(Ri,Ci),t=[Gr.x,Gr.y,Gr.z],ho(t,gs,_s,xs,kr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const oi=[new L,new L,new L,new L,new L,new L,new L,new L],On=new L,Vr=new Wn,gs=new L,_s=new L,xs=new L,Ri=new L,Ci=new L,Gi=new L,$s=new L,kr=new L,Gr=new L,Wi=new L;function ho(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Wi.fromArray(s,r);const o=i.x*Math.abs(Wi.x)+i.y*Math.abs(Wi.y)+i.z*Math.abs(Wi.z),l=e.dot(Wi),c=t.dot(Wi),u=n.dot(Wi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const kt=new L,Wr=new Be;let kf=0;class xt extends as{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:kf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Nh,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Wr.fromBufferAttribute(this,t),Wr.applyMatrix3(e),this.setXY(t,Wr.x,Wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Tt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),i=Tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),i=Tt(i,this.array),r=Tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Hh extends xt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Vh extends xt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class tt extends xt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Gf=new Wn,Qs=new L,fo=new L;class ni{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Gf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qs.subVectors(e,this.center);const t=Qs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Qs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qs.copy(e.center).add(fo)),this.expandByPoint(Qs.copy(e.center).sub(fo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Wf=0;const wn=new Je,po=new vt,vs=new L,Mn=new Wn,Zs=new Wn,Jt=new L;class ft extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Vn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(of(e)?Vh:Hh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return wn.makeRotationFromQuaternion(e),this.applyMatrix4(wn),this}rotateX(e){return wn.makeRotationX(e),this.applyMatrix4(wn),this}rotateY(e){return wn.makeRotationY(e),this.applyMatrix4(wn),this}rotateZ(e){return wn.makeRotationZ(e),this.applyMatrix4(wn),this}translate(e,t,n){return wn.makeTranslation(e,t,n),this.applyMatrix4(wn),this}scale(e,t,n){return wn.makeScale(e,t,n),this.applyMatrix4(wn),this}lookAt(e){return po.lookAt(e),po.updateMatrix(),this.applyMatrix4(po.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vs).negate(),this.translate(vs.x,vs.y,vs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new tt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&He("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Mn.setFromBufferAttribute(r),this.morphTargetsRelative?(Jt.addVectors(this.boundingBox.min,Mn.min),this.boundingBox.expandByPoint(Jt),Jt.addVectors(this.boundingBox.max,Mn.max),this.boundingBox.expandByPoint(Jt)):(this.boundingBox.expandByPoint(Mn.min),this.boundingBox.expandByPoint(Mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ni);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(Mn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Zs.setFromBufferAttribute(o),this.morphTargetsRelative?(Jt.addVectors(Mn.min,Zs.min),Mn.expandByPoint(Jt),Jt.addVectors(Mn.max,Zs.max),Mn.expandByPoint(Jt)):(Mn.expandByPoint(Zs.min),Mn.expandByPoint(Zs.max))}Mn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Jt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Jt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Jt.fromBufferAttribute(o,c),l&&(vs.fromBufferAttribute(e,c),Jt.add(vs)),i=Math.max(i,n.distanceToSquared(Jt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new xt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new L,l[x]=new L;const c=new L,u=new L,h=new L,d=new Be,f=new Be,p=new Be,_=new L,g=new L;function m(x,T,A){c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,T),h.fromBufferAttribute(n,A),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,A),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(_.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(I),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(I),o[x].add(_),o[T].add(_),o[A].add(_),l[x].add(g),l[T].add(g),l[A].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,T=S.length;x<T;++x){const A=S[x],I=A.start,N=A.count;for(let U=I,P=I+N;U<P;U+=3)m(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const w=new L,M=new L,b=new L,y=new L;function R(x){b.fromBufferAttribute(i,x),y.copy(b);const T=o[x];w.copy(T),w.sub(b.multiplyScalar(b.dot(T))).normalize(),M.crossVectors(y,T);const I=M.dot(l[x])<0?-1:1;a.setXYZW(x,w.x,w.y,w.z,I)}for(let x=0,T=S.length;x<T;++x){const A=S[x],I=A.start,N=A.count;for(let U=I,P=I+N;U<P;U+=3)R(e.getX(U+0)),R(e.getX(U+1)),R(e.getX(U+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new xt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new L,r=new L,a=new L,o=new L,l=new L,c=new L,u=new L,h=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),u.subVectors(a,r),h.subVectors(i,r),u.cross(h),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(i,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Jt.fromBufferAttribute(e,t),Jt.normalize(),e.setXYZ(t,Jt.x,Jt.y,Jt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let m=0;m<u;m++)d[p++]=c[f++]}return new xt(d,u,h)}if(this.index===null)return He("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ft,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(i[l]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kh{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Nh,this.updateRanges=[],this.version=0,this.uuid=Vn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const un=new L;class Ar{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyMatrix4(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyNormalMatrix(e),this.setXYZ(t,un.x,un.y,un.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.transformDirection(e),this.setXYZ(t,un.x,un.y,un.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Tt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),i=Tt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),i=Tt(i,this.array),r=Tt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ca("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new xt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ar(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ca("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const mo=new L,Xf=new L,qf=new Qe;class Fi{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=mo.subVectors(n,t).cross(Xf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(mo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||qf.getNormalMatrix(e),i=this.coplanarPoint(mo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Yf=0;class bn extends as{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=Vn(),this.name="",this.type="Material",this.blending=zi,this.side=Hi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_h,this.blendDst=xh,this.blendEquation=Ps,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ge(0,0,0),this.blendAlpha=0,this.depthFunc=vr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qa,this.stencilZFail=Qa,this.stencilZPass=Qa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){He(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){He(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Fi().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Be().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Be().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Gh extends bn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ge(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ms;const Js=new L,Ss=new L,ys=new L,bs=new Be,js=new Be,Wh=new Je,Xr=new L,er=new L,qr=new L,qc=new Be,go=new Be,Yc=new Be;class Kf extends vt{constructor(e=new Gh){if(super(),this.isSprite=!0,this.type="Sprite",Ms===void 0){Ms=new ft;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new kh(t,5);Ms.setIndex([0,1,2,0,2,3]),Ms.setAttribute("position",new Ar(n,3,0,!1)),Ms.setAttribute("uv",new Ar(n,2,3,!1))}this.geometry=Ms,this.material=e,this.center=new Be(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ke('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ss.setFromMatrixScale(this.matrixWorld),Wh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ys.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ss.multiplyScalar(-ys.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Yr(Xr.set(-.5,-.5,0),ys,a,Ss,i,r),Yr(er.set(.5,-.5,0),ys,a,Ss,i,r),Yr(qr.set(.5,.5,0),ys,a,Ss,i,r),qc.set(0,0),go.set(1,0),Yc.set(1,1);let o=e.ray.intersectTriangle(Xr,er,qr,!1,Js);if(o===null&&(Yr(er.set(-.5,.5,0),ys,a,Ss,i,r),go.set(0,1),o=e.ray.intersectTriangle(Xr,qr,er,!1,Js),o===null))return;const l=e.ray.origin.distanceTo(Js);l<e.near||l>e.far||t.push({distance:l,point:Js.clone(),uv:Pn.getInterpolation(Js,Xr,er,qr,qc,go,Yc,new Be),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Yr(s,e,t,n,i,r){bs.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(js.x=r*bs.x-i*bs.y,js.y=i*bs.x+r*bs.y):js.copy(bs),s.copy(e),s.x+=js.x,s.y+=js.y,s.applyMatrix4(Wh)}const li=new L,_o=new L,Kr=new L,$r=new L;class Oa{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(li.copy(this.origin).addScaledVector(this.direction,t),li.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){_o.copy(e).add(t).multiplyScalar(.5),Kr.copy(t).sub(e).normalize(),$r.copy(this.origin).sub(_o);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Kr),o=$r.dot(this.direction),l=-$r.dot(Kr),c=$r.lengthSq(),u=Math.abs(1-a*a);let h,d,f,p;if(u>0)if(h=a*l-o,d=a*o-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(_o).addScaledVector(Kr,d),f}intersectSphere(e,t){if(e.radius<0)return null;li.subVectors(e.center,this.origin);const n=li.dot(this.direction),i=li.dot(li)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,li)!==null}intersectTriangle(e,t,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,h=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,_=t.y-a.y,g=t.z-a.z,m=n.x-a.x,S=n.y-a.y,w=n.z-a.z,M=Math.abs(l),b=Math.abs(c),y=Math.abs(u);let R,x,T,A,I,N,U,P,B,V,q,Q;if(M>=b&&M>=y?(T=l,N=h,B=p,Q=m,l>=0?(R=c,x=u,A=d,I=f,U=_,P=g,V=S,q=w):(R=u,x=c,A=f,I=d,U=g,P=_,V=w,q=S)):b>=y?(T=c,N=d,B=_,Q=S,c>=0?(R=u,x=l,A=f,I=h,U=g,P=p,V=w,q=m):(R=l,x=u,A=h,I=f,U=p,P=g,V=m,q=w)):(T=u,N=f,B=g,Q=w,u>=0?(R=l,x=c,A=h,I=d,U=p,P=_,V=m,q=S):(R=c,x=l,A=d,I=h,U=_,P=p,V=S,q=m)),T===0)return null;const X=R/T,Y=x/T,j=1/T,se=A-X*N,Z=I-Y*N,ue=U-X*B,oe=P-Y*B,fe=V-X*Q,H=q-Y*Q,K=fe*oe-H*ue,pe=se*H-Z*fe,ze=ue*Z-oe*se;if(i){if(K<0||pe<0||ze<0)return null}else if((K<0||pe<0||ze<0)&&(K>0||pe>0||ze>0))return null;const he=K+pe+ze;if(he===0)return null;const Ge=j*(K*N+pe*B+ze*Q);return(he>0?Ge<0:Ge>0)?null:this.at(Ge/he,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt extends bn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=Fl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Kc=new Je,Xi=new Oa,Qr=new ni,$c=new L,Zr=new L,Jr=new L,jr=new L,xo=new L,ea=new L,Qc=new L,ta=new L;class Ve extends vt{constructor(e=new ft,t=new Mt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){ea.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(xo.fromBufferAttribute(h,e),a?ea.addScaledVector(xo,u):ea.addScaledVector(xo.sub(t),u))}t.add(ea)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(r),Xi.copy(e.ray).recast(e.near),!(Qr.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(Qr,$c)===null||Xi.origin.distanceToSquared($c)>(e.far-e.near)**2))&&(Kc.copy(r).invert(),Xi.copy(e.ray).applyMatrix4(Kc),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Xi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=a[g.materialIndex],S=Math.max(g.start,f.start),w=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=S,b=w;M<b;M+=3){const y=o.getX(M),R=o.getX(M+1),x=o.getX(M+2);i=na(this,m,e,n,c,u,h,y,R,x),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){const S=o.getX(g),w=o.getX(g+1),M=o.getX(g+2);i=na(this,a,e,n,c,u,h,S,w,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const g=d[p],m=a[g.materialIndex],S=Math.max(g.start,f.start),w=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=S,b=w;M<b;M+=3){const y=M,R=M+1,x=M+2;i=na(this,m,e,n,c,u,h,y,R,x),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){const S=g,w=g+1,M=g+2;i=na(this,a,e,n,c,u,h,S,w,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function $f(s,e,t,n,i,r,a,o){let l;if(e.side===fn?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===Hi,o),l===null)return null;ta.copy(o),ta.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(ta);return c<t.near||c>t.far?null:{distance:c,point:ta.clone(),object:s}}function na(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Zr),s.getVertexPosition(l,Jr),s.getVertexPosition(c,jr);const u=$f(s,e,t,n,Zr,Jr,jr,Qc);if(u){const h=new L;Pn.getBarycoord(Qc,Zr,Jr,jr,h),i&&(u.uv=Pn.getInterpolatedAttribute(i,o,l,c,h,new Be)),r&&(u.uv1=Pn.getInterpolatedAttribute(r,o,l,c,h,new Be)),a&&(u.normal=Pn.getInterpolatedAttribute(a,o,l,c,h,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new L,materialIndex:0};Pn.getNormal(Zr,Jr,jr,d.normal),u.face=d,u.barycoord=h}return u}const tr=new Ct,Zc=new Ct,Jc=new Ct,Qf=new Ct,jc=new Je,ia=new L,vo=new ni,eu=new Je,Mo=new Oa;class Zf extends Ve{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ac,this.bindMatrix=new Je,this.bindMatrixInverse=new Je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Wn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ia),this.boundingBox.expandByPoint(ia)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ni),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ia),this.boundingSphere.expandByPoint(ia)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vo.copy(this.boundingSphere),vo.applyMatrix4(i),e.ray.intersectsSphere(vo)!==!1&&(eu.copy(i).invert(),Mo.copy(e.ray).applyMatrix4(eu),!(this.boundingBox!==null&&Mo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Mo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ct,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Ac?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Kd?this.bindMatrixInverse.copy(this.bindMatrix).invert():He("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Zc.fromBufferAttribute(i.attributes.skinIndex,e),Jc.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(tr.copy(t),t.set(0,0,0,0)):(tr.set(...t,1),t.set(0,0,0)),tr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=Jc.getComponent(r);if(a!==0){const o=Zc.getComponent(r);jc.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Qf.copy(tr).applyMatrix4(jc),a)}}return t.isVector4&&(t.w=tr.w),t.applyMatrix4(this.bindMatrixInverse)}}class Xh extends vt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ql extends Kt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Xt,u=Xt,h,d){super(null,a,o,l,c,u,i,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const tu=new Je,Jf=new Je;class Zl{constructor(e=[],t=[]){this.uuid=Vn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){He("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Jf;tu.multiplyMatrices(o,t[r]),tu.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Zl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Ql(t,e,e,In,Ln);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(He("Skeleton: No bone found with UUID:",r),a=new Xh),this.bones.push(a),this.boneInverses.push(new Je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Pa extends xt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Es=new Je,nu=new Je,sa=[],iu=new Wn,jf=new Je,nr=new Ve,ir=new ni;class ln extends Ve{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Pa(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,jf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Es),iu.copy(e.boundingBox).applyMatrix4(Es),this.boundingBox.union(iu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ni),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Es),ir.copy(e.boundingSphere).applyMatrix4(Es),this.boundingSphere.union(ir)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(nr.geometry=this.geometry,nr.material=this.material,nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ir.copy(this.boundingSphere),ir.applyMatrix4(n),e.ray.intersectsSphere(ir)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Es),nu.multiplyMatrices(n,Es),nr.matrixWorld=nu,nr.raycast(e,sa);for(let a=0,o=sa.length;a<o;a++){const l=sa[a];l.instanceId=r,l.object=this,t.push(l)}sa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Pa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ql(new Float32Array(i*this.count),i,this.count,kl,Ln));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const qi=new ni,ep=new Be(.5,.5),ra=new L;class Jl{constructor(e=new Fi,t=new Fi,n=new Fi,i=new Fi,r=new Fi,a=new Fi){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ei,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],_=r[9],g=r[10],m=r[11],S=r[12],w=r[13],M=r[14],b=r[15];if(i[0].setComponents(c-a,f-u,m-p,b-S).normalize(),i[1].setComponents(c+a,f+u,m+p,b+S).normalize(),i[2].setComponents(c+o,f+h,m+_,b+w).normalize(),i[3].setComponents(c-o,f-h,m-_,b-w).normalize(),n)i[4].setComponents(l,d,g,M).normalize(),i[5].setComponents(c-l,f-d,m-g,b-M).normalize();else if(i[4].setComponents(c-l,f-d,m-g,b-M).normalize(),t===ei)i[5].setComponents(c+l,f+d,m+g,b+M).normalize();else if(t===Tr)i[5].setComponents(l,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(e){qi.center.set(0,0,0);const t=ep.distanceTo(e.center);return qi.radius=.7071067811865476+t,qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(ra.x=i.normal.x>0?e.max.x:e.min.x,ra.y=i.normal.y>0?e.max.y:e.min.y,ra.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ra)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Rr extends bn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const La=new L,Ia=new L,su=new Je,sr=new Oa,aa=new ni,So=new L,ru=new L;class jl extends vt{constructor(e=new ft,t=new Rr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)La.fromBufferAttribute(t,i-1),Ia.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=La.distanceTo(Ia);e.setAttribute("lineDistance",new tt(n,1))}else He("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),aa.copy(n.boundingSphere),aa.applyMatrix4(i),aa.radius+=r,e.ray.intersectsSphere(aa)===!1)return;su.copy(i).invert(),sr.copy(e.ray).applyMatrix4(su);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=f,g=p-1;_<g;_+=c){const m=u.getX(_),S=u.getX(_+1),w=oa(this,e,sr,l,m,S,_);w&&t.push(w)}if(this.isLineLoop){const _=u.getX(p-1),g=u.getX(f),m=oa(this,e,sr,l,_,g,p-1);m&&t.push(m)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,g=p-1;_<g;_+=c){const m=oa(this,e,sr,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){const _=oa(this,e,sr,l,p-1,f,p-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function oa(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(La.fromBufferAttribute(o,i),Ia.fromBufferAttribute(o,r),t.distanceSqToSegment(La,Ia,So,ru)>n)return;So.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(So);if(!(c<e.near||c>e.far))return{distance:c,point:ru.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const au=new L,ou=new L;class Na extends jl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)au.fromBufferAttribute(t,i),ou.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+au.distanceTo(ou);e.setAttribute("lineDistance",new tt(n,1))}else He("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class tp extends jl{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ba extends bn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const lu=new Je,wl=new Oa,la=new ni,ca=new L;class za extends vt{constructor(e=new ft,t=new Ba){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),la.copy(n.boundingSphere),la.applyMatrix4(i),la.radius+=r,e.ray.intersectsSphere(la)===!1)return;lu.copy(i).invert(),wl.copy(e.ray).applyMatrix4(lu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=d,_=f;p<_;p++){const g=c.getX(p);ca.fromBufferAttribute(h,g),cu(ca,g,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let p=d,_=f;p<_;p++)ca.fromBufferAttribute(h,p),cu(ca,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function cu(s,e,t,n,i,r,a){const o=wl.distanceSqToPoint(s);if(o<t){const l=new L;wl.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class qh extends Kt{constructor(e=[],t=ss,n,i,r,a,o,l,c,u){super(e,t,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class En extends Kt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Cr extends Kt{constructor(e,t,n=ti,i,r,a,o=Xt,l=Xt,c,u=gi,h=1){if(u!==gi&&u!==ns)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $l(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class np extends Cr{constructor(e,t=ti,n=ss,i,r,a=Xt,o=Xt,l,c=gi){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,n,i,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Yh extends Kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Bt extends ft{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new tt(c,3)),this.setAttribute("normal",new tt(u,3)),this.setAttribute("uv",new tt(h,2));function p(_,g,m,S,w,M,b,y,R,x,T){const A=M/R,I=b/x,N=M/2,U=b/2,P=y/2,B=R+1,V=x+1;let q=0,Q=0;const X=new L;for(let Y=0;Y<V;Y++){const j=Y*I-U;for(let se=0;se<B;se++){const Z=se*A-N;X[_]=Z*S,X[g]=j*w,X[m]=P,c.push(X.x,X.y,X.z),X[_]=0,X[g]=0,X[m]=y>0?1:-1,u.push(X.x,X.y,X.z),h.push(se/R),h.push(1-Y/x),q+=1}}for(let Y=0;Y<x;Y++)for(let j=0;j<R;j++){const se=d+j+B*Y,Z=d+j+B*(Y+1),ue=d+(j+1)+B*(Y+1),oe=d+(j+1)+B*Y;l.push(se,Z,oe),l.push(Z,ue,oe),Q+=6}o.addGroup(f,Q,T),f+=Q,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ha extends ft{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new L,u=new Be;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=t;h++,d+=3){const f=n+h/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[d]/e+1)/2,u.y=(a[d+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new tt(a,3)),this.setAttribute("normal",new tt(o,3)),this.setAttribute("uv",new tt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ha(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ki extends ft{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],d=[],f=[];let p=0;const _=[],g=n/2;let m=0;S(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new tt(h,3)),this.setAttribute("normal",new tt(d,3)),this.setAttribute("uv",new tt(f,2));function S(){const M=new L,b=new L;let y=0;const R=(t-e)/n;for(let x=0;x<=r;x++){const T=[],A=x/r,I=A*(t-e)+e;for(let N=0;N<=i;N++){const U=N/i,P=U*l+o,B=Math.sin(P),V=Math.cos(P);b.x=I*B,b.y=-A*n+g,b.z=I*V,h.push(b.x,b.y,b.z),M.set(B,R,V).normalize(),d.push(M.x,M.y,M.z),f.push(U,1-A),T.push(p++)}_.push(T)}for(let x=0;x<i;x++)for(let T=0;T<r;T++){const A=_[T][x],I=_[T+1][x],N=_[T+1][x+1],U=_[T][x+1];(e>0||T!==0)&&(u.push(A,I,U),y+=3),(t>0||T!==r-1)&&(u.push(I,N,U),y+=3)}c.addGroup(m,y,0),m+=y}function w(M){const b=p,y=new Be,R=new L;let x=0;const T=M===!0?e:t,A=M===!0?1:-1;for(let N=1;N<=i;N++)h.push(0,g*A,0),d.push(0,A,0),f.push(.5,.5),p++;const I=p;for(let N=0;N<=i;N++){const P=N/i*l+o,B=Math.cos(P),V=Math.sin(P);R.x=T*V,R.y=g*A,R.z=T*B,h.push(R.x,R.y,R.z),d.push(0,A,0),y.x=B*.5+.5,y.y=V*.5*A+.5,f.push(y.x,y.y),p++}for(let N=0;N<i;N++){const U=b+N,P=I+N;M===!0?u.push(P,P+1,U):u.push(P+1,P,U),x+=3}c.addGroup(m,x,M===!0?1:2),m+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ki(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ec extends ki{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ec(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Va extends ft{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),u(),this.setAttribute("position",new tt(r,3)),this.setAttribute("normal",new tt(r.slice(),3)),this.setAttribute("uv",new tt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const w=new L,M=new L,b=new L;for(let y=0;y<t.length;y+=3)f(t[y+0],w),f(t[y+1],M),f(t[y+2],b),l(w,M,b,S)}function l(S,w,M,b){const y=b+1,R=[];for(let x=0;x<=y;x++){R[x]=[];const T=S.clone().lerp(M,x/y),A=w.clone().lerp(M,x/y),I=y-x;for(let N=0;N<=I;N++)N===0&&x===y?R[x][N]=T:R[x][N]=T.clone().lerp(A,N/I)}for(let x=0;x<y;x++)for(let T=0;T<2*(y-x)-1;T++){const A=Math.floor(T/2);T%2===0?(d(R[x][A+1]),d(R[x+1][A]),d(R[x][A])):(d(R[x][A+1]),d(R[x+1][A+1]),d(R[x+1][A]))}}function c(S){const w=new L;for(let M=0;M<r.length;M+=3)w.x=r[M+0],w.y=r[M+1],w.z=r[M+2],w.normalize().multiplyScalar(S),r[M+0]=w.x,r[M+1]=w.y,r[M+2]=w.z}function u(){const S=new L;for(let w=0;w<r.length;w+=3){S.x=r[w+0],S.y=r[w+1],S.z=r[w+2];const M=g(S)/2/Math.PI+.5,b=m(S)/Math.PI+.5;a.push(M,1-b)}p(),h()}function h(){for(let S=0;S<a.length;S+=6){const w=a[S+0],M=a[S+2],b=a[S+4],y=Math.max(w,M,b),R=Math.min(w,M,b);y>.9&&R<.1&&(w<.2&&(a[S+0]+=1),M<.2&&(a[S+2]+=1),b<.2&&(a[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function f(S,w){const M=S*3;w.x=e[M+0],w.y=e[M+1],w.z=e[M+2]}function p(){const S=new L,w=new L,M=new L,b=new L,y=new Be,R=new Be,x=new Be;for(let T=0,A=0;T<r.length;T+=9,A+=6){S.set(r[T+0],r[T+1],r[T+2]),w.set(r[T+3],r[T+4],r[T+5]),M.set(r[T+6],r[T+7],r[T+8]),y.set(a[A+0],a[A+1]),R.set(a[A+2],a[A+3]),x.set(a[A+4],a[A+5]),b.copy(S).add(w).add(M).divideScalar(3);const I=g(b);_(y,A+0,S,I),_(R,A+2,w,I),_(x,A+4,M,I)}}function _(S,w,M,b){b<0&&S.x===1&&(a[w]=S.x-1),M.x===0&&M.z===0&&(a[w]=b/2/Math.PI+.5)}function g(S){return Math.atan2(S.z,-S.x)}function m(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Va(e.vertices,e.indices,e.radius,e.detail)}}class tc extends Va{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new tc(e.radius,e.detail)}}class ip{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){He("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const u=n[i],d=n[i+1]-u,f=(a-u)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new Be:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new L,i=[],r=[],a=[],o=new L,l=new Je;for(let f=0;f<=e;f++){const p=f/e;i[f]=this.getTangentAt(p,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),h=Math.abs(i[0].y),d=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(it(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(it(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function nc(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,h){let d=(a-r)/c-(o-r)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+h)+(l-o)/h;d*=u,f*=u,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const uu=new L,hu=new L,yo=new nc,bo=new nc,Eo=new nc;class sp extends ip{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new L){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=i[(o-1)%r]:(hu.subVectors(i[0],i[1]).add(i[0]),c=hu);const h=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?u=i[(o+2)%r]:(uu.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=uu),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),yo.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,p,_,g),bo.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,p,_,g),Eo.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,p,_,g)}else this.curveType==="catmullrom"&&(yo.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),bo.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Eo.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(yo.calc(l),bo.calc(l),Eo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new L().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class ic extends Va{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ic(e.radius,e.detail)}}class sc extends ft{constructor(e=[new Be(0,-.5),new Be(.5,0),new Be(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=it(i,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],u=1/t,h=new L,d=new Be,f=new L,p=new L,_=new L;let g=0,m=0;for(let S=0;S<=e.length-1;S++)switch(S){case 0:g=e[S+1].x-e[S].x,m=e[S+1].y-e[S].y,f.x=m*1,f.y=-g,f.z=m*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:g=e[S+1].x-e[S].x,m=e[S+1].y-e[S].y,f.x=m*1,f.y=-g,f.z=m*0,p.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(p)}for(let S=0;S<=t;S++){const w=n+S*u*i,M=Math.sin(w),b=Math.cos(w);for(let y=0;y<=e.length-1;y++){h.x=e[y].x*M,h.y=e[y].y,h.z=e[y].x*b,a.push(h.x,h.y,h.z),d.x=S/t,d.y=y/(e.length-1),o.push(d.x,d.y);const R=l[3*y+0]*M,x=l[3*y+1],T=l[3*y+0]*b;c.push(R,x,T)}}for(let S=0;S<t;S++)for(let w=0;w<e.length-1;w++){const M=w+S*e.length,b=M,y=M+e.length,R=M+e.length+1,x=M+1;r.push(b,y,x),r.push(R,x,y)}this.setIndex(r),this.setAttribute("position",new tt(a,3)),this.setAttribute("uv",new tt(o,2)),this.setAttribute("normal",new tt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sc(e.points,e.segments,e.phiStart,e.phiLength)}}class tn extends ft{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,h=e/o,d=t/l,f=[],p=[],_=[],g=[];for(let m=0;m<u;m++){const S=m*d-a;for(let w=0;w<c;w++){const M=w*h-r;p.push(M,-S,0),_.push(0,0,1),g.push(w/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<o;S++){const w=S+c*m,M=S+c*(m+1),b=S+1+c*(m+1),y=S+1+c*m;f.push(w,M,y),f.push(M,b,y)}this.setIndex(f),this.setAttribute("position",new tt(p,3)),this.setAttribute("normal",new tt(_,3)),this.setAttribute("uv",new tt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tn(e.width,e.height,e.widthSegments,e.heightSegments)}}class rc extends ft{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],u=[];let h=e;const d=(t-e)/i,f=new L,p=new Be;for(let _=0;_<=i;_++){for(let g=0;g<=n;g++){const m=r+g/n*a;f.x=h*Math.cos(m),f.y=h*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,u.push(p.x,p.y)}h+=d}for(let _=0;_<i;_++){const g=_*(n+1);for(let m=0;m<n;m++){const S=m+g,w=S,M=S+n+1,b=S+n+2,y=S+1;o.push(w,M,y),o.push(M,b,y)}}this.setIndex(o),this.setAttribute("position",new tt(l,3)),this.setAttribute("normal",new tt(c,3)),this.setAttribute("uv",new tt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rc(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Vs extends ft{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new L,d=new L,f=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){const S=[],w=m/n,M=a+w*o,b=e*Math.cos(M),y=Math.sqrt(e*e-b*b);let R=0;m===0&&a===0?R=.5/t:m===n&&l===Math.PI&&(R=-.5/t);for(let x=0;x<=t;x++){const T=x/t,A=i+T*r;h.x=-y*Math.cos(A),h.y=b,h.z=y*Math.sin(A),p.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),g.push(T+R,1-w),S.push(c++)}u.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){const w=u[m][S+1],M=u[m][S],b=u[m+1][S],y=u[m+1][S+1];(m!==0||a>0)&&f.push(w,M,y),(m!==n-1||l<Math.PI)&&f.push(M,b,y)}this.setIndex(f),this.setAttribute("position",new tt(p,3)),this.setAttribute("normal",new tt(_,3)),this.setAttribute("uv",new tt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ac extends ft{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],u=[],h=[],d=new L,f=new L,p=new L;for(let _=0;_<=n;_++){const g=a+_/n*o;for(let m=0;m<=i;m++){const S=m/i*r;f.x=(e+t*Math.cos(g))*Math.cos(S),f.y=(e+t*Math.cos(g))*Math.sin(S),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),p.subVectors(f,d).normalize(),u.push(p.x,p.y,p.z),h.push(m/i),h.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=i;g++){const m=(i+1)*_+g-1,S=(i+1)*(_-1)+g-1,w=(i+1)*(_-1)+g,M=(i+1)*_+g;l.push(m,S,M),l.push(S,w,M)}this.setIndex(l),this.setAttribute("position",new tt(c,3)),this.setAttribute("normal",new tt(u,3)),this.setAttribute("uv",new tt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ac(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function zs(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(du(i))i.isRenderTargetTexture?(He("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(du(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function hn(s){const e={};for(let t=0;t<s.length;t++){const n=zs(s[t]);for(const i in n)e[i]=n[i]}return e}function du(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function rp(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Kh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const ap={clone:zs,merge:hn};var op=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends bn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=op,this.fragmentShader=lp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zs(e.uniforms),this.uniformsGroups=rp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new ge().setHex(i.value);break;case"v2":this.uniforms[n].value=new Be().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ct().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Qe().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Je().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class cp extends Gn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class en extends bn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Er,this.normalScale=new Be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dn extends en{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Be(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return it(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ge(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ge(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ge(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Cn extends bn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Er,this.normalScale=new Be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=Fl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class up extends bn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class hp extends bn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class dp extends bn{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new ge(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Er,this.normalScale=new Be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this.fog=e.fog,this}}function Oi(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function ba(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function fp(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function fu(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function pp(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class ks{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class mp extends ks{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Cc,endingEnd:Cc}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Pc:r=e,o=2*t-n;break;case Lc:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Pc:a=e,l=2*n-t;break;case Lc:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),_=p*p,g=_*p,m=-d*g+2*d*_-d*p,S=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*p+1,w=(-1-f)*g+(1.5+f)*_+.5*p,M=f*g-f*_;for(let b=0;b!==o;++b)r[b]=m*a[u+b]+S*a[c+b]+w*a[l+b]+M*a[h+b];return r}}class gp extends ks{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(i-t),h=1-u;for(let d=0;d!==o;++d)r[d]=a[c+d]*h+a[l+d]*u;return r}}class _p extends ks{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class xp extends ks{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,h=this.outTangents;if(!u||!h){const p=(n-t)/(i-t),_=1-p;for(let g=0;g!==o;++g)r[g]=a[c+g]*_+a[l+g]*p;return r}const d=o*2,f=e-1;for(let p=0;p!==o;++p){const _=a[c+p],g=a[l+p],m=f*d+p*2,S=h[m],w=h[m+1],M=e*d+p*2,b=u[M],y=u[M+1],R=Mp(n,t,S,b,i);r[p]=$h(R,_,w,y,g)}return r}}function $h(s,e,t,n,i){const r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function vp(s,e,t,n,i){const r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function Mp(s,e,t,n,i){let r=(s-e)/(i-e);for(let a=0;a<8;a++){const o=$h(r,e,t,n,i)-s;if(Math.abs(o)<1e-10)break;const l=vp(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class Xn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Oi(t,this.TimeBufferType),this.values=Oi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Oi(e.times,Array),values:Oi(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),ba(e.settings)&&(n.settings={inTangents:Oi(e.settings.inTangents,Array),outTangents:Oi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new _p(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new gp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new mp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new xp(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case yr:t=this.InterpolantFactoryMethodDiscrete;break;case br:t=this.InterpolantFactoryMethodLinear;break;case $a:t=this.InterpolantFactoryMethodSmooth;break;case Rc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return He("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return yr;case this.InterpolantFactoryMethodLinear:return br;case this.InterpolantFactoryMethodSmooth:return $a;case this.InterpolantFactoryMethodBezier:return Rc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;ba(this.settings)&&(pu(this.settings.inTangents,e),pu(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ke("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(Ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ke("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ke("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&lf(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Ke("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===$a,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)l=!0;else{const h=o*n,d=h-n,f=h+n;for(let p=0;p!==n;++p){const _=t[h+p];if(_!==t[d+p]||_!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const h=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,ba(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function pu(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}Xn.prototype.ValueTypeName="";Xn.prototype.TimeBufferType=Float32Array;Xn.prototype.ValueBufferType=Float32Array;Xn.prototype.DefaultInterpolation=br;class Gs extends Xn{constructor(e,t,n){super(e,t,n)}}Gs.prototype.ValueTypeName="bool";Gs.prototype.ValueBufferType=Array;Gs.prototype.DefaultInterpolation=yr;Gs.prototype.InterpolantFactoryMethodLinear=void 0;Gs.prototype.InterpolantFactoryMethodSmooth=void 0;class Qh extends Xn{constructor(e,t,n,i){super(e,t,n,i)}}Qh.prototype.ValueTypeName="color";class Pr extends Xn{constructor(e,t,n,i){super(e,t,n,i)}}Pr.prototype.ValueTypeName="number";class Sp extends ks{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let u=c+o;c!==u;c+=4)xi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Lr extends Xn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Sp(this.times,this.values,this.getValueSize(),e)}}Lr.prototype.ValueTypeName="quaternion";Lr.prototype.InterpolantFactoryMethodSmooth=void 0;class Ws extends Xn{constructor(e,t,n){super(e,t,n)}}Ws.prototype.ValueTypeName="string";Ws.prototype.ValueBufferType=Array;Ws.prototype.DefaultInterpolation=yr;Ws.prototype.InterpolantFactoryMethodLinear=void 0;Ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Da extends Xn{constructor(e,t,n,i){super(e,t,n,i)}}Da.prototype.ValueTypeName="vector";class yp{constructor(e="",t=-1,n=[],i=$d){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Vn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Ep(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Xn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const u=fp(l);l=fu(l,1,u),c=fu(c,1,u),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Pr(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(r);if(u&&u.length>1){const h=u[1];let d=i[h];d||(i[h]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function bp(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Pr;case"vector":case"vector2":case"vector3":case"vector4":return Da;case"color":return Qh;case"quaternion":return Lr;case"bool":case"boolean":return Gs;case"string":return Ws}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Ep(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=bp(s.type);if(s.times===void 0){const n=[],i=[];pp(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),ba(s.settings)&&(t.settings={inTangents:Oi(s.settings.inTangents,Float32Array),outTangents:Oi(s.settings.outTangents,Float32Array)}),t}const di={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(mu(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!mu(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function mu(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Tp{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&i.onStart!==void 0&&i.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,i.onProgress!==void 0&&i.onProgress(u,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const f=c[h],p=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const wp=new Tp;class Xs{constructor(e){this.manager=e!==void 0?e:wp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Xs.DEFAULT_MATERIAL_NAME="__DEFAULT";const ci={};class Ap extends Error{constructor(e,t){super(e),this.response=t}}class Zh extends Xs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=di.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ci[e]!==void 0){ci[e].push({onLoad:t,onProgress:n,onError:i});return}ci[e]=[],ci[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&He("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=ci[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0;let _=0;const g=new ReadableStream({start(m){S();function S(){h.read().then(({done:w,value:M})=>{if(w)m.close();else{_+=M.byteLength;const b=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:f});for(let y=0,R=u.length;y<R;y++){const x=u[y];x.onProgress&&x.onProgress(b)}m.enqueue(M),S()}},w=>{m.error(w)})}}});return new Response(g)}else throw new Ap(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{di.add(`file:${e}`,c);const u=ci[e];delete ci[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{const u=ci[e];if(u===void 0)throw this.manager.itemError(e),c;delete ci[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ts=new WeakMap;class Rp extends Xs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=di.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let h=Ts.get(a);h===void 0&&(h=[],Ts.set(a,h)),h.push({onLoad:t,onError:i})}return a}const o=wr("img");function l(){u(),t&&t(this);const h=Ts.get(this)||[];for(let d=0;d<h.length;d++){const f=h[d];f.onLoad&&f.onLoad(this)}Ts.delete(this),r.manager.itemEnd(e)}function c(h){u(),i&&i(h),di.remove(`image:${e}`);const d=Ts.get(this)||[];for(let f=0;f<d.length;f++){const p=d[f];p.onError&&p.onError(h)}Ts.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),di.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Cp extends Xs{constructor(e){super(e)}load(e,t,n,i){const r=new Kt,a=new Rp(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class ka extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ge(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Ga extends ka{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const To=new Je,gu=new L,_u=new L;class oc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Be(512,512),this.mapType=yn,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jl,this._frameExtents=new Be(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;gu.setFromMatrixPosition(e.matrixWorld),t.position.copy(gu),_u.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_u),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){To.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(To,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===Tr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(To)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ua=new L,ha=new xi,Yn=new L;class Jh extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ua,ha,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ua,ha,Yn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ua,ha,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ua,ha,Yn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Pi=new L,xu=new Be,vu=new Be;class dn extends Jh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Bs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(mr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Bs*2*Math.atan(Math.tan(mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z)}getViewSize(e,t){return this.getViewBounds(e,xu,vu),t.subVectors(vu,xu)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(mr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Pp extends oc{constructor(){super(new dn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Bs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class Lp extends ka{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Pp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Ip extends oc{constructor(){super(new dn(90,1,.5,500)),this.isPointLightShadow=!0}}class Np extends ka{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ip}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ur extends Jh{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Dp extends oc{constructor(){super(new Ur(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fr extends ka{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new Dp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class _r{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const wo=new WeakMap;class Up extends Xs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&He("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&He("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=di.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{wo.has(a)===!0?(i&&i(wo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return di.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),wo.set(l,c),di.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});di.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ws=-90,As=1;class Fp extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new dn(ws,As,e,t);i.layers=this.layers,this.add(i);const r=new dn(ws,As,e,t);r.layers=this.layers,this.add(r);const a=new dn(ws,As,e,t);a.layers=this.layers,this.add(a);const o=new dn(ws,As,e,t);o.layers=this.layers,this.add(o);const l=new dn(ws,As,e,t);l.layers=this.layers,this.add(l);const c=new dn(ws,As,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===ei)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Tr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Op extends dn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const lc="\\[\\]\\.:\\/",Bp=new RegExp("["+lc+"]","g"),cc="[^"+lc+"]",zp="[^"+lc.replace("\\.","")+"]",Hp=/((?:WC+[\/:])*)/.source.replace("WC",cc),Vp=/(WCOD+)?/.source.replace("WCOD",zp),kp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",cc),Gp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",cc),Wp=new RegExp("^"+Hp+Vp+kp+Gp+"$"),Xp=["material","materials","bones","map"];class qp{constructor(e,t,n){const i=n||wt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class wt{constructor(e,t,n){this.path=t,this.parsedPath=n||wt.parseTrackName(t),this.node=wt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new wt.Composite(e,t,n):new wt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Bp,"")}static parseTrackName(e){const t=Wp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Xp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=wt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){He("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;Ke("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}wt.Composite=qp;wt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};wt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};wt.prototype.GetterByBindingType=[wt.prototype._getValue_direct,wt.prototype._getValue_array,wt.prototype._getValue_arrayElement,wt.prototype._getValue_toArray];wt.prototype.SetterByBindingTypeAndVersioning=[[wt.prototype._setValue_direct,wt.prototype._setValue_direct_setNeedsUpdate,wt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_array,wt.prototype._setValue_array_setNeedsUpdate,wt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_arrayElement,wt.prototype._setValue_arrayElement_setNeedsUpdate,wt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_fromArray,wt.prototype._setValue_fromArray_setNeedsUpdate,wt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class jh{constructor(e){this.value=e}clone(){return new jh(this.value.clone===void 0?this.value:this.value.clone())}}const Mc=class Mc{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};Mc.prototype.isMatrix2=!0;let Mu=Mc;function Su(s,e,t,n){const i=Yp(n);switch(t){case Ph:return s*e;case kl:return s*e/i.components*i.byteLength;case Gl:return s*e/i.components*i.byteLength;case rs:return s*e*2/i.components*i.byteLength;case Wl:return s*e*2/i.components*i.byteLength;case Lh:return s*e*3/i.components*i.byteLength;case In:return s*e*4/i.components*i.byteLength;case Xl:return s*e*4/i.components*i.byteLength;case va:case Ma:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Sa:case ya:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qo:case Jo:return Math.max(s,16)*Math.max(e,8)/4;case $o:case Zo:return Math.max(s,8)*Math.max(e,8)/2;case jo:case el:case nl:case il:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case tl:case wa:case sl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case rl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case al:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ol:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case ll:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case cl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case ul:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case hl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case dl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case fl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case pl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case ml:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case gl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case _l:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case xl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case vl:case Ml:case Sl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case yl:case bl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Aa:case El:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yp(s){switch(s){case yn:case wh:return{byteLength:1,components:1};case Mr:case Ah:case kn:return{byteLength:2,components:1};case Hl:case Vl:return{byteLength:2,components:4};case ti:case zl:case Ln:return{byteLength:4,components:1};case Rh:case Ch:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ul}}));typeof window<"u"&&(window.__THREE__?He("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ul);function ed(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Kp(s){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(s.bindBuffer(c,o),h.length===0)s.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],_=h[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const _=h[f];s.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var $p=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Zp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,em=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,nm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,im=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,sm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,am=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,om=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,lm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,cm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,dm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,pm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,mm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,gm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,_m=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,xm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Mm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Sm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ym=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Em=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Tm="gl_FragColor = linearToOutputTexel( gl_FragColor );",wm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Am=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Rm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Cm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Pm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Lm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Um=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Om=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Hm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Vm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,km=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Wm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Xm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ym=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Km=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$m=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,t0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,n0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,i0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,s0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,r0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,a0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,o0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,l0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,c0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,u0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,d0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,f0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,p0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,m0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,g0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,x0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,v0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,y0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,b0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,T0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,w0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,A0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,R0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,C0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,P0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,L0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,I0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,N0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,D0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,U0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,F0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,O0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,B0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,z0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,H0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,V0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,k0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,G0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,W0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,X0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,K0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Q0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,j0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ng=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ig=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,sg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ag=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,og=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ug=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,pg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,gg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,_g=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Mg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Eg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Tg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ag=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:$p,alphahash_pars_fragment:Qp,alphamap_fragment:Zp,alphamap_pars_fragment:Jp,alphatest_fragment:jp,alphatest_pars_fragment:em,aomap_fragment:tm,aomap_pars_fragment:nm,batching_pars_vertex:im,batching_vertex:sm,begin_vertex:rm,beginnormal_vertex:am,bsdfs:om,iridescence_fragment:lm,bumpmap_pars_fragment:cm,clipping_planes_fragment:um,clipping_planes_pars_fragment:hm,clipping_planes_pars_vertex:dm,clipping_planes_vertex:fm,color_fragment:pm,color_pars_fragment:mm,color_pars_vertex:gm,color_vertex:_m,common:xm,cube_uv_reflection_fragment:vm,defaultnormal_vertex:Mm,displacementmap_pars_vertex:Sm,displacementmap_vertex:ym,emissivemap_fragment:bm,emissivemap_pars_fragment:Em,colorspace_fragment:Tm,colorspace_pars_fragment:wm,envmap_fragment:Am,envmap_common_pars_fragment:Rm,envmap_pars_fragment:Cm,envmap_pars_vertex:Pm,envmap_physical_pars_fragment:Vm,envmap_vertex:Lm,fog_vertex:Im,fog_pars_vertex:Nm,fog_fragment:Dm,fog_pars_fragment:Um,gradientmap_pars_fragment:Fm,lightmap_pars_fragment:Om,lights_lambert_fragment:Bm,lights_lambert_pars_fragment:zm,lights_pars_begin:Hm,lights_toon_fragment:km,lights_toon_pars_fragment:Gm,lights_phong_fragment:Wm,lights_phong_pars_fragment:Xm,lights_physical_fragment:qm,lights_physical_pars_fragment:Ym,lights_fragment_begin:Km,lights_fragment_maps:$m,lights_fragment_end:Qm,lightprobes_pars_fragment:Zm,logdepthbuf_fragment:Jm,logdepthbuf_pars_fragment:jm,logdepthbuf_pars_vertex:e0,logdepthbuf_vertex:t0,map_fragment:n0,map_pars_fragment:i0,map_particle_fragment:s0,map_particle_pars_fragment:r0,metalnessmap_fragment:a0,metalnessmap_pars_fragment:o0,morphinstance_vertex:l0,morphcolor_vertex:c0,morphnormal_vertex:u0,morphtarget_pars_vertex:h0,morphtarget_vertex:d0,normal_fragment_begin:f0,normal_fragment_maps:p0,normal_pars_fragment:m0,normal_pars_vertex:g0,normal_vertex:_0,normalmap_pars_fragment:x0,clearcoat_normal_fragment_begin:v0,clearcoat_normal_fragment_maps:M0,clearcoat_pars_fragment:S0,iridescence_pars_fragment:y0,opaque_fragment:b0,packing:E0,premultiplied_alpha_fragment:T0,project_vertex:w0,dithering_fragment:A0,dithering_pars_fragment:R0,roughnessmap_fragment:C0,roughnessmap_pars_fragment:P0,shadowmap_pars_fragment:L0,shadowmap_pars_vertex:I0,shadowmap_vertex:N0,shadowmask_pars_fragment:D0,skinbase_vertex:U0,skinning_pars_vertex:F0,skinning_vertex:O0,skinnormal_vertex:B0,specularmap_fragment:z0,specularmap_pars_fragment:H0,tonemapping_fragment:V0,tonemapping_pars_fragment:k0,transmission_fragment:G0,transmission_pars_fragment:W0,uv_pars_fragment:X0,uv_pars_vertex:q0,uv_vertex:Y0,worldpos_vertex:K0,background_vert:$0,background_frag:Q0,backgroundCube_vert:Z0,backgroundCube_frag:J0,cube_vert:j0,cube_frag:eg,depth_vert:tg,depth_frag:ng,distance_vert:ig,distance_frag:sg,equirect_vert:rg,equirect_frag:ag,linedashed_vert:og,linedashed_frag:lg,meshbasic_vert:cg,meshbasic_frag:ug,meshlambert_vert:hg,meshlambert_frag:dg,meshmatcap_vert:fg,meshmatcap_frag:pg,meshnormal_vert:mg,meshnormal_frag:gg,meshphong_vert:_g,meshphong_frag:xg,meshphysical_vert:vg,meshphysical_frag:Mg,meshtoon_vert:Sg,meshtoon_frag:yg,points_vert:bg,points_frag:Eg,shadow_vert:Tg,shadow_frag:wg,sprite_vert:Ag,sprite_frag:Rg},Se={common:{diffuse:{value:new ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new Be(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new ge(16777215)},opacity:{value:1},center:{value:new Be(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},Zn={basic:{uniforms:hn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:hn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new ge(0)},envMapIntensity:{value:1}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:hn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new ge(0)},specular:{value:new ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:hn([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:hn([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new ge(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:hn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:hn([Se.points,Se.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:hn([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:hn([Se.common,Se.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:hn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:hn([Se.sprite,Se.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distance:{uniforms:hn([Se.common,Se.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distance_vert,fragmentShader:et.distance_frag},shadow:{uniforms:hn([Se.lights,Se.fog,{color:{value:new ge(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};Zn.physical={uniforms:hn([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new Be(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new Be},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new ge(0)},specularColor:{value:new ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new Be},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};const da={r:0,b:0,g:0},Cg=new Je,td=new Qe;td.set(-1,0,0,0,1,0,0,0,1);function Pg(s,e,t,n,i,r){const a=new ge(0);let o=i===!0?0:1,l,c,u=null,h=0,d=null;function f(S){let w=S.isScene===!0?S.background:null;if(w&&w.isTexture){const M=S.backgroundBlurriness>0;w=e.get(w,M)}return w}function p(S){let w=!1;const M=f(S);M===null?g(a,o):M&&M.isColor&&(g(M,1),w=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(S,w){const M=f(w);M&&(M.isCubeTexture||M.mapping===Fa)?(c===void 0&&(c=new Ve(new Bt(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:zs(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,y,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Cg.makeRotationFromEuler(w.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(td),c.material.toneMapped=ot.getTransfer(M.colorSpace)!==Et,(u!==M||h!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Ve(new tn(2,2),new Gn({name:"BackgroundMaterial",uniforms:zs(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:Hi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ot.getTransfer(M.colorSpace)!==Et,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,w){S.getRGB(da,Kh(s)),t.buffers.color.setClear(da.r,da.g,da.b,w,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,w=1){a.set(S),o=w,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:p,addToRenderList:_,dispose:m}}function Lg(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(I,N,U,P,B){let V=!1;const q=h(I,P,U,N);r!==q&&(r=q,c(r.object)),V=f(I,P,U,B),V&&p(I,P,U,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,M(I,N,U,P),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return s.createVertexArray()}function c(I){return s.bindVertexArray(I)}function u(I){return s.deleteVertexArray(I)}function h(I,N,U,P){const B=P.wireframe===!0;let V=n[N.id];V===void 0&&(V={},n[N.id]=V);const q=I.isInstancedMesh===!0?I.id:0;let Q=V[q];Q===void 0&&(Q={},V[q]=Q);let X=Q[U.id];X===void 0&&(X={},Q[U.id]=X);let Y=X[B];return Y===void 0&&(Y=d(l()),X[B]=Y),Y}function d(I){const N=[],U=[],P=[];for(let B=0;B<t;B++)N[B]=0,U[B]=0,P[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:U,attributeDivisors:P,object:I,attributes:{},index:null}}function f(I,N,U,P){const B=r.attributes,V=N.attributes;let q=0;const Q=U.getAttributes();for(const X in Q)if(Q[X].location>=0){const j=B[X];let se=V[X];if(se===void 0&&(X==="instanceMatrix"&&I.instanceMatrix&&(se=I.instanceMatrix),X==="instanceColor"&&I.instanceColor&&(se=I.instanceColor)),j===void 0||j.attribute!==se||se&&j.data!==se.data)return!0;q++}return r.attributesNum!==q||r.index!==P}function p(I,N,U,P){const B={},V=N.attributes;let q=0;const Q=U.getAttributes();for(const X in Q)if(Q[X].location>=0){let j=V[X];j===void 0&&(X==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),X==="instanceColor"&&I.instanceColor&&(j=I.instanceColor));const se={};se.attribute=j,j&&j.data&&(se.data=j.data),B[X]=se,q++}r.attributes=B,r.attributesNum=q,r.index=P}function _(){const I=r.newAttributes;for(let N=0,U=I.length;N<U;N++)I[N]=0}function g(I){m(I,0)}function m(I,N){const U=r.newAttributes,P=r.enabledAttributes,B=r.attributeDivisors;U[I]=1,P[I]===0&&(s.enableVertexAttribArray(I),P[I]=1),B[I]!==N&&(s.vertexAttribDivisor(I,N),B[I]=N)}function S(){const I=r.newAttributes,N=r.enabledAttributes;for(let U=0,P=N.length;U<P;U++)N[U]!==I[U]&&(s.disableVertexAttribArray(U),N[U]=0)}function w(I,N,U,P,B,V,q){q===!0?s.vertexAttribIPointer(I,N,U,B,V):s.vertexAttribPointer(I,N,U,P,B,V)}function M(I,N,U,P){_();const B=P.attributes,V=U.getAttributes(),q=N.defaultAttributeValues;for(const Q in V){const X=V[Q];if(X.location>=0){let Y=B[Q];if(Y===void 0&&(Q==="instanceMatrix"&&I.instanceMatrix&&(Y=I.instanceMatrix),Q==="instanceColor"&&I.instanceColor&&(Y=I.instanceColor)),Y!==void 0){const j=Y.normalized,se=Y.itemSize,Z=e.get(Y);if(Z===void 0)continue;const ue=Z.buffer,oe=Z.type,fe=Z.bytesPerElement,H=oe===s.INT||oe===s.UNSIGNED_INT||Y.gpuType===zl;if(Y.isInterleavedBufferAttribute){const K=Y.data,pe=K.stride,ze=Y.offset;if(K.isInstancedInterleavedBuffer){for(let he=0;he<X.locationSize;he++)m(X.location+he,K.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let he=0;he<X.locationSize;he++)g(X.location+he);s.bindBuffer(s.ARRAY_BUFFER,ue);for(let he=0;he<X.locationSize;he++)w(X.location+he,se/X.locationSize,oe,j,pe*fe,(ze+se/X.locationSize*he)*fe,H)}else{if(Y.isInstancedBufferAttribute){for(let K=0;K<X.locationSize;K++)m(X.location+K,Y.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let K=0;K<X.locationSize;K++)g(X.location+K);s.bindBuffer(s.ARRAY_BUFFER,ue);for(let K=0;K<X.locationSize;K++)w(X.location+K,se/X.locationSize,oe,j,se*fe,se/X.locationSize*K*fe,H)}}else if(q!==void 0){const j=q[Q];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(X.location,j);break;case 3:s.vertexAttrib3fv(X.location,j);break;case 4:s.vertexAttrib4fv(X.location,j);break;default:s.vertexAttrib1fv(X.location,j)}}}}S()}function b(){T();for(const I in n){const N=n[I];for(const U in N){const P=N[U];for(const B in P){const V=P[B];for(const q in V)u(V[q].object),delete V[q];delete P[B]}}delete n[I]}}function y(I){if(n[I.id]===void 0)return;const N=n[I.id];for(const U in N){const P=N[U];for(const B in P){const V=P[B];for(const q in V)u(V[q].object),delete V[q];delete P[B]}}delete n[I.id]}function R(I){for(const N in n){const U=n[N];for(const P in U){const B=U[P];if(B[I.id]===void 0)continue;const V=B[I.id];for(const q in V)u(V[q].object),delete V[q];delete B[I.id]}}}function x(I){for(const N in n){const U=n[N],P=I.isInstancedMesh===!0?I.id:0,B=U[P];if(B!==void 0){for(const V in B){const q=B[V];for(const Q in q)u(q[Q].object),delete q[Q];delete B[V]}delete U[P],Object.keys(U).length===0&&delete n[N]}}}function T(){A(),a=!0,r!==i&&(r=i,c(r.object))}function A(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:T,resetDefaultState:A,dispose:b,releaseStatesOfGeometry:y,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:g,disableUnusedAttributes:S}}function Ig(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Ng(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==In&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===kn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==yn&&R!==Ln&&!x&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(He("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&He("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),y=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:M,maxSamples:b,samples:y}}function Dg(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Fi,o=new Qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||i;return i=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,m=s.get(h);if(!i||p===null||p.length===0||r&&!g)r?u(null):c();else{const S=r?0:n,w=S*4;let M=m.clippingState||null;l.value=M,M=u(p,d,w,f);for(let b=0;b!==w;++b)M[b]=t[b];m.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,p){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=l.value,p!==!0||g===null){const m=f+_*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<m)&&(g=new Float32Array(m));for(let w=0,M=f;w!==_;++w,M+=4)a.copy(h[w]).applyMatrix4(S,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}const Ls=4,Ug=6,Fg=20,Og=256,rr=new Ur,yu=new ge;let Ao=null,Ro=0,Co=0,Po=!1;const Bg=new L,Yi=new L;class Al{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=Bg}=r;Ao=this._renderer.getRenderTarget(),Ro=this._renderer.getActiveCubeFace(),Co=this._renderer.getActiveMipmapLevel(),Po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ao,Ro,Co),this._renderer.xr.enabled=Po,e.scissorTest=!1,Rs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ss||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ao=this._renderer.getRenderTarget(),Ro=this._renderer.getActiveCubeFace(),Co=this._renderer.getActiveMipmapLevel(),Po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Yt,minFilter:Yt,generateMipmaps:!1,type:kn,format:In,colorSpace:pn,depthBuffer:!1},i=bu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bu(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=zg(r)),this._blurMaterial=Vg(r,e,t),this._ggxMaterial=Hg(r,e,t)}return i}_compileMaterial(e){const t=new Ve(new ft,e);this._renderer.compile(t,rr)}_sceneToCubeUV(e,t,n,i,r){const l=new dn(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(yu),h.toneMapping=Hn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ve(new Bt,new Mt({name:"PMREM.Background",side:fn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let m=!1;const S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,m=!0):(g.color.copy(yu),m=!0);for(let w=0;w<6;w++){const M=w%3;M===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[w],r.y,r.z)):M===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[w]));const b=this._cubeSize;Rs(i,M*b,w>2?b:0,b,b),h.setRenderTarget(i),m&&h.render(_,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===ss||e.mapping===Os;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eu());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Rs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,rr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=c*1.25,f=h*d,{_lodMax:p}=this,_=this._sizeLods[n],g=3*_*(n>p-Ls?n-p+Ls:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,Rs(r,g,m,3*_,2*_),i.setRenderTarget(r),i.render(o,rr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Rs(e,g,m,3*_,2*_),i.setRenderTarget(e),i.render(o,rr)}_blur(e,t,n,i){const r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const u=this._sizeLods[i],h=3*u*(i>this._lodMax-Ls?i-this._lodMax+Ls:0),d=4*(this._cubeSize-u);Rs(t,h,d,3*u,2*u),a.setRenderTarget(t),a.render(l,rr)}}function zg(s){const e=[],t=[];let n=s;const i=s-Ls+1+Ug;for(let r=0;r<i;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],h=6,d=6,f=3,p=new Float32Array(f*d*h),_=new Float32Array(f*d*h);for(let m=0;m<h;m++){const S=m%3*2/3-1,w=m>2?0:-1,M=[S,w,0,S+2/3,w,0,S+2/3,w+1,0,S,w,0,S+2/3,w+1,0,S,w+1,0];p.set(M,f*d*m);for(let b=0;b<d;b++){const y=u[b*2]*2-1,R=u[b*2+1]*2-1;m===0?Yi.set(1,R,y):m===1?Yi.set(-y,1,-R):m===2?Yi.set(-y,R,1):m===3?Yi.set(-1,R,-y):m===4?Yi.set(-y,-1,R):Yi.set(y,R,-1),Yi.toArray(_,(m*d+b)*f)}}const g=new ft;g.setAttribute("position",new xt(p,f)),g.setAttribute("outputDirection",new xt(_,f)),t.push(new Ve(g,null)),n>Ls&&n--}return{lodMeshes:t,sizeLods:e}}function bu(s,e,t){const n=new Nn(s,e,t);return n.texture.mapping=Fa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Rs(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Hg(s,e,t){return new Gn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Og,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wa(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Vg(s,e,t){return new Gn({name:"SphericalGaussianBlur",defines:{SAMPLES:Fg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Wa(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Eu(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Tu(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Wa(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class nd extends Nn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new qh(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Bt(5,5,5),r=new Gn({name:"CubemapFromEquirect",uniforms:zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:fn,blending:fi});r.uniforms.tEquirect.value=t;const a=new Ve(i,r),o=t.minFilter;return t.minFilter===jn&&(t.minFilter=Yt),new Fp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function kg(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ya||f===Ka)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new nd(p.height);return _.fromEquirectangularTexture(s,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Ya||f===Ka,_=f===ss||f===Os;if(p||_){let g=t.get(d);const m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new Al(s)),g=p?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const S=d.image;return p&&S&&S.height>0||_&&S&&l(S)?(n===null&&(n=new Al(s)),g=p?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",u),g.texture):null}}}return d}function o(d,f){return f===Ya?d.mapping=ss:f===Ka&&(d.mapping=Os),d}function l(d){let f=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:h}}function Gg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Ns("WebGLRenderer: "+n+" extension not supported."),i}}}function Wg(s,e,t,n){const i={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const S=f.array;_=f.version;for(let w=0,M=S.length;w<M;w+=3){const b=S[w+0],y=S[w+1],R=S[w+2];d.push(b,y,y,R,R,b)}}else{const S=p.array;_=p.version;for(let w=0,M=S.length/3-1;w<M;w+=3){const b=w+0,y=w+1,R=w+2;d.push(b,y,y,R,R,b)}}const g=new(p.count>=65535?Vh:Hh)(d,1);g.version=_;const m=r.get(h);m&&e.remove(m),r.set(h,g)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Xg(s,e,t){let n;function i(h){n=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,d){s.drawElements(n,d,r,h*a),t.update(d,n,1)}function c(h,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,h*a,f),t.update(d,n,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,h,0,f);let _=0;for(let g=0;g<f;g++)_+=d[g];t.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function qg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Ke("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Yg(s,e,t){const n=new WeakMap,i=new Ct;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let T=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let w=0;f===!0&&(w=1),p===!0&&(w=2),_===!0&&(w=3);let M=o.attributes.position.count*w,b=1;M>e.maxTextureSize&&(b=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const y=new Float32Array(M*b*4*h),R=new Fh(y,M,b,h);R.type=Ln,R.needsUpdate=!0;const x=w*4;for(let A=0;A<h;A++){const I=g[A],N=m[A],U=S[A],P=M*b*4*A;for(let B=0;B<I.count;B++){const V=B*x;f===!0&&(i.fromBufferAttribute(I,B),y[P+V+0]=i.x,y[P+V+1]=i.y,y[P+V+2]=i.z,y[P+V+3]=0),p===!0&&(i.fromBufferAttribute(N,B),y[P+V+4]=i.x,y[P+V+5]=i.y,y[P+V+6]=i.z,y[P+V+7]=0),_===!0&&(i.fromBufferAttribute(U,B),y[P+V+8]=i.x,y[P+V+9]=i.y,y[P+V+10]=i.z,y[P+V+11]=U.itemSize===4?i.w:1)}}d={count:h,texture:R,size:new Be(M,b)},n.set(o,d),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Kg(s,e,t,n,i){let r=new WeakMap;function a(c){const u=i.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==u&&(e.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const $g={[Ol]:"LINEAR_TONE_MAPPING",[vh]:"REINHARD_TONE_MAPPING",[Mh]:"CINEON_TONE_MAPPING",[Bl]:"ACES_FILMIC_TONE_MAPPING",[yh]:"AGX_TONE_MAPPING",[bh]:"NEUTRAL_TONE_MAPPING",[Sh]:"CUSTOM_TONE_MAPPING"};function Qg(s,e,t,n,i,r){const a=new Nn(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new ft;c.setAttribute("position",new tt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new tt([0,2,0,0,2,0],2));const u=new cp({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Ve(c,u),d=new Ur(-1,1,1,-1,0,1);let f=null,p=null,_=!1,g,m=null,S=[],w=!1;this.setSize=function(M,b){a.setSize(M,b),o!==null&&o.setSize(M,b),l!==null&&l.setSize(M,b);for(let y=0;y<S.length;y++){const R=S[y];R.setSize&&R.setSize(M,b)}},this.setEffects=function(M){S=M,w=S.length>0&&S[0].isRenderPass===!0;const b=a.width,y=a.height;S.length>0&&o===null&&(o=new Nn(b,y,{type:kn,depthBuffer:!1,stencilBuffer:!1}),l=new Nn(b,y,{type:kn,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<S.length;R++){const x=S[R];x.setSize&&x.setSize(b,y)}},this.begin=function(M,b){if(_||M.toneMapping===Hn&&S.length===0)return!1;if(m=b,b!==null){const y=b.width,R=b.height;(a.width!==y||a.height!==R)&&this.setSize(y,R)}return w===!1&&M.setRenderTarget(a),g=M.toneMapping,M.toneMapping=Hn,!0},this.hasRenderPass=function(){return w},this.end=function(M,b){M.toneMapping=g,_=!0;let y=a,R=o;for(let x=0;x<S.length;x++){const T=S[x];T.enabled!==!1&&(T.render(M,R,y,b),T.needsSwap!==!1&&(y=R,R=R===o?l:o))}if(f!==M.outputColorSpace||p!==M.toneMapping){f=M.outputColorSpace,p=M.toneMapping,u.defines={},ot.getTransfer(f)===Et&&(u.defines.SRGB_TRANSFER="");const x=$g[p];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=y.texture,M.setRenderTarget(m),M.render(h,d),m=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}const id=new Kt,Rl=new Cr(1,1),sd=new Fh,rd=new Df,ad=new qh,wu=[],Au=[],Ru=new Float32Array(16),Cu=new Float32Array(9),Pu=new Float32Array(4);function qs(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=wu[i];if(r===void 0&&(r=new Float32Array(i),wu[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function $t(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Qt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Xa(s,e){let t=Au[e];t===void 0&&(t=new Int32Array(e),Au[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Zg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Jg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;s.uniform2fv(this.addr,e),Qt(t,e)}}function jg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($t(t,e))return;s.uniform3fv(this.addr,e),Qt(t,e)}}function e_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;s.uniform4fv(this.addr,e),Qt(t,e)}}function t_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Qt(t,e)}else{if($t(t,n))return;Pu.set(n),s.uniformMatrix2fv(this.addr,!1,Pu),Qt(t,n)}}function n_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Qt(t,e)}else{if($t(t,n))return;Cu.set(n),s.uniformMatrix3fv(this.addr,!1,Cu),Qt(t,n)}}function i_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Qt(t,e)}else{if($t(t,n))return;Ru.set(n),s.uniformMatrix4fv(this.addr,!1,Ru),Qt(t,n)}}function s_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function r_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;s.uniform2iv(this.addr,e),Qt(t,e)}}function a_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;s.uniform3iv(this.addr,e),Qt(t,e)}}function o_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;s.uniform4iv(this.addr,e),Qt(t,e)}}function l_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function c_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;s.uniform2uiv(this.addr,e),Qt(t,e)}}function u_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;s.uniform3uiv(this.addr,e),Qt(t,e)}}function h_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;s.uniform4uiv(this.addr,e),Qt(t,e)}}function d_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Rl.compareFunction=t.isReversedDepthBuffer()?Yl:ql,r=Rl):r=id,t.setTexture2D(e||r,i)}function f_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||rd,i)}function p_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ad,i)}function m_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||sd,i)}function g_(s){switch(s){case 5126:return Zg;case 35664:return Jg;case 35665:return jg;case 35666:return e_;case 35674:return t_;case 35675:return n_;case 35676:return i_;case 5124:case 35670:return s_;case 35667:case 35671:return r_;case 35668:case 35672:return a_;case 35669:case 35673:return o_;case 5125:return l_;case 36294:return c_;case 36295:return u_;case 36296:return h_;case 35678:case 36198:case 36298:case 36306:case 35682:return d_;case 35679:case 36299:case 36307:return f_;case 35680:case 36300:case 36308:case 36293:return p_;case 36289:case 36303:case 36311:case 36292:return m_}}function __(s,e){s.uniform1fv(this.addr,e)}function x_(s,e){const t=qs(e,this.size,2);s.uniform2fv(this.addr,t)}function v_(s,e){const t=qs(e,this.size,3);s.uniform3fv(this.addr,t)}function M_(s,e){const t=qs(e,this.size,4);s.uniform4fv(this.addr,t)}function S_(s,e){const t=qs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function y_(s,e){const t=qs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function b_(s,e){const t=qs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function E_(s,e){s.uniform1iv(this.addr,e)}function T_(s,e){s.uniform2iv(this.addr,e)}function w_(s,e){s.uniform3iv(this.addr,e)}function A_(s,e){s.uniform4iv(this.addr,e)}function R_(s,e){s.uniform1uiv(this.addr,e)}function C_(s,e){s.uniform2uiv(this.addr,e)}function P_(s,e){s.uniform3uiv(this.addr,e)}function L_(s,e){s.uniform4uiv(this.addr,e)}function I_(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);$t(n,r)||(s.uniform1iv(this.addr,r),Qt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Rl:a=id;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function N_(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);$t(n,r)||(s.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||rd,r[a])}function D_(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);$t(n,r)||(s.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||ad,r[a])}function U_(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);$t(n,r)||(s.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||sd,r[a])}function F_(s){switch(s){case 5126:return __;case 35664:return x_;case 35665:return v_;case 35666:return M_;case 35674:return S_;case 35675:return y_;case 35676:return b_;case 5124:case 35670:return E_;case 35667:case 35671:return T_;case 35668:case 35672:return w_;case 35669:case 35673:return A_;case 5125:return R_;case 36294:return C_;case 36295:return P_;case 36296:return L_;case 35678:case 36198:case 36298:case 36306:case 35682:return I_;case 35679:case 36299:case 36307:return N_;case 35680:case 36300:case 36308:case 36293:return D_;case 36289:case 36303:case 36311:case 36292:return U_}}class O_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=g_(t.type)}}class B_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=F_(t.type)}}class z_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Lo=/(\w+)(\])?(\[|\.)?/g;function Lu(s,e){s.seq.push(e),s.map[e.id]=e}function H_(s,e,t){const n=s.name,i=n.length;for(Lo.lastIndex=0;;){const r=Lo.exec(n),a=Lo.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Lu(t,c===void 0?new O_(o,s,e):new B_(o,s,e));break}else{let h=t.map[o];h===void 0&&(h=new z_(o),Lu(t,h)),t=h}}}class Ea{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);H_(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Iu(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const V_=37297;let k_=0;function G_(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Nu=new Qe;function W_(s){ot._getMatrix(Nu,ot.workingColorSpace,s);const e=`mat3( ${Nu.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(s)){case Ra:return[e,"LinearTransferOETF"];case Et:return[e,"sRGBTransferOETF"];default:return He("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Du(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+G_(s.getShaderSource(e),o)}else return r}function X_(s,e){const t=W_(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const q_={[Ol]:"Linear",[vh]:"Reinhard",[Mh]:"Cineon",[Bl]:"ACESFilmic",[yh]:"AgX",[bh]:"Neutral",[Sh]:"Custom"};function Y_(s,e){const t=q_[e];return t===void 0?(He("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fa=new L;function K_(){ot.getLuminanceCoefficients(fa);const s=fa.x.toFixed(4),e=fa.y.toFixed(4),t=fa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(dr).join(`
`)}function Q_(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Z_(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function dr(s){return s!==""}function Uu(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fu(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const J_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Cl(s){return s.replace(J_,ex)}const j_=new Map;function ex(s,e){let t=et[e];if(t===void 0){const n=j_.get(e);if(n!==void 0)t=et[n],He('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Cl(t)}const tx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ou(s){return s.replace(tx,nx)}function nx(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Bu(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const ix={[pr]:"SHADOWMAP_TYPE_PCF",[ur]:"SHADOWMAP_TYPE_VSM"};function sx(s){return ix[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const rx={[ss]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[Fa]:"ENVMAP_TYPE_CUBE_UV"};function ax(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":rx[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const ox={[Os]:"ENVMAP_MODE_REFRACTION"};function lx(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":ox[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const cx={[Fl]:"ENVMAP_BLENDING_MULTIPLY",[qd]:"ENVMAP_BLENDING_MIX",[Yd]:"ENVMAP_BLENDING_ADD"};function ux(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":cx[s.combine]||"ENVMAP_BLENDING_NONE"}function hx(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function dx(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=sx(t),c=ax(t),u=lx(t),h=ux(t),d=hx(t),f=$_(t),p=Q_(r),_=i.createProgram();let g,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(dr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(dr).join(`
`),m.length>0&&(m+=`
`)):(g=[Bu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(dr).join(`
`),m=[Bu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?et.tonemapping_pars_fragment:"",t.toneMapping!==Hn?Y_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,X_("linearToOutputTexel",t.outputColorSpace),K_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(dr).join(`
`)),a=Cl(a),a=Uu(a,t),a=Fu(a,t),o=Cl(o),o=Uu(o,t),o=Fu(o,t),a=Ou(a),o=Ou(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const w=S+g+a,M=S+m+o,b=Iu(i,i.VERTEX_SHADER,w),y=Iu(i,i.FRAGMENT_SHADER,M);i.attachShader(_,b),i.attachShader(_,y),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(I){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(_)||"",U=i.getShaderInfoLog(b)||"",P=i.getShaderInfoLog(y)||"",B=N.trim(),V=U.trim(),q=P.trim();let Q=!0,X=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,b,y);else{const Y=Du(i,b,"vertex"),j=Du(i,y,"fragment");Ke("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+B+`
`+Y+`
`+j)}else B!==""?He("WebGLProgram: Program Info Log:",B):(V===""||q==="")&&(X=!1);X&&(I.diagnostics={runnable:Q,programLog:B,vertexShader:{log:V,prefix:g},fragmentShader:{log:q,prefix:m}})}i.deleteShader(b),i.deleteShader(y),x=new Ea(i,_),T=Z_(i,_)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=i.getProgramParameter(_,V_)),A},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=k_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=y,this}let fx=0;class px{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new mx(e),t.set(e,n)),n}}class mx{constructor(e){this.id=fx++,this.code=e,this.usedTimes=0}}function gx(s){return s===rs||s===wa||s===Aa}function _x(s,e,t,n,i,r){const a=new Oh,o=new px,l=new Set,c=[],u=new Map,h=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,T,A,I,N,U){const P=I.fog,B=N.geometry,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,q=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Q=e.get(x.envMap||V,q),X=Q&&Q.mapping===Fa?Q.image.height:null,Y=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&He("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const j=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,se=j!==void 0?j.length:0;let Z=0;B.morphAttributes.position!==void 0&&(Z=1),B.morphAttributes.normal!==void 0&&(Z=2),B.morphAttributes.color!==void 0&&(Z=3);let ue,oe,fe,H;if(Y){const bt=Zn[Y];ue=bt.vertexShader,oe=bt.fragmentShader}else{ue=x.vertexShader,oe=x.fragmentShader;const bt=o.getVertexShaderStage(x),mt=o.getFragmentShaderStage(x);o.update(x,bt,mt),fe=bt.id,H=mt.id}const K=s.getRenderTarget(),pe=s.state.buffers.depth.getReversed(),ze=N.isInstancedMesh===!0,he=N.isBatchedMesh===!0,Ge=!!x.map,Te=!!x.matcap,ke=!!Q,$e=!!x.aoMap,st=!!x.lightMap,Ye=!!x.bumpMap&&x.wireframe===!1,lt=!!x.normalMap,ut=!!x.displacementMap,Nt=!!x.emissiveMap,ht=!!x.metalnessMap,St=!!x.roughnessMap,O=x.anisotropy>0,Ht=x.clearcoat>0,pt=x.dispersion>0,C=x.retroreflectivity>0,v=x.iridescence>0,z=x.sheen>0,W=x.transmission>0,J=O&&!!x.anisotropyMap,ce=Ht&&!!x.clearcoatMap,me=Ht&&!!x.clearcoatNormalMap,ee=Ht&&!!x.clearcoatRoughnessMap,ie=v&&!!x.iridescenceMap,ve=v&&!!x.iridescenceThicknessMap,De=z&&!!x.sheenColorMap,Me=z&&!!x.sheenRoughnessMap,le=!!x.specularMap,Ue=!!x.specularColorMap,Xe=!!x.specularIntensityMap,Ze=W&&!!x.transmissionMap,F=W&&!!x.thicknessMap,_e=!!x.gradientMap,te=!!x.alphaMap,xe=x.alphaTest>0,ye=!!x.alphaHash,re=!!x.extensions;let Fe=Hn;x.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Fe=s.toneMapping);const Ce={shaderID:Y,shaderType:x.type,shaderName:x.name,vertexShader:ue,fragmentShader:oe,defines:x.defines,customVertexShaderID:fe,customFragmentShaderID:H,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:he,batchingColor:he&&N._colorsTexture!==null,instancing:ze,instancingColor:ze&&N.instanceColor!==null,instancingMorph:ze&&N.morphTexture!==null,outputColorSpace:K===null?s.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ge,matcap:Te,envMap:ke,envMapMode:ke&&Q.mapping,envMapCubeUVHeight:X,aoMap:$e,lightMap:st,bumpMap:Ye,normalMap:lt,displacementMap:ut,emissiveMap:Nt,normalMapObjectSpace:lt&&x.normalMapType===Jd,normalMapTangentSpace:lt&&x.normalMapType===Er,packedNormalMap:lt&&x.normalMapType===Er&&gx(x.normalMap.format),metalnessMap:ht,roughnessMap:St,anisotropy:O,anisotropyMap:J,clearcoat:Ht,clearcoatMap:ce,clearcoatNormalMap:me,clearcoatRoughnessMap:ee,dispersion:pt,retroreflection:C,iridescence:v,iridescenceMap:ie,iridescenceThicknessMap:ve,sheen:z,sheenColorMap:De,sheenRoughnessMap:Me,specularMap:le,specularColorMap:Ue,specularIntensityMap:Xe,transmission:W,transmissionMap:Ze,thicknessMap:F,gradientMap:_e,opaque:x.transparent===!1&&x.blending===zi&&x.alphaToCoverage===!1,alphaMap:te,alphaTest:xe,alphaHash:ye,combine:x.combine,mapUv:Ge&&p(x.map.channel),aoMapUv:$e&&p(x.aoMap.channel),lightMapUv:st&&p(x.lightMap.channel),bumpMapUv:Ye&&p(x.bumpMap.channel),normalMapUv:lt&&p(x.normalMap.channel),displacementMapUv:ut&&p(x.displacementMap.channel),emissiveMapUv:Nt&&p(x.emissiveMap.channel),metalnessMapUv:ht&&p(x.metalnessMap.channel),roughnessMapUv:St&&p(x.roughnessMap.channel),anisotropyMapUv:J&&p(x.anisotropyMap.channel),clearcoatMapUv:ce&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:me&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:De&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Me&&p(x.sheenRoughnessMap.channel),specularMapUv:le&&p(x.specularMap.channel),specularColorMapUv:Ue&&p(x.specularColorMap.channel),specularIntensityMapUv:Xe&&p(x.specularIntensityMap.channel),transmissionMapUv:Ze&&p(x.transmissionMap.channel),thicknessMapUv:F&&p(x.thicknessMap.channel),alphaMapUv:te&&p(x.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(lt||O),vertexNormals:!!B.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!B.attributes.uv&&(Ge||te),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||B.attributes.normal===void 0&&lt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pe,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:Z,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:U.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&A.length>0,shadowMapType:s.shadowMap.type,toneMapping:Fe,decodeVideoTexture:Ge&&x.map.isVideoTexture===!0&&ot.getTransfer(x.map.colorSpace)===Et,decodeVideoTextureEmissive:Nt&&x.emissiveMap.isVideoTexture===!0&&ot.getTransfer(x.emissiveMap.colorSpace)===Et,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Wt,flipSided:x.side===fn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:re&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&x.extensions.multiDraw===!0||he)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function g(x){const T=[];if(x.shaderID?T.push(x.shaderID):(T.push(x.customVertexShaderID),T.push(x.customFragmentShaderID)),x.defines!==void 0)for(const A in x.defines)T.push(A),T.push(x.defines[A]);return x.isRawShaderMaterial===!1&&(m(T,x),S(T,x),T.push(s.outputColorSpace)),T.push(x.customProgramCacheKey),T.join()}function m(x,T){x.push(T.precision),x.push(T.outputColorSpace),x.push(T.envMapMode),x.push(T.envMapCubeUVHeight),x.push(T.mapUv),x.push(T.alphaMapUv),x.push(T.lightMapUv),x.push(T.aoMapUv),x.push(T.bumpMapUv),x.push(T.normalMapUv),x.push(T.displacementMapUv),x.push(T.emissiveMapUv),x.push(T.metalnessMapUv),x.push(T.roughnessMapUv),x.push(T.anisotropyMapUv),x.push(T.clearcoatMapUv),x.push(T.clearcoatNormalMapUv),x.push(T.clearcoatRoughnessMapUv),x.push(T.iridescenceMapUv),x.push(T.iridescenceThicknessMapUv),x.push(T.sheenColorMapUv),x.push(T.sheenRoughnessMapUv),x.push(T.specularMapUv),x.push(T.specularColorMapUv),x.push(T.specularIntensityMapUv),x.push(T.transmissionMapUv),x.push(T.thicknessMapUv),x.push(T.combine),x.push(T.fogExp2),x.push(T.sizeAttenuation),x.push(T.morphTargetsCount),x.push(T.morphAttributeCount),x.push(T.numSunLights),x.push(T.numDirLights),x.push(T.numPointLights),x.push(T.numSpotLights),x.push(T.numSpotLightMaps),x.push(T.numHemiLights),x.push(T.numRectAreaLights),x.push(T.numSunLightShadows),x.push(T.numDirLightShadows),x.push(T.numPointLightShadows),x.push(T.numSpotLightShadows),x.push(T.numSpotLightShadowsWithMaps),x.push(T.numLightProbes),x.push(T.shadowMapType),x.push(T.toneMapping),x.push(T.numClippingPlanes),x.push(T.numClipIntersection),x.push(T.depthPacking)}function S(x,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function w(x){const T=f[x.type];let A;if(T){const I=Zn[T];A=ap.clone(I.uniforms)}else A=x.uniforms;return A}function M(x,T){let A=u.get(T);return A!==void 0?++A.usedTimes:(A=new dx(s,T,x,i),c.push(A),u.set(T,A)),A}function b(x){if(--x.usedTimes===0){const T=c.indexOf(x);c[T]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function y(x){o.remove(x)}function R(){o.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:w,acquireProgram:M,releaseProgram:b,releaseShaderCache:y,programs:c,dispose:R}}function xx(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function vx(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function zu(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Hu(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,_,g,m){let S=s[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:g,group:m},s[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=p,S.materialVariant=a(d),S.groupOrder=_,S.renderOrder=d.renderOrder,S.z=g,S.group=m),e++,S}function l(d,f,p,_,g,m,S){S.reversedDepth===!0&&(g=-g);const w=o(d,f,p,_,g,m);p.transmission>0?n.push(w):p.transparent===!0?i.push(w):t.push(w)}function c(d,f,p,_,g,m){const S=o(d,f,p,_,g,m);p.transmission>0?n.unshift(S):p.transparent===!0?i.unshift(S):t.unshift(S)}function u(d,f){t.length>1&&t.sort(d||vx),n.length>1&&n.sort(f||zu),i.length>1&&i.sort(f||zu)}function h(){for(let d=e,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:h,sort:u}}function Mx(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new Hu,s.set(n,[a])):i>=r.length?(a=new Hu,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Sx(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new ge};break;case"SpotLight":t={position:new L,direction:new L,color:new ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new ge,groundColor:new ge};break;case"RectAreaLight":t={color:new ge,position:new L,halfWidth:new L,halfHeight:new L};break}return s[e.id]=t,t}}}function yx(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let bx=0;function Ex(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Tx(s){const e=new Sx,t=yx(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const i=new L,r=new Je,a=new Je;function o(c){let u=0,h=0,d=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let f=0,p=0,_=0,g=0,m=0,S=0,w=0,M=0,b=0,y=0,R=0,x=0,T=0,A=0;c.sort(Ex);for(let N=0,U=c.length;N<U;N++){const P=c[N],B=P.color,V=P.intensity,q=P.distance;let Q=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===rs?Q=P.shadow.map.texture:Q=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=B.r*V,h+=B.g*V,d+=B.b*V;else if(P.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(P.sh.coefficients[X],V);A++}else if(P.isSunLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Y=P.shadow,j=t.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),n.sunShadow[p]=j,n.sunShadowMap[p]=Q;const se=Y.getViewportCount();for(let Z=0;Z<se;Z++)n.sunShadowMatrix[_+Z]=Y.getMatrix(Z),n.sunShadowCascade[_+Z]=Y._cascadeData[Z];_+=se,p++}n.sun[f]=X,f++}else if(P.isDirectionalLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Y=P.shadow,j=t.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,n.directionalShadow[g]=j,n.directionalShadowMap[g]=Q,n.directionalShadowMatrix[g]=P.shadow.matrix,b++}n.directional[g]=X,g++}else if(P.isSpotLight){const X=e.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(B).multiplyScalar(V),X.distance=q,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,n.spot[S]=X;const Y=P.shadow;if(P.map&&(n.spotLightMap[x]=P.map,x++,Y.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[S]=Y.matrix,P.castShadow){const j=t.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,n.spotShadow[S]=j,n.spotShadowMap[S]=Q,R++}S++}else if(P.isRectAreaLight){const X=e.get(P);X.color.copy(B).multiplyScalar(V),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),n.rectArea[w]=X,w++}else if(P.isPointLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){const Y=P.shadow,j=t.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,j.shadowCameraNear=Y.camera.near,j.shadowCameraFar=Y.camera.far,n.pointShadow[m]=j,n.pointShadowMap[m]=Q,n.pointShadowMatrix[m]=P.shadow.matrix,y++}n.point[m]=X,m++}else if(P.isHemisphereLight){const X=e.get(P);X.skyColor.copy(P.color).multiplyScalar(V),X.groundColor.copy(P.groundColor).multiplyScalar(V),n.hemi[M]=X,M++}}w>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const I=n.hash;(I.sunLength!==f||I.directionalLength!==g||I.pointLength!==m||I.spotLength!==S||I.rectAreaLength!==w||I.hemiLength!==M||I.numSunShadows!==p||I.numDirectionalShadows!==b||I.numPointShadows!==y||I.numSpotShadows!==R||I.numSpotMaps!==x||I.numLightProbes!==A)&&(n.sun.length=f,n.directional.length=g,n.spot.length=S,n.rectArea.length=w,n.point.length=m,n.hemi.length=M,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=y,n.pointShadowMap.length=y,n.pointShadowMatrix.length=y,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+x-T,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,I.sunLength=f,I.directionalLength=g,I.pointLength=m,I.spotLength=S,I.rectAreaLength=w,I.hemiLength=M,I.numSunShadows=p,I.numDirectionalShadows=b,I.numPointShadows=y,I.numSpotShadows=R,I.numSpotMaps=x,I.numLightProbes=A,n.version=bx++)}function l(c,u){let h=0,d=0,f=0,p=0,_=0,g=0;const m=u.matrixWorldInverse;for(let S=0,w=c.length;S<w;S++){const M=c[S];if(M.isSunLight){const b=n.sun[h];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),h++}else if(M.isDirectionalLight){const b=n.directional[d];b.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),d++}else if(M.isSpotLight){const b=n.spot[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const b=n.rectArea[_];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const b=n.point[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){const b=n.hemi[g];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function Vu(s){const e=new Tx(s),t=[],n=[],i=[];function r(d){h.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function u(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function wx(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Vu(s),e.set(i,[o])):r>=a.length?(o=new Vu(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Ax=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Rx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Cx=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Px=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],ku=new Je,ar=new L,Io=new L;function Lx(s,e,t){let n=new Jl;const i=new Be,r=new Be,a=new Ct,o=new up,l=new hp,c={},u=t.maxTextureSize,h={[Hi]:fn,[fn]:Hi,[Wt]:Wt},d=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Be},radius:{value:4}},vertexShader:Ax,fragmentShader:Rx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new ft;p.setAttribute("position",new xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ve(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pr;let m=this.type;this.render=function(y,R,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||y.length===0)return;this.type===Ad&&(He("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=pr);const T=s.getRenderTarget(),A=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),N=s.state;N.setBlending(fi),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const U=m!==this.type;U&&R.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(B=>B.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,B=y.length;P<B;P++){const V=y[P],q=V.shadow;if(q===void 0){He("WebGLShadowMap:",V,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;i.copy(q.mapSize);const Q=q.getFrameExtents();i.multiply(Q),r.copy(q.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/Q.x),i.x=r.x*Q.x,q.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/Q.y),i.y=r.y*Q.y,q.mapSize.y=r.y));const X=s.state.buffers.depth.getReversed();if(q.camera._reversedDepth=X,q.map===null||U===!0){if(q.map!==null&&(q.map.depthTexture!==null&&(q.map.depthTexture.dispose(),q.map.depthTexture=null),q.map.dispose()),this.type===ur){if(V.isPointLight){He("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}q.map=new Nn(i.x,i.y,{format:rs,type:kn,minFilter:Yt,magFilter:Yt,generateMipmaps:!1}),q.map.texture.name=V.name+".shadowMap",q.map.depthTexture=new Cr(i.x,i.y,Ln),q.map.depthTexture.name=V.name+".shadowMapDepth",q.map.depthTexture.format=gi,q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Xt,q.map.depthTexture.magFilter=Xt}else V.isPointLight?(q.map=new nd(i.x),q.map.depthTexture=new np(i.x,ti)):(q.map=new Nn(i.x,i.y),q.map.depthTexture=new Cr(i.x,i.y,ti)),q.map.depthTexture.name=V.name+".shadowMap",q.map.depthTexture.format=gi,this.type===pr?(q.map.depthTexture.compareFunction=X?Yl:ql,q.map.depthTexture.minFilter=Yt,q.map.depthTexture.magFilter=Yt):(q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Xt,q.map.depthTexture.magFilter=Xt);q.camera.updateProjectionMatrix()}q.map.isWebGLCubeRenderTarget!==!0&&(q.map.width!==i.x||q.map.height!==i.y)&&q.map.setSize(i.x,i.y);const Y=q.map.isWebGLCubeRenderTarget?6:q.getViewportCount();V.isPointLight!==!0&&q.updateMatrices(V,x);for(let j=0;j<Y;j++){const se=q.getCamera(j);if(V.isPointLight){const Z=q.camera,ue=q.matrix,oe=V.distance||Z.far;oe!==Z.far&&(Z.far=oe,Z.updateProjectionMatrix()),ar.setFromMatrixPosition(V.matrixWorld),Z.position.copy(ar),Io.copy(Z.position),Io.add(Cx[j]),Z.up.copy(Px[j]),Z.lookAt(Io),Z.updateMatrixWorld(),ue.makeTranslation(-ar.x,-ar.y,-ar.z),ku.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),q._frustum.setFromProjectionMatrix(ku,Z.coordinateSystem,Z.reversedDepth)}if(q.map.isWebGLCubeRenderTarget)s.setRenderTarget(q.map,j),s.clear();else{j===0&&(s.setRenderTarget(q.map),s.clear());const Z=q.getViewport(j);a.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),N.viewport(a)}n=q.getFrustum(j),M(R,x,se,V,this.type)}q.isPointLightShadow!==!0&&this.type===ur&&S(q,x),q.needsUpdate=!1}m=this.type,g.needsUpdate=!1,s.setRenderTarget(T,A,I)};function S(y,R){const x=e.update(_);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null?y.mapPass=new Nn(i.x,i.y,{format:rs,type:kn}):(y.mapPass.width!==y.map.width||y.mapPass.height!==y.map.height)&&y.mapPass.setSize(y.map.width,y.map.height),d.uniforms.shadow_pass.value=y.map.depthTexture,d.uniforms.resolution.value.set(y.map.width,y.map.height),d.uniforms.radius.value=y.radius,s.setRenderTarget(y.mapPass),s.clear(),s.renderBufferDirect(R,null,x,d,_,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value.set(y.map.width,y.map.height),f.uniforms.radius.value=y.radius,s.setRenderTarget(y.map),s.clear(),s.renderBufferDirect(R,null,x,f,_,null)}function w(y,R,x,T){let A=null;const I=x.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(I!==void 0)A=I;else if(A=x.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const N=A.uuid,U=R.uuid;let P=c[N];P===void 0&&(P={},c[N]=P);let B=P[U];B===void 0&&(B=A.clone(),P[U]=B,R.addEventListener("dispose",b)),A=B}if(A.visible=R.visible,A.wireframe=R.wireframe,T===ur?A.side=R.shadowSide!==null?R.shadowSide:R.side:A.side=R.shadowSide!==null?R.shadowSide:h[R.side],A.alphaMap=R.alphaMap,A.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,A.map=R.map,A.clipShadows=R.clipShadows,A.clippingPlanes=R.clippingPlanes,A.clipIntersection=R.clipIntersection,A.displacementMap=R.displacementMap,A.displacementScale=R.displacementScale,A.displacementBias=R.displacementBias,A.wireframeLinewidth=R.wireframeLinewidth,A.linewidth=R.linewidth,x.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const N=s.properties.get(A);N.light=x}return A}function M(y,R,x,T,A){if(y.visible===!1)return;if(y.layers.test(R.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&A===ur)&&(!y.frustumCulled||y.intersectsFrustum(n))){y.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,y.matrixWorld);const U=e.update(y),P=y.material;if(Array.isArray(P)){const B=U.groups;for(let V=0,q=B.length;V<q;V++){const Q=B[V],X=P[Q.materialIndex];if(X&&X.visible){const Y=w(y,X,T,A);y.onBeforeShadow(s,y,R,x,U,Y,Q),s.renderBufferDirect(x,null,U,Y,y,Q),y.onAfterShadow(s,y,R,x,U,Y,Q)}}}else if(P.visible){const B=w(y,P,T,A);y.onBeforeShadow(s,y,R,x,U,B,null),s.renderBufferDirect(x,null,U,B,y,null),y.onAfterShadow(s,y,R,x,U,B,null)}}const N=y.children;for(let U=0,P=N.length;U<P;U++)M(N[U],R,x,T,A)}function b(y){y.target.removeEventListener("dispose",b);for(const x in c){const T=c[x],A=y.target.uuid;A in T&&(T[A].dispose(),delete T[A])}}}function Ix(s,e){function t(){let F=!1;const _e=new Ct;let te=null;const xe=new Ct(0,0,0,0);return{setMask:function(ye){te!==ye&&!F&&(s.colorMask(ye,ye,ye,ye),te=ye)},setLocked:function(ye){F=ye},setClear:function(ye,re,Fe,Ce,bt){bt===!0&&(ye*=Ce,re*=Ce,Fe*=Ce),_e.set(ye,re,Fe,Ce),xe.equals(_e)===!1&&(s.clearColor(ye,re,Fe,Ce),xe.copy(_e))},reset:function(){F=!1,te=null,xe.set(-1,0,0,0)}}}function n(){let F=!1,_e=!1,te=null,xe=null,ye=null;return{setReversed:function(re){if(_e!==re){const Fe=e.get("EXT_clip_control");re?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT),_e=re;const Ce=ye;ye=null,this.setClear(Ce)}},getReversed:function(){return _e},setTest:function(re){re?K(s.DEPTH_TEST):pe(s.DEPTH_TEST)},setMask:function(re){te!==re&&!F&&(s.depthMask(re),te=re)},setFunc:function(re){if(_e&&(re=hf[re]),xe!==re){switch(re){case ko:s.depthFunc(s.NEVER);break;case Go:s.depthFunc(s.ALWAYS);break;case Wo:s.depthFunc(s.LESS);break;case vr:s.depthFunc(s.LEQUAL);break;case Xo:s.depthFunc(s.EQUAL);break;case qo:s.depthFunc(s.GEQUAL);break;case Yo:s.depthFunc(s.GREATER);break;case Ko:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xe=re}},setLocked:function(re){F=re},setClear:function(re){ye!==re&&(ye=re,_e&&(re=1-re),s.clearDepth(re))},reset:function(){F=!1,te=null,xe=null,ye=null,_e=!1}}}function i(){let F=!1,_e=null,te=null,xe=null,ye=null,re=null,Fe=null,Ce=null,bt=null;return{setTest:function(mt){F||(mt?K(s.STENCIL_TEST):pe(s.STENCIL_TEST))},setMask:function(mt){_e!==mt&&!F&&(s.stencilMask(mt),_e=mt)},setFunc:function(mt,mn,_n){(te!==mt||xe!==mn||ye!==_n)&&(s.stencilFunc(mt,mn,_n),te=mt,xe=mn,ye=_n)},setOp:function(mt,mn,_n){(re!==mt||Fe!==mn||Ce!==_n)&&(s.stencilOp(mt,mn,_n),re=mt,Fe=mn,Ce=_n)},setLocked:function(mt){F=mt},setClear:function(mt){bt!==mt&&(s.clearStencil(mt),bt=mt)},reset:function(){F=!1,_e=null,te=null,xe=null,ye=null,re=null,Fe=null,Ce=null,bt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},h={},d={},f=new WeakMap,p=[],_=null,g=!1,m=null,S=null,w=null,M=null,b=null,y=null,R=null,x=new ge(0,0,0),T=0,A=!1,I=null,N=null,U=null,P=null,B=null;const V=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Q=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(X)[1]),q=Q>=1):X.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),q=Q>=2);let Y=null,j={};const se=s.getParameter(s.SCISSOR_BOX),Z=s.getParameter(s.VIEWPORT),ue=new Ct().fromArray(se),oe=new Ct().fromArray(Z);function fe(F,_e,te,xe){const ye=new Uint8Array(4),re=s.createTexture();s.bindTexture(F,re),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Fe=0;Fe<te;Fe++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(_e,0,s.RGBA,1,1,xe,0,s.RGBA,s.UNSIGNED_BYTE,ye):s.texImage2D(_e+Fe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ye);return re}const H={};H[s.TEXTURE_2D]=fe(s.TEXTURE_2D,s.TEXTURE_2D,1),H[s.TEXTURE_CUBE_MAP]=fe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),H[s.TEXTURE_2D_ARRAY]=fe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),H[s.TEXTURE_3D]=fe(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(s.DEPTH_TEST),a.setFunc(vr),Ye(!1),lt(Ec),K(s.CULL_FACE),$e(fi);function K(F){u[F]!==!0&&(s.enable(F),u[F]=!0)}function pe(F){u[F]!==!1&&(s.disable(F),u[F]=!1)}function ze(F,_e){return d[F]!==_e?(s.bindFramebuffer(F,_e),d[F]=_e,F===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=_e),F===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=_e),!0):!1}function he(F,_e){let te=p,xe=!1;if(F){te=f.get(_e),te===void 0&&(te=[],f.set(_e,te));const ye=F.textures;if(te.length!==ye.length||te[0]!==s.COLOR_ATTACHMENT0){for(let re=0,Fe=ye.length;re<Fe;re++)te[re]=s.COLOR_ATTACHMENT0+re;te.length=ye.length,xe=!0}}else te[0]!==s.BACK&&(te[0]=s.BACK,xe=!0);xe&&s.drawBuffers(te)}function Ge(F){return _!==F?(s.useProgram(F),_=F,!0):!1}const Te={[Ps]:s.FUNC_ADD,[Cd]:s.FUNC_SUBTRACT,[Pd]:s.FUNC_REVERSE_SUBTRACT};Te[Ld]=s.MIN,Te[Id]=s.MAX;const ke={[Nd]:s.ZERO,[Dd]:s.ONE,[Ud]:s.SRC_COLOR,[_h]:s.SRC_ALPHA,[Vd]:s.SRC_ALPHA_SATURATE,[zd]:s.DST_COLOR,[Od]:s.DST_ALPHA,[Fd]:s.ONE_MINUS_SRC_COLOR,[xh]:s.ONE_MINUS_SRC_ALPHA,[Hd]:s.ONE_MINUS_DST_COLOR,[Bd]:s.ONE_MINUS_DST_ALPHA,[kd]:s.CONSTANT_COLOR,[Gd]:s.ONE_MINUS_CONSTANT_COLOR,[Wd]:s.CONSTANT_ALPHA,[Xd]:s.ONE_MINUS_CONSTANT_ALPHA};function $e(F,_e,te,xe,ye,re,Fe,Ce,bt,mt){if(F===fi){g===!0&&(pe(s.BLEND),g=!1);return}if(g===!1&&(K(s.BLEND),g=!0),F!==Rd){if(F!==m||mt!==A){if((S!==Ps||b!==Ps)&&(s.blendEquation(s.FUNC_ADD),S=Ps,b=Ps),mt)switch(F){case zi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zn:s.blendFunc(s.ONE,s.ONE);break;case Tc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case wc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ke("WebGLState: Invalid blending: ",F);break}else switch(F){case zi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Tc:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wc:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",F);break}w=null,M=null,y=null,R=null,x.set(0,0,0),T=0,m=F,A=mt}return}ye=ye||_e,re=re||te,Fe=Fe||xe,(_e!==S||ye!==b)&&(s.blendEquationSeparate(Te[_e],Te[ye]),S=_e,b=ye),(te!==w||xe!==M||re!==y||Fe!==R)&&(s.blendFuncSeparate(ke[te],ke[xe],ke[re],ke[Fe]),w=te,M=xe,y=re,R=Fe),(Ce.equals(x)===!1||bt!==T)&&(s.blendColor(Ce.r,Ce.g,Ce.b,bt),x.copy(Ce),T=bt),m=F,A=!1}function st(F,_e){F.side===Wt?pe(s.CULL_FACE):K(s.CULL_FACE);let te=F.side===fn;_e&&(te=!te),Ye(te),F.blending===zi&&F.transparent===!1?$e(fi):$e(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const xe=F.stencilWrite;o.setTest(xe),xe&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Nt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?K(s.SAMPLE_ALPHA_TO_COVERAGE):pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(F){I!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),I=F)}function lt(F){F!==Td?(K(s.CULL_FACE),F!==N&&(F===Ec?s.cullFace(s.BACK):F===wd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):pe(s.CULL_FACE),N=F}function ut(F){F!==U&&(q&&s.lineWidth(F),U=F)}function Nt(F,_e,te){F?(K(s.POLYGON_OFFSET_FILL),(P!==_e||B!==te)&&(P=_e,B=te,a.getReversed()&&(_e=-_e),s.polygonOffset(_e,te))):pe(s.POLYGON_OFFSET_FILL)}function ht(F){F?K(s.SCISSOR_TEST):pe(s.SCISSOR_TEST)}function St(F){F===void 0&&(F=s.TEXTURE0+V-1),Y!==F&&(s.activeTexture(F),Y=F)}function O(F,_e,te){te===void 0&&(Y===null?te=s.TEXTURE0+V-1:te=Y);let xe=j[te];xe===void 0&&(xe={type:void 0,texture:void 0},j[te]=xe),(xe.type!==F||xe.texture!==_e)&&(Y!==te&&(s.activeTexture(te),Y=te),s.bindTexture(F,_e||H[F]),xe.type=F,xe.texture=_e)}function Ht(){const F=j[Y];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function pt(){try{s.compressedTexImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function C(){try{s.compressedTexImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function v(){try{s.texSubImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function z(){try{s.texSubImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function W(){try{s.compressedTexSubImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function J(){try{s.compressedTexSubImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ce(){try{s.texStorage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function me(){try{s.texStorage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ee(){try{s.texImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ie(){try{s.texImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ve(F){return h[F]!==void 0?h[F]:s.getParameter(F)}function De(F,_e){h[F]!==_e&&(s.pixelStorei(F,_e),h[F]=_e)}function Me(F){ue.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),ue.copy(F))}function le(F){oe.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),oe.copy(F))}function Ue(F,_e){let te=c.get(_e);te===void 0&&(te=new WeakMap,c.set(_e,te));let xe=te.get(F);xe===void 0&&(xe=s.getUniformBlockIndex(_e,F.name),te.set(F,xe))}function Xe(F,_e){const xe=c.get(_e).get(F);l.get(_e)!==xe&&(s.uniformBlockBinding(_e,xe,F.__bindingPointIndex),l.set(_e,xe))}function Ze(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},h={},Y=null,j={},d={},f=new WeakMap,p=[],_=null,g=!1,m=null,S=null,w=null,M=null,b=null,y=null,R=null,x=new ge(0,0,0),T=0,A=!1,I=null,N=null,U=null,P=null,B=null,ue.set(0,0,s.canvas.width,s.canvas.height),oe.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:pe,bindFramebuffer:ze,drawBuffers:he,useProgram:Ge,setBlending:$e,setMaterial:st,setFlipSided:Ye,setCullFace:lt,setLineWidth:ut,setPolygonOffset:Nt,setScissorTest:ht,activeTexture:St,bindTexture:O,unbindTexture:Ht,compressedTexImage2D:pt,compressedTexImage3D:C,texImage2D:ee,texImage3D:ie,pixelStorei:De,getParameter:ve,updateUBOMapping:Ue,uniformBlockBinding:Xe,texStorage2D:ce,texStorage3D:me,texSubImage2D:v,texSubImage3D:z,compressedTexSubImage2D:W,compressedTexSubImage3D:J,scissor:Me,viewport:le,reset:Ze}}function Nx(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Be,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,v){return p?new OffscreenCanvas(C,v):wr("canvas")}function g(C,v,z){let W=1;const J=pt(C);if((J.width>z||J.height>z)&&(W=z/Math.max(J.width,J.height)),W<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ce=Math.floor(W*J.width),me=Math.floor(W*J.height);d===void 0&&(d=_(ce,me));const ee=v?_(ce,me):d;return ee.width=ce,ee.height=me,ee.getContext("2d").drawImage(C,0,0,ce,me),He("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+ce+"x"+me+")."),ee}else return"data"in C&&He("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function S(C){s.generateMipmap(C)}function w(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(C,v,z,W,J,ce=!1){if(C!==null){if(s[C]!==void 0)return s[C];He("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let me;W&&(me=e.get("EXT_texture_norm16"),me||He("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=v;if(v===s.RED&&(z===s.FLOAT&&(ee=s.R32F),z===s.HALF_FLOAT&&(ee=s.R16F),z===s.UNSIGNED_BYTE&&(ee=s.R8),z===s.UNSIGNED_SHORT&&me&&(ee=me.R16_EXT),z===s.SHORT&&me&&(ee=me.R16_SNORM_EXT)),v===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(ee=s.R8UI),z===s.UNSIGNED_SHORT&&(ee=s.R16UI),z===s.UNSIGNED_INT&&(ee=s.R32UI),z===s.BYTE&&(ee=s.R8I),z===s.SHORT&&(ee=s.R16I),z===s.INT&&(ee=s.R32I)),v===s.RG&&(z===s.FLOAT&&(ee=s.RG32F),z===s.HALF_FLOAT&&(ee=s.RG16F),z===s.UNSIGNED_BYTE&&(ee=s.RG8),z===s.UNSIGNED_SHORT&&me&&(ee=me.RG16_EXT),z===s.SHORT&&me&&(ee=me.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(ee=s.RG8UI),z===s.UNSIGNED_SHORT&&(ee=s.RG16UI),z===s.UNSIGNED_INT&&(ee=s.RG32UI),z===s.BYTE&&(ee=s.RG8I),z===s.SHORT&&(ee=s.RG16I),z===s.INT&&(ee=s.RG32I)),v===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(ee=s.RGB8UI),z===s.UNSIGNED_SHORT&&(ee=s.RGB16UI),z===s.UNSIGNED_INT&&(ee=s.RGB32UI),z===s.BYTE&&(ee=s.RGB8I),z===s.SHORT&&(ee=s.RGB16I),z===s.INT&&(ee=s.RGB32I)),v===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(ee=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(ee=s.RGBA16UI),z===s.UNSIGNED_INT&&(ee=s.RGBA32UI),z===s.BYTE&&(ee=s.RGBA8I),z===s.SHORT&&(ee=s.RGBA16I),z===s.INT&&(ee=s.RGBA32I)),v===s.RGB&&(z===s.UNSIGNED_SHORT&&me&&(ee=me.RGB16_EXT),z===s.SHORT&&me&&(ee=me.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(ee=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(ee=s.R11F_G11F_B10F)),v===s.RGBA){const ie=ce?Ra:ot.getTransfer(J);z===s.FLOAT&&(ee=s.RGBA32F),z===s.HALF_FLOAT&&(ee=s.RGBA16F),z===s.UNSIGNED_BYTE&&(ee=ie===Et?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&me&&(ee=me.RGBA16_EXT),z===s.SHORT&&me&&(ee=me.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(ee=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(ee=s.RGB5_A1)}return(ee===s.R16F||ee===s.R32F||ee===s.RG16F||ee===s.RG32F||ee===s.RGBA16F||ee===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function b(C,v){let z;return C?v===null||v===ti||v===Sr?z=s.DEPTH24_STENCIL8:v===Ln?z=s.DEPTH32F_STENCIL8:v===Mr&&(z=s.DEPTH24_STENCIL8,He("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ti||v===Sr?z=s.DEPTH_COMPONENT24:v===Ln?z=s.DEPTH_COMPONENT32F:v===Mr&&(z=s.DEPTH_COMPONENT16),z}function y(C,v){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Xt&&C.minFilter!==Yt?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function R(C){const v=C.target;v.removeEventListener("dispose",R),T(v),v.isVideoTexture&&u.delete(v),v.isHTMLTexture&&h.delete(v)}function x(C){const v=C.target;v.removeEventListener("dispose",x),I(v)}function T(C){const v=n.get(C);if(v.__webglInit===void 0)return;const z=C.source,W=f.get(z);if(W){const J=W[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&A(C),Object.keys(W).length===0&&f.delete(z)}n.remove(C)}function A(C){const v=n.get(C);s.deleteTexture(v.__webglTexture);const z=C.source,W=f.get(z);delete W[v.__cacheKey],a.memory.textures--}function I(C){const v=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(v.__webglFramebuffer[W]))for(let J=0;J<v.__webglFramebuffer[W].length;J++)s.deleteFramebuffer(v.__webglFramebuffer[W][J]);else s.deleteFramebuffer(v.__webglFramebuffer[W]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[W])}else{if(Array.isArray(v.__webglFramebuffer))for(let W=0;W<v.__webglFramebuffer.length;W++)s.deleteFramebuffer(v.__webglFramebuffer[W]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let W=0;W<v.__webglColorRenderbuffer.length;W++)v.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[W]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const z=C.textures;for(let W=0,J=z.length;W<J;W++){const ce=n.get(z[W]);ce.__webglTexture&&(s.deleteTexture(ce.__webglTexture),a.memory.textures--),n.remove(z[W])}n.remove(C)}let N=0;function U(){N=0}function P(){return N}function B(C){N=C}function V(){const C=N;return C>=i.maxTextures&&He("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+i.maxTextures),N+=1,C}function q(C){const v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function Q(C,v){const z=n.get(C);if(C.isVideoTexture&&O(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&z.__version!==C.version){const W=C.image;if(W===null)He("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)He("WebGLRenderer: Texture marked for update but image is incomplete");else{pe(z,C,v);return}}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+v)}function X(C,v){const z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){pe(z,C,v);return}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+v)}function Y(C,v){const z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){pe(z,C,v);return}t.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+v)}function j(C,v){const z=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&z.__version!==C.version){ze(z,C,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+v)}const se={[gn]:s.REPEAT,[Jn]:s.CLAMP_TO_EDGE,[Ta]:s.MIRRORED_REPEAT},Z={[Xt]:s.NEAREST,[Th]:s.NEAREST_MIPMAP_NEAREST,[hr]:s.NEAREST_MIPMAP_LINEAR,[Yt]:s.LINEAR,[xa]:s.LINEAR_MIPMAP_NEAREST,[jn]:s.LINEAR_MIPMAP_LINEAR},ue={[ef]:s.NEVER,[af]:s.ALWAYS,[tf]:s.LESS,[ql]:s.LEQUAL,[nf]:s.EQUAL,[Yl]:s.GEQUAL,[sf]:s.GREATER,[rf]:s.NOTEQUAL};function oe(C,v){if(v.type===Ln&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Yt||v.magFilter===xa||v.magFilter===hr||v.magFilter===jn||v.minFilter===Yt||v.minFilter===xa||v.minFilter===hr||v.minFilter===jn)&&He("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,se[v.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,se[v.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,se[v.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Z[v.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Z[v.minFilter]),v.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,ue[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Xt||v.minFilter!==hr&&v.minFilter!==jn||v.type===Ln&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function fe(C,v){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",R));const W=v.source;let J=f.get(W);J===void 0&&(J={},f.set(W,J));const ce=q(v);if(ce!==C.__cacheKey){J[ce]===void 0&&(J[ce]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),J[ce].usedTimes++;const me=J[C.__cacheKey];me!==void 0&&(J[C.__cacheKey].usedTimes--,me.usedTimes===0&&A(v)),C.__cacheKey=ce,C.__webglTexture=J[ce].texture}return z}function H(C,v,z){return Math.floor(Math.floor(C/z)/v)}function K(C,v,z,W){const ce=C.updateRanges;if(ce.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,z,W,v.data);else{ce.sort((De,Me)=>De.start-Me.start);let me=0;for(let De=1;De<ce.length;De++){const Me=ce[me],le=ce[De],Ue=Me.start+Me.count,Xe=H(le.start,v.width,4),Ze=H(Me.start,v.width,4);le.start<=Ue+1&&Xe===Ze&&H(le.start+le.count-1,v.width,4)===Xe?Me.count=Math.max(Me.count,le.start+le.count-Me.start):(++me,ce[me]=le)}ce.length=me+1;const ee=t.getParameter(s.UNPACK_ROW_LENGTH),ie=t.getParameter(s.UNPACK_SKIP_PIXELS),ve=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let De=0,Me=ce.length;De<Me;De++){const le=ce[De],Ue=Math.floor(le.start/4),Xe=Math.ceil(le.count/4),Ze=Ue%v.width,F=Math.floor(Ue/v.width),_e=Xe,te=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Ze),t.pixelStorei(s.UNPACK_SKIP_ROWS,F),t.texSubImage2D(s.TEXTURE_2D,0,Ze,F,_e,te,z,W,v.data)}C.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,ee),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(s.UNPACK_SKIP_ROWS,ve)}}function pe(C,v,z){let W=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(W=s.TEXTURE_3D);const J=fe(C,v),ce=v.source;t.bindTexture(W,C.__webglTexture,s.TEXTURE0+z);const me=n.get(ce);if(ce.version!==me.__version||J===!0){if(t.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const te=ot.getPrimaries(ot.workingColorSpace),xe=v.colorSpace===Bi?null:ot.getPrimaries(v.colorSpace),ye=v.colorSpace===Bi||te===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye)}t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let ie=g(v.image,!1,i.maxTextureSize);ie=Ht(v,ie);const ve=r.convert(v.format,v.colorSpace),De=r.convert(v.type);let Me=M(v.internalFormat,ve,De,v.normalized,v.colorSpace,v.isVideoTexture);oe(W,v);let le;const Ue=v.mipmaps,Xe=v.isVideoTexture!==!0,Ze=me.__version===void 0||J===!0,F=ce.dataReady,_e=y(v,ie);if(v.isDepthTexture)Me=b(v.format===ns,v.type),Ze&&(Xe?t.texStorage2D(s.TEXTURE_2D,1,Me,ie.width,ie.height):t.texImage2D(s.TEXTURE_2D,0,Me,ie.width,ie.height,0,ve,De,null));else if(v.isDataTexture)if(Ue.length>0){Xe&&Ze&&t.texStorage2D(s.TEXTURE_2D,_e,Me,Ue[0].width,Ue[0].height);for(let te=0,xe=Ue.length;te<xe;te++)le=Ue[te],Xe?F&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,le.width,le.height,ve,De,le.data):t.texImage2D(s.TEXTURE_2D,te,Me,le.width,le.height,0,ve,De,le.data);v.generateMipmaps=!1}else Xe?(Ze&&t.texStorage2D(s.TEXTURE_2D,_e,Me,ie.width,ie.height),F&&K(v,ie,ve,De)):t.texImage2D(s.TEXTURE_2D,0,Me,ie.width,ie.height,0,ve,De,ie.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Xe&&Ze&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,Me,Ue[0].width,Ue[0].height,ie.depth);for(let te=0,xe=Ue.length;te<xe;te++)if(le=Ue[te],v.format!==In)if(ve!==null)if(Xe){if(F)if(v.layerUpdates.size>0){const ye=Su(le.width,le.height,v.format,v.type);for(const re of v.layerUpdates){const Fe=le.data.subarray(re*ye/le.data.BYTES_PER_ELEMENT,(re+1)*ye/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,re,le.width,le.height,1,ve,Fe)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,le.width,le.height,ie.depth,ve,le.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,te,Me,le.width,le.height,ie.depth,0,le.data,0,0);else He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?F&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,le.width,le.height,ie.depth,ve,De,le.data):t.texImage3D(s.TEXTURE_2D_ARRAY,te,Me,le.width,le.height,ie.depth,0,ve,De,le.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{Xe&&Ze&&t.texStorage2D(s.TEXTURE_2D,_e,Me,Ue[0].width,Ue[0].height);for(let te=0,xe=Ue.length;te<xe;te++)le=Ue[te],v.format!==In?ve!==null?Xe?F&&t.compressedTexSubImage2D(s.TEXTURE_2D,te,0,0,le.width,le.height,ve,le.data):t.compressedTexImage2D(s.TEXTURE_2D,te,Me,le.width,le.height,0,le.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?F&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,le.width,le.height,ve,De,le.data):t.texImage2D(s.TEXTURE_2D,te,Me,le.width,le.height,0,ve,De,le.data)}else if(v.isDataArrayTexture)if(Xe){if(Ze&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,Me,ie.width,ie.height,ie.depth),F)if(v.layerUpdates.size>0){const te=Su(ie.width,ie.height,v.format,v.type);for(const xe of v.layerUpdates){const ye=ie.data.subarray(xe*te/ie.data.BYTES_PER_ELEMENT,(xe+1)*te/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xe,ie.width,ie.height,1,ve,De,ye)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ve,De,ie.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Me,ie.width,ie.height,ie.depth,0,ve,De,ie.data);else if(v.isData3DTexture)Xe?(Ze&&t.texStorage3D(s.TEXTURE_3D,_e,Me,ie.width,ie.height,ie.depth),F&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ve,De,ie.data)):t.texImage3D(s.TEXTURE_3D,0,Me,ie.width,ie.height,ie.depth,0,ve,De,ie.data);else if(v.isFramebufferTexture){if(Ze)if(Xe)t.texStorage2D(s.TEXTURE_2D,_e,Me,ie.width,ie.height);else{let te=ie.width,xe=ie.height;for(let ye=0;ye<_e;ye++)t.texImage2D(s.TEXTURE_2D,ye,Me,te,xe,0,ve,De,null),te>>=1,xe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){const te=s.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ie.parentNode!==te){te.appendChild(ie),h.add(v),te.onpaint=xe=>{const ye=xe.changedElements;for(const re of h)ye.includes(re.image)&&(re.needsUpdate=!0)},te.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ie);else{const ye=s.RGBA,re=s.RGBA,Fe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,ye,re,Fe,ie)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ue.length>0){if(Xe&&Ze){const te=pt(Ue[0]);t.texStorage2D(s.TEXTURE_2D,_e,Me,te.width,te.height)}for(let te=0,xe=Ue.length;te<xe;te++)le=Ue[te],Xe?F&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,ve,De,le):t.texImage2D(s.TEXTURE_2D,te,Me,ve,De,le);v.generateMipmaps=!1}else if(Xe){if(Ze){const te=pt(ie);t.texStorage2D(s.TEXTURE_2D,_e,Me,te.width,te.height)}F&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ve,De,ie)}else t.texImage2D(s.TEXTURE_2D,0,Me,ve,De,ie);m(v)&&S(W),me.__version=ce.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function ze(C,v,z){if(v.image.length!==6)return;const W=fe(C,v),J=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+z);const ce=n.get(J);if(J.version!==ce.__version||W===!0){t.activeTexture(s.TEXTURE0+z);const me=ot.getPrimaries(ot.workingColorSpace),ee=v.colorSpace===Bi?null:ot.getPrimaries(v.colorSpace),ie=v.colorSpace===Bi||me===ee?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);const ve=v.isCompressedTexture||v.image[0].isCompressedTexture,De=v.image[0]&&v.image[0].isDataTexture,Me=[];for(let re=0;re<6;re++)!ve&&!De?Me[re]=g(v.image[re],!0,i.maxCubemapSize):Me[re]=De?v.image[re].image:v.image[re],Me[re]=Ht(v,Me[re]);const le=Me[0],Ue=r.convert(v.format,v.colorSpace),Xe=r.convert(v.type),Ze=M(v.internalFormat,Ue,Xe,v.normalized,v.colorSpace),F=v.isVideoTexture!==!0,_e=ce.__version===void 0||W===!0,te=J.dataReady;let xe=y(v,le);oe(s.TEXTURE_CUBE_MAP,v);let ye;if(ve){F&&_e&&t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,Ze,le.width,le.height);for(let re=0;re<6;re++){ye=Me[re].mipmaps;for(let Fe=0;Fe<ye.length;Fe++){const Ce=ye[Fe];v.format!==In?Ue!==null?F?te&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,0,0,Ce.width,Ce.height,Ue,Ce.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,Ze,Ce.width,Ce.height,0,Ce.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,0,0,Ce.width,Ce.height,Ue,Xe,Ce.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe,Ze,Ce.width,Ce.height,0,Ue,Xe,Ce.data)}}}else{if(ye=v.mipmaps,F&&_e){ye.length>0&&xe++;const re=pt(Me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,Ze,re.width,re.height)}for(let re=0;re<6;re++)if(De){F?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Me[re].width,Me[re].height,Ue,Xe,Me[re].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ze,Me[re].width,Me[re].height,0,Ue,Xe,Me[re].data);for(let Fe=0;Fe<ye.length;Fe++){const bt=ye[Fe].image[re].image;F?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,0,0,bt.width,bt.height,Ue,Xe,bt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,Ze,bt.width,bt.height,0,Ue,Xe,bt.data)}}else{F?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ue,Xe,Me[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ze,Ue,Xe,Me[re]);for(let Fe=0;Fe<ye.length;Fe++){const Ce=ye[Fe];F?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,0,0,Ue,Xe,Ce.image[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,Fe+1,Ze,Ue,Xe,Ce.image[re])}}}m(v)&&S(s.TEXTURE_CUBE_MAP),ce.__version=J.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function he(C,v,z,W,J,ce){const me=r.convert(z.format,z.colorSpace),ee=r.convert(z.type),ie=M(z.internalFormat,me,ee,z.normalized,z.colorSpace),ve=n.get(v),De=n.get(z);if(De.__renderTarget=v,!ve.__hasExternalTextures){const Me=Math.max(1,v.width>>ce),le=Math.max(1,v.height>>ce);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?t.texImage3D(J,ce,ie,Me,le,v.depth,0,me,ee,null):t.texImage2D(J,ce,ie,Me,le,0,me,ee,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),St(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,J,De.__webglTexture,0,ht(v)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,J,De.__webglTexture,ce),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ge(C,v,z){if(s.bindRenderbuffer(s.RENDERBUFFER,C),v.depthBuffer){const W=v.depthTexture,J=W&&W.isDepthTexture?W.type:null,ce=b(v.stencilBuffer,J),me=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;St(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ht(v),ce,v.width,v.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ht(v),ce,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ce,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,me,s.RENDERBUFFER,C)}else{const W=v.textures;for(let J=0;J<W.length;J++){const ce=W[J],me=r.convert(ce.format,ce.colorSpace),ee=r.convert(ce.type),ie=M(ce.internalFormat,me,ee,ce.normalized,ce.colorSpace);St(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ht(v),ie,v.width,v.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ht(v),ie,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ie,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Te(C,v,z){const W=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const J=n.get(v.depthTexture);if(J.__renderTarget=v,(!J.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),W){if(J.__webglInit===void 0&&(J.__webglInit=!0,v.depthTexture.addEventListener("dispose",R)),J.__webglTexture===void 0){J.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),oe(s.TEXTURE_CUBE_MAP,v.depthTexture);const ve=r.convert(v.depthTexture.format),De=r.convert(v.depthTexture.type);let Me;v.depthTexture.format===gi?Me=s.DEPTH_COMPONENT24:v.depthTexture.format===ns&&(Me=s.DEPTH24_STENCIL8);for(let le=0;le<6;le++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Me,v.width,v.height,0,ve,De,null)}}else Q(v.depthTexture,0);const ce=J.__webglTexture,me=ht(v),ee=W?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,ie=v.depthTexture.format===ns?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===gi)St(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ie,ee,ce,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,ie,ee,ce,0);else if(v.depthTexture.format===ns)St(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ie,ee,ce,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,ie,ee,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ke(C){const v=n.get(C),z=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){const W=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),W){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,W.removeEventListener("dispose",J)};W.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=W}if(C.depthTexture&&!v.__autoAllocateDepthBuffer)if(z)for(let W=0;W<6;W++)Te(v.__webglFramebuffer[W],C,W);else{const W=C.texture.mipmaps;W&&W.length>0?Te(v.__webglFramebuffer[0],C,0):Te(v.__webglFramebuffer,C,0)}else if(z){v.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[W]),v.__webglDepthbuffer[W]===void 0)v.__webglDepthbuffer[W]=s.createRenderbuffer(),Ge(v.__webglDepthbuffer[W],C,!1);else{const J=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ce)}}else{const W=C.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),Ge(v.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ce)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function $e(C,v,z){const W=n.get(C);v!==void 0&&he(W.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&ke(C)}function st(C){const v=C.texture,z=n.get(C),W=n.get(v);C.addEventListener("dispose",x);const J=C.textures,ce=C.isWebGLCubeRenderTarget===!0,me=J.length>1;if(me||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=v.version,a.memory.textures++),ce){z.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[ee]=[];for(let ie=0;ie<v.mipmaps.length;ie++)z.__webglFramebuffer[ee][ie]=s.createFramebuffer()}else z.__webglFramebuffer[ee]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let ee=0;ee<v.mipmaps.length;ee++)z.__webglFramebuffer[ee]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(me)for(let ee=0,ie=J.length;ee<ie;ee++){const ve=n.get(J[ee]);ve.__webglTexture===void 0&&(ve.__webglTexture=s.createTexture(),a.memory.textures++)}if(C.samples>0&&St(C)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ee=0;ee<J.length;ee++){const ie=J[ee];z.__webglColorRenderbuffer[ee]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[ee]);const ve=r.convert(ie.format,ie.colorSpace),De=r.convert(ie.type),Me=M(ie.internalFormat,ve,De,ie.normalized,ie.colorSpace,C.isXRRenderTarget===!0),le=ht(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,le,Me,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ee,s.RENDERBUFFER,z.__webglColorRenderbuffer[ee])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Ge(z.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ce){t.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),oe(s.TEXTURE_CUBE_MAP,v);for(let ee=0;ee<6;ee++)if(v.mipmaps&&v.mipmaps.length>0)for(let ie=0;ie<v.mipmaps.length;ie++)he(z.__webglFramebuffer[ee][ie],C,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ie);else he(z.__webglFramebuffer[ee],C,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);m(v)&&S(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let ee=0,ie=J.length;ee<ie;ee++){const ve=J[ee],De=n.get(ve);let Me=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Me=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Me,De.__webglTexture),oe(Me,ve),he(z.__webglFramebuffer,C,ve,s.COLOR_ATTACHMENT0+ee,Me,0),m(ve)&&S(Me)}t.unbindTexture()}else{let ee=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ee=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ee,W.__webglTexture),oe(ee,v),v.mipmaps&&v.mipmaps.length>0)for(let ie=0;ie<v.mipmaps.length;ie++)he(z.__webglFramebuffer[ie],C,v,s.COLOR_ATTACHMENT0,ee,ie);else he(z.__webglFramebuffer,C,v,s.COLOR_ATTACHMENT0,ee,0);m(v)&&S(ee),t.unbindTexture()}C.depthBuffer&&ke(C)}function Ye(C){const v=C.textures;for(let z=0,W=v.length;z<W;z++){const J=v[z];if(m(J)){const ce=w(C),me=n.get(J).__webglTexture;t.bindTexture(ce,me),S(ce),t.unbindTexture()}}}const lt=[],ut=[];function Nt(C){if(C.samples>0){if(St(C)===!1){const v=C.textures,z=C.width,W=C.height;let J=s.COLOR_BUFFER_BIT;const ce=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,me=n.get(C),ee=v.length>1;if(ee)for(let ve=0;ve<v.length;ve++)t.bindFramebuffer(s.FRAMEBUFFER,me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);const ie=C.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let ve=0;ve<v.length;ve++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),ee){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,me.__webglColorRenderbuffer[ve]);const De=n.get(v[ve]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,De,0)}s.blitFramebuffer(0,0,z,W,0,0,z,W,J,s.NEAREST),l===!0&&(lt.length=0,ut.length=0,lt.push(s.COLOR_ATTACHMENT0+ve),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(lt.push(ce),ut.push(ce),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ut)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,lt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ee)for(let ve=0;ve<v.length;ve++){t.bindFramebuffer(s.FRAMEBUFFER,me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,me.__webglColorRenderbuffer[ve]);const De=n.get(v[ve]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,De,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){const v=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function ht(C){return Math.min(i.maxSamples,C.samples)}function St(C){const v=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function O(C){const v=a.render.frame;u.get(C)!==v&&(u.set(C,v),C.update())}function Ht(C,v){const z=C.colorSpace,W=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==pn&&z!==Bi&&(ot.getTransfer(z)===Et?(W!==In||J!==yn)&&He("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",z)),v}function pt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=U,this.getTextureUnits=P,this.setTextureUnits=B,this.setTexture2D=Q,this.setTexture2DArray=X,this.setTexture3D=Y,this.setTextureCube=j,this.rebindTextures=$e,this.setupRenderTarget=st,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=Nt,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=he,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Dx(s,e){function t(n,i=Bi){let r;const a=ot.getTransfer(i);if(n===yn)return s.UNSIGNED_BYTE;if(n===Hl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Vl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Rh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Ch)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===wh)return s.BYTE;if(n===Ah)return s.SHORT;if(n===Mr)return s.UNSIGNED_SHORT;if(n===zl)return s.INT;if(n===ti)return s.UNSIGNED_INT;if(n===Ln)return s.FLOAT;if(n===kn)return s.HALF_FLOAT;if(n===Ph)return s.ALPHA;if(n===Lh)return s.RGB;if(n===In)return s.RGBA;if(n===gi)return s.DEPTH_COMPONENT;if(n===ns)return s.DEPTH_STENCIL;if(n===kl)return s.RED;if(n===Gl)return s.RED_INTEGER;if(n===rs)return s.RG;if(n===Wl)return s.RG_INTEGER;if(n===Xl)return s.RGBA_INTEGER;if(n===va||n===Ma||n===Sa||n===ya)if(a===Et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===va)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===va)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ma)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Sa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ya)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$o||n===Qo||n===Zo||n===Jo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$o)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Jo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===jo||n===el||n===tl||n===nl||n===il||n===wa||n===sl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===jo||n===el)return a===Et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===tl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===nl)return r.COMPRESSED_R11_EAC;if(n===il)return r.COMPRESSED_SIGNED_R11_EAC;if(n===wa)return r.COMPRESSED_RG11_EAC;if(n===sl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===rl||n===al||n===ol||n===ll||n===cl||n===ul||n===hl||n===dl||n===fl||n===pl||n===ml||n===gl||n===_l||n===xl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===rl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===al)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ol)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ll)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===cl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ul)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===hl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===dl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ml)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===gl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_l)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===xl)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===vl||n===Ml||n===Sl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===vl)return a===Et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Sl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===yl||n===bl||n===Aa||n===El)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===yl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===bl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Aa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===El)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Sr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Ux=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ox{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Yh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gn({vertexShader:Ux,fragmentShader:Fx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ve(new tn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Bx extends as{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",g=new Ox,m={},S=t.getContextAttributes();let w=null,M=null;const b=[],y=[],R=new Be;let x=null,T=null;const A=new dn;A.viewport=new Ct;const I=new dn;I.viewport=new Ct;const N=[A,I],U=new Op;let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let K=b[H];return K===void 0&&(K=new no,b[H]=K),K.getTargetRaySpace()},this.getControllerGrip=function(H){let K=b[H];return K===void 0&&(K=new no,b[H]=K),K.getGripSpace()},this.getHand=function(H){let K=b[H];return K===void 0&&(K=new no,b[H]=K),K.getHandSpace()};function V(H){const K=y.indexOf(H.inputSource);if(K===-1)return;const pe=b[K];pe!==void 0&&(pe.update(H.inputSource,H.frame,c||a),pe.dispatchEvent({type:H.type,data:H.inputSource}))}function q(){i.removeEventListener("select",V),i.removeEventListener("selectstart",V),i.removeEventListener("selectend",V),i.removeEventListener("squeeze",V),i.removeEventListener("squeezestart",V),i.removeEventListener("squeezeend",V),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",Q);for(let H=0;H<b.length;H++){const K=y[H];K!==null&&(y[H]=null,b[H].disconnect(K))}P=null,B=null,g.reset();for(const H in m)delete m[H];if(e.setRenderTarget(w),f=null,d=null,h=null,i=null,M=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),T!==null){const H=T.camera;H.fov=T.fov,H.zoom=T.zoom,H.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,n.isPresenting===!0&&He("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,n.isPresenting===!0&&He("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(i,t)),h},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(H){if(i=H,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",V),i.addEventListener("selectstart",V),i.addEventListener("selectend",V),i.addEventListener("squeeze",V),i.addEventListener("squeezestart",V),i.addEventListener("squeezeend",V),i.addEventListener("end",q),i.addEventListener("inputsourceschange",Q),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,ze=null,he=null;S.depth&&(he=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=S.stencil?ns:gi,ze=S.stencil?Sr:ti);const Ge={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Ge),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new Nn(d.textureWidth,d.textureHeight,{format:In,type:yn,depthTexture:new Cr(d.textureWidth,d.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const pe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,pe),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Nn(f.framebufferWidth,f.framebufferHeight,{format:In,type:yn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),fe.setContext(i),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Q(H){for(let K=0;K<H.removed.length;K++){const pe=H.removed[K],ze=y.indexOf(pe);ze>=0&&(y[ze]=null,b[ze].disconnect(pe))}for(let K=0;K<H.added.length;K++){const pe=H.added[K];let ze=y.indexOf(pe);if(ze===-1){for(let Ge=0;Ge<b.length;Ge++)if(Ge>=y.length){y.push(pe),ze=Ge;break}else if(y[Ge]===null){y[Ge]=pe,ze=Ge;break}if(ze===-1)break}const he=b[ze];he&&he.connect(pe)}}const X=new L,Y=new L;function j(H,K,pe){X.setFromMatrixPosition(K.matrixWorld),Y.setFromMatrixPosition(pe.matrixWorld);const ze=X.distanceTo(Y),he=K.projectionMatrix.elements,Ge=pe.projectionMatrix.elements,Te=he[14]/(he[10]-1),ke=he[14]/(he[10]+1),$e=(he[9]+1)/he[5],st=(he[9]-1)/he[5],Ye=(he[8]-1)/he[0],lt=(Ge[8]+1)/Ge[0],ut=Te*Ye,Nt=Te*lt,ht=ze/(-Ye+lt),St=ht*-Ye;if(K.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(St),H.translateZ(ht),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),he[10]===-1)H.projectionMatrix.copy(K.projectionMatrix),H.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const O=Te+ht,Ht=ke+ht,pt=ut-St,C=Nt+(ze-St),v=$e*ke/Ht*O,z=st*ke/Ht*O;H.projectionMatrix.makePerspective(pt,C,v,z,O,Ht),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function se(H,K){K===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(K.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(i===null)return;let K=H.near,pe=H.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(pe=g.depthFar)),U.near=I.near=A.near=K,U.far=I.far=A.far=pe,(P!==U.near||B!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),P=U.near,B=U.far),U.layers.mask=H.layers.mask|6,A.layers.mask=U.layers.mask&-5,I.layers.mask=U.layers.mask&-3;const ze=H.parent,he=U.cameras;se(U,ze);for(let Ge=0;Ge<he.length;Ge++)se(he[Ge],ze);he.length===2?j(U,A,I):U.projectionMatrix.copy(A.projectionMatrix),T===null&&H.isPerspectiveCamera&&(T={camera:H,fov:H.fov,zoom:H.zoom}),Z(H,U,ze)};function Z(H,K,pe){pe===null?H.matrix.copy(K.matrixWorld):(H.matrix.copy(pe.matrixWorld),H.matrix.invert(),H.matrix.multiply(K.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(K.projectionMatrix),H.projectionMatrixInverse.copy(K.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Bs*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(H){l=H,d!==null&&(d.fixedFoveation=H),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=H)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(U)},this.getCameraTexture=function(H){return m[H]};let ue=null;function oe(H,K){if(u=K.getViewerPose(c||a),p=K,u!==null){const pe=u.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let ze=!1;pe.length!==U.cameras.length&&(U.cameras.length=0,ze=!0);for(let ke=0;ke<pe.length;ke++){const $e=pe[ke];let st=null;if(f!==null)st=f.getViewport($e);else{const lt=h.getViewSubImage(d,$e);st=lt.viewport,ke===0&&(e.setRenderTargetTextures(M,lt.colorTexture,lt.depthStencilTexture),e.setRenderTarget(M))}let Ye=N[ke];Ye===void 0&&(Ye=new dn,Ye.layers.enable(ke),Ye.viewport=new Ct,N[ke]=Ye),Ye.matrix.fromArray($e.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray($e.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(st.x,st.y,st.width,st.height),ke===0&&(U.matrix.copy(Ye.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),ze===!0&&U.cameras.push(Ye)}const he=i.enabledFeatures;if(he&&he.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){h=n.getBinding();const ke=h.getDepthInformation(pe[0]);ke&&ke.isValid&&ke.texture&&g.init(ke,i.renderState)}if(he&&he.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let ke=0;ke<pe.length;ke++){const $e=pe[ke].camera;if($e){let st=m[$e];st||(st=new Yh,m[$e]=st);const Ye=h.getCameraImage($e);st.sourceTexture=Ye}}}}for(let pe=0;pe<b.length;pe++){const ze=y[pe],he=b[pe];ze!==null&&he!==void 0&&he.update(ze,K,c||a)}ue&&ue(H,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),p=null}const fe=new ed;fe.setAnimationLoop(oe),this.setAnimationLoop=function(H){ue=H},this.dispose=function(){}}}const zx=new Je,od=new Qe;od.set(-1,0,0,0,1,0,0,0,1);function Hx(s,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Kh(s)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,S,w,M){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),h(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,M)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),_(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,S,w):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===fn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===fn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const S=e.get(m),w=S.envMap,M=S.envMapRotation;w&&(g.envMap.value=w,g.envMapRotation.value.setFromMatrix4(zx.makeRotationFromEuler(M)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(od),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,S,w){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*S,g.scale.value=w*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function h(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,S){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===fn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){const S=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Vx(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,b){const y=b.program;n.uniformBlockBinding(M,y)}function c(M,b){let y=i[M.id];y===void 0&&(g(M),y=u(M),i[M.id]=y,M.addEventListener("dispose",S));const R=b.program;n.updateUBOMapping(M,R);const x=e.render.frame;r[M.id]!==x&&(d(M),r[M.id]=x)}function u(M){const b=h();M.__bindingPointIndex=b;const y=s.createBuffer(),R=M.__size,x=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,R,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,y),y}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const b=i[M.id],y=M.uniforms,R=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,T=y.length;x<T;x++){const A=y[x];if(Array.isArray(A))for(let I=0,N=A.length;I<N;I++)f(A[I],x,I,R);else f(A,x,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,b,y,R){if(_(M,b,y,R)===!0){const x=M.__offset,T=M.value;if(Array.isArray(T)){let A=0;for(let I=0;I<T.length;I++){const N=T[I],U=m(N);p(N,M.__data,A),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(A+=U.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,M.__data)}}function p(M,b,y){typeof M=="number"||typeof M=="boolean"?b[0]=M:M.isMatrix3?(b[0]=M.elements[0],b[1]=M.elements[1],b[2]=M.elements[2],b[3]=0,b[4]=M.elements[3],b[5]=M.elements[4],b[6]=M.elements[5],b[7]=0,b[8]=M.elements[6],b[9]=M.elements[7],b[10]=M.elements[8],b[11]=0):ArrayBuffer.isView(M)?b.set(new M.constructor(M.buffer,M.byteOffset,b.length)):M.toArray(b,y)}function _(M,b,y,R){const x=M.value,T=b+"_"+y;if(R[T]===void 0)return typeof x=="number"||typeof x=="boolean"?R[T]=x:ArrayBuffer.isView(x)?R[T]=x.slice():R[T]=x.clone(),!0;{const A=R[T];if(typeof x=="number"||typeof x=="boolean"){if(A!==x)return R[T]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(A.equals(x)===!1)return A.copy(x),!0}}return!1}function g(M){const b=M.uniforms;let y=0;const R=16;for(let T=0,A=b.length;T<A;T++){const I=Array.isArray(b[T])?b[T]:[b[T]];for(let N=0,U=I.length;N<U;N++){const P=I[N],B=Array.isArray(P.value)?P.value:[P.value];for(let V=0,q=B.length;V<q;V++){const Q=B[V],X=m(Q),Y=y%R,j=Y%X.boundary,se=Y+j;y+=j,se!==0&&R-se<X.storage&&(y+=R-se),P.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=y,y+=X.storage}}}const x=y%R;return x>0&&(y+=R-x),M.__size=y,M.__cache={},this}function m(M){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?He("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):He("WebGLRenderer: Unsupported uniform value type.",M),b}function S(M){const b=M.target;b.removeEventListener("dispose",S);const y=a.indexOf(b.__bindingPointIndex);a.splice(y,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function w(){for(const M in i)s.deleteBuffer(i[M]);a=[],i={},r={}}return{bind:l,update:c,dispose:w}}const kx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Kn=null;function Gx(){return Kn===null&&(Kn=new Ql(kx,16,16,rs,kn),Kn.name="DFG_LUT",Kn.minFilter=Yt,Kn.magFilter=Yt,Kn.wrapS=Jn,Kn.wrapT=Jn,Kn.generateMipmaps=!1,Kn.needsUpdate=!0),Kn}class Wx{constructor(e={}){const{canvas:t=cf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=yn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=f,g=new Set([Xl,Wl,Gl]),m=new Set([yn,ti,Mr,Sr,Hl,Vl]),S=new Uint32Array(4),w=new Int32Array(4),M=new L;let b=null,y=null;const R=[],x=[];let T=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const A=this;let I=!1,N=null,U=null,P=null,B=null;this._outputColorSpace=It;let V=0,q=0,Q=null,X=-1,Y=null;const j=new Ct,se=new Ct;let Z=null;const ue=new ge(0);let oe=0,fe=t.width,H=t.height,K=1,pe=null,ze=null;const he=new Ct(0,0,fe,H),Ge=new Ct(0,0,fe,H);let Te=!1;const ke=new Jl;let $e=!1,st=!1;const Ye=new Je,lt=new L,ut=new Ct,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function St(){return Q===null?K:1}let O=n;function Ht(E,D){return t.getContext(E,D)}let pt,C,v,z,W,J,ce,me,ee,ie,ve,De,Me,le,Ue,Xe,Ze,F,_e,te,xe,ye,re;try{const E={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ul}`),t.addEventListener("webglcontextlost",bt,!1),t.addEventListener("webglcontextrestored",mt,!1),t.addEventListener("webglcontextcreationerror",mn,!1),O===null){const D="webgl2";if(O=Ht(D,E),O===null)throw Ht(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Fe()}catch(E){throw t.removeEventListener("webglcontextlost",bt,!1),t.removeEventListener("webglcontextrestored",mt,!1),t.removeEventListener("webglcontextcreationerror",mn,!1),Ke("WebGLRenderer: "+E.message),E}function Fe(){pt=new Gg(O),pt.init(),xe=new Dx(O,pt),C=new Ng(O,pt,e,xe),v=new Ix(O,pt),C.reversedDepthBuffer&&d&&v.buffers.depth.setReversed(!0),U=O.createFramebuffer(),P=O.createFramebuffer(),B=O.createFramebuffer(),z=new qg(O),W=new xx,J=new Nx(O,pt,v,W,C,xe,z),ce=new kg(A),me=new Kp(O),ye=new Lg(O,me),ee=new Wg(O,me,z,ye),ie=new Kg(O,ee,me,ye,z),F=new Yg(O,C,J),Ue=new Dg(W),ve=new _x(A,ce,pt,C,ye,Ue),De=new Hx(A,W),Me=new Mx,le=new wx(pt),Ze=new Pg(A,ce,v,ie,p,l),Xe=new Lx(A,ie,C),re=new Vx(O,z,C,v),_e=new Ig(O,pt,z),te=new Xg(O,pt,z),z.programs=ve.programs,A.capabilities=C,A.extensions=pt,A.properties=W,A.renderLists=Me,A.shadowMap=Xe,A.state=v,A.info=z}_!==yn&&(T=new Qg(_,t.width,t.height,o,i,r));const Ce=new Bx(A,O);this.xr=Ce,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=pt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=pt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(E){E!==void 0&&(K=E,this.setSize(fe,H,!1))},this.getSize=function(E){return E.set(fe,H)},this.setSize=function(E,D,$=!0){if(Ce.isPresenting){He("WebGLRenderer: Can't change size while VR device is presenting.");return}fe=E,H=D,t.width=Math.floor(E*K),t.height=Math.floor(D*K),$===!0&&(t.style.width=E+"px",t.style.height=D+"px"),T!==null&&T.setSize(t.width,t.height),this.setViewport(0,0,E,D)},this.getDrawingBufferSize=function(E){return E.set(fe*K,H*K).floor()},this.setDrawingBufferSize=function(E,D,$){fe=E,H=D,K=$,t.width=Math.floor(E*$),t.height=Math.floor(D*$),this.setViewport(0,0,E,D)},this.setEffects=function(E){if(_===yn){Ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let D=0;D<E.length;D++)if(E[D].isOutputPass===!0){He("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(j)},this.getViewport=function(E){return E.copy(he)},this.setViewport=function(E,D,$,k){E.isVector4?he.set(E.x,E.y,E.z,E.w):he.set(E,D,$,k),v.viewport(j.copy(he).multiplyScalar(K).round())},this.getScissor=function(E){return E.copy(Ge)},this.setScissor=function(E,D,$,k){E.isVector4?Ge.set(E.x,E.y,E.z,E.w):Ge.set(E,D,$,k),v.scissor(se.copy(Ge).multiplyScalar(K).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(E){v.setScissorTest(Te=E)},this.setOpaqueSort=function(E){pe=E},this.setTransparentSort=function(E){ze=E},this.getClearColor=function(E){return E.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(E=!0,D=!0,$=!0){let k=0;if(E){let G=!1;if(Q!==null){const Ee=Q.texture.format;G=g.has(Ee)}if(G){const Ee=Q.texture.type,Ae=m.has(Ee),be=Ze.getClearColor(),Le=Ze.getClearAlpha(),Oe=be.r,nt=be.g,at=be.b;Ae?(S[0]=Oe,S[1]=nt,S[2]=at,S[3]=Le,O.clearBufferuiv(O.COLOR,0,S)):(w[0]=Oe,w[1]=nt,w[2]=at,w[3]=Le,O.clearBufferiv(O.COLOR,0,w))}else k|=O.COLOR_BUFFER_BIT}D&&(k|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(k|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&O.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),N=E},this.dispose=function(){t.removeEventListener("webglcontextlost",bt,!1),t.removeEventListener("webglcontextrestored",mt,!1),t.removeEventListener("webglcontextcreationerror",mn,!1),Ze.dispose(),Me.dispose(),le.dispose(),W.dispose(),ce.dispose(),ie.dispose(),ye.dispose(),re.dispose(),ve.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",Re),Ce.removeEventListener("sessionend",Ne),At.stop()};function bt(E){E.preventDefault(),Ca("WebGLRenderer: Context Lost."),I=!0}function mt(){Ca("WebGLRenderer: Context Restored."),I=!1;const E=z.autoReset,D=Xe.enabled,$=Xe.autoUpdate,k=Xe.needsUpdate,G=Xe.type;Fe(),z.autoReset=E,Xe.enabled=D,Xe.autoUpdate=$,Xe.needsUpdate=k,Xe.type=G}function mn(E){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function _n(E){const D=E.target;D.removeEventListener("dispose",_n),ne(D)}function ne(E){de(E),W.remove(E)}function de(E){const D=W.get(E).programs;D!==void 0&&(D.forEach(function($){ve.releaseProgram($)}),E.isShaderMaterial&&ve.releaseShaderCache(E))}this.renderBufferDirect=function(E,D,$,k,G,Ee){D===null&&(D=Nt);const Ae=G.isMesh&&G.matrixWorld.determinantAffine()<0,be=dt(E,D,$,k,G);v.setMaterial(k,Ae);let Le=$.index,Oe=1;if(k.wireframe===!0){if(Le=ee.getWireframeAttribute($),Le===void 0)return;Oe=2}const nt=$.drawRange,at=$.attributes.position;let Ie=nt.start*Oe,yt=(nt.start+nt.count)*Oe;Ee!==null&&(Ie=Math.max(Ie,Ee.start*Oe),yt=Math.min(yt,(Ee.start+Ee.count)*Oe)),Le!==null?(Ie=Math.max(Ie,0),yt=Math.min(yt,Le.count)):at!=null&&(Ie=Math.max(Ie,0),yt=Math.min(yt,at.count));const Vt=yt-Ie;if(Vt<0||Vt===1/0)return;ye.setup(G,k,be,$,Le);let Ut,Pt=_e;if(Le!==null&&(Ut=me.get(Le),Pt=te,Pt.setIndex(Ut)),G.isMesh)k.wireframe===!0?(v.setLineWidth(k.wireframeLinewidth*St()),Pt.setMode(O.LINES)):Pt.setMode(O.TRIANGLES);else if(G.isLine){let rn=k.linewidth;rn===void 0&&(rn=1),v.setLineWidth(rn*St()),G.isLineSegments?Pt.setMode(O.LINES):G.isLineLoop?Pt.setMode(O.LINE_LOOP):Pt.setMode(O.LINE_STRIP)}else G.isPoints?Pt.setMode(O.POINTS):G.isSprite&&Pt.setMode(O.TRIANGLES);if(G.isBatchedMesh)if(pt.get("WEBGL_multi_draw"))Pt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const rn=G._multiDrawStarts,we=G._multiDrawCounts,cn=G._multiDrawCount,gt=Le?me.get(Le).bytesPerElement:1,Tn=W.get(k).currentProgram.getUniforms();for(let qn=0;qn<cn;qn++)Tn.setValue(O,"_gl_DrawID",qn),Pt.render(rn[qn]/gt,we[qn])}else if(G.isInstancedMesh)Pt.renderInstances(Ie,Vt,G.count);else if($.isInstancedBufferGeometry){const rn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,we=Math.min($.instanceCount,rn);Pt.renderInstances(Ie,Vt,we)}else Pt.render(Ie,Vt)};function We(E,D,$,k){N!==null&&E.isNodeMaterial&&N.setObject(k,E),$e===!0&&Ue.setState(E,$,!1),E.transparent===!0&&E.side===Wt&&E.forceSinglePass===!1?(E.side=fn,E.needsUpdate=!0,Zt(E,D,k),E.side=Hi,E.needsUpdate=!0,Zt(E,D,k),E.side=Wt):Zt(E,D,k)}this.compile=function(E,D,$=null){$===null&&($=E),N!==null&&N.renderStart(E,D,$),y=le.get($),y.init(D),x.push(y),$.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(y.pushLight(G),G.castShadow&&y.pushShadow(G))}),E!==$&&E.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(y.pushLight(G),G.castShadow&&y.pushShadow(G))}),y.setupLights(),N!==null&&N.updateLights(y.state.lightsArray),st=this.localClippingEnabled,$e=Ue.init(this.clippingPlanes,st),$e===!0&&Ue.setGlobalState(this.clippingPlanes,D),N!==null&&Xe.render(y.state.shadowsArray,$,D);const k=new Set;return E.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const Ee=G.material;if(Ee)if(Array.isArray(Ee))for(let Ae=0;Ae<Ee.length;Ae++){const be=Ee[Ae];We(be,$,D,G),k.add(be)}else We(Ee,$,D,G),k.add(Ee)}),y=x.pop(),N!==null&&N.renderEnd(),k},this.compileAsync=function(E,D,$=null){const k=this.compile(E,D,$);return new Promise(G=>{function Ee(){if(k.forEach(function(Ae){const Le=W.get(Ae).currentProgram;(Le===void 0||Le.isReady())&&k.delete(Ae)}),k.size===0){G(E);return}setTimeout(Ee,10)}pt.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let je=null;function ae(E){je&&je(E)}function Re(){At.stop()}function Ne(){At.start()}const At=new ed;At.setAnimationLoop(ae),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(E){je=E,Ce.setAnimationLoop(E),E===null?At.stop():At.start()},Ce.addEventListener("sessionstart",Re),Ce.addEventListener("sessionend",Ne),this.render=function(E,D){if(D!==void 0&&D.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;N!==null&&N.renderStart(E,D);const $=Ce.enabled===!0&&Ce.isPresenting===!0,k=T!==null&&(Q===null||$)&&T.begin(A,Q);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(D),D=Ce.getCamera()),E.isScene===!0&&E.onBeforeRender(A,E,D,Q),y=le.get(E,x.length),y.init(D),y.state.textureUnits=J.getTextureUnits(),x.push(y),Ye.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),ke.setFromProjectionMatrix(Ye,ei,D.reversedDepth),st=this.localClippingEnabled,$e=Ue.init(this.clippingPlanes,st),b=Me.get(E,R.length),b.init(),R.push(b),Ce.enabled===!0&&Ce.isPresenting===!0){const Ae=A.xr.getDepthSensingMesh();Ae!==null&&qt(Ae,D,-1/0,A.sortObjects)}qt(E,D,0,A.sortObjects),b.finish(),N!==null&&N.updateLights(y.state.lightsArray),A.sortObjects===!0&&b.sort(pe,ze),ht=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,ht&&Ze.addToRenderList(b,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),$e===!0&&Ue.beginShadows();const G=y.state.shadowsArray;if(Xe.render(G,E,D),$e===!0&&Ue.endShadows(),(k&&T.hasRenderPass())===!1){const Ae=b.opaque,be=b.transmissive;if(y.setupLights(),D.isArrayCamera){const Le=D.cameras;if(be.length>0)for(let Oe=0,nt=Le.length;Oe<nt;Oe++){const at=Le[Oe];Si(Ae,be,E,at)}ht&&Ze.render(E);for(let Oe=0,nt=Le.length;Oe<nt;Oe++){const at=Le[Oe];Mi(b,E,at,at.viewport)}}else be.length>0&&Si(Ae,be,E,D),ht&&Ze.render(E),Mi(b,E,D)}Q!==null&&q===0&&(J.updateMultisampleRenderTarget(Q),J.updateRenderTargetMipmap(Q)),k&&T.end(A),E.isScene===!0&&E.onAfterRender(A,E,D),ye.resetDefaultState(),X=-1,Y=null,x.pop(),x.length>0?(y=x[x.length-1],J.setTextureUnits(y.state.textureUnits),$e===!0&&Ue.setGlobalState(A.clippingPlanes,y.state.camera)):y=null,R.pop(),R.length>0?b=R[R.length-1]:b=null,N!==null&&N.renderEnd()};function qt(E,D,$,k){if(E.visible===!1)return;if(E.layers.test(D.layers)){if(E.isGroup)$=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(D);else if(E.isLightProbeGrid)y.pushLightProbeGrid(E);else if(E.isLight)y.pushLight(E),E.castShadow&&y.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||E.intersectsFrustum(ke)){k&&ut.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ye);const Ae=ie.update(E),be=E.material;be.visible&&b.push(E,Ae,be,$,ut.z,null,D)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||E.intersectsFrustum(ke))){const Ae=ie.update(E),be=E.material;if(k&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ut.copy(E.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),ut.copy(Ae.boundingSphere.center)),ut.applyMatrix4(E.matrixWorld).applyMatrix4(Ye)),Array.isArray(be)){const Le=Ae.groups;for(let Oe=0,nt=Le.length;Oe<nt;Oe++){const at=Le[Oe],Ie=be[at.materialIndex];Ie&&Ie.visible&&b.push(E,Ae,Ie,$,ut.z,at,D)}}else be.visible&&b.push(E,Ae,be,$,ut.z,null,D)}}const Ee=E.children;for(let Ae=0,be=Ee.length;Ae<be;Ae++)qt(Ee[Ae],D,$,k)}function Mi(E,D,$,k){const{opaque:G,transmissive:Ee,transparent:Ae}=E;y.setupLightsView($),$e===!0&&Ue.setGlobalState(A.clippingPlanes,$),k&&v.viewport(j.copy(k)),G.length>0&&xn(G,D,$),Ee.length>0&&xn(Ee,D,$),Ae.length>0&&xn(Ae,D,$),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function Si(E,D,$,k){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[k.id]===void 0){const Ie=pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[k.id]=new Nn(1,1,{generateMipmaps:!0,type:Ie?kn:yn,minFilter:jn,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ot.workingColorSpace})}const Ee=y.state.transmissionRenderTarget[k.id],Ae=k.viewport||j;Ee.setSize(Ae.z*A.transmissionResolutionScale,Ae.w*A.transmissionResolutionScale);const be=A.getRenderTarget(),Le=A.getActiveCubeFace(),Oe=A.getActiveMipmapLevel();A.setRenderTarget(Ee),A.getClearColor(ue),oe=A.getClearAlpha(),oe<1&&A.setClearColor(16777215,.5),A.clear(),ht&&Ze.render($);const nt=A.toneMapping;A.toneMapping=Hn;const at=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),y.setupLightsView(k),$e===!0&&Ue.setGlobalState(A.clippingPlanes,k),xn(E,$,k),J.updateMultisampleRenderTarget(Ee),J.updateRenderTargetMipmap(Ee),pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let yt=0,Vt=D.length;yt<Vt;yt++){const Ut=D[yt],{object:Pt,geometry:rn,material:we,group:cn}=Ut;if(we.side===Wt&&Pt.layers.test(k.layers)){const gt=we.side;we.side=fn,we.needsUpdate=!0,ii(Pt,$,k,rn,we,cn),we.side=gt,we.needsUpdate=!0,Ie=!0}}Ie===!0&&(J.updateMultisampleRenderTarget(Ee),J.updateRenderTargetMipmap(Ee))}A.setRenderTarget(be,Le,Oe),A.setClearColor(ue,oe),at!==void 0&&(k.viewport=at),A.toneMapping=nt}function xn(E,D,$){const k=D.isScene===!0?D.overrideMaterial:null;for(let G=0,Ee=E.length;G<Ee;G++){const Ae=E[G],{object:be,geometry:Le,group:Oe}=Ae;let nt=Ae.material;nt.allowOverride===!0&&k!==null&&(nt=k),be.layers.test($.layers)&&ii(be,D,$,Le,nt,Oe)}}function ii(E,D,$,k,G,Ee){N!==null&&G.isNodeMaterial&&N.setObject(E,G),E.onBeforeRender(A,D,$,k,G,Ee),E.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),G.onBeforeRender(A,D,$,k,E,Ee),G.transparent===!0&&G.side===Wt&&G.forceSinglePass===!1?(G.side=fn,G.needsUpdate=!0,A.renderBufferDirect($,D,k,G,E,Ee),G.side=Hi,G.needsUpdate=!0,A.renderBufferDirect($,D,k,G,E,Ee),G.side=Wt):A.renderBufferDirect($,D,k,G,E,Ee),E.onAfterRender(A,D,$,k,G,Ee)}function Zt(E,D,$){D.isScene!==!0&&(D=Nt);const k=W.get(E),G=y.state.lights,Ee=y.state.shadowsArray,Ae=G.state.version,be=ve.getParameters(E,G.state,Ee,D,$,y.state.lightProbeGridArray),Le=ve.getProgramCacheKey(be);let Oe=k.programs;k.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?D.environment:null,k.fog=D.fog;const nt=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;k.envMap=ce.get(E.envMap||k.environment,nt),k.envMapRotation=k.environment!==null&&E.envMap===null?D.environmentRotation:E.envMapRotation,Oe===void 0&&(E.addEventListener("dispose",_n),Oe=new Map,k.programs=Oe);let at=Oe.get(Le);if(at!==void 0){if(k.currentProgram===at&&k.lightsStateVersion===Ae)return Pe(E,be),at}else be.uniforms=ve.getUniforms(E),N!==null&&E.isNodeMaterial&&N.build(E,$,be),E.onBeforeCompile(be,A),at=ve.acquireProgram(be,Le),Oe.set(Le,at),k.uniforms=be.uniforms;const Ie=k.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ie.clippingPlanes=Ue.uniform),Pe(E,be),k.needsLights=qa(E),k.lightsStateVersion=Ae,k.needsLights&&(Ie.ambientLightColor.value=G.state.ambient,Ie.lightProbe.value=G.state.probe,Ie.sunLights.value=G.state.sun,Ie.sunLightShadows.value=G.state.sunShadow,Ie.directionalLights.value=G.state.directional,Ie.directionalLightShadows.value=G.state.directionalShadow,Ie.spotLights.value=G.state.spot,Ie.spotLightShadows.value=G.state.spotShadow,Ie.rectAreaLights.value=G.state.rectArea,Ie.ltc_1.value=G.state.rectAreaLTC1,Ie.ltc_2.value=G.state.rectAreaLTC2,Ie.pointLights.value=G.state.point,Ie.pointLightShadows.value=G.state.pointShadow,Ie.hemisphereLights.value=G.state.hemi,Ie.sunShadowMatrix.value=G.state.sunShadowMatrix,Ie.sunShadowCascade.value=G.state.sunShadowCascade,Ie.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ie.spotLightMatrix.value=G.state.spotLightMatrix,Ie.spotLightMap.value=G.state.spotLightMap,Ie.pointShadowMatrix.value=G.state.pointShadowMatrix),k.lightProbeGrid=y.state.lightProbeGridArray.length>0,k.currentProgram=at,k.uniformsList=null,at}function yi(E){if(E.uniformsList===null){const D=E.currentProgram.getUniforms();E.uniformsList=Ea.seqWithValue(D.seq,E.uniforms)}return E.uniformsList}function Pe(E,D){const $=W.get(E);$.outputColorSpace=D.outputColorSpace,$.batching=D.batching,$.batchingColor=D.batchingColor,$.instancing=D.instancing,$.instancingColor=D.instancingColor,$.instancingMorph=D.instancingMorph,$.skinning=D.skinning,$.morphTargets=D.morphTargets,$.morphNormals=D.morphNormals,$.morphColors=D.morphColors,$.morphTargetsCount=D.morphTargetsCount,$.numClippingPlanes=D.numClippingPlanes,$.numIntersection=D.numClipIntersection,$.vertexAlphas=D.vertexAlphas,$.vertexTangents=D.vertexTangents,$.toneMapping=D.toneMapping}function ct(E,D){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;M.setFromMatrixPosition(D.matrixWorld);for(let $=0,k=E.length;$<k;$++){const G=E[$];if(G.texture!==null&&G.boundingBox.containsPoint(M))return G}return null}function dt(E,D,$,k,G){D.isScene!==!0&&(D=Nt),J.resetTextureUnits();const Ee=D.fog,Ae=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?D.environment:null,be=Q===null?A.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:ot.workingColorSpace,Le=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Oe=ce.get(k.envMap||Ae,Le),nt=k.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,at=!!$.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ie=!!$.morphAttributes.position,yt=!!$.morphAttributes.normal,Vt=!!$.morphAttributes.color;let Ut=Hn;k.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ut=A.toneMapping);const Pt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,rn=Pt!==void 0?Pt.length:0,we=W.get(k),cn=y.state.lights;if($e===!0&&(st===!0||E!==Y)){const Dt=E===Y&&k.id===X;Ue.setState(k,E,Dt)}let gt=!1;k.version===we.__version?(we.needsLights&&we.lightsStateVersion!==cn.state.version||we.outputColorSpace!==be||G.isBatchedMesh&&we.batching===!1||!G.isBatchedMesh&&we.batching===!0||G.isBatchedMesh&&we.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&we.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&we.instancing===!1||!G.isInstancedMesh&&we.instancing===!0||G.isSkinnedMesh&&we.skinning===!1||!G.isSkinnedMesh&&we.skinning===!0||G.isInstancedMesh&&we.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&we.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&we.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&we.instancingMorph===!1&&G.morphTexture!==null||we.envMap!==Oe||k.fog===!0&&we.fog!==Ee||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Ue.numPlanes||we.numIntersection!==Ue.numIntersection)||we.vertexAlphas!==nt||we.vertexTangents!==at||we.morphTargets!==Ie||we.morphNormals!==yt||we.morphColors!==Vt||we.toneMapping!==Ut||we.morphTargetsCount!==rn||!!we.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(gt=!0):(gt=!0,we.__version=k.version);let Tn=we.currentProgram;gt===!0&&(Tn=Zt(k,D,G),N&&k.isNodeMaterial&&N.onUpdateProgram(k,Tn,we));let qn=!1,bi=!1,ls=!1;const Rt=Tn.getUniforms(),Ot=we.uniforms;if(v.useProgram(Tn.program)&&(qn=!0,bi=!0,ls=!0),k.id!==X&&(X=k.id,bi=!0),we.needsLights){const Dt=ct(y.state.lightProbeGridArray,G);we.lightProbeGrid!==Dt&&(we.lightProbeGrid=Dt,bi=!0)}if(qn||Y!==E){v.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Rt.setValue(O,"projectionMatrix",E.projectionMatrix),Rt.setValue(O,"viewMatrix",E.matrixWorldInverse);const Ti=Rt.map.cameraPosition;Ti!==void 0&&Ti.setValue(O,lt.setFromMatrixPosition(E.matrixWorld)),C.logarithmicDepthBuffer&&Rt.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Rt.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),Y!==E&&(Y=E,bi=!0,ls=!0)}if(we.needsLights&&(cn.state.sunShadowMap.length>0&&Rt.setValue(O,"sunShadowMap",cn.state.sunShadowMap,J),cn.state.directionalShadowMap.length>0&&Rt.setValue(O,"directionalShadowMap",cn.state.directionalShadowMap,J),cn.state.spotShadowMap.length>0&&Rt.setValue(O,"spotShadowMap",cn.state.spotShadowMap,J),cn.state.pointShadowMap.length>0&&Rt.setValue(O,"pointShadowMap",cn.state.pointShadowMap,J)),G.isSkinnedMesh){Rt.setOptional(O,G,"bindMatrix"),Rt.setOptional(O,G,"bindMatrixInverse");const Dt=G.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),Rt.setValue(O,"boneTexture",Dt.boneTexture,J))}G.isBatchedMesh&&(Rt.setOptional(O,G,"batchingTexture"),Rt.setValue(O,"batchingTexture",G._matricesTexture,J),Rt.setOptional(O,G,"batchingIdTexture"),Rt.setValue(O,"batchingIdTexture",G._indirectTexture,J),Rt.setOptional(O,G,"batchingColorTexture"),G._colorsTexture!==null&&Rt.setValue(O,"batchingColorTexture",G._colorsTexture,J));const Ei=$.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&F.update(G,$,Tn),(bi||we.receiveShadow!==G.receiveShadow)&&(we.receiveShadow=G.receiveShadow,Rt.setValue(O,"receiveShadow",G.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&D.environment!==null&&(Ot.envMapIntensity.value=D.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=Gx()),bi){if(Rt.setValue(O,"toneMappingExposure",A.toneMappingExposure),we.needsLights&&Or(Ot,ls),Ee&&k.fog===!0&&De.refreshFogUniforms(Ot,Ee),De.refreshMaterialUniforms(Ot,k,K,H,y.state.transmissionRenderTarget[E.id]),we.needsLights&&we.lightProbeGrid){const Dt=we.lightProbeGrid;Ot.probesSH.value=Dt.texture,Ot.probesMin.value.copy(Dt.boundingBox.min),Ot.probesMax.value.copy(Dt.boundingBox.max),Ot.probesResolution.value.copy(Dt.resolution)}Ea.upload(O,yi(we),Ot,J)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ea.upload(O,yi(we),Ot,J),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Rt.setValue(O,"center",G.center),Rt.setValue(O,"modelViewMatrix",G.modelViewMatrix),Rt.setValue(O,"normalMatrix",G.normalMatrix),Rt.setValue(O,"modelMatrix",G.matrixWorld),k.uniformsGroups!==void 0){const Dt=k.uniformsGroups;for(let Ti=0,cs=Dt.length;Ti<cs;Ti++){const Sc=Dt[Ti];re.update(Sc,Tn),re.bind(Sc,Tn)}}return Tn}function Or(E,D){E.ambientLightColor.needsUpdate=D,E.lightProbe.needsUpdate=D,E.sunLights.needsUpdate=D,E.sunLightShadows.needsUpdate=D,E.directionalLights.needsUpdate=D,E.directionalLightShadows.needsUpdate=D,E.pointLights.needsUpdate=D,E.pointLightShadows.needsUpdate=D,E.spotLights.needsUpdate=D,E.spotLightShadows.needsUpdate=D,E.rectAreaLights.needsUpdate=D,E.hemisphereLights.needsUpdate=D}function qa(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(E,D,$){const k=W.get(E);k.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),W.get(E.texture).__webglTexture=D,W.get(E.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:$,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,D){const $=W.get(E);$.__webglFramebuffer=D,$.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(E,D=0,$=0){Q=E,V=D,q=$;let k=null,G=!1,Ee=!1;if(E){const be=W.get(E);if(be.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(O.FRAMEBUFFER,be.__webglFramebuffer),j.copy(E.viewport),se.copy(E.scissor),Z=E.scissorTest,v.viewport(j),v.scissor(se),v.setScissorTest(Z),X=-1;return}else if(be.__webglFramebuffer===void 0)J.setupRenderTarget(E);else if(be.__hasExternalTextures)J.rebindTextures(E,W.get(E.texture).__webglTexture,W.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const nt=E.depthTexture;if(be.__boundDepthTexture!==nt){if(nt!==null&&W.has(nt)&&(E.width!==nt.image.width||E.height!==nt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(E)}}const Le=E.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(Ee=!0);const Oe=W.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Oe[D])?k=Oe[D][$]:k=Oe[D],G=!0):E.samples>0&&J.useMultisampledRTT(E)===!1?k=W.get(E).__webglMultisampledFramebuffer:Array.isArray(Oe)?k=Oe[$]:k=Oe,j.copy(E.viewport),se.copy(E.scissor),Z=E.scissorTest}else j.copy(he).multiplyScalar(K).floor(),se.copy(Ge).multiplyScalar(K).floor(),Z=Te;if($!==0&&(k=U),v.bindFramebuffer(O.FRAMEBUFFER,k)&&v.drawBuffers(E,k),v.viewport(j),v.scissor(se),v.setScissorTest(Z),G){const be=W.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+D,be.__webglTexture,$)}else if(Ee){const be=D;for(let Le=0;Le<E.textures.length;Le++){const Oe=W.get(E.textures[Le]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Le,Oe.__webglTexture,$,be)}}else if(E!==null&&$!==0){const be=W.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,be.__webglTexture,$)}X=-1};function Ys(E){const D=W.get(E);return(D.__readFormat!==E.format||D.__readType!==E.type)&&(D.__readFormat=E.format,D.__readType=E.type,D.__formatReadable=C.textureFormatReadable(E.format),D.__typeReadable=C.textureTypeReadable(E.type)),D}this.readRenderTargetPixels=function(E,D,$,k,G,Ee,Ae,be=0){if(!(E&&E.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Le=W.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ae!==void 0&&(Le=Le[Ae]),Le){v.bindFramebuffer(O.FRAMEBUFFER,Le);try{const Oe=E.textures[be],nt=Oe.format,at=Oe.type;E.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+be);const Ie=Ys(Oe);if(Ie.__formatReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ie.__typeReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=E.width-k&&$>=0&&$<=E.height-G&&O.readPixels(D,$,k,G,xe.convert(nt),xe.convert(at),Ee)}finally{const Oe=Q!==null?W.get(Q).__webglFramebuffer:null;v.bindFramebuffer(O.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(E,D,$,k,G,Ee,Ae,be=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Le=W.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ae!==void 0&&(Le=Le[Ae]),Le)if(D>=0&&D<=E.width-k&&$>=0&&$<=E.height-G){v.bindFramebuffer(O.FRAMEBUFFER,Le);const Oe=E.textures[be],nt=Oe.format,at=Oe.type;E.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+be);const Ie=Ys(Oe);if(Ie.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ie.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const yt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,yt),O.bufferData(O.PIXEL_PACK_BUFFER,Ee.byteLength,O.STREAM_READ),O.readPixels(D,$,k,G,xe.convert(nt),xe.convert(at),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const Vt=Q!==null?W.get(Q).__webglFramebuffer:null;v.bindFramebuffer(O.FRAMEBUFFER,Vt);const Ut=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await uf(O,Ut,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,yt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Ee),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(yt),O.deleteSync(Ut),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,D=null,$=0){const k=Math.pow(2,-$),G=Math.floor(E.image.width*k),Ee=Math.floor(E.image.height*k),Ae=D!==null?D.x:0,be=D!==null?D.y:0;J.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,$,0,0,Ae,be,G,Ee),v.unbindTexture()},this.copyTextureToTexture=function(E,D,$=null,k=null,G=0,Ee=0){let Ae,be,Le,Oe,nt,at,Ie,yt,Vt;const Ut=E.isCompressedTexture?E.mipmaps[Ee]:E.image;if($!==null)Ae=$.max.x-$.min.x,be=$.max.y-$.min.y,Le=$.isBox3?$.max.z-$.min.z:1,Oe=$.min.x,nt=$.min.y,at=$.isBox3?$.min.z:0;else{const Ot=Math.pow(2,-G);Ae=Math.floor(Ut.width*Ot),be=Math.floor(Ut.height*Ot),E.isDataArrayTexture?Le=Ut.depth:E.isData3DTexture?Le=Math.floor(Ut.depth*Ot):Le=1,Oe=0,nt=0,at=0}k!==null?(Ie=k.x,yt=k.y,Vt=k.z):(Ie=0,yt=0,Vt=0);const Pt=xe.convert(D.format),rn=xe.convert(D.type);let we;D.isData3DTexture?(J.setTexture3D(D,0),we=O.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(J.setTexture2DArray(D,0),we=O.TEXTURE_2D_ARRAY):(J.setTexture2D(D,0),we=O.TEXTURE_2D),v.activeTexture(O.TEXTURE0),v.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,D.flipY),v.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),v.pixelStorei(O.UNPACK_ALIGNMENT,D.unpackAlignment);const cn=v.getParameter(O.UNPACK_ROW_LENGTH),gt=v.getParameter(O.UNPACK_IMAGE_HEIGHT),Tn=v.getParameter(O.UNPACK_SKIP_PIXELS),qn=v.getParameter(O.UNPACK_SKIP_ROWS),bi=v.getParameter(O.UNPACK_SKIP_IMAGES);v.pixelStorei(O.UNPACK_ROW_LENGTH,Ut.width),v.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ut.height),v.pixelStorei(O.UNPACK_SKIP_PIXELS,Oe),v.pixelStorei(O.UNPACK_SKIP_ROWS,nt),v.pixelStorei(O.UNPACK_SKIP_IMAGES,at);const ls=E.isDataArrayTexture||E.isData3DTexture,Rt=D.isDataArrayTexture||D.isData3DTexture;if(E.isDepthTexture){const Ot=W.get(E),Ei=W.get(D),Dt=W.get(Ot.__renderTarget),Ti=W.get(Ei.__renderTarget);v.bindFramebuffer(O.READ_FRAMEBUFFER,Dt.__webglFramebuffer),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ti.__webglFramebuffer);for(let cs=0;cs<Le;cs++)ls&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,W.get(E).__webglTexture,G,at+cs),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,W.get(D).__webglTexture,Ee,Vt+cs)),O.blitFramebuffer(Oe,nt,Ae,be,Ie,yt,Ae,be,O.DEPTH_BUFFER_BIT,O.NEAREST);v.bindFramebuffer(O.READ_FRAMEBUFFER,null),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(G!==0||E.isRenderTargetTexture||W.has(E)){const Ot=W.get(E),Ei=W.get(D);v.bindFramebuffer(O.READ_FRAMEBUFFER,P),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,B);for(let Dt=0;Dt<Le;Dt++)ls?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ot.__webglTexture,G,at+Dt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ot.__webglTexture,G),Rt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ei.__webglTexture,Ee,Vt+Dt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ei.__webglTexture,Ee),G!==0?O.blitFramebuffer(Oe,nt,Ae,be,Ie,yt,Ae,be,O.COLOR_BUFFER_BIT,O.NEAREST):Rt?O.copyTexSubImage3D(we,Ee,Ie,yt,Vt+Dt,Oe,nt,Ae,be):O.copyTexSubImage2D(we,Ee,Ie,yt,Oe,nt,Ae,be);v.bindFramebuffer(O.READ_FRAMEBUFFER,null),v.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Rt?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(we,Ee,Ie,yt,Vt,Ae,be,Le,Pt,rn,Ut.data):D.isCompressedArrayTexture?O.compressedTexSubImage3D(we,Ee,Ie,yt,Vt,Ae,be,Le,Pt,Ut.data):O.texSubImage3D(we,Ee,Ie,yt,Vt,Ae,be,Le,Pt,rn,Ut):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Ee,Ie,yt,Ae,be,Pt,rn,Ut.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Ee,Ie,yt,Ut.width,Ut.height,Pt,Ut.data):O.texSubImage2D(O.TEXTURE_2D,Ee,Ie,yt,Ae,be,Pt,rn,Ut);v.pixelStorei(O.UNPACK_ROW_LENGTH,cn),v.pixelStorei(O.UNPACK_IMAGE_HEIGHT,gt),v.pixelStorei(O.UNPACK_SKIP_PIXELS,Tn),v.pixelStorei(O.UNPACK_SKIP_ROWS,qn),v.pixelStorei(O.UNPACK_SKIP_IMAGES,bi),Ee===0&&D.generateMipmaps&&O.generateMipmap(we),v.unbindTexture()},this.initRenderTarget=function(E){W.get(E).__webglFramebuffer===void 0&&J.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?J.setTextureCube(E,0):E.isData3DTexture?J.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?J.setTexture2DArray(E,0):J.setTexture2D(E,0),v.unbindTexture()},this.resetState=function(){V=0,q=0,Q=null,v.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}}const Ji={topSpeed:62,accel:15,brake:34,grip:24,turnRate:1.5,assist:.38,nitroGain:1.3,nitroFill:.07,driftGrip:2.1,driftSpeed:.88,driftFill:.2,driftFrom:20,driftSlip:.5,offTrackSpeed:.45,offTrackGrip:.55,catchUp:.1,catchUpFrom:30,catchUpFull:200,towSpan:60,towGrace:1.2,towBack:45,draftGain:.07,draftFrom:3,draftTo:26,draftWidth:1.7,flowGain:.05,flowAfter:3,flowFull:9,carLength:4.5,carWidth:2.1},Gt=1/60,An=(s,e,t)=>Math.min(t,Math.max(e,s));class Xx{constructor(e,t,n){qe(this,"cars",[]);qe(this,"inputs",[]);qe(this,"phase","grid");qe(this,"clock",-3);qe(this,"course");qe(this,"laps");qe(this,"carry",0);qe(this,"placed",0);qe(this,"front",0);qe(this,"lost",[]);this.course=e,this.laps=t,n.forEach((i,r)=>{this.cars.push({s:-6-Math.floor(r/2)*9-r%2*3,d:(r%2?-1:1)*e.half*.42,v:0,yaw:0,steer:0,nitro:.35,boosting:!1,braking:!1,drifting:!1,slip:0,offTrack:!1,spin:0,lap:0,finished:null,bot:i,draft:0,flow:0,clean:0,best:null,lapStart:0}),this.inputs.push({steer:0,brake:!1,nitro:!1,drift:!1})})}start(){this.phase==="grid"&&(this.phase="countdown")}order(){const e=t=>t.finished!==null?1e9-t.finished:t.s;return this.cars.map((t,n)=>n).sort((t,n)=>e(this.cars[n])-e(this.cars[t]))}advance(e){const t=[];for(this.carry=Math.min(this.carry+e,.25);this.carry>=Gt;)this.carry-=Gt,this.tick(t);return t}tick(e){if(!(this.phase==="grid"||this.phase==="done")){if(this.clock+=Gt,this.phase==="countdown"){if(this.clock<0)return;this.phase="race"}this.front=Math.max(...this.cars.map(t=>t.s)),this.reward(),this.cars.forEach((t,n)=>{t.bot&&this.drive(t,this.inputs[n],n),this.move(t,this.inputs[n],n,e)}),this.collide(e),this.tow(e),this.cars.forEach((t,n)=>{const i=Math.floor(t.s/this.course.length);if(i>t.lap&&t.finished===null){t.lap=i;const r=this.clock-t.lapStart;(t.best===null||r<t.best)&&(t.best=r),t.lapStart=this.clock,i>=this.laps?(t.finished=this.clock,e.push({type:"finish",car:n,place:++this.placed})):e.push({type:"lap",car:n,lap:i})}}),this.placed===this.cars.length&&(this.phase="done")}}move(e,t,n,i){const{course:r}=this,a=Ji,o=e.finished!==null,l=An(o?-e.d*.1-e.yaw*2:t.steer,-1,1);e.steer+=(l-e.steer)*Math.min(1,Gt*9),e.offTrack=Math.abs(e.d)>r.half+.3,(e.offTrack||e.spin>0)&&(e.clean=0),e.braking=!o&&t.brake,e.boosting=!o&&t.nitro&&e.nitro>0&&e.spin<=0&&!e.offTrack,e.drifting=!o&&t.drift&&e.spin<=0&&!e.offTrack&&e.v>a.driftFrom&&(e.drifting||Math.abs(e.steer)>.3),e.slip+=((e.drifting?An(e.steer*2,-1,1)*a.driftSlip:0)-e.slip)*Math.min(1,Gt*5),e.nitro=An(e.nitro+(e.boosting?-.34:e.drifting?a.driftFill:a.nitroFill)*Gt,0,1);let c=a.topSpeed*(e.boosting?a.nitroGain:1)*(e.drifting?a.driftSpeed:1)*(e.offTrack?a.offTrackSpeed:1);c*=(1+a.draftGain*e.draft)*(1+a.flowGain*e.flow),c*=1+a.catchUp*An((this.front-e.s-a.catchUpFrom)/(a.catchUpFull-a.catchUpFrom),0,1),o&&(c*=.4),e.spin>0?(e.spin-=Gt,e.yaw+=Gt*9*Math.sign(e.yaw||1),e.v*=1-Gt*1.6,e.spin<=0&&(e.yaw=0)):e.braking?e.v=Math.max(0,e.v-a.brake*Gt):e.v<c?e.v+=a.accel*(e.boosting?1.7:1)*(1-e.v/c)*Gt+.6*Gt:e.v-=(e.v-c)*(e.offTrack?2.2:.8)*Gt;const u=r.curvature(e.s);if(e.spin<=0){const f=a.grip*(e.offTrack?a.offTrackGrip:1)*(e.drifting?a.driftGrip:1)/Math.max(e.v,9),p=An(e.steer*a.turnRate,-f,f)+u*e.v*a.assist;e.yaw+=(p-u*e.v)*Gt,e.yaw=An(e.yaw,-1.1,1.1),e.yaw-=e.yaw*Math.min(1,Gt*.9)*(1-Math.abs(e.steer))}const h=e.spin>0?e.v:e.v*Math.cos(e.yaw);if(e.s+=h/Math.max(.4,1-e.d*u)*Gt,e.spin<=0&&(e.d+=e.v*Math.sin(e.yaw)*Gt),Math.abs(e.d)>r.wall){const d=Math.sign(e.d),f=Math.max(0,Math.sin(e.yaw)*d)*e.v;e.d=d*r.wall,e.yaw=-e.yaw*.35-d*.04,e.v*=1-Math.min(.5,.1+f*.035),f>1.5&&(i.push({type:"wall",car:n,force:Math.min(1,f/14)}),e.clean=0,e.nitro*=.6),f>13&&(e.spin=.9)}}reward(){const e=Ji;for(const t of this.cars){let n=!1;for(const i of this.cars){const r=i.s-t.s;i!==t&&r>e.draftFrom&&r<e.draftTo&&Math.abs(i.d-t.d)<e.draftWidth&&i.v>20&&(n=!0)}t.draft+=((n?1:0)-t.draft)*Math.min(1,Gt*(n?1.2:3)),t.clean+=Gt,t.flow=An((t.clean-e.flowAfter)/(e.flowFull-e.flowAfter),0,1)}}tow(e){const t=Ji,n=this.course.half-1.5;let i=null;for(const r of this.cars)!r.bot&&r.finished===null&&(i===null||r.s>i.s)&&(i=r);this.cars.forEach((r,a)=>{var l;if(i===null||r.bot||r.finished!==null||r.s>=i.s-t.towSpan){this.lost[a]=0;return}if(this.lost[a]=((l=this.lost[a])!=null?l:0)+Gt,this.lost[a]<t.towGrace)return;this.lost[a]=0;let o=i.s-t.towBack+7;for(const c of this.cars)c!==r&&c.finished===null&&c.s>=i.s-t.towSpan&&c.s<o&&(o=c.s);r.s=Math.max(i.s-t.towSpan+4,o-7),r.clean=0,r.d=An(r.d,-n,n),r.v=Math.max(r.v,i.v*.9),r.yaw=r.slip=r.spin=r.steer=r.nitro=0,r.drifting=r.offTrack=!1,e.push({type:"tow",car:a})})}collide(e){const{carLength:t,carWidth:n}=Ji,i=this.course.length;for(let r=0;r<this.cars.length;r++)for(let a=r+1;a<this.cars.length;a++){const o=this.cars[r],l=this.cars[a];let c=(l.s-o.s)%i;c>i/2?c-=i:c<-i/2&&(c+=i);const u=l.d-o.d,h=t-Math.abs(c),d=n-Math.abs(u);if(h<=0||d<=0)continue;const f=Math.abs(o.v-l.v);if(d<h){const p=d/2*Math.sign(u||1);o.d-=p,l.d+=p,o.yaw-=.05*Math.sign(u||1),l.yaw+=.05*Math.sign(u||1),o.v*=.985,l.v*=.985,e.push({type:"hit",car:r,other:a,force:Math.min(1,.2+d)}),d>.25&&(o.clean=l.clean=0)}else{const[p,_]=c>0?[l,o]:[o,l];p.s+=h/2,_.s-=h/2;const g=(p.v+_.v)/2;p.v=g+f*.35,_.v=g-f*.35,f>1&&e.push({type:"hit",car:r,other:a,force:Math.min(1,f/18)}),f>4&&(_.clean=0),f>20&&(_.spin=.8)}}}drive(e,t,n){const{course:i}=this,r=Ji,a=12+e.v*.9,o=i.curvature(e.s),l=i.curvature(e.s+a),c=i.curvature(e.s+a*2.2),u=(n*37%11/10-.5)*i.half*.9;let h=An(Math.sign(l)*Math.min(1,Math.abs(l)*60)*i.half*.6+u*(1-Math.min(1,Math.abs(l)*60)),-i.half+1.4,i.half-1.4);for(let _=0;_<this.cars.length;_++){if(_===n)continue;const g=this.cars[_],m=g.s-e.s;m>0&&m<6+e.v*.5&&Math.abs(g.d-e.d)<2.6&&g.v<e.v+2&&(h=An(g.d+(g.d>e.d?-3:3),-i.half+1.2,i.half-1.2))}const d=Math.atan2(h-e.d,a);t.steer=An((d-e.yaw)*2.6+(l-o)*9,-1,1);const f=Math.max(Math.abs(l),Math.abs(c)),p=f>1e-4?Math.sqrt(r.grip*.93/(f*(1-r.assist*.3))):1/0;t.brake=e.v>p*1.06,t.drift=Math.abs(o)>.011&&e.v>r.driftFrom+4,t.nitro=!t.brake&&f<.004&&Math.abs(e.yaw)<.08&&e.nitro>(e.boosting?.02:.6)}}const Ki={motor:{from:.06998,to:5.96712,hz:175},gomas:{from:6.0571,to:8.0571},ripio:{from:8.14707,to:10.14707},golpe0:{from:10.21705,to:10.52576},golpe1:{from:10.57574,to:11.48113},golpe2:{from:11.53111,to:13.53111},nitro:{from:13.58109,to:15.98109}},qx=""+new URL("sonido-DpiArgn9.wav",import.meta.url).href,Gu=3,Yx=.03;function Kx(s){const e=Math.max(0,s)/Ji.topSpeed*5,t=Math.min(4,Math.floor(e)),n=e-t;return t===0?.25+.75*n:.5+.5*Math.min(1.3,n)}class $x{constructor(e){qe(this,"ctx");qe(this,"master");qe(this,"clips",null);qe(this,"voices",[]);qe(this,"skid",null);qe(this,"rumble",null);qe(this,"level",{skid:0,rumble:0});qe(this,"since",0);qe(this,"lastCrash",0);qe(this,"lastBoost",0);this.ctx=e;const t=e.createDynamicsCompressor();t.connect(e.destination),this.master=e.createGain(),this.master.gain.value=.8,this.master.connect(t),this.load()}async load(){try{const e=await(await fetch(qx)).arrayBuffer();this.clips=await new Promise((t,n)=>this.ctx.decodeAudioData(e,t,n))}catch{return}for(let e=0;e<Gu;e++){const t=this.ctx.createBiquadFilter();t.type="lowpass",t.Q.value=.7,t.connect(this.master),this.voices.push({engine:this.loop(Ki.motor,t),tone:t,rev:.25,loud:0,open:1,boosting:!1})}this.skid=this.loop(Ki.gomas,this.master),this.rumble=this.loop(Ki.ripio,this.master)}loop(e,t){const n=this.ctx.createBufferSource(),i=this.ctx.createGain();return n.buffer=this.clips,n.loop=!0,n.loopStart=e.from,n.loopEnd=e.to,i.gain.value=0,n.connect(i),i.connect(t),n.start(0,e.from+Math.random()*(e.to-e.from)),{source:n,level:i}}wake(){this.ctx.state==="suspended"&&this.ctx.resume()}update(e,t,n){const i=Math.min(Gu,e.length),r=Math.min(1,t*8);let a=0,o=0;this.voices.forEach((l,c)=>{const u=n&&c<i?e[c]:null;u&&(l.rev+=(Kx(u.v)-l.rev)*r,a=Math.max(a,u.drifting?Math.min(1,Math.abs(u.slip)*3):u.braking&&u.v>15?.35:0),o=Math.max(o,u.offTrack?Math.min(1,u.v/25):0),u.boosting&&!l.boosting&&this.boost()),l.boosting=(u==null?void 0:u.boosting)===!0;const h=u?u.braking?.3:1:.3;l.open+=(h-l.open)*Math.min(1,t*7);const d=u?(.5+.5*l.rev)*(.55+.45*l.open)*(u.boosting?1.2:1)/Math.sqrt(i):0;l.loud+=(d-l.loud)*Math.min(1,t*6)}),this.level.skid+=(a-this.level.skid)*Math.min(1,t*12),this.level.rumble+=(o-this.level.rumble)*r,!((this.since+=t)<Yx)&&(this.since=0,this.voices.forEach((l,c)=>{this.glide(l.engine.source.playbackRate,(.45+l.rev*.75)*(1+(c-1)*.04)),this.glide(l.engine.level.gain,l.loud*.85),this.glide(l.tone.frequency,700+l.open*(2600+l.rev*6e3))}),this.skid&&this.glide(this.skid.level.gain,this.level.skid*.4),this.rumble&&this.glide(this.rumble.level.gain,this.level.rumble*.9))}glide(e,t){e.setTargetAtTime(t,this.ctx.currentTime,.04)}count(e){e?this.note(880,0,.55,.3):this.note(440,0,.18,.28)}crash(e){const t=this.ctx.currentTime;t-this.lastCrash<.09||(this.lastCrash=t,this.shot(e<.35?Ki.golpe0:e<.75?Ki.golpe1:Ki.golpe2,.3+e*.6,.9+Math.random()*.2))}lap(){this.note(660,0,.14,.2),this.note(990,.1,.26,.2)}finish(){[523,659,784,1047].forEach((e,t)=>this.note(e,t*.11,t===3?.6:.2,.22))}tow(){this.note(240,0,.32,.22,"triangle",960)}boost(){const e=this.ctx.currentTime;e-this.lastBoost<.5||(this.lastBoost=e,this.shot(Ki.nitro,.5,1))}shot(e,t,n){if(!this.clips)return;const i=this.ctx.createBufferSource(),r=this.ctx.createGain();i.buffer=this.clips,i.playbackRate.value=n,r.gain.value=t,i.connect(r),r.connect(this.master),i.start(0,e.from,e.to-e.from)}note(e,t,n,i,r="triangle",a=e){const o=this.ctx.createOscillator(),l=this.ctx.createGain(),c=this.ctx.currentTime+t;o.type=r,o.frequency.setValueAtTime(e,c),a!==e&&o.frequency.exponentialRampToValueAtTime(a,c+n),l.gain.setValueAtTime(1e-4,c),l.gain.linearRampToValueAtTime(i,c+.01),l.gain.exponentialRampToValueAtTime(1e-4,c+n),o.connect(l),l.connect(this.master),o.start(c),o.stop(c+n+.03)}}function Qx(){var e;const s=(e=window.AudioContext)!=null?e:window.webkitAudioContext;if(!s)return null;try{const t=new $x(new s);for(const n of["keydown","pointerdown"])addEventListener(n,()=>t.wake());return t}catch{return null}}function Zx(s){s.updateMatrixWorld(!0);const e=[],t=[];s.traverse(u=>{const h=u,d=u;h.isDirectionalLight&&e.push({dir:h.position.clone().sub(h.target.position).normalize(),color:h.color.clone().multiplyScalar(h.intensity/Math.PI)}),d.isHemisphereLight&&t.push({up:d.position.clone().normalize(),sky:d.color.clone().multiplyScalar(d.intensity/Math.PI),ground:d.groundColor.clone().multiplyScalar(d.intensity/Math.PI)})});const n=new L,i=new L,r=new ge,a=new Je,o=new Qe,l=new Map,c=u=>u!==null&&(u.name==="sky"||c(u.parent));s.traverse(u=>{var g;const h=u,d=h.material;if(!h.isMesh||Array.isArray(d)||c(h)||!(d.isMeshLambertMaterial||d.isMeshStandardMaterial)&&!d.isMeshBasicMaterial||d.transparent&&d.blending!==zn)return;const p=[(g=d.map)==null?void 0:g.uuid,d.transparent,d.opacity,d.blending,d.side,d.fog,d.alphaTest,d.depthWrite,h.renderOrder].join(),_=l.get(p);_?_.push(h):l.set(p,[h])});for(const u of l.values()){const h=u[0].material,d=u.map(R=>{const x=R.material,T=R.isInstancedMesh?R.count:1;let A=R.geometry;return x.flatShading&&A.index&&(A=A.toNonIndexed(),A.computeVertexNormals()),{mesh:R,from:x,copies:T,source:A,count:A.attributes.position.count,corners:A.index?A.index.count:A.attributes.position.count}}),f=d.reduce((R,x)=>R+x.copies*x.count,0),p=d.reduce((R,x)=>R+x.copies*x.corners,0),_=new Float32Array(f*3),g=new Float32Array(f*3),m=h.map?new Float32Array(f*2):null,S=new Uint32Array(p);let w=0,M=0;for(const{mesh:R,from:x,copies:T,source:A,count:I,corners:N}of d){const U=R,P=A.attributes.position,B=A.attributes.normal,V=A.attributes.uv,q=x.vertexColors?A.attributes.color:void 0,Q=!x.isMeshBasicMaterial&&B!==void 0;for(let X=0;X<T;X++){U.isInstancedMesh?(U.getMatrixAt(X,a),a.premultiply(R.matrixWorld)):a.copy(R.matrixWorld),o.getNormalMatrix(a),U.instanceColor?U.getColorAt(X,r):r.setRGB(1,1,1),r.multiply(x.color);for(let Y=0;Y<I;Y++){const j=(w+Y)*3;i.fromBufferAttribute(P,Y).applyMatrix4(a).toArray(_,j);let se=1,Z=1,ue=1;if(Q){n.fromBufferAttribute(B,Y).applyMatrix3(o).normalize(),se=Z=ue=0;for(const{up:oe,sky:fe,ground:H}of t){const K=.5*n.dot(oe)+.5;se+=H.r+(fe.r-H.r)*K,Z+=H.g+(fe.g-H.g)*K,ue+=H.b+(fe.b-H.b)*K}for(const{dir:oe,color:fe}of e){const H=Math.max(0,n.dot(oe));se+=fe.r*H,Z+=fe.g*H,ue+=fe.b*H}}q&&(se*=q.getX(Y),Z*=q.getY(Y),ue*=q.getZ(Y)),g[j]=se*r.r,g[j+1]=Z*r.g,g[j+2]=ue*r.b,m&&V&&(m[(w+Y)*2]=V.getX(Y),m[(w+Y)*2+1]=V.getY(Y))}for(let Y=0;Y<N;Y++)S[M++]=w+(A.index?A.index.getX(Y):Y);w+=I}R.removeFromParent(),A!==R.geometry&&A.dispose(),R.geometry.dispose()}const b=new ft;b.setAttribute("position",new xt(_,3)),b.setAttribute("color",new xt(g,3)),m&&b.setAttribute("uv",new xt(m,2)),b.setIndex(new xt(S,1));const y=new Ve(b,new Mt({map:h.map,transparent:h.transparent,opacity:h.opacity,blending:h.blending,side:h.side,fog:h.fog,alphaTest:h.alphaTest,depthWrite:h.depthWrite,vertexColors:!0}));y.renderOrder=u[0].renderOrder,y.matrixAutoUpdate=!1,s.add(y)}}class Jx{constructor(e=420){qe(this,"mesh");qe(this,"position");qe(this,"open",new Map);qe(this,"count");qe(this,"next",0);this.count=e;const t=new ft,n=new Uint16Array(e*6);this.position=new xt(new Float32Array(e*12),3),this.position.setUsage(Dh);for(let i=0;i<e;i++)n.set([i*4,i*4+1,i*4+2,i*4+2,i*4+1,i*4+3],i*6);t.setAttribute("position",this.position),t.setIndex(new xt(n,1)),this.mesh=new Ve(t,new Mt({color:328965,transparent:!0,opacity:.5,depthWrite:!1,side:Wt,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-2}lay(e,t,n){const i=this.open.get(e);if(!t||!n){i&&this.open.delete(e);return}if(i&&i.at.distanceToSquared(t)<.5)return;const r=t.clone().addScaledVector(n,.14),a=t.clone().addScaledVector(n,-.14);if(i){const o=this.next*4;this.position.setXYZ(o,i.left.x,i.left.y,i.left.z),this.position.setXYZ(o+1,i.right.x,i.right.y,i.right.z),this.position.setXYZ(o+2,r.x,r.y,r.z),this.position.setXYZ(o+3,a.x,a.y,a.z),this.position.needsUpdate=!0,this.next=(this.next+1)%this.count}this.open.set(e,{left:r,right:a,at:t.clone()})}}const Cs=(s,e)=>String(Math.round(s*10**e)/10**e);function jx(s){return[Cs(s.clock,2),...s.cars.map(e=>[Cs(e.s,2),Cs(e.d,2),Cs(e.heading,3),Cs(e.steer,2),Cs(e.v,1),(e.boosting?1:0)|(e.braking?2:0)|(e.drifting?4:0)|(e.offTrack?8:0)].join(","))].join("|")}const ev=[10,8,6,5,4,3,2,1],tv=1,No=[1,3,5,8];function pa(s){return{rounds:s,done:0,table:[]}}function Do(s){return s.rounds>1&&s.done>=s.rounds}function nv(s,e){let t=null;for(const i of e)i.best!==null&&(t===null||i.best<t.best)&&(t=i);const n=s.table.map(i=>({...i,last:0}));return e.forEach((i,r)=>{var o;if(i.id===null)return;let a=n.find(l=>l.id===i.id);a||n.push(a={id:i.id,name:i.name,points:0,wins:0,last:0}),a.name=i.name,a.last=((o=ev[r])!=null?o:0)+(i===t?tv:0),a.points+=a.last,r===0&&a.wins++}),n.sort((i,r)=>r.points-i.points||r.wins-i.wins||r.last-i.last),{rounds:s.rounds,done:s.done+1,table:n}}function iv(s,e){let{lap:t,race:n}=s,i=null,r=null;for(const a of e)a.id!==null&&(a.best!==null&&(t===null||a.best<t.time)&&(t={time:a.best,name:a.name},i=a.id),a.time!==null&&(n===null||a.time<n.time)&&(n={time:a.time,name:a.name},r=a.id));return{records:{lap:t,race:n},lap:i,race:r}}function sv(s,e){const t=Math.max(0,s),n=Math.floor(t/60);return`${n}:${(t-n*60).toFixed(e).padStart(3+e,"0")}`}function Li(s){let e;return t=>{t!==e&&(e=t,s(t))}}function rv(s){var c;(c=document.getElementById("hud"))==null||c.remove();const e=document.createElement("div");e.id="hud",e.innerHTML=`
    <header>
      <img src="${gh}" alt="galfredev">
      <span class="tag">CARRERA · ${s.track.toUpperCase()}</span>
      <span class="tag lap">VUELTA <b></b></span>
      <strong class="time"></strong>
    </header>
    <ol>${s.players.map(()=>'<li><span class="n"></span><i></i><b></b><span class="gap"></span><u><s></s></u></li>').join("")}</ol>
    <p class="count"></p>`,document.body.appendChild(e);const t=e.querySelector(".time"),n=e.querySelector(".lap b"),i=e.querySelector(".count"),r=[...e.querySelectorAll("li")].map(u=>{const h=u.querySelector(".n"),d=u.querySelector("i"),f=u.querySelector("b"),p=u.querySelector(".gap"),_=u.querySelector("s");return{cls:Li(g=>{u.className=g}),n:Li(g=>{h.textContent=g}),chip:Li(g=>{d.style.background=`#${g.toString(16).padStart(6,"0")}`}),name:Li(g=>{f.textContent=g}),gap:Li(g=>{p.textContent=g}),tank:Li(g=>{_.style.transform=`scaleX(${g/20})`})}}),a=Li(u=>{t.textContent=u}),o=Li(u=>{n.textContent=u});let l="";return{show(u){e.style.display=u?"block":"none"},update(u){a(sv(u.clock,u.done?2:1)),o(`${Math.min(s.laps,u.lap+1)}/${s.laps}`);const h=u.done?"Final":u.clock<0?String(Math.ceil(-u.clock)):u.clock<1?"Ya":"";h!==l&&(l=h,i.textContent=h,i.style.display=h?"block":"none"),u.order.forEach((d,f)=>{const p=r[f],_=s.players[d];p.cls(f===0?s.cinta?"first cinta":"first":""),p.n(String(f+1)),p.chip(_.paint),p.name(_.name),p.gap(f===0?"LÍDER":`+${u.gap[d].toFixed(1)}`),p.tank(Math.round(u.nitro[d]*20))})}}}const Uo=s=>`#${s.toString(16).padStart(6,"0")}`,$i=s=>s.replace(/[&<>"']/g,e=>`&#${e.charCodeAt(0)};`);function av(s){const[e,t]=s.split("-"),n=Number(e);if(!n||!t)return"";let i="";for(let r=0;r<n;r++)for(let a=0;a<n;a++){const o=r*n+a;parseInt(t[o>>2],16)>>3-(o&3)&1&&(i+=`M${a+4} ${r+4}h1v1h-1z`)}return`<svg viewBox="0 0 ${n+8} ${n+8}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#f1ede6"/><path d="${i}" fill="#111111"/></svg>`}function ov(s){const e=document.createElement("div");e.id="lobby",document.body.appendChild(e);const t=av(s);let n="";return{show(i){var d,f;const r=i.results!==null,a=r?i.results.map((p,_)=>`<li><span class="n">${_+1}</span><i style="background:${Uo(p.paint)}"></i><b>${$i(p.name)}</b><span class="gap">${p.best===null?"":`${p.record?"RÉCORD ":"VUELTA "}${p.best.toFixed(2)} · `}${p.time===null?"—":`${p.time.toFixed(2)} S`}${p.gain===null?"":` · +${p.gain}`}</span></li>`):i.players.map((p,_)=>`<li class="${p.on?"":"off"}"><span class="n"></span><i style="background:${Uo(p.paint)}"></i><b>${$i(p.name)}</b><span class="gap">${p.on?i.points[_]===null?"LISTO":`${i.points[_]} PTS`:"SIN SEÑAL"}</span></li>`),o=i.cup,l=r&&o?`<span class="tag">${o.over?`CAMPEÓN · ${o.rounds} CARRERAS`:`CAMPEONATO · CARRERA ${o.done} DE ${o.rounds}`}</span>
          <h1>${o.over?$i((f=(d=o.table[0])==null?void 0:d.name)!=null?f:"Final"):"Tabla"}</h1>
          <ol>${o.table.map((p,_)=>`<li><span class="n">${_+1}</span><i style="background:${Uo(p.paint)}"></i><b>${$i(p.name)}</b><span class="gap">${p.points} PTS</span></li>`).join("")}</ol>`:"",c=o&&!r?` · CARRERA ${o.done+1} DE ${o.rounds}`:"",u=i.record?`<span class="tag">VUELTA RÉCORD ${i.record.time.toFixed(2)} · ${$i(i.record.name.toUpperCase())}</span>`:"",h=`
        <header><img src="${gh}" alt="galfredev"><span class="tag">CARRERA · ${$i(i.track.toUpperCase())} · ${i.laps===1?"1 VUELTA":`${i.laps} VUELTAS`} · ${i.bots===1?"1 RIVAL AUTOMÁTICO":`${i.bots} RIVALES AUTOMÁTICOS`}${c}</span></header>
        <section class="join">
          ${l||`<span class="tag">${r?"OTRA CARRERA":"PARA ENTRAR"}</span>
          <h1>${r?"Final":"Escaneá y corré"}</h1>
          ${t?`<div class="qr">${t}</div><span class="tag">MISMA RED WI-FI QUE EL PROYECTOR</span>`:""}`}
          ${u}
        </section>
        <section class="list">
          <span class="tag">${r?"LLEGADA":`EN LA SALA · ${i.players.length}`}</span>
          <ol>${a.join("")||'<li class="off"><span class="n"></span><i></i><b>Todavía no entró nadie</b><span class="gap"></span></li>'}</ol>
          <p class="next">${i.lead?`${r?"Sigue":"Larga"} ${$i(i.lead)} desde su celular`:"Con OK en el control larga una carrera de exhibición"}</p>
          <span class="tag">CONTROL · ◀ ▶ PISTA · OK LARGAR</span>
        </section>`;h!==n&&(e.innerHTML=n=h),e.style.display="grid"},hide(){e.style.display="none"}}}class lv{constructor(e,t){qe(this,"seats",[]);qe(this,"inputs",new Map);qe(this,"link");qe(this,"lastShared","");qe(this,"on");this.on=t,this.link=yd(()=>({t:"host",secret:e}),n=>this.receive(n),n=>{n&&this.lastShared&&this.link.send({t:"all",d:JSON.parse(this.lastShared)})})}get lead(){var e,t;return(t=(e=this.seats.find(n=>n.on))==null?void 0:e.id)!=null?t:null}input(e){let t=this.inputs.get(e);return t||this.inputs.set(e,t={steer:0,brake:!1,nitro:!1,drift:!1}),t}share(e){const t=JSON.stringify(e);t!==this.lastShared&&(this.lastShared=t,this.link.send({t:"all",d:e}))}stream(e){this.link.send({t:"st",d:e})}tell(e,t){this.link.send({t:"to",id:e,d:t})}receive(e){if(e.t==="in"){const t=this.input(e.id);t.steer=e.s,t.brake=e.b,t.nitro=e.n,t.drift=e.k}else if(e.t==="roster"){this.seats=e.players;for(const t of this.seats)t.on||this.inputs.delete(t.id);this.on.roster()}else e.t==="cmd"&&this.on.command(e.id,e.d)}}function Hs(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new ft;let c=0;for(let u=0;u<s.length;++u){const h=s[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0;const h=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let p=0;p<f.count;++p)h.push(f.getX(p)+u);u+=s[d].attributes.position.count}l.setIndex(h)}for(const u in r){const h=Wu(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in a){const h=a[u][0].length;if(h!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let _=0;_<a[u].length;++_)f.push(a[u][_][d]);const p=Wu(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(p)}}}return l}function Wu(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){const u=s[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const a=new e(r),o=new xt(a,t,n);let l=0;for(let c=0;c<s.length;++c){const u=s[c];if(u.isInterleavedBufferAttribute){const h=l/t;for(let d=0,f=u.count;d<f;d++)for(let p=0;p<t;p++){const _=u.getComponent(d,p);o.setComponent(d+h,p,_)}}else a.set(u.array,l);l+=u.count*t}return i!==void 0&&(o.gpuType=i),o}function Xu(s,e){if(e===Qd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Tl||e===Ih){let t=s.getIndex();if(t===null){const r=[],a=s.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);s.setIndex(r),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===Tl)for(let r=1;r<=n;r++)i.push(t.getX(0)),i.push(t.getX(r)),i.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(t.getX(r)),i.push(t.getX(r+1)),i.push(t.getX(r+2))):(i.push(t.getX(r+2)),i.push(t.getX(r+1)),i.push(t.getX(r)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function cv(s){const e=new Map,t=new Map,n=s.clone();return ld(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function ld(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)ld(s.children[n],e.children[n],t)}class uv extends Xs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new mv(t)}),this.register(function(t){return new gv(t)}),this.register(function(t){return new Tv(t)}),this.register(function(t){return new wv(t)}),this.register(function(t){return new Av(t)}),this.register(function(t){return new xv(t)}),this.register(function(t){return new vv(t)}),this.register(function(t){return new Mv(t)}),this.register(function(t){return new Sv(t)}),this.register(function(t){return new pv(t)}),this.register(function(t){return new yv(t)}),this.register(function(t){return new _v(t)}),this.register(function(t){return new Ev(t)}),this.register(function(t){return new bv(t)}),this.register(function(t){return new dv(t)}),this.register(function(t){return new qu(t,rt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new qu(t,rt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Rv(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=_r.extractUrlBase(e);a=_r.resolveURL(c,this.path)}else a=_r.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Zh(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(u){t(u),r.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===cd){try{a[rt.KHR_BINARY_GLTF]=new Cv(e)}catch(h){i&&i(h);return}r=JSON.parse(a[rt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new kv(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const h=r.extensionsUsed[u],d=r.extensionsRequired||[];switch(h){case rt.KHR_MATERIALS_UNLIT:a[h]=new fv;break;case rt.KHR_DRACO_MESH_COMPRESSION:a[h]=new Pv(r,this.dracoLoader);break;case rt.KHR_TEXTURE_TRANSFORM:a[h]=new Lv;break;case rt.KHR_MESH_QUANTIZATION:a[h]=new Iv;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function hv(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function zt(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const rt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class dv{constructor(e){this.parser=e,this.name=rt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const u=new ge(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],pn);const h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Fr(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Np(u),c.distance=h;break;case"spot":c=new Lp(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),$n(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class fv{constructor(){this.name=rt.KHR_MATERIALS_UNLIT}getMaterialType(){return Mt}extendParams(e,t,n){const i=[];e.color=new ge(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],pn),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,It))}return Promise.all(i)}}class pv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class mv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Be(r,r)}return Promise.all(i)}}class gv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class _v{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class xv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_SHEEN}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new ge(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],pn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,It)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class vv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class Mv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_VOLUME}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new ge().setRGB(r[0],r[1],r[2],pn),Promise.all(i)}}class Sv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_IOR}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class yv{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new ge().setRGB(r[0],r[1],r[2],pn),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,It)),Promise.all(i)}}class bv{constructor(e){this.parser=e,this.name=rt.EXT_MATERIALS_BUMP}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class Ev{constructor(e){this.parser=e,this.name=rt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return zt(this.parser,e,this.name)!==null?Dn:null}extendMaterialParams(e,t){const n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class Tv{constructor(e){this.parser=e,this.name=rt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class wv{constructor(e){this.parser=e,this.name=rt.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Av{constructor(e){this.parser=e,this.name=rt.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class qu{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,u=i.count,h=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(f),u,h,d,i.mode,i.filter),f})})}else return null}}class Rv{constructor(e){this.name=rt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==Rn.TRIANGLES&&c.mode!==Rn.TRIANGLE_STRIP&&c.mode!==Rn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(const p of h){const _=new Je,g=new L,m=new xi,S=new L(1,1,1),w=new ln(p.geometry,p.material,d);for(let b=0;b<d;b++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,b),l.SCALE&&S.fromBufferAttribute(l.SCALE,b),w.setMatrixAt(b,_.compose(g,m,S));let M=null;for(const b in l)if(b==="_COLOR_0"){const y=l[b];w.instanceColor=new Pa(y.array,y.itemSize,y.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(M===null){const R=w.geometry;M=new ft,M.name=R.name;for(const x in R.attributes)M.setAttribute(x,R.attributes[x]);for(const x in R.morphAttributes)M.morphAttributes[x]=R.morphAttributes[x];R.index!==null&&M.setIndex(R.index),M.morphTargetsRelative=R.morphTargetsRelative;for(const x of R.groups)M.addGroup(x.start,x.count,x.materialIndex);R.boundingBox!==null&&(M.boundingBox=R.boundingBox.clone()),R.boundingSphere!==null&&(M.boundingSphere=R.boundingSphere.clone()),M.drawRange.start=R.drawRange.start,M.drawRange.count=R.drawRange.count,M.userData=Object.assign({},R.userData),w.geometry=M}const y=l[b];M.setAttribute(b,new Pa(y.array,y.itemSize,y.normalized))}vt.prototype.copy.call(w,p),this.parser.assignFinalMaterial(w),f.push(w)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const cd="glTF",or=12,Yu={JSON:1313821514,BIN:5130562};class Cv{constructor(e){this.name=rt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,or),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==cd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-or,r=new DataView(e,or);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===Yu.JSON){const c=new Uint8Array(e,or+a,o);this.content=n.decode(c)}else if(l===Yu.BIN){const c=or+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Pv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=rt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const u in a){const h=Pl[u]||u.toLowerCase();o[h]=a[u]}for(const u in e.attributes){const h=Pl[u]||u.toLowerCase();if(a[u]!==void 0){const d=n.accessors[e.attributes[u]],f=Us[d.componentType];c[h]=f.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,d){i.decodeDracoFile(u,function(f){for(const p in f.attributes){const _=f.attributes[p],g=l[p];g!==void 0&&(_.normalized=g)}h(f)},o,c,pn,d)})})}}class Lv{constructor(){this.name=rt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class Iv{constructor(){this.name=rt.KHR_MESH_QUANTIZATION}}class ud extends ks{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=i-t,h=(n-t)/u,d=h*h,f=d*h,p=e*c,_=p-c,g=-2*f+3*d,m=f-d,S=1-g,w=m-d+h;for(let M=0;M!==o;M++){const b=a[_+M+o],y=a[_+M+l]*u,R=a[p+M+o],x=a[p+M]*u;r[M]=S*b+w*y+g*R+m*x}return r}}const Nv=new xi;class Dv extends ud{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return Nv.fromArray(r).normalize().toArray(r),r}}const Rn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Us={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ku={9728:Xt,9729:Yt,9984:Th,9985:xa,9986:hr,9987:jn},$u={33071:Jn,33648:Ta,10497:gn},Fo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Pl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ii={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Uv={CUBICSPLINE:void 0,LINEAR:br,STEP:yr},Oo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Fv(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new en({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Hi})),s.DefaultMaterial}function Qi(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function $n(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ov(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,u=e.length;c<u;c++){const h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];if(n){const d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):s.attributes.position;a.push(d)}if(i){const d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):s.attributes.normal;o.push(d)}if(r){const d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):s.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const u=c[0],h=c[1],d=c[2];return n&&(s.morphAttributes.position=u),i&&(s.morphAttributes.normal=h),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function Bv(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function zv(s){let e;const t=s.extensions&&s.extensions[rt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Bo(t.attributes):e=s.indices+":"+Bo(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Bo(s.targets[n]);return e}function Bo(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Ll(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Hv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Vv=new Je;class kv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new hv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Cp(this.options.manager):this.textureLoader=new Up(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Zh(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Qi(r,o,i),$n(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,u]of a.children.entries())r(u,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[rt.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(_r.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Fo[i.type],o=Us[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new xt(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=Fo[i.type],c=Us[i.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0;let _,g;if(f&&f!==h){const m=Math.floor(d/f),S="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let w=t.cache.get(S);w||(_=new c(o,m*f,i.count*f/u),w=new kh(_,f/u),t.cache.add(S,w)),g=new Ar(w,l,d%f/u,p)}else o===null?_=new c(i.count*l):_=new c(o,d,i.count*l),g=new xt(_,l,p);if(i.sparse!==void 0){const m=Fo.SCALAR,S=Us[i.sparse.indices.componentType],w=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,b=new S(a[1],w,i.sparse.count*m),y=new c(a[2],M,i.sparse.count*l);o!==null&&(g=new xt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let R=0,x=b.length;R<x;R++){const T=b[R];if(g.setX(T,y[R*l]),l>=2&&g.setY(T,y[R*l+1]),l>=3&&g.setZ(T,y[R*l+2]),l>=4&&g.setW(T,y[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return u.magFilter=Ku[d.magFilter]||Yt,u.minFilter=Ku[d.minFilter]||jn,u.wrapS=$u[d.wrapS]||gn,u.wrapT=$u[d.wrapT]||gn,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Xt&&u.minFilter!==Yt,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(h){c=!0;const d=new Blob([h],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(h){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(_){const g=new Kt(_);g.needsUpdate=!0,d(g)}),t.load(_r.resolveURL(h,r.path),p,void 0,f)})}).then(function(h){return c===!0&&o.revokeObjectURL(l),$n(h,a),h.userData.mimeType=a.mimeType||Hv(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[rt.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[rt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[rt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Ba,bn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Rr,bn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return en}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[rt.KHR_MATERIALS_UNLIT]){const h=i[rt.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),c.push(h.extendParams(o,r,t))}else{const h=r.pbrMetallicRoughness||{};if(o.color=new ge(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){const d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],pn),o.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,It)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Wt);const u=r.alphaMode||Oo.OPAQUE;if(u===Oo.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===Oo.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Be(1,1),r.normalTexture.scale!==void 0)){const h=r.normalTexture.scale;o.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Mt){const h=r.emissiveFactor;o.emissive=new ge().setRGB(h[0],h[1],h[2],pn)}return r.emissiveTexture!==void 0&&a!==Mt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,It)),Promise.all(c).then(function(){const h=new a(o);return r.name&&(h.name=r.name),$n(h,r),t.associations.set(h,{materials:e}),r.extensions&&Qi(i,h,r),h})}createUniqueName(e){const t=wt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[rt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Qu(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],u=zv(c),h=i[u];if(h)a.push(h.promise);else{let d;c.extensions&&c.extensions[rt.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=Qu(new ft,c,t),c.mode===Rn.TRIANGLE_STRIP?d=d.then(f=>Xu(f,Ih)):c.mode===Rn.TRIANGLE_FAN&&(d=d.then(f=>Xu(f,Tl))),i[u]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const u=a[l].material===void 0?Fv(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let f=0,p=u.length;f<p;f++){const _=u[f],g=a[f];let m;const S=c[f];if(g.mode===Rn.TRIANGLES||g.mode===Rn.TRIANGLE_STRIP||g.mode===Rn.TRIANGLE_FAN||g.mode===void 0){const w=r.isSkinnedMesh===!0,M=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");w&&M===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=w&&M?new Zf(_,S):new Ve(_,S),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(g.mode===Rn.LINES)m=new Na(_,S);else if(g.mode===Rn.LINE_STRIP)m=new jl(_,S);else if(g.mode===Rn.LINE_LOOP)m=new tp(_,S);else if(g.mode===Rn.POINTS)m=new za(_,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(m.geometry.morphAttributes).length>0&&Bv(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),$n(m,r),g.extensions&&Qi(i,m,g),t.assignFinalMaterial(m),h.push(m)}for(let f=0,p=h.length;f<p;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return r.extensions&&Qi(i,h[0],r),h[0];const d=new nn;r.extensions&&Qi(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,p=h.length;f<p;f++)d.add(h[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new dn(Rf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ur(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),$n(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,u=a.length;c<u;c++){const h=a[c];if(h){o.push(h);const d=new Je;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Zl(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let h=0,d=i.channels.length;h<d;h++){const f=i.channels[h],p=i.samplers[f.sampler],_=f.target,g=_.node,m=i.parameters!==void 0?i.parameters[p.input]:p.input,S=i.parameters!==void 0?i.parameters[p.output]:p.output;_.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",S)),c.push(p),u.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){const d=h[0],f=h[1],p=h[2],_=h[3],g=h[4],m=[];for(let w=0,M=d.length;w<M;w++){const b=d[w],y=f[w],R=p[w],x=_[w],T=g[w];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();const A=n._createAnimationTracks(b,y,R,x,T);if(A)for(let I=0;I<A.length;I++)m.push(A[I])}const S=new yp(r,void 0,m);return $n(S,i),S})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Vv)});for(let f=0,p=h.length;f<p;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){const f=u.userData.pivot,p=h[0];u.pivot=new L().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],p.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(r.isBone===!0?u=new Xh:c.length>1?u=new nn:c.length===1?u=c[0]:u=new vt,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(r.name&&(u.userData.name=r.name,u.name=a),$n(u,r),r.extensions&&Qi(n,u,r),r.matrix!==void 0){const h=new Je;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!i.associations.has(u))i.associations.set(u,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const h=i.associations.get(u);i.associations.set(u,{...h})}return i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new nn;n.name&&(r.name=i.createUniqueName(n.name)),$n(r,n),n.extensions&&Qi(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,h=l.length;u<h;u++){const d=l[u];d.parent!==null?r.add(cv(d)):r.add(d)}const c=u=>{const h=new Map;for(const[d,f]of i.associations)(d instanceof bn||d instanceof Kt)&&h.set(d,f);return u.traverse(d=>{const f=i.associations.get(d);f!=null&&h.set(d,f)}),h};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ii[r.path]===Ii.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let u;switch(Ii[r.path]){case Ii.weights:u=Pr;break;case Ii.rotation:u=Lr;break;case Ii.translation:case Ii.scale:u=Da;break;default:n.itemSize===1?u=Pr:u=Da;break}const h=i.interpolation!==void 0?Uv[i.interpolation]:br,d=this._getArrayFromAccessor(n);for(let f=0,p=l.length;f<p;f++){const _=new u(l[f]+"."+Ii[r.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Ll(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Lr?Dv:ud;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Gv(s,e,t){const n=e.attributes,i=new Wn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new L(l[0],l[1],l[2]),new L(c[0],c[1],c[2])),o.normalized){const u=Ll(Us[o.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new L,l=new L;for(let c=0,u=r.length;c<u;c++){const h=r[c];if(h.POSITION!==void 0){const d=t.json.accessors[h.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){const _=Ll(Us[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new ni;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function Qu(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=Pl[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return ot.workingColorSpace!==pn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ot.workingColorSpace}" not supported.`),$n(s,e),Gv(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Ov(s,e.targets,t):s})}const Wv=""+new URL("car-DMwvVInG.glb",import.meta.url).href,Xv=""+new URL("car-cerca-B5GQ-_Gf.glb",import.meta.url).href,qv=""+new URL("car-lejos-DmLa5JlS.glb",import.meta.url).href,Yv=""+new URL("car-deportivo-g3X4YusL.glb",import.meta.url).href,Kv=""+new URL("car-coupe-CcIVezxI.glb",import.meta.url).href,$v=2.8;function Qv(s){return Promise.all([s?[Wv]:[Xv,qv],[Yv],[Kv]].map(e=>Promise.all(e.map(Zv))))}async function Zv(s){var l;const e=await new uv().loadAsync(s);e.scene.updateMatrixWorld(!0);const t=[],n=[],i=new Wn;e.scene.traverse(c=>{const u=c;if(!u.isMesh)return;const h=u.material,d={geometry:u.geometry,matrix:u.matrixWorld.clone(),role:h.name,ao:h.aoMap};d.role==="rim"||d.role==="tyre"?n.push(d):t.push(d),d.role==="tyre"&&i.expandByObject(u,!0)});const r=i.getCenter(new L),a=new Je().makeTranslation(-r.x,-r.y,-r.z);n.forEach(c=>c.matrix.premultiply(a));const o=i.getSize(new L);return{body:t,wheel:n,hub:r,radius:o.y/2,width:o.x,wheelbase:(l=e.scene.userData.wheelbase)!=null?l:$v}}let ma=null;function Ir(){if(ma)return ma;const s=document.createElement("canvas");s.width=s.height=64;const e=s.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.25,"rgba(255,255,255,.45)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),ma=new En(s),ma}function Jv(s,e,t){const i=new Nn(256,256,{type:kn,generateMipmaps:!0,minFilter:jn}),r=new zh;r.environment=e;const a=new Ve(new Vs(1,48,24),new Dn({color:16777215,metalness:.45,roughness:.34,clearcoat:1,clearcoatRoughness:.06}));r.add(a),r.add(new Ga(16777215,5263452,t?2.4:.9));const o=new Fr(16777215,t?2.6:1.4);o.position.set(.4,1,-.5),r.add(o);const l=new Ur(-1,1,1,-1,.1,10);l.position.set(0,1.2,-3).normalize().multiplyScalar(3),l.lookAt(0,0,0);const c=s.getRenderTarget();return s.setRenderTarget(i),s.render(r,l),s.setRenderTarget(c),a.geometry.dispose(),a.material.dispose(),i.texture}const Zu=new Map;function Ju(s,e){let t=Zu.get(s);if(t)return t;const n=(r,a,o,l=1)=>new en({color:r,metalness:a,roughness:o,envMapIntensity:l,aoMap:e}),i=(r,a)=>new Mt({color:new ge(r).multiplyScalar(a),fog:!1});switch(s){case"trim":t=n(855310,.7,.32,1.2);break;case"glass":t=n(263430,1,.06,1.5);break;case"rim":t=n(9409433,1,.28,1.3);break;case"tyre":t=n(723723,0,.85);break;case"tail":t=i(16718346,8);break;case"head":t=i(16773336,4);break;case"signal":t=n(3806208,0,.3);break;default:t=n(1447446,.3,.6)}return Zu.set(s,t),t}function jv(s,e,t,n,i=!1,r=0){var w,M,b;const a=new nn,o=(M=(w=s.body.find(y=>y.role==="paint"))==null?void 0:w.ao)!=null?M:null,l=t?new Dn({color:e.paint,metalness:.4,roughness:.5,clearcoat:1,clearcoatRoughness:.05,aoMap:o,envMapIntensity:1}):new en({color:e.paint,metalness:.5,roughness:.3,aoMap:o,envMapIntensity:1}),c=new en({color:e.accent,metalness:.3,roughness:.5}),u=y=>y.role==="paint"?l:y.role==="caliper"?c:Ju(y.role,y.ao),h=y=>{const R=new Ve(y.geometry,u(y));return y.matrix.decompose(R.position,R.quaternion,R.scale),R.castShadow=y.role!=="glass",R},d=new nn;a.add(d);const f=Ju("tail",null).clone();i||s.body.forEach(y=>{const R=h(y);y.role==="tail"&&(R.material=f),d.add(R)});const p=[];for(const y of[1,-1])for(const R of[s.hub.z,s.hub.z-s.wheelbase]){const x=new nn,T=new nn;x.position.set(s.hub.x*y,s.hub.y,R),x.rotation.y=y>0?0:Math.PI,T.userData.dir=y,i||s.wheel.forEach(A=>T.add(h(A))),x.add(T),x.userData.rest=x.rotation.y,a.add(x),p.push(T)}const _=new nn,g=new Mt({color:new ge((b=e.underglow)!=null?b:7000319).multiplyScalar(4),transparent:!0,opacity:.85,blending:zn,depthWrite:!1,fog:!1});for(const y of[-.42,.42])_.add(new Ve(new ec(.17,2.4,8,1,!0).rotateX(-Math.PI/2).translate(y,.42,s.hub.z-s.wheelbase-1.75),g));if(_.visible=!1,d.add(_),a.userData={model:r,radius:s.radius,wheels:p,body:d,flame:_,tail:f,paint:l,caliper:c,fire:g,style:e,braking:!1,front:p.slice(0,1).concat(p.slice(2,3)).map(y=>y.parent)},i)return a;const m=(y,R,x,T,A)=>{const I=new Ve(new tn(y,R),new Mt({map:Ir(),color:x,transparent:!0,opacity:T,depthWrite:!1,blending:A?zn:zi}));return I.rotation.x=-Math.PI/2,I},S=m(3.3,6.2,0,.8,!1);if(S.position.set(0,.02,-.1),a.add(S),n){const y=m(4.6,11,16769712,.28,!0);y.position.set(0,.05,7.2),a.add(y)}if(e.underglow!==void 0){const y=m(5.8,9,e.underglow,.9,!0);y.position.y=.045,a.add(y),a.userData.under=y.material}return a}function eM(s,e){const t=document.createElement("canvas"),n=t.getContext("2d"),i="800 40px Archivo, system-ui, sans-serif",r=s.length>12?`${s.slice(0,11)}…`:s;n.font=i;const a=Math.ceil(n.measureText(r).width)+86,o=68,l=22;t.width=a,t.height=o+l,n.fillStyle="rgba(17,17,17,.9)",n.fillRect(0,0,a,o),n.beginPath(),n.moveTo(a/2-16,o),n.lineTo(a/2+16,o),n.lineTo(a/2,o+l),n.fill(),n.fillStyle=`#${e.toString(16).padStart(6,"0")}`,n.fillRect(16,16,36,36),n.strokeStyle="#f1ede6",n.lineWidth=3,n.strokeRect(16,16,36,36),n.font=i,n.textBaseline="middle",n.fillStyle="#f1ede6",n.fillText(r,68,o/2+2);const c=new En(t);c.colorSpace=It;const u=new Kf(new Gh({map:c,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1,sizeAttenuation:!1}));return u.center.set(.5,0),u.scale.set(.075*t.width/t.height,.075,1),u.position.y=1.9,u.renderOrder=20,u}function tM(s,e){var a;const{paint:t,caliper:n,fire:i,under:r}=s.userData;s.userData.style=e,t.color.set(e.paint),n.color.set(e.accent),i.color.set((a=e.underglow)!=null?a:7000319).multiplyScalar(4),e.underglow!==void 0&&(r==null||r.color.set(e.underglow))}const ju=.42;function eh(s,e,t){return s.rate+=((e-s.at)*130-s.rate*15)*t,s.at+=s.rate*t}function nM(s,e){var f,p,_,g,m,S;const{wheels:t,body:n,flame:i,tail:r,front:a}=s.userData,o=s.userData,l=Math.min(.05,Math.max(0,e.time-((f=o.time)!=null?f:e.time))),c=(e.metres-((p=o.metres)!=null?p:e.metres))/o.radius;o.roll=((_=o.roll)!=null?_:0)+Math.max(-ju,Math.min(ju,c));for(const w of t)w.rotation.x=o.roll*w.userData.dir;for(const w of a)w.rotation.y=w.userData.rest+e.steer*.38;const u=l>0?(e.speed-((g=o.speed)!=null?g:e.speed))/l:0,h=-e.steer*Math.min(1,e.speed/50)*.065,d=Math.max(-.035,Math.min(.045,-u*.0013))-(e.boosting?.012:0);n.rotation.z=eh((m=o.sway)!=null?m:o.sway={at:0,rate:0},h,l),n.rotation.x=eh((S=o.nod)!=null?S:o.nod={at:0,rate:0},d,l),n.position.y=e.rough?(Math.random()-.5)*.035*Math.min(1,e.speed/20):0,o.time=e.time,o.metres=e.metres,o.speed=e.speed,r.color.setRGB(1,.1,.04).multiplyScalar(e.braking?14:5),s.userData.braking=e.braking,i.visible=e.boosting,e.boosting&&i.scale.set(1,1,.8+.35*Math.sin(e.time*61)+.2*Math.sin(e.time*37))}function iM(s,e,t){const n=e/2,i=s*.7,r=n*.55,a=(c,u)=>{const h=c.index?c.toNonIndexed():c;h.deleteAttribute("uv");const d=new Float32Array(h.attributes.position.count*3);for(let f=0;f<d.length;f+=3)u.toArray(d,f);return h.setAttribute("color",new xt(d,3)),h},o=[[i,-n],[s*.9,-n],[s,-n*.7],[s,n*.7],[s*.9,n],[i,n],[i*.94,r]].map(([c,u])=>new Be(c,u)),l=[a(new sc(o,t).rotateZ(-Math.PI/2),ji.tyre),a(new Ha(i,t).rotateY(Math.PI/2).translate(r-n*.35,0,0),ji.dark),a(new rc(i*.84,i*.96,t).rotateY(Math.PI/2).translate(r,0,0),ji.rim),a(new ki(s*.13,s*.17,n*.3,Math.max(6,t/2)).rotateZ(-Math.PI/2).translate(r,0,0),ji.rim)];for(let c=0;c<5;c++){const u=new Bt(n*.22,i*.78,s*.17).translate(r-n*.06,i*.5,0).rotateX(c/5*Math.PI*2);l.push(a(u,ji.rim))}return Hs(l)}function sM(s){const t=document.createElement("canvas");t.width=t.height=256;const n=t.getContext("2d");n.drawImage(s.image,0,0,256,256);const i=n.getImageData(0,0,256,256).data,r=a=>Math.min(255,Math.floor((a-Math.floor(a))*256));return(a,o)=>i[(r(s.flipY?1-o:o)*256+r(a))*4]/255}const ji={paint:new ge(16777215),trim:new ge(2894895),glass:new ge(2830391),rim:new ge(11580344),tyre:new ge(1184274),signal:new ge(5906432),caliper:new ge(4869200),head:new ge(16773336).multiplyScalar(3),tail:new ge(16777215),dark:new ge(1644825)};function rM(s){var f;let e=0,t=0;for(const p of s)e+=p.geometry.attributes.position.count,t+=p.geometry.index?p.geometry.index.count:p.geometry.attributes.position.count;const n=new Float32Array(e*3),i=new Float32Array(e*3),r=new Float32Array(e*3),a=e>65535?new Uint32Array(t):new Uint16Array(t),o=new L,l=new Qe,c=new Map;let u=0,h=0;for(const p of s){const{position:_,normal:g}=p.geometry.attributes,m=p.ao?p.geometry.attributes[p.ao.channel?`uv${p.ao.channel}`:"uv"]:void 0;let S;p.ao&&m&&(S=c.get(p.ao),S||c.set(p.ao,S=sM(p.ao)));const w=(f=ji[p.role])!=null?f:ji.dark;l.getNormalMatrix(p.matrix);for(let y=0;y<_.count;y++){const R=(u+y)*3;o.fromBufferAttribute(_,y).applyMatrix4(p.matrix).toArray(n,R),o.fromBufferAttribute(g,y).applyMatrix3(l).normalize().toArray(i,R);const x=S?.35+.65*S(m.getX(y),m.getY(y)):1;r[R]=w.r*x,r[R+1]=w.g*x,r[R+2]=w.b*x}const M=p.geometry.index,b=M?M.count:_.count;for(let y=0;y<b;y++)a[h++]=u+(M?M.getX(y):y);u+=_.count}const d=new ft;return d.setAttribute("position",new xt(n,3)),d.setAttribute("normal",new xt(i,3)),d.setAttribute("color",new xt(r,3)),d.setIndex(new xt(a,1)),d}const th=20,aM=new ge(.5,.02,.012),oM=new ge(1,.2,.08),lM=new ge(0,0,0);class cM{constructor(e,t,n,i,r){qe(this,"group",new nn);qe(this,"sets");qe(this,"tiers");qe(this,"flats",[]);qe(this,"under",null);qe(this,"streak");qe(this,"trails",!0);qe(this,"tint",new ge);qe(this,"gaze",new L);qe(this,"capacity");this.capacity=r;const a=()=>new dp({matcap:t,vertexColors:!0});this.sets=e.map(c=>c.map((u,h)=>{const d=m=>rM(u.body.filter(S=>m(S.role))),f=new ln(d(m=>m==="paint"),a(),r),p=new ln(d(m=>m!=="paint"&&m!=="tail"),a(),r),_=new ln(d(m=>m==="tail"),new Mt({fog:!1}),r),g=new ln(iM(c[0].radius,c[0].width,c.length===1?16:h===0?24:12),a(),r*4);return p.instanceMatrix=_.instanceMatrix=f.instanceMatrix,{paint:f,rest:p,tail:_,wheels:g,n:0}})),this.tiers=this.sets.reduce((c,u)=>c.concat(u),[]);const o=(c,u,h,d,f,p,_=16777215)=>{const g=new ln(new tn(c,u).rotateX(-Math.PI/2).translate(0,h,d),new Mt({map:Ir(),color:_,transparent:!0,opacity:f,depthWrite:!1,blending:p?zn:zi}),r);return this.flats.length&&(g.instanceMatrix=this.flats[0].instanceMatrix),g.renderOrder=-1,this.flats.push(g),g};o(3.3,6.2,.02,-.1,.8,!1,0),n&&o(4.6,11,.05,7.2,.28,!0,16769712),i&&(this.under=o(5.8,9,.045,0,.9,!0)),this.streak=new ln(new tn(1.7,13).rotateX(-Math.PI/2).translate(0,.4,-8.6),new Mt({map:Ir(),transparent:!0,opacity:.55,depthWrite:!1,blending:zn,side:Wt,fog:!1}),r);const l=this.tiers.reduce((c,u)=>c.concat(u.paint,u.rest,u.tail,u.wheels),[]);for(const c of l.concat(this.flats,this.streak))c.instanceMatrix.setUsage(Dh),c.frustumCulled=!1,c.count=0,this.group.add(c)}sync(e,t){var l,c,u;const n=Math.min(e.length,this.capacity);t.getWorldDirection(this.gaze);const i=[];let r=-1,a=-1;for(let h=0;h<n;h++){const d=e[h].position,f=t.position,p=(d.x-f.x)*this.gaze.x+(d.y-f.y)*this.gaze.y+(d.z-f.z)*this.gaze.z;i[h]=p<-6||!e[h].visible?1/0:d.distanceToSquared(f),!(i[h]>th*th)&&(r<0||i[h]<i[r]?(a=r,r=h):(a<0||i[h]<i[a])&&(a=h))}for(const h of this.tiers)h.n=0;let o=0;for(let h=0;h<n;h++){const d=e[h],{model:f,body:p,wheels:_,style:g,braking:m}=d.userData;if(d.updateMatrixWorld(!0),this.flats[0].setMatrixAt(h,d.matrixWorld),(l=this.under)==null||l.setColorAt(h,g.underglow===void 0?lM:this.tint.set(g.underglow)),i[h]===1/0)continue;this.trails&&d.userData.flame.visible&&(this.streak.setMatrixAt(o,d.matrixWorld),this.streak.setColorAt(o++,this.tint.set((c=g.underglow)!=null?c:7000319)));const S=this.sets[f],w=S[h===r||h===a?0:S.length-1],M=w.n++;w.paint.setMatrixAt(M,p.matrixWorld);for(let b=0;b<4;b++)w.wheels.setMatrixAt(M*4+b,_[b].matrixWorld);w.paint.setColorAt(M,this.tint.set(g.paint)),w.tail.setColorAt(M,m?oM:aM)}for(const h of this.tiers)if(h.paint.count=h.rest.count=h.tail.count=h.n,h.wheels.count=h.n*4,h.paint.visible=h.rest.visible=h.tail.visible=h.wheels.visible=h.n>0,h.n!==0){h.paint.instanceMatrix.needsUpdate=h.wheels.instanceMatrix.needsUpdate=!0;for(const d of[h.paint,h.tail])d.instanceColor&&(d.instanceColor.needsUpdate=!0)}this.streak.count=o,this.streak.visible=o>0,this.streak.instanceMatrix.needsUpdate=!0,this.streak.instanceColor&&(this.streak.instanceColor.needsUpdate=!0);for(const h of this.flats)h.count=n;this.flats[0].instanceMatrix.needsUpdate=!0,(u=this.under)!=null&&u.instanceColor&&(this.under.instanceColor.needsUpdate=!0)}}class zo{constructor(e,t){qe(this,"points");qe(this,"position");qe(this,"age");qe(this,"velocity");qe(this,"material");qe(this,"next",0);qe(this,"look");qe(this,"count");this.look=e,this.count=t;const n=new ft;this.position=new xt(new Float32Array(t*3),3),this.age=new xt(new Float32Array(t).fill(1),1),this.velocity=new Float32Array(t*3),n.setAttribute("position",this.position),n.setAttribute("age",this.age),this.material=new Gn({uniforms:{color:{value:new ge(e.color)},opacity:{value:e.opacity},size:{value:e.size},tall:{value:720}},vertexShader:`
        attribute float age;
        uniform float size, tall;
        varying float vFade;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = age >= 1.0 ? 0.0 : size * (0.35 + 1.9 * age) * tall / -mv.z;
          vFade = smoothstep(0.0, 0.1, age) * (1.0 - age) * (1.0 - age);
        }`,fragmentShader:`
        uniform vec3 color;
        uniform float opacity;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float soft = smoothstep(1.0, 0.1, d);
          gl_FragColor = vec4(color, soft * soft * vFade * opacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,transparent:!0,depthWrite:!1,blending:e.additive?zn:zi}),this.points=new za(n,this.material),this.points.frustumCulled=!1}emit(e,t,n,i,r){const a=this.next;this.next=(this.next+1)%this.count,this.position.setXYZ(a,e.x,e.y,e.z),this.velocity.set([t+(Math.random()-.5)*r,n+Math.random()*r*.6,i+(Math.random()-.5)*r],a*3),this.age.setX(a,0)}update(e){this.material.uniforms.tall.value=innerHeight;const t=this.position.array,n=this.age.array,i=this.velocity;for(let r=0;r<this.count;r++)n[r]>=1||(n[r]=Math.min(1,n[r]+e/this.look.life),i[r*3+1]+=this.look.rise*e,t[r*3]+=i[r*3]*e,t[r*3+1]+=i[r*3+1]*e,t[r*3+2]+=i[r*3+2]*e);this.position.needsUpdate=this.age.needsUpdate=!0}}const Vi=2;function uM(s,e){const t=new sp(s.map(([d,f,p])=>new L(d,f,p)),!0,"centripetal"),n=t.getLength(),i=Math.round(n/Vi),r=t.getSpacedPoints(i).slice(0,i),a=new L(0,1,0),o=[],l=[];for(let d=0;d<i;d++){const f=r[(d+1)%i].clone().sub(r[(d+i-1)%i]).normalize();o.push(f),l.push(new L().crossVectors(a,f).normalize())}const c=new Wn().setFromPoints(r),u=[(c.min.x+c.max.x)/2,(c.min.z+c.max.z)/2],h=Math.hypot(c.max.x-c.min.x,c.max.z-c.min.z)/2;return{n:i,length:n,half:e,center:u,radius:h,pos:r,tan:o,left:l}}function sn(s,e,t,n,i){const{n:r,pos:a,left:o}=s,l=new Float32Array((r+1)*6),c=new Float32Array((r+1)*4),u=[];for(let d=0;d<=r;d++){const f=d%r,p=a[f],_=o[f];l.set([p.x+_.x*e,p.y+t,p.z+_.z*e,p.x+_.x*n,p.y+i,p.z+_.z*n],d*6),c.set([0,d*Vi,1,d*Vi],d*4),d<r&&u.push(d*2,d*2+1,d*2+2,d*2+1,d*2+3,d*2+2)}const h=new ft;return h.setAttribute("position",new xt(l,3)),h.setAttribute("uv",new xt(c,2)),h.setIndex(u),h.computeVertexNormals(),h}function uc(s,e,t,n,i,r){const a=s.half,o=new nn;return o.add(new Ve(sn(s,a+n,-.03,a,-.01),e),new Ve(sn(s,-a,-.01,-a-n,-.03),e),new Ve(sn(s,a+i,-4,a+n,-.03),t),new Ve(sn(s,-a-n,-.03,-a-i,-4),t)),o}const hM=new Je,dM=new L;function Lt(s,e,t,n){const i=(e/Vi%s.n+s.n)%s.n,r=Math.floor(i),a=(r+1)%s.n,o=i-r,l=s.tan[r].clone().lerp(s.tan[a],o).normalize(),c=s.left[r].clone().lerp(s.left[a],o).normalize();n.position.copy(s.pos[r]).lerp(s.pos[a],o).addScaledVector(c,t),n.quaternion.setFromRotationMatrix(hM.makeBasis(c,dM.crossVectors(l,c),l))}function fM(s,e){const t=(Math.round(e/Vi)%s.n+s.n)%s.n,n=3,i=s.tan[(t+s.n-n)%s.n],r=s.tan[(t+n)%s.n];return((r.x-i.x)*s.left[t].x+(r.z-i.z)*s.left[t].z)/(2*n*Vi)}const hd=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4626.28 931.26" width="462.63" height="93.13"><title>galfredev</title><path fill="#F1EDE6" d="M0.0 931.2607421875H533.0V734.2607421875H532.93310546875V207.173828125H398.7822265625L384.97802734375 279.89111328125H377.97802734375Q352.97802734375 237.80419921875 310.47802734375 216.489013671875Q267.97802734375 195.173828125 216.97802734375 195.173828125Q149.71728515625 195.173828125 101.0869140625 224.989013671875Q52.45654296875 254.80419921875 26.4130859375 316.075927734375Q0.36962890625 377.34765625 0.36962890625 471.71728515625Q0.36962890625 564.63037109375 26.641357421875 625.63037109375Q52.9130859375 686.63037109375 101.0869140625 716.445556640625Q149.2607421875 746.2607421875 213.7822265625 746.2607421875Q245.4345703125 746.2607421875 272.989013671875 738.80419921875Q300.54345703125 731.34765625 323.0 716.47802734375Q345.45654296875 701.6083984375 362.54345703125 680.32568359375H369.0869140625V734.2607421875H369.0V812.2607421875H0.0ZM3072.97802734375 746.2607421875Q3124.521484375 746.2607421875 3166.749755859375 725.489013671875Q3208.97802734375 704.71728515625 3235.6083984375 661.54345703125H3242.6083984375L3254.7822265625 734.2607421875H3388.93310546875V10.173828125H3225.0869140625V261.65234375H3218.54345703125Q3203.0869140625 239.28271484375 3180.358642578125 224.4130859375Q3157.63037109375 209.54345703125 3129.532470703125 202.358642578125Q3101.4345703125 195.173828125 3069.7822265625 195.173828125Q3005.2607421875 195.173828125 2957.0869140625 224.989013671875Q2908.9130859375 254.80419921875 2882.641357421875 315.575927734375Q2856.36962890625 376.34765625 2856.36962890625 469.71728515625Q2856.36962890625 564.0869140625 2882.4130859375 625.358642578125Q2908.45654296875 686.63037109375 2957.0869140625 716.445556640625Q3005.71728515625 746.2607421875 3072.97802734375 746.2607421875ZM795.6953125 746.2607421875Q838.869140625 746.2607421875 872.271240234375 737.532470703125Q905.67333984375 728.80419921875 931.34716796875 713.119384765625Q957.02099609375 697.4345703125 976.19482421875 677.521484375H982.73828125Q989.28173828125 698.4345703125 1005.727294921875 713.89111328125Q1022.1728515625 729.34765625 1047.835693359375 737.575927734375Q1073.49853515625 745.80419921875 1107.10693359375 745.80419921875Q1139.998046875 745.80419921875 1163.617431640625 739.7607421875Q1187.23681640625 733.71728515625 1198.32373046875 728.0869140625V627.23974609375H1164.14990234375Q1149.51953125 627.23974609375 1140.14990234375 617.337646484375Q1130.7802734375 607.435546875 1130.7802734375 590.06591796875V364.89111328125Q1130.7802734375 305.36962890625 1099.62841796875 268.097900390625Q1068.4765625 230.826171875 1013.552978515625 213.0Q958.62939453125 195.173828125 886.0859375 195.173828125Q808.41259765625 195.173828125 753.075927734375 214.30419921875Q697.7392578125 233.4345703125 668.293701171875 268.336669921875Q638.84814453125 303.23876953125 638.84814453125 350.41259765625V359.6953125Q638.84814453125 363.6083984375 639.84814453125 368.06494140625H800.23779296875V359.49951171875Q800.23779296875 343.32568359375 810.139892578125 331.9560546875Q820.0419921875 320.58642578125 839.41162109375 314.3037109375Q858.78125 308.02099609375 884.912109375 308.02099609375Q913.76025390625 308.02099609375 931.445068359375 316.618896484375Q949.1298828125 325.216796875 958.031982421875 340.771240234375Q966.93408203125 356.32568359375 966.93408203125 378.7822265625V412.54345703125Q886.7822265625 412.54345703125 822.47802734375 420.5Q758.173828125 428.45654296875 712.771728515625 448.684814453125Q667.36962890625 468.9130859375 643.097900390625 505.228271484375Q618.826171875 541.54345703125 618.826171875 598.2607421875Q618.826171875 642.45654296875 633.924072265625 671.4130859375Q649.02197265625 700.36962890625 674.706787109375 716.728271484375Q700.3916015625 733.0869140625 731.880615234375 739.673828125Q763.36962890625 746.2607421875 795.6953125 746.2607421875ZM2528.3466796875 746.2607421875Q2589.302734375 746.2607421875 2637.552490234375 733.173828125Q2685.80224609375 720.0869140625 2719.747802734375 694.728271484375Q2753.693359375 669.36962890625 2771.465087890625 631.826171875Q2789.23681640625 594.28271484375 2789.23681640625 545.9130859375H2629.564453125Q2629.564453125 566.02197265625 2622.966552734375 582.3046875Q2616.36865234375 598.58740234375 2603.270751953125 610.00048828125Q2590.1728515625 621.41357421875 2570.988037109375 627.41357421875Q2551.80322265625 633.41357421875 2526.62939453125 633.41357421875Q2485.43359375 633.41357421875 2460.107421875 618.5439453125Q2434.78125 603.67431640625 2423.139892578125 574.250244140625Q2411.49853515625 544.826171875 2410.58544921875 502.89111328125H2789.23681640625V467.97802734375Q2789.23681640625 373.4345703125 2758.345703125 313.34765625Q2727.45458984375 253.2607421875 2667.802734375 224.21728515625Q2608.15087890625 195.173828125 2521.8251953125 195.173828125Q2434.564453125 195.173828125 2372.858154296875 225.21728515625Q2311.15185546875 255.2607421875 2278.2607421875 316.032470703125Q2245.36962890625 376.80419921875 2245.36962890625 470.71728515625Q2245.36962890625 565.2607421875 2278.532470703125 626.2607421875Q2311.6953125 687.2607421875 2375.031982421875 716.7607421875Q2438.36865234375 746.2607421875 2528.3466796875 746.2607421875ZM3764.3466796875 746.2607421875Q3825.302734375 746.2607421875 3873.552490234375 733.173828125Q3921.80224609375 720.0869140625 3955.747802734375 694.728271484375Q3989.693359375 669.36962890625 4007.465087890625 631.826171875Q4025.23681640625 594.28271484375 4025.23681640625 545.9130859375H3865.564453125Q3865.564453125 566.02197265625 3858.966552734375 582.3046875Q3852.36865234375 598.58740234375 3839.270751953125 610.00048828125Q3826.1728515625 621.41357421875 3806.988037109375 627.41357421875Q3787.80322265625 633.41357421875 3762.62939453125 633.41357421875Q3721.43359375 633.41357421875 3696.107421875 618.5439453125Q3670.78125 603.67431640625 3659.139892578125 574.250244140625Q3647.49853515625 544.826171875 3646.58544921875 502.89111328125H4025.23681640625V467.97802734375Q4025.23681640625 373.4345703125 3994.345703125 313.34765625Q3963.45458984375 253.2607421875 3903.802734375 224.21728515625Q3844.15087890625 195.173828125 3757.8251953125 195.173828125Q3670.564453125 195.173828125 3608.858154296875 225.21728515625Q3547.15185546875 255.2607421875 3514.2607421875 316.032470703125Q3481.36962890625 376.80419921875 3481.36962890625 470.71728515625Q3481.36962890625 565.2607421875 3514.532470703125 626.2607421875Q3547.6953125 687.2607421875 3611.031982421875 716.7607421875Q3674.36865234375 746.2607421875 3764.3466796875 746.2607421875ZM4255.0 734.2607421875H4427.02001953125L4626.28076171875 207.173828125H4463.15185546875L4397.0859375 408.3056640625Q4391.1728515625 426.21875 4382.944580078125 454.67529296875Q4374.71630859375 483.1318359375 4366.1728515625 513.403564453125Q4357.62939453125 543.67529296875 4351.0859375 567.21875H4344.9990234375Q4338.45556640625 541.67529296875 4329.183837890625 510.903564453125Q4319.912109375 480.1318359375 4311.95556640625 451.903564453125Q4303.9990234375 423.67529296875 4298.54248046875 408.3056640625L4232.02001953125 207.173828125H4057.28271484375ZM1560.65234375 734.2607421875H1724.49853515625V326.19482421875H1823.302734375V207.173828125H1724.49853515625V168.36865234375Q1724.49853515625 143.10791015625 1735.99853515625 131.064453125Q1747.49853515625 119.02099609375 1775.4765625 119.02099609375H1823.302734375V16.63037109375Q1811.67236328125 12.0869140625 1794.41162109375 8.315185546875Q1777.15087890625 4.54345703125 1759.205322265625 2.271728515625Q1741.259765625 0.0 1726.259765625 0.0Q1671.54248046875 0.0 1634.662353515625 18.097900390625Q1597.7822265625 36.19580078125 1579.21728515625 72.858642578125Q1560.65234375 109.521484375 1560.65234375 164.62939453125V207.173828125H1485.7392578125V326.19482421875H1560.65234375ZM1257.28271484375 734.2607421875H1421.12890625V10.173828125H1257.28271484375ZM1881.28271484375 734.2607421875H2045.12890625V482.8251953125Q2045.12890625 450.0859375 2052.313720703125 424.988037109375Q2059.49853515625 399.89013671875 2074.3681640625 382.705322265625Q2089.23779296875 365.5205078125 2112.422607421875 357.0205078125Q2135.607421875 348.5205078125 2167.15087890625 348.5205078125H2218.82421875V205.2607421875Q2211.82421875 201.71728515625 2196.965576171875 198.173828125Q2182.10693359375 194.63037109375 2163.93310546875 194.63037109375Q2132.5634765625 194.63037109375 2107.3896484375 206.5Q2082.2158203125 218.36962890625 2064.455078125 239.597900390625Q2046.6943359375 260.826171875 2035.06396484375 288.54345703125H2028.06396484375L2016.43359375 207.173828125H1881.28271484375ZM268.02099609375 618.435546875Q230.62939453125 618.435546875 208.205322265625 603.381103515625Q185.78125 588.32666015625 175.91162109375 559.3916015625Q166.0419921875 530.45654296875 166.0419921875 488.49951171875V453.3046875Q166.0419921875 410.89111328125 175.91162109375 381.727783203125Q185.78125 352.564453125 208.205322265625 337.78173828125Q230.62939453125 322.9990234375 268.02099609375 322.9990234375Q304.04296875 322.9990234375 326.510498046875 339.8251953125Q348.97802734375 356.6513671875 359.575927734375 387.17333984375Q370.173828125 417.6953125 370.173828125 458.7392578125V482.15185546875Q370.173828125 512.45654296875 364.2607421875 537.52197265625Q358.34765625 562.58740234375 346.249755859375 580.598388671875Q334.15185546875 598.609375 314.640869140625 608.5224609375Q295.1298828125 618.435546875 268.02099609375 618.435546875ZM3124.02099609375 618.435546875Q3086.62939453125 618.435546875 3064.205322265625 603.65283203125Q3041.78125 588.8701171875 3031.91162109375 559.93505859375Q3022.0419921875 531.0 3022.0419921875 489.04296875V453.84814453125Q3022.0419921875 411.4345703125 3031.91162109375 382.271240234375Q3041.78125 353.10791015625 3064.205322265625 338.053466796875Q3086.62939453125 322.9990234375 3124.02099609375 322.9990234375Q3150.67333984375 322.9990234375 3170.184326171875 332.912109375Q3189.6953125 342.8251953125 3202.021484375 360.836181640625Q3214.34765625 378.84716796875 3220.2607421875 404.140869140625Q3226.173828125 429.4345703125 3226.173828125 459.7392578125V483.6083984375Q3226.173828125 524.19580078125 3215.575927734375 554.489501953125Q3204.97802734375 584.783203125 3182.510498046875 601.609375Q3160.04296875 618.435546875 3124.02099609375 618.435546875ZM856.607421875 633.2177734375Q835.49853515625 633.2177734375 819.08544921875 627.619873046875Q802.67236328125 622.02197265625 793.357177734375 609.880615234375Q784.0419921875 597.7392578125 784.0419921875 578.65234375Q784.0419921875 551.80419921875 805.835693359375 534.97802734375Q827.62939453125 518.15185546875 868.69482421875 510.06494140625Q909.76025390625 501.97802734375 966.93408203125 501.97802734375V537.390625Q966.93408203125 558.41259765625 958.705810546875 576.249755859375Q950.4775390625 594.0869140625 935.792724609375 606.554443359375Q921.10791015625 619.02197265625 900.86865234375 626.119873046875Q880.62939453125 633.2177734375 856.607421875 633.2177734375ZM2412.0419921875 412.54345703125Q2416.49853515625 378.15185546875 2429.41162109375 355.227783203125Q2442.32470703125 332.3037109375 2466.379150390625 320.390625Q2490.43359375 308.4775390625 2526.1728515625 308.4775390625Q2548.54248046875 308.4775390625 2566.183837890625 314.705810546875Q2583.8251953125 320.93408203125 2596.23828125 334.031982421875Q2608.6513671875 347.1298828125 2615.336181640625 366.597412109375Q2622.02099609375 386.06494140625 2622.02099609375 412.54345703125ZM3648.0419921875 412.54345703125Q3652.49853515625 378.15185546875 3665.41162109375 355.227783203125Q3678.32470703125 332.3037109375 3702.379150390625 320.390625Q3726.43359375 308.4775390625 3762.1728515625 308.4775390625Q3784.54248046875 308.4775390625 3802.183837890625 314.705810546875Q3819.8251953125 320.93408203125 3832.23828125 334.031982421875Q3844.6513671875 347.1298828125 3851.336181640625 366.597412109375Q3858.02099609375 386.06494140625 3858.02099609375 412.54345703125Z"/></svg>
`,[,,nh,ih]=hd.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number),pM=new Path2D(hd.match(/ d="([^"]+)"/)[1]);function dd(s){return`#${s.toString(16).padStart(6,"0")}`}function mM(s,e,t,n,i=.78){const r=Math.min(e*i/nh,t*i/ih);s.save(),s.translate((e-nh*r)/2,(t-ih*r)/2),s.scale(r,r),s.fillStyle=dd(n),s.fill(pM),s.restore()}function hc(s,e,t=1024,n=256,i=.78){const r=document.createElement("canvas");r.width=t,r.height=n;const a=r.getContext("2d");e!==null&&(a.fillStyle=dd(e),a.fillRect(0,0,t,n)),mM(a,t,n,s,i);const o=new En(r);return o.colorSpace=It,o.anisotropy=8,o}function ga(s,e,t){let n=Math.imul(s,374761393)^Math.imul(e,668265263)^Math.imul(t,1274126177);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function gM(s,e,t=1){const n=Math.floor(s),i=Math.floor(e),r=s-n,a=e-i,o=r*r*(3-2*r),l=a*a*(3-2*a),c=ga(n,i,t),u=ga(n+1,i,t),h=ga(n,i+1,t),d=ga(n+1,i+1,t);return c+(u-c)*o+(h-c)*l+(c-u-h+d)*o*l}function mi(s,e,t=4,n=1){let i=0,r=.5,a=1;for(let o=0;o<t;o++)i+=r*gM(s*a,e*a,n+o),r*=.5,a*=2;return i}function os(s){let e=s>>>0;return()=>(e=Math.imul(e,1664525)+1013904223>>>0)/4294967296}const Ho=new vt;function Fs(s,e,t,n,i,r=()=>!0,a=0){const o=Math.floor(s.length/n),l=new ln(e,t,o);let c=0;for(let u=0;u<o;u++)r(u*n+a)&&(Lt(s,u*n+a,i,Ho),Ho.updateMatrix(),l.setMatrixAt(c++,Ho.matrix));return l.count=c,l}function _M(s,e){const t=(Math.round(e/Vi)%s.n+s.n)%s.n,n=(t+Math.round(30/Vi))%s.n,i=s.tan[t],r=s.tan[n];return Math.atan2(i.z*r.x-i.x*r.z,i.x*r.x+i.z*r.z)}function xM(s,e,t,n,i,r){const a=[],o=new vt,l=new vt,c=Math.floor(s.length/e),u=6;for(let d=0;d<c;d++){Lt(s,d*e,t,o),Lt(s,(d+1)*e,t,l);for(let f=0;f<u;f++)for(const p of[f/u,(f+1)/u])a.push(o.position.x+(l.position.x-o.position.x)*p,o.position.y+(l.position.y-o.position.y)*p+n-i*4*p*(1-p),o.position.z+(l.position.z-o.position.z)*p)}const h=new ft;return h.setAttribute("position",new tt(a,3)),new Na(h,new Rr({color:r}))}function dc(s,e,t,n){const i=new nn,r=s.half*2+7,a=2.6,o=7.2,l=new en({color:1776410,roughness:.7,metalness:.2});for(const u of[-r/2+.4,r/2-.4])i.add(new Ve(new Bt(.8,o+a+4,.8).translate(u,(o+a-4)/2,0),l));i.add(new Ve(new Bt(r,a,.9).translate(0,o+a/2,0),l));const c=new Mt({map:hc(t,n,2048,Math.round(2048*a/r),.5)});for(const u of[0,Math.PI])i.add(new Ve(new tn(r,a).translate(0,o+a/2,.47).rotateY(u),c));return i.traverse(u=>{u.castShadow=!0}),Lt(s,e,0,i),i}function fd(s,e,t){const n=s/3.2;return new Ve(new tn(s,n).rotateY(Math.PI),new Mt({map:hc(e,t,1024,320,.62)}))}function fc(s){var w,M,b,y,R,x,T,A,I;const n=document.createElement("canvas");n.width=1024,n.height=512;const i=n.getContext("2d"),r=i.createImageData(1024,512),a=N=>new ge().setHex(N,pn),o=a(s.top),l=a(s.horizon),c=a(s.ground),u=a((w=s.sunColor)!=null?w:0),h=((M=s.sun)!=null?M:new L(0,-1,0)).clone().normalize(),d=a((y=(b=s.clouds)==null?void 0:b.dark)!=null?y:0),f=a((x=(R=s.clouds)==null?void 0:R.lit)!=null?x:0),p=(T=s.curve)!=null?T:.45,_=new ge,g=new ge;for(let N=0;N<512;N++){const U=N/511*Math.PI,P=Math.cos(U),B=Math.sin(U);for(let V=0;V<1024;V++){const q=V/1024*Math.PI*2,Q=-B*Math.cos(q),X=B*Math.sin(q);P>0?_.copy(l).lerp(o,Math.pow(P,p)):_.copy(l).lerp(c,Math.min(1,-P*6));const Y=Math.max(0,Q*h.x+P*h.y+X*h.z);if(s.clouds&&P>0){const ue=1/(P+.09),oe=mi(Q*ue*.55+3,X*ue*1.5+7,5,17),fe=es(1-s.clouds.cover,1.2-s.clouds.cover,oe*1.35)*es(.015,.1,P)*(1-es(.3,.75,P)),H=Math.min(1,Math.pow(Y,3)*1.25+Math.pow(1-P,5)*.4);g.copy(d).lerp(f,H*(.55+.45*es(.45,.8,oe))),_.lerp(g,fe*.92)}const j=es(.99925,.9996,Y)*2+Math.pow(Y,300)*.8+Math.pow(Y,28)*.38+Math.pow(Y,5)*.16,se=(Math.random()-.5)/128,Z=(N*1024+V)*4;r.data[Z]=(_.r+u.r*j+se)*255,r.data[Z+1]=(_.g+u.g*j+se)*255,r.data[Z+2]=(_.b+u.b*j+se)*255,r.data[Z+3]=255}}i.putImageData(r,0,0);const m=new En(n);m.colorSpace=It,m.wrapS=gn;const S=new Ve(new Vs(1500,48,24),new Mt({map:m,color:new ge().setScalar((A=s.gain)!=null?A:1),side:fn,depthWrite:!1,fog:!1}));return S.name="sky",S.frustumCulled=!1,s.sun&&(S.userData.sun={dir:h,color:new ge((I=s.sunColor)!=null?I:16777215)}),S}function es(s,e,t){const n=Math.min(1,Math.max(0,(t-s)/(e-s)));return n*n*(3-2*n)}const pd=3.4;function pc(s,e){var d,f;const t=(p,_)=>{let g=0,m=0,S=1/0;for(let w=0;w<s.n;w+=2){const M=s.pos[w],b=(M.x-p)*(M.x-p)+(M.z-_)*(M.z-_),y=1/((b+4)*(b+4));g+=y*M.y,m+=y,b<S&&(S=b)}return[g/m,Math.sqrt(S)]},n=(p,_)=>{var b;const[g,m]=t(p,_),S=es(e.flat,e.flat+((b=e.ramp)!=null?b:140),m),w=1-Math.abs(mi(p*e.scale,_*e.scale,5,e.seed)*2-1),M=.6*w*w+.4*mi(p*e.scale*.4+40,_*e.scale*.4,3,e.seed+3);return g-pd+e.relief*S*M+(S>0?1.2*mi(p*.05,_*.05,3,e.seed+9)*Math.min(1,m/40):0)},i=new tn(e.size,e.size,e.segments,e.segments).rotateX(-Math.PI/2),r=i.attributes.position,a=(d=e.focus)!=null?d:1,o=e.size/2,l=(f=e.tile)!=null?f:50,c=p=>Math.sign(p)*Math.pow(Math.abs(p)/o,a)*o;for(let p=0;p<r.count;p++)r.setXYZ(p,e.center[0]+c(r.getX(p)),0,e.center[1]+c(r.getZ(p)));const u=e.color?new Float32Array(r.count*3):null,h=i.attributes.uv;for(let p=0;p<r.count;p++){const _=r.getX(p),g=r.getZ(p),m=n(_,g);r.setY(p,m),h.setXY(p,_/l,g/l),u&&e.color&&e.color(m,_,g).toArray(u,p*3)}return u&&i.setAttribute("color",new xt(u,3)),i.computeVertexNormals(),{mesh:new Ve(i,e.material),heightAt:n,distanceAt:(p,_)=>t(p,_)[1]}}function vM(s){var c;const e=(c=s.around)!=null?c:720,t=10,n=[],i=[],r=[],a=[],o=s.jagged;for(let u=0;u<=e;u++){const h=u/e*Math.PI*2,d=Math.cos(h),f=Math.sin(h),p=Math.pow(mi(d*o+9,f*o+9,4,s.seed),1.25)*1.7,_=s.height*(.3+.62*p+.16*mi(d*o*9,f*o*9,3,s.seed+5)),g=es(.25,.75,mi(d*o*11,f*o*11,3,s.seed+80));for(let m=0;m<=t;m++){const S=m/t,w=s.radius*(1+.3*(1-S)+.07*(g-.5)*(1-S*.6));n.push(s.center[0]+d*w,s.base+_*S,s.center[1]+f*w),r.push(u/e*s.repeat,_*S/s.height);const M=s.shade*(.5+.7*g)*(.82+.18*S);i.push(M,M,M)}}for(let u=0;u<e;u++)for(let h=0;h<t;h++){const d=u*(t+1)+h,f=d+t+1;a.push(d,d+1,f,d+1,f+1,f)}const l=new ft;return l.setAttribute("position",new tt(n,3)),l.setAttribute("color",new tt(i,3)),l.setAttribute("uv",new tt(r,2)),l.setIndex(a),new Ve(l,new Mt({map:s.map,vertexColors:!0,side:Wt}))}function MM(s,e){const t=new Float32Array(s*3);let n=e;const i=()=>(n=Math.imul(n,1664525)+1013904223>>>0)/4294967296;for(let o=0;o<s;o++){const l=i()*Math.PI*2,c=.08+i()*.92,u=Math.sqrt(1-c*c);t.set([Math.cos(l)*u*1400,c*1400,Math.sin(l)*u*1400],o*3)}const r=new ft;r.setAttribute("position",new xt(t,3));const a=new za(r,new Ba({color:16777215,size:2.2,sizeAttenuation:!1,fog:!1,transparent:!0,opacity:.8,depthWrite:!1}));return a.name="sky",a.frustumCulled=!1,a}function vi(s,e){const t=document.createElement("canvas");return t.width=s,t.height=e,[t,t.getContext("2d")]}function jt(s,e=1){return`rgba(${s>>16&255},${s>>8&255},${s&255},${e})`}function mc(s,e){const[i,r]=vi(512,1024),a=os(7);r.fillStyle=jt(s.base),r.fillRect(0,0,512,1024);for(let u=0;u<26e3;u++){const h=a();r.fillStyle=h>.5?jt(16777215,s.grain*a()):jt(0,s.grain*1.6*a()),r.fillRect(a()*512,a()*1024,1+a()*2,1+a()*2)}for(const u of[.2,.38,.62,.8]){const h=r.createLinearGradient((u-.07)*512,0,(u+.07)*512,0);h.addColorStop(0,jt(0,0)),h.addColorStop(.5,jt(0,.16)),h.addColorStop(1,jt(0,0)),r.fillStyle=h,r.fillRect((u-.07)*512,0,.14*512,1024)}const o=512/s.width;r.fillStyle=jt(s.edge,.92),r.fillRect(.35*o,0,.16*o,1024),r.fillRect(512-.51*o,0,.16*o,1024),r.fillStyle=jt(s.dash,.92);const l=1024/s.period;for(let u=0;u<s.period;u+=8)r.fillRect(512/2-.07*o,u*l,.14*o,3.2*l);for(let u=0;u<5e3;u++)r.fillStyle=jt(s.base,.5*a()),r.fillRect(a()*512,a()*1024,2,1+a()*5);const c=new En(i);return c.colorSpace=It,c.wrapT=gn,c.repeat.set(1,1/s.period),c.anisotropy=e,c}function Il(s,e,t){const n=os(t),i=new Float32Array(e*e).map(()=>n()),r=new Float32Array(s*s);for(let a=0;a<s;a++)for(let o=0;o<s;o++){const l=o/s*e,c=a/s*e,u=Math.floor(l),h=Math.floor(c),d=l-u,f=c-h,p=d*d*(3-2*d),_=f*f*(3-2*f),g=(m,S)=>i[S%e*e+m%e];r[a*s+o]=g(u,h)*(1-p)*(1-_)+g(u+1,h)*p*(1-_)+g(u,h+1)*(1-p)*_+g(u+1,h+1)*p*_}return r}function SM(s,e){const[n,i]=vi(256,256),r=Il(256,7,3),a=Il(256,29,9),o=i.createImageData(256,256);for(let c=0;c<256*256;c++){const u=r[c]*.6+a[c]*.4,h=Math.min(1,Math.max(0,(u-.4)*2.6)),d=.11+.17*h*h*(3-2*h);o.data.set([255,d*255,0,255],c*4)}i.putImageData(o,0,0);const l=new En(n);return l.wrapS=l.wrapT=gn,l.repeat.set(2,2/s),l.anisotropy=e,l}function md(s,e,t){const[n,i]=vi(8,64);i.fillStyle=jt(s),i.fillRect(0,0,8,32),i.fillStyle=jt(e),i.fillRect(0,32,8,32);const r=new En(n);return r.colorSpace=It,r.wrapT=gn,r.repeat.set(1,1/t),r.magFilter=Xt,r}function yM(){const[s,e]=vi(64,4),t=e.createLinearGradient(0,0,64,0);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.3,"rgba(255,255,255,.35)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,4),new En(s)}function sh(s,e){const[r,a]=vi(256,512),o=os(s);a.fillStyle="#080a12",a.fillRect(0,0,r.width,r.height),a.fillStyle="#121624";for(let h=0;h<=8;h++)a.fillRect(h*32-1,0,2,r.height);const l=["#cfe6ff","#9fd8ff","#e8f2ff","#7fd0ff"],c=["#ffd9a0","#ffe9c8","#ffc078","#ff9ad0"];for(let h=0;h<16;h++){const d=h*32;if(e==="bands"){const p=o();if(a.fillStyle="#0d111d",a.fillRect(0,d+9,r.width,16),p<.45){const _=p<.2?0:Math.floor(o()*8),g=p<.2?8:Math.min(8,_+1+Math.floor(o()*5));a.globalAlpha=.45+o()*.55,a.fillStyle=l[Math.floor(o()*l.length)],a.fillRect(_*32+2,d+9,(g-_)*32-4,16),a.globalAlpha=1}continue}const f=e==="grid"&&o()<.16;for(let p=0;p<8;p++){const _=o()<(f?.9:e==="grid"?.26:.16),g=e==="homes"||o()<.2?c:l;a.globalAlpha=_?.4+o()*.6:1,a.fillStyle=_?g[Math.floor(o()*g.length)]:"#0c0f1a",e==="homes"?a.fillRect(p*32+9,d+9,13,15):a.fillRect(p*32+5,d+7,22,18)}}a.globalAlpha=1;const u=new En(r);return u.colorSpace=It,u.wrapS=u.wrapT=gn,u}function bM(s,e,t){const[i,r]=vi(512,512);r.fillStyle=jt(s),r.fillRect(0,0,512,512),r.strokeStyle=jt(e,.35),r.lineWidth=1;for(let o=0;o<5;o++){const l=o/5*512+.5;r.beginPath(),r.moveTo(l,0),r.lineTo(l,512),r.moveTo(0,l),r.lineTo(512,l),r.stroke()}r.strokeStyle=jt(e,.9),r.lineWidth=2,r.strokeRect(0,0,512,512);const a=new En(i);return a.colorSpace=It,a.wrapS=a.wrapT=gn,a.anisotropy=t,a}function Nr(s,e,t,n=256,i=64,r="800 Archivo"){const[a,o]=vi(n,i);t!==null&&(o.fillStyle=jt(t),o.fillRect(0,0,n,i)),o.fillStyle=jt(e);let l=Math.round(i*.68);o.font=`${r.replace(" ",` ${l}px `)}, system-ui, sans-serif`;const c=o.measureText(s).width;c>n*.88&&(l=Math.floor(l*n*.88/c)),o.font=`${r.replace(" ",` ${l}px `)}, system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(s,n/2,i*.54);const u=new En(a);return u.colorSpace=It,u.anisotropy=4,u}function EM(s,e){const[t,n]=vi(4,64),i=n.createLinearGradient(0,0,0,64);i.addColorStop(0,jt(s)),i.addColorStop(1,jt(e)),n.fillStyle=i,n.fillRect(0,0,4,64);const r=new En(t);return r.colorSpace=It,r.wrapS=gn,r}function TM(s,e){const[n,i]=vi(256,256),r=os(s),a=Il(256,9,s),o=i.createImageData(256,256);for(let c=0;c<256*256;c++){const u=215+(a[c]-.5)*40+(r()-.5)*34;o.data.set([u,u,u,255],c*4)}i.putImageData(o,0,0);for(let c=0;c<260;c++){const u=r()*256,h=r()*256,d=.6+r()*r()*3.4;i.fillStyle=r()<.5?"rgba(70,60,55,.5)":"rgba(255,250,240,.6)";for(const f of[-256,0,256])for(const p of[-256,0,256])i.beginPath(),i.ellipse(u+f,h+p,d,d*(.5+r()*.5),r()*3,0,6.3),i.fill()}const l=new En(n);return l.colorSpace=It,l.wrapS=l.wrapT=gn,l.anisotropy=e,l}const Zi=1118481,Ni=15855078,wM=14983979,AM=10591378,RM='500 "Geist Mono"',CM={name:"Cinta",exposure:1,layout:[[0,0,0],[180,0,0],[250,0,40],[250,0,120],[180,0,160],[100,0,160],[60,0,200],[60,0,270],[0,0,310],[-70,0,290],[-110,0,220],[-110,0,80],[-70,0,10]],half:7,wall:7.1,start:900,grade:{bloom:[.2,.6,1.1],vignette:.55,speed:.11},trail:wM,cars:[{paint:14276044,accent:Zi},{paint:2368546,accent:Ni},{paint:9276036,accent:Zi},{paint:14276044,accent:Zi},{paint:3815991,accent:Ni},{paint:12170410,accent:Zi}],build({scene:s,track:e,anisotropy:t,fine:n}){s.fog=new Dr(2763047,.0015);const i=fc({top:1315859,horizon:5591628,ground:1776410,curve:.5,gain:1.15});s.add(i),s.add(new Ga(16775920,3026219,.75));const r=new Fr(16773596,3.6);r.position.set(-.62,.46,.6),s.add(r);const a=e.half;s.add(new Ve(sn(e,a,0,-a,0),new en({map:mc({base:2829097,grain:.035,edge:Ni,dash:9276036,period:32,width:a*2},t),roughness:.9,envMapIntensity:.35})));const o=new Mt({map:md(Ni,Zi,4)}),l=new en({color:15131353,roughness:.95,side:Wt});for(const se of[1,-1]){s.add(new Ve(sn(e,se*(a+(se>0?1:.2)),.02,se*(a+(se>0?.2:1)),.02),o));const Z=new Ve(sn(e,se*(a+1.2),0,se*(a+1.2),.5),l),ue=new Ve(sn(e,se*(a+(se>0?1.7:1.2)),.5,se*(a+(se>0?1.2:1.7)),.5),l),oe=new Ve(sn(e,se*(a+1.7),.5,se*(a+1.7),-.2),l);Z.castShadow=ue.castShadow=oe.castShadow=!0,s.add(Z,ue,oe)}const c=new Cn({color:2039582});s.add(uc(e,c,new Cn({color:2631718}),2.4,2.42));const u=pc(e,{center:e.center,size:2400,segments:60,relief:0,flat:20,scale:.01,seed:2,material:new Cn({map:bM(2894890,7631210,t)})});s.add(u.mesh);const h=-pd,d=Hs([new ki(.1,.1,6.5,5).toNonIndexed().translate(0,3.25+h,0),new ic(2,1).translate(0,7.6+h,0)]);d.computeVertexNormals();const f=new Cn({color:12433582,flatShading:!0});for(const se of[1,-1]){const Z=Fs(e,d,f,18,se*(a+8),void 0,se>0?0:9);Z.castShadow=!0,s.add(Z)}const p=os(77),_=new vt,g=new ge,m=new ge,S=new Bt(1,1,1).translate(0,.5,0),w=new ln(S,new en({roughness:.95}),1500),M=[],b=[],y=new L,R=[[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]];let x=0;const T=(se,Z,ue,oe,fe,H,K)=>{_.position.set(se,Z,ue),_.scale.set(oe,fe,H),_.updateMatrix(),w.setMatrixAt(x,_.matrix),w.setColorAt(x++,g.set(K).multiplyScalar(.9+p()*.1)),m.set(K===15131353?5591628:13617855);for(const[pe,ze]of R)for(const he of[pe,ze])y.set(se+((he&1)-.5)*(oe+.06),Z+(he&2?fe+.03:0),ue+((he&4?1:0)-.5)*(H+.06)),M.push(y.x,y.y,y.z),b.push(m.r,m.g,m.b)},A=n?9:6;for(let se=-A;se<=A;se++)for(let Z=-A;Z<=A;Z++){const ue=e.center[0]+se*44,oe=e.center[1]+Z*44,fe=1+Math.floor(p()*3);for(let H=0;H<fe;H++){const K=8+Math.floor(p()*3)*6,pe=8+Math.floor(p()*3)*6,ze=ue+(p()-.5)*(34-K),he=oe+(p()-.5)*(34-pe),Ge=u.distanceAt(ze,he);if(Ge<a+14+Math.max(K,pe)*.7)continue;const Te=p(),ke=Te<.72?15131353:Te<.9?9276036:3815991,$e=4+p()*p()*Math.min(120,10+Ge*.5);T(ze,h,he,K,$e,pe,ke);let st=h+$e,Ye=K,lt=pe;for(let ut=0;ut<2&&$e>22&&p()<.6;ut++){Ye*=.62,lt*=.62;const Nt=$e*(.2+p()*.25);T(ze,st,he,Ye,Nt,lt,ke),st+=Nt}}}w.count=x,w.castShadow=!0,s.add(w);const I=new ft;I.setAttribute("position",new tt(M,3)),I.setAttribute("color",new tt(b,3)),s.add(new Na(I,new Rr({vertexColors:!0})));const N=[],[U,P]=e.center,B=[[U,P,90],[U,P,210],[U+120,P-60,60],[U-130,P+50,75],[U,P,360]];for(const[se,Z,ue]of B){for(let oe=0;oe<160;oe++){const fe=oe/160*Math.PI*2,H=(oe+1)/160*Math.PI*2;N.push(se+Math.cos(fe)*ue,h+.2,Z+Math.sin(fe)*ue,se+Math.cos(H)*ue,h+.2,Z+Math.sin(H)*ue)}N.push(se-4,h+.2,Z,se+4,h+.2,Z,se,h+.2,Z-4,se,h+.2,Z+4)}const V=new ft;V.setAttribute("position",new tt(N,3)),s.add(new Na(V,new Rr({color:12170410,transparent:!0,opacity:.6})));const q=8;for(let se=0;se<q;se++){const Z=new Ve(new tn(9,9).rotateX(-Math.PI/2).rotateY(Math.PI),new Mt({map:Nr(String(se+1).padStart(2,"0"),Ni,null,256,256),transparent:!0,opacity:.85,depthWrite:!1}));Lt(e,se/q*e.length+90,0,Z),Z.position.y+=.03,s.add(Z);const ue=new Ve(new tn(14,2.2).rotateX(-Math.PI/2).rotateY(Math.PI),new Mt({map:Nr(`SECTOR ${String(se+1).padStart(2,"0")} · ${Math.round(se/q*e.length+90)} M`,AM,null,512,80,RM),transparent:!0,depthWrite:!1}));Lt(e,se/q*e.length+90,a+12,ue),ue.position.y=h+.25,s.add(ue)}s.add(dc(e,0,Zi,Ni));const Q=fd(64,Ni,Zi);Lt(e,95,-(a+30),Q),Q.rotateY(-Math.PI/2),Q.position.y=h+10;const X=new Ve(new Bt(64,20,3).translate(0,0,1.6),new en({color:1776410,roughness:.9}));X.castShadow=!0,Q.add(X),s.add(Q);const Y=new Ve(new tn(150,30).rotateX(-Math.PI/2),new Mt({map:hc(Ni,null,2048,410,.94),transparent:!0,depthWrite:!1}));Lt(e,95,a+46,Y),Y.rotateY(Math.PI/2),Y.position.y=h+.22,s.add(Y);const j=new tn(2400,2400).rotateX(-Math.PI/2).translate(U,0,P);return{sun:r,shadowRange:110,mirrors:[{flat:j,y:h+.05,look:{strength:.75,blur:.012}}]}}},hi=1697535,ts=16722896,gd=8019199,xr=16752672,_d=16724048,rh=1118481,ah=15855078,oh=[["nitro",16777215,ts],["cine",hi,657938],["hotel",657938,xr],["24 h",ts,657938],["arcade",16777215,gd],["bar",_d,657938],["ramen",657938,hi],["radio",xr,657938]],lh=["Centro  ↑","Puerto  ↗","Salida 12","Costanera  ↑"];function lr(s,e,t={}){return new Mt({color:new ge(s).multiplyScalar(e),...t})}const PM={name:"Neón",exposure:1.1,layout:[[0,0,0],[160,0,0],[300,0,0],[340,0,30],[350,0,120],[340,0,200],[280,0,230],[200,0,225],[150,0,250],[100,0,235],[40,0,255],[-40,0,250],[-110,0,235],[-150,0,180],[-155,0,90],[-140,0,25],[-90,0,0]],half:8,wall:7.5,start:60,grade:{bloom:[1,.72,.85],vignette:.6,speed:.11},night:!0,spray:{color:11126527,opacity:.13,size:2.6,additive:!0},cars:[{paint:2373840,accent:ts,underglow:ts},{paint:13636698,accent:16777215,underglow:xr},{paint:15263984,accent:hi,underglow:hi},{paint:1315868,accent:hi,underglow:hi},{paint:14256668,accent:1118481,underglow:xr},{paint:1278042,accent:16777215,underglow:3211162}],build({scene:s,track:e,anisotropy:t,fine:n}){s.fog=new Dr(1707318,.0032);const i=fc({top:328463,horizon:4856422,ground:459791,curve:.34,clouds:{dark:788512,lit:8007824,cover:.55}});s.add(i,MM(400,4)),s.add(new Ga(9080048,4854872,1.5));const r=new Fr(11832575,.9);r.position.set(-40,80,30),s.add(r);const a=32,o=e.half,l=SM(a,t),c=sn(e,o,0,-o,0);s.add(new Ve(c,new en({map:mc({base:1381660,grain:.07,edge:14673663,dash:14673663,period:a,width:o*2},t),roughnessMap:l,roughness:1,metalness:0,envMapIntensity:.22})));const u=new en({color:1644834,roughness:.55,side:Wt}),h=yM();for(const[Z,ue]of[[1,hi],[-1,ts]]){const oe=Z*(o+.6);s.add(new Ve(sn(e,oe,.95,oe,-.1),u)),s.add(new Ve(sn(e,oe,1.02,oe,.9),lr(ue,1.8,{side:Wt,fog:!1}))),s.add(new Ve(sn(e,oe,.03,oe-Z*2.6,.03),new Mt({map:h,color:ue,transparent:!0,opacity:.26,blending:zn,depthWrite:!1,side:Wt})))}const d=new en({color:1052694,roughness:.7});s.add(uc(e,d,d,1.2,3.2));const f=pc(e,{center:e.center,size:1700,segments:90,relief:0,flat:20,scale:.01,seed:2,material:new en({color:789522,roughness:.35,metalness:.3})});s.add(f.mesh);const p=new vt,_=new ge,g=(Z,ue)=>new ln(new tn(1,1).rotateX(-Math.PI/2),new Mt({map:Ir(),transparent:!0,opacity:ue,blending:zn,depthWrite:!1}),Z),m=new en({color:2302764,roughness:.5,metalness:.6}),S=64,w=Math.floor(e.length/S)*2,M=g(w,.3);for(const Z of[1,-1]){const ue=-Z*3.4,oe=Hs([new ki(.1,.14,9,6).translate(0,4.5,0),new Bt(Math.abs(ue),.12,.16).translate(ue/2,9,0)]),fe=Z>0?0:S/2,H=Z*(o+1.6);s.add(Fs(e,oe,m,S,H,void 0,fe)),s.add(Fs(e,new Bt(1.1,.1,.34).translate(ue,8.92,0),lr(14674687,3,{fog:!1}),S,H,void 0,fe));for(let K=0;K<w/2;K++){Lt(e,K*S+fe,Z*(o-1.8),p),p.position.y+=.05,p.scale.set(15,1,22),p.updateMatrix();const pe=K*2+(Z>0?0:1);M.setMatrixAt(pe,p.matrix),M.setColorAt(pe,_.set(12374271))}}s.add(M);const b=110,y=Math.floor(e.n/b),R=new Bt(1,1,1),x=new ln(R,new Mt({fog:!1}),y*3),T=g(y,.45),A=o+1.4,I=9.5;for(let Z=0;Z<y;Z++){const ue=Z*b+60,oe=e.pos[ue],fe=e.tan[ue],H=e.left[ue];_.set(Z%2?ts:hi);const K=Math.atan2(fe.x,fe.z);[[0,I,A*2+.24,.24],[A,I/2,.24,I],[-A,I/2,.24,I]].forEach(([pe,ze,he,Ge],Te)=>{p.position.set(oe.x+H.x*pe,oe.y+ze,oe.z+H.z*pe),p.rotation.set(0,K,0),p.scale.set(he,Ge,.24),p.updateMatrix(),x.setMatrixAt(Z*3+Te,p.matrix),x.setColorAt(Z*3+Te,_.clone().multiplyScalar(2.4))}),p.position.set(oe.x,oe.y+.04,oe.z),p.scale.set(o*2.6,1,26),p.updateMatrix(),T.setMatrixAt(Z,p.matrix),T.setColorAt(Z,_)}s.add(x,T),s.add(dc(e,0,ah,rh));for(const[Z,ue]of[[520,1],[1180,-1]]){const oe=fd(22,ah,rh);Lt(e,Z,ue*(o+13),oe),oe.rotateY(ue*.45),oe.position.y+=10,oe.add(new Ve(Hs([-7,7].map(fe=>new Bt(.35,14,.35).translate(fe,-7.5,.3))),m)),s.add(oe)}oh.forEach(([Z,ue,oe],fe)=>{const H=fe%2?1:-1,K=new Ve(new tn(13,3.4).rotateY(Math.PI),lr(16777215,1.5,{map:Nr(Z,ue,oe,384,100),fog:!1}));Lt(e,(fe+.2)*(e.length/oh.length),H*(o+6.5),K),K.rotateY(H*.35),K.rotateZ(Math.PI/2),K.position.y+=9.5;const pe=new Ve(new Bt(.3,.3,17).rotateY(Math.PI/2).translate(-1.5,0,.3),m);K.add(pe),s.add(K)}),lh.forEach((Z,ue)=>{const oe=new nn,fe=(ue+.62)*(e.length/lh.length);oe.add(new Ve(new Bt(o*2+5,.35,.35).translate(0,8.4,0),m));for(const H of[-o-2.4,o+2.4])oe.add(new Ve(new Bt(.35,9,.35).translate(H,4,0),m));oe.add(new Ve(new tn(8.5,2.6).rotateY(Math.PI).translate(ue%2?3.2:-3.2,6.9,-.2),lr(16777215,.8,{map:Nr(Z,15397631,1060970,384,118,'500 "Instrument Sans"')}))),Lt(e,fe,0,oe),s.add(oe)});const N=sh(90,"bands");N.repeat.set(2.4,.11),N.offset.set(0,.02);for(const Z of[330,900,1390]){const ue=new Ve(new Bt(o*2+70,4.2,5),lr(16777215,1.5,{map:N}));Lt(e,Z,0,ue),ue.position.y+=17,s.add(ue)}const U=os(31),P=[[22,34,"homes"],[26,80,"grid"],[30,150,"bands"]],B=[],V=n?22:12;for(let Z=-V;Z<=V;Z++)for(let ue=-V;ue<=V;ue++){const oe=e.center[0]+Z*36+(U()-.5)*8,fe=e.center[1]+ue*36+(U()-.5)*8,H=f.distanceAt(oe,fe);H<o+28||B.push([oe,f.heightAt(oe,fe),fe,U()<Math.min(.6,H/320)?2:U()<.55?1:0])}const q=[hi,ts,xr,gd,_d],Q=new ln(R,new Mt,B.length*5);let X=0;const Y=[],j=[];P.forEach(([Z,ue,oe],fe)=>{const H=B.filter(Te=>Te[3]===fe),K=sh(60+fe,oe);K.repeat.set(Z/28,ue/56);const pe=new Bt(Z,ue,Z).translate(0,ue/2,0),ze=pe.attributes.uv;for(let Te=8;Te<16;Te++)ze.setXY(Te,0,0);const he=new ln(pe,new Mt({map:K}),H.length*2);let Ge=0;H.forEach(([Te,ke,$e])=>{const st=.7+U()*.6;let Ye=ue*st;if(p.position.set(Te,ke,$e),p.rotation.set(0,0,0),p.scale.set(1,st,1),p.updateMatrix(),_.setHSL(.56+U()*.3,.35,.72+U()*.28).multiplyScalar(1.5),he.setMatrixAt(Ge,p.matrix),he.setColorAt(Ge++,_),fe>0&&U()<.55){const lt=.5+U()*.25,ut=.18+U()*.3;p.position.set(Te,ke+Ye,$e),p.scale.set(lt,ut,lt),p.updateMatrix(),he.setMatrixAt(Ge,p.matrix),he.setColorAt(Ge++,_),Ye+=ue*ut}if(fe===2&&(p.position.set(Te,ke+Ye+7,$e),p.scale.set(.5,14,.5),p.updateMatrix(),Q.setMatrixAt(X,p.matrix),Q.setColorAt(X++,_.set(3158076)),Y.push(Te,ke+Ye+14.5,$e),j.push(1,.1,.1)),U()<(fe===2?.6:.35)){_.set(q[Math.floor(U()*q.length)]).multiplyScalar(2.2);const lt=fe===2?[[1,1],[1,-1],[-1,1],[-1,-1]]:[[U()<.5?1:-1,U()<.5?1:-1]],ut=ue*st,Nt=fe===2?ut:8+U()*Math.min(26,ut*.4);for(const[ht,St]of lt)p.position.set(Te+ht*(Z/2+.3),ke+(fe===2?ut/2:ut*(.3+U()*.4)),$e+St*(Z/2+.3)),p.scale.set(fe===2?.5:1.6,Nt,fe===2?.5:1.6),p.updateMatrix(),Q.setMatrixAt(X,p.matrix),Q.setColorAt(X++,_)}}),he.count=Ge,s.add(he)}),Q.count=X,s.add(Q);const se=new ft;return se.setAttribute("position",new tt(Y,3)),se.setAttribute("color",new tt(j,3)),s.add(new za(se,new Ba({map:Ir(),size:30,vertexColors:!0,transparent:!0,opacity:.7,blending:zn,depthWrite:!1}))),{mirrors:[{flat:c,y:.012,look:{strength:1.25,blur:.09,mask:l,maskScale:.07}}]}}},Vo=new L(-.72,.27,.64).normalize(),Di=[11030575,13201468,14721120,15388832,10115704,7309922,13662272,9058858,14267530,8014442].map(s=>new ge(s));function LM(s){const e=(i,r)=>{const a=new ki(i*.92,i,r,10,1,!0).translate(0,r/2,0),o=a.attributes.position;for(let l=0;l<o.count;l++){const c=Math.atan2(o.getZ(l),o.getX(l)),u=.86+.14*Math.abs(Math.cos(c*5));o.setXYZ(l,o.getX(l)*u,o.getY(l),o.getZ(l)*u)}return a},t=i=>new Vs(i*.92,10,s?4:2,0,Math.PI*2,0,Math.PI/2),n=[e(.42,6.4),t(.42).translate(0,6.4,0)];for(const[i,r,a]of[[1,2.5,2.8],[-1,3.4,2.1]])n.push(new ac(.75,.24,s?6:5,s?6:3,Math.PI/2).rotateZ(Math.PI).rotateY(i>0?0:Math.PI).translate(i*.75,r+.75,0)),n.push(e(.26,a).translate(i*1.5,r+.75,0)),n.push(t(.26).translate(i*1.5,r+.75+a,0));return Hs(n.map(i=>i.toNonIndexed()))}const xd={name:"Puna",exposure:.78,layout:[[0,0,0],[140,2,-20],[260,8,30],[300,16,140],[230,24,220],[130,28,200],[90,30,260],[170,34,330],[110,38,400],[0,36,380],[-90,30,300],[-60,24,200],[-150,16,150],[-230,8,60],[-180,2,-30],[-90,0,-20]],half:6.5,wall:12,start:820,grade:{bloom:[.35,.6,1.25],vignette:.5,speed:.11},spray:{color:13214334,opacity:.2,size:2.6,additive:!1},cars:[{paint:11740702,accent:15855078},{paint:14078664,accent:11740702},{paint:1315860,accent:15855078},{paint:2054766,accent:15855078},{paint:3104058,accent:15855078},{paint:4860779,accent:15855078}],build({scene:s,track:e,anisotropy:t,fine:n}){const i=n?1:.35;s.fog=new Dr(14461068,52e-5);const r=fc({top:4154292,horizon:16169354,ground:10117704,sun:Vo,sunColor:16769716,curve:.5,gain:1.25,clouds:{dark:10521256,lit:16763030,cover:.27}});s.add(r);const a=new Ve(new Ha(26,24),new Mt({color:new ge(16767392).multiplyScalar(9),fog:!1,transparent:!0,depthWrite:!1}));a.position.copy(Vo).multiplyScalar(1450),a.lookAt(0,0,0);const o=new nn;o.name="sky",o.add(a),s.add(o),s.add(new Ga(11123952,11036734,1.7));const l=new Fr(16761996,4.2);l.position.copy(Vo),s.add(l),s.add(new Ve(sn(e,e.half,0,-e.half,0),new en({map:mc({base:3815478,grain:.12,edge:15855078,dash:14983979,period:32,width:e.half*2},t),roughness:.62,metalness:0,envMapIntensity:.55})));const c=TM(4,t),u=new Cn({color:11897448,map:c}),h=new Cn({color:11039570,map:c});s.add(uc(e,u,h,7.6,16));const d=new Cn({map:md(11740702,15855078,4)});s.add(new Ve(sn(e,-e.half+.05,.015,-e.half-.9,.05),d)),s.add(new Ve(sn(e,e.half+.9,.05,e.half-.05,.015),d));const f=new en({color:12894392,metalness:.85,roughness:.4,side:Wt}),p=new Ve(sn(e,e.half+6.7,.5,e.half+6.7,.14),f),_=Fs(e,new Bt(.1,.9,.12).translate(0,.08,0),f,4,e.half+6.78);p.castShadow=_.castShadow=!0,s.add(p,_);const g=new Cn({color:4862756}),m=Hs([new ki(.11,.15,9,6).translate(0,4.5,0),new Bt(2.2,.14,.14).translate(0,8.3,0)]),S=Fs(e,m,g,46,-e.half-8);S.castShadow=!0,s.add(S);for(const B of[-1,1])s.add(xM(e,46,-e.half-8+B,8.4,.9,2365972));const w=new Mt({map:Nr("›››",1118481,14983979,128,64),side:Wt});for(const B of[1,-1]){const V=new tn(2.4,1.2).rotateY(Math.PI).translate(0,1.5,0);B>0&&V.scale(-1,1,1);const q=Fs(e,V,w,9,-B*(e.half+7.4),Q=>_M(e,Q)*B>.5);q.castShadow=!0,s.add(q)}const M=new ge(12618334),b=new ge(14200968),y=new ge,R=new ge,x=pc(e,{center:e.center,size:3600,segments:n?230:110,focus:1.7,tile:14,relief:250,flat:34,ramp:520,scale:.0042,seed:11,material:new Cn({vertexColors:!0,map:c}),color:(B,V,q)=>{const Q=(B+26*mi(V*.004,q*.004,3,7))/13,X=Math.floor(Q),Y=Q-X;R.copy(Di[(X%Di.length+Di.length)%Di.length]).lerp(Di[((X+1)%Di.length+Di.length)%Di.length],Math.max(0,(Y-.75)*4));const j=Math.min(1,Math.max(0,(B-2)/26));return y.copy(M).lerp(b,mi(V*.02,q*.02,3,5)).lerp(R,j*.92)}});s.add(x.mesh),s.add(vM({around:n?720:240,center:e.center,radius:2300,height:640,base:-40,seed:8,map:EM(9071246,12159626),repeat:1,jagged:1.3,shade:1}));const T=os(21),A=new vt,I=(B,V,q,Q)=>{for(let X=0;X<B;){const Y=e.center[0]+(T()-.5)*V*2,j=e.center[1]+(T()-.5)*V*2,se=x.distanceAt(Y,j);se<q||se>V*.7||T()>1.2-se/(V*.7)||(A.position.set(Y,x.heightAt(Y,j)-.15,j),A.rotation.set(0,T()*6.28,0),Q(X++))}},N=new ln(LM(n),new Cn({color:5928e3}),170);N.count=Math.round(170*i),I(N.count,420,e.half+8,B=>{A.scale.setScalar(.6+T()*.9),A.updateMatrix(),N.setMatrixAt(B,A.matrix)}),N.castShadow=!0;const U=new ln(new Vs(1,n?6:5,n?4:3),new Cn,1e3);U.count=Math.round(1e3*i),I(U.count,380,e.half+7,B=>{const V=.5+T()*1.1;A.scale.set(V,V*(.45+T()*.4),V),A.updateMatrix(),U.setMatrixAt(B,A.matrix),U.setColorAt(B,T()<.6?y.setHSL(.1+T()*.03,.5,.2+T()*.1):y.setHSL(.2+T()*.08,.3,.07+T()*.06))});const P=new ln(new tc(1,0),new Cn({flatShading:!0}),260);return P.count=Math.round(260*i),I(P.count,420,e.half+7.5,B=>{A.rotation.set(T()*3,T()*6.28,T()*3),A.scale.set(.5+T()*2.6,.4+T()*1.4,.5+T()*2.6),A.updateMatrix(),P.setMatrixAt(B,A.matrix),P.setColorAt(B,y.setHSL(.04+T()*.04,.4,.2+T()*.14))}),P.castShadow=!0,s.add(N,U,P),s.add(dc(e,0,15855078,1118481)),{sun:l,shadowRange:60,rays:a}}},Nl={puna:xd,neon:PM,cinta:CM},IM=["Vale","Tino","Maxi","Sofi","Nacho","Lu"],ch=["Rayo","Tuerca","Nafta","Pistón","Bujía","Llanta","Cardán"],NM=[8011728,4176080],DM=6,Ui=8,UM=30,FM=80,_a=-14,_t=new URLSearchParams(location.search);var fh;const is=(fh=_t.get("t"))!=null?fh:"puna",cr=Math.max(1,Math.min(9,Math.round(Number(_t.get("vueltas")))||3));var ph;const Ft=(ph=Nl[is])!=null?ph:xd,Is=_t.has("time")?Number(_t.get("time")):null;var mh;const fr=(mh=_t.get("cam"))!=null?mh:"chase",Sn=_t.get("q")!=="bajo",uh=_t.has("demo")||Is!==null,Dl=new URLSearchParams(location.hash.slice(1)),vd=Dl.get("s"),ui=vd!==null;document.querySelectorAll("#pick a").forEach(s=>{s.id==="cam"?s.href=`?t=${is}&cam=${fr==="tv"?"chase":"tv"}`:s.getAttribute("href")===`?t=${is}`&&s.classList.add("on")});(Is!==null||ui)&&(document.getElementById("pick").style.display="none");const Qn=new Set;addEventListener("keydown",s=>Qn.add(s.code));addEventListener("keyup",s=>Qn.delete(s.code));function hh(s){try{return sessionStorage.getItem(`carrera.${s}`)}catch{return null}}function dh(s,e){try{sessionStorage.setItem(`carrera.${s}`,e)}catch{}}function OM(s,e){var t,n;try{return(n=JSON.parse((t=localStorage.getItem(`carrera.${s}`))!=null?t:"null"))!=null?n:e}catch{return e}}function BM(s,e){try{localStorage.setItem(`carrera.${s}`,JSON.stringify(e))}catch{}}async function zM(){var _e,te,xe,ye,re,Fe,Ce,bt,mt,mn,_n;const s=Number(hh(`nitidez.${is}`))||1/0,e=_t.has("px")?Number(_t.get("px")):Math.min(devicePixelRatio,1.5,s),[t]=await Promise.all([Qv(Sn),document.fonts.load("800 64px Archivo"),document.fonts.load('500 16px "Geist Mono"')]);!Sn&&_t.get("salida")!=="srgb"&&(et.colorspace_pars_fragment=et.colorspace_pars_fragment.replace(/vec4 sRGBTransferOETF[^}]*\}/,"vec4 sRGBTransferOETF( in vec4 value ) { return vec4( sqrt( value.rgb * 1.12 ), value.a ); }"));const n=new Wx({canvas:document.getElementById("view"),antialias:_t.get("aa")==="1",precision:_t.get("prec")==="media"?"mediump":"highp",powerPreference:"high-performance"});n.setPixelRatio(e),n.setSize(innerWidth,innerHeight,!1),n.toneMappingExposure=Ft.exposure;{const ne=n.getContext(),de=ne.getExtension("WEBGL_debug_renderer_info");console.info(`carrera: ${ne.getParameter(ne.VERSION)} · ${de?ne.getParameter(de.UNMASKED_RENDERER_WEBGL):"gpu sin nombre"} · ${innerWidth}x${innerHeight} · calidad ${Sn?"alta":"baja"}`)}const i=new zh,r=new dn(60,innerWidth/innerHeight,.3,6e3),a=uM(Ft.layout,Ft.half),o=Ft.build({scene:i,track:a,anisotropy:Math.min(Sn?8:2,n.capabilities.getMaxAnisotropy()),fine:Sn}),l=new vt,c=new vt;Lt(a,Ft.start,0,l),l.position.y+=1.6,i.traverse(ne=>{ne.name==="sky"&&ne.position.copy(l.position)});const u=new Al(n),h=u.fromScene(i,0,.3,5e3,{position:l.position});u.dispose();const d=Sn?null:Jv(n,h.texture,(_e=Ft.night)!=null?_e:!1);Sn?i.environment=h.texture:h.dispose(),_t.get("niebla")==="0"&&(i.fog=null),_t.get("salida")==="lineal"&&(n.outputColorSpace=pn),!Sn&&_t.get("luz")!=="viva"&&Zx(i);const f=Is!==null||_t.get("sonido")==="0"?null:Qx();_t.has("dbg")&&(window.dbg={scene:i,renderer:n,sound:f});const p={length:a.length,half:a.half,wall:Ft.wall,curvature:ne=>fM(a,ne)},_=[...Ft.cars,...NM.map((ne,de)=>({...Ft.cars[de],paint:ne}))];let g=[];const m=ne=>{var de;return _[(de=g[ne])!=null?de:ne%_.length]},S=new Set(((te=_t.get("sin"))!=null?te:"").split(",")),w=d?new cM(t,d,(xe=Ft.night)!=null?xe:!1,_.some(ne=>ne.underglow!==void 0),8):null;w&&i.add(w.group);const M=_t.get("hud")!=="0",b=[];let y=-1;const R=[];let x=[],T=[],A,I=null;function N(ne,de,We=ne.map((ae,Re)=>Re%_.length),je=ne.map((ae,Re)=>Re%t.length)){var ae;for(x=ne,T=de,g=We,S.has("modelos")&&(je=je.map(()=>0)),A=new Xx(p,cr,x.map(Re=>Re===null));b.length>x.length;)i.remove(b.pop());x.forEach((Re,Ne)=>{var At,qt;((At=b[Ne])==null?void 0:At.userData.model)!==je[Ne]&&(b[Ne]&&i.remove(b[Ne]),b[Ne]=jv(t[je[Ne]][0],m(Ne),Sn,(qt=Ft.night)!=null?qt:!1,w!==null,je[Ne]),i.add(b[Ne]))}),b.forEach((Re,Ne)=>tM(Re,m(Ne)));for(const Re of R.splice(0))Re.removeFromParent(),(ae=Re.material.map)==null||ae.dispose(),Re.material.dispose();x.forEach((Re,Ne)=>{if(Re===null)return;const At=eM(T[Ne],m(Ne).paint);b[Ne].add(At),R.push(At)}),I=M?rv({track:Ft.name,laps:cr,cinta:Ft.trail===void 0,players:x.map((Re,Ne)=>({name:T[Ne],paint:m(Ne).paint}))}):null}N(Ft.cars.map((ne,de)=>uh||ui||de>0?null:0),ui?ch:IM);const U=Ft.spray?new zo({...Ft.spray,life:.9,rise:1.2},480):null,P=new zo({color:16756832,opacity:1,size:.5,additive:!0,life:.45,rise:-14},240);P.points.material.uniforms.color.value.multiplyScalar(6),i.add(P.points),U&&i.add(U.points);const B=new zo({color:Ft.night?10135236:15130838,opacity:Ft.night?.13:.15,size:2.6,additive:!1,life:.7,rise:1.6},320);i.add(B.points);const V=S.has("marcas")?null:new Jx;V&&i.add(V.mesh),w&&(w.trails=!S.has("estela"));const q=new L,Q=Sn?o.sun:void 0,X=(ye=o.shadowRange)!=null?ye:45;Q&&(n.shadowMap.enabled=!0,n.shadowMap.type=pr,Q.castShadow=!0,Q.shadow.mapSize.set(2048,2048),Q.shadow.camera.left=Q.shadow.camera.bottom=-X,Q.shadow.camera.right=Q.shadow.camera.top=X,Q.shadow.camera.near=10,Q.shadow.camera.far=700,Q.shadow.bias=-4e-4,Q.shadow.normalBias=.04,i.add(Q.target),i.traverse(ne=>{const de=ne;de.isMesh&&!de.material.transparent&&ne.name!=="sky"&&(de.receiveShadow=!0)}));const Y=Q?Q.position.clone().normalize():null;if(Sn){const{mirror:ne}=await bc(async()=>{const{mirror:We}=await import("./mirror-DC36xRfT.js");return{mirror:We}},__vite__mapDeps([0,1]),import.meta.url),de=n.getDrawingBufferSize(new Be).multiplyScalar(.5).floor();for(const{flat:We,y:je,look:ae}of(re=o.mirrors)!=null?re:[])i.add(ne(We,je,de,{...ae,fog:i.fog}))}const j=Sn?(await bc(async()=>{const{buildComposer:ne}=await import("./fx-jxpsInfS.js");return{buildComposer:ne}},__vite__mapDeps([2,1]),import.meta.url)).buildComposer(n,i,r,Ft.grade,o.rays):null;j||(n.toneMapping=_t.get("tone")==="aces"?Bl:_t.get("tone")==="no"?Hn:Ol);const se=40,Z=Ft.trail===void 0?null:new Ve(new ft,new Mt({color:Ft.trail,fog:!1,side:Wt}));if(Z){Z.geometry.setAttribute("position",new xt(new Float32Array((se+1)*6),3));const ne=[];for(let de=0;de<se;de++)ne.push(de*2,de*2+1,de*2+2,de*2+1,de*2+3,de*2+2);Z.geometry.setIndex(ne),Z.frustumCulled=!1,i.add(Z)}const ue=[];i.traverse(ne=>{ne.name==="sky"&&ue.push(ne)});let oe=0,fe=_a,H=0,K=0,pe=60,ze=0,he=!0;const Ge=new L;let Te=ui?"lobby":"countdown",ke=[],$e=[],st=0,Ye=0,lt=0;const ut=[],Nt=ui?ov((Fe=Dl.get("qr"))!=null?Fe:""):null,ht=new Map(((Ce=_t.get("autos"))!=null?Ce:"").split("-").filter(Boolean).map(ne=>ne.split(".").map(Number)));let St=Math.min(Ui-1,Math.max(0,Number((bt=_t.get("bots"))!=null?bt:2)||0));const O=ne=>{var de,We,je;return(je=(We=_[(de=ht.get(ne))!=null?de:-1])==null?void 0:We.paint)!=null?je:7039074},Ht=new Map(((mt=_t.get("modelos"))!=null?mt:"").split("-").filter(Boolean).map(ne=>ne.split(".").map(Number))),pt=ne=>{var de;return Math.min(t.length-1,(de=Ht.get(ne))!=null?de:0)};let C=(ne=>{var de;return ne&&!Do(ne)?ne:pa((de=ne==null?void 0:ne.rounds)!=null?de:3)})(JSON.parse((mn=hh("copa"))!=null?mn:"null"));const v=ne=>dh("copa",JSON.stringify(C=ne)),z=`records-1.${Ft.name}.${cr}`;let W=OM(z,{lap:null,race:null}),J={byLap:null,byRace:null};function ce(){var We,je;if(!le)return;const ne=(je=(We=le.seats.find(ae=>ae.id===le.lead))==null?void 0:We.name)!=null?je:null;le.share({phase:Te,track:Ft.name,laps:cr,bots:St,room:Ui-Math.min(Ui,le.seats.filter(ae=>ae.on).length),lead:le.lead,results:ke,cup:C,record:{...W,...J},secure:Number(Dl.get("tls"))||0,players:le.seats.map(ae=>({id:ae.id,name:ae.name,paint:O(ae.id),model:pt(ae.id),on:ae.on})),cars:x.map((ae,Re)=>({id:ae,name:T[Re],look:g[Re],model:b[Re].userData.model})),racing:Te==="lobby"?[]:x.filter(ae=>ae!==null)});const de=Te==="lobby"||Te==="results";if(I==null||I.show(!de),!de)return Nt==null?void 0:Nt.hide();Nt==null||Nt.show({track:Ft.name,laps:cr,lead:ne,bots:x.filter(ae=>ae===null).length,players:le.seats.map(ae=>({name:ae.name,paint:O(ae.id),on:ae.on})),results:Te==="results"?ke.map((ae,Re)=>{var Ne,At;return{name:ae.name,time:ae.time,best:ae.best,paint:$e[Re],record:ae.id!==null&&ae.id===J.byLap,gain:C.rounds>1&&ae.id!==null&&(At=(Ne=C.table.find(qt=>qt.id===ae.id))==null?void 0:Ne.last)!=null?At:null}}):null,cup:C.rounds>1?{rounds:C.rounds,done:C.done,over:Do(C),table:C.table.map(ae=>({name:ae.name,points:ae.points,paint:O(ae.id)}))}:null,points:le.seats.map(ae=>{var Re,Ne;return C.rounds>1&&C.done>0?(Ne=(Re=C.table.find(At=>At.id===ae.id))==null?void 0:Re.points)!=null?Ne:0:null}),record:W.lap})}function me(){const ne=le.seats.filter(ae=>ae.on).slice(0,Ui),de=ne.length?Math.min(St,Ui-ne.length):DM,We=_.map((ae,Re)=>Re),je=ae=>We.splice(Math.max(0,We.indexOf(ae!=null?ae:-1)),1)[0];for(const ae of ne)ht.set(ae.id,je(ht.get(ae.id)));N([...ne.map(ae=>ae.id),...Array(de).fill(null)],[...ne.map(ae=>ae.name),...ch.slice(0,de)],[...ne.map(ae=>ht.get(ae.id)),...Array.from({length:de},()=>je())],[...ne.map(ae=>pt(ae.id)),...Array.from({length:de},(ae,Re)=>Re%t.length)]),he=!0}function ee(){Te==="lobby"&&(Te="countdown",ke=[],st=0,he=!0,A.start(),ce())}function ie(){Te="lobby",ke=[],J={byLap:null,byRace:null},Do(C)&&v(pa(C.rounds)),me(),ce()}function ve(ne,de){var Re;const We=le.seats.filter(Ne=>Ne.on).slice(0,Ui);if(Te!=="lobby"||!We.some(Ne=>Ne.id===ne))return;const je=new Set(We.filter(Ne=>Ne.id!==ne).map(Ne=>ht.get(Ne.id)));let ae=(Re=ht.get(ne))!=null?Re:0;do ae=(ae+de+_.length)%_.length;while(je.has(ae));ht.set(ne,ae),me(),ce()}function De(ne){if(Te!=="lobby"&&Te!=="results")return;const de=Object.keys(Nl);_t.set("bots",String(St)),_t.set("autos",[...ht].map(([We,je])=>`${We}.${je}`).join("-")),_t.set("modelos",[...Ht].map(([We,je])=>`${We}.${je}`).join("-")),_t.set("t",de[(de.indexOf(Nl[is]?is:"puna")+ne+de.length)%de.length]),location.replace(`?${_t.toString()}${location.hash}`)}function Me(ne){if(ne.a==="track")De(ne.d);else if(ne.a==="bots"){if(Te!=="lobby")return;const de=Ui-Math.min(Ui,le.seats.filter(We=>We.on).length);St=Math.max(0,Math.min(de,St)+(ne.d===-1?-1:1)),St=Math.min(de,St),me(),ce()}else if(ne.a==="rounds"){if(Te!=="lobby"||C.done>0)return;const de=Math.max(0,No.indexOf(C.rounds))+(ne.d===-1?-1:1);v(pa(No[Math.max(0,Math.min(No.length-1,de))])),ce()}else if(ne.a==="cup"){if(Te!=="lobby")return;v(pa(C.rounds)),ce()}else ne.a==="start"?ee():Te==="results"&&ie()}const le=ui?new lv(vd,{roster(){Te==="lobby"?me():x.forEach((ne,de)=>{A.cars[de].bot=ne===null||!le.seats.some(We=>We.id===ne&&We.on)}),ce()},command(ne,de){if(de.a==="car")ve(ne,de.d===-1?-1:1);else if(de.a==="model"){if(Te!=="lobby")return;Ht.set(ne,(pt(ne)+(de.d===-1?-1:1)+t.length)%t.length),me(),ce()}else ne===le.lead&&Me(de)}}):null;if(ui){const ne=de=>{f==null||f.wake(),de==="left"||de==="right"?De(de==="left"?-1:1):de==="ok"&&Me(Te==="lobby"?{a:"start"}:{a:"lobby"})};window.carreraKey=ne,addEventListener("keydown",de=>ne(de.code==="ArrowLeft"?"left":de.code==="ArrowRight"?"right":de.code==="Enter"||de.code==="NumpadEnter"?"ok":"")),ce()}function Ue(ne,de,We){var je;for(const ae of ne)ae.type==="finish"&&st===0&&(st=A.clock),ae.type==="tow"&&(ut[ae.car]=.7),(ae.type==="wall"||ae.type==="hit")&&(ut[ae.car]=Math.max((je=ut[ae.car])!=null?je:0,Math.min(1,ae.force)));if(Te==="countdown"&&A.phase!=="countdown"&&(Te="race"),Te==="race"){const ae=x.every((Re,Ne)=>Re===null||A.cars[Ne].bot||A.cars[Ne].finished!==null);if((A.phase==="done"||st>0&&A.clock-st>(ae?3:UM))&&(Te="results",ke=de.map(Re=>({id:x[Re],name:T[Re],time:A.cars[Re].finished,best:A.cars[Re].best})),$e=de.map(Re=>m(Re).paint),ke.some(Re=>Re.id!==null))){const Re=iv(W,ke);J={byLap:Re.lap,byRace:Re.race},(J.byLap!==null||J.byRace!==null)&&BM(z,W=Re.records),C.rounds>1&&v(nv(C,ke))}}ce(),lt+=We,lt>=.05&&Te!=="lobby"&&(lt=0,le.stream(jx({clock:A.clock,cars:A.cars.map(ae=>({s:ae.s,d:ae.d,heading:ae.yaw+ae.slip,steer:ae.steer-ae.slip*1.5,v:ae.v,boosting:ae.boosting,braking:ae.braking,drifting:ae.drifting,offTrack:ae.offTrack}))}))),Ye+=We,!(Ye<.1||Te==="lobby")&&(Ye=0,x.forEach((ae,Re)=>{var At;if(ae===null||A.cars[Re].bot)return;const Ne=A.cars[Re];le.tell(ae,{place:de.indexOf(Re)+1,of:x.length,lap:Ne.lap,nitro:Math.round(Ne.nitro*100)/100,speed:Math.round(Ne.v*3.6),off:Ne.offTrack,plus:Ne.draft>.5?"rebufo":Ne.flow>=1?"ritmo":"",buzz:(At=ut[Re])!=null?At:0}),ut[Re]=0}))}function Xe(ne,de){for(const We of ne){if(We.type!=="wall"&&We.type!=="hit")continue;const je=A.cars[We.car],ae=We.type==="wall"?Math.sign(je.d):Math.sign(A.cars[We.other].d-je.d)||1;Lt(a,je.s,je.d+ae*1.05,l);for(let Re=0;Re<6+We.force*22;Re++)P.emit(Ge.copy(l.position).setY(l.position.y+.35),0,3+We.force*4,0,7+We.force*8);We.type==="hit"&&We.other===de&&(oe=Math.max(oe,.25+We.force*.6))}}function Ze(ne,de=!0){if(le)x.forEach((Pe,ct)=>{Pe!==null&&!A.cars[ct].bot&&Object.assign(A.inputs[ct],le.input(Pe))});else if(!uh){const Pe=A.inputs[0];Pe.steer=(Qn.has("ArrowLeft")?1:0)-(Qn.has("ArrowRight")?1:0),Pe.brake=Qn.has("ArrowDown")||Qn.has("Space"),Pe.nitro=Qn.has("ArrowUp")||Qn.has("ShiftLeft"),Pe.drift=Qn.has("KeyX")||Qn.has("ControlLeft")}let We=x.map((Pe,ct)=>Pe!==null&&!A.cars[ct].bot?ct:-1).filter(Pe=>Pe>=0);We.length||(We=[A.order()[Math.min(1,x.length-1)]]);const je=A.advance(ne),ae=A.order(),Re=Math.max(...We.map(Pe=>A.cars[Pe].s)),Ne=We.filter(Pe=>A.cars[Pe].s>=Re-FM),At=Math.min(...Ne.map(Pe=>A.cars[Pe].s)),qt=Ne.reduce((Pe,ct)=>A.cars[ct].s>A.cars[Pe].s?ct:Pe);for(const Pe of je)(Pe.type==="wall"||Pe.type==="hit")&&Ne.includes(Pe.car)&&(oe=Math.max(oe,.25+Pe.force*.6));Xe(je,qt);for(const Pe of je)Pe.type==="tow"&&(b[Pe.car].userData.blink=1.4);if(le&&Ue(je,ae,ne),f){for(const ct of je)ct.type==="tow"?f.tow():ct.type==="wall"&&Ne.includes(ct.car)||ct.type==="hit"&&(Ne.includes(ct.car)||Ne.includes(ct.other))?f.crash(ct.force):ct.type==="lap"&&Ne.includes(ct.car)?f.lap():ct.type==="finish"&&We.includes(ct.car)&&f.finish();const Pe=A.phase==="countdown"?Math.ceil(-A.clock):A.phase==="race"?0:-1;Pe!==y&&(Pe>0?f.count(!1):Pe===0&&y>0&&f.count(!0),y=Pe),f.update(Ne.map(ct=>A.cars[ct]),ne,A.phase==="countdown"||A.phase==="race")}ze+=ne,b.forEach((Pe,ct)=>{var Ys;const dt=A.cars[ct],Or=Pe.userData.blink=Math.max(0,((Ys=Pe.userData.blink)!=null?Ys:0)-ne);Pe.visible=Or<=0||Math.floor(Or*9)%2===0,Lt(a,dt.s,dt.d,Pe),Pe.rotateY(dt.yaw+dt.slip),nM(Pe,{metres:dt.s,steer:dt.steer-dt.slip*1.5,speed:dt.v,boosting:dt.boosting,braking:dt.braking,time:ze,rough:dt.offTrack}),U&&dt.v>12&&Math.random()<(dt.offTrack?1:dt.v/140)&&(Lt(a,dt.s-1.9,dt.d+(Math.random()<.5?-.85:.85),l),U.emit(Ge.copy(l.position).setY(l.position.y+.15),0,.6,0,dt.offTrack?3:1.4));const qa=!dt.offTrack&&(dt.drifting||dt.braking&&dt.v>25);if([-.85,.85].forEach((E,D)=>{if(V){if(!qa)return V.lay(ct*2+D,null);Lt(a,dt.s-1.7,dt.d+E-Math.sin(dt.slip)*1.7,l),V.lay(ct*2+D,Ge.copy(l.position).setY(l.position.y+.03),q.set(1,0,0).applyQuaternion(l.quaternion))}}),dt.drifting)for(const E of[-.85,.85])Math.random()>ne*26*Math.min(1,Math.abs(dt.slip)*4)||(Lt(a,dt.s-1.7,dt.d+E-Math.sin(dt.slip)*1.7,l),B.emit(Ge.copy(l.position).setY(l.position.y+.2),0,.8,0,1.2))}),B.update(ne),U==null||U.update(ne),P.update(ne);const Mi=A.cars[ae[0]],Si=A.cars[qt];if(Z){const Pe=Z.geometry.attributes.position;for(let ct=0;ct<=se;ct++)for(const dt of[0,1])Lt(a,Mi.s-2.2-ct*2,Mi.d+(dt?-1.1:1.1),l),Pe.setXYZ(ct*2+dt,l.position.x,l.position.y+.035,l.position.z);Pe.needsUpdate=!0}const xn=Is!==null||he;he=!1;const ii=Math.min(1,ne*6),Zt=Ne.reduce((Pe,ct)=>Pe+A.cars[ct].d,0)/Ne.length;if(fe+=((Te==="lobby"?_a:At)-fe)*(xn?1:Math.min(1,ne*10)),H+=(Zt-H)*(xn?1:ii),K+=(Re-At-K)*(xn?1:Math.min(1,ne*2.5)),pe+=((Te==="lobby"?44:fr==="tv"?30:fr==="foto"?38:58+Si.v/Ji.topSpeed*8+(Si.boosting?7:0))-pe)*(xn?1:ii),oe=Math.max(0,oe-ne*1.8),Te==="lobby"){const Pe=ze*.11;Lt(a,_a+Math.cos(Pe)*17,Math.sin(Pe)*(a.half-1.6),l),Lt(a,_a,0,c),r.position.copy(l.position).add(new L(0,2+Math.sin(Pe*.7)*.5,0)),r.lookAt(c.position.x,c.position.y+.6,c.position.z)}else fr==="tv"?(Lt(a,fe+44,-a.half+.6,l),r.position.copy(l.position).add(new L(0,6.2,0)),r.lookAt(b[qt].position)):fr==="foto"?(Lt(a,fe-5.2,H-4.4,l),r.position.copy(l.position).add(new L(0,1.25,0)),r.lookAt(b[qt].position.x,b[qt].position.y+.6,b[qt].position.z)):(Lt(a,fe-7.4-K*.3,H*.85,l),Lt(a,fe+K*.6+18,H*.35,c),r.position.copy(l.position).add(new L((Math.random()-.5)*oe*.5,2.25+K*.2+(Math.random()-.5)*oe*.5,0)),r.lookAt(c.position.x,c.position.y+.8,c.position.z));r.fov=pe,ui&&(Te==="lobby"||Te==="results")?r.setViewOffset(innerWidth,innerHeight,-innerHeight*.23,0,innerWidth,innerHeight):r.view&&r.clearViewOffset(),r.updateProjectionMatrix(),Q&&Y&&(Lt(a,fe+14,0,l),Q.target.position.copy(l.position),Q.position.copy(l.position).addScaledVector(Y,300));for(const Pe of ue)Pe.position.copy(r.position);I==null||I.update({order:ae,lap:Si.lap,clock:A.clock,done:A.phase==="done",gap:A.cars.map(Pe=>(Mi.s-Pe.s)/Math.max(20,Pe.v)),nitro:A.cars.map(Pe=>Pe.nitro)}),de&&(r.updateMatrixWorld(),w==null||w.sync(b,r),j?j.render():n.render(i,r))}function F(){n.setSize(innerWidth,innerHeight,!1),j==null||j.setSize(innerWidth,innerHeight),r.aspect=innerWidth/innerHeight}if(addEventListener("resize",F),F(),n.domElement.addEventListener("webglcontextlost",ne=>{ne.preventDefault(),setTimeout(()=>location.reload(),500)}),ui||A.start(),Is!==null){A.advance(0);for(let ne=-3;ne<Is-1;ne+=1/60)A.advance(1/60);n.info.autoReset=!1;for(let ne=0;ne<60;ne++)Ze(1/60,ne===59);document.title=`listo ${n.info.render.calls} ${n.info.render.triangles}`}else{const ne=_t.has("fps")?document.body.appendChild(Object.assign(document.createElement("div"),{id:"fps"})):null;let de=performance.now(),We=0,je=de,ae=e,Re=!1,Ne=0;const At=new Set(((_n=_t.get("sin"))!=null?_n:"").split(","));if(At.size>1||!At.has(""))for(const Zt of i.children){const yi=Zt===(w==null?void 0:w.group)||b.includes(Zt)?"autos":Zt.name==="sky"?"cielo":Zt.isLight?"luz":"mundo";At.has(yi)&&(Zt.visible=!1)}const qt=n.getContext(),Mi=new Uint8Array(4),Si=_t.has("fin");let xn=0,ii=0;n.setAnimationLoop(()=>{const Zt=performance.now();Ze(Math.min(.1,(Zt-de)/1e3)),de=Zt;const yi=performance.now();if(Si&&qt.readPixels(0,0,1,1,qt.RGBA,qt.UNSIGNED_BYTE,Mi),xn+=yi-Zt,ii+=performance.now()-yi,++We<90)return;const Pe=We*1e3/(Zt-je);We=0,je=Zt,Ne=Re&&Pe<(ae>1?56:48)?Ne+1:0,!Sn&&!_t.has("px")&&Ne>=2&&ae>.75&&(ae=Math.max(.75,ae-.25),n.setPixelRatio(ae),F(),Ne=0,dh(`nitidez.${is}`,String(ae))),Re=!0,ne&&(ne.textContent=`${Pe.toFixed(0)} FPS · ${Math.round(ae*100)}% · ${n.info.render.triangles} TRI · ${n.info.render.calls} DIB · cpu ${(xn/90).toFixed(1)} · gpu ${(ii/90).toFixed(1)}`),xn=ii=0})}}zM();export{zn as A,Zd as B,ge as C,Wt as D,as as E,Ln as F,kn as H,Yt as L,Ve as M,Bi as N,Ur as O,Fi as P,Ul as R,Gn as S,Kt as T,ap as U,L as V,Nn as W,Je as a,Ct as b,yn as c,Be as d,It as e,Cr as f,ns as g,Sr as h,jh as i,zh as j,jn as k,fn as l,Hi as m,pn as n,fi as o,dn as p,Xt as q,Go as r,bn as s,ft as t,xt as u};
