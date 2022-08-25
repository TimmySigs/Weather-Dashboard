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

var APIKey = "2abc5837fd5b80301226820c26666c91";

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/3.0/onecall?" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        var weatherIcon = response.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconUrl + ">");

        $(currentTemperature).html(response.main.humidty + "%");

        var ws = response.wind.speed
        var windMph = (ws * 2.237).toFixed(1)
        $(currentWindSpeed).html(windMph + "Mph")


        currentUvIndex(response.coord.lon, response.coord.lat);
        forecast(response.id)
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            if (sCity == null) {
                sCity = []
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(sCity))
                addToList(city)
            }
            else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase())
                    localStorage.setItem("cityname", JSON.stringify(sCity))
                    addToList(city)
                }
            }
        }

    });
}
