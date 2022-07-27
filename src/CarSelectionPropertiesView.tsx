import React, { useEffect, useMemo, useState } from "react"
import { View } from "react-native"
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { AppColors,Window } from "./Styles";
import { Gesture, GestureDetector, GestureHandlerRootView, NativeViewGestureHandler,PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import Tubes from './../assets/svg/tubes';



export const CarSelectionPropertiesView = ({visible,renderItem,onLeave}) => {

    const position = useSharedValue(-Window.height);
    const width = useSharedValue(0);
    const height = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            bottom:position.value,
            width:width.value,
            height:height.value,
        }
    })

    const onChange = () => {
        onLeave();
        position.value = withTiming(-Window.height,{duration:500});
    }

    

    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event, ctx) => {
          if(event.translationY > 0){
            runOnJS(onChange)()
          }
        },
    });

    
    

    useEffect(() => {
        if(visible){
            width.value = Window.width/1.2;
            height.value = Window.height;
            position.value = withTiming(-Window.height/7,{duration:500});
        }
    },[visible])


    return <PanGestureHandler onGestureEvent={gestureHandler}><Animated.View style={[style,{position:'absolute',zIndex:30,borderRadius:15,alignSelf:'center',backgroundColor:AppColors.white,borderWidth:1}]}>
    <View style={{flexDirection:'row',flex:0.2}}>
        <View style={{flex:1}}>
            {renderItem}
        </View>
    </View>
</Animated.View>
</PanGestureHandler>

}