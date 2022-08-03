import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle,SlideInDown, useSharedValue } from "react-native-reanimated";
import { DBContext } from "./Backend";
import { AppColors, AppConstants, CarNameSizeText, GarageContext, NormalSizeText, RedRoundButton, styles, Window, YearSizeText } from "./Styles";
// will be fine
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import Accordion from 'react-native-collapsible/Accordion';
import Tubes from './tubes'

export function TechnicalDetails({navigation}) {

    const selectedItemData = useContext(GarageContext).selectedCarProperties;
    const isCollapsed = useSharedValue(true);
    const [activeSections,setActiveSections] = useState([]);

    


    return <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,width:'90%',alignSelf:'center'}}>
        <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,marginVertical:'10%',justifyContent:'center',alignItems:'center'}}>
            {selectedItemData.alias != null && selectedItemData.alias != "" && (() => <>
            <YearSizeText>{selectedItemData.year}</YearSizeText>
            <CarNameSizeText>{selectedItemData.alias}</CarNameSizeText>
            <NormalSizeText style={{opacity:0.6,textAlign:'center'}}>{selectedItemData.model}</NormalSizeText></>)()}
            {(selectedItemData.alias == null || selectedItemData.alias == "") && (() => {
                return <><YearSizeText style={{padding:10}}>{selectedItemData.year}</YearSizeText>
                <CarNameSizeText style={{textAlign:'center'}}>{selectedItemData.model}</CarNameSizeText>
                </>
            })()}
        </View>
        <View style={{borderWidth:1,height:'10%',alignItems:'center',justifyContent:'center'}}>
            <Text>IMAGEM</Text>
        </View>
        <Tubes width={'100%'}></Tubes>
        <View >
            {/* <NormalSizeText style={{padding:5}}>Placa: {selectedItemData.license_plate}</NormalSizeText> */}
            {/* <NormalSizeText style={{padding:5}}>Data de aquisicao: {selectedItemData.aquisition_date}</NormalSizeText> */}
            {/* <NormalSizeText style={{paddingVertical:10,textAlign:'left'}}>Cor: {selectedItemData.color}</NormalSizeText> */}
            
        </View>
        <Tubes width={'100%'}></Tubes>
        <View style={{marginVertical:'5%'}}>
            <CarNameSizeText style={{textAlign:'center',marginBottom:'10%'}}>Manutencao preventiva</CarNameSizeText>
            <View  style={{alignSelf:'center'}}>
            <TouchableOpacity>
                <View style={[styles.maintenanceButton,{backgroundColor:'black'}]}>
                    <NormalSizeText style={{color:'white'}}>+</NormalSizeText>
                </View>
            </TouchableOpacity>
            </View>
        </View>
        <Tubes width={'100%'}></Tubes>
        <View style={{marginVertical:'5%'}}>
            <CarNameSizeText style={{textAlign:'center',marginBottom:'10%'}}>Consertos e aprimoramentos</CarNameSizeText>
            <View  style={{alignSelf:'center'}}>
            <TouchableOpacity>
                <View style={[styles.maintenanceButton,{backgroundColor:'black'}]}>
                    <NormalSizeText style={{color:'white'}}>+</NormalSizeText>
                </View>
            </TouchableOpacity>
            </View>
        </View>
        <Tubes width={'100%'}></Tubes>
        <View style={{marginVertical:'5%'}}>
            <CarNameSizeText style={{textAlign:'center',marginBottom:'10%'}}>Licenciamentos</CarNameSizeText>
            <View  style={{alignSelf:'center'}}>
            <TouchableOpacity>
                <View style={[styles.maintenanceButton,{backgroundColor:'black'}]}>
                    <NormalSizeText style={{color:'white'}}>+</NormalSizeText>
                </View>
            </TouchableOpacity>
            </View>
        </View>
        <Tubes width={'100%'}></Tubes>
        <View style={{marginVertical:'5%'}}>
            <CarNameSizeText style={{textAlign:'center',marginBottom:'3%'}}>Historico</CarNameSizeText>
        </View>
        <View style={{width:'100%'}}>
            <RedRoundButton style={{margin:'2%'}}>
                <NormalSizeText style={{margin:'4%',color:'white'}}>EMITIR</NormalSizeText>
            </RedRoundButton>
            <RedRoundButton style={{margin:'2%'}}>
                <NormalSizeText style={{margin:'4%',color:'white'}}>EXPORTAR INFO DO CARRO</NormalSizeText>
            </RedRoundButton>
        </View>
    </View>



}