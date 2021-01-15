import { Component } from 'react';
import WeatherCard from '../weather-card';
import axios from 'axios';
import { convertKToC, convertKToF } from '../../services/tempConvert.js';
import './style.css';

const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
const zipCode = '10001'
const today = new Date();
const dayOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default class Forecast extends Component {

    constructor(props) {
        super(props);
        this.state = { city: '', weatherData: new Map(), isC: false }
        this.handleTempUnitChange = this.handleTempUnitChange.bind(this);
        this.setParamsWithCoords = this.setParamsWithCoords.bind(this);
        this.setParamsWithZip = this.setParamsWithZip.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setParamsWithCoords, this.setParamsWithZip);
        }
    }

    setParamsWithCoords(location) {
        return this.getData({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            appid: apiKey
        })
    }

    setParamsWithZip() {
        return this.getData({
            zip: zipCode,
            appid: apiKey
        })
    }

    async getData(params) {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: params
        })
        const data = response.data;
        let weatherByDate = new Map();
        let nextDays = this.getNextDays();
        data.list.forEach(i => {
            let date = new Date(i.dt_txt).getDate();
            let temp = [];

            if (nextDays.includes(date)) {
                if (!weatherByDate.has(date)) {
                    temp.push(i);
                } else {
                    temp = weatherByDate.get(date)
                    temp.push(i);
                }
                weatherByDate.set(date, temp)
            }
        });

        this.setState(
            {
                city: data.city,
                weatherData: weatherByDate
            }
        )
    }
    getNextDays() {
        const fiveDays = [parseInt(today.getDate())];
        for (let i = 1; i < 5; i++) {
            fiveDays.push(parseInt(fiveDays[0]) + i)
        }
        return fiveDays;
    }

    handleTempUnitChange(e) {
        const value = e.target.value;
        this.setState({ isC: (value === 'true') });
    }
    render() {
        let weatherCard = [];
        let temp, feels_like, day;
        let todayWeather = this.state.weatherData.has(today.getDate()) ? this.state.weatherData.get(today.getDate())[0] : { main: { temp: 0 } };
        let unit = this.state.isC ? 'C' : 'F';
        this.state.weatherData.forEach((i, j) => {
            var date = new Date();
            date.setDate(j);
            day = j === today.getDate() ? dayOfWeek[date.getDay()] + '*' : dayOfWeek[date.getDay()];

            weatherCard.push(
                <li key={j}>
                    <WeatherCard weatherData={i} isC={this.state.isC} day={day} />
                </li>
            )
        })
        if (this.state.isC) {
            temp = convertKToC(todayWeather.main.temp);
            feels_like = convertKToC(todayWeather.main.feels_like);
        } else {
            temp = convertKToF(todayWeather.main.temp);
            feels_like = convertKToF(todayWeather.main.feels_like);
        }
        return (
            <div>
                <h2>Current weather in <u>{this.state.city.name}</u></h2>
                <div className="todays-weather">
                    <h1>{temp}&#176;</h1>
                    <select defaultValue="false" onChange={this.handleTempUnitChange}>
                        <optgroup>
                            <option value="true">C</option>
                            <option value="false">F</option>
                        </optgroup>
                    </select>
                </div>
                <span>Feels like {feels_like}&#176;{unit} </span>/
                <span> Humidity {todayWeather.main.humidity}%</span>
                <h2>5 Days Forecast</h2>
                <ul className="card-list">
                    {weatherCard}
                </ul>
            </div>
        )
    }
}