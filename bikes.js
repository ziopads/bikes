$(document).ready(function(){
  // CREATE COOKIE
  // $.cookie('postcode', '');
  // $.cookie('dealers', []);
  // $.cookie('velofix', false);

  // EVENTHANDLER
  $('#button').on('click', function(){
    var postcode = $('#input').val();
    $.cookie('postcode', postcode)
    postcodeLookup(postcode);
  });

  // IF COOKIE:POSTCODE, INVOKE FUNCTION TO RENDER PURCHASE OPTIONS
  // ELSE IF !COOKIE:POSTCODE, INVOKE FUNCTION TO PERFORM POSTCODE LOOKUP

  // FUNCTION TO RENDER PURCHASE OPTIONS
  function renderPurchaseOptions(){

  }

  // FUNCTION TO PERFORM POSTCODE LOOKUP
  function postcodeLookup(postcode) {
    console.log(postcode);
    // IF !NUMERIC
    // if(isNaN(postcode)){
    //   $.getJSON( "http://api.geonames.org/findNearbyPostalCodesJSON?country=ca&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
    //     var postalCodes = [];
    //     for (var i = 0; i < data.postalCodes.length; i++) {
    //       postalCodes.push(data.postalCodes[i]['postalCode']);
    //     }
    //     console.log(postalCodes);
    //     // FOR EACH ZIPCODE, QUERY STORE/VELOFIX CONDITIONS
    //     $.each(postalCodes, function(key, value) {
    //       var postcode = Number.parseInt(value);
    //       // QUERY WES'S API
    //       $.getJSON("http://departmentofscience.com/clients/spot/query.php?postcode=" + postcode, function(result){
    //         console.log(result);
    //       //   // IF STORE AND VELOFIX, SET COOKIE ACCORDINGLY
    //       //   // ELSE IF STORE AND !VELOFIX
    //       //   // ELSE IF !STORE AND VELOFIX, SET COOKIE ACCORDINGLY
    //       //   // ELSE IF !STORE AND !VELOFIX, SET COOKIE ACCORDINGLY
    //       })
    //     })
    //   });
    // }
    $.getJSON( "http://api.geonames.org/findNearbyPostalCodesJSON?country=us&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
      var postalCodes = [];
      for (var i = 0; i < data.postalCodes.length; i++) {
        postalCodes.push(data.postalCodes[i]['postalCode']);
      }
      console.log(postalCodes);
      // FOR EACH ZIPCODE, QUERY STORE/VELOFIX CONDITIONS
      $.each(postalCodes, function(key, value) {
        var postcode = Number.parseInt(value);
        // QUERY WES'S API
        $.getJSON("http://departmentofscience.com/clients/spot/query.php?postcode=" + postcode, function(result){
          console.log(result);
        //   // IF STORE AND VELOFIX, SET COOKIE ACCORDINGLY
        //   // ELSE IF STORE AND !VELOFIX
        //   // ELSE IF !STORE AND VELOFIX, SET COOKIE ACCORDINGLY
        //   // ELSE IF !STORE AND !VELOFIX, SET COOKIE ACCORDINGLY
        })
      })
    });

    // IF ALPHA
  //
  //     });
  //   });
  //
  }








  // TEST DATA
  var testDataUS = {
    "postalCodes": [
      {
        "adminCode2": "013",
        "adminCode1": "CO",
        "adminName2": "Boulder",
        "lng": -105.277073,
        "distance": "0",
        "countryCode": "US",
        "postalCode": "80304",
        "adminName1": "Colorado",
        "placeName": "Boulder",
        "lat": 40.037482
      },
      {
        "adminCode2": "013",
        "adminCode1": "CO",
        "adminName2": "Boulder",
        "lng": -105.285131,
        "distance": "2.35348",
        "countryCode": "US",
        "postalCode": "80302",
        "adminName1": "Colorado",
        "placeName": "Boulder",
        "lat": 40.017235
      },
      {
        "adminCode2": "013",
        "adminCode1": "CO",
        "adminName2": "Boulder",
        "lng": -105.2705456,
        "distance": "2.56236",
        "countryCode": "US",
        "postalCode": "80309",
        "adminName1": "Colorado",
        "placeName": "Boulder",
        "lat": 40.0149856
      },
      {
        "adminCode2": "013",
        "adminCode1": "CO",
        "adminName2": "Boulder",
        "lng": -105.21426,
        "distance": "5.51754",
        "countryCode": "US",
        "postalCode": "80301",
        "adminName1": "Colorado",
        "placeName": "Boulder",
        "lat": 40.049733
      },
      {
        "adminCode2": "013",
        "adminCode1": "CO",
        "adminName2": "Boulder",
        "lng": -105.239178,
        "distance": "6.05717",
        "countryCode": "US",
        "postalCode": "80303",
        "adminName1": "Colorado",
        "placeName": "Boulder",
        "lat": 39.991381
      }
    ]
  };
  var testDataCAN = {
    "postalCodes": [
      {
        "adminCode1": "ON",
        "lng": -79.43776773775141,
        "distance": "0",
        "countryCode": "CA",
        "postalCode": "M6H",
        "adminName1": "Ontario",
        "placeName": "West Toronto (Dufferin / Dovercourt Village)",
        "lat": 43.66546686732684
      },
      {
        "adminCode1": "ON",
        "lng": -79.42054112730536,
        "distance": "1.4213",
        "countryCode": "CA",
        "postalCode": "M6G",
        "adminName1": "Ontario",
        "placeName": "Downtown Toronto (Christie)",
        "lat": 43.6683159966454
      },
      {
        "adminCode1": "ON",
        "lng": -79.46331311117376,
        "distance": "2.1287",
        "countryCode": "CA",
        "postalCode": "M6P",
        "adminName1": "Ontario",
        "placeName": "West Toronto (High Park / The Junction South)",
        "lat": 43.660465027155155
      },
      {
        "adminCode1": "ON",
        "lng": -79.45213430322379,
        "distance": "2.36897",
        "countryCode": "CA",
        "postalCode": "M6R",
        "adminName1": "Ontario",
        "placeName": "West Toronto (Parkdale / Roncesvalles Village)",
        "lat": 43.646868595548305
      },
      {
        "adminCode1": "ON",
        "lng": -79.41774266374644,
        "distance": "2.522",
        "countryCode": "CA",
        "postalCode": "M6J",
        "adminName1": "Ontario",
        "placeName": "West Toronto (Rua Aþores / Trinity)",
        "lat": 43.648014832126606
      }
    ]
  };
})
