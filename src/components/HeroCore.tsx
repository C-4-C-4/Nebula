"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function RotatingCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // 核心自转
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.5;
      coreRef.current.rotation.x -= delta * 0.2;
    }
    // 外环1旋转
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4;
      ring1Ref.current.rotation.y += delta * 0.1;
    }
    // 外环2反向旋转
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.3;
      ring2Ref.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        {/* 1. 内部核心 (黑体 + 黄色线框) */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#000" roughness={0.1} metalness={0.8} />
          <Edges scale={1} threshold={15} color="#FCEE21" />
        </mesh>

        {/* 2. 外环 1 (细线圈) */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#555" />
        </mesh>

        {/* 3. 外环 2 (带发光的工业环) */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.05, 16, 100]} />
          <meshStandardMaterial color="#333" />
          <Edges scale={1.05} threshold={1} color="#444" />
        </mesh>

        {/* 4. 悬浮粒子 */}
        <Sparkles count={40} scale={6} size={2} speed={0.4} opacity={0.5} color="#FCEE21" />
      </Float>
    </group>
  );
}

export default function HeroCore() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* 灯光设置 */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#FCEE21" />
        
        <RotatingCore />
      </Canvas>
    </div>
  );
}