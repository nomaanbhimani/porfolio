import { MeshReflectorMaterial } from '@react-three/drei'

export function ReflectiveFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
                blur={[400, 100]}
                resolution={1024}
                mixBlur={0.8}
                mixStrength={60}
                roughness={0.8}
                depthScale={1.1}
                minDepthThreshold={0.85}
                maxDepthThreshold={1.2}
                color="#050A10"
                metalness={0.6}
                mirror={0.5}
            />
        </mesh>
    )
}
