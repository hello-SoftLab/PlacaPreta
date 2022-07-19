import { Database } from "expo-sqlite";
import { createContext } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";


export const Window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
};

export const AppColors = {
    yellow: 'rgb(255,197,48)',
    black : 'rgb(0,0,0)',
    white:'rgb(255,255,255)'
}

export const AppConstants = {
    yearSize:22,
    nameSize:22,
    normalSize:20,
    borderSize:10,
    cardAliasSize:32,
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
    profileContainer: {
        borderRadius:10,width:Window.width*0.7,height:Window.height/1.2,position:'absolute',justifyContent:'space-between',backgroundColor:AppColors.yellow
    }
});




export const AnimationsContext = createContext({detailsAnimationProgress: null as SharedValue<boolean>,detailsAnimationGeneralOpacity:null as SharedValue<number>,garageBottomCardPosition: null as SharedValue<number>})

export const GarageContext = createContext({selectedCarProperties: null ,shouldRenderStateFunc:null,carousel: null as ICarouselInstance,carsData: null,setCarsData: null});

