import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated , {measure, runOnJS, runOnUI, useAnimatedRef, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';


interface AccordionProps {
  headerStyle?:StyleProp<ViewStyle>,
  headerTitle:string,
  children?: React.ReactNode,
  contentStyle?:StyleProp<ViewStyle>,
  duration?:number
}

export const Accordion = ({children,headerStyle,headerTitle,contentStyle,duration} : AccordionProps) => {

  const viewRef = useAnimatedRef<View>();
  const isOpen = useSharedValue(false);
  const height = useSharedValue(0);
  const oldHeight = useSharedValue(0);
  const progress = useDerivedValue(() => 
    isOpen.value? duration? withTiming(1,{duration:duration}) : withTiming(1) : duration? withTiming(0,{duration:duration}) : withTiming(0)
  )


  const style = useAnimatedStyle(() => {

    if(oldHeight.value === 0){
      return {
        opacity: 0.1
      }
    }

    return {
      height: height.value * progress.value + 0.1,
      opacity: 1
    }
  })

  return <>
  <TouchableOpacity onPress={() => {
    isOpen.value = !isOpen.value
  }}>
    <View style={[{borderWidth:1,alignItems:'center',borderRadius:5},headerStyle]}>
      <Text style={{margin:10}}>{headerTitle}</Text>
    </View>
  </TouchableOpacity>
  <Animated.View  style={[contentStyle,{overflow:'hidden',width:'100%'},style]} onLayout={() => {
    if(height.value === 0 || height.value > oldHeight.value){
      runOnUI(() => {
        'worklet';
        height.value = measure(viewRef).height
        if(oldHeight.value === 0){
          oldHeight.value = height.value;
        }
      })()
    }
    
  }}>
    <View ref={viewRef} style={{width:'100%'}}>
      {children}
    </View>
  </Animated.View>  
  </>
}