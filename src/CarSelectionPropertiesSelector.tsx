import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AppColors, Window } from "./Styles";
import { Pagination } from 'react-native-snap-carousel';

interface Props {
    visible:Boolean,
    carID:number
}


export const CarSelectionPropertiesSelector = ({visible,carID}: Props) => {

    const position = useSharedValue(+Window.height);
    const width = useSharedValue(0);
    const height = useSharedValue(0);
    const backGroundWidth = useSharedValue(0);
    const backGroundHeight = useSharedValue(0);
    const bgOpacity = useSharedValue(0);


    const onQuit = () => {
        width.value = 0;
        height.value = 0;
        backGroundWidth.value = 0;
        backGroundHeight.value = 0;
    }

    useEffect(() => {
        if(visible){
            width.value = Window.width/1.2;
            height.value = Window.height/1.38;
            backGroundWidth.value = Window.width;
            backGroundHeight.value = Window.height;
            bgOpacity.value = withTiming(1,{duration:500});
            position.value = withTiming(0,{duration:500});
        }
        else{
            
            bgOpacity.value = withTiming(0,{duration:500},() => runOnJS(onQuit)());
            position.value = withTiming(+Window.width,{duration:500});
        }
    },[visible]);

    const style = useAnimatedStyle(() => {
        return {
            top:Window.height/8,
            left:position.value,
            width:width.value,
            height:height.value
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




    return <Animated.View style={[bgStyle,{position:'absolute'}]}>
        <Animated.View style={[style,{zIndex:30,borderRadius:15,alignSelf:'center',backgroundColor:AppColors.yellow,borderWidth:1}]}>
            <View style={{flexDirection:'row',flex:0.2}}>
                <View style={{flex:1}}>
                    <Pressable>
                        <View style={{position:'absolute',width:Window.width/13,height:Window.width/13,borderRadius:Window.width/26,backgroundColor:'black',opacity:0.2,margin:18}}>

                        </View>
                    </Pressable>
                    <Pagination dotsLength={[1,2,3,4].length} activeDotIndex={0} dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}inactiveDotStyle={{
                    width:8,height:8,
                    borderRadius:4,backgroundColor:'rgb(0,0,0)'
                }} inactiveDotOpacity={0.4}>

                    </Pagination>
                </View>
            </View>
        </Animated.View>
</Animated.View>
    




}