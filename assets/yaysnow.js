$(document).ready(function () {
  console.log("ready");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBEMPV3HyKy9-sZypky_0JaJKhGEiVAF_M",
    authDomain: "in-the-snow.firebaseapp.com",
    databaseURL: "https://in-the-snow.firebaseio.com",
    projectId: "in-the-snow",
    storageBucket: "in-the-snow.appspot.com",
    messagingSenderId: "870192505914"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


  // at each click of the search button, check the database for that search term
  // the function will either add to the searchCount or add the mountain as needed
  $(".searchButton").on("click", function (event) {
    console.log("I've been clicked!");
    var searchTerm = $("#mountainInput").val().trim().toLowerCase();
    var queryURL = "https://in-the-snow.firebaseio.com/searches/" + searchTerm + ".json"
    $.get(queryURL).then(function (response) {
      console.log(response);
      if (response != null) {
        var count = response.count;
        count++
        console.log(count);

        $.ajax({
          type: 'PUT',
          url: queryURL,
          contentType: 'application/json',
          data: JSON.stringify({
            "count": count,
          })
        }).done(function () {
          console.log('SUCCESS');
        }).fail(function (msg) {
          console.log('FAIL');
        }).always(function (msg) {
          console.log('ALWAYS');
        });
      } else {
        console.log("yo! I'm the else statement");
        $.ajax({
          type: 'PUT',
          url: queryURL,
          contentType: 'application/json',
          data: JSON.stringify({
            "count": 1,
          })
        }).done(function () {
          console.log('SUCCESS');
        }).fail(function (msg) {
          console.log('FAIL');
        }).always(function (msg) {
          console.log('ALWAYS');
        });
      };
    });
  });

  var resultsURL = "https://in-the-snow.firebaseio.com/searches.json";
  $.get(resultsURL).then(function (response) {
    console.log("this is the results response");
    console.log(response);
    var sortedMountains = [];
    for (var mountain in response) {
      sortedMountains.push([mountain, response[mountain].count]);
    };
    sortedMountains.sort(function (a, b) {
      return b[1] - a[1];
    });
    console.log(sortedMountains[0][0]);
    console.log(sortedMountains[1][0]);
    console.log(sortedMountains[2][0]);
  });

  // need to display searches 
  // this will replace the myLocation search form
  // the html isn't written yet
  $("#top-search1").html(sortedMountains[0][0]);
  $("#top-search2").html(sortMoutains[1][0]);
  $("#top-search3").html(sortMoutains[2][0]);



});