import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'


export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 50 }}>
      <color attach="background" args={['#000000']} />
    </Canvas>
  )
}