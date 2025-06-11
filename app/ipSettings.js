import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useStateContext } from '../context/StateProvider'
import { Button, TextInput } from 'react-native-paper'
import { useRef, useState } from 'react'

const Settings = () => {

    const { back } = useRouter()
    const { setServerIP, mainColor ,serverIP} = useStateContext()
    const [text, setText] = useState(serverIP)
    const textInput = useRef()

    return (
        <View style={s.container}>
            <TextInput
                ref={textInput}
                label="IP"
                value={text.toLowerCase()}
                activeUnderlineColor={mainColor}
                // left={<TextInput.Icon icon="arrow-left" color="grey" onPress={() => back()} />}
                style={{ backgroundColor: "#121212",borderRadius:7,width:"40%" }}
                textColor='white'
                placeholderTextColor='white'
                onChangeText={text => setText(text)}

            />

            <Button
                style={{width:"20%",borderRadius:7,padding:3}}
                buttonColor='navy'
                textColor='white'
                onPress={() => {
                    setServerIP(text)
                    back()
                }}>Aceptar</Button>

        </View>
    )
}

export default Settings

const s = StyleSheet.create({
    container: {
        flexDirection:"column",
        gap:20,
        padding: 20
    }
})