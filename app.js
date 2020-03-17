const express = require("express");
const https = require("https"); //native node https module already bundled with node, so don't need to install
const bodyParser = require("body-parser");

const app = express(); //initialises a new express app

app.use(bodyParser.urlencoded({ extended: true })); //necessary code for us to be able to start parsing through the body of the post request
//we must include the strict https://

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = "b31653f586e18698dbe8bcbd66195659";
    const unit = "metric";
    //store the url in a constant so we can work with our get request more easily!
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    //fetch the data from an exernal server and get it in JSON format
    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data); //parse the JSON into a JS object so we can access the information we want
            const temp = Math.round(weatherData.main.temp);
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<p>The weather is currently " + weatherDescription + "<p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " °C.</h1 > ");
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });
})


app.listen(3000, function () {
    console.log("Server is running on port 3000.");
})