import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { useFonts } from 'expo-font';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { useStateContext } from '../context/StateProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchXML } from '../utils/fetch';
import Weather from '../components/Weather';
import { getCity } from '../utils/storage'
import * as Brightness from 'expo-brightness';

const mainColor = "red"

const formatDate = (date) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = months[date.getMonth()];
  const dateStr = `${dayName} ${dayNumber} de ${monthName}`

  return dateStr.toUpperCase();
};

export default function App() {
  const { push } = useRouter()
  const [hours, setHours] = useState('--')
  const [minutes, setMinutes] = useState('--')
  const [seconds, setSeconds] = useState('--')
  const [toggleDot, setToggleDot] = useState(false)
  const [dateString, setDateString] = useState(formatDate(new Date()))
  const { selectedCity, setSelectedCity, mainColor, setMainColor } = useStateContext()
  const [loading, setLoading] = useState(true);
  const [currentForecast, setCurrentForecast] = useState(false)

  const [brightness, setBrightness] = useState(1); // valor inicial por defecto

  const [loaded] = useFonts({
    'digital-7': require('../assets/fonts/digital-7.ttf'),
    'digital-7-mono': require('../assets/fonts/digital-7-mono.ttf'),
    'digital-7-mono-italic': require('../assets/fonts/digital-7-mono-italic.ttf'),
  });

  const [originalBrightness, setOriginalBrightness] = useState(null);

  useEffect(() => {

    // push("weather")
    const init = async () => {
      const { granted } = await Brightness.requestPermissionsAsync();
      if (granted) {
        const current = await Brightness.getBrightnessAsync();
        setOriginalBrightness(current);
      }
    };

    init();


    scheduleBrightnessChange(7, 25, 0.8)
    scheduleBrightnessChange(8, 25, 0.5)
    scheduleBrightnessChange(0, 30, 0.1)

  }, []);





  const scheduleBrightnessChange = (hour, minute, targetBrightness) => {
    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);


    if (now > target) {
      target.setDate(target.getDate() + 1);
    }

    const msUntilTarget = target.getTime() - now.getTime();

    setTimeout(async () => {
      if (originalBrightness !== null) {
        await Brightness.setBrightnessAsync(targetBrightness);
        console.log(`Brillo cambiado a ${targetBrightness * 100}% a las ${hour}:${minute}`);
      }
    }, msUntilTarget);


  };




  const checkCity = async () => {

    try {
      const city = await AsyncStorage.getItem('city');

      setLoading(true)
      if (city != null) {

        setSelectedCity(city);

      } else {
        setSelectedCity(false);
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false)
    }

  };

  const _fetchCityWeather = () => {
    checkCity()

    getCity().then(code => {
      setSelectedCity(code)

      const nowUrl = `https://meteobahia.com.ar/scripts/xml/now-${code}.xml?_=${new Date().getTime()}`

      console.log("Fetching weather... ", new Date());


      setLoading(true)
      fetchXML(nowUrl)
        .then(res => { setCurrentForecast(res.response) }).finally(() => { setLoading(false) })
    })
  }

  useEffect(() => {

    const initBrightness = async () => {
      const { granted } = await Brightness.requestPermissionsAsync();
      if (granted) {
        const currentBrightness = await Brightness.getBrightnessAsync();
        setBrightness(currentBrightness);
      }
    };
    initBrightness();
  }, []);


  const changeBrightness = async (delta) => {
    let newBrightness = brightness + delta;

    
    newBrightness = Math.min(1, Math.max(0, newBrightness));

    await Brightness.setBrightnessAsync(newBrightness);
    setBrightness(newBrightness);
  };

  useFocusEffect(useCallback(() => {

    // push("weather")


    _fetchCityWeather()

    let interval = setInterval(() => {

      _fetchCityWeather()

    }, 1000 * 60 * 5);

    return () => clearInterval(interval)

  }, [selectedCity]))



  useFocusEffect(useCallback(() => {

    const interval = setInterval(() => {
      const today = new Date();
      setDateString(formatDate(today))

    }, 60 * 1000)

    return () => clearInterval(interval);
  }, []))



  useFocusEffect(useCallback(() => {

    const interval = setInterval(async () => {
      const date = new Date()

      const _hours = String(date.getHours()).padStart(2, "0")
      const _minutes = String(date.getMinutes()).padStart(2, "0")
      const _seconds = String(date.getSeconds()).padStart(2, "0")

      setHours(_hours)
      setMinutes(_minutes)
      setSeconds(_seconds)
      setToggleDot(prev => !prev)





//change &&
      if (change && date.getHours() === 16 && (date.getMinutes() > 14)) {
        await Brightness.setBrightnessAsync(1)

      }

    }, 1000);

    return () => clearInterval(interval);
  }, []))


  if (!loaded) {
    return <Text>--</Text>
  }

  // 

  return (
    <View style={s.mainContainer}>

      <Text style={s.brightness}>{Math.round(brightness * 100)}%</Text>

      <View style={s.brightnessContainer}>

        {/* <TouchableRipple onPress={() => { changeBrightness(-0.1) }}>
          <View style={s.brightnessButton}></View>
        </TouchableRipple> */}

        <TouchableNativeFeedback
          onPress={() => { changeBrightness(-0.1) }}

        ><View style={s.brightnessButton}></View></TouchableNativeFeedback>

        <TouchableNativeFeedback
          onPress={() => { changeBrightness(0.1) }}

        ><View style={s.brightnessButton}></View></TouchableNativeFeedback>

        {/* <TouchableRipple onPress={() => { changeBrightness(0.1) }}>
          <View style={s.brightnessButton}></View>
        </TouchableRipple> */}

      </View>


      <View style={s.topContainer}>

        <View style={s.dateContainer}>
          <IconButton iconColor={mainColor} icon="cog" onPress={() => { push("settings") }} />
          <Text style={[s.dateString,{color:mainColor,textShadowColor:mainColor}]}>{dateString}</Text>
          <View></View>
        </View>

        <View style={s.clock}>
          <Text style={[s.numbers, { color: mainColor, textShadowColor: mainColor }]}>{hours}</Text>
          <Text style={[s.dots, { color: (toggleDot ? mainColor : '#1c1c1c') }]}>:</Text>
          <Text style={[s.numbers, { color: mainColor, textShadowColor: mainColor }]}>{minutes}</Text>
          <Text style={[s.seconds, { color: mainColor, textShadowColor: mainColor }]}>{seconds}</Text>
        </View>

      </View>


      <View style={s.weather}>
        {
          !loading && selectedCity != null &&

          <Weather currentForecast={currentForecast} mainColor={mainColor} />

        }
      </View>


    </View>


  );
}

