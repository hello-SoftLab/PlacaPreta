import { DBContext, InitAllCarsDB, InitDBContext } from "./Backend"
import { AnimationsContext, GarageContext } from "./Styles"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { } from 'react-native-navigation';
import { NavigationContainer,NavigationProp, Route } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Garage } from "./Garage";
import { CarCreation } from "./CarCreation";
import { TechnicalDetails } from "./TechnicalDetails";
import { useFonts } from "expo-font";



const Stack = createNativeStackNavigator();



export const MainScreen = () => {

    useFonts({
      'fe-font':require('./../assets/fonts/FE-FONT.ttf'),
      'inter':require('./../assets/fonts/Inter-Regular.ttf')
    });

    return <AnimationsContext.Provider value={{detailsAnimationProgress:null,detailsAnimationGeneralOpacity:null,garageBottomCardPosition:null}}>
    <DBContext.Provider value={{garageDB:InitDBContext(),allCarsDB:InitAllCarsDB()}}>
    <GarageContext.Provider value={{selectedCarProperties:null,carousel:null,carsData:[],setCarsData:(arr) => {},shouldRenderStateFunc:(randomData) => {}}}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Garage'>
        <Stack.Screen name="Garage" component={Garage} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="CarCreation" component={CarCreation} options={{headerShown:false,animation:'fade_from_bottom'}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </GarageContext.Provider>
    </DBContext.Provider>
    </AnimationsContext.Provider>
}