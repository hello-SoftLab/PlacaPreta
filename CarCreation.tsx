import { NavigationProp } from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState,useRef } from "react";
import { View,Text, Keyboard, Pressable, Modal } from "react-native";
import { styles,Window,AppColors, triggerGarageReRender, GarageContext, AppConstants } from "./Styles";
import { DBContext } from "./Backend";
import { SearchBar } from "@rneui/base";
import { FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated,{LightSpeedInLeft, runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import App from "./App";
import {BlurView} from 'expo-blur';

// Item da escolha de carros (ex. Alpha romeo)
const CarPropertiesFunc = ({item,selected,opacityRef,positionRef,setSelected}) => {

    const styleSelf = useAnimatedStyle(() => {

        if(item.name == selected){
            return {
                backgroundColor:AppColors.yellow
            }
        }

        return {
            backgroundColor:'white'
        }
    });

    const onPress = () => {
        if(item.name != selected){
            setSelected(item.name);
            opacityRef.value = withTiming(1,{duration:500});
            positionRef.value = withTiming(Window.height/25,{duration:500});
        }
        else{
            setSelected('');
            opacityRef.value = withTiming(0,{duration:500});
            positionRef.value = withTiming(0,{duration:500});
        }
        
    }

    return <Pressable style={{flex:1,width:'100%',backgroundColor:'yellow'}} onPress={onPress}>
            <Animated.View style={[{borderWidth:1,padding:10},styleSelf]}>
                <Text style={{marginLeft:10}}>{item.name}</Text>
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
    const [searchText,setSearchText] = useState("");
    const [selected,setSelected] = useState('');
    const postSelectionPopupPosition = useSharedValue(0);
    const postSelectionPopupHeight = useSharedValue(Window.height/5);
    const [modalVisible,setModalVisibility] = useState(false);
    const postSelectionPopupWidth = useSharedValue(Window.width/1.3);
    const postSelectionPopupOpacity = useSharedValue(0);
    const [postSelectionPopupText,setPostSelectionPopupText] = useState('');
    const selectButtonOpacity = useRef(useSharedValue(0)).current;
    const selectButtonPosition = useRef(useSharedValue(0)).current;
    
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(`SELECT name FROM history_of_cars WHERE name LIKE '%${searchText}%' ORDER BY name`,[],(tx,result) =>{
                setData(result.rows._array);
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

    const PostSelectionPopupStyle = useAnimatedStyle(() => {
        return {
            top:postSelectionPopupPosition.value,
            height:postSelectionPopupHeight.value,
            width:postSelectionPopupWidth.value,
            opacity:postSelectionPopupOpacity.value
        }
    });

    const renderItem = ({item}) => { 
        return <CarProperties positionRef={selectButtonPosition} opacityRef={selectButtonOpacity} selected={selected} setSelected={setSelected} item={item}></CarProperties>
    }

    const disablePopup = () => {
        setModalVisibility(false);
    }
    
    return <Animated.View style={styles.container}>
            <Animated.View style={[styles.carCreationContainer,{justifyContent:'flex-start'}]}>
                <View style={{width:'100%'}}>
                    <SearchBar value={searchText} placeholder={"Search for model, brand..."} onChangeText={(text) => { setSearchText(text)}} containerStyle={{backgroundColor:'black',borderBottomWidth:0}}>
                    </SearchBar>
                </View>
                <FlatList windowSize={10} pointerEvents="box-none" style={{width:'100%',borderBottomLeftRadius:10,borderBottomRightRadius:10}} data={data} renderItem={renderItem}></FlatList>
                <Pressable style={{alignSelf:'center',alignItems:'center'}} onPress={() => {
                    /*
                    if(selectButtonPosition.value == 0){
                        return;
                    }
                    db.transaction(tx => {
                        tx.executeSql("SELECT * FROM history_of_cars WHERE name=?",[selected],(tx,result) => {
                            carsDB.transaction(txTwo => {
                                const item = result.rows.item(0);
                                txTwo.executeSql(`INSERT INTO cars (id,name,year,doors,model,years_of_production,image_url,transmission,seats,wheel,motor,max_speed,acceleration,fuel,torque,base_power,max_power) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
                                ,[
                                    Math.floor(Math.random()*1000000),
                                    item['name'],
                                    item['year'],
                                    item['doors'],
                                    item['model'],
                                    item['years_of_production'],
                                    item['image_url'],
                                    item['transmission'],
                                    item['seats'],
                                    item['wheel'],
                                    item['motor'],
                                    item['max_speed'],
                                    item['acceleration'],
                                    item['fuel'],
                                    item['torque'],
                                    item['base_power'],
                                    item['max_power']
                                ],(txTwo,result) => {
                                    triggerGarageReRender(garageData);
                                    navigation.navigate('Garage');
                                });
                            })
                        });
                    })
                    */
                   setModalVisibility(true);
                   postSelectionPopupPosition.value = withTiming(Window.height/4,{duration:500});
                   postSelectionPopupOpacity.value = withTiming(1,{duration:500});
                   
                }}>
                <Animated.View style={[{justifyContent:'center',alignItems:'center',borderRadius:50,position:'absolute',width:Window.width/4,height:Window.height/20,backgroundColor:AppColors.yellow},SelectButtonStyle]}>
                    <Text>Select</Text>
                </Animated.View>
                </Pressable>
                <Modal style={[{position:'absolute',justifyContent:'center',alignContent:'center',alignItems:'center'}]} visible={modalVisible} animationType={'none'} transparent={true}>
                <Animated.View style={[PostSelectionPopupStyle,{borderRadius:50,justifyContent:'center',alignSelf:'center',backgroundColor:AppColors.yellow}]}>
                    <Pressable onPress={() => {
                        
                        postSelectionPopupPosition.value = withTiming(0,{duration:500});
                        postSelectionPopupOpacity.value = withTiming(0,{duration:500},(isFinished) => {
                            if(isFinished){
                                runOnJS(disablePopup)();
                            }
                        });
                    }}>
                        <Text style={{fontSize:AppConstants.nameSize}}>{'<'}</Text>
                    </Pressable>
                    <Text>{postSelectionPopupText}</Text>
                </Animated.View>
                </Modal>
            </Animated.View>
    </Animated.View>
}