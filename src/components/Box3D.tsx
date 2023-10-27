'use client'
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

// TypeScript 用のコンポーネント
const Box = () => {
  const ref = useRef<Mesh>(null); // ref の型を指定
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* ここで小文字の 'boxBufferGeometry' を使用 */}
      <boxGeometry args={isHovered ? [3, 3, 3] : [2, 2, 2]} />

      <meshLambertMaterial color={isHovered ? "lime" : "white"} />
    </mesh>
  );
};

// TypeScript 用のコンポーネント
const App: React.FC = () => {
  return (
    // <Canvas dpr={2}>
    <Canvas dpr={2} style={{ width: '50px', height: '50px' }}>

      <color attach="background" args={["#121212"]} />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.5} position={[-10, 10, 10]} />
      <Box />
    </Canvas>
  );
};

export default App;
