"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useApp } from "@/components/providers";
import type { Side } from "@/lib/types";

const PIN_COUNT = 24;
const NODE_COUNT = 16;
const ORBIT_COUNT = 70;
const LINK_COUNT = NODE_COUNT;
const CANDLE_COUNT = 46;

type Theme = "dark" | "light";

const PALETTES: Record<Theme, {
  cyber: THREE.Color;
  cyberSoft: THREE.Color;
  cyberBright: THREE.Color;
  chipBody: THREE.Color;
  gold: THREE.Color;
  goldDeep: THREE.Color;
  blend: THREE.Blending;
  starSize: number;
  starOpacity: number;
}> = {
  dark: {
    cyber: new THREE.Color(0x22d3ee),
    cyberSoft: new THREE.Color(0x0891b2),
    cyberBright: new THREE.Color(0xa5f3fc),
    chipBody: new THREE.Color(0x0e2f4a),
    gold: new THREE.Color(0xfbbf24),
    goldDeep: new THREE.Color(0xb45309),
    blend: THREE.AdditiveBlending,
    starSize: 0.028,
    starOpacity: 0.5,
  },
  light: {
    cyber: new THREE.Color(0x0e7490),
    cyberSoft: new THREE.Color(0x155e75),
    cyberBright: new THREE.Color(0x0f766e),
    chipBody: new THREE.Color(0x1e3a5f),
    gold: new THREE.Color(0xb45309),
    goldDeep: new THREE.Color(0x78350f),
    blend: THREE.NormalBlending,
    starSize: 0.034,
    starOpacity: 0.65,
  },
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedServer = () => false;

function LoreScene({ side, theme }: { side: Side; theme: Theme }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);
  const pal = PALETTES[theme];

  const root = useRef<THREE.Group>(null!);
  const eng = useRef<THREE.Group>(null!);
  const mkt = useRef<THREE.Group>(null!);
  const stars = useRef<THREE.Points>(null!);
  const mix = useRef(0);
  const travel = useRef(0);

  // ---- AI chip world ----
  const chip = useRef<THREE.Group>(null!);
  const chipCore = useRef<THREE.Mesh>(null!);
  const chipBodyMat = useRef<THREE.MeshBasicMaterial>(null!);
  const chipFrameMat = useRef<THREE.MeshBasicMaterial>(null!);
  const chipCoreMat = useRef<THREE.MeshBasicMaterial>(null!);
  const pinMesh = useRef<THREE.InstancedMesh>(null!);
  const pinMat = useRef<THREE.MeshBasicMaterial>(null!);
  const nodeMesh = useRef<THREE.InstancedMesh>(null!);
  const nodeMat = useRef<THREE.MeshBasicMaterial>(null!);
  const orbitGroup = useRef<THREE.Group>(null!);
  const orbitMat = useRef<THREE.PointsMaterial>(null!);
  const packet = useRef<THREE.Mesh>(null!);
  const packetMat = useRef<THREE.MeshBasicMaterial>(null!);
  const linkRef = useRef<THREE.LineSegments>(null!);
  const linkMatRef = useRef<THREE.LineBasicMaterial>(null!);
  const engGridMat = useRef<THREE.LineBasicMaterial>(null!);

  // ---- Market world ----
  const bodyMesh = useRef<THREE.InstancedMesh>(null!);
  const wickMesh = useRef<THREE.InstancedMesh>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const bodyMat = useRef<THREE.MeshBasicMaterial>(null!);
  const wickMat = useRef<THREE.MeshBasicMaterial>(null!);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null!);
  const mktGridMat = useRef<THREE.LineBasicMaterial>(null!);
  const starMat = useRef<THREE.PointsMaterial>(null!);

  const trendPts = useRef<THREE.Vector3[]>([]);
  const trendLineMat = useRef<THREE.LineBasicMaterial>(null!);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const rand = useMemo(() => mulberry32(0xc0de), []);

  const starGeo = useMemo(() => {
    const positions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const r = 4.5 + rand() * 2.5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [rand]);

  const nodePositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const ang = (i / NODE_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.4;
      const r = 2.0 + rand() * 0.9;
      arr.push(new THREE.Vector3(Math.cos(ang) * r, 0.3 + rand() * 1.55, Math.sin(ang) * r * 0.72));
    }
    return arr;
  }, [rand]);

  const linkGeo = useMemo(() => {
    const positions = new Float32Array(LINK_COUNT * 2 * 3);
    for (let i = 0; i < LINK_COUNT; i++) {
      const n = nodePositions[i];
      positions[i * 6] = n.x * 0.32;
      positions[i * 6 + 1] = 0.5;
      positions[i * 6 + 2] = n.z * 0.32;
      positions[i * 6 + 3] = n.x;
      positions[i * 6 + 4] = n.y;
      positions[i * 6 + 5] = n.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodePositions]);

  const linkMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: PALETTES.dark.cyberBright,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const orbitGeo = useMemo(() => {
    const positions = new Float32Array(ORBIT_COUNT * 3);
    for (let i = 0; i < ORBIT_COUNT; i++) {
      const a = (i / ORBIT_COUNT) * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * 1.35;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(a) * 1.35;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  const { line, lineGeo, pts } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 90; i++) {
      const p = i / 90;
      points.push(
        new THREE.Vector3(-3.1 + p * 6.2, -0.72 + p * 1.75 + Math.sin(p * 11) * 0.16, -0.9)
      );
    }
    const g = new THREE.BufferGeometry().setFromPoints(points);
    const l = new THREE.Line(
      g,
      new THREE.LineBasicMaterial({
        color: PALETTES.dark.gold,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    return { line: l, lineGeo: g, pts: points };
  }, []);

  useLayoutEffect(() => {
    trendPts.current = pts;
    trendLineMat.current = line.material as THREE.LineBasicMaterial;
    linkMatRef.current = linkMat;

    // ---- AI chip: pins around the perimeter ----
    const d = new THREE.Object3D();
    const half = 0.72;
    const step = (2 * half) / 6;
    let pin = 0;
    const place = (x: number, z: number) => {
      d.position.set(x, -0.4, z);
      d.rotation.set(0, 0, 0);
      d.scale.set(1, 1, 1);
      d.updateMatrix();
      pinMesh.current.setMatrixAt(pin, d.matrix);
      pin++;
    };
    for (let i = 0; i <= 6; i++) {
      const offset = -half + i * step;
      place(offset, half);
      place(offset, -half);
      place(half, offset);
      place(-half, offset);
    }
    pinMesh.current.instanceMatrix.needsUpdate = true;

    // ---- AI chip: neural nodes around the chip ----
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodePositions[i];
      d.position.copy(n);
      const s = 0.12 + rand() * 0.08;
      d.scale.set(s, s, s);
      d.rotation.set(rand() * 0.4, rand() * 0.4, rand() * 0.4);
      d.updateMatrix();
      nodeMesh.current.setMatrixAt(i, d.matrix);
    }
    nodeMesh.current.instanceMatrix.needsUpdate = true;

    // ---- Analyst: candlestick wall (rising left -> right) ----
    for (let i = 0; i < CANDLE_COUNT; i++) {
      const x = -3.1 + (i / (CANDLE_COUNT - 1)) * 6.2 + (rand() - 0.5) * 0.12;
      const h = 0.25 + rand() * 1.7;
      const z = -1.3 + (rand() - 0.5) * 2.2;
      const y = h / 2 - 1.05;
      d.position.set(x, y, z);
      d.scale.set(0.09, h, 0.09);
      d.rotation.set(0, rand() * 0.08, 0);
      d.updateMatrix();
      bodyMesh.current.setMatrixAt(i, d.matrix);

      d.position.set(x, y, z);
      d.scale.set(0.02, h, 0.02);
      d.rotation.set(0, 0, 0);
      d.updateMatrix();
      wickMesh.current.setMatrixAt(i, d.matrix);
    }
    bodyMesh.current.instanceMatrix.needsUpdate = true;
    wickMesh.current.instanceMatrix.needsUpdate = true;

    // Floors
    const engGrid = new THREE.GridHelper(16, 32, PALETTES.dark.cyberSoft, PALETTES.dark.cyberSoft);
    engGrid.position.y = -2.6;
    const engGridMaterial = engGrid.material as THREE.LineBasicMaterial;
    engGridMaterial.transparent = true;
    engGridMaterial.opacity = 0;
    engGridMat.current = engGridMaterial;
    eng.current.add(engGrid);

    const mktGrid = new THREE.GridHelper(16, 32, PALETTES.dark.goldDeep, PALETTES.dark.goldDeep);
    mktGrid.position.y = -2.6;
    const mktGridMaterial = mktGrid.material as THREE.LineBasicMaterial;
    mktGridMaterial.transparent = true;
    mktGridMaterial.opacity = 0;
    mktGridMat.current = mktGridMaterial;
    mkt.current.add(mktGrid);

    mkt.current.add(line);

    const gridMats = { engGridMaterial, mktGridMaterial };

    return () => {
      linkGeo.dispose();
      linkMat.dispose();
      orbitGeo.dispose();
      lineGeo.dispose();
      line.material.dispose();
      gridMats.engGridMaterial.dispose();
      engGrid.geometry.dispose();
      gridMats.mktGridMaterial.dispose();
      mktGrid.geometry.dispose();
      starGeo.dispose();
    };
  }, [rand, nodePositions, linkGeo, linkMat, orbitGeo, line, lineGeo, eng, mkt, starGeo, pts]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const target = side === "analyst" ? 1 : 0;
    const lambda = reduced ? 10 : 3.2;
    mix.current += (target - mix.current) * (1 - Math.exp(-lambda * dt));
    const m = mix.current;

    // Theme + side-aware colors
    starMat.current.color.copy(pal.cyber).lerp(pal.gold, m);
    starMat.current.blending = pal.blend;

    // Engineer: AI chip world
    const engk = 1 - m;
    chipBodyMat.current.opacity = engk * 0.9;
    chipFrameMat.current.opacity = engk * (theme === "dark" ? 0.5 : 0.7);
    chipFrameMat.current.blending = pal.blend;
    chipCoreMat.current.blending = pal.blend;
    chipCoreMat.current.opacity = engk * 0.95;
    pinMat.current.blending = pal.blend;
    pinMat.current.opacity = engk * 0.55;
    nodeMat.current.blending = pal.blend;
    nodeMat.current.opacity = engk * 0.5;
    linkMatRef.current.blending = pal.blend;
    linkMatRef.current.color.copy(pal.cyberBright);
    linkMatRef.current.opacity = engk * 0.35;
    orbitMat.current.blending = pal.blend;
    orbitMat.current.opacity = engk * 0.4;
    packetMat.current.blending = pal.blend;
    packetMat.current.opacity = engk * 0.9;
    if (engGridMat.current) {
      engGridMat.current.color.copy(pal.cyberSoft);
      engGridMat.current.blending = pal.blend;
      engGridMat.current.opacity = engk * 0.22;
    }
    if (eng.current) eng.current.visible = m < 0.999;

    // Analyst: market world
    bodyMat.current.blending = pal.blend;
    bodyMat.current.opacity = m * 0.62;
    wickMat.current.blending = pal.blend;
    wickMat.current.opacity = m * 0.45;
    glowMat.current.blending = pal.blend;
    glowMat.current.opacity = m * 0.85;
    if (mktGridMat.current) {
      mktGridMat.current.color.copy(pal.goldDeep);
      mktGridMat.current.blending = pal.blend;
      mktGridMat.current.opacity = m * 0.22;
    }
    if (trendLineMat.current) {
      trendLineMat.current.color.copy(pal.gold);
      trendLineMat.current.blending = pal.blend;
      trendLineMat.current.opacity = m * 0.95;
    }
    if (mkt.current) mkt.current.visible = m > 0.001;

    const t = state.clock.elapsedTime * (reduced ? 0.15 : 0.6);
    const yaw = t * 0.1 + pointer.current.x * 0.22;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, yaw, 2, dt);
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      pointer.current.y * 0.12,
      2,
      dt
    );
    stars.current.rotation.y += dt * 0.02;

    // AI chip animations
    chip.current.rotation.y += dt * (reduced ? 0.08 : 0.4);
    chipCore.current.scale.setScalar(0.85 + 0.35 * Math.sin(t * 3.2));
    orbitGroup.current.rotation.z = state.clock.elapsedTime * (reduced ? 0.05 : 0.22);
    packet.current.position.set(Math.cos(t * 1.4) * 1.35, 0, Math.sin(t * 1.4) * 1.35);

    // Market: traveling glow along the trend line
    travel.current = (travel.current + dt * (reduced ? 0.06 : 0.24)) % 1;
    const tr = trendPts.current;
    const pos = travel.current * (tr.length - 1);
    const i0 = Math.floor(pos);
    const f = pos - i0;
    glow.current.position.copy(tr[i0].clone().lerp(tr[Math.min(i0 + 1, tr.length - 1)], f));
    glow.current.position.z += 0.14;
    glow.current.scale.setScalar(0.8 + 0.35 * Math.sin(t * 8));
  });

  const instancedArgs = (count: number) =>
    [undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, count] as [
      THREE.BufferGeometry,
      THREE.Material,
      number,
    ];

  return (
    <group ref={root}>
      <group ref={eng}>
        <group ref={chip} rotation={[-0.42, 0, 0]}>
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[1.6, 0.14, 1.6]} />
            <meshBasicMaterial ref={chipBodyMat} color={pal.chipBody} transparent opacity={0} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[1.74, 0.2, 1.74]} />
            <meshBasicMaterial
              ref={chipFrameMat}
              color={pal.cyber}
              wireframe
              transparent
              opacity={0}
              depthWrite={false}
              blending={pal.blend}
            />
          </mesh>
          <mesh ref={chipCore} position={[0, 0.47, 0]}>
            <planeGeometry args={[0.56, 0.56]} />
            <meshBasicMaterial
              ref={chipCoreMat}
              color={pal.cyberBright}
              transparent
              opacity={0}
              depthWrite={false}
              blending={pal.blend}
            />
          </mesh>
          <instancedMesh ref={pinMesh} args={instancedArgs(PIN_COUNT)} frustumCulled={false}>
            <boxGeometry args={[0.055, 0.42, 0.055]} />
            <meshBasicMaterial
              ref={pinMat}
              color={pal.cyberSoft}
              transparent
              opacity={0}
              depthWrite={false}
              blending={pal.blend}
            />
          </instancedMesh>
        </group>

        <instancedMesh ref={nodeMesh} args={instancedArgs(NODE_COUNT)} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            ref={nodeMat}
            color={pal.cyber}
            transparent
            opacity={0}
            depthWrite={false}
            blending={pal.blend}
          />
        </instancedMesh>

        <lineSegments ref={linkRef} geometry={linkGeo}>
          <primitive object={linkMat} attach="material" />
        </lineSegments>

        <group ref={orbitGroup} rotation={[0.9, 0, 0]}>
          <points geometry={orbitGeo}>
            <pointsMaterial
              ref={orbitMat}
              color={pal.cyberBright}
              size={pal.starSize}
              sizeAttenuation
              transparent
              opacity={0}
              depthWrite={false}
              blending={pal.blend}
            />
          </points>
          <mesh ref={packet}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial
              ref={packetMat}
              color={pal.cyberBright}
              transparent
              opacity={0}
              depthWrite={false}
              blending={pal.blend}
            />
          </mesh>
        </group>
      </group>

      <group ref={mkt}>
        <instancedMesh ref={bodyMesh} args={instancedArgs(CANDLE_COUNT)} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            ref={bodyMat}
            color={pal.gold}
            transparent
            opacity={0}
            depthWrite={false}
            blending={pal.blend}
          />
        </instancedMesh>
        <instancedMesh ref={wickMesh} args={instancedArgs(CANDLE_COUNT)} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            ref={wickMat}
            color={pal.goldDeep}
            transparent
            opacity={0}
            depthWrite={false}
            blending={pal.blend}
          />
        </instancedMesh>
        <primitive object={line} />
        <mesh ref={glow}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial
            ref={glowMat}
            color={pal.gold}
            transparent
            opacity={0}
            depthWrite={false}
            blending={pal.blend}
          />
        </mesh>
      </group>

      <points ref={stars} geometry={starGeo}>
        <pointsMaterial
          ref={starMat}
          color={pal.cyber}
          size={pal.starSize}
          sizeAttenuation
          transparent
          opacity={pal.starOpacity}
          depthWrite={false}
          blending={pal.blend}
        />
      </points>
    </group>
  );
}

export default function LoreBackground() {
  const { side } = useApp();
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        style={{ position: "absolute", inset: 0 }}
      >
        <LoreScene side={side} theme={theme} />
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background: [
            // Edge vignette to softly frame the scene.
            "radial-gradient(ellipse 135% 125% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
            // Faint accent glow near the hero so the page keeps some warmth.
            "radial-gradient(ellipse 70% 45% at 50% 12%, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 72%)",
            // Uniform theme-aware veil: keeps all non-card text on a calm
            // backdrop at every scroll position, while the lore scene stays
            // faintly visible through it.
            theme === "dark"
              ? "color-mix(in srgb, var(--bg) 58%, transparent)"
              : "color-mix(in srgb, var(--bg) 45%, transparent)",
          ].join(", "),
        }}
      />
    </div>
  );
}