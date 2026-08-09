"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// A single floating glass card
function GlassCard({ position, rotation, scale, color }: any) {
  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1.5, 2, 0.05]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={1}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color={color}
        />
      </mesh>
    </Float>
  );
}

// The Tunnel scene that moves based on scroll
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Custom scroll tracking that doesn't hijack DOM
  const scrollOffset = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress. Let's base it on the first 1200px of scroll.
      const raw = window.scrollY / 1200;
      scrollOffset.current = Math.min(Math.max(raw, 0), 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // initialize
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme colors for cards
  const colors = ["#22d3ee", "#818cf8", "#f472b6", "#34d399"];

  // Generate 80 random cards along the Z-axis corridor
  const cards = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 80; i++) {
      // Create a tunnel shape
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6; // Cards are 3 to 9 units away from center
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Spread out along Z axis from 0 to -120
      const z = -Math.random() * 120; 
      
      const rx = Math.random() * Math.PI;
      const ry = Math.random() * Math.PI;
      const scale = 0.5 + Math.random() * 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({ position: [x, y, z], rotation: [rx, ry, 0], scale, color });
    }
    return temp;
  }, []);

  // Generate some stardust particles
  const particles = useMemo(() => {
    const temp = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 30;     // x
      temp[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
      temp[i * 3 + 2] = 10 - Math.random() * 140;   // z
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    // scrollOffset.current goes from 0 to 1
    const offset = scrollOffset.current;
    
    // Move the group forward to simulate flying through
    if (groupRef.current) {
      // Fly up to Z = 100
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, offset * 100, delta * 4);
    }
    
    // Slowly rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#818cf8" />
      
      <group ref={groupRef}>
        {cards.map((props, i) => (
          <GlassCard key={i} {...props} />
        ))}
        
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.4} />
        </points>
      </group>

      <Environment preset="city" />
      {/* Fog to hide the end of the tunnel */}
      <fog attach="fog" args={["#09090b", 10, 60]} />
    </>
  );
}

export function CanvasScrollWorld() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none bg-zinc-950">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: "transparent" }}>
        <Scene />
      </Canvas>
    </div>
  );
}
