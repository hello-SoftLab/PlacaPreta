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
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';


const Stack = createNativeStackNavigator();



export const MainScreen = () => {

    return <NavigationContainer>
      <Stack.Navigator initialRouteName='Garage'>
        <Stack.Screen name="Garage" component={Garage} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="CarCreation" component={CarCreation} options={{headerShown:false,animation:'fade_from_bottom'}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>

}