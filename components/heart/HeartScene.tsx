"use client";

import { useRef, useEffect, Suspense, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

interface HeartMeshProps {
  riskColor?: string;
  interactive?: boolean;
}

function HeartGeometry({ riskColor = "#ef4444", interactive = true }: HeartMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  // Parse color
  const color = new THREE.Color(riskColor);

  // Define heart shape in 2D and extrude it to 3D
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Path coordinates for a perfect heart shape
    shape.moveTo(0, 0.4);
    shape.bezierCurveTo(0.15, 0.75, 0.7, 0.75, 0.7, 0.2);
    shape.bezierCurveTo(0.7, -0.3, 0.15, -0.65, 0, -0.9);
    shape.bezierCurveTo(-0.15, -0.65, -0.7, -0.3, -0.7, 0.2);
    shape.bezierCurveTo(-0.7, 0.75, -0.15, 0.75, 0, 0.4);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    geo.center();
    return geo;
  }, []);

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
    groupRef.current.rotation.y += delta * 0.4;

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
    if (outerRef.current) {
      outerRef.current.scale.setScalar(scale * 1.15);
    }

    // Pulse ring fade
    if (pulseRef.current) {
      const pulseScale = 1.1 + heartbeatPhase * 1.6;
      pulseRef.current.scale.setScalar(pulseScale);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.45 - heartbeatPhase * 0.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer glow heart */}
      <mesh geometry={geometry} ref={outerRef}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main heart body — distorted 3D heart shape */}
      <mesh geometry={geometry} ref={innerRef}>
        <MeshDistortMaterial
          color={color}
          distort={0.08}
          speed={1.5}
          roughness={0.15}
          metalness={0.5}
          envMapIntensity={1.2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow point light */}
      <pointLight color={color} intensity={4.5} distance={4} decay={2} position={[0, 0, 0]} />
    </group>
  );
}

function ParticleField({ color = "#ef4444" }: { color?: string }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 160;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

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
        color={color}
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
  riskColor = "#ef4444",
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
          background: `radial-gradient(circle at center, ${riskColor}0d 0%, transparent 70%)`,
        }}
      >
        <div className="skeleton" style={{ width: 280, height: 280, borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
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
        <pointLight color={riskColor} intensity={3.5} distance={5} decay={2} position={[0, 0, 1.5]} />

        <Suspense fallback={null}>
          <Float
            speed={1.8}
            rotationIntensity={0.1}
            floatIntensity={0.4}
            floatingRange={[-0.08, 0.08]}
          >
            <HeartGeometry riskColor={riskColor} interactive={interactive} />
          </Float>
          <ParticleField color={riskColor} />
          <Stars radius={60} depth={30} count={800} factor={1.5} saturation={0} fade speed={0.6} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Radial glow behind canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${riskColor}38 0%, ${riskColor}0d 45%, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: -1,
          transition: "background 1s ease",
        }}
      />
    </div>
  );
}
