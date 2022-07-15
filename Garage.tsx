import { View,Text, Pressable } from "react-native"
import { GarageContext, styles, Window } from "./Styles"
import Carousel from 'react-native-reanimated-carousel';
import Card from "./Card";
import { useContext, useEffect, useRef, useState } from "react";
import { DBContext } from "./Backend";
import Animated, { useSharedValue, withTiming,SlideInDown, useAnimatedStyle, modulo, interpolate } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { withSpring } from "react-native-reanimated/lib/types/lib/reanimated2/animation";




export const Garage = () => {

    const data = useContext(GarageContext);
    const db = useContext(DBContext).garageDB;
    const [myData,setMyData] = useState([]);
    const shouldShowProfile = useSharedValue(false);
    const profilePictureOpacity = useSharedValue(0);
    const profileLogo = useSharedValue(0);
    const profilePosition = useSharedValue(-Window.height/1.35);

    //movimento do card de profile
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            if( e.translationY < 0){
                profileLogo.value = withTiming(1,{duration:1500});
                profilePictureOpacity.value = withTiming(1,{duration:1300});
                profilePosition.value = withTiming(Window.height/9,{duration:1000});
            }
            else {
                profileLogo.value = withTiming(0,{duration:600});
                profilePictureOpacity.value = withTiming(0,{duration:800});
                profilePosition.value = withTiming(-Window.height/1.35,{duration:1000})
            }
        });

    
    //dados dos carros da garagem
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM cars",[],(tx,result) => {
                setMyData([...result.rows._array,{id:-1}]);
            })
        });
    },[])

    //styles do card de profile
    const ProfileViewStyle = useAnimatedStyle(() => {
        return {
            bottom:profilePosition.value
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

    
    return <><Animated.View style={styles.container}>
        <Carousel style={CarouselOpacityStyle} ref={(carousel) => data.carousel = carousel} loop={false} mode="parallax" modeConfig={{parallaxScrollingScale:0.7,parallaxScrollingOffset:42}}
        width={Window.width}
        height={Window.height/1.2}
        data={myData}
        renderItem={({item,index,animationValue})=><Card updateData={setMyData} item={item} animationValue={animationValue} reference={data.carousel} index={index}></Card>}></Carousel>
        
        {/* Profile View! */}
        <GestureDetector gesture={gesture}>
            <Animated.View entering={SlideInDown} style={[styles.cardContainer,{width:Window.width*0.7,height:Window.height/1.2,position:'absolute',justifyContent:'space-between',backgroundColor:'yellow'},ProfileViewStyle]}>
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
    </>
}