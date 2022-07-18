import React, { useContext, useEffect } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle,SlideInDown, useSharedValue } from "react-native-reanimated";
import { DBContext } from "./Backend";
import { AppColors, AppConstants, GarageContext, styles, Window } from "./Styles";
// will be fine
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";



export function TechnicalDetails({navigation}) {



    const selectedItemData = useContext(GarageContext).selectedCarProperties;


    return <> 
    
    <View style={{backgroundColor:AppColors.black,flex:1,alignItems:'center',justifyContent:'center'}}>
    <View style={{flex:0.15}}></View>
    
    <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,flex:0.85,width:'75%',alignSelf:'center',backgroundColor:'white'}}>
        <View style={{flex:0.15,borderTopLeftRadius:10,borderTopRightRadius:10,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:AppConstants.yearSize}}>{selectedItemData.year}</Text>
            <Text style={{fontSize:AppConstants.nameSize}}>{selectedItemData.name}</Text>
        </View>
        <View style={{borderWidth:1,flex:0.25,alignItems:'center',justifyContent:'center'}}>
            <Text>IMAGEM</Text>
        </View>
        <View style={{alignItems:'center',paddingTop:10}}>
            <Text style={{fontSize:AppConstants.yearSize}}>PLACA</Text>
        </View>



    </View>
    </View>
    </>



}