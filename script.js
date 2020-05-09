

/**
 * Weather App
 */

 // Keycode for enter
let enterKeycode = 13;

// API_KEY for maps api
let API_KEY = "a8e71c9932b20c4ceb0aed183e6a83bb";


$(document).ready(function() {
  $('#city-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === enterKeycode){
      searchCity();
    }
  });

  $('input[name=MeasuringSystem]:radio').click(searchCity);
});

getMeasuringSystem = () => {
  if($('#Metric').is(':checked')) return 'metric';

  return 'imperial';
}

/**
 * Retrieve weather data from openweathermap
 */
getWeatherData = (city) => {
  const URL = "https://api.openweathermap.org/data/2.5/weather";
  const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=${getMeasuringSystem()}`;
  const weatherPromise  = fetch(FULL_URL);
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
      throw new Error("Not found");
    }
  }).catch((error)=>{
    resetResult();
  })
}

/**
 * Show the weather data in HTML
 */
showWeatherData = (weatherData) => {
  let imgSrc = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
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
