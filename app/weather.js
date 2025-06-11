import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator } from 'react-native-paper'
import { agruparPorDia, formatearFecha } from '../utils/weather'
import { fetchXML } from '../utils/fetch'
import DayOverview from '../components/DayOverview'
import { useStateContext } from '../context/StateProvider'

const WeatherScreen = () => {


    const { push } = useRouter()
    const { selectedCity } = useLocalSearchParams()
    const [dailyForecast, setDailyForecast] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const { toggleDetails } = useStateContext()

    const meteogramUrl = `https://meteobahia.com.ar/scripts/meteogramas/${selectedCity}.xml`


    useFocusEffect(useCallback(() => {
        
        setLoading(true)
        fetchXML(meteogramUrl)
            .then(res => {
                const data = res.weatherdata
                const agrupadosPorDia = agruparPorDia(data.forecast.tabular.time)
                const resultadoFinal = Object.values(agrupadosPorDia)

                const x = resultadoFinal.map((day, i) => {
                    return {
                        weather: day,
                        title: formatearFecha(day[0]["@_from"]),
                        date: day[0]["@_from"],
                    }
                })

                x.pop()
                setDailyForecast(x)

            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false))

    }, []))






    

    if (loading)
        return (
            <ActivityIndicator style={{ marginTop: 20 }} size={70} color="white" />
        )

    if (error)
        return <Text style={s.error}>Ha ocurrido un error: {error}</Text>



    if (!dailyForecast)
        return <Text style={s.error}>Ha ocurrido un error</Text>

    return (

        <ScrollView >
            <View style={[s.overviewContainer]}>
                {
                    dailyForecast &&
                    dailyForecast.map((dayData, i) => (
                        <DayOverview key={i} dayData={dayData}/>
                    ))
                }
            </View>
        </ScrollView>

    )
}

export default WeatherScreen

const s = StyleSheet.create({
    error: {
        color: "white"
    },
    overviewContainer: {
        flex:1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        marginTop:3
        

    },
})