const s = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 0,

  },

  topContainer: {
    display: "flex",
    justifyContent: "space-between",


  },

  dateContainer: {

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 7,
    width: "100%",
  },
  dateString: {
    color: mainColor,
    fontSize: 38,
    fontFamily: 'digital-7-mono-italic',
    textAlign: "center",
    letterSpacing: 3,
    textShadowColor: 'red',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10
  },
  weather: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingLeft: 20,
    gap: 0
  },
  weatherContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,

  },
  weatherImg: {
    marginLeft: 22,
    backgroundColor: "yellow",
    borderRadius: 25,
    width: 50,
    height: 50
  },

  clock: {
    textAlign: "left",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  numbers: {
    paddingLeft: 7,
    fontSize: 240,
    color: mainColor,
    transform: [{ rotate: '0deg' }],
    textAlign: "center",
    fontFamily: 'digital-7-mono-italic',
    textShadowColor: 'red',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 17
  },
  seconds: {

    fontSize: 70,
    paddingBottom: 10,
    alignSelf: "flex-end",
    color: mainColor,
    transform: [{ rotate: '0deg' }],
    textAlign: "center",
    fontFamily: 'digital-7-mono-italic',
    textShadowColor: 'red',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 7
  },
  dots: {
    textAlign: "center",
    fontSize: 120,
    color: mainColor,
    paddingHorizontal: 12
  },
  brightnessContainer: {
    zIndex: 20,
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    top: 50,
    left: 0,
  },
  brightnessButton: {

    width: "50%",
    height: "100%",
    borderRadius: 0,
    paddingVertical: 100,
  },
  brightness: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 20,
    font: 16,
    color: "#3c3c3c",
    fontWeight: "800"
  }
});
