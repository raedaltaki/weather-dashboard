var searchInputEl = document.getElementById("searchInput");
var searchHistoryListEl = document.getElementById("searchHistoryList");
var searchFormEl = document.querySelector("#searchForm");
var weatherHeaderEl = document.querySelector("#header");
var tempretureEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var uvIndexEl = document.querySelector("#uv-index");

var searchHistory = [];

var startPage = function()
{
    loadSearchHistory();
    var searchCountry = document.location.search;
    if(searchCountry)
    {
        var country = searchCountry.split("=")[1];
        getWeatherDetails(country);
    }
};

var loadSearchHistory = function()
{
    searchHistoryListEl.innerHTML= "";
    searchHistory = localStorage.getItem("history");
    if (searchHistory)
    {
        searchHistory = searchHistory.split(",");
    }
    else
    {
        searchHistory = [];
    }
    var historylimit =10;
    for(var i = searchHistory.length-1 ; i>-1; i--)
    {
        var newSearchLinkEl = document.createElement("a");
        newSearchLinkEl.textContent = searchHistory[i];
        newSearchLinkEl.className = "list-group-item";
        newSearchLinkEl.href = "./index.html?country="+searchHistory[i];

        searchHistoryListEl.appendChild(newSearchLinkEl);
        historylimit--;
        if(historylimit===0)
        {
            break;
        }
    }
};

var handleSubmitForm = function(event)
{
    event.preventDefault();
    var country = searchInputEl.value.trim();
    searchInputEl.value = "";
    if(country)
    {
       document.location.replace("./index.html?country="+country);
    }
    else
    {
        window.alert("Please Enter City Name!!!");
    } 
}

var getWeatherDetails = function(country)
{
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?appid=274cbbc7cb2cf2adbf2edf074233aaec&units=imperial&q=" + country;
    fetch(weatherURL)
        .then(function(response)
        {
            if(response.ok)
            {
                response.json().then(function(data)
                {
                    var today = moment(data.dt,"X").format("MM/DD/YY");;
                    weatherHeaderEl.textContent = data.name + " (" + today + ")";

                    var weathericonEl= document.createElement("img");
                    weathericonEl.src = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
                    weatherHeaderEl.appendChild(weathericonEl);

                    var lat= data.coord.lat;
                    var lon = data.coord.lon;
                    getTodayWeather(lat,lon);
                    getWeatherForecast(lat,lon);
                    addSearchHistory(data.name);
                })
            }
            else
            {
                alert("Error: Please Enter a Valid City Name !!!");
                document.location.replace("./index.html");
            }
        })
        .catch(function(error)
        {
            alert("Error: Cannot connect to the server.\n          Please check your Internet connection.");
        })
        
};

var getTodayWeather = function(lat,lon)
{
    var todayWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units=imperial&appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon;
    fetch(todayWeatherURL)
        .then(function(response)
        {
            if(response.ok)
            {
                response.json().then(function(data)
                {
                    tempretureEl.textContent =" " + data.current.temp + " °F";
                    humidityEl.textContent =" " + data.current.humidity + " %";
                    windSpeedEl.textContent =" " + data.current.wind_speed + " MPH";
                    uvIndexEl.textContent =" " + data.current.uvi;
                    styleIndex(data.current.uvi);
                })
            }
            else
            {
                alert("Error: Cannot find the coordination for entered city");
            }
        })
        .catch(function(error)
        {
            alert("Error: Cannot connect to the server.\n          Please check your Internet connection.");
        })
}

var styleIndex = function(uvi)
{
    uvIndexEl.classList = "badge";
    uvIndexEl.style.color = "white";
    var uvindex = parseInt(uvi);
    
    switch(uvindex)
    {
        case 0:
        case 1:
        case 2:
            uvIndexEl.style.backgroundColor = "#36db3a";
            break;
        case 3:
        case 4:
        case 5:
            uvIndexEl.style.backgroundColor = "#ffcc0c";
            break;
        case 6:
        case 7:
            uvIndexEl.style.backgroundColor = "#f57c11";
            break;
        case 8:
        case 9:
        case 10:
            uvIndexEl.style.backgroundColor = "#f6562a";
            break;
        default:
            uvIndexEl.style.backgroundColor = "#c664f3";
            break;
    }
}

var getWeatherForecast = function(lat,lon)
{
    var forecastWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units=imperial&appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon;
    fetch(forecastWeatherURL)
        .then(function(response)
        {   if(response.ok)
            {
                response.json().then(function(data)
                {
                    for(var i = 1; i<6; i++)
                    {
                        var forecastEl = document.querySelector('*[data-forecase="day'+i+'"]');
                        forecastEl.innerHTML= "";

                        var forecastDateEl = document.createElement("h5");
                        forecastDateEl.textContent = moment(data.daily[i].dt,"X").format("MM/DD/YY");
                        forecastEl.appendChild(forecastDateEl);

                        var forecastIconEl = document.createElement("img");
                        forecastIconEl.src = "http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+"@2x.png";
                        forecastEl.appendChild(forecastIconEl);

                        var forecastTempEl = document.createElement("p");
                        forecastTempEl.textContent = "Temp: " + data.daily[i].temp.day + " °F";
                        forecastEl.appendChild(forecastTempEl);

                        var forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.textContent = "Humidity: " + data.daily[i].humidity + " %";
                        forecastEl.appendChild(forecastHumidityEl);   
                    }
                })
            }
            else
            {
                alert("Error: Cannot find the coordination for entered city");
            }
        })
        .catch(function(error)
        {
            alert("Error: Cannot connect to the server.\n          Please check your Internet connection.");
        })
};

var addSearchHistory = function(country)
{
    searchHistory.push(country);
    saveSearchHistory();
    loadSearchHistory();
};

var saveSearchHistory = function()
{
    localStorage.setItem("history",searchHistory);
};

startPage();
searchFormEl.addEventListener("submit",handleSubmitForm);