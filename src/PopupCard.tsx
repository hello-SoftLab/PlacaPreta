import React, { useEffect } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, View } from "react-native";
import Animated, { runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AppColors, Window } from "./Styles";


const enum relativeCardPositions {
    top ='top',
    bottom ='bottom',
    left = 'left',
    right ='right'
}

interface PopupCardProps {
    visible: Boolean,
    onScroll?: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | Animated.Node<(event: NativeSyntheticEvent<NativeScrollEvent>) => void>,
    children?: JSX.Element,
    initialPos?: number,
    finalPos?: number,
    posRelation?:relativeCardPositions,
    onExit?: () => void

}






export const PopupCard = ({visible,children,onScroll,initialPos,finalPos,posRelation,onExit} : PopupCardProps) => {
    const position = useSharedValue(initialPos? initialPos : -Window.height);
    const width = useSharedValue(0);
    const height = useSharedValue(0);
    const backGroundWidth = useSharedValue(0);
    const backGroundHeight = useSharedValue(0);
    const bgOpacity = useSharedValue(0);

    const style = useAnimatedStyle(() => {

        let val = {
            top:Window.height/5,
            width:width.value,
            height:height.value
        }


        return val
    })

    const scrollStyle = useAnimatedStyle(() => {

        let val = {

        }

        if(posRelation){
            val[posRelation] = position.value
        }
        else {
            val['bottom'] = position.value
        }

        return val
    })

    const bgStyle = useAnimatedStyle(() => {
        return {
            opacity:bgOpacity.value,
            width:backGroundWidth.value,
            height:backGroundHeight.value,
            backgroundColor:'black'
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


        position.value = withTiming(initialPos? initialPos : -Window.height,{duration:500});
        bgOpacity.value = withTiming(0,{duration:800},(finished) => runOnJS(func)(finished));
    }

    const onChange = () => {
        if(onExit){
            onExit();
        }
        leaveMainWindow();        
    }

    

    const gestureHandler = useAnimatedScrollHandler({
        onEndDrag: (event,ctx) => {
            if(event.contentOffset.y < -Window.height/7){
                runOnJS(onChange)();
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
            position.value = withTiming(finalPos? finalPos : 0,{duration:500});
        }
        else {
            leaveMainWindow();
        }
    },[visible])


    return <>
    <Animated.View style={[bgStyle,{position:'absolute'}]}>
        <Animated.ScrollView contentContainerStyle={{height:'125%'}} onScroll={onScroll? onScroll : gestureHandler} scrollEventThrottle={1.2} style={scrollStyle} showsVerticalScrollIndicator={false}>
            <Animated.View style={[style,{zIndex:30,borderRadius:15,alignSelf:'center',backgroundColor:AppColors.white,borderWidth:1}]}>
                <View style={{flexDirection:'row',flex:0.2}}>
                    <View style={{flex:1}}>
                        {children}
                    </View>
                </View>
            </Animated.View>
        </Animated.ScrollView>
    </Animated.View>
    </>
}