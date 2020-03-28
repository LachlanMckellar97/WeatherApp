//Getting Localstorage
var city = ""
var prevcities = []
var previouscitiesstring = localStorage.getItem("Previous")
if(previouscitiesstring !== null) {
    prevcities = JSON.parse(previouscitiesstring);
    prevcities.forEach(function(precity){
        var newbutton = $("<button>").addClass(precity);
            newbutton.text(precity);
        $("#previousLocations").prepend(newbutton);
    })
}

//Loading last location info
$(document).ready(function() {
    ($("#previousLocations button").first()).trigger( "click" );
 });
 

//Getting city name
$("#searchlocation").on("click", function() {
    city = $("#location").val();
    prevcities.push(city);
    localStorage.setItem("Previous",JSON.stringify(prevcities));
    if(city.length === 0) {
        $("#location").attr("placeholder", "Please enter a city");
        return;
    } else {
        getweather()
        $("#results").removeClass("hide");
        $("#fivedayforcast").removeClass("hide");
        $("#location").val("");
        $("#location").attr("placeholder", "City added!");
        var newbutton = $("<button>").addClass(city);
            newbutton.text(city);
        $("#previousLocations").prepend(newbutton);   
    }
})

//Getting Weather
function getweather() {
        
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=6bf240b1bc4ff00cea024200576460d7&units=metric",
        method: "GET"
    })
    .then(function(response) {
        $("#locationAndDate").text((response.name) + ": " + (moment().format('dddd') + " " + (moment().format("MMM Do YYYY"))));
        $("#wicon").attr("src", ("http://openweathermap.org/img/w/" + (response.weather[0].icon) + ".png"));
        $("#temp").text("Temperature: " + (response.main.temp) + "°C");
        $("#humidity").text("Humidity: " + (response.main.humidity) + "%");
        $("#windspeed").text("Wind Speed: " + (response.wind.speed) + "km/h");
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=6bf240b1bc4ff00cea024200576460d7&lat=" + (response.coord.lat) + "&lon=" + (response.coord.lon),
            method: "GET"
        })
        .then(function(response2) {
            var UV = response2.value;
            $("#UVindexspan").removeClass("low high med")
            if(UV < 3) {$("#UVindexspan").addClass("low")}
            if(UV > 3.01) {$("#UVindexspan").addClass("med")}
            if(UV > 6.01) {$("#UVindexspan").addClass("high")}
            $("#UVindexspan").text(UV);
        })
    })
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=40&appid=6bf240b1bc4ff00cea024200576460d7&units=metric",
        method: "GET"
    })
    .then(function(response3) {

        var days = ["1", "2", "3", "4", "5", "yuhhh"]
        for (i = 1; i < days.length; i++) {
            var u = i * 8 - 1;
            $("#dayid" + [i]).text((response3.list[u].dt_txt).slice(0, 10));
            $("#wicon" + [i]).attr("src", ("http://openweathermap.org/img/w/" + (response3.list[u].weather[0].icon) + ".png"));
            $("#tempday" + [i]).text("Temp: " + (response3.list[u].main.temp) + "°C");
            $("#humday" + [i]).text("Humidity: " + (response3.list[u].main.humidity) + "%");
        }
    })
}

//Click function for buttons
$("#previousLocations").on("click", "button", function() {
    $("#results").removeClass("hide");
    $("#fivedayforcast").removeClass("hide");
    city = this.className;
    getweather();
})