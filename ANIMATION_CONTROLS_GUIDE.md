# GLB Animation Testing System - Documentation

## Overview

This project provides two complementary animation control systems for testing GLB models exported from Blender, specifically designed for React Three Fiber (R3F) applications.

## Features

### 1. Sequential Animation Mode
Perfect for testing launch sequences, cutscenes, or any animations that need to play in a specific order.

### 2. Free Play Mode
Ideal for exploring individual animations with full control over playback speed, looping, and timing.

---

## Sequential Animation Mode

### Purpose
Test animations that need to play sequentially, with each animation stopping on its last frame before advancing to the next.

### Key Behaviors

#### Initial Load
- **First animation (Action_01) loads paused at frame 0**
- Eliminates the "T-pose" problem - model displays in the first keyframe position immediately
- Ready to play on user trigger

#### Playback Flow
1. **Step 1**: Click "Play Step 1" → Action_01 plays to completion, stops on last frame
2. **Step 2**: Click "Next Step" → Advances to Action_02 (paused at frame 0)
3. **Step 3**: Click "Play Step 2" → Action_02 plays to completion, stops on last frame
4. Continue through all actions sequentially
5. Use "Reset" to return to the beginning

### UI Components

**Progress Tracker**
- Visual representation of all animation steps
- Color-coded status:
  - 🟢 Green = Completed steps
  - 🔵 Blue glow = Current active step
  - ⚪ Gray = Upcoming steps

**Step Information Panel**
- Current step number (e.g., "2 / 5")
- Active action name
- Playback status (Playing/Ready)

**Control Buttons**
- **Play Step X**: Plays current animation from start to finish
  - Disabled while animation is playing
- **Next Step**: Advances to next animation
  - Disabled while animation is playing
  - Disabled on last step
- **Reset**: Returns to Action_01, frame 0, paused
  - Disabled while animation is playing

### Console Logging
Check browser DevTools console for detailed information:
- Initialization status
- Animation playback start/finish events
- Step transitions
- Reset operations

---

## Free Play Mode

### Purpose
Explore and test individual animations with full control over playback parameters.

### Features

**Animation Selection**
- Dynamic button generation for each action found in the GLB
- Click any animation name to play it
- Active animation highlighted with blue glow

**Playback Controls**
- **Pause/Resume**: Toggle animation playback
- **Stop**: Stop and reset animation
- **Speed Control**: Slider from 0.1x to 3.0x speed
  - Test slow-motion effects
  - Find timing issues
  - Verify animation pacing
- **Loop Toggle**: Enable/disable looping
  - Test seamless loop points
  - Verify first and last frames align

**Animation Information**
- Current animation name
- Animation duration in seconds
- Real-time playback status

**Blender Tips Section**
Built-in guidance for better animation setup in Blender

---

## Mode Switching

### Toggle Buttons (Top-Left)
- **Sequential Mode**: Activates sequential playback system
- **Free Play Mode**: Activates free exploration system

**Important**: Switching modes will:
- Stop all currently playing animations
- Reset to default state for the selected mode
- Sequential mode reinitializes to Action_01, frame 0

---

## Technical Implementation

### Component Structure

```
src/
├── Model.jsx                          # 3D model component with animation hooks
├── AnimationControls.jsx              # Free play mode controller
├── SequentialAnimationControls.jsx    # Sequential mode controller
├── app.jsx                            # Main app with mode switching
└── style.css                          # UI styling
```

### Animation Data Flow

```
Model.jsx
  ↓ (via onAnimationsLoaded callback)
App.jsx (state management)
  ↓ (conditional rendering based on mode)
AnimationControls.jsx OR SequentialAnimationControls.jsx
  ↓ (direct control of)
Three.js Animation Actions
```

### Key Technical Details

**Animation Control**
- Uses `@react-three/drei`'s `useAnimations` hook
- Direct manipulation of Three.js `AnimationAction` objects
- `clampWhenFinished = true` ensures animations stop on last frame
- `setLoop(2200, 1)` for single playback (LoopOnce)
- `setLoop(2201, Infinity)` for continuous looping (LoopRepeat)

**State Management**
- React hooks for UI state
- Callback pattern for animation data passing
- Event listeners for animation completion detection

**Mixer Events**
- Listens to 'finished' event on AnimationMixer
- Automatic cleanup of event listeners
- Prevents memory leaks

---

## Blender Export Best Practices

### For Sequential Animations

1. **Naming Convention**
   - Use clear, numbered names: `Action_01`, `Action_02`, etc.
   - Names appear in the order Blender exports them

2. **Action Setup**
   - Create actions in Blender's Action Editor
   - Set precise keyframes for start (frame 0) and end
   - Ensure last frame holds the desired pose

