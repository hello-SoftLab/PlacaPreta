import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle,SlideInDown, useSharedValue } from "react-native-reanimated";
import { DBContext } from "./Backend";
import { AppColors, AppConstants, GarageContext, styles, Window } from "./Styles";
// will be fine
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import Accordion from 'react-native-collapsible/Accordion';


export function TechnicalDetails({navigation}) {



    const selectedItemData = useContext(GarageContext).selectedCarProperties;
    const isCollapsed = useSharedValue(true);
    const [activeSections,setActiveSections] = useState([]);

    const collapsibleSections = [
        {
            headerTitle: 'INFO',
            drawContent: <View>
                <Text>Anos de Produção: {selectedItemData.years_of_production}</Text>
                <Text>Cor: {selectedItemData.color}</Text>
                <Text>Torque: {selectedItemData.torque}</Text>
                <Text>Potência: {selectedItemData.base_power}</Text>
                <Text>Aceleração (0-100km/h): {selectedItemData.acceleration}</Text>
                <Text>Tração: {selectedItemData.wheel}</Text>
                <Text>Combustível: {selectedItemData.base_power}</Text>
                <Text>Velocidade Máxima: {selectedItemData.max_speed}</Text>
                <Text>Transmissão: {selectedItemData.transmission}</Text>
                <Text>Número de portas: {selectedItemData.doors}</Text>
                <Text>Número de assentos: {selectedItemData.seats}</Text>
            </View>
        },
        {
            headerTitle: 'AGENDAMENTOS',
            drawContent: <View></View>
        },
        {
            headerTitle: "HISTÓRICO",
            drawContent: <View></View>
        }
    ]

    const renderHeader = (section,index,isActive) => {
        return <View style={{justifyContent:'center',alignItems:'center',padding:5}}>
            <Text style={{fontSize:AppConstants.normalSize}}>{section.headerTitle}</Text>
        </View>
    }
    const renderContent = (section) => {
        return section.drawContent
    }
    const onChange = (activeSection) => {
        setActiveSections(activeSection);
    }
    

    return <> 
    
    <View style={{backgroundColor:AppColors.black,flex:1,alignItems:'center',justifyContent:'center'}}>
    <View style={{flex:0.15}}></View>
    <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,flex:0.85,width:'75%',alignSelf:'center',backgroundColor:'white'}}>
        <View style={{transform:[{scale:0.7}],flex:0.15,borderTopLeftRadius:10,borderTopRightRadius:10,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
            {selectedItemData.alias != null && selectedItemData.alias != "" && (() => <>
            <Text style={{fontSize:AppConstants.yearSize}}>{selectedItemData.year}</Text>
            <Text style={{fontSize:AppConstants.cardAliasSize}}>{selectedItemData.alias}</Text>
            <Text style={{fontSize:AppConstants.nameSize,opacity:0.6,textAlign:'center'}}>{selectedItemData.name}</Text></>)()}
            {(selectedItemData.alias == null || selectedItemData.alias == "") && (() => {
                return <><Text style={{fontSize:AppConstants.yearSize}}>{selectedItemData.year}</Text>
                <Text style={{fontSize:AppConstants.cardAliasSize,textAlign:'center'}}>{selectedItemData.name}</Text>
                </>
            })()}
        </View>
        <View style={{borderWidth:1,flex:0.25,alignItems:'center',justifyContent:'center'}}>
            <Text>IMAGEM</Text>
        </View>
        <View style={{alignItems:'center',paddingTop:10,flex:0.3}}>
            <Text style={{fontSize:AppConstants.normalSize,padding:5}}>Placa: {selectedItemData.license_plate}</Text>
            <Text style={{fontSize:AppConstants.normalSize,padding:5}}>Data de aquisição: {selectedItemData.aquisition_month}/{selectedItemData.aquisition_year}</Text>
            <Accordion  touchableComponent={TouchableOpacity} align={'top'} activeSections={activeSections} onChange={onChange} sections={collapsibleSections} renderContent={renderContent} renderHeader={renderHeader}>

            </Accordion>
        </View>




    </View>
    </View>
    </>



}