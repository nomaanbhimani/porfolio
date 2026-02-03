import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, MeshReflectorMaterial, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// ============================================
// IRON MAN 2 ELEMENT DISCOVERY SCENE
// Floating molecular structures, synthesis particles
// ============================================

// Standard mode: Holographic Globe
function HolographicGlobe() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1
        }
    })

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial
                    color="#001a33"
                    wireframe
                    emissive="#00f0ff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    )
}

// ============================================
// ELEMENT DISCOVERY ANIMATION
// Triangular molecular structure with orbiting particles
// ============================================
function ElementDiscoveryScene({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (active) {
            // Animate progress from 0 to 1 over 2.5 seconds
            const start = Date.now()
            const duration = 2500
            const animate = () => {
                const elapsed = Date.now() - start
                const newProgress = Math.min(elapsed / duration, 1)
                setProgress(newProgress)
                if (newProgress < 1) requestAnimationFrame(animate)
            }
            animate()
        } else {
            setProgress(0)
        }
    }, [active])

    useFrame((state) => {
        if (groupRef.current && active) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
            // Breathing scale
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05
            groupRef.current.scale.setScalar(scale * progress)
        }
    })

    if (!active) return null

    return (
        <group ref={groupRef}>
            {/* Central Core - New Element */}
            <mesh>
                <icosahedronGeometry args={[0.5, 0]} />
                <meshBasicMaterial
                    color="#00F0FF"
                    wireframe
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Inner Glow */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={progress * 0.6} />
            </mesh>

            {/* Orbiting Electron Rings */}
            {[0, 1, 2].map((i) => (
                <group key={i} rotation={[i * Math.PI / 3, i * Math.PI / 6, 0]}>
                    <mesh>
                        <torusGeometry args={[1.2, 0.02, 16, 100]} />
                        <meshBasicMaterial
                            color="#00F0FF"
                            transparent
                            opacity={0.5 * progress}
                        />
                    </mesh>
                    {/* Electrons on ring */}
                    {[0, 1, 2, 3].map((j) => (
                        <mesh key={j} position={[
                            Math.cos(j * Math.PI / 2) * 1.2,
                            Math.sin(j * Math.PI / 2) * 1.2,
                            0
                        ]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshBasicMaterial color="#FFFFFF" />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Floating Synthesis Data Points */}
            {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2
                const radius = 2 + (i % 3) * 0.5
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius,
                            (Math.sin(i * 0.5) - 0.5) * 2,
                            Math.sin(angle) * radius
                        ]}
                    >
                        <boxGeometry args={[0.1, 0.1, 0.1]} />
                        <meshBasicMaterial
                            color={i % 2 === 0 ? "#00F0FF" : "#FFB700"}
                            transparent
                            opacity={0.5 * progress}
                        />
                    </mesh>
                )
            })}

            {/* Light Source */}
            <pointLight distance={10} intensity={progress * 15} color="#00F0FF" />
            <pointLight position={[0, 0, 0]} distance={5} intensity={progress * 10} color="#FFFFFF" />
        </group>
    )
}

// Particle Field with Implosion Effect
function ParticleField({ imploding }: { imploding?: boolean }) {
    const count = 750
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = new THREE.Object3D()
    const expansion = useRef(1)
    const particles = useRef(new Float32Array(count * 3))

    if (particles.current[0] === 0) {
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            particles.current[i3] = (Math.random() - 0.5) * 50
            particles.current[i3 + 1] = (Math.random() - 0.5) * 50
            particles.current[i3 + 2] = (Math.random() - 0.5) * 50
        }
    }

    useFrame((state, delta) => {
        if (!mesh.current) return

        const time = state.clock.getElapsedTime()
        const targetExpansion = imploding ? 0.05 : 1
        expansion.current += (targetExpansion - expansion.current) * delta * 2

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const waveX = Math.sin(time + particles.current[i3 + 1]) * 0.1
            const waveY = Math.cos(time + particles.current[i3]) * 0.1

            const x = (particles.current[i3] * expansion.current) + waveX
            const y = (particles.current[i3 + 1] * expansion.current) + waveY
            const z = (particles.current[i3 + 2] * expansion.current)

            dummy.position.set(x, y, z)
            dummy.lookAt(0, 0, 0)
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        }
        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial
                color={imploding ? "#FFB700" : "#00F0FF"}
                transparent
                opacity={imploding ? 0.9 : 0.6}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

function ReflectiveFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[100, 30]}
                resolution={512}
                mixBlur={0.5}
                mixStrength={20}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.5}
                mirror={0}
            />
        </mesh>
    )
}

interface HolographicBackgroundProps {
    secretMode?: boolean
    initializing?: boolean
}

export function HolographicBackground({ secretMode, initializing }: HolographicBackgroundProps) {
    const showDiscovery = initializing || secretMode

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, transition: 'filter 1s' }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />

                <fog attach="fog" args={['#000814', 5, 30]} />
                <ambientLight intensity={showDiscovery ? 0.1 : 0.5} color="#003459" />

                <spotLight
                    position={[10, 20, 10]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    color="#00A8E8"
                    castShadow
                />

                <pointLight position={[-10, 5, -10]} intensity={1.5} color="#FF6B35" />

                {/* Show Element Discovery during startup/secret, Globe otherwise */}
                {showDiscovery ? (
                    <ElementDiscoveryScene active={showDiscovery} />
                ) : (
                    <HolographicGlobe />
                )}

                <ParticleField imploding={showDiscovery} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <ReflectiveFloor />

                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2 - 0.1}
                    autoRotate
                    autoRotateSpeed={showDiscovery ? 2 : 0.5}
                />

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.3}
                        luminanceSmoothing={0.9}
                        height={300}
                        intensity={showDiscovery ? 3.0 : 1.5}
                    />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
