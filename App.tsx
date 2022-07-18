import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { } from 'react-native-navigation';
import { NavigationContainer,NavigationProp, Route } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Garage } from './Garage';
import { AnimationsContext, GarageContext } from './Styles';
import { DBContext, InitAllCarsDB, InitDBContext } from './Backend';
import { CarCreation } from './CarCreation';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { TechnicalDetails } from './TechnicalDetails';
import { SharedValue } from 'react-native-reanimated';


const Stack = createNativeStackNavigator();


//função para mover o cars_data.db do folder assets pro folder dos documentos do celular
const loadingFunc = async () => {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  };
  
  if(!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/cars_data.db')).exists){
    await FileSystem.downloadAsync(
      Asset.fromModule(require('./assets/cars_data.db')).uri,
      FileSystem.documentDirectory + `SQLite/cars_data.db`
    );
  }
  
}


export default function App() {

  loadingFunc();

  // Criando as páginas e os contextos necessários (variáveis globais)
  return (
    <AnimationsContext.Provider value={{detailsAnimationProgress:null,detailsAnimationGeneralOpacity:null,garageBottomCardPosition:null}}>
    <DBContext.Provider value={{garageDB:InitDBContext(),allCarsDB:InitAllCarsDB()}}>
    <GarageContext.Provider value={{selectedCarProperties:null,carousel:null,carsData:[],setCarsData:(arr) => {},shouldRenderStateFunc:(randomData) => {}}}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Garage" component={Garage} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="CarCreation" component={CarCreation} options={{headerShown:false,animation:'fade_from_bottom'}}></Stack.Screen>
        <Stack.Screen name="TechnicalDetails" component={TechnicalDetails} options={{headerShown:false,animation:'none'}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </GarageContext.Provider>
    </DBContext.Provider>
    </AnimationsContext.Provider>
  );
};