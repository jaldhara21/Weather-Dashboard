//Create a variable
var apiKey = "a0650623cb879c782b6f4b4a1202e988";
var today = dayjs().format("MM-DD-YYYY");
var searchHistoryList = [];

// function for current condition and create variable for url with parameter
function currentCondition(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (cityWeatherResponse) {
    console.log("city weather response", cityWeatherResponse);

    $("#weatherContent").css("display", "block");
    $("#cityDetail").empty();

    var iconCode = cityWeatherResponse.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

    var lat = cityWeatherResponse.coord.lat;
    var lon = cityWeatherResponse.coord.lon;
    futureCondition(lat, lon);
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
            <p>Humidity: ${cityWeatherResponse.main.humidity} \%</p>
            
        `);

    $("#cityDetail").append(currentCity);
  });
}

function futureCondition(lat, lon) {
  console.log("futurecondition", lat, lon);
  // Presented with a 5-day forecast using openweathermap API key
  var futureURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=a0650623cb879c782b6f4b4a1202e988`;

  $.ajax({
    url: futureURL,
    method: "GET",
  }).then(function (futureResponse) {
    console.log(futureResponse);
    $("#fiveDay").empty();

    for (let i = 0; i < futureResponse.list.length; i += 8) {
      var cityInfo = {
        date: futureResponse.list[i].dt,
        icon: futureResponse.list[i].weather[0].icon,
        temp: futureResponse.list[i].main.temp,
        humidity: futureResponse.list[i].main.humidity,
      };

      var currDate = dayjs.unix(cityInfo.date).format("MM/DD/YYYY");
      var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.list[i].weather[0].main}" />`;

      // displays the current date
      // an icon representation of weather conditions
      // display the city temperature
      // display the city humidity
      var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;">
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity} \%</p>
                        </div>
                    </div>
                </div>
            `);

      $("#fiveDay").append(futureCard);
    }
  });
}

// add on click event listener
$("#searchBtn").on("click", function (event) {
  event.preventDefault();

  var city = $("#enterCity").val().trim();
  currentCondition(city);
  if (!searchHistoryList.includes(city)) {
    searchHistoryList.push(city);
    var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
    $("#searchHistory").append(searchedCity);
  }

  localStorage.setItem("city", JSON.stringify(searchHistoryList));
  console.log(searchHistoryList);
});

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
$(document).on("click", ".list-group-item", function () {
  var listCity = $(this).text();
  currentCondition(listCity);
});

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
$(document).ready(function () {
  var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

  if (searchHistoryArr !== null) {
    var lastSearchedIndex = searchHistoryArr.length - 1;
    var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
    currentCondition(lastSearchedCity);
    console.log(`Last searched city: ${lastSearchedCity}`);
  }
});
