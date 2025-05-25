import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useStateContext } from '../context/StateProvider';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const BrightnessSettings = () => {
    const { increaseBrightness, setIncreaseBrightness, decreaseBrightness, setDecreaseBrightness } = useStateContext()
    const { back } = useRouter()

    useEffect(() => {


    }, [])


    return (
        <View style={s.container}>
            
            <Text style={s.label}>Subir brillo a</Text>
            <View style={s.row}>
                <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="%"
                    value={increaseBrightness.level}
                    onChangeText={(text) => setIncreaseBrightness({ ...increaseBrightness, level: text })}
                />
                <Text style={s.label}>%  a las </Text>
                <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="HH"
                    value={increaseBrightness.hour}
                    onChangeText={(text) => setIncreaseBrightness({ ...increaseBrightness, hour: text })}
                />
                <Text style={s.colon}>:</Text>
                <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="MM"
                    value={increaseBrightness.minute}
                    onChangeText={(text) => setIncreaseBrightness({ ...increaseBrightness, minute: text })}
                />
                <Text style={s.label}> hs</Text>
            </View>

            
            <Text style={[s.label, { marginTop: 30 }]}>Bajar brillo a</Text>
            <View style={s.row}>
                <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="%"
                    value={decreaseBrightness.level}
                    onChangeText={(text) => setDecreaseBrightness({ ...decreaseBrightness, level: text })}
                />
                <Text style={s.label}>%  a las </Text>
                <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="HH"
                    value={decreaseBrightness.hour}
                    onChangeText={(text) => setDecreaseBrightness({ ...decreaseBrightness, hour: text })}
                />
                <Text style={s.colon}>:</Text>
                <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="MM"
                    value={decreaseBrightness.minute}
                    onChangeText={(text) => setDecreaseBrightness({ ...decreaseBrightness, minute: text })}
                />
                <Text style={s.label}> hs</Text>
            </View>


            <Button
                buttonColor='navy'
                textColor='white'
                style={{ marginTop: 40, borderRadius: 3, width: "20%" }}
                onPress={() => {

                    back()
                }}
            >Aceptar</Button>
        </View>
    )
}

export default BrightnessSettings

const s = StyleSheet.create({
    container: {
        color: "white",
        padding: 20
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "white",
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    colon: {
        marginRight: 10,
        fontSize: 18,
        color: "white",

    },
    input: {
        backgroundColor: "#1c1c1c",
        color: "white",
        borderRadius: 5,
        padding: 8,
        marginRight: 10,
        width: 50,
        textAlign: 'center'
    }
});