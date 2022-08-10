import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { } from 'react-native-navigation';
import { NavigationContainer,NavigationProp, Route } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Garage } from './src/TelaPrincipal/Garage';
import { AnimationsContext, GarageContext } from './src/Styles';
import { DBContext, InitAllCarsDB, InitDBContext } from './src/Backend';
import { CarCreation } from './src/TelaDeEscolhaDoCarro/CarCreation';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { TechnicalDetails } from './src/TelaPrincipal/TechnicalDetails';
import { SharedValue } from 'react-native-reanimated';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { AnimatedAppLoader } from './src/AnimatedLoadingScreen';
import { MainScreen } from './src/MainScreen';



export default function App() {

  return <AnimationsContext.Provider value={{detailsAnimationProgress:null,detailsAnimationGeneralOpacity:null,garageBottomCardPosition:null}}>
  <DBContext.Provider value={{garageDB:null,allCarsDB:null}}>
  <GarageContext.Provider value={{selectedCarProperties:null,carousel:null,carsData:[],setCarsData:(arr) => {},shouldRenderStateFunc:(randomData) => {}}}>
  <AnimatedAppLoader image={require('./assets/images/logo.png')}>
    <MainScreen></MainScreen>
  </AnimatedAppLoader>
  </GarageContext.Provider>
  </DBContext.Provider>
  </AnimationsContext.Provider>
};