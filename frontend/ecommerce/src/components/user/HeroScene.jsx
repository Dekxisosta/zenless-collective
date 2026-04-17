import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";

function Room() {
  const { scene } = useGLTF("/models/parcel_korea.glb");
  return <primitive object={scene} scale={1} position={[0, -5, 25]} />;
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, -5, 15], fov: 45 }}>
      <ambientLight intensity={4} />
      <directionalLight position={[5, 50, 5]} intensity={1.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />

      <Float speed={0} rotationIntensity={0.4} floatIntensity={0.6}>
        <Room />
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

useGLTF.preload("/models/parcel_korea.glb");