import React, { useEffect, useState } from "react"
import { FlatList, View } from "react-native"
import { TouchableOpacity } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue,withTiming } from "react-native-reanimated"
import { PopupCard } from "../Components/PopupCard"
import { AppColors, AppConstants, NormalSizeText, RedRoundButton, Window } from "../Styles"
import Tubes from '../Components/tubes'


export const ConsertosEAprimoramentos = () => {

    const consertoPosition = useSharedValue(Window.height/4)
    const aprimoramentosPosition = useSharedValue(Window.height/2.5)
    const [selectedChoice,setSelectedChoice] = useState(0);
    const aprimoramentoOpacity = useSharedValue(1);
    const consertoOpacity = useSharedValue(1);
    const [showConserto,setShowConserto] = useState(true);
    const [showAprimoramentos,setShowAprimoramentos] = useState(true);
    const [shouldShowAreaDoCarro,setShowAreaDoCarro] = useState(false);
    const areaDoCarroPosition = useSharedValue(0);
    const areaDoCarroOpacity = useSharedValue(0);
    const areaDoCarroListPosition = useSharedValue(0);
    const areaDoCarroListOpacity = useSharedValue(0);

    const areas = ['Carroceria','Pneus','interior','motor','ignicao','suspensao','exaustao','seguranca','transmissao','eletrica','freios']
    const [selectedArea,setSelectedArea] = useState(-1);


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

    const areaDoCarroStyle = useAnimatedStyle(() => {
        return {
            opacity:areaDoCarroOpacity.value
        }
    })

    const areaDoCarroPositionStyle = useAnimatedStyle(() => {
        return {
            bottom:areaDoCarroPosition.value
        }
    })
    
    
    const areaDoCarroListStyle = useAnimatedStyle(() => {
        return {
            opacity:areaDoCarroListOpacity.value,
            bottom:areaDoCarroListPosition.value
        }
    })
    const areaDoCarroListPositionStyle = useAnimatedStyle(() => {
        return {
            bottom:areaDoCarroListPosition.value
        }
    })

    const aprimoramentosPositionStyle = useAnimatedStyle(() => {
        return {
            top:aprimoramentosPosition.value
        }
    })

    const choices = ['none','conserto','aprimoramento']

    const resetToOriginal = () => {
        consertoPosition.value = withTiming(Window.height/4,{duration:500})
        aprimoramentosPosition.value = withTiming(Window.height/2.5,{duration:500})
        consertoOpacity.value = withTiming(1,{duration:500})
        aprimoramentoOpacity.value = withTiming(1,{duration:500})
        setShowConserto(true);
        setShowAprimoramentos(true);
        hideAreaDoCarro();
    }
    
    const showAreaDoCarro = () => {
        setShowAreaDoCarro(true);
        areaDoCarroOpacity.value = withTiming(1,{duration:800});
        areaDoCarroListOpacity.value = withTiming(1,{duration:1000});
        areaDoCarroPosition.value = withTiming(Window.height/1.7,{duration:800})
        areaDoCarroListPosition.value = withTiming(Window.height/30,{duration:1000})
    }
    
    const hideAreaDoCarro = () => {
        const func = (finished) => {
            if(finished){
                setShowAreaDoCarro(false);
            }
        }
        areaDoCarroOpacity.value = withTiming(0,{duration:400},finished => runOnJS(func)(finished));
        areaDoCarroListOpacity.value = withTiming(0,{duration:300});
        areaDoCarroPosition.value = withTiming(0,{duration:400})
        areaDoCarroListPosition.value = withTiming(-Window.height/2,{duration:300})
    }
    
    
    useEffect(() => {
        if(selectedChoice == 0){
            resetToOriginal();
        }
        if(selectedChoice == 1){
            showAreaDoCarro();
            aprimoramentoOpacity.value = withTiming(0,{duration:500},(finished) => finished? setShowAprimoramentos(false) : {})
            setShowConserto(true);
            consertoPosition.value = withTiming(25,{duration:500})
        }
        if(selectedChoice == 2){
            showAreaDoCarro();
            setShowAprimoramentos(true);
            consertoOpacity.value = withTiming(0,{duration:500},(finished) => finished? setShowConserto(false) : {})
            aprimoramentosPosition.value = withTiming(25,{duration:500})
        }
    },[selectedChoice])


    return <>
    <View style={{position:'absolute',top:-30,alignSelf:'center',height:Window.height/3,width:Window.width/1.5,alignItems:'center',borderRadius:15,backgroundColor:AppColors.yellow}}>
        <NormalSizeText style={{marginVertical:10,fontFamily:AppConstants.fontFE,fontSize:14}}>Consertos e aprimoramentos</NormalSizeText>
    </View>
    <View style={{height:Window.height/1.4,borderRadius:15,backgroundColor:'#383838'}}>
    </View>
    <Tubes style={{transform:[{rotateZ:'90deg'}],position:'absolute',alignSelf:'center',opacity:0.5}} color={'black'} width={'200%'} spacing={'20%'} scaleY={1}></Tubes>
    {showConserto && <Animated.View style={[{position:'absolute',alignSelf:'center'},consertoPositionStyle]}>
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
    {shouldShowAreaDoCarro && <Animated.View style={[{position:'absolute',alignSelf:'center'},areaDoCarroPositionStyle]}>
        <RedRoundButton disabled={true} style={[{alignSelf:'center',justifyContent:'center',position:'absolute',backgroundColor:'#1E1E1E'},areaDoCarroStyle]}>
            <NormalSizeText style={{color:'white',marginHorizontal:40,marginVertical:10}}>Area do Carro</NormalSizeText>
        </RedRoundButton>
        </Animated.View>}

    {shouldShowAreaDoCarro && <Animated.View style={[{position:'absolute',alignSelf:'center',backgroundColor:'white',width:'70%',borderRadius:10},areaDoCarroListPositionStyle,areaDoCarroListStyle]}>
        {areas.map((area,i) => {
            return <TouchableOpacity onPress={() => {
                if(selectedArea != i){
                    setSelectedArea(i);
                }
                else {
                    setSelectedArea(-1);
                }
            }}>
            <Animated.View key={area} style={{width:'100%',alignSelf:'center',borderBottomWidth:i != areas.length-1 ? 1 : 0,backgroundColor: selectedArea == i? AppColors.yellow : 'white',
                borderTopLeftRadius: i == 0? 10 : 0, borderTopRightRadius: i == 0? 10 : 0,
                borderBottomLeftRadius: i == areas.length - 1 ? 10 : 0,borderBottomRightRadius: i == areas.length - 1 ? 10 : 0
            }}>
                <NormalSizeText key={area + 'text'} style={{margin:'4%',textAlign:'center'}}>{area}</NormalSizeText>
            </Animated.View>
            </TouchableOpacity>
        })}
    </Animated.View>}
    
    </>
}