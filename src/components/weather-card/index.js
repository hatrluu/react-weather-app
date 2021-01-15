import react from 'react';
import {convertKToC, convertKToF, convertCToF, convertFToC} from '../../services/tempConvert'
import './style.css';

export default class WeatherCard extends react.Component {
    state = {};

    componentDidMount() {
        const {min, max} = this.getMinMaxTemp();
        this.setState(
            {
                minTemp: this.tempConversion(min, true),
                maxTemp: this.tempConversion(max, true)
            }
        );
    }

    componentDidUpdate(nextProps, nextState) {
        const [min, max] = [this.state.minTemp, this.state.maxTemp]
        if(this.props.isC !== nextProps.isC) {
            this.setState(
                {
                    minTemp: this.tempConversion(min, false),
                    maxTemp: this.tempConversion(max, false)
                }
            );  
        }
    }

    tempConversion(temp, isNew) {
        if(!isNew) {
            return this.props.isC ? convertFToC(temp) : convertCToF(temp);
        }
        return this.props.isC ? convertKToC(temp) : convertKToF(temp);
    }

    getMinMaxTemp() {
        let min = 9999;
        let max = 0;
        this.props.weatherData.forEach(i => {
            if(max < i.main.temp_max) {
                max = i.main.temp_max;
            }
            if(min > i.main.temp_min) {
                min = i.main.temp_min;
            }
        })

        return {min, max};
    }

    render() {
        console.log(this.props.weatherData);
        let unit = this.props.isC ? 'C' : 'F';
        return (
            <div className="card-container">
                    <label><b>{this.props.day}</b></label><br/>
                    <h2>{this.state.maxTemp}&#176;{unit}/{this.state.minTemp}&#176;{unit}</h2>
                    <table>
                        {
                            this.props.weatherData.map(w => (
                                <tr>
                                    <td>{new Date(w.dt_txt).getHours()}</td>
                                    <td> {w.weather[0].description}</td>
                                </tr>
                            ))
                        }
                    </table>
            </div>
        )
    }
}