var searchInputEl = document.getElementById("searchInput");
var searchHistoryListEl = document.getElementById("searchHistoryList");
var searchBtnEl = document.querySelector(".btn");
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

var saveSearchHistory = function()
{
    localStorage.setItem("history",searchHistory);
}

loadSearchHistory();

searchBtnEl.addEventListener("click",addSearchHistory)