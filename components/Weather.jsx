import { Image } from 'expo-image'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform, ScrollView } from 'react-native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import WebView from 'react-native-webview'
import { useStateContext } from '../context/StateProvider'
import { Icon, TouchableRipple } from 'react-native-paper'
import { fetchXML } from '../utils/fetch'
import { agruparPorDia, findMinMaxTemperature, formatearFecha, sumPrecipitation } from '../utils/weather'

const IMG_SIZE = 62


const Weather = ({ currentForecast, mainColor }) => {

    const { push } = useRouter()
    const [temp, setTemp] = useState(currentForecast?.cc?.temp)
    const [loading, setLoading] = useState(false)
    const [dailyForecast, setDailyForecast] = useState(false)
    const [error, setError] = useState(false)
    const { selectedCity, roundTemp } = useStateContext()
    const meteogramUrl = `https://meteobahia.com.ar/scripts/meteogramas/${selectedCity}.xml`

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



    useEffect(() => {

        setLoading(true)
        console.log("fetching")
        fetchXML(meteogramUrl)
            .then(res => {

                const data = res.weatherdata
                const agrupadosPorDia = agruparPorDia(data.forecast.tabular.time)
                const resultadoFinal = Object.values(agrupadosPorDia)

                const x = resultadoFinal.map((day, i) => {
                    return {
                        weather: day,
                        title: formatearFecha(day[0]["@_from"]),
                        title2: formatearFecha(day[0]["@_from"]).slice(0, 3).replace("Mañ", "Mañana"),
                        date: day[0]["@_from"],
                    }
                })

                x.pop()
                setDailyForecast(x)

            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false))

    }, [selectedCity])



    return (



        <View style={s.container}>

            {
                temp != null &&
                <>
                    <TouchableRipple onPress={() => {
                        push({
                            pathname: "weather",
                            params: { selectedCity }

                        })
                    }}>


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
                    </TouchableRipple>
                    <Text style={[s.temperature, { color: mainColor, textShadowColor: mainColor, }]}>{temp}°</Text>

                    {/* <Text numberOfLines={2} style={[s.description, { color: mainColor, textShadowColor: mainColor, }]}>
                            {currentForecast?.cc?.condition}
                        </Text> */}
 
                    {
                        !loading && dailyForecast &&

                        <ScrollView horizontal>
                            <View style={{ flexDirection: "row" }}>

                                {
                                    Array.from({ length: 10 }).map((a, i) => (

                                        <View key={i} style={{ flexDirection: "column", borderRightWidth: 1, borderColor: "#2c2c2c", justifyContent: "flex-start", gap: 6, alignItems: "center", paddingVertical: 5, paddingHorizontal: 7 }}>


                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 7, justifyContent: "space-between" }}>
                                                <View></View>
                                                <Text style={[s.title, { color: mainColor }]}>{dailyForecast[i]?.title2.replace("á","A").replace("é","E")}</Text>
                                                {
                                                    sumPrecipitation(dailyForecast[i]?.weather) > 0 ?
                                                        <Icon source={"water"} color="aqua" size={10} />
                                                        :
                                                        <View></View>
                                                }
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "center" }}>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon source="arrow-up" color={mainColor} size={12} />

                                                    <Text style={[s.maxMin, { color: mainColor }]}><Text style={{ fontSize: 12 }}></Text>{Math.round(findMinMaxTemperature(dailyForecast[i]?.weather).maxTemp.value)}°</Text>
                                                </View>



                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Icon source="arrow-down" color={"blue"} size={12} />
                                                    <Text style={[s.maxMin, { color: mainColor }]}><Text style={{ fontSize: 12, }}></Text>{Math.round(findMinMaxTemperature(dailyForecast[i]?.weather).minTemp.value)}°</Text>
                                                </View>


                                            </View>
                                            <Text style={{ color: mainColor, textAlign: "center", fontSize: 11, }}>{dailyForecast[i].weather[0]["symbol"]["@_name"].replace(" ", "\n")}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </ScrollView>
                    }




                </>
            }



        </View >


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
        paddingLeft: 5

    },
    description: {

        maxWidth: "58%",
        paddingLeft: 10,
        alignSelf: "flex-end",
        marginBottom: 10,
        color: "red",
        fontSize: 22,
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
    },
    maxMin: {

        fontFamily: 'digital-7-mono-italic',
        fontSize: 33,

    },
    title: {
        fontSize: 22,
        fontFamily: 'digital-7-mono-italic',
    }

})