import { Image, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { findMinMaxTemperature, formatHeaderDate, getIconCode, sumPrecipitation } from '../utils/weather'
import { useRouter } from 'expo-router'
import { ActivityIndicator, TouchableRipple } from 'react-native-paper'
import { useFonts } from 'expo-font'
import { useStateContext } from '../context/StateProvider'



const IMG_SIZE = 50

const DayOverview = ({ dayData }) => {

    const { push } = useRouter()
    const { toggleDetails, setToggleDetails } = useStateContext()
    const [groups, setGroups] = useState(false)
    const maxMin = findMinMaxTemperature(dayData.weather)
    const precipitation = sumPrecipitation(dayData.weather).toFixed(1)
    const date = formatHeaderDate(dayData.date.split("T")[0].replaceAll("-", "/"))
    const [toggleCurrent, setToggleCurrent] = useState(false)

    const arr = [

        // { time: "00:00", text: "" },
        { time: "00:00", text: "" },
        { time: "03:00", text: "" },
        { time: "06:00", text: "Mañana" },
        { time: "09:00", text: "" },
        { time: "12:00", text: "Mediodia" },
        { time: "15:00", text: "Tarde" },
        { time: "18:00", text: "" },
        { time: "21:00", text: "Noche" },

    ]


    useEffect(() => {
        if (!toggleDetails)
            setToggleCurrent(false)
    }, [toggleDetails])

    useEffect(() => {

        let groups = []
        arr.forEach((elem, i) => {

            let data = dayData.weather.find(item => item["@_from"].split("T")[1] === elem.time)



            if (data != undefined)
                groups.push({
                    time: elem.time,
                    text: elem.text,
                    data
                })
        })

        setGroups(groups);


    }, [])


    if (!groups)
        return <></>


    return (

        <TouchableRipple style={{ width: "100%" }} onPress={() => { setToggleCurrent(!toggleCurrent) }}>

            <View style={[s.container, {paddingBottom:toggleCurrent || toggleDetails?8:0}]} >

                {
                    groups &&
                    <>
                        <View style={s.header}>

                            <Text style={s.title}>{dayData.title}</Text>

                            <View style={s.headerBottom}>
                                {
                                    precipitation != "0.0" &&
                                    <Text style={s.precipitation}>{precipitation} mm</Text>
                                }

                                <Text style={s.bottomText}>
                                    <Text style={[s.maxMin, s.min]}>{Math.round(maxMin.minTemp.value)}°</Text>
                                </Text>

                                <Text style={s.bottomText}>/    <Text style={[s.maxMin, s.max]}>{Math.round(maxMin.maxTemp.value)}°</Text>
                                </Text>

                            </View>
                        </View>

                        {/* <View style={[s.groupContainer, { display: (!toggleDetails ? "none" : (toggleCurrent ? "flex" : "none")) }]}> */}
                        
                            <View style={[s.groupContainer, { display: (toggleCurrent ? "flex" : (toggleDetails ? "flex" : "none")) }]}>
                                {
                                    groups.map((group, i) => (
                                        <View style={[s.hour, { borderTopWidth: (i < groups.length ? 1 : 0) }]} key={i}>

                                            <Text style={s.dayTime}>{group.time}</Text>
                                            <Text style={s.temp}>{Math.round(group.data.temperature["@_value"])}°</Text>
                                            <Text style={s.description}>{group.data.symbol["@_name"]}</Text>
                                            <Text style={s.wind}>{group.data.windDirection["@_name"].split(" del ")[0]}  {group.data.windDirection["@_code"][0]}</Text>
                                            <Text style={s.hourPrecipitation}>
                                                {group.data.precipitation["@_value"] != "0.0" && group.data.precipitation["@_value"] + "mm"}
                                            </Text>
                                        </View>
                                    ))
                                }
                            </View>
                        

                    </>
                }





            </View>
        </TouchableRipple>

    )
}

export default DayOverview

const s = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
        borderWidth: 1,
        borderColor: "#141414",
        backgroundColor: "#1c1c1c",


    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 7,
        paddingHorizontal: 20,
        paddingRight:40,
        // backgroundColor:"rgb(22, 22, 22)"
    },

    title: {
        fontWeight: "semibold",
        color: "white",
        fontSize: 24
    },
    description: {
        fontSize: 17,
        color: "white",
        textAlign: "center",

    },
    wind: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",

    },
    hour: {
        flexDirection: "row",
        justifyContent:"flex-start",
        alignItems: "center",
        alignSelf:"stretch",
        gap: 20,
        paddingHorizontal:20,        
        textAlign:"center",
        backgroundColor:"rgb(14, 14, 14)",
        
        
    },
    temp: {
        color: "#efefef",
        fontSize: 33,
        fontWeight: "bold",
        textAlign: "center",
        minWidth:60,
        
    },
    groupContainer: {
        flexDirection: "column",
        gap: 3,
        
        
        paddingHorizontal:8

    },
    img: {
        width: IMG_SIZE,
        height: IMG_SIZE,
    },
    dayTime: {
        fontSize: 18,
        color: "lime"
        // color: "#b5b5b5",
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerBottom: {
        fontSize: 12,
        color: "grey",
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },
    maxMin: {
        fontSize: 30,

        fontWeight: "500",
    },
    min: {

        color: "rgb(22 48 250)",
    },
    max: {
        color: "#ff3b3b",
    },
    precipitation: {
        color: "aqua",
        paddingRight: 12,
        

    },
    bottomText: {
        fontSize: 12,
        color: "grey",
        // backgroundColor:"orange",
        minWidth: 36,
        textAlign: "center",
    },
    drops: {
        flexDirection: "row",
        alignItems: "center",
        gap: 0
    },
    hourPrecipitation: {
        color: "aqua",
        fontSize: 13,
        paddingBottom:4
    },
    hs: {
        fontSize: 13,
        color: "rgb(32, 185, 32)"
    }

})