"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Lang, Project } from "@/lib/types";
import { createBlueprintTexture } from "./blueprint";

const SHEET_W = 2.05;
const SHEET_H = 2.87;
const STEP_Z = 0.05;
const WORLD_PER_PX = 0.0035;
const EXIT_X = 6.2;
const SWIPE_THRESHOLD = 90;
const CLICK_MAX_MOVE = 8;

const JITTER: [number, number, number][] = [
  [0, 0, -0.012],
  [0.06, 0.03, 0.045],
  [-0.05, -0.02, -0.05],
  [0.03, 0.05, 0.028],
  [-0.04, 0.02, -0.035],
  [0.05, -0.04, 0.05],
];

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

function slotJitter(slot: number) {
  return JITTER[slot % JITTER.length];
}

interface Flight {
  to: number;
  dir: number;
  startX: number;
}

function Sheets({
  projects,
  lang,
  index,
  flight,
  onFlightDone,
  dragRef,
  reduced,
}: {
  projects: Project[];
  lang: Lang;
  index: number;
  flight: Flight | null;
  onFlightDone: (to: number) => void;
  dragRef: React.RefObject<{ down: boolean; x: number }>;
  reduced: boolean;
}) {
  const total = projects.length;
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const progressRef = useRef(0);

  const textures = useMemo(
    () => projects.map((p, i) => createBlueprintTexture(p, i, total, lang)),
    [projects, lang, total]
  );

  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  useEffect(() => {
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const [jx, jy, jrz] = slotJitter(i);
      mesh.position.set(jx, jy, -i * STEP_Z);
      mesh.rotation.set(0, 0, jrz);
    });
  }, []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const lambda = reduced ? 20 : 7;
    const damp = THREE.MathUtils.damp;

    let progress = 0;
    let flightActive = false;

    if (flight) {
      progressRef.current += delta / (reduced ? 0.02 : 0.55);
      progress = easeOutCubic(Math.min(progressRef.current, 1));
      flightActive = true;
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        onFlightDone(flight.to);
      }
    }

    const newIdx = flight ? flight.to : index;
    const drag = dragRef.current;

    for (let i = 0; i < meshes.current.length; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const mat = mesh.material as THREE.MeshBasicMaterial;

      const slot = ((i - newIdx) % total + total) % total;
      const [jx, jy, jrz] = slotJitter(slot);
      const tx = jx;
      const ty = jy;
      const tz = -slot * STEP_Z;

      if (flightActive && i === index) {
        const dir = flight!.dir;
        const lift = Math.sin(progress * Math.PI);
        mesh.position.x = jx + flight!.startX * WORLD_PER_PX - dir * EXIT_X * progress;
        mesh.position.y = jy + 0.22 * lift;
        mesh.position.z = 0.55 * lift;
        mesh.rotation.z = jrz + flight!.startX * 0.0009 - dir * 0.5 * progress;
        mesh.rotation.y = dir * 0.55 * progress;
        mat.opacity = 1 - smoothstep(0.5, 0.95, progress);
      } else {
        const dragX = !flightActive && i === index && drag?.down ? drag.x * WORLD_PER_PX : 0;
        const dragRz = !flightActive && i === index && drag?.down ? drag.x * 0.0009 : 0;

        mesh.position.x = damp(mesh.position.x, tx + dragX, lambda, delta);
        mesh.position.y = damp(mesh.position.y, ty, lambda, delta);
        mesh.position.z = damp(mesh.position.z, tz, lambda, delta);
        mesh.rotation.z = damp(mesh.rotation.z, jrz + dragRz, lambda, delta);
        mesh.rotation.y = damp(mesh.rotation.y, 0, lambda, delta);

        const opacityTarget = Math.abs(mesh.position.x) > 2.6 ? 0 : 1;
        mat.opacity = damp(mat.opacity, opacityTarget, lambda, delta);
      }
    }

    if (!flightActive && drag && !drag.down && Math.abs(drag.x) > 0.001) {
      drag.x = damp(drag.x, 0, 12, delta);
    }
  });

  return (
    <group>
      {projects.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          position={[slotJitter(i)[0], slotJitter(i)[1], -i * STEP_Z]}
          rotation={[0, 0, slotJitter(i)[2]]}
        >
          <planeGeometry args={[SHEET_W, SHEET_H]} />
          <meshBasicMaterial map={textures[i]} transparent side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function FitCamera() {
  const size = useThree((s) => s.size);

  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.35);
    const vFov = (camera.fov * Math.PI) / 180;
    const fitH = 3.95 / (2 * Math.tan(vFov / 2));
    const fitW = 3.15 / (2 * Math.tan(vFov / 2) * aspect);
    const targetZ = Math.max(fitH, fitW, 5.2);
    if (Math.abs(camera.position.z - targetZ) > 0.001) {
      camera.position.z = targetZ;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedServer = () => false;

export default function ProjectStack({
  projects,
  lang,
}: {
  projects: Project[];
  lang: Lang;
}) {
  const [index, setIndex] = useState(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const dragRef = useRef({ down: false, x: 0, moved: 0, startX: 0 });
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  const total = projects.length;

  const swipe = (dir: number) => {
    if (flight || total < 2) return;
    const to = (index + dir + total) % total;
    setFlight({ to, dir, startX: dragRef.current.x });
  };

  const goTo = (target: number) => {
    if (flight || target === index || total < 2) return;
    const forward = ((target - index) % total + total) % total;
    const dir = forward <= total / 2 ? 1 : -1;
    setFlight({ to: target, dir, startX: 0 });
  };

  const handleFlightDone = (to: number) => {
    setIndex(to);
    setFlight(null);
  };

  const openLink = () => {
    const link = projects[index]?.link?.trim();
    if (!link || link === "#") return;
    if (/^(https?:\/\/|mailto:|tel:)/i.test(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(link);
    }
  };

  return (
    <div className="relative select-none">
      <div
        className="h-[420px] w-full touch-pan-y overflow-hidden rounded-3xl border border-line bg-bg-card sm:h-[520px] lg:h-[560px]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          if (flight) return;
          dragRef.current.down = true;
          dragRef.current.x = 0;
          dragRef.current.moved = 0;
          dragRef.current.startX = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = dragRef.current;
          if (!d.down || flight) return;
          d.x = e.clientX - d.startX;
          d.moved = Math.max(d.moved, Math.abs(d.x));
        }}
        onPointerUp={() => {
          const d = dragRef.current;
          if (!d.down) return;
          d.down = false;
          if (d.moved > SWIPE_THRESHOLD) {
            swipe(d.x > 0 ? -1 : 1);
          } else if (d.moved < CLICK_MAX_MOVE) {
            openLink();
          }
          d.x = 0;
        }}
        onPointerCancel={() => {
          dragRef.current.down = false;
          dragRef.current.x = 0;
        }}
      >
        <Canvas
          camera={{ fov: 30, position: [0, 0, 7.2] }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ cursor: flight ? "default" : "grab" }}
        >
          <FitCamera />
          <Sheets
            projects={projects}
            lang={lang}
            index={index}
            flight={flight}
            onFlightDone={handleFlightDone}
            dragRef={dragRef}
            reduced={reduced}
          />
        </Canvas>
      </div>

      <button
        type="button"
        onClick={() => swipe(-1)}
        aria-label={lang === "id" ? "Proyek sebelumnya" : "Previous project"}
        className="absolute top-1/2 left-2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg-card/90 text-fg backdrop-blur transition-all hover:border-accent hover:text-accent sm:left-4"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => swipe(1)}
        aria-label={lang === "id" ? "Proyek berikutnya" : "Next project"}
        className="absolute top-1/2 right-2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg-card/90 text-fg backdrop-blur transition-all hover:border-accent hover:text-accent sm:right-4"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="mt-5 flex items-center justify-center gap-2.5">
        {projects.map((project, i) => (
          <button
            key={project.title.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${lang === "id" ? "Buka proyek" : "Open project"} ${i + 1}: ${project.title[lang]}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-accent" : "w-2.5 bg-line hover:bg-fg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
