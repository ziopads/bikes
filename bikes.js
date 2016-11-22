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
    if(isNaN(postcode)){
      $.getJSON( "http://api.geonames.org/findNearbyPostalCodesJSON?country=ca&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
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
    } else {
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
    }

    // IF ALPHA
  //
  //     });
  //   });
  //
  }
})
