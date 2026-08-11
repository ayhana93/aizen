"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getStage, stageWeights, startStageClock } from "@/lib/stage";

/* ------------------------------------------------------------------ shaders */

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

const metalVertex = /* glsl */ `
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

/** Brushed aluminium that also knows how to be molten. */
const metalFragment = /* glsl */ `
  uniform float uHeat;
  uniform float uTime;
  uniform float uFade;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec2 vUvC;
  ${noiseGLSL}

  void main(){
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

    float streak = fbm(vec2(vUvC.x * 260.0, vUvC.y * 2.5));
    float aniso = 0.78 + 0.44 * streak;

    vec3 L1 = normalize(vec3(0.55, 0.85, 0.6));
    vec3 L2 = normalize(vec3(-0.8, 0.15, -0.35));
    float d1 = max(dot(N, L1), 0.0);
    float d2 = max(dot(N, L2), 0.0);
    float spec = pow(max(dot(reflect(-L1, N), V), 0.0), 46.0) * aniso;

    vec3 alu = vec3(0.60, 0.645, 0.695);
    vec3 base = alu * (0.09 + 0.74 * d1 + 0.24 * d2) + spec * 1.2 + fres * 0.18;
    base *= aniso;

    float t = uTime * 0.22;
    float m = fbm(vec2(vUvC.x * 11.0 + t, vUvC.y * 5.5 - t * 0.55));
    float along = smoothstep(0.0, 0.28, vUvC.y) * smoothstep(1.0, 0.72, vUvC.y);
    float heat = clamp(uHeat * mix(0.5, 1.05, along) * (0.55 + 0.8 * m), 0.0, 1.0);

    vec3 hot = mix(vec3(0.32, 0.02, 0.0), vec3(1.0, 0.26, 0.02), smoothstep(0.0, 0.42, heat));
    hot = mix(hot, vec3(1.0, 0.60, 0.14), smoothstep(0.36, 0.72, heat));
    hot = mix(hot, vec3(1.0, 0.93, 0.74), smoothstep(0.76, 1.0, heat));

    float e = smoothstep(0.02, 0.9, heat);
    vec3 col = base * (1.0 - 0.45 * e) + hot * e * 1.18;
    col += hot * fres * e * 0.5;

    gl_FragColor = vec4(col, uFade);
    #include <colorspace_fragment>
  }
`;

/** The pouring stream: metal falling fast enough to blur into light. */
const streamFragment = /* glsl */ `
  uniform float uTime;
  uniform float uFade;
  varying vec2 vUvC;
  ${noiseGLSL}
  void main(){
    float flow = fbm(vec2(vUvC.x * 6.0, vUvC.y * 3.0 + uTime * 2.6));
    float core = smoothstep(0.0, 0.42, 1.0 - abs(vUvC.x - 0.5) * 2.0);
    vec3 c = mix(vec3(1.0, 0.30, 0.02), vec3(1.0, 0.93, 0.74), pow(core, 0.7) * (0.55 + 0.5 * flow));
    c *= 1.25;
    float a = uFade * (0.6 + 0.4 * flow) * pow(core, 0.55);
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }
`;

/** Molten aluminium: incandescent metal under a drifting oxide skin. */
const moltenFragment = /* glsl */ `
  uniform float uTime;
  uniform float uFade;
  uniform float uTop;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec2 vUvC;
  ${noiseGLSL}

  void main(){
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);

    float t = uTime * 0.16;
    float skin = fbm(vec2(vUvC.x * 7.0 + t, vUvC.y * 4.0 - t * 0.7));
    float veins = fbm(vec2(vUvC.x * 18.0 - t * 1.4, vUvC.y * 9.0 + t));

    // hotter towards the surface of the pool
    float depth = mix(0.55, 1.0, smoothstep(0.0, 1.0, vUvC.y));
    float h = clamp(depth * (0.45 + 0.9 * skin) + 0.25 * veins, 0.0, 1.35);

    vec3 c = mix(vec3(0.07, 0.015, 0.005), vec3(0.72, 0.09, 0.005), smoothstep(0.02, 0.42, h));
    c = mix(c, vec3(1.0, 0.34, 0.02), smoothstep(0.42, 0.72, h));
    c = mix(c, vec3(1.0, 0.70, 0.20), smoothstep(0.74, 0.98, h));
    c = mix(c, vec3(1.0, 0.95, 0.84), smoothstep(1.0, 1.28, h));

    // oxide film drifting on the surface
    float film = smoothstep(0.55, 0.75, fbm(vec2(vUvC.x * 5.0 - t * 0.8, vUvC.y * 3.0 + t * 0.5)));
    c *= mix(1.0, 0.42, film * 0.8);

    c += vec3(1.0, 0.45, 0.12) * fres * 0.9;
    c *= mix(1.0, 1.5, uTop);

    gl_FragColor = vec4(c, uFade);
    #include <colorspace_fragment>
  }
