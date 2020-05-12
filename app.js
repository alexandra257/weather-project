// create a new node app
const express = require("express");

// below we require the native node https (secure version of http) module already bundled with node
// this means we don't need to install another npm package
const https = require("https");

// body-parser package will allow us to look through the body of the post request and fetch the data based on the NAME of the input in index.html
const bodyParser = require("body-parser");

const app = express(); // initialises a new express app

app.use(bodyParser.urlencoded({ extended: true })); // neccessary to parse through the body of the post request

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html"); // sends the index.html file to the browser
});

app.post("/", function (req, res) {
  const query = req.body.cityName; // accesses the text inputted into our cityName input in index.html
  const apiKey = "b31653f586e18698dbe8bcbd66195659";
  const unit = "metric";
  // store the url in a const to make it easier to work with our GET request
  // ensure your URL has the strict https:// at the beginning
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  // using the native Node HTTPS module
  // make a GET request to an external server (fetching some data from it)
  // get the data back in a JSON format
  // parse it into a javascript object
  https.get(url, function (response) {
    console.log(response.statusCode);

    //when we receive the data, invoke the callback with the data we recieved
    response.on("data", function (data) {
      // converting the JSON into a JS object so we can access the information we want. JSON.stringify does the opposite
      const weatherData = JSON.parse(data);

      // below we specify what bits of data we want to retrieve
      const temp = Math.round(weatherData.main.temp); // taps into weatherData object, follows the path to the temperature & stores the rounded value in temp
      const weatherDescription = weatherData.weather[0].description; // weather is an array with 1 object inside, so we access index 0 then tap into the description
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // we now want to send all of this back to the browser using the HTML that we want to write
      // below we are referring to the response that OUR server is going to send the client
      // the res below is referring to our app.post res, NOT the https.get response

      // we use res.write for each thing we want to send back then res.send to send it all back
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write(
        "<h1>The temperature in " + query + " is " + temp + " degrees C.</h1 > "
      ); // query = whatever city is inputted in index.html
      res.write("<img src=" + imageURL + ">"); // sends back the corresponding weather icon

      // you only have one res.send, this is the final thing that is exectued
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