3. **Export Settings**
   ```
   Format: glTF Binary (.glb)
   Include:
   ☑ Cameras
   ☑ Selected Objects (if selective export)
   
   Animation:
   ☑ Animation
   ☑ Limit to Playback Range
   ☑ Always Sample Animations
   Animation Mode: "Actions" or "NLA Tracks"
   ```

4. **NLA Track Method** (Recommended for Sequential)
   - Push each action to NLA track
   - Order tracks in desired sequence
   - Export with "NLA Tracks" enabled

5. **Active Actions Method**
   - Select object with animations
   - Export with "Active Actions" enabled
   - Ensures all actions are included

### Testing Loop Points

1. In Blender, set keyframe at frame 0
2. Copy keyframe to final frame
3. Verify smooth transition in Free Play Mode with loop enabled
4. Adjust easing curves if needed

### Armature Considerations

- Use armature bones for skeletal animation
- Avoid relying solely on object transforms
- Test both rest pose and first animation frame
- Ensure proper bone constraints before export

---

## Workflow Examples

### Example 1: Rocket Launch Sequence

```
Action_01: Ignition (boosters light up)
Action_02: Liftoff (vertical movement begins)
Action_03: Booster_Separation (side boosters detach)
Action_04: Stage_Separation (first stage separates)
Action_05: Orbital_Insertion (final positioning)
```

**Testing Process:**
1. Load app → See rocket in pre-ignition pose (Action_01, frame 0)
2. Play Step 1 → Ignition sequence, stops with boosters lit
3. Next Step → Ready for liftoff
4. Play Step 2 → Rocket lifts off, stops mid-flight
5. Continue through sequence
6. Reset to test entire sequence again

### Example 2: Character Animation Suite

```
Action_01: Idle
Action_02: Walk
Action_03: Run
Action_04: Jump
Action_05: Land
```

**Free Play Mode Testing:**
1. Switch to Free Play Mode
2. Test each animation individually
3. Adjust speed to check for issues
4. Enable loop on Idle, Walk, Run to test seamlessness
5. Test Jump → Land transition timing

---

## Troubleshooting

### Model Shows T-Pose on Load
**Issue**: Armature in rest position instead of first animation frame  
**Solution**: Sequential mode automatically fixes this by loading Action_01 at frame 0

### Animation Doesn't Stop on Last Frame
**Issue**: Animation loops or resets to first frame  
**Solution**: Code uses `clampWhenFinished = true` - verify animation has proper end keyframe in Blender

### Some Animations Don't Appear
**Issue**: Actions not exported from Blender  
**Solution**: 
- Push actions to NLA strips before export
- OR enable "Export Animations" → "Active Actions" in GLB export settings
- Verify actions are not muted in Blender

### Animation Plays Too Fast/Slow
**Issue**: Frame rate mismatch  
**Solution**: Use Speed Control slider in Free Play Mode to adjust playback rate

### Switching Modes Causes Glitches
**Issue**: Animations playing when switching modes  
**Solution**: Code automatically stops all animations on mode switch - if issues persist, click Reset

---

## Future Enhancements

Potential additions for future development:

- **Auto-Play Option**: Automatically play through all sequential animations
- **Timeline Scrubbing**: Manual control of animation time
- **Keyframe Markers**: Visual indicators for important keyframes
- **Export Animation Data**: Save animation timing data to JSON
- **Multiple Sequences**: Support for different animation sequences in one model
- **Transition Controls**: Blend between animations with crossfade
- **Annotation System**: Add notes to specific animations or frames

---

## Code References

### Adding New Animation to Model in Blender

1. Select armature
2. Open Action Editor
3. Create new action (+ icon)
4. Name it appropriately (e.g., `Action_06`)
5. Set keyframes
6. Push to NLA strip OR ensure it's active
7. Re-export GLB
8. Reload in app - appears automatically

### Customizing UI Styling

All styles are in `src/style.css`:
- `.sequential-controls` - Sequential mode panel
- `.animation-controls` - Free play mode panel  
- `.mode-toggle` - Mode switching buttons
- Modify colors, sizes, positions as needed

### Accessing Animation Data Programmatically

```javascript
// In Model.jsx or parent component
const { actions, names } = useAnimations(animations, group)

// Get specific action
const action = actions['Action_01']

// Control playback
action.play()
action.pause()
action.stop()
action.reset()

// Set properties
action.timeScale = 2.0  // Double speed
action.setLoop(2200, 1) // Play once
action.clampWhenFinished = true
```

---

## Credits

Built with:
- **React Three Fiber** - R3F for React declarative 3D
- **@react-three/drei** - Useful helpers for R3F
- **Three.js** - 3D graphics library
- **Vite** - Build tool

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify GLB file contains animations (inspect in Blender)
3. Test with Free Play Mode first to isolate issues
4. Check that animation names don't contain special characters

---

**Last Updated**: February 2026  
**Version**: 1.0.0