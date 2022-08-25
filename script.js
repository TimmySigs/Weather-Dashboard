var city = "";

var searchCity = $("#search-city")
var searchButton = $("#search-button")
var clearButton = $("#clear-button")
var currentCity = $("#clear-city")
var currentTemperature = $("#temperature")
var currentHumidty = $("#humidty")
var currentWindSpeed = $("#wind-speed")
var currentUvIndex = $("#uv-index")
var sCity = [];

var APIKey = "a0aca8a89948154a4182dcecc780b513";

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        var weatherIcon = response.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconUrl + ">");

        $(currentTemperature).html(response.main.humidty + "%");

        var ws = response.wind.speed
        var windMph = (ws * 2.237).toFixed(1)
        $(currentWindSpeed).html(windMph + "Mph")


    });
}