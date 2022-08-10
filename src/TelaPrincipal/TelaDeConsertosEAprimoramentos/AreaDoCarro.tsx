import React, { useEffect, useState } from "react"
import {  TouchableOpacity, View } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { NormalSizeText, RedRoundButton, Window } from "../../Styles";




interface AreaDoCarroInterface {
    visible:boolean,
    onSelect?: (string) => void,
}


export const AreaDoCarro = ({visible,onSelect}: AreaDoCarroInterface) => {

    const [shouldShowAreaDoCarro,setShowAreaDoCarro] = useState(false);
    const areas = ['Carroceria','Pneus','interior','motor','ignicao','suspensao','exaustao','seguranca','transmissao','eletrica','freios']
    const areaDoCarroPosition = useSharedValue(0);
    const areaDoCarroOpacity = useSharedValue(0);
    const areaDoCarroListPosition = useSharedValue(0);
    const areaDoCarroListOpacity = useSharedValue(0);

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


    useEffect(() => {
        if(visible){
            setShowAreaDoCarro(true);
            areaDoCarroOpacity.value = withTiming(1,{duration:800});
            areaDoCarroListOpacity.value = withTiming(1,{duration:1000});
            areaDoCarroPosition.value = withTiming(Window.height/1.7,{duration:800})
            areaDoCarroListPosition.value = withTiming(Window.height/30,{duration:1000})
        }
        else {
            const func = (finished) => {
                if(finished){
                    setShowAreaDoCarro(false);
                }
            }
            areaDoCarroOpacity.value = withTiming(0,{duration:500},finished => runOnJS(func)(finished));
            areaDoCarroListOpacity.value = withTiming(0,{duration:500});
            areaDoCarroPosition.value = withTiming(0,{duration:500})
            areaDoCarroListPosition.value = withTiming(-Window.height/2,{duration:500})
        }
    },[visible])

    return <>
        {shouldShowAreaDoCarro && <Animated.View style={[{position:'absolute',alignSelf:'center'},areaDoCarroPositionStyle]}>
            <RedRoundButton disabled={true} style={[{alignSelf:'center',justifyContent:'center',position:'absolute',backgroundColor:'#1E1E1E'},areaDoCarroStyle]}>
                <NormalSizeText style={{color:'white',marginHorizontal:40,marginVertical:10}}>Area do Carro</NormalSizeText>
            </RedRoundButton>
        </Animated.View>}

        {shouldShowAreaDoCarro && <Animated.View style={[{position:'absolute',alignSelf:'center',backgroundColor:'white',width:'70%',borderRadius:10},areaDoCarroListPositionStyle,areaDoCarroListStyle]}>
            {areas.map((area,i) => {
                return <TouchableOpacity key={`touchable ${area + i}`} onPress={() => {
                    if(onSelect) {
                        onSelect(area);
                    }
                }}>
                <Animated.View key={area} style={{width:'100%',alignSelf:'center',borderBottomWidth:i != areas.length-1 ? 1 : 0,backgroundColor:'white',
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