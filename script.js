var city = ""

var searchCity = $("#search-city")
var searchButton = $("#search-button")
var clearButton = $("#clear-button")
var currentCity = $("#clear-city")
var currentTemperature = $("#temperature")
var currentHumidty = $("#humidty")
var currentWindSpeed = $("#wind-speed")
var currentUvIndex = $("#uv-index")
var sCity = [];

var a = dayjs().format('dddd MMMM Do YYYY, h:mm');
$("#display-date").text(a)


var APIKey = "b26f77a0f941976c50cef7bdb9d7f15d";

function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        var iconCode = response.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        $('#wicon').attr('src', iconUrl);
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconUrl + ">");

        $(currentTemperature).html(response.main.humidty + "%");
        // var date = new Date(response.dt * 1000).toLocaleDateString();
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

function UVIndex(ln, lt) {
    var uvqURL = "https://api.openweathermap.org/data/3.0/uvi?appid?q=" + APIKey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET"
    }).then(function (response) {
        $(currentUvindex).html(response.value);
    });
}

function forecast(cityid) {
    var dayOver = false;
    var queryforecastURL = "https://api.openweathermap.org/data/2.5/forecast?id?q=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforecastURL,
        method: "GET"
    }).then(function (response) {
        for (i = 0; i < 5; i++) {
            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconurl = "https://http://openweathermap.org/img/wn/10d@2x.png" + iconcode + ".png";
            var tempK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#fDate" + i).html(date);
            $("#fImg" + i).html("<img src=" + iconurl + ">");
            $("#fTemp" + i).html(tempF + "&#8457");
            $("#fHumidity" + i).html(humidity + "%");
        }
    });

}

function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
currentWeather("Chicago")

function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}
function loadLastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}

$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadLastCity);
$("#clear-history").on("click", clearHistory);

