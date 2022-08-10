import React, { useContext, useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { DBContext } from "../../Backend"
import { GarageContext, NormalSizeText, RedRoundButton, Window } from "../../Styles"






interface TelaDeDescricaoProps {
    visible:boolean,
    areaName:string,
    onLeave?: () => void,
    onFinish?: (text:string) => void,
    onDidExit?: () => void
}


export const TelaDeDescricao = ({visible,areaName,onLeave,onFinish,onDidExit}:TelaDeDescricaoProps) => {

    const paddingTop = useSharedValue(Window.height);
    const paddingBetween = useSharedValue(Window.height);
    const opacity = useSharedValue(0);
    const [shouldShow,setShouldShow] = useState(false);
    const writtenText = useSharedValue('');

    const mainStyle = useAnimatedStyle(() => {
        return {
            top:paddingTop.value,
            position:'absolute',
            alignItems:'center',
            justifyContent:'center',
            alignSelf:'center',
            opacity:opacity.value
        }
    })
    const spacingStyleOne = useAnimatedStyle(() => {
        return {height:paddingBetween.value}
    })
    const spacingStyleTwo = useAnimatedStyle(() => {
        return {height:paddingBetween.value * 1.2}
    })
    const spacingStyleThree= useAnimatedStyle(() => {
        return {height:paddingBetween.value * 1.8}
    })

    useEffect(() => {
        if(visible){
            setShouldShow(true);
            opacity.value = withTiming(1,{duration:800})
            paddingTop.value = withTiming(Window.height/8,{duration:800})
            paddingBetween.value = withTiming(Window.height/20,{duration:800})
        }else {
            opacity.value = withTiming(0,{duration:500})
            paddingTop.value = withTiming(Window.height,{duration:500},(finished) => {
                finished? runOnJS(setShouldShow)(false) : {}
                onDidExit? runOnJS(onDidExit)() : {}
            })
            paddingBetween.value = withTiming(Window.height,{duration:500})
        }
    },[visible])

    return <>{shouldShow && <Animated.View style={mainStyle}>
        <RedRoundButton style={{backgroundColor:'black'}} onPress={() => {
            if(onLeave){
                onLeave();
            }
        }}>
            <NormalSizeText style={{color:'white',paddingHorizontal:'30%',paddingVertical:'4%'}}>{areaName}</NormalSizeText>
        </RedRoundButton>
        <Animated.View style={spacingStyleOne}></Animated.View>
        <NormalSizeText style={{color:'white'}}>Descricao</NormalSizeText>
        <NormalSizeText style={{color:'white',fontSize:12,paddingTop:'2%'}}>(peca, oficina, preco...)</NormalSizeText>
        <Animated.View style={spacingStyleTwo}></Animated.View>
        <ScrollView style={{borderRadius:15,width:'90%',height:Window.height/5,backgroundColor:'white'}}>
            <TextInput onChangeText={(text) => {
                writtenText.value = text;
            }} onPressIn={() => {
                paddingBetween.value = withTiming(Window.height/80,{duration:800})
            }} onEndEditing={() => {
                paddingBetween.value = withTiming(Window.height/20,{duration:800})
            }} style={{padding:'5%',height:'100%'}} multiline></TextInput>
        </ScrollView>
        <NormalSizeText style={{color:'white',fontSize:12,paddingTop:'2%'}}>*opcional</NormalSizeText>
        <Animated.View style={spacingStyleThree}></Animated.View>
        <RedRoundButton onPress={() => {
            if(onFinish){
                onFinish(writtenText.value);
            }
        }}>
            <NormalSizeText style={{margin:'4%',color:'white'}}>Pronto</NormalSizeText>
        </RedRoundButton>
    </Animated.View>}
    </>
}