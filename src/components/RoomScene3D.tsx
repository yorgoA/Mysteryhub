"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useTexture, Html } from "@react-three/drei";
import type { Room, RoomItem } from "@/data/mysteries/stolen-painting";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/** Walkable room bounds (x min, x max, z min, z max) - keep player inside walls */
const ROOM_BOUNDS = { xMin: -2.2, xMax: 2.2, zMin: -2.2, zMax: 2.2 };
const MOVE_SPEED = 2.5;

function FirstPersonController() {
  const { camera } = useThree();
  const controlsRef = useRef<React.ElementRef<typeof PointerLockControls>>(null);
  const moveRef = useRef({ forward: 0, right: 0 });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": moveRef.current.forward = 1; break;
        case "KeyS": moveRef.current.forward = -1; break;
        case "KeyA": moveRef.current.right = -1; break;
        case "KeyD": moveRef.current.right = 1; break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "KeyS": moveRef.current.forward = 0; break;
        case "KeyA":
        case "KeyD": moveRef.current.right = 0; break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;
    const { forward, right } = moveRef.current;
    if (forward === 0 && right === 0) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    const rightDir = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));

    const move = new THREE.Vector3();
    if (forward !== 0) move.addScaledVector(dir, forward * MOVE_SPEED * delta);
    if (right !== 0) move.addScaledVector(rightDir, right * MOVE_SPEED * delta);

    camera.position.add(move);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, ROOM_BOUNDS.xMin, ROOM_BOUNDS.xMax);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, ROOM_BOUNDS.zMin, ROOM_BOUNDS.zMax);
  });

  return <PointerLockControls ref={controlsRef} />;
}

/** Grid positions for items in the room (x, z) - in front of back wall */
const ITEM_POSITIONS: [number, number][] = [
  [-1.2, 0.8],
  [0, 0.8],
  [1.2, 0.8],
  [-1.2, 0.2],
  [0, 0.2],
  [1.2, 0.2],
];

type ItemPreset = {
  geom: "box" | "cylinder" | "sphere" | "torus" | "flatBox" | "book" | "vase";
  color: string;
  size: [number, number, number];
  metalness?: number;
  roughness?: number;
};

const ITEM_PRESETS: Record<string, ItemPreset> = {
  glove: { geom: "flatBox", color: "#6b5344", size: [0.25, 0.08, 0.35], roughness: 0.9 },
  footprint: { geom: "flatBox", color: "#4a4035", size: [0.2, 0.03, 0.35], roughness: 0.95 },
  logbook: { geom: "book", color: "#2c1810", size: [0.3, 0.08, 0.22], roughness: 0.8 },
  vase: { geom: "vase", color: "#8b7355", size: [0.25, 0.2, 0.25], roughness: 0.3 },
  map: { geom: "flatBox", color: "#e8dcc8", size: [0.35, 0.02, 0.28], roughness: 0.85 },
  keyring: { geom: "torus", color: "#8b8b8b", size: [0.15, 0.06, 0.15], metalness: 0.6, roughness: 0.4 },
  frame: { geom: "flatBox", color: "#3d2c1e", size: [0.4, 0.08, 0.35], roughness: 0.7 },
  ladder: { geom: "box", color: "#5c4033", size: [0.15, 0.5, 0.25], roughness: 0.85 },
  "visitor-list": { geom: "book", color: "#f5f0e1", size: [0.22, 0.04, 0.28], roughness: 0.8 },
  "glass-cutter": { geom: "cylinder", color: "#4a4a4a", size: [0.08, 0.25, 0.08], metalness: 0.5, roughness: 0.5 },
  cigarette: { geom: "cylinder", color: "#5a4a3a", size: [0.03, 0.12, 0.03], roughness: 0.9 },
  flashlight: { geom: "cylinder", color: "#2a2a2a", size: [0.06, 0.25, 0.06], metalness: 0.7, roughness: 0.3 },
  crate: { geom: "box", color: "#6b5344", size: [0.35, 0.3, 0.4], roughness: 0.9 },
  handkerchief: { geom: "flatBox", color: "#e8e4dc", size: [0.2, 0.02, 0.2], roughness: 0.95 },
  ticket: { geom: "flatBox", color: "#f0e6d2", size: [0.15, 0.02, 0.22], roughness: 0.85 },
  hammer: { geom: "box", color: "#4a4035", size: [0.08, 0.2, 0.25], roughness: 0.7, metalness: 0.2 },
  seal: { geom: "cylinder", color: "#8b4513", size: [0.1, 0.08, 0.1], roughness: 0.5 },
  morse: { geom: "flatBox", color: "#d4c4a8", size: [0.2, 0.02, 0.25], roughness: 0.85 },
};

