import React, { useEffect, useRef, useState } from "react";
import { Platform,Dimensions, StyleProp, ViewStyle, PanResponder, KeyboardAvoidingView, Keyboard } from "react-native";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, View,Text,Modal } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { AnimatedStyleProp, max, measure, runOnJS, runOnUI, useAnimatedGestureHandler, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming,scrollTo, useDerivedValue } from "react-native-reanimated";
import { AppColors} from "../Styles";
import { ConsertosEAprimoramentos } from "../TelaPrincipal/TelaDeConsertosEAprimoramentos/ConsertosEAprimoramentos";
import { useHeaderHeight } from '@react-navigation/elements';


const Window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
};



interface PopupCardProps {
    visible: boolean,
    onScroll?: ((event: NativeScrollEvent) => void),
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
    contentContainerStyle?: StyleProp<ViewStyle>,
    backGroundRender?:React.ReactNode,

}


export const PopupCard = ({backGroundRender,contentContainerStyle,backOpacity,bgColor,scrollable,visible,children,onScroll,initialPos,finalPos,posRelation,onExit,paddingBottom,paddingTop,width} : PopupCardProps) => {
    const position = useSharedValue(initialPos? initialPos : -Window.height);
    const backGroundWidth = useSharedValue(0);
    const backGroundHeight = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const viewRef = useAnimatedRef<Animated.View>();
    const [modalVisible,setModalVisible] = useState(false);
    const currentOffset = useSharedValue(0);
    const lastPosition = useSharedValue(0);
    const currentAccumulatedDistance = useSharedValue(0);
    const [isKeyboardShown,setKeyboardState] = useState(false);
    const scrollviewRef = useAnimatedRef<Animated.ScrollView>();

    useState(() => {
        Keyboard.addListener('keyboardDidShow',() => {
            setKeyboardState(true);
        })

        Keyboard.addListener('keyboardDidHide',() => {
            setKeyboardState(false);
        })
    })

    const style = useAnimatedStyle(() => {
        return {
            width:width? width : Window.width/1.2
        }
    })

    const scrollStyle = useAnimatedStyle(() => {

        let val = {
            height: Platform.OS == "android" ? Window.height * 1.3 : Window.height
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
            width:Window.width,
            height:Window.height,
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
                currentOffset.value = 0;
                currentAccumulatedDistance.value = 0;
                lastPosition.value = 0;
                setModalVisible(false);
            }
        }


        position.value = withTiming(initialPos? initialPos : -Window.height,{duration:500});
        bgOpacity.value = withTiming(0,{duration:800},(finished) => runOnJS(func)(finished));
    }

    const onChange = () => {
        leaveMainWindow();        
    }

    useDerivedValue(() => {
        //console.log(currentAccumulatedDistance.value)
        if(currentAccumulatedDistance.value > Window.height/100 && currentOffset.value == 0 && !isKeyboardShown){
            runOnJS(onChange)();
        }
    })
    
    useEffect(() => {
        if(visible){
            setModalVisible(true);
            
            
            let opacity = 1;
            if(backOpacity?.valueOf() != null ||backOpacity?.valueOf() != undefined){
                opacity = 1 - backOpacity 
            }
            bgOpacity.value = withTiming(opacity,{duration:500});
            position.value = withTiming(finalPos? finalPos : 0,{duration:500});
        }
        else {
            leaveMainWindow();
        }
    },[visible])

    useEffect(() => {
    },[modalVisible])


    
    

        return <>
    <Modal visible={modalVisible} transparent={true}>   
        <Animated.View style={[bgStyle,{position:'absolute',zIndex:-1}]}>
        </Animated.View>
        <Animated.ScrollView onScroll={(event) => {
            currentOffset.value = event.nativeEvent.contentOffset.y;
            if(onScroll){
                onScroll(event.nativeEvent);
            }
        }} onScrollEndDrag={({nativeEvent}) => {
            currentAccumulatedDistance.value = nativeEvent.velocity.y;
        }} ref={scrollviewRef} bounces={false} scrollEnabled={scrollable?.valueOf() == null || scrollable?.valueOf() == undefined? true : scrollable} contentContainerStyle={{flexGrow:1,zIndex:-1}} scrollEventThrottle={1.2} style={[scrollStyle]} showsVerticalScrollIndicator={false}>
                <View style={{height:paddingTop? paddingTop: Window.height/6,zIndex:-1}}></View>
                <Animated.View ref={viewRef} style={[style,{alignSelf:'center',justifyContent:'center',backgroundColor:'white'},contentContainerStyle]}>
                
                    {children}
                    
                </Animated.View>
                <View style={{height:paddingBottom? paddingBottom : Window.height/3,zIndex:-1}}></View>
        </Animated.ScrollView>
        {backGroundRender}
    </Modal>
    </>
}