import { Alert, ScrollView, StyleSheet, Text, View, } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Dialog, Icon, IconButton, TextInput,PaperProvider, Portal, TouchableRipple } from 'react-native-paper'
import cities from '../data/cities.json'
import { useFocusEffect, useRouter } from 'expo-router'
import { deleteCityCode, getCityCodes, saveCity } from '../utils/storage'
import { useStateContext } from '../context/StateProvider'



const SearchPage = () => {
  const { back } = useRouter()
  const textInput = useRef()
  const { setSelectedCity ,mainColor} = useStateContext()
  const [text, setText] = useState("");
  const [results, setResults] = useState([])
  const [cityCodes, setCityCodes] = useState(false)
  const [visible, setVisible] = useState(false);
  const [deleteCode, setDeleteCode] = useState("")

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);


  useEffect(() => {

    if (text != "" && text.length > 1) {

      const resp = cities.filter(city => {
        
        const cityLower = city.nombre.toLowerCase()
        const provinceLower = city.provincia.toLowerCase()
        if (cityLower.includes(text) || provinceLower.includes(text)) {
          return city
        }
      })

      setResults(resp)
    } else {
      setResults([])
    }

  }, [text])


  const _getCityCodes = async () => {
    const codes = await getCityCodes()

    let arr = codes.map((code) => {
      return cities.find(city => city.code === code)
    })

    setCityCodes(arr)
  }


  useFocusEffect(useCallback(() => {


    textInput.current.focus()
    _getCityCodes()


  }, []))


  return (
    <PaperProvider>
      <View style={s.container}>


    {/* <TextInput ref={textInput} placeholder='Buscar una ciudad' value={text} onChange={setText} style={{borderColor:"gray",borderWidth:1,color:"white"}}/> */}

        <TextInput
          ref={textInput}
          label="Buscar una ciudad"
          value={text.toLowerCase()}
          activeUnderlineColor={mainColor}
          left={<TextInput.Icon icon="arrow-left" color="grey" onPress={() => back()} />}
          style={{ backgroundColor: "#121212" }}
          textColor='white'
          placeholderTextColor='white'
          onChangeText={text => setText(text)}

        />

        <ScrollView keyboardShouldPersistTaps='handled' >
          <View style={s.results}>
            {
              results.length > 0 ?

                results.map((result, i) => (
                  <TouchableRipple
                    key={i}
                    rippleColor="gray"
                    unstable_pressDelay={80}
                    borderless
                    style={{ borderRadius: 7 }}
                    onPress={() => {
                      saveCity(result.code)
                      setSelectedCity(result.code)
                      back()
                    }}

                  >
                    <View style={s.result}>
                      <Icon source="map-marker" color='white' size={18} />

                      <Text numberOfLines={1} style={s.resultText}>{result.nombre}, {result.provincia}</Text>
                    </View>

                  </TouchableRipple>
                ))

                :
                <>
                  {
                    cityCodes && cityCodes.length > 0 && text === "" ?
                      <View style={[s.results, { padding: 0 }]}>
                        <Text style={s.title}>Guardados: </Text>
                        {
                          cityCodes.map((item, i) => (
                            <TouchableRipple
                              key={i}
                              rippleColor="white"
                              unstable_pressDelay={80}
                              borderless
                              style={{ borderRadius: 7 }}
                              onLongPress={() => {
                                setDeleteCode(item.code)
                                showDialog()
                              }}
                              onPress={() => {
                                saveCity(item.code)
                                setSelectedCity(item.code)
                                back()
                              }}

                            >
                              <View style={s.result}>
                                <Icon source="map-marker" color='white' size={18} />

                                <Text numberOfLines={1} style={s.resultText}>{item.nombre}, {item.provincia}</Text>
                              </View>

                            </TouchableRipple>
                          ))
                        }

                      </View> : <Text style={s.noResults}>. . .</Text>
                  }
                </>
            }
          </View>
        </ScrollView>

        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Borrar ubicación?</Dialog.Title>

              <Dialog.Actions>
                <Button contentStyle={{ paddingHorizontal: 13 }} onPress={hideDialog}>No</Button>
                <Button contentStyle={{ paddingHorizontal: 13 }} onPress={async () => {
                  await deleteCityCode(deleteCode)
                  _getCityCodes()
                  hideDialog()
                }}>Si</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>


      </View>
    </PaperProvider>
  )
}

export default SearchPage

const s = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  noResults: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    marginVertical: 12
  },
  results: {
    padding: 7,
    flexDirection: "column",
    gap: 9,
    marginTop: 3,
    marginBottom: 100
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 15,
    backgroundColor:"#1c1c1c"
  },
  resultText: {
    fontWeight: "500",
    color: "white",
  },
  title: {
    color: "white",
    fontWeight: "500",
    fontSize: 15

  }
})