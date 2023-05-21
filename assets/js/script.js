var apiKey = "85be78b6966459bb0d4ae6274c0fabb6";
var today = dayjs().format("L");
var searchHistoryList = [];

// function for current condition
function currentCondition(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (cityWeatherResponse) {
    console.log(cityWeatherResponse);

    $("#weatherContent").css("display", "block");
    $("#cityDetail").empty();

    var iconCode = cityWeatherResponse.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

    // WHEN I view current weather conditions for that city
    // THEN I am presented with the city name
    // the date
    // an icon representation of weather conditions
    // the temperature
    // the humidity
    // the wind speed
    var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            
        `);

    $("#cityDetail").append(currentCity);
    var lat = cityWeatherResponse.coord.lat;
    var lon = cityWeatherResponse.coord.lon;
    var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
      url: uviQueryURL,
      method: "GET",
    }).then(function (uviResponse) {
      console.log(uviResponse);

      var uvIndex = uviResponse.value;
      var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);

      $("#cityDetail").append(uvIndexP);

      futureCondition(lat, lon);

      // WHEN I view the UV index
      // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
      // 0-2 green#3EA72D, 3-5 yellow#FFF300, 6-7 orange#F18B00, 8-10 red#E53210, 11+violet#B567A4
      if (uvIndex >= 0 && uvIndex <= 2) {
        $("#uvIndexColor")
          .css("background-color", "#3EA72D")
          .css("color", "white");
      } else if (uvIndex >= 3 && uvIndex <= 5) {
        $("#uvIndexColor").css("background-color", "#FFF300");
      } else if (uvIndex >= 6 && uvIndex <= 7) {
        $("#uvIndexColor").css("background-color", "#F18B00");
      } else if (uvIndex >= 8 && uvIndex <= 10) {
        $("#uvIndexColor")
          .css("background-color", "#E53210")
          .css("color", "white");
      } else {
        $("#uvIndexColor")
          .css("background-color", "#B567A4")
          .css("color", "white");
      }
    });
  });
}
