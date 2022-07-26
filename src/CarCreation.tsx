import { NavigationProp } from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState,useRef } from "react";
import { View,Text, Keyboard, Pressable, Modal } from "react-native";
import { styles,Window,AppColors, triggerGarageReRender, GarageContext, AppConstants } from "./Styles";
import { DBContext, DBFunctions } from "./Backend";
import { SearchBar } from "@rneui/base";
import { FlatList, GestureHandlerRootView, NativeViewGestureHandler, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated,{acc, LightSpeedInLeft, runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import App from "../App";
import {BlurView} from 'expo-blur';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button } from "react-native-elements";

// Item da escolha de carros (ex. Alpha romeo)
const CarPropertiesFunc = ({item,selected,opacityRef,positionRef,setSelected,modalVisibleVal}) => {
    const historyDB = useContext(DBContext).allCarsDB

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
                <Text style={{marginLeft:10}}>{item.name}</Text>
            </Animated.View>
        </Pressable>
    

}

const CarProperties = React.memo(CarPropertiesFunc);

const AliasQuestionWidget = ({insertedCarID,accepted,denied}) => {

    const carsDB = useContext(DBContext).garageDB;

    return <View style={{alignItems:'center',justifyContent:'space-between',flex:1}}>
    <Text style={{padding:10}}>Qual apelido você gostaria de dar a esse carro?</Text>
    <TextInput style={{backgroundColor:'white',width:'40%',fontSize:20}} onChangeText={(text) => {
        DBFunctions.executeStatement(carsDB,`UPDATE cars SET alias=? WHERE id=?`,[text,insertedCarID]);
    }} key={3}></TextInput>
    <View style={{flexDirection:'row',paddingBottom:5}}>
        <Pressable onPress={() => {
            accepted()
        }}>
            <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
                <Text style={{color:AppColors.white}}>OK</Text>
            </View>
        </Pressable>
    <View style={{flex:0.01}}></View>
        <Pressable onPress={() => {
            denied();
        }}>
        <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
            <Text style={{color:AppColors.white}}>Não quero um apelido</Text>
        </View>
        </Pressable>
    </View>
</View>
}

const LicensePlateQuestionWidget = ({insertedCarID,accepted,denied}) => {

    const carsDB = useContext(DBContext).garageDB;

    return <View style={{alignItems:'center',justifyContent:'space-between',flex:1}}>
    <Text style={{padding:10}}>Qual a placa do carro?</Text>
    <TextInput style={{backgroundColor:'white',width:'27%',fontSize:20}} autoCapitalize={'characters'} maxLength={8} onChangeText={(text) => {
        DBFunctions.executeStatement(carsDB,`UPDATE cars SET license_plate=? WHERE id=?`,[text,insertedCarID]);
    }} key={1}></TextInput>
    <View style={{flexDirection:'row',paddingBottom:5}}>
    <Pressable onPress={() => {
        accepted();
    }}>
        <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
            <Text style={{color:AppColors.white}}>OK</Text>
        </View>
    </Pressable>
    <View style={{flex:0.01}}></View>
    <Pressable onPress={() => {
        denied();
    }}>
    <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
        <Text style={{color:AppColors.white}}>Cancel</Text>
    </View>
    </Pressable>
    </View>
   </View>
}


const AquisitionDateQuestionWidget = ({insertedCarID,accepted,denied}) => {
    const carsDB = useContext(DBContext).garageDB;
    const [datePickerState,setDatePickerState] = useState(false);
    const [datePickerDate,setDatePickerDate] = useState(new Date());
    
    const datePickerOnConfirm = (date) => {
        console.log(JSON.stringify(date));
        setDatePickerDate(date);
        setDatePickerState(false);
    }
    return <View style={{alignItems:'center',justifyContent:'space-between',flex:1}}>
    <Text style={{padding:10}}>Quando você adquiriu o veículo?</Text>
    <TouchableOpacity style={{backgroundColor:'white'}} onPress={() => {
        setDatePickerState(true);
    }}>
        <Text style={{fontSize:AppConstants.normalSize}}>{`${datePickerDate.getMonth() + 1}/${datePickerDate.getFullYear()}`}</Text>
    </TouchableOpacity>
    <View style={{flexDirection:'row',paddingBottom:5}}>
    <Pressable onPress={() => {
        DBFunctions.executeStatement(carsDB,`UPDATE cars SET aquisition_year=?,aquisition_month=? WHERE id=?`,[datePickerDate.getFullYear(),datePickerDate.getMonth()+1,insertedCarID]);
        accepted();
    }}>
        <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
            <Text style={{color:AppColors.white}}>OK</Text>
        </View>
    </Pressable>
    <View style={{flex:0.01}}></View>
    <Pressable onPress={() => {
        denied();
    }}>
    <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
        <Text style={{color:AppColors.white}}>Cancel</Text>
    </View>
    </Pressable>
    </View>
    <DateTimePickerModal display='spinner' date={datePickerDate} mode='date' isVisible={datePickerState == true} onConfirm={datePickerOnConfirm} onCancel={()=> {
                setDatePickerState(false);
            }}>
    </DateTimePickerModal>
   </View>
}

const CarColorQuestionWidget = ({insertedCarID,accepted,denied}) => {

    const carsDB = useContext(DBContext).garageDB;

    return <View style={{alignItems:'center',justifyContent:'space-between',flex:1}}>
        <Text style={{padding:10}}>Qual a cor do veículo?</Text>
        <TextInput style={{backgroundColor:'white',width:'40%',fontSize:20}} onChangeText={(text) => {
            DBFunctions.executeStatement(carsDB,`UPDATE cars SET color=? WHERE id=?`,[text,insertedCarID]);
        }} key={2}></TextInput>
        <View style={{flexDirection:'row',paddingBottom:5}}>
            <Pressable onPress={() => {
                accepted();
            }}>
                <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
                    <Text style={{color:AppColors.white}}>OK</Text>
                </View>
            </Pressable>
        <View style={{flex:0.01}}></View>
            <Pressable onPress={() => {
                denied();
            }}>
            <View style={{borderRadius:10,paddingHorizontal:20,paddingVertical:10,backgroundColor:AppColors.black}}>
                <Text style={{color:AppColors.white}}>Cancel</Text>
            </View>
            </Pressable>
        </View>
   </View>
}


//Tela da escolha de carros
export const CarCreation = ({navigation}) => {

    const [data,setData] = useState([]);
    const garageData = useContext(GarageContext);
    const db = useContext(DBContext).allCarsDB;
    const carsDB = useContext(DBContext).garageDB;
    const insertedCarID = useSharedValue(0);
    const [searchText,setSearchText] = useState("");
    const [selected,setSelected] = useState('');
    const postSelectionPopupPosition = useSharedValue(0);
    const postSelectionPopupHeight = useSharedValue(Window.height/5);
    const [modalVisible,setModalVisibility] = useState(false);
    const postSelectionPopupWidth = useSharedValue(Window.width/1.3);
    const postSelectionPopupOpacity = useSharedValue(0);
    const [questionWidgetState,setQuestionWidgetState] = useState(0);
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
        return <CarProperties modalVisibleVal={modalVisible} positionRef={selectButtonPosition} opacityRef={selectButtonOpacity} selected={selected} setSelected={setSelected} item={item}></CarProperties>
    }

    const disablePopupFunc = () => {
        setModalVisibility(false);
    }

    const disablePopup = () => {
        postSelectionPopupPosition.value = withTiming(0,{duration:500});
        postSelectionPopupOpacity.value = withTiming(0,{duration:500},(isFinished) => {
            if(isFinished){
                postSelectionPopupHeight.value = withTiming(0,{duration:0})
                postSelectionPopupWidth.value = withTiming(0,{duration:0})
                runOnJS(disablePopupFunc)();
            }
        });
    }

    const showSelectButton = () => {
        selectButtonOpacity.value = withTiming(1,{duration:500});
        selectButtonPosition.value = withTiming(Window.height/25,{duration:500});
    };

    const hideSelectButton = () => {
        selectButtonOpacity.value = withTiming(0,{duration:500});
        selectButtonPosition.value = withTiming(0,{duration:500});
    }

    

    
    
    return <GestureHandlerRootView style={{flex:1}}><Animated.View style={styles.container}>
            <Animated.View style={[styles.carCreationContainer,{justifyContent:'flex-start'}]}>
            
                <View style={{width:'100%'}}>
                    <SearchBar value={searchText} placeholder={"Procure por modelo,marca..."} onChangeText={(text) => {setSearchText(text)}} containerStyle={{backgroundColor:'black',borderBottomWidth:0}}>
                    </SearchBar>
                </View>
            
                <FlatList scrollEnabled={!modalVisible} windowSize={10} style={{width:'100%',borderBottomLeftRadius:10,borderBottomRightRadius:10}} data={data} renderItem={renderItem}></FlatList>
                <Pressable style={{alignSelf:'center',alignItems:'center'}} onPress={() => {
                    if(selectButtonPosition.value == 0){
                        return;
                    }
                    insertedCarID.value = DBFunctions.insertNewCar(selected,carsDB,db,() => {
                        console.log(`inserted new car!`)
                    });
                   setModalVisibility(true);

                   postSelectionPopupPosition.value = withTiming(Window.height/4,{duration:500});
                   postSelectionPopupOpacity.value = withTiming(1,{duration:500});
                }}>
                <Animated.View style={[{justifyContent:'center',alignItems:'center',borderRadius:50,position:'absolute',width:Window.width/4,height:Window.height/20,backgroundColor:AppColors.yellow},SelectButtonStyle]}>
                    <Text style={{fontFamily:AppConstants.fontFE}}>Select</Text>
                </Animated.View>
                </Pressable>
                <Animated.View style={[PostSelectionPopupStyle,{position:'absolute',zIndex:30,borderRadius:15,alignSelf:'center',backgroundColor:AppColors.yellow,borderWidth:1}]}>
                    <View style={{flexDirection:'row',flex:0.2}}>
                        <View style={{flex:1}}>
                        </View>
                    </View>
                    {questionWidgetState == 0 && <LicensePlateQuestionWidget
                    insertedCarID={insertedCarID.value}
                    accepted={() => {
                        setQuestionWidgetState(questionWidgetState+1);
                    }}
                    denied={() => {
                        setQuestionWidgetState(0);
                        DBFunctions.removeCar(insertedCarID.value,carsDB);
                        disablePopup();
                    }}></LicensePlateQuestionWidget>}
                    {questionWidgetState == 1 && <AquisitionDateQuestionWidget
                    insertedCarID={insertedCarID.value}
                    accepted={() => {
                        setQuestionWidgetState(questionWidgetState+1);
                    }}
                    denied={() => {
                        setQuestionWidgetState(0);
                        DBFunctions.removeCar(insertedCarID.value,carsDB);
                        disablePopup();
                    }}
                    ></AquisitionDateQuestionWidget>}
                    {questionWidgetState == 2 && <CarColorQuestionWidget
                    insertedCarID={insertedCarID.value}
                    accepted={() => {
                        setQuestionWidgetState(questionWidgetState+1);
                    }}
                    denied={() => {
                        setQuestionWidgetState(0);
                        DBFunctions.removeCar(insertedCarID.value,carsDB);
                        disablePopup();
                    }}
                    ></CarColorQuestionWidget>}
                    {questionWidgetState == 3 && <AliasQuestionWidget insertedCarID={insertedCarID.value} accepted={() => {
                        setQuestionWidgetState(0);
                        navigation.navigate("Garage");
                        }} denied ={()=>{
                        setQuestionWidgetState(0);
                        navigation.navigate("Garage");
                        }}></AliasQuestionWidget> }
                </Animated.View>
            </Animated.View>
            
    </Animated.View>
    </GestureHandlerRootView>
}