import React from "react"
import { View } from "react-native"
import { PopupCard } from "./PopupCard"
import { AppColors, AppConstants, NormalSizeText, Window } from "./Styles"
import Tubes from './tubes'


export const ConsertosEAprimoramentos = () => {
    return <>
    <View style={{position:'absolute',top:-30,alignSelf:'center',height:Window.height/3,width:Window.width/1.5,alignItems:'center',borderRadius:15,backgroundColor:AppColors.yellow}}>
        <NormalSizeText style={{marginVertical:10,fontFamily:AppConstants.fontFE,fontSize:14}}>Consertos e aprimoramentos</NormalSizeText>
    </View>
    <View style={{height:Window.height/1.4,borderRadius:15,backgroundColor:'#383838'}}>
        
    </View>
    <Tubes style={{transform:[{rotateZ:'90deg'}],position:'absolute',alignSelf:'center',opacity:0.5}} color={'black'} width={'200%'} spacing={'20%'} scaleY={1}></Tubes>
    </>
}