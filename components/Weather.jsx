import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { TouchableNativeFeedback } from 'react-native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import WebView from 'react-native-webview'
import { useStateContext } from '../context/StateProvider'


const IMG_SIZE = 62


const Weather = ({ currentForecast, fontColor }) => {

    const { push } = useRouter()
    const [temp] = useState(currentForecast?.cc?.temp)
    const {selectedCity} = useStateContext()


    const html = `
    <html>
          <body style="margin:0;background:transparent;">
            <img src="https://corsproxy.io/?https://www.meteobahia.com.ar/imagenes/new/${currentForecast?.cc?.icon}.png?_=${new Date().getHours()}" 
            style="display:block;margin:auto;width:100vw;height:90vh;" />
        </body>
    </html>
  `;

useEffect(() => {
  
//   console.log(`${currentForecast.Station.lat},${currentForecast.Station.lon}`);
  
}, [])




    return (
        <TouchableNativeFeedback onPress={() => { push({
            pathname:"weather",
            params:{selectedCity}
            
        }) }}>
            <View style={s.container}>

                {
                    temp != null &&
                    <>

                        <View style={s.webviewContainer}>
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
                        </View>

                        <Text style={[s.temperature, { color: fontColor }]}>{temp}°</Text>
                        <Text style={[s.description, { color: fontColor }]}>{currentForecast?.cc?.condition}</Text>
                        {/* <Text style={[s.description, { color: fontColor }]}>{currentForecast?.cc?.dir} </Text> */}
                    </>
                }

                {/* <Text style={s.description}>. Max:18° Min:6°</Text> */}
                {/* <Text style={s.description}></Text> */}

            </View >
        </TouchableNativeFeedback>
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
        fontSize: 110,
        fontFamily: 'digital-7-mono-italic',
        textShadowColor: 'red',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        paddingLeft:10

    },
    description: {
        maxWidth: "41%",
        alignSelf: "flex-end",
        paddingLeft: 10,
        color: "red",
        fontSize: 30,
        paddingBottom: 8,
        fontFamily: 'digital-7-mono-italic',
        textShadowColor: 'red',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10
    },

})