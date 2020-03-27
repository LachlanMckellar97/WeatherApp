//Getting city name
$("#searchlocation").on("click", function() {
    var city = $("#location").val();
    if(city.length === 0) {
        $("#location").attr("placeholder", "Please enter a city");
        return;
    } else {
        getweather()
        $("#location").val("");
        $("#location").attr("placeholder", "City added!");
        var newbutton = $("<button>").addClass(city);
            newbutton.text(city);
        $("#previousLocations").prepend(newbutton);
        
    }

    $("button").on("click", function() {
        city = this.className;
        getweather();
    })

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
                $("#UVindex").text("UV index: " + (response2.value));
            })
        })
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=41&appid=6bf240b1bc4ff00cea024200576460d7&units=metric",
            method: "GET"
        })
        .then(function(response3) {

            var days = ["1", "2", "3", "4", "5", "yuhhh"]
            for (i = 1; i < days.length; i++) {
                var u = i * 8 - 1;
                $("#dayid" + [i]).text(response3.list[u].dt_txt);
                $("#wicon" + [i]).attr("src", ("http://openweathermap.org/img/w/" + (response3.list[u].weather[0].icon) + ".png"));
                $("#tempday" + [i]).text("Temperature: " + (response3.list[u].main.temp) + "°C");
                $("#humday" + [i]).text("Humidity: " + (response3.list[u].main.humidity) + "%");
            }
        })
    }
})



