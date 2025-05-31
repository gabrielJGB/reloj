import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Divider, IconButton } from 'react-native-paper'
import { useStateContext } from '../context/StateProvider'



const Options = () => {

    const { back } = useRouter()
    const { setMainColor } = useStateContext()

    const colors = [
        {
            name: "Rojo",
            code: "red"
        },
        {
            name: "Verde",
            code: "lime"
        },
        {
            name: "Negro",
            code: "#1c1c1c"
        },
        {
            name: "Blanco",
            code: "white"
        },
        {
            name: "Azul",
            code: "blue"
        },
        {
            name: "Aqua",
            code: "aqua"
        },
        {
            name: "Amarillo",
            code: "yellow"
        },
                {
            name: "Naranja",
            code: "orange"
        },
    ]



    return (
        <View style={s.container}>
            {/* <View style={s.header}>
                <IconButton icon="arrow-left" iconColor="white" onPress={() => back()} />
                <Text style={s.name}>Seleccionar color</Text>
            </View> */}
            <ScrollView>

                <View style={s.options}>

                    {
                        colors.map((color, i) => (
                            <View key={i} style={s.option}>
                                <Divider style={{ backgroundColor: "#2c2c2c", width: "100%" }} />
                                <Button
                                    style={{ borderRadius: 0, width: "100%", justifyContent: "center" }}
                                    buttonColor='back'
                                    rippleColor='grey'
                                    textColor='white'
                                    contentStyle={s.buttonContent}
                                    onPress={() => {

                                        setMainColor(color.code)
                                        back()

                                    }}
                                >
                                    <View style={s.buttonBody}>



                                        <View style={[s.dot, { backgroundColor: color.code }]}></View>


                                        <Text style={s.optionText}>{color.name}</Text>

                                    </View>

                                </Button>
                            </View>
                        ))
                    }

                </View>
            </ScrollView>
        </View>
    )
}

export default Options

const s = StyleSheet.create({
    container: {
        flexDirection: "column",



    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7
    },
    name: {
        fontWeight: "500",
        fontSize: 18,
        color: "white"
    },
    options: {

        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    option: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%"
    },
    buttonContent: {
        paddingLeft: 5,
        paddingVertical: 7,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    optionText: {
        fontSize: 13,
        color: "white"
    },
    buttonBody: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    }
})