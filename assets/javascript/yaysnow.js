$(document).ready(function () {
  console.log("ready");

  var liftieUrl = "http://liftie.info/api/resort/";

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
  $("#searchButton").on("click", function (event) {
    console.log("I've been clicked!");

    // var mountain = $('#mountainInput').val();

    // getLiftieReport(mountain);

    // var searchTerm = $("#mountainInput").val().trim();
    // var queryURL = "https://in-the-snow.firebaseio.com/searches/" + searchTerm + ".json"
    // $.get(queryURL).then(function (response) {
    //   if (response != null) {
    //     var count = response.count;
    //     count++
    //     console.log(count);

    //     $.ajax({
    //       type: 'PUT',
    //       url: queryURL,
    //       contentType: 'application/json',
    //       data: JSON.stringify({
    //         "count": count,
    //       })
    //     }).done(function () {
    //       console.log('SUCCESS');
    //     }).fail(function (msg) {
    //       console.log('FAIL');
    //     }).always(function (msg) {
    //       console.log('ALWAYS');
    //     });
    //   } else {
    //     $.ajax({
    //       type: 'PUT',
    //       url: queryURL,
    //       contentType: 'application/json',
    //       data: {
    //         count: count,
    //       }
    //     }).done(function () {
    //       console.log('SUCCESS');
    //     }).fail(function (msg) {
    //       console.log('FAIL');
    //     }).always(function (msg) {
    //       console.log('ALWAYS');
    //     });
    //   }
    // });
  });

  function getLiftieReport(mountain) {

    if (mountain != null && mountain != "") {
    
        $.get(liftieUrl + mountain).then(function(response) {
            
            console.log(response);
        });
      }
  };

});