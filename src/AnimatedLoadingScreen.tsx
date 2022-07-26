import { Asset } from "expo-asset";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming,Easing } from "react-native-reanimated";
import * as SplashScreen from 'expo-splash-screen'
import * as FileSystem from 'expo-file-system'
import * as Font from 'expo-font'
import { View,Text} from "react-native";
import {AppConstants} from './Styles'

//função para mover o cars_data.db do folder assets pro folder dos documentos do celular


SplashScreen.preventAutoHideAsync();

function AnimatedSplashScreen({children,image}) {
    const animationVar = useSharedValue(0);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
    const [isFirstAnimationComplete,setFirstAnimationComplete] = useState(false);


    console.log(`animation val = ${animationVar.value}`)

    const func = (finished) => {
        setFirstAnimationComplete(true)
    }

    useEffect(() => {
        if(isFirstAnimationComplete){
            animationVar.value = withTiming(0,{duration:1000},(finished) => runOnJS(onAnimationEnd)(finished))
        }
    },[isFirstAnimationComplete])

    useEffect(() => {
        if(!isAppReady){
            animationVar.value = withTiming(1,{duration:1000},finished => runOnJS(func)(finished))
            prepare();
        }
        async function prepare() {
            try {
                if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
                };
                
                if(!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'cars_data.db')).exists){
                    await FileSystem.downloadAsync(
                        Asset.fromModule(require('./../assets/cars_data.db')).uri,
                        FileSystem.documentDirectory + `cars_data.db`
                        );
                    }
                    
                console.log("loading fonts")
                await Font.loadAsync({
                    'fe-font':require('./../assets/fonts/FE-FONT.ttf'),
                    'inter':require('./../assets/fonts/Inter-Regular.ttf')
                });
            }
            catch(err){
                console.log(err);
            }
            finally {
                if(isSplashAnimationComplete){
                    await SplashScreen.hideAsync();
                    setAppReady(true);
                }
            }
          }
        
    }, [isAppReady,isSplashAnimationComplete]);
    
    const onAnimationEnd = (finished? : Boolean) => {
        setAnimationComplete(true);
    }

    const style = useAnimatedStyle(() => {
        return {
            flex:1,
            width:'100%',
            backgroundColor: 'black',
            alignSelf:'center',
            alignContent:'center',
            alignItems:'center',
            justifyContent:'center'
        }
    })
    const imageStyle = useAnimatedStyle(() => {
        return {
            opacity:animationVar.value,
            width: "100%",
            height: "100%",
            transform: [
                {
                  scale: animationVar.value,
                },
            ],
        }
    })


    return <View style={{flex:1,alignContent:'center',alignSelf:'center',width:'100%'}}>
        {isAppReady && (children)}
        {!isSplashAnimationComplete && (() => {
            return <Animated.View style={style}>
                <Animated.Image style={imageStyle} source={image}></Animated.Image>
            </Animated.View>
        }
        )()}
    </View>



}



export function AnimatedAppLoader({ children, image }) {
    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
  }