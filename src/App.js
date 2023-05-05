

import React from 'react';
import { getWeatherData } from './API/openweathermap';
import { TableComponent } from './Components/Table'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastComponent } from './Components/Toast'
import { findIndex,formatLocalDate,formatInternationalDateWithOffset } from './helper'
import './App.css';
import cloud_logo from './Asset/cloud.png';
import sun_logo from './Asset/sun.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.textInput_City_Country = React.createRef();
    
    this.API_state = {
      data: null
    };

    this.toast_boolean_state = {
      toast_boolean : false
    };

    this.international_datetime = ''
    this.local_datetime = ''
    this.toast_msg = ''
    this.weather_logo = ''
    this.weather_history_data = []

    this.Preset_weather_local_storage()
  }

  Preset_weather_local_storage(){
    var weather_history_data = localStorage.getItem('weather_history_data');
    var weather_history_data_list = JSON.parse(weather_history_data)
    
    if(weather_history_data){
      this.weather_history_data = weather_history_data_list
    } else{
      this.weather_history_data = []
      localStorage.setItem('weather_history_data', JSON.stringify(this.weather_history_data))
    }

    this.search_weather('Singapore,SG')
  }

  reset_API_RESPONSE(){
    this.API_state.data = null
    this.clear_textInput_textInput_City_Country()
  }

  clear_textInput_textInput_City_Country() {
    try{
      this.textInput_City_Country.current.value = "";
    }catch (error){
      
    }
  }

  store_data_into_local_storage(){
    var weather_history_data = localStorage.getItem('weather_history_data');
    var weather_history_data_list = JSON.parse(weather_history_data)
    var weather_data_json = {
      INDEX:'',
      DATA:this.API_state.data,
      City_Country: this.API_state.data.name + ',' + this.API_state.data.sys.country,
      local_datetime:this.local_datetime,
      international_datetime:this.international_datetime
    }

    if(weather_history_data_list.length > 0){
      const index = findIndex(weather_history_data_list, 'City_Country', weather_data_json.City_Country);
      console.log(index)

      if(index >= 0){
        weather_history_data_list[index] =  weather_data_json
      }else{
        weather_history_data_list.push(weather_data_json)
      }

      localStorage.setItem('weather_history_data', JSON.stringify(weather_history_data_list))
    }else{
      weather_data_json.INDEX = ''
      weather_data_json = [weather_data_json]
      localStorage.setItem('weather_history_data', JSON.stringify(weather_data_json))
    }

    var weather_history_data = localStorage.getItem('weather_history_data');
    var weather_history_data_list = JSON.parse(weather_history_data)
    this.weather_history_data = weather_history_data_list
  }

  search(){
    var city_country = this.textInput_City_Country.current.value
    this.search_weather(city_country)
  }

  async search_weather(data) {
    console.log(data)
    var city_country = data
    city_country = city_country.split(',')

    var city = ''
    var country = ''

    if(city_country.length == 2){
      city = city_country[0]
      country = city_country[1]
    }else{
      this.trigger_toast('Invalid Input')
      this.reset_API_RESPONSE()
      return
    }
    
    this.reset_API_RESPONSE()
    
    try{
      const data = await getWeatherData(city, country);
      this.API_state.data = data
      this.setState({ data: data });

      await this.get_datetime(data.timezone)
      this.set_log(data)
      this.store_data_into_local_storage()

    }catch(error){
      const ERR_MESSAGE = error.message

      this.trigger_toast(ERR_MESSAGE)
    }
  }

  set_log(data){
    if(data.weather[0].main == 'Clouds'){
      this.weather_logo = cloud_logo
    }else{
      this.weather_logo = sun_logo
    }
  }

  trigger_toast(message){
    this.toast_boolean_state.toast_boolean = true
    this.setState({ toast_boolean: true });
    this.toast_msg = message
    
    setTimeout(() => {
      this.toast_boolean_state.toast_boolean = false
      this.setState({ toast_boolean: false });
    }, 5000);
  }

  get_datetime(timezoneOffset){
    this.international_datetime = formatInternationalDateWithOffset(timezoneOffset)
    this.local_datetime = formatLocalDate()
  }

  handleButtonClick = (value) => {
    this.search_weather(value)
  };
  
  render() {
    const { data } = this.API_state;
    const international_datetime = this.international_datetime
    const local_datetime = this.local_datetime
    const myData = this.weather_history_data
    const { toast_boolean } = this.toast_boolean_state
    const toast_msg = this.toast_msg
    const weather_logo = this.weather_logo

    return (
      <div className="background">
        <ToastComponent content={toast_msg} delay={5000} trigger={toast_boolean} />

        <div className='search_inputfield_button_div'>
          <div className='row' style={{width:'100%'}}>
            <div className='col-3'></div>
            <div className='col-5'>
              <Form.Control className='textInputCS'
                  type="text"
                  ref={this.textInput_City_Country}
                    placeholder="City,Country"
                    aria-label="City,Country"
                />
            </div>
            <div className='col-1'><Button className='search_button' variant="Dark" onClick={() => this.search()}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button></div>
          </div>
        </div>
        
        <div className='weather_content_div'>
          <div className='tableCard'>
              {data && (
                  <div className='table_content'>
                    <div className='row'>
                      <div className='col-6'>
                        <p className='todayWeatherText'>Today's Weather</p>
                        <p className='mainTempText'>{(data.main.temp - 273.15).toFixed(0)} &deg;</p>
                        <p className='minmaxTempText'>H: {(data.main.temp_min - 273.15).toFixed(0)} &deg; L: {(data.main.temp_max - 273.15).toFixed(0)} &deg;</p>
                      </div>

                      <div className='col-6 weather_logo_div'>
                        <div className="image-div">
                          <img src={weather_logo} style={{ width: "100%", margin: "auto" }} alt="Logo" />
                        </div>
                      </div>

                      <div className="row">
                        <div className='col-3'>
                         <p className='otherWeatherContentText'>{data.name}, {data.sys.country}</p>
                        </div>
                        <div className='col-3'>
                          <p className='otherWeatherContentText'>{international_datetime}</p>
                        </div>
                        <div className='col-3'>
                          <p className='otherWeatherContentText'>Humidity: {data.main.humidity}%</p>
                        </div>
                        <div className='col-3'>
                          <p className='otherWeatherContentText'>{data.weather[0].main}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              <div className='tableCardInner'>
                <div><h6 className='searchHistoryText'>Search History</h6></div>
                <TableComponent style={{width:'100%'}} data={myData} onButtonClick={this.handleButtonClick} />
              </div>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
