var searchInputEl = document.getElementById("searchInput");
var searchHistoryListEl = document.getElementById("searchHistoryList");
var searchBtnEl = document.querySelector(".btn");
var weatherHeaderEl = document.querySelector("#header");
var tempretureEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var uvIndexEl = document.querySelector("#uv-index");

var searchHistory = [];

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
        var newSearch = document.createElement("li");
        newSearch.className = "list-group-item"
        newSearch.textContent = searchHistory[i];
        searchHistoryListEl.appendChild(newSearch);
        historylimit--;
        if(historylimit===0)
        {
            break;
        }
    }
};

var getWeatherDetails = function()
{
    var country = searchInputEl.value.trim();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?appid=274cbbc7cb2cf2adbf2edf074233aaec&units=imperial&q=" + country;
    fetch(weatherURL)
        .then(function(response)
        {
            if(response.ok)
            {
                response.json().then(function(data)
                {
                    var today = moment().format("MM/DD/YY");
                    weatherHeaderEl.textContent = data.name + " (" + today + ")";

                    var weathericonEl= document.createElement("img");
                    weathericonEl.src = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
                    weatherHeaderEl.appendChild(weathericonEl);

                    var lat= data.coord.lat;
                    var lon = data.coord.lon;
                    getTodayWeather(lat,lon);
                    getWeatherForecast(lat,lon);
                })
            }
            else
            {
                alert("1111111");
            }
        })
        .catch(function(error)
        {
            alert("22222222");
        })

        addSearchHistory();
};

var getTodayWeather = function(lat,lon)
{
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units=imperial&appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon;
    fetch(weatherURL)
        .then(function(response)
        {
            if(response.ok)
            {
                response.json().then(function(data)
                {
                    tempretureEl.textContent =" " + data.current.temp + " °F";
                    humidityEl.textContent =" " + data.current.humidity + " %";
                    windSpeedEl.textContent =" " + data.current.wind_speed + " m/s";
                    uvIndexEl.textContent =" " + data.current.uvi;
                    uvIndexEl.style.color = "white";
                    var uvindex = parseInt(data.current.uvi);
    
                    switch(uvindex)
                    {
                        case 0:
                        case 1:
                        case 2:
                            uvIndexEl.style.backgroundColor = "green";
                            break;
                        case 3:
                        case 4:
                        case 5:
                            uvIndexEl.style.backgroundColor = "yellow";
                            break;
                        case 6:
                        case 7:
                            uvIndexEl.style.backgroundColor = "orange";
                            break;
                        case 8:
                        case 9:
                        case 10:
                            uvIndexEl.style.backgroundColor = "yellow";
                            break;
                        default:
                            uvIndexEl.style.backgroundColor = "purple";
                            break;
                    }
                })
            }
            else
            {
                alert("1111111");
            }
        })
        .catch(function(error)
        {
            alert("22222222");
        })

}

var getWeatherForecast = function(lat,lon)
{
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units=imperial&appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon;
    fetch(weatherURL)
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

            }
        })
        .catch(function(error)
        {

        })

};

var addSearchHistory = function()
{
    //load search history from local storage
    var searchInput = searchInputEl.value;
    searchInputEl.value = "";
    if(searchInput)
    {
        searchHistory.push(searchInput);
        saveSearchHistory();
        loadSearchHistory();
    }
    else
    {
        window.alert("Please Enter Search City !!!");
    }
};

var saveSearchHistory = function()
{
    localStorage.setItem("history",searchHistory);
};



loadSearchHistory();

searchBtnEl.addEventListener("click",getWeatherDetails)