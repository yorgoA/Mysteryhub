"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { RoomScene3D } from "./RoomScene3D";
import type { Room, RoomItem } from "@/data/mysteries/stolen-painting";

type Props = {
  room: Room;
  roomImageUrl: string;
  solvedLocks: Set<string>;
  selectedItem: RoomItem | null;
  onSelectItem: (item: RoomItem) => void;
};

export default function GameRoom3DCanvas({
  room,
  roomImageUrl,
  solvedLocks,
  selectedItem,
  onSelectItem,
}: Props) {
  return (
    <Canvas
      gl={{ antialias: true }}
      shadows
      camera={{ position: [0, 1.6, 1.5], fov: 60 }}
    >
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        }
      >
        <RoomScene3D
          room={room}
          roomImageUrl={roomImageUrl}
          solvedLocks={solvedLocks}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
        />
      </Suspense>
    </Canvas>
  );
}
