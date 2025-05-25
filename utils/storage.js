import AsyncStorage from "@react-native-async-storage/async-storage";


export const saveCity = async (code) => {

    try {
        await AsyncStorage.setItem('city', code)
    } catch (error) {
        console.error(error)
    }

}

export const getCity = async () => {
  try {
    const code = await AsyncStorage.getItem('city');
    return code
  } catch (error) {
    console.error('Failed to get city code:', error);
    return [];
  }
};


export const saveClockFont = async (font) => {

  try {
      await AsyncStorage.setItem('clockFont', font)
  } catch (error) {
      console.error(error)
  }

}



export const removeCity = async  ()=>{
    await AsyncStorage.removeItem("city")
}

const CITY_CODES_KEY = 'city_codes';


export const saveCityCode = async (code) => {
  try {
    const codes = await getCityCodes();
    if (!codes.includes(code)) {
      const updatedCodes = [...codes, code];
      await AsyncStorage.setItem(CITY_CODES_KEY, JSON.stringify(updatedCodes));
    }
  } catch (error) {
    console.error('Failed to save city code:', error);
  }
};


export const getCityCodes = async () => {
  try {
    const codes = await AsyncStorage.getItem(CITY_CODES_KEY);
    return codes ? JSON.parse(codes) : [];
  } catch (error) {
    console.error('Failed to get city codes:', error);
    return [];
  }
};

export const deleteCityCode = async (code) => {
  try {
    const codes = await getCityCodes();
    const updatedCodes = codes.filter((item) => item !== code);
    await AsyncStorage.setItem(CITY_CODES_KEY, JSON.stringify(updatedCodes));
  } catch (error) {
    console.error('Failed to delete city code:', error);
  }
};


export const cityCodeExists = async (code) => {
  try {
    const codes = await getCityCodes();
    return codes.includes(code);
  } catch (error) {
    console.error('Failed to check if city code exists:', error);
    return false;
  }
};