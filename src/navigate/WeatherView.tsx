import { useState, useEffect, useRef } from 'react'
// import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import Snackbars from 'src/muiComponents/Snackbars'
import axios from 'axios'

const WeatherView = () => {
    const [weatherInfo, setWeatherInfo] = useState({
        temperature: undefined,
        weather: undefined,
        icon: undefined,
        loaded: false,
    })
    const APIKEY = 'e9f8a415cef0c0bb87f7da5e167bdaf1'
    const latitude = 37.5948
    const longitude = 127.0531
    const showError = (message) => {
        setTimeout(() => {
            console.log(message)
        }, 500)
    }
    // const getCurrentWeather = async () => {
    const getCurrentWeather = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${APIKEY}&units=metric`)
        .then((response) => {
            setWeatherInfo({
                temperature: response.data.main.temp,
                weather: response.data.weather[0].main,
                icon: response.data.weather[0].icon,
                loaded: true,
            })
        })
        .catch((error) => {
            setWeatherInfo({
                ...weatherInfo,
                loaded: true,
            })
            showError('Failed to load weatherinfo')
        })
    }
    useEffect(() => {
        getCurrentWeather();
    }, []);
    let data = [];
    const {
        loaded,
        weather,
        temperature,
        icon
    } = weatherInfo;
    if (weather && temperature && icon) {
        data.push(weatherInfo);
    }
    
    return (
        <div>
            {loaded ? 
                <div className='flex flex-col px-5'>
                    <img className='size-10' src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/>
                    <span>회기동 섭씨 {temperature}도</span>
                </div>
                :
                <div className='flex flex-col px-5'>
                    <img className='size-10' src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/>
                    <span>회기동 섭씨 {temperature}도</span>
                </div>
            }
        </div>
    )
}

export default WeatherView