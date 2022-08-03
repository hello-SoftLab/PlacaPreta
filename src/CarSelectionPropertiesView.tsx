import React, { useContext, useEffect, useMemo, useState } from "react"
import { View,Text, Pressable } from "react-native"
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { AppColors,AppConstants,styles,Window } from "./Styles";
import { Gesture, GestureDetector, GestureHandlerRootView, NativeViewGestureHandler,PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import Tubes from './../assets/svg/tubes';
import { FullWindowOverlay } from "react-native-screens";
import { DBContext } from "./Backend";
import { PopupCard } from "./PopupCard";



export const CarSelectionPropertiesView = ({visible,renderItem,onLeave,onConfirm}) => {

    const position = useSharedValue(-Window.height);
    const width = useSharedValue(0);
    const height = useSharedValue(0);
    const backGroundWidth = useSharedValue(0);
    const backGroundHeight = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const selectOpacity = useSharedValue(0);
    const selectPosition = useSharedValue(-Window.height);
    const lowestPoint = -Window.height/1.7;
    const highestPoint = Window.height/2;

    const style = useAnimatedStyle(() => {
        return {
            top:Window.height/5,
            width:width.value,
            height:height.value
        }
    })

    const scrollStyle = useAnimatedStyle(() => {
        return {
            bottom:position.value
        }
    })

    const bgStyle = useAnimatedStyle(() => {
        return {
            opacity:bgOpacity.value,
            width:backGroundWidth.value,
            height:backGroundHeight.value,
            backgroundColor:'black'
        }
    })

    const selectStyle = useAnimatedStyle(() => {
        return {
            position:'absolute',
            width:Window.width/4,
            height:Window.height/20,
            bottom:selectPosition.value,
            opacity: selectOpacity.value
        }
    })


    const leaveMainWindow = () => {
        const func = (finished) => {
            if(finished){
                width.value = 0;
                height.value = 0;
                backGroundWidth.value = 0;
                backGroundHeight.value = 0;
            }
        }


        position.value = withTiming(-Window.height,{duration:500});
        bgOpacity.value = withTiming(0,{duration:800},(finished) => runOnJS(func)(finished));
    }

    const onChange = () => {
        onLeave();

        leaveMainWindow();        
    }

    

    const gestureHandler = useAnimatedScrollHandler({
        onEndDrag: (event,ctx) => {
            if(event.contentOffset.y < -Window.height/7){
                runOnJS(onChange)();
            }
        },
        onScroll: (event, context) => {
            if(event.contentOffset.y > Window.height/7){
                selectPosition.value = withTiming(Window.height/15,{duration:500});
                selectOpacity.value = withTiming(1,{duration:500});
                
            }
            else {
                selectOpacity.value = withTiming(0,{duration:500});
                selectPosition.value = withTiming(-Window.height/5,{duration:500});
            }
        },
    })

    
    

    useEffect(() => {
        if(visible){
            width.value = Window.width/1.2;
            height.value = Window.height;
            backGroundWidth.value = Window.width;
            backGroundHeight.value = Window.height;
            bgOpacity.value = withTiming(1,{duration:500});
            position.value = withTiming(0,{duration:500});
        }
        else {
            leaveMainWindow();
        }
    },[visible])


    return <>
    <PopupCard visible={visible} paddingBottom={Window.height/18} onExit={onLeave} onScroll={gestureHandler}>
        {renderItem}
    </PopupCard>
    <Pressable style={{alignSelf:'center',alignItems:'center'}} onPress={() => {
        selectOpacity.value = withTiming(0,{duration:500});
        selectPosition.value = withTiming(-Window.height/5,{duration:500});
        if(onConfirm){
            onConfirm();
        }
    }}>
    <Animated.View style={[styles.selectButton,selectStyle]}> 
        <Text style={{fontFamily:AppConstants.fontFE}}>Adicionar</Text>
    </Animated.View>
    </Pressable>
</>
}