import * as React from "react"
import { View } from "react-native"
import Svg, { Defs, G, Path } from "react-native-svg"
import { AppColors } from "./Styles"
/* SVGR has dropped some elements not supported by react-native-svg: style */


interface TubeProps {
  width?:number | string,
  spacing?:number | string,
  scaleY?: number,
  color?: string
}

const SvgComponent = (props : TubeProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 493.36 57.72" width={props.width? props.width : '100%'} height={props.spacing? props.spacing : 50}>
    <Defs></Defs>
    <G id="Camada_2" data-name="Camada 2">
      <G id="Camada_2-2" data-name="Camada 2" stroke={props.color? props.color : AppColors.yellow} strokeWidth={10} scaleY={props.scaleY? props.scaleY : 1.2} >
        <Path 
          className="cls-1"
          d="M63.67 46.62s19 5.76 38.69 4.74c6.72-.35 14.77-.44 22.47-.42 15 0 28.6.54 28.6.54s12.09 1.67 30.21-8.24"
        />
        <Path 
          className="cls-1"
          d="M432.24 9.1c8.56-5.22 19-4 19-4h37.11v46.67h-39.41a17.62 17.62 0 0 1-5.58-.9c-6.19-2.06-14.23-4.41-21.72-10.68-12.64-10.6-19.28-11.81-25.54-11.74h-62.67a12.54 12.54 0 0 0-7.7 2.63c-6.7 5.2-22.38 14.83-31.07 18-6.28 2.26-27.36 2.43-46.6 2.31l-3.4-.09c-18.57 0-39.68-.19-46-1.27-9.1-1.56-24.37-12.77-31.07-18a12.55 12.55 0 0 0-7.7-2.64H97.26c-6.26-.05-12.85 1.15-25.54 11.76-7.49 6.26-15.53 8.61-21.72 10.67a17.62 17.62 0 0 1-5.58.9H5V6.08h37.11s10.45-1.25 19 4"
        />
        <Path
          className="cls-1"
          d="M488.36 28.45S456.7 32 448.19 21.81s-23.4-15.61-27.38-16.5a8 8 0 0 0-1.69-.18h-87.36c-23-1-40.24 13.14-43.17 16.15a4.7 4.7 0 0 1-1.06.82c-11.44 6.55-22.51 6.28-37.38 6.52H243.06c-11.33-.48-26.32-1.62-37.88-8.62 0 0-17-15.37-43.58-14H74.24a7.42 7.42 0 0 0-1.69.19c-4 .88-18.9 6.31-27.38 16.5S5 29.4 5 29.4"
        />
        <Path 
          className="cls-1"
          d="M306.19 9.06a216.21 216.21 0 0 0-38-3.5c-4.85 0-8.85-.37-17.85 0h-7.09c-6.23-.07-12.48-.21-18-.43a101.62 101.62 0 0 0-36 4.86M429.69 45.66s-18.95 5.77-38.69 4.75c-6.72-.35-14.77-.45-22.47-.42-14.95 0-28.6.54-28.6.54s-12.09 1.67-30.21-8.25"
        />
      </G>
    </G>
  </Svg>
)

export default SvgComponent