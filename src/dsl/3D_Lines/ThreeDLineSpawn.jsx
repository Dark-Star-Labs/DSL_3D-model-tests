import { Line, Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export default function ThreeDLineSpawn(props)
{

    const points = []
        points.push(props.start)
        points.push(props.end)

    let underLength = props.underLength
    
    if (underLength == null)
        underLength = 1
    
    const underLine = [props.end[0]+0.1 * underLength , props.end[1], props.end[2]]
    const reverseUnderLine = [props.end[0]-0.1 * underLength, props.end[1], props.end[2]]
        
    let textPosition
    let frontAnchor
    let backAnchor

    const state = useThree()
    let textModifier = 1
    

    if (state.size.width < 900)
    {
        textModifier = 2.5
    }

    if (state.size.width < 600)
    {
        textModifier = 3
    }

    if(!props.reverse)
    {
        points.push(underLine)
        textPosition = [underLine[0], underLine[1] + 0.0025 * textModifier, underLine[2]]
        frontAnchor = 'left'
        backAnchor = 'right'
    }


    if(props.reverse)
    {
        points.push(reverseUnderLine)
        textPosition = [reverseUnderLine[0], reverseUnderLine[1] + 0.0025 * textModifier, reverseUnderLine[2]]  
        frontAnchor = 'right'
        backAnchor = 'left'   
    }
        
    return (
        <>
            <Line
                lineWidth={1}
                points={points}
                color={props.lineColor}
                scale={1}
                transparent={true}
                opacity={lineOpacity}
            />    

            <Text
                position={textPosition}
                rotation={ [ 0, Math.PI, 0 ] }
                height={0.0}
                fontSize={0.01 * textModifier}
                anchorX={frontAnchor}
                anchorY='top-baseline'
                font={'./Montserrat-Thin.ttf'}         
                >
                {props.text}
                <meshStandardMaterial/>
            </Text>
            <Text
                position={textPosition}
                rotation={ [ 0, 0, 0 ] }
                height={0.0}
                fontSize={0.01 * textModifier}
                anchorX={backAnchor}
                anchorY='top-baseline'
                font={'./Montserrat-Thin.ttf'} 
                >
                {props.text}
                <meshStandardMaterial/>
            </Text>
        </>
    )
}

