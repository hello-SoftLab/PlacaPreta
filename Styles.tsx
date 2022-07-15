import { createContext } from "react";
import { Dimensions, StyleSheet } from "react-native";


export const Window = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
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
        borderRadius:10,width:Window.width*0.7,height:Window.height/1.2,position:'absolute',justifyContent:'space-between',backgroundColor:'rgb(255,197,48)'
    }
});



export const GarageContext = createContext({carousel: null,carsData: null,setCarsData: null});