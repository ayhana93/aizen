"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getHeat } from "@/lib/heat";

/* ---------------------------------------------------------------- shaders */

const noiseGLSL = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
`;

const billetVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec2 vUvC;
  void main(){
    vUvC = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * Brushed aluminium that turns into glowing metal. The colour ramp walks the
 * blackbody curve — dull red, orange, then the white-yellow of the melt —
 * because that is what the alloy actually does between 20 °C and 720 °C.
 */
const billetFragment = /* glsl */ `
  uniform float uHeat;
  uniform float uTime;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec2 vUvC;
  ${noiseGLSL}

  void main(){
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

    // brushed finish: fine streaks running around the billet
    float streak = fbm(vec2(vUvC.x * 260.0, vUvC.y * 2.5));
    float aniso = 0.78 + 0.44 * streak;

    vec3 L1 = normalize(vec3(0.55, 0.85, 0.6));
    vec3 L2 = normalize(vec3(-0.8, 0.15, -0.35));
    float d1 = max(dot(N, L1), 0.0);
    float d2 = max(dot(N, L2), 0.0);
    float spec = pow(max(dot(reflect(-L1, N), V), 0.0), 46.0) * aniso;

    vec3 alu = vec3(0.60, 0.645, 0.695);
    vec3 base = alu * (0.07 + 0.72 * d1 + 0.22 * d2) + spec * 1.15 + fres * 0.18;
    base *= aniso;

    // molten turbulence crawling along the surface, hottest in the middle
    float t = uTime * 0.22;
    float m = fbm(vec2(vUvC.x * 11.0 + t, vUvC.y * 5.5 - t * 0.55));
    float along = smoothstep(0.0, 0.30, vUvC.y) * smoothstep(1.0, 0.70, vUvC.y);
    float heat = clamp(uHeat * mix(0.45, 1.05, along) * (0.55 + 0.8 * m), 0.0, 1.0);

    vec3 hot = mix(vec3(0.32, 0.02, 0.0), vec3(1.0, 0.26, 0.02), smoothstep(0.0, 0.42, heat));
    hot = mix(hot, vec3(1.0, 0.60, 0.14), smoothstep(0.36, 0.72, heat));
    hot = mix(hot, vec3(1.0, 0.93, 0.74), smoothstep(0.76, 1.0, heat));

    // glow is added, not blended: cold shadow stays dark next to white-hot metal
    float e = smoothstep(0.02, 0.9, heat);
    vec3 col = base * (1.0 - 0.45 * e) + hot * e * 1.45;
    col += hot * fres * e * 0.5;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const glowFragment = /* glsl */ `
  uniform float uHeat;
  varying vec2 vUvG;
  void main(){
    float d = length(vUvG - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 3.4) * uHeat * 0.85;
    vec3 c = mix(vec3(1.0, 0.36, 0.06), vec3(1.0, 0.72, 0.28), uHeat);
    gl_FragColor = vec4(c * a, a);
  }
`;

const glowVertex = /* glsl */ `
  varying vec2 vUvG;
  void main(){
    vUvG = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const emberVertex = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  void main(){
    float life = fract(uTime * (0.06 + aSeed * 0.12) + aSeed);
    vec3 p = position;
    p.y += life * 6.4;
    p.x += sin((life + aSeed) * 6.2831) * 0.5;
    p.z += cos((life * 1.7 + aSeed) * 6.2831) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float fade = smoothstep(1.0, 0.15, life) * smoothstep(0.0, 0.12, life);
    vAlpha = fade * uHeat * 0.9;
    gl_PointSize = (9.0 + aSeed * 14.0) * uPixelRatio * (6.0 / -mv.z);
  }
`;

const emberFragment = /* glsl */ `
  varying float vAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.0) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(vec3(1.0, 0.45, 0.1), vec3(1.0, 0.88, 0.6), a), a);
  }
`;

/* ---------------------------------------------------------------- objects */

function Billet({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({ uHeat: { value: getHeat() }, uTime: { value: 0 } }),
    [],
  );
  const glowUniforms = useMemo(() => ({ uHeat: { value: getHeat() } }), []);

  const narrow = size.width < 900;

  useFrame((state, delta) => {
    const h = getHeat();
    uniforms.uHeat.value += (h - uniforms.uHeat.value) * Math.min(1, delta * 3.2);
    glowUniforms.uHeat.value = uniforms.uHeat.value;
    if (!reduced) {
      uniforms.uTime.value = state.clock.elapsedTime;
      if (mesh.current) mesh.current.rotation.y += delta * 0.22;
    }
    if (group.current) {
      const p = state.pointer;
      const target = narrow ? 0 : 0.16;
      group.current.rotation.x += (p.y * 0.12 - group.current.rotation.x) * 0.04;
      group.current.rotation.z +=
        (Math.PI / 2 - 0.22 + p.x * 0.05 - group.current.rotation.z) * 0.05;
      const lift = 0.35 + uniforms.uHeat.value * 0.25;
      group.current.position.y += (lift - group.current.position.y) * 0.05;
    }
  });

  const scale = narrow ? 0.34 : 0.78;

  return (
    <group
      ref={group}
      position={narrow ? [viewport.width * 0.24, -viewport.height * 0.3, -0.6] : [viewport.width * 0.29, -0.05, -0.6]}
      rotation={[0, 0, Math.PI / 2 - 0.22]}
      scale={scale}
    >
      <mesh ref={mesh}>
        <cylinderGeometry args={[0.72, 0.72, 3.9, 96, 1, false]} />
        <shaderMaterial
          vertexShader={billetVertex}
          fragmentShader={billetFragment}
          uniforms={uniforms}
        />
      </mesh>
      {/* heat bleeding into the air around the billet */}
      <mesh rotation={[0, 0, -Math.PI / 2]} position={[0, 0, -1.1]} scale={[7.5, 7.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Embers({ count = 240, reduced }: { count?: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const { viewport, size } = useThree();
  const narrow = size.width < 900;

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.4;
      positions[i * 3 + 1] = -2.6 - Math.random() * 1.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeat: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uHeat.value = getHeat() * 0.9;
    uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 2);
    if (!reduced) uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={points} position={narrow ? [viewport.width * 0.24, -viewport.height * 0.3, 0.2] : [viewport.width * 0.29, -0.05, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={emberVertex}
        fragmentShader={emberFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------------------------------------------------------- canvas */

function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Scene() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setOk(hasWebGL());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (ok === null) return <div className="scene-fallback" aria-hidden />;
  if (!ok) return <div className="scene-fallback" aria-hidden />;

  return (
    <div className="scene" aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 7.2], fov: 38 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <Billet reduced={reduced} />
        <Embers reduced={reduced} />
      </Canvas>
    </div>
  );
}
