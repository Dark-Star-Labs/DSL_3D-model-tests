import { useState, useEffect, useCallback } from 'react'

export function SequentialAnimationControls({ actions, names }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize: Load first animation at frame 0 and pause
  useEffect(() => {
    if (!actions || !names || names.length === 0 || initialized) return

    const firstActionName = names[0]
    const firstAction = actions[firstActionName]
    
    if (firstAction) {
      // Stop all animations first
      Object.values(actions).forEach(action => action?.stop())
      
      // Set first animation to first frame and pause
      firstAction.reset()
      firstAction.setLoop(2200, 1) // LoopOnce
      firstAction.paused = true
      firstAction.time = 0
      firstAction.play()
      
      setInitialized(true)
      console.log(`Initialized with ${firstActionName} at first frame`)
    }
  }, [actions, names, initialized])

  // Play current step animation
  const playCurrentStep = useCallback(() => {
    if (!actions || !names || currentStep >= names.length || isPlaying) return

    const actionName = names[currentStep]
    const action = actions[actionName]
    
    if (!action) return

    // Stop all other animations
    Object.values(actions).forEach(a => {
      if (a !== action) a?.stop()
    })

    setIsPlaying(true)
    
    // Reset and play to the end
    action.reset()
    action.setLoop(2200, 1) // LoopOnce
    action.clampWhenFinished = true // Stay on last frame
    action.paused = false
    action.play()

    console.log(`Playing ${actionName} (Step ${currentStep + 1}/${names.length})`)

    // Listen for animation finish
    const mixer = action.getMixer()
    const onFinished = (e) => {
      if (e.action === action) {
        setIsPlaying(false)
        console.log(`${actionName} finished on last frame`)
        mixer.removeEventListener('finished', onFinished)
      }
    }
    mixer.addEventListener('finished', onFinished)

  }, [actions, names, currentStep, isPlaying])

  // Advance to next step
  const nextStep = useCallback(() => {
    if (isPlaying || currentStep >= names.length - 1) return
    
    const nextStepIndex = currentStep + 1
    const nextActionName = names[nextStepIndex]
    const nextAction = actions[nextActionName]
    
    if (nextAction) {
      // Set next animation to first frame and pause
      nextAction.reset()
      nextAction.setLoop(2200, 1)
      nextAction.paused = true
      nextAction.time = 0
      nextAction.play()
      
      setCurrentStep(nextStepIndex)
      console.log(`Advanced to ${nextActionName} (Step ${nextStepIndex + 1}/${names.length})`)
    }
  }, [actions, names, currentStep, isPlaying])

  // Reset to beginning
  const resetSequence = useCallback(() => {
    if (isPlaying) return
    
    // Stop all animations
    Object.values(actions).forEach(action => action?.stop())
    
    // Reset to first animation
    const firstActionName = names[0]
    const firstAction = actions[firstActionName]
    
    if (firstAction) {
      firstAction.reset()
      firstAction.setLoop(2200, 1)
      firstAction.paused = true
      firstAction.time = 0
      firstAction.play()
      
      setCurrentStep(0)
      console.log(`Reset to ${firstActionName}`)
    }
  }, [actions, names, isPlaying])

  if (!names || names.length === 0) {
    return (
      <div className="sequential-controls">
        <div className="seq-section">
          <h3>Sequential Animations</h3>
          <p>No animations found in model</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sequential-controls">
      <div className="seq-section">
        <h3>Sequential Animation Player</h3>
        <p className="seq-description">
          Animations play in order, stopping on the last frame of each action
        </p>
      </div>

      <div className="seq-section">
        <div className="seq-progress">
          <div className="seq-progress-bar">
            {names.map((name, index) => (
              <div
                key={name}
                className={`seq-step ${index === currentStep ? 'current' : ''} ${index < currentStep ? 'completed' : ''}`}
                title={name}
              >
                <div className="seq-step-number">{index + 1}</div>
                <div className="seq-step-name">{name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="seq-info">
          <p>
            <strong>Current Step:</strong> {currentStep + 1} / {names.length}
          </p>
          <p>
            <strong>Action:</strong> {names[currentStep]}
          </p>
          <p>
            <strong>Status:</strong> {isPlaying ? 'Playing...' : 'Ready'}
          </p>
        </div>
      </div>

      <div className="seq-section">
        <div className="seq-controls">
          <button
            className="seq-button primary"
            onClick={playCurrentStep}
            disabled={isPlaying}
            title="Play current animation"
          >
            {isPlaying ? 'Playing...' : `Play Step ${currentStep + 1}`}
          </button>

          <button
            className="seq-button"
            onClick={nextStep}
            disabled={isPlaying || currentStep >= names.length - 1}
            title="Advance to next animation (paused on first frame)"
          >
            Next Step
          </button>

          <button
            className="seq-button reset"
            onClick={resetSequence}
            disabled={isPlaying}
            title="Reset to beginning"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="seq-section tips">
        <h4>How it works:</h4>
        <ul>
          <li>On load: First animation paused at frame 0</li>
          <li>Click "Play Step" to play current animation to its end</li>
          <li>Click "Next Step" to advance (loads next animation at frame 0, paused)</li>
          <li>Each animation stops on its last frame</li>
          <li>Use "Reset" to return to the beginning</li>
        </ul>
      </div>
    </div>
  )
}