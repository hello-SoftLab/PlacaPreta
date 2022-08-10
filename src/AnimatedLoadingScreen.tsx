import { Asset } from "expo-asset";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming,Easing } from "react-native-reanimated";
import * as SplashScreen from 'expo-splash-screen'
import * as FileSystem from 'expo-file-system'
import * as Font from 'expo-font'
import { View,Text, Modal} from "react-native";
import {AppConstants} from './Styles'
import { useFonts } from "expo-font";
import { DBContext, InitAllCarsDB, InitDBContext } from "./Backend";


SplashScreen.hideAsync();

function AnimatedSplashScreen({children,image}) {
    const animationVar = useSharedValue(0);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
    const [isFirstAnimationComplete,setFirstAnimationComplete] = useState(false);
    const [startedAnimation,setStartedAnimation] = useState(false);
    const [loadingReady,setLoadingReady] = useState(false);
    const [shouldHideModal,setShouldHideModal] = useState(false);
    const bgOpacity = useSharedValue(1);
    const db = useContext(DBContext);
    
    useFonts({
        'fe-font':require('./../assets/fonts/FE-FONT.ttf'),
        'inter':require('./../assets/fonts/Inter-Regular.ttf')
    });


    const func = (finished) => {
        if(finished){
            setFirstAnimationComplete(true)
        }
    }

    useEffect(() => {
        if(isFirstAnimationComplete){
            animationVar.value = withTiming(1,{duration:100},(finished) => runOnJS(onAnimationEnd)(finished))
        }
    },[isFirstAnimationComplete])

    async function prepare() {
        try {
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            };
            
            await FileSystem.downloadAsync(
            Asset.fromModule(require('./../assets/all_cars.db')).uri,
            FileSystem.documentDirectory + `SQLite/all_cars.db`
            ).then((result) => {
                console.log(`downloaded with ${result.status}`)
                db.garageDB = InitDBContext();
                db.allCarsDB = InitAllCarsDB();
                setAppReady(true);
            });


            
                
            
        }
        catch(err){
            console.log(err);
        }
        finally {
            setLoadingReady(true);
        }
    }



    useEffect(() => {
        if(!startedAnimation){
            animationVar.value = withTiming(1,{duration:2000},finished => runOnJS(func)(finished))
            prepare();
            setStartedAnimation(true);
        }
    }, []);


    

    useEffect(() => {
        if(isSplashAnimationComplete && loadingReady){
            bgOpacity.value = withTiming(0,{duration:1000},(finished) => finished? runOnJS(setShouldHideModal)(true) : {});
        }
    },[isSplashAnimationComplete,loadingReady])

    
    const onAnimationEnd = (finished? : Boolean) => {
        if(finished){
            setAnimationComplete(true);
        }
    }

    const style = useAnimatedStyle(() => {
        return {
            flex:1,
            width:'100%',
            backgroundColor: 'black',
            alignSelf:'center',
            alignContent:'center',
            alignItems:'center',
            justifyContent:'center',
            opacity:bgOpacity.value
        }
    })
    const imageStyle = useAnimatedStyle(() => {
        return {
            opacity:animationVar.value,
            height:'25%',
            aspectRatio:1,
            transform: [
                {
                  scale: animationVar.value,
                },
            ],
        }
    })


    return <View style={{flex:1,alignContent:'center',alignSelf:'center',width:'100%'}}>
        <Modal transparent={true} visible={!shouldHideModal}><Animated.View style={style}>
                <Animated.Image style={imageStyle} source={image}></Animated.Image>
            </Animated.View>
        </Modal>
        {isAppReady && children}
    </View>



}



export function AnimatedAppLoader({ children, image }) {
    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
  }