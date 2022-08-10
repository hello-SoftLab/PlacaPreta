import React, { useEffect, useState } from "react"
import { FlatList, KeyboardAvoidingView, View } from "react-native"
import { TouchableOpacity } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue,withTiming } from "react-native-reanimated"
import { PopupCard } from "../../Components/PopupCard"
import { AppColors, AppConstants, NormalSizeText, RedRoundButton, Window } from "../../Styles"
import Tubes, { TubesHeight } from '../../Components/tubes'
import { TelaInicial } from "./TelaInicial"


interface ConsertosEAprimoramentosProps {
    onFinish?: () => void
}

export const ConsertosEAprimoramentos = ({onFinish}:ConsertosEAprimoramentosProps) => {

    return <>
    <View style={{position:'absolute',top:-30,alignSelf:'center',height:Window.height/3,width:Window.width/1.5,alignItems:'center',borderRadius:15,backgroundColor:AppColors.yellow}}>
        <NormalSizeText style={{marginVertical:10,fontFamily:AppConstants.fontFE,fontSize:14}}>Consertos e aprimoramentos</NormalSizeText>
    </View>
    <View style={{height:Window.height/1.4,borderRadius:15,backgroundColor:'#383838'}}>
    </View>
    <View style={{position:'absolute',width:'100%',height:'100%',top:TubesHeight/2 + Window.height/100}}>
        <Tubes style={{transform:[{rotateZ:'90deg'}],position:'absolute',alignSelf:'center',opacity:0.5}} color={'black'} width={'200%'} spacing={'20%'} scaleY={1}></Tubes>
    </View>
    <TelaInicial onFinish={onFinish}></TelaInicial>
    </>
}