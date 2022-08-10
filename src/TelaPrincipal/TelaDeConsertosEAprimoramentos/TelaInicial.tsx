import React, { useContext, useEffect, useState } from "react"
import { View } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { DBContext } from "../../Backend"
import { AppColors, GarageContext, NormalSizeText, RedRoundButton, Window } from "../../Styles"
import { AreaDoCarro } from "./AreaDoCarro"
import { TelaDeDescricao } from "./TelaDeDescricao"






interface TelaInicialProps {
    onFinish?: () => void
}

export const TelaInicial = ({onFinish}: TelaInicialProps) => {

    const consertoPosition = useSharedValue(Window.height/4)
    const aprimoramentosPosition = useSharedValue(Window.height/2.5)
    const [selectedChoice,setSelectedChoice] = useState(0);
    const aprimoramentoOpacity = useSharedValue(1);
    const consertoOpacity = useSharedValue(1);
    const [showConserto,setShowConserto] = useState(true);
    const [showAprimoramentos,setShowAprimoramentos] = useState(true);
    const [shouldShowAreaDoCarro,setShowAreaDoCarro] = useState(false);
    const [descriptionScreenText,setDescriptionScreenText] = useState('');
    const [shouldShowDescScreen,setShowDescScreen] = useState(false);
    const carID = useContext(GarageContext).selectedCarProperties.id;
    const db = useContext(DBContext).garageDB;

    const consertoStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: selectedChoice == 1? AppColors.yellow : AppColors.black,
            opacity:consertoOpacity.value
        }
    })
    
    const consertoPositionStyle = useAnimatedStyle(() => {
        return {
            top:consertoPosition.value,
        }
    })

    const aprimoramentosStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: selectedChoice == 2? AppColors.yellow : AppColors.black,
            opacity:aprimoramentoOpacity.value
        }
    })

    const aprimoramentosPositionStyle = useAnimatedStyle(() => {
        return {
            top:aprimoramentosPosition.value
        }
    })
    const resetToOriginal = () => {
        consertoPosition.value = withTiming(Window.height/4,{duration:500})
        aprimoramentosPosition.value = withTiming(Window.height/2.5,{duration:500})
        consertoOpacity.value = withTiming(1,{duration:500})
        aprimoramentoOpacity.value = withTiming(1,{duration:500})
        setShowConserto(true);
        setShowAprimoramentos(true);
        setShowAreaDoCarro(false);
    }

    useEffect(() => {
        setShowDescScreen(false);
        if(selectedChoice == 0){
            resetToOriginal();
        }
        if(selectedChoice == 1){
            setShowAreaDoCarro(true);
            aprimoramentoOpacity.value = withTiming(0,{duration:500},(finished) => finished? runOnJS(setShowAprimoramentos)(false) : {})
            setShowConserto(true);
            consertoPosition.value = withTiming(25,{duration:500})
        }
        if(selectedChoice == 2){
            setShowAreaDoCarro(true);
            setShowAprimoramentos(true);
            consertoOpacity.value = withTiming(0,{duration:500},(finished) => finished? runOnJS(setShowConserto)(false) : {})
            aprimoramentosPosition.value = withTiming(25,{duration:500})
        }
        //console.log(`show conserto ${showConserto}, show aprimoramentos ${showAprimoramentos}, selected choice ${selectedChoice}`)
    },[selectedChoice])


    const choices = ['none','conserto','aprimoramento']

    return <>{showConserto && <Animated.View style={[{position:'absolute',alignSelf:'center'},consertoPositionStyle]}>
        <RedRoundButton style={[{alignSelf:'center'},consertoStyle]} onPress={() => {
            if(selectedChoice != 1){
                setSelectedChoice(1);
            }
            else {
                setSelectedChoice(0);
            }
        }}>
        <NormalSizeText style={{margin:'6%',color:AppColors.white}}>Conserto</NormalSizeText>
    </RedRoundButton>
    </Animated.View>}
    {showAprimoramentos && <Animated.View style={[{position:'absolute',alignSelf:'center'},aprimoramentosPositionStyle]}>
        <RedRoundButton style={[{alignSelf:'center'},aprimoramentosStyle]} onPress={() => {
            if(selectedChoice != 2){
                setSelectedChoice(2);
            }
            else {
                setSelectedChoice(0);
            }
        }}>
            <NormalSizeText style={{margin:'5%',color:AppColors.white}}>Aprimoramento</NormalSizeText>
        </RedRoundButton>
    </Animated.View>}
    <AreaDoCarro onSelect={(name) => {
        setDescriptionScreenText(name);
        setShowDescScreen(true);
        setShowAreaDoCarro(false);
    }} visible={(shouldShowAreaDoCarro)}></AreaDoCarro>
    <TelaDeDescricao visible={shouldShowDescScreen} areaName={descriptionScreenText} onFinish={(description) => {
        db.transaction(tx => {
            tx.executeSql(`INSERT INTO consertos_e_aprimoramentos (car_id,type,description) VALUES (?,?,?)`,[
                carID,
                choices[selectedChoice],
                description
            ],(tx,result) => {
                console.log('written to consertos e aprimoramentos!')
            },(tx,err) => {
                console.log(err.message);
                return false;
            })
        })

        if(onFinish) {
            onFinish();
        }
    }} onLeave={() => {
        setShowDescScreen(false);
        setShowAreaDoCarro(true);
    }} onDidExit={() => {
        setDescriptionScreenText('');
    }}></TelaDeDescricao>
    </>
}