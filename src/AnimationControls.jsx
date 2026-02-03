import { useState, useEffect } from 'react'

export function AnimationControls({ actions, names }) {
  const [currentAnimation, setCurrentAnimation] = useState(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isLooping, setIsLooping] = useState(true)

  // Stop all animations when component unmounts or when switching
  useEffect(() => {
    return () => {
      if (actions) {
        Object.values(actions).forEach(action => {
          action?.stop()
        })
      }
    }
  }, [actions])

  const playAnimation = (name) => {
    if (!actions || !actions[name]) return

    // Stop all other animations
    Object.values(actions).forEach(action => {
      action?.stop()
    })

    const action = actions[name]
    action.reset()
    action.setLoop(isLooping ? 2201 : 2200, Infinity) // LoopRepeat : LoopOnce
    action.timeScale = playbackSpeed
    action.play()
    
    setCurrentAnimation(name)
  }

  const stopAnimation = () => {
    if (currentAnimation && actions[currentAnimation]) {
      actions[currentAnimation].stop()
      setCurrentAnimation(null)
    }
  }

  const pauseAnimation = () => {
    if (currentAnimation && actions[currentAnimation]) {
      actions[currentAnimation].paused = !actions[currentAnimation].paused
    }
  }

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
    if (currentAnimation && actions[currentAnimation]) {
      actions[currentAnimation].timeScale = speed
    }
  }

  const handleLoopToggle = () => {
    const newLooping = !isLooping
    setIsLooping(newLooping)
    if (currentAnimation && actions[currentAnimation]) {
      actions[currentAnimation].setLoop(newLooping ? 2201 : 2200, Infinity)
    }
  }

  if (!names || names.length === 0) {
    return (
      <div className="animation-controls">
        <div className="control-section">
          <h3>No Animations Found</h3>
          <p>This model doesn't contain any animations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animation-controls">
      <div className="control-section">
        <h3>Animation Actions ({names.length})</h3>
        <div className="animation-list">
          {names.map((name) => (
            <button
              key={name}
              className={`animation-button ${currentAnimation === name ? 'active' : ''}`}
              onClick={() => playAnimation(name)}
              title={`Play: ${name}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {currentAnimation && (
        <div className="control-section">
          <h3>Playback Controls</h3>
          <div className="playback-controls">
            <button onClick={pauseAnimation} className="control-button">
              Pause/Resume
            </button>
            <button onClick={stopAnimation} className="control-button stop">
              Stop
            </button>
          </div>

          <div className="setting-group">
            <label>
              Speed: {playbackSpeed.toFixed(2)}x
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="speed-slider"
              />
            </label>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isLooping}
                onChange={handleLoopToggle}
              />
              Loop Animation
            </label>
          </div>

          <div className="info-section">
            <p><strong>Current:</strong> {currentAnimation}</p>
            <p><strong>Duration:</strong> {actions[currentAnimation]?.getClip().duration.toFixed(2)}s</p>
          </div>
        </div>
      )}

      <div className="control-section tips">
        <h4>Tips for Blender Setup:</h4>
        <ul>
          <li>Name your actions clearly in Blender's Action Editor</li>
          <li>Push actions to NLA strips before exporting</li>
          <li>Or use "Export Animations" &gt; "Active Actions" in GLB export settings</li>
          <li>Test loop points at keyframe 0 and end for seamless loops</li>
          <li>Use armatures for skeletal animation, not just object transforms</li>
        </ul>
      </div>
    </div>
  )
}