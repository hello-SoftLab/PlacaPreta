import React, { useContext, useEffect, useMemo, useState } from "react"
import { View,Text, Pressable, Modal } from "react-native"
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { AppColors,AppConstants,NormalSizeText,styles,Window } from "../Styles";
import { Gesture, GestureDetector, GestureHandlerRootView, NativeViewGestureHandler,PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import { FullWindowOverlay } from "react-native-screens";
import Tubes from '../Components/tubes'
import { DBContext } from "../Backend";
import { PopupCard } from "../Components/PopupCard";
import { CarSelectionPropertiesSelector } from "./CarSelectionPropertiesSelector";

interface SelectionInterface {
    children?:React.ReactNode,
    modelName:string,
    canSelect?:boolean,
    visible:boolean,
    onLeave?: () => void,
    onConfirm?: () => void
}


export const CarSelectionPropertiesView = ({children,modelName,canSelect,visible,onLeave,onConfirm}: SelectionInterface) => {

    const position = useSharedValue(-Window.height);
    const width = useSharedValue(0);
    const height = useSharedValue(0);
    const backGroundWidth = useSharedValue(0);
    const backGroundHeight = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const selectOpacity = useSharedValue(0);
    const selectPosition = useSharedValue(-Window.height);
    

    const selectStyle = useAnimatedStyle(() => {
        return {
            position:'absolute',
            width:Window.width/4,
            height:Window.height/20,
            bottom:selectPosition.value,
            opacity: selectOpacity.value
        }
    })


    const cardRenderItem = () => {

        const [year,setYear] = useState('');
        const [name,setName] = useState('');
        const [modelInformation,setModelInformation] = useState({});
        const db = useContext(DBContext).allCarsDB
        
        useEffect(() => {
            db.readTransaction(tx => {
                tx.executeSql("SELECT * FROM all_cars WHERE model=?",[modelName],(tx,result) => {
                    if(result.rows.length != 0){
                        const obj = result.rows._array[0];
                        setYear(obj['Ano'])
                        setName(obj['model'])
                        const {id,ano,model, ...rest} = obj;
                        const modelData = {};
                        for(const key of Object.keys(rest)){
                            if(rest[key] != null){
                                modelData[key] = rest[key]
                            } 
                        }    
                        setModelInformation(modelData);
                        console.log(`result model => ${result.rows._array[0].model}`)
                    }
                },(tx,err) => {
                    console.log(err);
                    return false;
                })
            })
        },[modelName])


        return <>
            <View style={{alignItems:'center'}}>
                <Text style={{fontSize:AppConstants.yearSize,fontFamily:AppConstants.fontFE,marginBottom:10,marginTop:24}}>{year}</Text>
                <Text style={{fontSize:AppConstants.nameSize + 2,fontFamily:AppConstants.fontFE,textAlign:'center'}}>{name}</Text>
                <Tubes width={'92%'} scaleY={1.3}></Tubes>
            </View>
            <View style={{width:'92%',alignSelf:'center'}}>
                {Object.keys(modelInformation).map((key,index) => {
                    return <View key={"MainView" + index} style={{flexDirection:'row'}}>
                        <View key={'leftMinorView' + index} style={{flex:0.5}}>
                            <NormalSizeText style={{marginVertical:10,lineHeight:30}} key={index}>{key}: </NormalSizeText>
                        </View>
                        <View key={'rightMinorView' + index} style={{flex:0.5,alignItems:'center',justifyContent:'center'}}>
                        <NormalSizeText style={{marginVertical:10,lineHeight:30,fontFamily:AppConstants.fontInter,fontSize:AppConstants.normalSize-2}} key={index + key}>{modelInformation[key]}</NormalSizeText>
                        </View>
                    </View>
                })}
            </View>
        </>
    }
    

    const gestureHandler = (event) => {
            if(event.contentOffset.y > Window.height/7){
                selectPosition.value = withTiming(Window.height/15,{duration:500});
                selectOpacity.value = withTiming(1,{duration:500});
                
            }
            else {
                selectOpacity.value = withTiming(0,{duration:500});
                selectPosition.value = withTiming(-Window.height/5,{duration:500});
            }
        }

    
    

    useEffect(() => {
        if(visible){
            width.value = Window.width/1.2;
            height.value = Window.height;
            backGroundWidth.value = Window.width;
            backGroundHeight.value = Window.height;
            bgOpacity.value = withTiming(1,{duration:500});
            position.value = withTiming(0,{duration:500});
        }
    },[visible])

    const selectRender = () => {

        if(canSelect?.valueOf() != null && canSelect?.valueOf() != undefined){
            if(!canSelect){
                return <></>
            }
        }


        return <Pressable style={{alignSelf:'center',alignItems:'center'}} onPress={() => {
            selectOpacity.value = withTiming(0,{duration:500});
            selectPosition.value = withTiming(-Window.height/5,{duration:500});
            if(onConfirm){
                onConfirm();
            }
        }}>
        <Animated.View style={[styles.selectButton,selectStyle,{bottom:100}]}> 
            <Text style={{fontFamily:AppConstants.fontFE}}>Adicionar</Text>
        </Animated.View>
        </Pressable>

    }


    return <>
    <PopupCard backGroundRender={selectRender()} contentContainerStyle={{borderRadius:15}} visible={visible} paddingBottom={Window.height/18} onExit={onLeave} onScroll={gestureHandler}>
        {cardRenderItem()}
        {children}
    </PopupCard>
</>
}