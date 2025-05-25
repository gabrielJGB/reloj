import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, List } from 'react-native-paper'
import { useFocusEffect, useRouter } from 'expo-router'
import { TouchableHighlight } from 'react-native'
import { useStateContext } from '../context/StateProvider'
import { getCity } from '../utils/storage'
import cities from '../data/cities.json'

const Settings = () => {

  const { push } = useRouter()
  const [cityCode, setCityCode] = useState("")
  const [cityName, setCityName] = useState("")

  useFocusEffect(useCallback(() => {
    

    getCity().then(code => {
      setCityCode(code)
      getCityName(code)
    })

  }, []))


  const getCityName = (code) => {

    const x = cities.find(city => city.code === code)

    if(x != undefined)
      setCityName(x.nombre)

  }


  return (
    <View style={s.container}>

      <TouchableHighlight onPress={() => { push("search") }}>
        <View style={s.option}>
          <Text style={s.text}>
            {
              cityCode === null ? "Buscar una ciudad" : `Ubicación: ${cityName}`
            }
          </Text>
        </View>
      </TouchableHighlight>


      {/* <TouchableHighlight onPress={() => { push("brightnessSettings") }}>
        <View style={s.option}>
          <Text style={s.text}>Programar brillo de pantalla</Text>
        </View>
      </TouchableHighlight> */}


    </View>
  )
}

export default Settings

const s = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  button: {
    width: "100%"
  },
  text: {
    color: "white",
    fontWeight: "semibold",
    fontSize: 17
  },
  option: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c1c"
  }
})