`;

const glowFragment = /* glsl */ `
  uniform float uStrength;
  varying vec2 vUvC;
  void main(){
    float d = length(vUvC - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 3.0) * uStrength;
    gl_FragColor = vec4(mix(vec3(1.0, 0.38, 0.06), vec3(1.0, 0.74, 0.32), a) * a, a);
  }
`;

const plainVertex = /* glsl */ `
  varying vec2 vUvC;
  void main(){
    vUvC = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sparkVertex = /* glsl */ `
  uniform float uTime;
  uniform float uFade;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  void main(){
    float life = fract(uTime * (0.35 + aSeed * 0.5) + aSeed);
    vec3 p = position;
    p.y += life * (1.6 + aSeed * 1.9) - 0.6 * life * life * 3.0;
    p.x += sin((aSeed + life) * 9.0) * 0.55 * life;
    p.z += cos((aSeed + life) * 7.0) * 0.4 * life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = smoothstep(1.0, 0.1, life) * uFade;
    gl_PointSize = (4.0 + aSeed * 7.0) * uPixelRatio * (5.0 / -mv.z);
  }
`;

const sparkFragment = /* glsl */ `
  varying float vAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 1.8) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(vec3(1.0, 0.5, 0.12), vec3(1.0, 0.92, 0.7), a), a);
  }
`;

/* ------------------------------------------------------------------ helpers */

const useMetal = (heat = 1) =>
  useMemo(
    () => ({ uHeat: { value: heat }, uTime: { value: 0 }, uFade: { value: 1 } }),
    [heat],
  );

function Metal({ uniforms }: { uniforms: Record<string, THREE.IUniform> }) {
  return (
    <shaderMaterial
      vertexShader={metalVertex}
      fragmentShader={metalFragment}
      uniforms={uniforms}
      transparent
    />
  );
}

/** Fades a whole branch of the graph, standard materials and shaders alike. */
function setFade(root: THREE.Object3D | null, w: number) {
  if (!root) return;
  root.visible = w > 0.015;
  if (!root.visible) return;
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const mat = mesh.material as THREE.Material & {
      uniforms?: Record<string, THREE.IUniform>;
    };
    if (!mat) return;
    if (mat.uniforms?.uFade) mat.uniforms.uFade.value = w;
    else if ("opacity" in mat) {
      mat.transparent = true;
      mat.opacity = w;
    }
  });
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/* ------------------------------------------------------- 01 — casting */

