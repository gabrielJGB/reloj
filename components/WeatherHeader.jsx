import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { IconButton, Switch } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { useStateContext } from '../context/StateProvider'

const WeatherHeader = () => {

  const { back } = useRouter()
  const { setToggleDetails, toggleDetails } = useStateContext()

  return (
    <View style={s.container}>
      <View style={s.subContainer}>
        <IconButton icon={"arrow-left"} iconColor='white' onPress={() => back()} />
        <Text style={s.title}>Pronóstico del tiempo</Text>
      </View>

      <View style={s.subContainer}>
        <Text style={s.text}>Detalles</Text>
        <Switch color={"lime"} value={toggleDetails} onValueChange={()=>setToggleDetails(!toggleDetails)} />
      </View>

    </View>
  )
}

export default WeatherHeader

const s = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    paddingRight:62,
    borderWidth:1,
    borderColor:"black"
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,

  },
  text:{
    color: "gray",
    fontSize: 13,
  },
  title: {
    color: "white",
    fontSize: 18,
  },

})