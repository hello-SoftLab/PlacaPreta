import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Pressable, View,Text } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AppColors, AppConstants, styles, Window } from "./Styles";
import { Pagination } from 'react-native-snap-carousel';
import { TouchableOpacity } from "react-native-gesture-handler";
import ColorPicker , {BrightnessSlider, OpacitySlider, Panel3, Preview} from "reanimated-color-picker";
import { DBContext } from "./Backend";
import DateTimePicker from "react-native-modal-datetime-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Tubes from './tubes';
import { useNavigation } from "@react-navigation/native";
import { PopupCard } from "./PopupCard";

interface Props {
    visible:boolean,
    carID:number,
    onGoBack?: () => void
}


export const CarSelectionPropertiesSelector = ({visible,carID,onGoBack}: Props) => {

    const position = useSharedValue(0);
    const [currentIndex,setIndex] = useState(0);
    const bgOpacity = useSharedValue(0);
    const db = useContext(DBContext).garageDB
    const [onConfirm,setOnConfirm] = useState(() => () => {})
    const [confirmText,setConfirmText] = useState('');
    const navigation = useNavigation();

    const style = useAnimatedStyle(() => {
        return {
            left:position.value
        }
    })

    const onFirstEnter = () => {
        selectPosition.value = withTiming(Window.height/15,{duration:500});
        selectOpacity.value = withTiming(1,{duration:500});
        
    }

    const onPageExit = () => {
        selectPosition.value = withTiming(-Window.height/4,{duration:500});
        selectOpacity.value = withTiming(0,{duration:500});
    }

    const onPastPage = () => {
        const func = (finished) => {
            if(finished){
                setIndex(currentIndex - 1);
                position.value = -Window.width
                position.value = withTiming(0,{duration:500});
                onFirstEnter();
            }
        }
        onPageExit();
        position.value = withTiming(+Window.width,{duration:500},(finished) => runOnJS(func)(finished));
    }

    const onNextPage = () => {

        const func = (finished) => {
            if(finished){
                if(currentIndex != 3){
                    setIndex(currentIndex + 1);
                    position.value = +Window.width
                    position.value = withTiming(0,{duration:500})
                    onFirstEnter();
                }
            }
        }
        onPageExit();
        position.value = withTiming(-Window.width,{duration:500},(finished) => runOnJS(func)(finished));
    }

    useEffect(() => {
        if(visible){
            onFirstEnter();
        }
        else{

            onPageExit();
        }
    },[visible]);

    const selectOpacity = useSharedValue(0);
    const selectPosition = useSharedValue(-Window.height/10);

    useEffect(() => {
        switch(currentIndex){
            case 0:
                setConfirmText('Pronto');
                setOnConfirm(() => () => {
                    db.transaction(tx => {
                        tx.executeSql(`UPDATE cars SET color='?' WHERE id=?`,[chosenColor.value,carID],(tx,result) => {
                            console.log(`Setting color ${chosenColor.value} to carID = ${carID}`)
                        })
                    })
                    onNextPage();
                })
                break
            case 1:
                setConfirmText("Proximo")
                setOnConfirm(() => () => {
                    onNextPage();
                })
                break
            case 2:
                setConfirmText('Certo')
                setOnConfirm(() => () => {
                    onNextPage();
                })
                break
            case 3:
                setConfirmText('TUDO PRONTO')
                setOnConfirm(() => () => {  
                    navigation.navigate('Garage')
                })
                break

        }
        
    },[currentIndex])


    const chosenColor = useSharedValue('#FFFFFF');
    const selectStyle = useAnimatedStyle(() => {
        return {
            width:Window.width/4,
            height:Window.height/20,
            bottom:selectPosition.value,
            opacity: selectOpacity.value
        }
    })

    const firstScreen = () => {

        const onChangeColor = ({hex}) => {
            chosenColor.value = hex;
        }

        

        return <>
        <View style={{alignSelf:'center',width:'70%'}}>
            <Text style={{textAlign:'center',fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize,lineHeight:25}}>coloque a cor do seu carro</Text>
        </View>
        <ColorPicker style={{width:'70%'}} onChange={onChangeColor}>
            <Preview hideInitialColor></Preview>
            <Panel3></Panel3>
            <BrightnessSlider></BrightnessSlider>
        </ColorPicker>
        </>
    }   

    

    const secondScreen = () => {
        return <>
        <View style={{alignSelf:'center',width:'70%'}}>
            <Text style={{textAlign:'center',fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize,lineHeight:25}}>insira quando o carro foi adquirido</Text>
        </View>
        <View style={{flex:0.3}}></View>
        <RNDateTimePicker value={new Date()} mode='date' display='spinner' onChange={(event,date) => {
            const realDate = `${date.getUTCFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            db.transaction(tx => {
                tx.executeSql(`UPDATE cars SET aquisition_date='?' WHERE id=?`,[realDate,carID],(tx,result) => {
                    console.log(`Setting aquisitionDate ${realDate} to carID = ${carID}`)
                },(tx,err) => {
                    console.log(err);
                    return false;
                })
            })
            
        }}></RNDateTimePicker>
        </>
    }
    
    const thirdScreen = () => {
        return <><View style={{alignSelf:'center',width:'70%'}}>
            <Text style={{textAlign:'center',fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize,lineHeight:25}}>Insira o apelido do seu carro</Text>
        </View>
        <View style={{alignSelf:'center',width:'70%'}}>
            <Text style={{textAlign:'center',fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize,lineHeight:25,color:'white'}}>*Opcional</Text>
        </View>
        <View style={{flex:0.2}}>
        </View>
        <View style={{flex:0.2,alignItems:'center'}}>
            <Tubes width={'92%'} scaleY={1.3} color={AppColors.black}></Tubes>
        </View>
        <View style={{flexDirection:'row',flex:0.37,justifyContent:'center',alignItems:'flex-end'}}>
            <TouchableOpacity style={{zIndex:0}} onPress={onNextPage}>
                <View style={[styles.selectButton,{backgroundColor:AppColors.black,alignSelf:'flex-end'}]}>
                    <Text style={{fontFamily:AppConstants.fontFE,color:AppColors.white,textAlign:'center'}}>NAO, Obrigado</Text>
                </View>
            </TouchableOpacity>
        </View>
        </>
    }

    const fourthScreen = () => {
        return <><View style={{alignSelf:'center',width:'70%'}}>
        <Text style={{textAlign:'center',fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize,lineHeight:25}}>insira a placa</Text>
        </View>
        <View style={{alignSelf:'center',width:'70%'}}>
            <Text style={{textAlign:'center',fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize,lineHeight:25,color:'white'}}>*Opcional</Text>
        </View>
        <View style={{flex:0.4}}>
        </View>
        <View style={{flexDirection:'row',flex:0.37,justifyContent:'center',alignItems:'flex-end'}}>
            <TouchableOpacity style={{zIndex:0}} onPress={() => {
                navigation.navigate("Garage")
            }}>
                <View style={[styles.selectButton,{backgroundColor:AppColors.black,alignSelf:'flex-end'}]}>
                    <Text style={{fontFamily:AppConstants.fontFE,color:AppColors.white,textAlign:'center'}}>NAO, Obrigado</Text>
                </View>
            </TouchableOpacity>
        </View>
        </>
    }

    const selectRender = () => {
        return <Animated.View style={[{position:'absolute',alignSelf:'center'},selectStyle]}>
        <TouchableOpacity style={{alignSelf:'center',alignItems:'center'}} onPress={() => {
            if(currentIndex != 3){
                onNextPage();
                return;
            }
            if(onConfirm){
                onConfirm();
            }
            
        }}>
                <Animated.View style={[styles.selectButton,{backgroundColor:'white'}]}> 
                    <Text style={{fontFamily:AppConstants.fontFE}}>{confirmText}</Text>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    }


    return <PopupCard backGroundRender={selectRender()} posRelation="right" initialPos={-Window.width} finalPos={0} contentContainerStyle={{backgroundColor:'black',height:'65%'}} scrollable={false} visible={visible}>
            <Animated.View style={[{flex:1,backgroundColor:AppColors.yellow,borderRadius:15},style]}>
            <View style={{flexDirection:'row',flex:0.2}}>
                <View style={{flex:1}}>
                    <View style={{position:'absolute'}}>
                    <TouchableOpacity onPress={() => {
                        if(currentIndex == 0){
                            if(onGoBack){
                                onGoBack();
                            }
                        }
                        else {
                            onPastPage();
                        }
                    }}>
                        <View style={{width:Window.width/13,height:Window.width/13,borderRadius:Window.width/26,backgroundColor:'black',opacity:0.2,margin:18}}>

                        </View>
                    </TouchableOpacity>
                    </View>
                    <Pagination dotsLength={[1,2,3,4].length} activeDotIndex={currentIndex} dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}inactiveDotStyle={{
                    width:9,height:9,
                    borderRadius:4.5,backgroundColor:'rgb(0,0,0)'
                }} inactiveDotOpacity={0.4} inactiveDotScale={0.9}>

                    </Pagination>
                </View>
            </View>
            {(currentIndex == 0) &&  firstScreen()}
            {(currentIndex == 1) &&  secondScreen()}
            {currentIndex == 2 && thirdScreen()}
            {currentIndex == 3 && fourthScreen()}
            
            </Animated.View>
    </PopupCard>
    




}