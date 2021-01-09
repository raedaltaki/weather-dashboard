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
    searchHistory = localStorage.getItem("history");
    if (searchHistory)
    {
        searchHistory = searchHistory.split(",");
    }
    else
    {
        searchHistory = [];
    }

    for(var i = searchHistory.length-1 ; i>-1; i--)
    {
        var newSearch = document.createElement("li");
        newSearch.className = "list-group-item"
        newSearch.textContent = searchHistory[i];
        searchHistoryListEl.appendChild(newSearch);
    }
};

var addSearchHistory = function()
{
    //load search history from local storage
    var searchInput = searchInputEl.value;
    searchInputEl.value = "";
    if(searchInput)
    {
        searchHistory.push(searchInput);
        var newSearch = document.createElement("li");
        newSearch.className = "list-group-item"
        newSearch.textContent = searchInput;
        searchHistoryListEl.insertBefore(newSearch, searchHistoryListEl.firstChild);
    }
    else
    {
        window.alert("Please Enter Search City !!!");
    }
    //save search history in local storage
    saveSearchHistory();
};

var getWeatherDetails = function()
{
    var today = moment().format("MM/DD/YY");
    //today = today.toString();
    var country = searchInputEl.value.trim();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?appid=274cbbc7cb2cf2adbf2edf074233aaec&q=" + country;
    fetch(weatherURL)
        .then(function(response)
        {
            if(response.ok)
            {
                response.json().then(function(data)
                {
                    weatherHeaderEl.textContent = data.name + " (" + today + ")"; 
                    var temp =(parseFloat(data.main.temp) - 273.15) * 9/5 + 32;
                    tempretureEl.textContent =" " + temp.toFixed(2) + " °F";
                    humidityEl.textContent =" " + data.main.humidity + " %";
                    windSpeedEl.textContent =" " + data.wind.speed + " m/s";
                    var lat= data.coord.lat;
                    var lon = data.coord.lon;
                    fetch("http://api.openweathermap.org/data/2.5/uvi?appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon)
                        .then(function(response){
                            if(response.ok)
                            {
                                response.json().then(function(data)
                                {
                                    uvIndexEl.textContent =" " + data.value;
                                    uvIndexEl.style.color = "white";
                                    var uvindex = parseInt(data.value);
                                    console.log(data.value,uvindex);

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

                            }
                        })
                        .catch(function(error){

                        })
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
        getWeatherForecast();
        addSearchHistory();
}

var getWeatherForecast = function()
{
    var country = searchInputEl.value.trim();
    var url = "http://api.openweathermap.org/data/2.5/forecast?appid=274cbbc7cb2cf2adbf2edf074233aaec&q=" + country;
    fetch(url)
        .then(function(response)
        {
            response.json().then(function(data)
            {
                for(var i = 1; i<6; i++)
                {
                    var forecastEl = document.querySelector('*[data-forecase="day'+i+'"]');

                    var forecastDateEl = document.createElement("h5");
                    forecastDateEl.textContent = moment().add(i,'days').format("MM/DD/YY");
                    forecastEl.appendChild(forecastDateEl);

                    var forecastTempEl = document.createElement("p");
                    forecastTempEl.textContent = "Temp: " + data.list[i].main.temp + " °F";
                    forecastEl.appendChild(forecastTempEl);

                    var forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.textContent = "Humidity: " + data.list[i].main.humidity + " %";
                    forecastEl.appendChild(forecastHumidityEl);
                }

            })
        })
        .catch(function(error)
        {

        })

};

var saveSearchHistory = function()
{
    localStorage.setItem("history",searchHistory);
}



loadSearchHistory();

searchBtnEl.addEventListener("click",getWeatherDetails)