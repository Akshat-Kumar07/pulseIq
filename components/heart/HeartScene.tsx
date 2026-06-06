"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

interface HeartMeshProps {
  riskColor?: string;
  interactive?: boolean;
}

function HeartGeometry({ riskColor = "#3b82f6", interactive = true }: HeartMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  // Parse color
  const color = new THREE.Color(riskColor);

  useEffect(() => {
    if (!interactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    time.current += delta;

    // Continuous slow rotation
    groupRef.current.rotation.y += delta * 0.3;

    // Camera parallax
    if (interactive) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.15,
        0.05
      );
    }

    // Heartbeat pulse — realistic cardiac rhythm
    const heartbeatPhase = (time.current % 1.0);
    let scale = 1.0;
    if (heartbeatPhase < 0.12) {
      // Systole — quick contraction
      scale = 1.0 + Math.sin((heartbeatPhase / 0.12) * Math.PI) * 0.08;
    } else if (heartbeatPhase < 0.28) {
      // Diastole — relaxation
      scale = 1.0 + Math.sin(((heartbeatPhase - 0.12) / 0.16) * Math.PI) * 0.04;
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(scale);
    }

    // Pulse ring fade
    if (pulseRef.current) {
      const pulseScale = 1 + heartbeatPhase * 1.2;
      pulseRef.current.scale.setScalar(pulseScale);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.35 - heartbeatPhase * 0.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer glow sphere */}
      <Sphere args={[1.45, 64, 64]} ref={outerRef}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.04}
          roughness={0.1}
          metalness={0.3}
        />
      </Sphere>

      {/* Main heart body — distorted sphere */}
      <Sphere args={[1.0, 128, 128]} ref={innerRef}>
        <MeshDistortMaterial
          color={color}
          distort={0.28}
          speed={2.5}
          roughness={0.15}
          metalness={0.6}
          envMapIntensity={1.2}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </Sphere>

      {/* Secondary lobe — atrial region */}
      <mesh position={[0.45, 0.42, -0.1]}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={0.2}
          speed={2.5}
          roughness={0.15}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Second lobe */}
      <mesh position={[-0.42, 0.38, -0.1]}>
        <sphereGeometry args={[0.48, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={0.22}
          speed={2.5}
          roughness={0.15}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Aortic arch — top vessel */}
      <mesh position={[0.05, 1.1, 0]} rotation={[0, 0, 0.1]}>
        <torusGeometry args={[0.25, 0.07, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.5}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Vessels */}
      <mesh position={[0.3, 0.85, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.06, 0.04, 0.45, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[-0.2, 0.88, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.05, 0.035, 0.4, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} emissive={color} emissiveIntensity={0.1} />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[1.1, 1.18, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow point light */}
      <pointLight color={riskColor} intensity={2.5} distance={4} decay={2} position={[0, 0, 0]} />
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 160;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#60a5fa"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

interface HeartSceneProps {
  riskColor?: string;
  interactive?: boolean;
  height?: number | string;
}

export default function HeartScene({
  riskColor = "#3b82f6",
  interactive = true,
  height = 560,
}: HeartSceneProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at center, rgba(59,130,246,0.05) 0%, transparent 70%)",
        }}
      >
        <div className="skeleton" style={{ width: 280, height: 280, borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#4080ff" />
        <spotLight
          position={[0, 8, 4]}
          angle={0.4}
          penumbra={0.8}
          intensity={1.8}
          color={riskColor}
          castShadow
        />

        <Suspense fallback={null}>
          <Float
            speed={1.8}
            rotationIntensity={0.1}
            floatIntensity={0.4}
            floatingRange={[-0.08, 0.08]}
          >
            <HeartGeometry riskColor={riskColor} interactive={interactive} />
          </Float>
          <ParticleField />
          <Stars radius={60} depth={30} count={800} factor={1.5} saturation={0} fade speed={0.6} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Radial glow behind canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${riskColor}12 0%, transparent 65%)`,
          pointerEvents: "none",
          zIndex: -1,
          transition: "background 1s ease",
        }}
      />
    </div>
  );
}
