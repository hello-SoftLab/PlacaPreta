import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { } from 'react-native-navigation';
import { NavigationContainer,NavigationProp, Route } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Garage } from './src/Garage';
import { AnimationsContext, GarageContext } from './src/Styles';
import { DBContext, InitAllCarsDB, InitDBContext } from './src/Backend';
import { CarCreation } from './src/CarCreation';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { TechnicalDetails } from './src/TechnicalDetails';
import { SharedValue } from 'react-native-reanimated';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { AnimatedAppLoader } from './src/AnimatedLoadingScreen';
import { MainScreen } from './src/MainScreen';



export default function App() {

  return <MainScreen></MainScreen>
};