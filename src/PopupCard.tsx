import React, { useEffect } from "react";
import { Dimensions, Modal, StyleProp, ViewStyle } from "react-native";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, View } from "react-native";
import Animated, { AnimatedStyleProp, max, measure, runOnJS, runOnUI, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AppColors} from "./Styles";


const Window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
};



interface PopupCardProps {
    visible: boolean,
    onScroll?: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | Animated.Node<(event: NativeSyntheticEvent<NativeScrollEvent>) => void>,
    children?: React.ReactNode,
    initialPos?: number,
    finalPos?: number,
    posRelation?:string,
    onExit?: () => void,
    width?: number,
    paddingTop?:number | string,
    paddingBottom?: number | string,
    scrollable?: boolean,
    bgColor?: string,
    backOpacity?: number,
    contentContainerStyle?: StyleProp<ViewStyle>

}


export const PopupCard = ({contentContainerStyle,backOpacity,bgColor,scrollable,visible,children,onScroll,initialPos,finalPos,posRelation,onExit,paddingBottom,paddingTop,width} : PopupCardProps) => {
    const position = useSharedValue(initialPos? initialPos : -Window.height);
    const height = useSharedValue(0);
    const calculatedHeight = useSharedValue(0);
    const backGroundWidth = useSharedValue(0);
    const backGroundHeight = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const viewRef = useAnimatedRef<Animated.View>();

    const style = useAnimatedStyle(() => {
        return {
            width:width? width : Window.width/1.2
        }
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
                backGroundWidth.value = 0;
                backGroundHeight.value = 0;
                if(onExit){
                    onExit();
                }
            }
        }


        position.value = withTiming(initialPos? initialPos : -Window.height,{duration:500});
        bgOpacity.value = withTiming(0,{duration:800},(finished) => runOnJS(func)(finished));
    }

    const onChange = () => {
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
            backGroundWidth.value = Window.width;
            backGroundHeight.value = Window.height;
            bgOpacity.value = withTiming(backOpacity? 1- backOpacity : 1,{duration:500});
            position.value = withTiming(finalPos? finalPos : 0,{duration:500});
        }
        else {
            leaveMainWindow();
        }
    },[visible])


    return <>
    <Modal visible={visible} transparent={true}>
    <Animated.View style={[bgStyle,{position:'absolute'}]}>
    </Animated.View>
    <Animated.ScrollView contentContainerStyle={{flexGrow:1}}  onScroll={onScroll? onScroll : gestureHandler} scrollEventThrottle={1.2} style={[scrollStyle]} showsVerticalScrollIndicator={false}>
        <View style={{height:paddingTop? paddingTop: Window.height/6}}></View>
        <Animated.View ref={viewRef} style={[style,{alignSelf:'center',justifyContent:'center',backgroundColor:'white'},contentContainerStyle]}>
                    {children}
        </Animated.View>
        <View style={{height:paddingBottom? paddingBottom : Window.height/3}}></View>
    </Animated.ScrollView>
    </Modal>
    </>
}