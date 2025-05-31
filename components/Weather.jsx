import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import WebView from 'react-native-webview'
import { useStateContext } from '../context/StateProvider'
import { TouchableRipple } from 'react-native-paper'

const IMG_SIZE = 62


const Weather = ({ currentForecast, mainColor }) => {

    const { push } = useRouter()
    const [temp, setTemp] = useState(currentForecast?.cc?.temp)
    const { selectedCity, roundTemp } = useStateContext()


    const html = `
    <html>
          <body style="margin:0;background:transparent;">
            <img src="https://corsproxy.io/?https://www.meteobahia.com.ar/imagenes/new/${currentForecast?.cc?.icon}.png?_=${new Date().getHours()}" 
            style="display:block;margin:auto;width:100vw;height:90vh;" />
        </body>
    </html>
  `;

    useEffect(() => {

        if (roundTemp) {
            setTemp(Math.round(temp))
        }

    }, [roundTemp])




    return (


        <TouchableRipple onPress={() => {
            push({
                pathname: "weather",
                params: { selectedCity }

            })
        }}>



            {/* <TouchableNativeFeedback onPress={() => { push({
            pathname:"weather",
            params:{selectedCity}
            
        }) }}> */}
            <View style={s.container}>

                {
                    temp != null &&
                    <>

                        <View style={s.webviewContainer}>
                            {
                                Platform.OS != "web" ?
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{ html }}
                                        style={s.webview}
                                        domStorageEnabled
                                        scrollEnabled={false}
                                        scalesPageToFit={false}
                                        automaticallyAdjustContentInsets={false}
                                        overScrollMode="never"
                                        backgroundColor="transparent"
                                    />
                                    :
                                    <Image source={{ uri: `https://www.meteobahia.com.ar/imagenes/new/${currentForecast?.cc?.icon}.png` }} style={s.img} />

                            }
                        </View>

                        <Text style={[s.temperature, { color: mainColor, textShadowColor: mainColor, }]}>{temp}°</Text>
                        <Text numberOfLines={2} style={[s.description, { color: mainColor, textShadowColor: mainColor, }]}>{currentForecast?.cc?.condition}</Text>
                        {/* <Text style={[s.description, { color: mainColor }]}>{currentForecast?.cc?.dir} </Text> */}
                    </>
                }

                {/* <Text style={s.description}>. Max:18° Min:6°</Text> */}
                {/* <Text style={s.description}></Text> */}

            </View >
            {/* </TouchableNativeFeedback> */}
        </TouchableRipple>
    )
}

export default Weather

const s = StyleSheet.create({
    webviewContainer: {
        minHeight: 90
    },
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: 90,


    },
    webview: {
        width: IMG_SIZE + 20,
        height: IMG_SIZE,
        backgroundColor: "transparent",
        minHeight: 90,

    },
    temperature: {
        color: "red",
        fontSize: 115,
        fontFamily: 'digital-7-mono-italic',

        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        paddingLeft: 10

    },
    description: {

        maxWidth: "58%",
        paddingLeft: 10,
        alignSelf: "flex-end",
        marginBottom: 10,
        color: "red",
        fontSize: 38,
        paddingBottom: 4,
        fontFamily: 'digital-7-mono-italic',
        textShadowColor: 'red',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,

    },
    img: {
        alignSelf: "center",
        height: IMG_SIZE + 30,
        width: IMG_SIZE + 30
    }

})