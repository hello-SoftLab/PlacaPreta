import { Database } from "expo-sqlite";
import React, { createContext } from "react";
import { Dimensions, StyleSheet, TextStyle, View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import { Text } from "react-native-elements";
import { StyleProp } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const Window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
};

export const AppColors = {
    yellow: '#ffb331',
    black : 'rgb(0,0,0)',
    white:'rgb(255,255,255)',
    red: '#801112'
}

export const AppConstants = {
    fontFE:'fe-font',
    fontInter:'inter',
    yearSize:18,
    nameSize:18,
    normalSize:20,
    borderSize:10,
    cardAliasSize:25,
};

export const styles = StyleSheet.create({
    container:{
        backgroundColor:'black',
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
    },
    cardContainer: {
        borderRadius:10
    },
    carCreationContainer: {
        flex:0.85,
        width:'85%',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        borderRadius:10
    },
    selectButton: {zIndex:0,justifyContent:'center',alignItems:'center',borderRadius:50,width:Window.width/4,height:Window.height/20,backgroundColor:AppColors.yellow},
    profileContainer: {
        borderRadius:10,width:Window.width*0.7,height:Window.height/1.2,position:'absolute',justifyContent:'space-between',backgroundColor:AppColors.yellow
    },
    generalText: {
        fontFamily:AppConstants.fontFE,
        textAlign:'center'
    }
});




export const AnimationsContext = createContext({detailsAnimationProgress: null as SharedValue<boolean>,detailsAnimationGeneralOpacity:null as SharedValue<number>,garageBottomCardPosition: null as SharedValue<number>})

export const GarageContext = createContext({selectedCarProperties: null ,shouldRenderStateFunc:null,carousel: null as ICarouselInstance,carsData: null,setCarsData: null});


interface TextInterface { 
    style?: StyleProp<TextStyle>,
    children?:React.ReactNode
}

interface ButtonInterface {
    style?: StyleProp<TextStyle>,
    children?:React.ReactNode
}

export const NormalSizeText = ({children,style} : TextInterface) => {
    return <Text style={[{fontFamily:AppConstants.fontFE,fontSize:AppConstants.normalSize},style]}>{children}</Text>
}
export const YearSizeText = ({children,style} : TextInterface) => {
    return <Text style={[{fontFamily:AppConstants.fontFE,fontSize:AppConstants.yearSize},style]}>{children}</Text>
}

export const CarNameSizeText = ({children,style} : TextInterface) => {
    return <Text style={[{fontFamily:AppConstants.fontFE,fontSize:AppConstants.cardAliasSize},style]}>{children}</Text>
}

export const RedRoundButton = ({children,style} : ButtonInterface) => {
    return <TouchableOpacity>
            <View style={[{alignItems:'center',backgroundColor:AppColors.red,borderRadius:7},style]}>
                {children}
            </View>
        </TouchableOpacity>
}