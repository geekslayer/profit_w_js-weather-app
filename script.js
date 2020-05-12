

/**
 * Weather App
 */

 // Keycode for enter
let enterKeycode = 13;

let baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
let baseImgUrl = 'http://openweathermap.org/img/wn';

// API_KEY for maps api
let apiKey = "a8e71c9932b20c4ceb0aed183e6a83bb";


$(document).ready(function() {
  $('#city-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === enterKeycode){
      searchCity();
    }
  });

  $('input[name=MeasuringSystem]:radio').click(searchCity);

  $('#ErrorMessageAlert').hide();
});

getMeasuringSystem = () => {
  if($('#Metric').is(':checked')) return 'metric';

  return 'imperial';
}

/**
 * Retrieve weather data from openweathermap
 */
getWeatherData = (city) => {
  const fullUrl = `${baseUrl}?q=${city}&appid=${apiKey}&units=${getMeasuringSystem()}`;
  const weatherPromise  = fetch(fullUrl);
  return weatherPromise.then((response) => {
    return response.json();
  });
}

/**
 * Retrieve city input and get the weather data
 */
searchCity = () => {
  const city = $('#city-input').val();
  getWeatherData(city)
  .then((res)=>{
    if (res.cod === 200) {
      showWeatherData(res);
    } else {
      throw new Error("City not found");
    }
  }).catch((error)=>{
    setAlertMessage(error);
    $('#ErrorMessageAlert').show();
    // $('.alert').alert();
    resetResult();
  })
}

setAlertMessage = (msg) => {
  $('#ErrorMessage').text(msg);
}

/**
 * Show the weather data in HTML
 */
showWeatherData = (weatherData) => {
  $('#ErrorMessageAlert').hide();
  let imgSrc = `${baseImgUrl}/${weatherData.weather[0].icon}.png`;
  $('#weather-icon').attr('src',imgSrc);
  $('#weather-icon').attr('height',72);
  $('#weather-icon').attr('width',72);


  $("#city-name").text(weatherData.name);
  $("#weather-type").text(weatherData.weather[0].main);
  $("#temp").text(weatherData.main.temp);
  $("#min-temp").text(weatherData.main.temp_min);
  $("#max-temp").text(weatherData.main.temp_max);
  $("#weather-output").addClass('visible');

  $('.temp-sign').toArray().forEach(element => {
    let tempSign = this.getMeasuringSystem() === 'imperial' ? 'F': 'C';
    $(element).text(tempSign);
  });
}

resetResult = () => {
  let imgSrc = '';
  $('#weather-icon').attr('src',imgSrc);
  $('#weather-icon').attr('height',0);
  $('#weather-icon').attr('width',0);

  $("#city-name").text('----');
  $("#weather-type").text('----');
  $("#temp").text('--');
  $("#min-temp").text('--');
  $("#max-temp").text('--');
  $("#weather-output").addClass('visible');
}
