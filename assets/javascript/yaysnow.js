$(document).ready(function () {

  var liftieUrl = "https://liftie.info/api/resort/";
  var cardCount = 0;
  var cardNumber = 0;
  var row;
  var sortedMountains = [];


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

    //inputs validation
    var reg = /^[a-zA-Z\s]+(-[a-zA-Z]+)*$/;
    var inputs = document.getElementsByClassName('needs-validation');
    var formValid = true;

    var validation = Array.prototype.filter.call(inputs, function (input) {

      var field = $(input);

      if (!reg.test(field.val())) {

        field.addClass('is-invalid');
        formValid = false;
      } else {
        field.removeClass('is-invalid');
      }
    });

    if (formValid) {

      var searchTerm = $("#mountainInput").val().trim().toLowerCase();
      var mtnObj = sortedMountains.filter(mountain => mountain[0] == searchTerm);
      console.log('mtn = ', mtnObj);

      if (mtnObj.length > 0) {
        var cnt = mtnObj[0][1];
        cnt++;
        console.log('inside update existing');
        database.ref('/searches').child(searchTerm).update({ count: cnt });

      } else {
        console.log('inside new mountain');
        database.ref('/searches').child(searchTerm).set({ count: 1 });
      }

      getLiftieReport();
    }
  });


  //call the liftie and google api's and populate the mountain cards with responses
  function getLiftieReport() {

    var mountain = $("#mountainInput").val().trim().toLowerCase();

    console.log('mountain inside liftie', mountain);
    if (mountain != null && mountain != "") {

      var notFound = `${mountain} info not found`;

      var cardObject = {
        name: "",
        forcast: "",
        liftsOpen: "",
        liftsClosed: "",
        travelInfo: "",
        notFound: notFound,
      }

      console.log('not found ', notFound);

      getTravelTime().then(function (travelInfoResponse) {

        cardObject.travelInfo = travelInfoResponse;

        $.get(liftieUrl + mountain).then(function (response) {

          console.log('liftie response ', response);
          cardObject.name = response.name;
          cardObject.forcast = response.weather.text;
          cardObject.liftsOpen = response.lifts.stats.open;
          cardObject.liftsClosed = response.lifts.stats.closed;

          populateCard(cardObject);

        }).catch(function (err) {

          cardObject.name = mountain;
          cardObject.forcast = "not found";
          cardObject.liftsOpen = "not found";
          cardObject.liftsClosed = "not found";

          populateCard(cardObject);
          console.log('this is the catch ', err);
        });
      });
    };
  };

  function populateCard(obj) {

    //if 3 cards in a row, then create a new row
    if (cardCount % 3 == 0) {
      row = $('<div>').addClass('row card-row');
      $('.container').append(row);
    }

    //create and populate the mountain cards
    var col = $('<div>').addClass('col-sm-4').attr('id', 'card-' + cardNumber);
    var card = $('<div>').addClass('card');
    var cardBody = $('<div>').addClass('card-body');

    col.append(card);
    card.append(cardBody);

    cardBody.append($('<span>').addClass("card-title text-center").text(obj.name));
    cardBody.append($('<a>').addClass('btn btn-secondary float-right remove').attr({ 'href': '#', 'card-number': cardNumber }).text('X'));
    cardBody.append($('<hr>'));
    cardBody.append($('<span>').addClass("card-text weather-display-title block").text("Forcast:"));
    cardBody.append($('<span>').addClass("card-text weather-display bock").text(obj.forcast));
    cardBody.append($('<hr>'));
    cardBody.append($('<span>').addClass("card-text lift-report-display-title block").text('Lift Status:'));
    cardBody.append($('<span>').addClass("card-text lift-report-display-open").text('Open: ' + obj.liftsOpen));
    cardBody.append($('<span>').addClass("card-text lift-report-display-closed float-right").text('Closed: ' + obj.liftsClosed));
    cardBody.append($('<hr>'));
    cardBody.append($('<span>').addClass("card-text drive-time-display-title block").text('Drive Time:'));
    cardBody.append($('<span>').addClass("card-text drive-time-display-text block").text(obj.travelInfo));

    row.append(col);
    cardCount++;
    cardNumber++;
  };



  //button that removes mountain cards
  $('.container').on('click', '.remove', function (event) {
    event.preventDefault();

    var num = $(this).attr('card-number');
    var removed = $(`#card-${num}`);
    var parentRow = removed.parent('.card-row');
    $(`#card-${num}`).remove();

    if (!parentRow.has('.col-sm-4').length) {
      parentRow.remove();
    }
    cardCount--;

  });


  //request for google maps to get travel time to mountain
  function getTravelTime() {
    console.log("Hi");
    var mountain = $("#mountainInput").val();
    var city = $("#cityInput").val();
    var state = $("#stateInput").val();
    var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" +
      city + '+' + state +
      "&destination=" + mountain + "&key=AIzaSyDRGTwL70MZMi0xfqWIPGWLTP1IdTHjHPA";

    return $.ajax({
      url: queryURL,
      method: "GET"
    }).then(res => {
      console.log(res)
      var travelTime = res.routes[0].legs[0].duration.text;
      var distance = res.routes[0].legs[0].distance.text;
      console.log('travelTime = ', travelTime);
      console.log('distance = ', distance);

      if (res == null) {
        travelInfo = "Travel time not found";
      } else {
        var travelInfo = travelTime + '  ' + `(${distance})`;
      }

      return travelInfo;
    })
  };


  //get the counts of searches by mountain and display the top 3 searches
  database.ref('/searches').on('value', function (snapshot) {

    console.log('snapshot.val() ', snapshot.val());
    sortedMountains = [];
    var searches = snapshot.val();

    for (var mountain in searches) {
      sortedMountains.push([mountain, searches[mountain].count]);
    };
    sortedMountains.sort(function (a, b) {
      return b[1] - a[1];
    });

    console.log('sortedMountains ', sortedMountains);

    $("#top-search1").text(`${sortedMountains[0][0]}: \xa0 \xa0${sortedMountains[0][1]}`);
    $("#top-search2").text(`${sortedMountains[1][0]}: \xa0 \xa0${sortedMountains[1][1]}`);
    $("#top-search3").text(`${sortedMountains[2][0]}: \xa0 \xa0${sortedMountains[2][1]}`);
  });
});