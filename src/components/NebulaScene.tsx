"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Line, Float } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

type NodeType = "POST" | "FRIEND";

interface NebulaNode {
  id: string;
  label: string;
  type: NodeType;
  link: string;
  date?: string;
}

// === 1. 节点组件 (保持之前的卡片样式) ===
function DataNode({ position, data }: { position: [number, number, number]; data: NebulaNode }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const color = data.type === "POST" ? "#FCEE21" : "#00F0FF";

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (hovered ? 2 : 0.5);
      meshRef.current.rotation.y += delta * (hovered ? 2 : 0.5);
    }
  });

  return (
    <group>
      <Line
        points={[[0, 0, 0], position]}
        color={color}
        opacity={hovered ? 0.5 : 0.05}
        transparent
        lineWidth={1}
      />
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh
          ref={meshRef}
          position={position}
          onClick={() => router.push(data.link)}
          onPointerOver={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = "auto"; setHovered(false); }}
        >
          <tetrahedronGeometry args={[hovered ? 0.5 : 0.25]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 0.5} wireframe={true} />
          
          <Html distanceFactor={8} zIndexRange={[100, 0]}>
            <div className={`pointer-events-none select-none transition-all duration-300 origin-bottom-left ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-50"} w-72`}>
              <div className={`border-2 bg-black/90 backdrop-blur-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] ${data.type === "POST" ? "border-[#FCEE21] text-[#FCEE21]" : "border-[#00F0FF] text-[#00F0FF]"}`}>
                <div className="flex justify-between items-center mb-2 border-b border-current pb-1 opacity-80">
                   <span className="text-xs font-mono font-bold">[{data.type}]</span>
                   <span className="text-xs font-mono">{data.date || "N/A"}</span>
                </div>
                <div className="text-lg font-bold leading-tight uppercase tracking-wider text-white">
                  {data.label}
                </div>
                <div className="mt-2 text-[10px] opacity-60 font-mono text-right">&gt; CLICK_TO_ACCESS</div>
              </div>
              <div className={`w-12 h-[2px] ${data.type === "POST" ? "bg-[#FCEE21]" : "bg-[#00F0FF]"}`} />
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
}

// === 2. 戴森球核心组件 (新) ===
function DysonSphere() {
  const shell1 = useRef<THREE.Mesh>(null); // 内层复杂网格
  const shell2 = useRef<THREE.Mesh>(null); // 外层框架
  const ring1 = useRef<THREE.Mesh>(null);  // 轨道环

  useFrame((state, delta) => {
    // 不同层级不同方向旋转，制造机械感
    if (shell1.current) {
      shell1.current.rotation.y += delta * 0.1;
      shell1.current.rotation.x += delta * 0.05;
    }
    if (shell2.current) {
      shell2.current.rotation.y -= delta * 0.08;
      shell2.current.rotation.z += delta * 0.05;
    }
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.15;
      ring1.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      {/* 1. 恒星核心 (高亮发光球) */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#FCEE21" emissive="#FCEE21" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* 核心光源 */}
      <pointLight distance={30} intensity={8} color="#FCEE21" decay={2} />

      {/* 2. 内层能量网 (细密的黄色线框) */}
      <mesh ref={shell1}>
        <icosahedronGeometry args={[1.1, 2]} /> {/* detail=2 让网格更密 */}
        <meshBasicMaterial color="#FCEE21" wireframe transparent opacity={0.15} />
      </mesh>

      {/* 3. 外层结构架 (白色粗线框，正二十面体) */}
      <mesh ref={shell2}>
        <icosahedronGeometry args={[1.6, 0]} /> {/* detail=0 结构更简单硬朗 */}
        <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={0.3} />
      </mesh>

      {/* 4. 机械轨道环 */}
      <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.4, 0.02, 64, 100]} />
        <meshBasicMaterial color="#555" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// === 3. 场景布局 ===
function SceneContent({ nodes }: { nodes: NebulaNode[] }) {
  const groupRef = useRef<THREE.Group>(null);

  // 整体星云缓慢旋转
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  // 斐波那契球分布算法
  const layout = useMemo(() => {
    const points: { position: [number, number, number]; data: NebulaNode }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    nodes.forEach((node, i) => {
      const radius = node.type === "POST" ? 8 : 12; 
      const y = 1 - (i / (nodes.length - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      points.push({ position: [x * radius, y * radius, z * radius], data: node });
    });
    return points;
  }, [nodes]);

  return (
    <group ref={groupRef}>
      {/* 替换原本的 mesh 为新的戴森球组件 */}
      <DysonSphere />
      
      {layout.map((item) => (
        <DataNode key={item.data.id} position={item.position} data={item.data} />
      ))}
    </group>
  );
}

export default function NebulaScene({ nodes }: { nodes: NebulaNode[] }) {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 22], fov: 45 }}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 15, 60]} />
        
        <ambientLight intensity={0.2} />
        
        {/* 背景星空 */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <SceneContent nodes={nodes} />
        
        {/* 控制器 */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={10} 
          maxDistance={40}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}