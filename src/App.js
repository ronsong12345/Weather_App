

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
  }

  reset_API_RESPONSE(){
    this.API_state.data = null
    this.clear_textInput_textInput_City_Country()
  }

  clear_textInput_textInput_City_Country() {
    this.textInput_City_Country.current.value = "";
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
      this.store_data_into_local_storage()

    }catch(error){
      const ERR_MESSAGE = error.message

      this.trigger_toast(ERR_MESSAGE)
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

    return (
      <div>
        <ToastComponent content={toast_msg} delay={5000} trigger={toast_boolean} />
        
        <div style={{ marginBottom: '10px', width: "100vw", textAlign: "center" }}>
          <Card style={{width:'50vw',margin: "auto"}}>
              <Card.Header>Weather</Card.Header>
              <Card.Body>
                {data && (
                  <div>
                    <h2>{data.name}, {data.sys.country}</h2>
                    <h2>{data.weather[0].main}</h2>
                    <p>Description: {data.weather[0].description}</p>
                    <p>Temperature: {data.main.temp_min} &deg;C ~ {data.main.temp_max} &deg;C</p>
                    <p>Humidity: {data.main.humidity}%</p>
                    <p>International Time: {international_datetime}</p>
                    <p>Local Time: {local_datetime}</p>
                  </div>
                )}
              </Card.Body>
            </Card>             
        </div>

        <div style={{ marginBottom: '10px', width: "100vw", textAlign: "center" }}>
          <Card style={{width:'50vw',margin: "auto"}}>
            <Card.Header>Seach History</Card.Header>
            <Card.Body>

              <InputGroup className="mb-3">
                <Form.Control 
                  ref={this.textInput_City_Country}
                  placeholder="Town,Country"
                  aria-label="Town,Country"
                  aria-describedby="basic-addon2"
                />
                <Button variant="danger" style={{ border: '1px solid #ced4da', color: 'black', backgroundColor: 'transparent' }} onClick={() => this.clear_textInput_textInput_City_Country()}><FontAwesomeIcon icon={faXmark} /></Button>
                <Button variant="primary" onClick={() => this.search()}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
              </InputGroup>
            </Card.Body>
          </Card>        
        </div>
        
        <div style={{ marginBottom: '10px',width: "100vw", textAlign: "center" }}>
          <Card style={{ width: "50vw", margin: "auto" }}>
            <Card.Header>Seach History</Card.Header>
            <Card.Body>
              <TableComponent style={{width:'100%'}} data={myData} onButtonClick={this.handleButtonClick} />
            </Card.Body>
          </Card>
        </div>

      </div>
    );
  }
}

export default App;
