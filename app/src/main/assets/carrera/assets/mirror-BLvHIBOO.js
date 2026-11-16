import{M as T,C,a as _,W as H,H as V,S as B,U as I,V as v,P as E,b as U,D as X,A as q}from"./index-K2fgb6Hc.js";import"./link-BPBa3GBK.js";class W extends T{constructor(D,i={}){super(D),this.isReflector=!0,this.type="Reflector",this.forceUpdate=!1,this._reflectionCameras=new WeakMap;const r=this,s=i.color!==void 0?new C(i.color):new C(8355711),n=i.textureWidth||512,b=i.textureHeight||512,P=i.clipBias||0,p=i.shader||W.ReflectorShader,F=i.multisample!==void 0?i.multisample:4,m=new E,u=new v,d=new v,k=new v,g=new _,M=new v(0,0,-1),o=new U,x=new v,y=new v,l=new U,h=new _,w=new H(n,b,{samples:F,type:V}),S=new B({name:p.name!==void 0?p.name:"unspecified",uniforms:I.clone(p.uniforms),fragmentShader:p.fragmentShader,vertexShader:p.vertexShader});S.uniforms.tDiffuse.value=w.texture,S.uniforms.color.value=s,S.uniforms.textureMatrix.value=h,this.material=S,this.onBeforeRender=function(e,f,c){const a=this.getReflectionCamera(c);if(d.setFromMatrixPosition(r.matrixWorld),k.setFromMatrixPosition(c.matrixWorld),g.extractRotation(r.matrixWorld),u.set(0,0,1),u.applyMatrix4(g),x.subVectors(d,k),x.dot(u)>0===!0&&this.forceUpdate===!1)return;x.reflect(u).negate(),x.add(d),g.extractRotation(c.matrixWorld),M.set(0,0,-1),M.applyMatrix4(g),M.add(k),y.subVectors(d,M),y.reflect(u).negate(),y.add(d),a.position.copy(x),a.up.set(0,1,0),a.up.applyMatrix4(g),a.up.reflect(u),a.lookAt(y),a.far=c.far,a.updateMatrixWorld(),a.projectionMatrix.copy(c.projectionMatrix),h.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),h.multiply(a.projectionMatrix),h.multiply(a.matrixWorldInverse),h.multiply(r.matrixWorld),m.setFromNormalAndCoplanarPoint(u,d),m.applyMatrix4(a.matrixWorldInverse),o.set(m.normal.x,m.normal.y,m.normal.z,m.constant);const t=a.projectionMatrix;a.isOrthographicCamera?(l.x=(Math.sign(o.x)+t.elements[8])/t.elements[0],l.y=(Math.sign(o.y)+t.elements[9])/t.elements[5],l.z=-c.far,l.w=1):(l.x=(Math.sign(o.x)+t.elements[8])/t.elements[0],l.y=(Math.sign(o.y)+t.elements[9])/t.elements[5],l.z=-1,l.w=(1+t.elements[10])/t.elements[14]),o.multiplyScalar(2/o.dot(l)),t.elements[2]=o.x,t.elements[6]=o.y,a.isOrthographicCamera?(t.elements[10]=o.z-P,t.elements[14]=o.w-1):(t.elements[10]=o.z+1-P,t.elements[14]=o.w),r.visible=!1;const z=e.getRenderTarget(),A=e.xr.enabled,O=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(w),e.state.buffers.depth.setMask(!0),e.autoClear===!1&&e.clear(),e.render(f,a),e.xr.enabled=A,e.shadowMap.autoUpdate=O,e.setRenderTarget(z);const R=c.viewport;R!==void 0&&e.state.viewport(R),r.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return w},this.dispose=function(){w.dispose(),r.material.dispose()},this.getReflectionCamera=function(e){let f=this._reflectionCameras.get(e);return f===void 0&&(f=e.clone(),this._reflectionCameras.set(e,f)),f}}}W.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const G={name:"MirrorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},mask:{value:null},maskScale:{value:.06},masked:{value:0},strength:{value:.5},blur:{value:.03},fogDensity:{value:0}},vertexShader:`
    uniform mat4 textureMatrix;
    varying vec4 vMirror;
    varying vec3 vWorld;
    void main() {
      vMirror = textureMatrix * vec4(position, 1.0);
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }`,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform sampler2D mask;
    uniform float maskScale, masked, strength, blur, fogDensity;
    varying vec4 vMirror;
    varying vec3 vWorld;
    void main() {
      vec3 view = cameraPosition - vWorld;
      float dist = length(view);
      float rough = masked > 0.5 ? smoothstep(0.1, 0.3, texture2D(mask, vWorld.xz * maskScale).g) : 0.0;
      // El grano fino del piso corre el reflejo de lado a lado, como en el asfalto mojado.
      vec2 grain = masked > 0.5 ? texture2D(mask, vWorld.xz * maskScale * 9.0).rg - 0.5 : vec2(0.0);
      vec3 sum = vec3(0.0);
      for (int i = 0; i < 6; i++) {
        float t = float(i) / 5.0;
        vec4 at = vMirror;
        at.y += t * t * blur * (0.5 + rough) * at.w;
        at.x += grain.x * 0.012 * (0.3 + t) * at.w;
        sum += texture2DProj(tDiffuse, at).rgb * (1.0 - 0.6 * t);
      }
      // Cuanto más rasante la mirada, más espeja.
      float graze = 1.0 - clamp(view.y / dist, 0.0, 1.0);
      float amount = strength * mix(1.0, 0.22, rough) * (0.12 + 0.88 * pow(graze, 5.0));
      float clear = exp(-fogDensity * fogDensity * dist * dist);
      gl_FragColor = vec4(sum / 4.2 * amount * clear, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`};function K(j,D,i,r){var b;const s=new W(j.clone().rotateX(Math.PI/2),{textureWidth:i.x,textureHeight:i.y,shader:G,multisample:0,clipBias:.02});s.rotation.x=-Math.PI/2,s.position.y=D;const n=s.material;return n.side=X,n.transparent=!0,n.blending=q,n.depthWrite=!1,n.uniforms.strength.value=r.strength,n.uniforms.blur.value=r.blur,n.uniforms.fogDensity.value=r.fog.density,r.mask&&(n.uniforms.mask.value=r.mask,n.uniforms.maskScale.value=(b=r.maskScale)!=null?b:.06,n.uniforms.masked.value=1),s.name="mirror",s}export{K as mirror};
