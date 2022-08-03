import React from "react"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useAnimatedStyle, useSharedValue,withTiming } from "react-native-reanimated"
import { PopupCard } from "./PopupCard"
import { AppColors, AppConstants, NormalSizeText, RedRoundButton, Window } from "./Styles"
import Tubes from './tubes'


export const ConsertosEAprimoramentos = () => {

    const consertoPosition = useSharedValue(Window.height/2.5)
    const aprimoramentosPosition = useSharedValue(Window.height/4)
    const selectedChoice = useSharedValue(0);

    const consertoStyle = useAnimatedStyle(() => {
        return {
            bottom:withTiming(consertoPosition.value,{duration:500}),
            backgroundColor: selectedChoice.value == 1? AppColors.yellow : AppColors.black
        }
    })

    const aprimoramentosStyle = useAnimatedStyle(() => {
        return {
            bottom:aprimoramentosPosition.value,
            backgroundColor: selectedChoice.value == 2? AppColors.yellow : AppColors.black
        }
    })

    const choices = ['none','conserto','aprimoramento']



    return <>
    <View style={{position:'absolute',top:-30,alignSelf:'center',height:Window.height/3,width:Window.width/1.5,alignItems:'center',borderRadius:15,backgroundColor:AppColors.yellow}}>
        <NormalSizeText style={{marginVertical:10,fontFamily:AppConstants.fontFE,fontSize:14}}>Consertos e aprimoramentos</NormalSizeText>
    </View>
    <View style={{height:Window.height/1.4,borderRadius:15,backgroundColor:'#383838'}}>
    </View>
    <Tubes style={{transform:[{rotateZ:'90deg'}],position:'absolute',alignSelf:'center',opacity:0.5}} color={'black'} width={'200%'} spacing={'20%'} scaleY={1}></Tubes>
    <RedRoundButton style={[{alignSelf:'center',position:'absolute'},consertoStyle]} onPress={() => {
        selectedChoice.value = 1;
    }}>
        <NormalSizeText style={{margin:'4%',color:AppColors.white}}>Conserto</NormalSizeText>
    </RedRoundButton>
    <RedRoundButton style={[{alignSelf:'center',position:'absolute'},aprimoramentosStyle]} onPress={() => {
        selectedChoice.value = 2;
    }}>
        <NormalSizeText style={{margin:'4%',color:AppColors.white}}>Aprimoramento</NormalSizeText>
    </RedRoundButton>
    
    </>
}