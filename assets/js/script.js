var searchInputEl = document.getElementById("searchInput");
var searchHistoryListEl = document.getElementById("searchHistoryList");
var searchFormEl = document.querySelector("#searchForm");
var weatherHeaderEl = document.querySelector("#header");
var tempretureEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var uvIndexEl = document.querySelector("#uv-index");
var unitSectionEl = document.querySelector("#unit-section");
var metricEl = document.getElementById("metric");
var imperialEl = document.getElementById("imperial");

var searchHistory = [];
var unit;
var tempUnit;
var speedUnit;

var unitChangeMetric = function()
{
    unit = "metric";
    changeUnits();
}
    
var unitChangeImperial = function()
{
    unit = "imperial";
    changeUnits();
}

var changeUnits = function()
{
    localStorage.setItem("unit",unit);

    var attribites = document.location.search;
    var country = attribites.split("=")[1];
    document.location.replace("./index.html?country="+country);
}

var loadUnit = function()
{
    unit = localStorage.getItem("unit");
    if (!unit)
    {
        unit = "metric";
    }

    if (unit === "metric")
    {
        metricEl.checked = true;
        tempUnit = " °C";
        speedUnit = " KM/H";
    }
    if (unit === "imperial")
    {
        imperialEl.checked = true;
        tempUnit = " °F";
        speedUnit = " MPH";
    }
}

//start function to load the first page
var startPage = function()
{
    unitSectionEl.style.visibility = "hidden";
    loadSearchHistory(); //load the saved search history
    var searchCountry = document.location.search; //get search attribute if available
    if(searchCountry) //if search attribute is available 
    {
        unitSectionEl.style.visibility = "visible";
        loadUnit();

        var country = searchCountry.split("=")[1]; //get the country name 
        getWeatherDetails(country); //and get weather details for the country 
    }
};

//load the saved search history
var loadSearchHistory = function()
{
    searchHistoryListEl.innerHTML= "";
    searchHistory = localStorage.getItem("history"); //get saved search history
    if (searchHistory)
    {
        searchHistory = searchHistory.split(","); //get the countries in an array
    }
    else
    {
        searchHistory = [];
    }
    var historylimit =10;  //limit the display history to the last 10 searched countries
    for(var i = searchHistory.length-1 ; i>-1; i--) // display the last 10 searched countries
    {
        var newSearchLinkEl = document.createElement("a");
        newSearchLinkEl.textContent = searchHistory[i];
        newSearchLinkEl.className = "list-group-item";
        newSearchLinkEl.href = "./index.html?country="+searchHistory[i];
        searchHistoryListEl.appendChild(newSearchLinkEl);

        historylimit--;
        if(historylimit===0) //if displayed the last 10 search countries then stop
        {
            break;
        }
    }
};

//get the search country and send it as url attribute
var handleSubmitForm = function(event)
{
    event.preventDefault();
    var country = searchInputEl.value.trim();
    searchInputEl.value = "";
    if(country) //check if there is an input or not
    {
       document.location.replace("./index.html?country="+country);
    }
    else
    {
        window.alert("Please Enter City Name!!!");
    } 
}

//get weather details
var getWeatherDetails = function(country)
{
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=274cbbc7cb2cf2adbf2edf074233aaec&units="+unit+"&q=" + country;
    fetch(weatherURL)
        .then(function(response)
        {
            if(response.ok) //if city available
            {
                response.json().then(function(data)
                {
                    var today = moment(data.dt,"X").format("MM/DD/YY");  //get the date
                    weatherHeaderEl.textContent = data.name + " (" + today + ")"; //display city name and date

                    var weathericonEl= document.createElement("img"); //display weather icon
                    weathericonEl.src = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
                    weatherHeaderEl.appendChild(weathericonEl);

                    var lat= data.coord.lat; //get city altitude 
                    var lon = data.coord.lon; //get city logtitude
                    getTodayWeather(lat,lon); // get today weather by coordinates
                    getWeatherForecast(lat,lon); // get forecast weather by coordinates
                    addSearchHistory(data.name); // add the city to search history
                })
            }
            else //if searched city not available
            {
                alert("Error: Please Enter a Valid City Name !!!");
                document.location.replace("./index.html");
            }
        })
        .catch(function(error)
        {
            alert("Error: Cannot connect to the server.\n          Please check your Internet connection.");
            document.location.replace("./index.html");
        })
};

//get today's weather
var getTodayWeather = function(lat,lon)
{
    var todayWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units="+unit+"&appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon;
    fetch(todayWeatherURL)
        .then(function(response)
        {
            if(response.ok)
            {
                response.json().then(function(data)
                {
                    tempretureEl.textContent =" " + data.current.temp + tempUnit;
                    humidityEl.textContent =" " + data.current.humidity + " %";
                    windSpeedEl.textContent =" " + data.current.wind_speed + speedUnit;
                    uvIndexEl.textContent =" " + data.current.uvi;
                    styleIndex(data.current.uvi); //style UV Index based on the conditions
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

//style UV Index based on the conditions
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
            uvIndexEl.style.backgroundColor = "#36db3a"; //green
            break;
        case 3:
        case 4:
        case 5:
            uvIndexEl.style.backgroundColor = "#ffcc0c"; //yellow
            break;
        case 6:
        case 7:
            uvIndexEl.style.backgroundColor = "#f57c11"; //orange
            break;
        case 8:
        case 9:
        case 10:
            uvIndexEl.style.backgroundColor = "#f6562a"; //red
            break;
        default:
            uvIndexEl.style.backgroundColor = "#c664f3"; //purple
            break;
    }
}

//get forecast weather for the next 5 days
var getWeatherForecast = function(lat,lon)
{
    var forecastWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units="+unit+"&appid=274cbbc7cb2cf2adbf2edf074233aaec&lat="+lat+"&lon="+lon;
    fetch(forecastWeatherURL)
        .then(function(response)
        {   if(response.ok)
            {
                response.json().then(function(data)
                {
                    for(var i = 1; i<6; i++) //forecast weather for the next 5 days
                    {
                        var forecastEl = document.querySelector('*[data-forecase="day'+i+'"]');
                        forecastEl.innerHTML= "";

                        var forecastDateEl = document.createElement("h5"); //date
                        forecastDateEl.textContent = moment(data.daily[i].dt,"X").format("MM/DD/YY");
                        forecastEl.appendChild(forecastDateEl);

                        var forecastIconEl = document.createElement("img"); //icon
                        forecastIconEl.src = "http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+"@2x.png";
                        forecastEl.appendChild(forecastIconEl);

                        var forecastTempEl = document.createElement("p"); //temperature
                        forecastTempEl.textContent = "Temp: " + data.daily[i].temp.day + tempUnit;
                        forecastEl.appendChild(forecastTempEl);

                        var forecastHumidityEl = document.createElement("p"); //humidity
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

//add to search history and display it
var addSearchHistory = function(country)
{
    for (var i =0;i<searchHistory.length;i++)
    {
        if(searchHistory[i]===country) // if there is duplicate remove the old one
        {
            searchHistory.splice(i,1);
            break;
        }
    }

    searchHistory.push(country);
    saveSearchHistory();
    loadSearchHistory();
};

//save search history
var saveSearchHistory = function()
{
    localStorage.setItem("history",searchHistory);
};

startPage();
searchFormEl.addEventListener("submit",handleSubmitForm);
metricEl.addEventListener("change",unitChangeMetric);
imperialEl.addEventListener("change",unitChangeImperial);