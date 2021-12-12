var searchInput = document.querySelector('#CitySearch');
var searchFormElement = document.querySelector('form');
var lastSearchElement = document.querySelector('#recent');

var params = new URLSearchParams(document.location.search);
var searchTerm = params.get('q');


var token = 'f22cfa236148301928315cfa9b20822b';
var searchLocation = '';
var imgIcon = '';


function displayCurrentForecast(data) {
    var resultsContainer = document.querySelector('#results');
    if (!data) return resultsContainer.textContent = 'Your search returned no results';
    console.log(data)

    var currentWeatherDiv = document.createElement('div');
    currentWeatherDiv.classList = 'row col-6 bg-pinkuu text-center';

    var titleElement = document.createElement('h1');
    titleElement.classList = 'col-6';
    titleElement.textContent = searchLocation;
    currentWeatherDiv.appendChild(titleElement);

    var weatherIcon = document.createElement('img');
    weatherIcon.classList = 'col-6';
    weatherIcon.src = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
    currentWeatherDiv.appendChild(weatherIcon);

    var windSpeed = document.createElement('p');
    windSpeed.textContent = `${data.current.wind_speed} mph`;
    currentWeatherDiv.appendChild(windSpeed);
    resultsContainer.appendChild(currentWeatherDiv);

    var UVElement = document.createElement('h4');
    UVElement.textContent = data.current.uvi;
    currentWeatherDiv.appendChild(UVElement);

    var tempElement = document.createElement('h2');
    tempElement.textContent = `${Math.floor(data.current.temp)} F`;
    currentWeatherDiv.appendChild(tempElement);

    var dailyForecast = document.createElement('div');
    resultsContainer.appendChild(dailyForecast);
    dailyForecast.classList = 'd-flex flex-row p-5 m-2';


    for (i = 0; i < 5; i++) {
        var day = data.daily[i]
        var thisDay = document.createElement('div');
        thisDay.classList = 'col-2'

        var thisDayTitle = document.createElement('h4');
        thisDayTitle.textContent = moment(day.dt, 'X').format('dddd')

        var dayIcon = document.createElement('img')
        dayIcon.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`
        dayIcon.alt = `${day.weather[0].main}`

        var thisDayHumidity = document.createElement('p');
        thisDayHumidity.textContent = `${day.humidity}% Humidity`
        var thisDayTemperature = document.createElement('h5');
        thisDayTemperature.textContent = `${Math.floor(day.temp.day)} F`

        colorBorder(thisDay, day.temp.day);
        thisDay.appendChild(thisDayTitle);
        thisDay.appendChild(dayIcon);
        thisDay.appendChild(thisDayTemperature);
        thisDay.appendChild(thisDayHumidity);
        dailyForecast.appendChild(thisDay);
    }
};

function init() {
    var lastSearch = JSON.parse(localStorage.getItem("lastSearch")) || [];
    // console.log(lastSearch);
    loadRecentSearchButtons(lastSearch);
}

function colorBorder(element, temperature) {
    var color;
    if (temperature > 80) color = "bg-danger";
    else if (temperature < 32) color = "bg-info";
    else color = "bg-pinkuu";
    element.classList.add(`${color}`);
};

function getLocationData() {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${token}&units=imperial`

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) return response.json();
            else;
        })
        .then(function (data) {
            console.log(data)
            searchLocation = data.name
            getWeatherData(data.coord.lon, data.coord.lat)
        })
        .catch(function (error) {
            // alert("Unable to connect to OpenWeatherMap, make sure your search is valid!");
            console.log(error);
        });
    ;
};

function loadRecentSearchButtons(lastSearch) {
    var j = lastSearch.length
    for (i = 0; i < j; i++) {
        var recentSearchBtn = document.createElement('button');
        recentSearchBtn.textContent = lastSearch[i];
        recentSearchBtn.classList = "btn btn-secondary btn-block text-center m-1";
        console.log(lastSearch[i]);
        recentSearchBtn.setAttribute('data-search', lastSearch[i].replace(/\s/g, "+"));
        recentSearchBtn.setAttribute('type', 'button');
        recentSearchBtn.addEventListener('click', function () {
            location.replace(`index.html?q=${this.dataset.search}`);
        })
        lastSearchElement.appendChild(recentSearchBtn);
    }
}

function store(str) {
    var lastSearch = JSON.parse(localStorage.getItem("lastSearch")) || [];
    if (!lastSearch.includes(str) && !null) {
        lastSearch.unshift(str);
        if (lastSearch.length > 5) {
            lastSearch.length = 5;
        }
    }
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));
}

function getWeatherData(lon, lat) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${token}&units=imperial`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) return response.json();
            else alert(`Error: ${response.statusText}`);
        })
        .then(function (data) {
            displayCurrentForecast(data);
        })
        .catch(function (error) {
            // alert("Unable to connect to OpenWeatherMap OneCall");

        });
    ;
}

init();

searchFormElement.addEventListener('submit',
    function (event) {
        event.preventDefault();
        var search = searchInput.value.replace(/\s/g, "+");
        if (search) {
            location.replace(`index.html?q=${search}`);
            store(search);
        } else alert('Please enter a search term');
    })

if (searchTerm) {
    getLocationData()
};