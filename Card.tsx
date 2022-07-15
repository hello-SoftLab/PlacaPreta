import React, { useContext, useEffect } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle,SlideInDown, useSharedValue } from "react-native-reanimated";
import { DBContext } from "./Backend";
import { GarageContext, styles, Window } from "./Styles";
// will be fine
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";



//card para garagem
export default function Card({item,index,animationValue,reference,updateData}) { 

    const generalAlpha = useSharedValue(0.2);

    const style = useAnimatedStyle(() => {
        const opacity = interpolate(animationValue.value,[-1,0,1],[generalAlpha.value,1,generalAlpha.value],Extrapolate.CLAMP);
        return {opacity}
    },[animationValue]);

    let data = useContext(GarageContext);
    const db = useContext(DBContext).garageDB;
    const navigation = useNavigation();

    //Card para adicionar carro
    if(item.id == -1){
        return <Animated.View style={[styles.cardContainer,{width:'100%',backgroundColor:'white',flex:1,justifyContent:'center',alignSelf:'center',alignItems:'center'},style]}>
                <TouchableWithoutFeedback style={{backgroundColor:'white',justifyContent:'center',alignItems:'center',width:Window.width/5,height:Window.height/10}} onPress={() => {
            navigation.navigate("CarCreation");
        }}>
            <Text style={{fontSize:40}}>+</Text>
            </TouchableWithoutFeedback>
        </Animated.View>
    }

    
    return <Animated.View style={[styles.cardContainer,{backgroundColor:"white",flex:1,justifyContent:'center'},style]}>
        <Animated.View entering={SlideInDown} style={{flex:1,justifyContent:'space-between'}}>
            <View style={{flex:0.2,backgroundColor:'blue',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:22}}>Ano</Text>
                <Text style={{fontSize:32}}>Nome</Text>
            </View>
            <View>
            </View>
            <View style={{flex:0.08,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:20}}>Status</Text>
            </View>
        </Animated.View>
    </Animated.View>


};