function Casting() {
  const group = useRef<THREE.Group>(null);
  const fill = useRef<THREE.Mesh>(null);
  const pool = useRef<THREE.Mesh>(null);
  const poolGlow = useRef<THREE.Mesh>(null);
  const stream = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  const melt = useMemo(
    () => ({ uTime: { value: 0 }, uFade: { value: 1 }, uTop: { value: 0 } }),
    [],
  );
  const meltTop = useMemo(
    () => ({ uTime: { value: 0 }, uFade: { value: 1 }, uTop: { value: 1 } }),
    [],
  );
  const streamUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFade: { value: 1 } }),
    [],
  );
  const glowUniforms = useMemo(() => ({ uStrength: { value: 0.9 } }), []);
  const poolGlowUniforms = useMemo(() => ({ uStrength: { value: 1.1 } }), []);
  const sparkUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFade: { value: 1 }, uPixelRatio: { value: 1 } }),
    [],
  );

  const sparks = useMemo(() => {
    const n = 160;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      seed[i] = Math.random();
    }
    return { pos, seed };
  }, []);

  useFrame((state) => {
    const s = getStage();
    const w = stageWeights(s)[0];
    setFade(group.current, w);
    if (w < 0.02) return;

    const t = state.clock.elapsedTime;
    melt.uTime.value = t;
    meltTop.uTime.value = t;
    streamUniforms.uTime.value = t;
    sparkUniforms.uTime.value = t;
    sparkUniforms.uFade.value = w;
    sparkUniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 2);

    // the mould fills while the stage runs
    const u = s.phase === 0 ? s.u : 1;
    const level = 0.12 + smooth(clamp01(u * 1.15)) * 1.5;
    if (fill.current) {
      fill.current.scale.y = level / 1.62;
      fill.current.position.y = -1.62 / 2 + level / 2;
    }
    if (pool.current) pool.current.position.y = -1.62 / 2 + level;
    if (poolGlow.current) {
      poolGlow.current.position.y = -1.62 / 2 + level;
      poolGlow.current.lookAt(state.camera.position);
      poolGlowUniforms.uStrength.value = w * (0.85 + 0.18 * Math.sin(t * 4.3));
    }
    if (stream.current) {
      const on = 1 - smooth(clamp01((u - 0.82) / 0.18));
      stream.current.scale.set(1, on, 1);
      stream.current.position.y = 0.72 - (1 - on) * 0.8;
      streamUniforms.uFade.value = w * on;
    }
    if (glow.current) {
      glowUniforms.uStrength.value = w * (0.75 + 0.25 * Math.sin(t * 6));
    }
  });

  return (
    <group ref={group} position={[0, 0.3, 0]}>
      {/* launder feeding the mould */}
      <mesh position={[-1.55, 1.72, 0]} rotation={[0, 0, -0.24]}>
        <boxGeometry args={[2.1, 0.16, 0.62]} />
        <meshStandardMaterial color="#2b3037" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh position={[-1.55, 1.84, 0]} rotation={[0, 0, -0.24]}>
        <boxGeometry args={[1.9, 0.06, 0.4]} />
        <meshStandardMaterial color="#ff6a1a" emissive="#ff5b14" emissiveIntensity={2.2} />
      </mesh>

      {/* the pour */}
      <mesh ref={stream} position={[-0.62, 0.72, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.11, 0.17, 1.9, 24, 1, true]} />
        <shaderMaterial
          vertexShader={plainVertex}
          fragmentShader={streamFragment}
          uniforms={streamUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* mould, and the metal rising inside it */}
      <mesh position={[-0.5, -0.85, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 1.72, 48, 1, true]} />
        <meshStandardMaterial color="#20252b" roughness={0.9} metalness={0.25} side={THREE.BackSide} />
      </mesh>
      <mesh position={[-0.5, -1.35, 0]}>
        <cylinderGeometry args={[0.94, 0.94, 0.72, 48, 1, true]} />
        <meshStandardMaterial color="#1c2127" roughness={0.95} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* rim, so the open mould still reads as a vessel */}
      <mesh position={[-0.5, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.93, 0.045, 10, 56]} />
        <meshStandardMaterial color="#39404a" roughness={0.6} metalness={0.5} />
      </mesh>
      <group position={[-0.5, -0.85, 0]}>
        <mesh ref={fill}>
          <cylinderGeometry args={[0.86, 0.86, 1.62, 40, 1, true]} />
          <shaderMaterial
            vertexShader={metalVertex}
            fragmentShader={moltenFragment}
            uniforms={melt}
            transparent
          />
        </mesh>
        {/* the surface of the pool, the brightest thing on the page */}
        <mesh ref={pool} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.86, 48]} />
          <shaderMaterial
            vertexShader={metalVertex}
            fragmentShader={moltenFragment}
            uniforms={meltTop}
            transparent
          />
        </mesh>
        <mesh ref={poolGlow} scale={[3.4, 3.4, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            vertexShader={plainVertex}
            fragmentShader={glowFragment}
            uniforms={poolGlowUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <mesh ref={glow} position={[-0.5, -0.2, -0.5]} scale={[5.5, 5.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={plainVertex}
          fragmentShader={glowFragment}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <points position={[-0.5, -0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparks.pos, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[sparks.seed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={sparkVertex}
          fragmentShader={sparkFragment}
          uniforms={sparkUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* -------------------------------------------------------- 02 — the billet */

function SingleBillet() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMetal(1);

  useFrame((state, delta) => {
    const s = getStage();
    const w = stageWeights(s)[1];
    setFade(group.current, w);
    if (w < 0.02) return;

    const u = s.phase === 1 ? s.u : 0;
    uniforms.uTime.value = state.clock.elapsedTime;
    // it cools on camera, white-hot down to brushed silver
    uniforms.uHeat.value = 0.97 - 0.91 * smooth(clamp01((u - 0.05) / 0.7));
    if (mesh.current) mesh.current.rotation.y += delta * 0.5;
    if (group.current) group.current.position.y = 0.05 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={group} position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2 - 0.18]}>
      <mesh ref={mesh}>
        <cylinderGeometry args={[0.56, 0.56, 3.8, 80]} />
        <Metal uniforms={uniforms} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------- 03 — the bundle */

/** Hex-packed stack: four, three, two. */
const STACK: [number, number][] = [
  [-1.02, 0],
  [-0.34, 0],
  [0.34, 0],
  [1.02, 0],
  [-0.68, 1],
  [0, 1],
  [0.68, 1],
  [-0.34, 2],
  [0.34, 2],
];

const ROW_H = 0.589;

function Bundle({
  scale = 1,
  stageIndex = 2,
  positionY = -0.35,
}: {
  scale?: number;
  stageIndex?: number;
  positionY?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const uniforms = useMetal(0.04);

  useFrame((state) => {
    const s = getStage();
    const w = stageWeights(s)[stageIndex];
    setFade(group.current, w);
    if (w < 0.02) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current && stageIndex === 2) {
      group.current.rotation.y = -0.35 + Math.sin(state.clock.elapsedTime * 0.25) * 0.09;
    }
  });

  return (
    <group ref={group} position={[0, positionY, 0]} scale={scale} rotation={[0, -0.35, 0]}>
      {STACK.map(([z, row], i) => (
        <mesh key={i} position={[0, row * ROW_H, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 3.3, 36]} />
          <Metal uniforms={uniforms} />
        </mesh>
      ))}

      {/* strapping */}
      {[-1.0, 1.0].map((x) => (
        <group key={x} position={[x, ROW_H, 0]}>
          <mesh position={[0, ROW_H * 1.35, 0]}>
            <boxGeometry args={[0.06, 0.03, 1.5]} />
            <meshStandardMaterial color="#8f98a2" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, -ROW_H * 1.6, 0]}>
            <boxGeometry args={[0.06, 0.03, 2.3]} />
            <meshStandardMaterial color="#8f98a2" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.1, 0.92]}>
            <boxGeometry args={[0.06, 1.9, 0.03]} />
            <meshStandardMaterial color="#8f98a2" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.1, -0.92]}>
            <boxGeometry args={[0.06, 1.9, 0.03]} />
            <meshStandardMaterial color="#8f98a2" roughness={0.5} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* timber bearers */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={`b${x}`} position={[x, -0.42, 0]}>
          <boxGeometry args={[0.22, 0.14, 2.5]} />
          <meshStandardMaterial color="#3a3129" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------- 04 — the truck */

function Truck() {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const uniforms = useMetal(0.03);

  const wheelX = [-3.95, -3.1, 1.25, 2.05, 2.85];

  useFrame((state, delta) => {
    const s = getStage();
    const w = stageWeights(s)[3];
    setFade(group.current, w);
    if (w < 0.02) return;

    uniforms.uTime.value = state.clock.elapsedTime;
    const u = s.phase === 3 ? s.u : 0;
    // drives in, stands to be seen, then pulls out of frame
    let travel: number;
    if (u < 0.26) travel = -13 + 13 * smooth(u / 0.26);
    else if (u < 0.7) travel = 0;
    else travel = 13 * smooth((u - 0.7) / 0.3);
    if (group.current) group.current.position.x = travel;
    for (const g of wheels.current) if (g) g.rotation.z -= delta * 5.5;
  });

  return (
    <group ref={group} position={[0, -0.55, 0]} scale={0.62}>
      {/* chassis + flatbed */}
      <mesh position={[-0.3, -0.5, 0]}>
        <boxGeometry args={[8.4, 0.16, 0.7]} />
        <meshStandardMaterial color="#1b2027" roughness={0.9} />
      </mesh>
      <mesh position={[1.2, -0.32, 0]}>
        <boxGeometry args={[5.6, 0.2, 2.6]} />
        <meshStandardMaterial color="#262c34" roughness={0.85} metalness={0.25} />
      </mesh>

      {/* cab */}
      <mesh position={[-3.5, 0.35, 0]}>
        <boxGeometry args={[1.9, 1.5, 2.4]} />
        <meshStandardMaterial color="#c9d0d7" roughness={0.35} metalness={0.55} />
      </mesh>
      <mesh position={[-2.58, 0.55, 0]}>
        <boxGeometry args={[0.08, 0.72, 2.1]} />
        <meshStandardMaterial color="#0e1216" roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[-2.62, 0.98, 0]}>
        <boxGeometry args={[0.34, 0.1, 2.3]} />
        <meshStandardMaterial color="#aab3bc" roughness={0.4} metalness={0.6} />
      </mesh>
      {[-1.21, 1.21].map((z) => (
        <mesh key={z} position={[-3.35, 0.5, z]}>
          <boxGeometry args={[0.9, 0.5, 0.04]} />
          <meshStandardMaterial color="#0e1216" roughness={0.25} metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[-3.5, -0.42, 0]}>
        <boxGeometry args={[2.0, 0.5, 2.3]} />
        <meshStandardMaterial color="#1b2027" roughness={0.9} />
      </mesh>

      {/* wheels */}
      {wheelX.map((x, i) =>
        [-1.15, 1.15].map((z, j) => (
          <group
            key={`${i}-${j}`}
            ref={(el) => {
              if (el) wheels.current[i * 2 + j] = el;
            }}
            position={[x, -0.78, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <mesh>
              <cylinderGeometry args={[0.46, 0.46, 0.3, 24]} />
              <meshStandardMaterial color="#14181d" roughness={1} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
              <meshStandardMaterial color="#79828c" roughness={0.5} metalness={0.7} />
            </mesh>
          </group>
        )),
      )}

      {/* the load */}
      <group position={[1.2, 0.02, 0]}>
        {STACK.map(([z, row], i) => (
          <mesh key={i} position={[0, row * ROW_H * 0.78, z * 0.78]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 4.4, 28]} />
            <Metal uniforms={uniforms} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ canvas */

/** Places the reel in the free half of the hero and scales it to the viewport. */
function Reel() {
  const { viewport, size } = useThree();
  const narrow = size.width < 900;
  const scale = narrow ? Math.min(0.5, viewport.width / 9) : Math.min(0.72, viewport.width / 13);
  const x = narrow ? 0 : viewport.width * 0.27;
  const y = narrow ? -viewport.height * 0.2 : -0.1;

  return (
    <group position={[x, y, 0]} scale={scale}>
      <Casting />
      <SingleBillet />
      <Bundle />
      <Truck />
    </group>
  );
}

function Rig() {
  const { camera, size } = useThree();
  const narrow = size.width < 900;

  useFrame((state) => {
    const p = state.pointer;
    camera.position.x += (p.x * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (0.35 + p.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(narrow ? 1.7 : 1.4, 0, 0);
  });

  return null;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroScene() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    setOk(hasWebGL());
    return startStageClock();
  }, []);

  if (!ok) return <div className="scene-fallback" aria-hidden />;

  return (
    <div className="scene" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.35, 9.4], fov: 34 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 7, 6]} intensity={3.1} />
        <directionalLight position={[-6, 2, -4]} intensity={1.1} color="#9fb6d4" />
        <directionalLight position={[0, -3, 4]} intensity={0.6} color="#ffd9b0" />
        <Rig />
        <Reel />
      </Canvas>
    </div>
  );
}
