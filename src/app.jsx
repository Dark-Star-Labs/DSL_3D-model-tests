import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei'
import { Model } from './Model.jsx'
import { AnimationControls } from './AnimationControls.jsx'
import { SequentialAnimationControls } from './SequentialAnimationControls.jsx'

export default function App() {
  const [animationData, setAnimationData] = useState(null)
  const [controlMode, setControlMode] = useState('sequential') // 'sequential' or 'freeplay'

  return (
    <>
      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-button ${controlMode === 'sequential' ? 'active' : ''}`}
          onClick={() => setControlMode('sequential')}
        >
          Sequential Mode
        </button>
        <button
          className={`mode-button ${controlMode === 'freeplay' ? 'active' : ''}`}
          onClick={() => setControlMode('freeplay')}
        >
          Free Play Mode
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 0], fov: 50 }}>
      <color attach="background" args={['#000000']} />

      <PerspectiveCamera makeDefault position={[100, 30, 30]} fov={50} />

      <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={200}
        />

      <Environment preset="sunset" background={false} />

      <directionalLight
        castShadow
        intensity={2}
        position={[10, 10, 5]} 
        shadow-bias={-0.0005}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.01}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10} 
      />

      <Model onAnimationsLoaded={setAnimationData} />

      </Canvas>

      {animationData && controlMode === 'sequential' && (
        <SequentialAnimationControls 
          actions={animationData.actions} 
          names={animationData.names} 
        />
      )}

      {animationData && controlMode === 'freeplay' && (
        <AnimationControls 
          actions={animationData.actions} 
          names={animationData.names} 
        />
      )}
    </>
  )
}