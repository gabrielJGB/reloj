import { StatusBar, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Stack, useFocusEffect } from 'expo-router'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { StateProvider } from '../context/StateProvider'
import { useKeepAwake } from 'expo-keep-awake';
import WeatherHeader from '../components/WeatherHeader';

const Layout = () => {

    const [selectedCity, setSelectedCity] = useState(null)
    const [toggleDetails, setToggleDetails] = useState(true)
 
    const [increaseBrightness, setIncreaseBrightness] = useState({
        level: 70,
        hour: 7,
        minute: 25
    });

    const [decreaseBrightness, setDecreaseBrightness] = useState({
        level: 10,
        hour: 0,
        minute: 30
    });


    useKeepAwake()

    useFocusEffect(useCallback(() => {


        const hideUI = async () => {

            await NavigationBar.setVisibilityAsync('hidden');
            await NavigationBar.setBackgroundColorAsync('transparent');
            await NavigationBar.setButtonStyleAsync('dark');
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        };


        StatusBar.setHidden(true, 'fade');

        hideUI()
        hideUI()
        



    }, []));



    return (


        <StateProvider value={{ selectedCity, setSelectedCity, toggleDetails, setToggleDetails, increaseBrightness, setIncreaseBrightness,decreaseBrightness, setDecreaseBrightness }}>
            <ThemeProvider value={DarkTheme}>
                <StatusBar hidden />
                <Stack
                    screenOptions={{
                        animation: "slide_from_right",
                    }}

                >

                    <Stack.Screen name='index' options={{ headerShown: false }} />
                    <Stack.Screen name='settings' options={{ headerShown: true, headerTitle: "Configuración" }} />
                    <Stack.Screen name='search' options={{ headerShown: false, headerTitle: "Buscar" }} />
                    <Stack.Screen name='weather' options={{ header: () => <WeatherHeader /> }} />
                    <Stack.Screen name='brightnessSettings' options={{ headerTitle: "Programar brillo de pantalla" }} />

                </Stack>
            </ThemeProvider>
        </StateProvider>

    )
}

export default Layout