function getItemPreset(itemId: string, index: number): ItemPreset {
  return (
    ITEM_PRESETS[itemId] ?? {
      geom: index % 3 === 0 ? "box" : index % 3 === 1 ? "cylinder" : "sphere",
      color: "#8b7355",
      size: [0.25, 0.25, 0.25],
      roughness: 0.7,
    }
  );
}

function ItemMesh({
  item,
  index,
  isSolved,
  isSelected,
  onSelect,
}: {
  item: RoomItem;
  index: number;
  isSolved: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pos = ITEM_POSITIONS[index % ITEM_POSITIONS.length] ?? [0, 0.3];
  const preset = getItemPreset(item.id, index);
  const baseColor = isSolved ? "#22c55e" : isSelected ? "#c4a35a" : preset.color;

  useFrame((_, delta) => {
    if (meshRef.current && isSelected) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.08, 1.08, 1.08), delta * 4);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isSolved) onSelect();
  };

  const [sx, sy, sz] = preset.size;

  return (
    <group position={[pos[0], sy / 2 + 0.02, pos[1]]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = isSolved ? "default" : "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        castShadow
        receiveShadow
      >
        {preset.geom === "box" && <boxGeometry args={[sx, sy, sz]} />}
        {preset.geom === "cylinder" && <cylinderGeometry args={[sx / 2, sx / 2, sy, 12]} />}
        {preset.geom === "sphere" && <sphereGeometry args={[sx / 2, 16, 16]} />}
        {preset.geom === "torus" && <torusGeometry args={[sx, sz / 2, 8, 16]} />}
        {preset.geom === "flatBox" && <boxGeometry args={[sx, sy, sz]} />}
        {preset.geom === "book" && <boxGeometry args={[sx, sy, sz]} />}
        {preset.geom === "vase" && <cylinderGeometry args={[sz / 2, sx / 2, sy, 12]} />}
        <meshStandardMaterial
          color={baseColor}
          emissive={isSelected ? "#2a2218" : "#000000"}
          metalness={preset.metalness ?? 0.1}
          roughness={preset.roughness ?? 0.7}
        />
      </mesh>
      <Html
        position={[0, sy / 2 + 0.25, 0]}
        center
        distanceFactor={3}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontSize: "12px",
          color: "#fff",
          textShadow: "0 1px 2px #000",
          opacity: isSelected ? 1 : 0.85,
        }}
      >
        {item.name}
      </Html>
    </group>
  );
}

function RoomEnv({ roomImageUrl }: { roomImageUrl: string }) {
  const texture = useTexture(roomImageUrl);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#2a2416" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Back wall - room image */}
      <mesh position={[0, 2, -2.5]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshBasicMaterial map={texture} side={THREE.FrontSide} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-2.6, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#1a1612" roughness={0.95} />
      </mesh>
      <mesh position={[2.6, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#1a1612" roughness={0.95} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#1e1a14" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function RoomScene3D({
  room,
  roomImageUrl,
  solvedLocks,
  selectedItem,
  onSelectItem,
}: {
  room: Room;
  roomImageUrl: string;
  solvedLocks: Set<string>;
  selectedItem: RoomItem | null;
  onSelectItem: (item: RoomItem) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <pointLight position={[-2, 3, 1]} intensity={0.4} color="#c4a35a" />

      <RoomEnv roomImageUrl={roomImageUrl} />

      {room.items.map((item, i) => (
        <ItemMesh
          key={item.id}
          item={item}
          index={i}
          isSolved={!!item.lock && solvedLocks.has(item.id)}
          isSelected={selectedItem?.id === item.id}
          onSelect={() => onSelectItem(item)}
        />
      ))}

      <FirstPersonController />
    </>
  );
}
