import { NavigationProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View,Text, Keyboard, Pressable } from "react-native";
import { styles,Window } from "./Styles";
import { DBContext } from "./Backend";
import { SearchBar } from "@rneui/base";
import { FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated,{LightSpeedInLeft, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

// Item da escolha de carros (ex. Alpha romeo)
const CarPropertiesFunc = ({item,selected,setSelected}) => {

    const styleSelf = useAnimatedStyle(() => {

        if(item.name == selected){
            return {
                backgroundColor:'yellow'
            }
        }

        return {
            backgroundColor:'white'
        }
    });

    const onPress = () => {
        setSelected(item.name);
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
    const db = useContext(DBContext).allCarsDB;
    const [searchText,setSearchText] = useState("");
    const [selected,setSelected] = useState('');
    const selectButtonOpacity = useSharedValue(0);
    
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

    const renderItem = ({item}) => { 
        return <CarProperties selected={selected} setSelected={setSelected} item={item}></CarProperties>
    }
    
    return <View style={styles.container}>
            <View style={[styles.carCreationContainer,{justifyContent:'flex-start'}]}>
                <View style={{width:'100%'}}>
                    <SearchBar value={searchText} placeholder={"Search for model, brand..."} onChangeText={(text) => { setSearchText(text)}} containerStyle={{backgroundColor:'black',borderBottomWidth:0}}>
                    </SearchBar>
                </View>
                <FlatList windowSize={10} pointerEvents="box-none" style={{width:'100%'}} data={data} renderItem={renderItem}></FlatList>
                <Animated.View style={{justifyContent:'center',alignItems:'center',borderRadius:50,position:'absolute',width:Window.width/4,height:Window.height/20,backgroundColor:'yellow',bottom:Window.height/15,opacity:selectButtonOpacity.value}}>
                    <Text>Select</Text>
                </Animated.View>
            </View>
    </View>
}