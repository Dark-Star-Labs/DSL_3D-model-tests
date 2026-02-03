import React, { CSSProperties } from 'react'
import { useProgress } from '@react-three/drei'

interface LoaderOptions {
  containerStyles: CSSProperties
  innerStyles: CSSProperties
  barStyles: CSSProperties
  dataStyles: CSSProperties
  dataInterpolation: (p: number) => string
  initialState: (active: boolean) => boolean
}

const defaultDataInterpolation = (p: number) => `LOADING ${p.toFixed(0)}%`

export function DSLloader({
  containerStyles,
  innerStyles,
  barStyles,
  dataStyles,
  dataInterpolation = defaultDataInterpolation,
  initialState = (active: boolean) => active,
}: Partial<LoaderOptions>) {
  const { active, progress } = useProgress()
  const progressRef = React.useRef(0)
  const rafRef = React.useRef(0)
  const progressSpanRef = React.useRef<HTMLSpanElement>(null)
  const [shown, setShown] = React.useState(initialState(active))

  React.useEffect(() => {
    let t
    if (active !== shown) t = setTimeout(() => setShown(active), 1000)
    return () => clearTimeout(t)
  }, [shown, active])

  const updateProgress = React.useCallback(() => {
    if (!progressSpanRef.current) return
    progressRef.current += (progress - progressRef.current) / 2
    if (progressRef.current > 0.95 * progress || progress === 100) progressRef.current = progress
    progressSpanRef.current.innerText = dataInterpolation(progressRef.current)
    if (progressRef.current < progress) rafRef.current = requestAnimationFrame(updateProgress)
  }, [dataInterpolation, progress])

  React.useEffect(() => {
    updateProgress()
    return () => cancelAnimationFrame(rafRef.current)
  }, [updateProgress])

  return shown ? (
    <div style={{ ...styles.container, opacity: active ? 1 : 0, ...containerStyles }}>
      <div>
  <div style={{ ...styles.image}}><center><img src="./images/dslBrand/DSL Logo Light and Orange.png" style={{width:'256px'}} ></img></center></div>
        <div style={{ ...styles.inner, ...innerStyles }}>
          <div style={{ ...styles.bar, transform: `scaleX(${progress / 100})`, ...barStyles }}></div>
          <span ref={progressSpanRef} style={{ ...styles.data, ...dataStyles }} />
        </div>
      </div>
    </div>
  ) : null
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 500ms ease',
    transitionDelay: '500ms',
    zIndex: 1000,
  },
  inner: {
    marginTop: '0.8em',
    width: 256,
    height: 4,
    background: '#303030',
    textAlign: 'center',
  },
  bar: {
    height: 4,
    width: '100%',
    background: '#ed1b30',
    transition: 'transform 200ms',
    transformOrigin: 'left center',
  },
  data: {
    display: 'inline-block',
    position: 'relative',
    fontVariantNumeric: 'tabular-nums',
    marginTop: '0.8em',
    color: '#f0f0f0',
    fontSize: '1em',
    fontFamily: '"IBM Plex Mono", "IBM Plex Mono", monospace',
    whiteSpace: 'nowrap',
  },
  image: {
    margin: 'auto',
    display: 'block',
  },

}