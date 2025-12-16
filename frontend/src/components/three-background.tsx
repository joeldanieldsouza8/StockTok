"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function AnimatedPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value = [state.mouse.x * 0.5, state.mouse.y * 0.5]
    }
  })

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Distortion effect
      float dist = distance(uv, vec2(0.5 + uMouse.x * 0.1, 0.5 + uMouse.y * 0.1));
      pos.z += sin(uv.x * 3.0 + uTime * 0.3) * 0.3;
      pos.z += cos(uv.y * 2.0 + uTime * 0.2) * 0.3;
      pos.z += sin(dist * 5.0 - uTime * 0.5) * 0.2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    
    void main() {
      // Teal to blue gradient with animation
      vec3 color1 = vec3(0.2, 0.6, 0.7); // Teal
      vec3 color2 = vec3(0.3, 0.4, 0.8); // Blue
      vec3 color3 = vec3(0.15, 0.3, 0.5); // Dark blue
      
      float mixValue = sin(vUv.x * 2.0 + uTime * 0.1) * 0.5 + 0.5;
      vec3 gradient = mix(color1, color2, vUv.y);
      gradient = mix(gradient, color3, vUv.x * 0.5);
      
      // Add some noise
      float noise = sin(vUv.x * 10.0 + uTime) * cos(vUv.y * 10.0 - uTime) * 0.03;
      
      gl_FragColor = vec4(gradient + noise, 0.15);
    }
  `

  return (
    <mesh ref={meshRef} rotation={[-0.2, 0, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: [0, 0] },
        }}
        transparent
      />
    </mesh>
  )
}

export function ThreeBackground() {
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-60"
      style={{
        background: "linear-gradient(to bottom, oklch(0.99 0.005 240), oklch(0.95 0.01 220))",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true, antialias: true }}>
        <AnimatedPlane />
      </Canvas>
    </div>
  )
}
