import { View,Text, Pressable } from "react-native"
import { AnimationsContext, GarageContext, styles, Window } from "./Styles"
import Carousel from 'react-native-reanimated-carousel';
import Card from "./Card";
import { useContext, useEffect, useRef, useState } from "react";
import { DBContext } from "./Backend";
import Animated, { useSharedValue, withTiming,SlideInDown, useAnimatedStyle, modulo, interpolate } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, NativeViewGestureHandler } from "react-native-gesture-handler";
import { Navigation } from "react-native-navigation";
import { useNavigation } from "@react-navigation/native";




export const Garage = () => {

    const data = useContext(GarageContext);
    const db = useContext(DBContext).garageDB;
    const animationsData = useContext(AnimationsContext);
    animationsData.detailsAnimationProgress = useSharedValue(false);
    const [reRenderDummy,setReRenderDummy] = useState(0);
    const [myData,setMyData] = useState([]);
    const shouldShowProfile = useSharedValue(false);
    const profilePictureOpacity = useSharedValue(0);
    const profileLogo = useSharedValue(0);
    animationsData.garageBottomCardPosition = useSharedValue(-Window.height/1.35);

    //movimento do card de profile
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            if( e.translationY < 0){
                profileLogo.value = withTiming(1,{duration:1500});
                profilePictureOpacity.value = withTiming(1,{duration:1300});
                animationsData.garageBottomCardPosition.value = withTiming(Window.height/20,{duration:1000});
            }
            else {
                profileLogo.value = withTiming(0,{duration:600});
                profilePictureOpacity.value = withTiming(0,{duration:800});
                animationsData.garageBottomCardPosition.value = withTiming(-Window.height/1.35,{duration:1000})
            }
        });
    const navigation = useNavigation();
    useEffect(() => {
        navigation.addListener('focus',() => {
            db.transaction(tx => {
                tx.executeSql("SELECT * FROM cars",[],(tx,result) => {
                    setMyData([...result.rows._array,{id:-1}]);
                })
            });
        })
    },[]);

    //styles do card de profile
    const ProfileViewStyle = useAnimatedStyle(() => {
        return {
            bottom:animationsData.garageBottomCardPosition.value
        };
    });
    const ProfilePictureStyle = useAnimatedStyle(() => {
        return {
            opacity:profilePictureOpacity.value
        }
    })
    const ProfileLogoStyle = useAnimatedStyle(() => {
        return {
            opacity:profileLogo.value
        }
    })

    const CarouselOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity:interpolate(profilePictureOpacity.value,[0,1],[1,0])
        }
    })

    
    return<GestureHandlerRootView style={{flex:1}}><Animated.View style={styles.container}>
        <Animated.View style={CarouselOpacityStyle}>
        <Carousel ref={(carousel) => data.carousel = carousel} loop={false} mode="parallax" modeConfig={{parallaxScrollingScale:0.7,parallaxScrollingOffset:200,parallaxAdjacentItemScale:0.6}}
        width={Window.width}
        height={Window.height/1.05}
        data={myData}
        renderItem={({item,index,animationValue})=><Card item={item} animationValue={animationValue} index={index}></Card>}></Carousel>
        </Animated.View>
        {/* Profile View! */}
        <GestureDetector gesture={gesture}>
            <Animated.View entering={SlideInDown} style={[styles.profileContainer,ProfileViewStyle]}>
                <Animated.View style={[ProfilePictureStyle,{alignSelf:'center',borderWidth:1,borderRadius:250,marginTop:'15%',width:'95%',flex:0.38}]}>
                </Animated.View>
                <Animated.View style={[ProfilePictureStyle,{alignSelf:'center',marginTop:'5%',flex:0.2}]}>
                    <Text>NOME</Text>
                </Animated.View>
                <Animated.View style={[ProfileLogoStyle,{borderWidth:1,flex:0.4,marginBottom:'10%'}]}>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    </Animated.View>
    </GestureHandlerRootView> 
}