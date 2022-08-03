import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle,SlideInDown, useSharedValue, withTiming } from "react-native-reanimated";
import { DBContext } from "./Backend";
import { AnimationsContext, AppConstants, GarageContext, styles, Window } from "./Styles";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";



//card para garagem
export default function Card({item,index,animationValue,viewCarProperties}) { 

    const generalAlpha = useSharedValue(0.2);
    const animationsContext = useContext(AnimationsContext);
    const carouselRef = useContext(GarageContext).carousel;
    const garageData = useContext(GarageContext);
    const [carModel,setCarModel] = useState('');
    const [carYear,setCarYear] = useState('');

    const style = useAnimatedStyle(() => {
        //testing if in detailsAnimation
        const opacity =interpolate(animationValue.value,[-1,0,1],[generalAlpha.value,1,generalAlpha.value],Extrapolate.CLAMP)
        return {opacity}
    },[animationValue]);

    let data = useContext(GarageContext);
    const db = useContext(DBContext).garageDB;
    const navigation = useNavigation();

    

    //Card para adicionar carro
    if(item.id == -1){
        return <Animated.View style={[styles.cardContainer,style,{width:'100%',backgroundColor:'white',flex:1,justifyContent:'center',alignSelf:'center',alignItems:'center'}]}>
                <TouchableWithoutFeedback style={{backgroundColor:'white',justifyContent:'center',alignItems:'center',width:Window.width/5,height:Window.height/10}} onPress={() => {
            navigation.navigate("CarCreation");
        }}>
            <Text style={[{fontSize:40}]}>+</Text>
            </TouchableWithoutFeedback>
        </Animated.View>
    }

    
    return <Pressable style={{flex:1}} onPress={() => {
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM cars WHERE id=?`,[item.id],(tx,result) => {
                garageData.selectedCarProperties = result.rows.item(0);
                viewCarProperties(true)
            });
        })
        
        
    }}>
    <Animated.View entering={SlideInDown} key={item.id} style={[styles.cardContainer,style,{flex:1,backgroundColor:'white',justifyContent:'space-between'}]}>
        <View style={[styles.cardContainer,{flex:0.2,backgroundColor:'white',alignItems:'center'}]}>
            {item.alias != null && item.alias != "" && (() => <>
            <Text style={[styles.generalText,{fontSize:AppConstants.yearSize,marginTop:20,marginBottom:10}]}>{item.year}</Text>
            <Animated.Text style={[styles.generalText,{fontSize:AppConstants.cardAliasSize}]}>{item.alias}</Animated.Text>
            <Text style={[styles.generalText,{fontSize:AppConstants.nameSize,opacity:0.6,textAlign:'center'}]}>{item.model}</Text></>)()}
            {(item.alias == null || item.alias == "") && (() => {
                return <><Text style={[styles.generalText,{fontSize:AppConstants.yearSize,marginTop:20,marginBottom:10}]}>{item.year}</Text>
                <Text style={[styles.generalText,{fontSize:AppConstants.cardAliasSize,textAlign:'center'}]}>{item.model}</Text>
                </>
            })()}
        </View>
        <View>
        </View>
        <View style={[styles.cardContainer,{flex:0.08,backgroundColor:'white',alignItems:'center',justifyContent:'center'}]}>
            <Text style={{fontSize:20}}>Status</Text>
        </View>
    </Animated.View>
    </Pressable>


};