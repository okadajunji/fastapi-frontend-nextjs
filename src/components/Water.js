"use client";
import * as THREE from "three";
import React, { Suspense, useState, useRef, useMemo } from "react";
import {
  Canvas,
  extend,
  useThree,
  useLoader,
  useFrame,
} from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Water } from "three-stdlib";
import { Text } from "@react-three/drei";

extend({ Water });

function Ocean() {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, "/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta)
  );
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
}

function Box() {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);
  useFrame((state, delta) => {
    ref.current.position.y = 10 + Math.sin(state.clock.elapsedTime) * 20;
    ref.current.rotation.x =
      ref.current.rotation.y =
      ref.current.rotation.z +=
        delta;
  });
  return (
    // <mesh ref={ref} scale={20}>

    <mesh
      ref={ref}
      scale={5}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <boxGeometry args={isHovered ? [3, 3, 3] : [2, 2, 2]} />
      {/* <meshStandardMaterial /> */}
      <meshLambertMaterial color={isHovered ? "lime" : "white"} />
    </mesh>
  );
}

function TextMesh({ message }) {
  return (
    message && (
      <Text
        position={[0, 3, 0]}
        fontSize={15}
        color="#000000"
      >
        {message}
      </Text>
    )
  );
}

export default function App({ message }) {
  return (
    <Canvas
      camera={{ position: [0, 5, 100], fov: 55, near: 1, far: 20000 }}
      style={{ width: "auto", height: "500px" }}
    >
      <directionalLight position={[0, 10, 5]} intensity={3} />
      <pointLight position={[100, 100, 100]} />
      <pointLight position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Ocean />
        <Box />
        <TextMesh message={message} />
      </Suspense>
      <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls />
    </Canvas>
  );
}
