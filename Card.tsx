import React, { useContext, useEffect } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle,SlideInDown, useSharedValue, withTiming } from "react-native-reanimated";
import { DBContext } from "./Backend";
import { AnimationsContext, AppConstants, GarageContext, styles, Window } from "./Styles";
// will be fine
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";



//card para garagem
export default function Card({item,index,animationValue}) { 

    const generalAlpha = useSharedValue(0.2);
    const animationsContext = useContext(AnimationsContext);
    const carouselRef = useContext(GarageContext).carousel;
    const garageData = useContext(GarageContext);

    const style = useAnimatedStyle(() => {
        //testing if in detailsAnimation
        const opacity = animationsContext.detailsAnimationProgress.value == false?
        interpolate(animationValue.value,[-1,0,1],[generalAlpha.value,1,generalAlpha.value],Extrapolate.CLAMP)
        :
        1
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

    
    return <Pressable style={{flex:1}} onPress={() => {
        garageData.selectedCarProperties = item;
        navigation.navigate('TechnicalDetails');
    }}>
    <Animated.View style={[styles.cardContainer,{backgroundColor:"white",flex:1,justifyContent:'center'},style]}>
        <Animated.View entering={SlideInDown} style={[styles.cardContainer,{flex:1,justifyContent:'space-between'}]}>
            <View style={[styles.cardContainer,{flex:0.2,backgroundColor:'white',justifyContent:'center',alignItems:'center'}]}>
                <Text style={{fontSize:AppConstants.yearSize}}>{item.year}</Text>
                <Text style={{fontSize:AppConstants.nameSize}}>{item.name}</Text>
            </View>
            <View>
            </View>
            <View style={[styles.cardContainer,{flex:0.08,backgroundColor:'white',alignItems:'center',justifyContent:'center'}]}>
                <Text style={{fontSize:20}}>Status</Text>
            </View>
        </Animated.View>
    </Animated.View>
    </Pressable>


};