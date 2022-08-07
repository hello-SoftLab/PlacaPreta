import { NavigationProp } from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState,useRef } from "react";
import { View,Text, Keyboard, Pressable, Modal } from "react-native";
import { styles,Window,AppColors, GarageContext, AppConstants, NormalSizeText } from "../Styles";
import { DBContext, DBFunctions } from "../Backend";
import { SearchBar } from "@rneui/base";
import { FlatList, GestureHandlerRootView, NativeViewGestureHandler, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated,{acc, LightSpeedInLeft, runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import App from "../../App";
import {BlurView} from 'expo-blur';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, ListItem } from "react-native-elements";
import { CarSelectionPropertiesView } from "./CarSelectionPropertiesView";
import Tubes from '../Components/tubes';
import { CarSelectionPropertiesSelector } from "./CarSelectionPropertiesSelector";
import { PopupCard } from "../Components/PopupCard";

// Item da escolha de carros (ex. Alpha romeo)
const CarPropertiesFunc = ({item,selected,opacityRef,positionRef,setSelected,modalVisibleVal}) => {
    const historyDB = useContext(DBContext).allCarsDB

    const styleSelf = useAnimatedStyle(() => {

        if(item.model == selected){
            return {
                backgroundColor:AppColors.yellow
            }
        }

        return {
            backgroundColor:'white'
        }
    });

    const onPress = () => {
        if(item.model != selected){
            setSelected(item.model);
            opacityRef.value = withTiming(1,{duration:500});
            positionRef.value = withTiming(Window.height/20,{duration:500});
        }
        else{
            setSelected('');
            opacityRef.value = withTiming(0,{duration:500});
            positionRef.value = withTiming(0,{duration:500});
        }
        
    }

    return <Pressable style={{flex:1,width:'100%',backgroundColor:'yellow'}} disabled={modalVisibleVal} onPress={onPress}>
            <Animated.View style={[{borderWidth:1,padding:10},styleSelf]}>
                <Text style={{marginLeft:10,fontFamily:AppConstants.fontInter}}>{item.model}</Text>
            </Animated.View>
        </Pressable>
    

}

const CarProperties = React.memo(CarPropertiesFunc);



//Tela da escolha de carros
export const CarCreation = ({navigation}) => {

    const [data,setData] = useState([]);
    const garageData = useContext(GarageContext);
    const db = useContext(DBContext).allCarsDB;
    const carsDB = useContext(DBContext).garageDB;
    const insertedCarID = useSharedValue(-1);
    const [searchText,setSearchText] = useState("");
    const [selected,setSelected] = useState('');
    const [modalVisible,setModalVisibility] = useState(false);
    const [customizationVisibility,setCustomizationVisibility] = useState(false);
    const selectButtonOpacity = useRef(useSharedValue(0)).current;
    const selectButtonPosition = useRef(useSharedValue(0)).current;
    const overralOpacity = useSharedValue(1);

    
    

    useEffect(() => {
        
        db.readTransaction(tx => {
            tx.executeSql(`SELECT model FROM all_cars WHERE model LIKE '%${searchText}%' ORDER BY model `,[],(tx,result) =>{
                setData(result.rows._array);
                console.log(result.rows.length)
            },(tx,error) => {
                console.log(`Error ${error.message}`)
                return false;
            });
        });
    },[searchText]);


    const SelectButtonStyle = useAnimatedStyle(() => {
        return {
            bottom:selectButtonPosition.value,
            opacity:selectButtonOpacity.value
        }
    })


    const renderItem = ({item}) => { 
        return <CarProperties modalVisibleVal={modalVisible} positionRef={selectButtonPosition} opacityRef={selectButtonOpacity} selected={selected} setSelected={setSelected} item={item}></CarProperties>
    }
    

    

    const selectButtonPressableCallback = () => {
        if(selectButtonPosition.value == 0){
            return;
        }

        insertedCarID.value = DBFunctions.insertNewCar(selected,carsDB,db,() => {
            console.log(`inserted new car!`)
        });
        
       setModalVisibility(true);
    }

    useEffect(() => {
    },[modalVisible])

    const onLeave = () => {
        if(insertedCarID.value != -1){
            DBFunctions.removeCar(insertedCarID.value,carsDB);
        }
        setModalVisibility(false);
    }

    

    const onPressStyle = useAnimatedStyle(() => {
        return {
            opacity: overralOpacity.value
        }
    })
    

    return <GestureHandlerRootView style={{flex:1}}><Animated.View style={[styles.container]}>
                
            <Animated.View style={[styles.carCreationContainer,onPressStyle,{justifyContent:'flex-start'}]}>
                <View style={{width:'100%'}}>
                    <SearchBar value={searchText} placeholder={"Procure por modelo,marca..."} onChangeText={(text) => {setSearchText(text)}} containerStyle={{backgroundColor:'black',borderBottomWidth:0}}>
                    </SearchBar>
                </View>
                <FlatList scrollEnabled={!modalVisible} windowSize={10} style={{width:'100%',borderBottomLeftRadius:10,borderBottomRightRadius:10}} data={data} renderItem={renderItem}></FlatList>
            </Animated.View>
            </Animated.View>
            <Animated.View style={[{alignSelf:'center',alignItems:'center',position:'absolute'},SelectButtonStyle]}>
                <Pressable style={{alignSelf:'center',alignItems:'center'}} onPress={selectButtonPressableCallback}>
                    <Animated.View style={[{justifyContent:'center',alignItems:'center',borderRadius:50,width:Window.width/4,height:Window.height/20,backgroundColor:AppColors.yellow},SelectButtonStyle]}>
                        <Text style={{fontFamily:AppConstants.fontFE}}>VER</Text>
                    </Animated.View>
                </Pressable>
            </Animated.View>
            <CarSelectionPropertiesView modelName={selected} canSelect={true} visible={modalVisible} onLeave={onLeave} onConfirm={() => {
                setCustomizationVisibility(true);
            }}>
                <CarSelectionPropertiesSelector carID={insertedCarID.value} onGoBack={() => {
                setCustomizationVisibility(false);
                }} visible={customizationVisibility}></CarSelectionPropertiesSelector>
            </CarSelectionPropertiesView>
            
    
    </GestureHandlerRootView>
}