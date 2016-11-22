$(document).ready(function(){
  // CREATE COOKIE
  // $.cookie('postcode', '');
  //

  // EVENTHANDLER
  $('#button').on('click', function(){
    var postcode = $('#input').val();
    $.cookie.raw = true;
    $.cookie('postcode', postcode, { expires: 30, path: '/' })
    $.cookie('dealers', []);
    $.cookie('test', {[]})
    $.cookie('velofix', false);
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
    // IF !NUMERIC, QUERY CANADA
    if(isNaN(postcode)){
      $.getJSON( "http://api.geonames.org/findNearbyPostalCodesJSON?country=ca&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
        var postalCodes = [];
        for (var i = 0; i < data.postalCodes.length; i++) {
          postalCodes.push(data.postalCodes[i]['postalCode']);
        }
        console.log(postalCodes);
        // FOR EACH ZIPCODE, QUERY STORE/VELOFIX CONDITIONS
        $.each(postalCodes, function(key, value) {
          // var postcode = Number.parseInt(value);
          $.getJSON("http://departmentofscience.com/clients/spot/query.php?postcode=" + postcode, function(result){
            if(!result[0]){
              return
            }
            // IF DEALER, UPDATE COOKIE WITH DEALER INFO
            if(result[0]['dealer']){
              var dealer = result[0]['dealer'];
              var dealerArray = $.cookie('dealers') ? $.cookie('dealers') : [];
              dealerArray.push(dealer);
              $.cookie('dealers', dealerArray);
            }
            // IF VELOFIX, UPDATE COOKIE WITH VELOFIX INFO
            if(result[0]['velofix']){
              $.cookie('velofix', true);
            }
          })
        })
      });
    // ELSE IF NUMERIC, QUERY US
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
          $.getJSON("http://departmentofscience.com/clients/spot/query.php?postcode=" + postcode, function(result){
            if(!result[0]){
              return
            }
            console.log(result);
            // IF DEALER, UPDATE COOKIE WITH DEALER INFO
            if(result[0]['dealer']){
              var dealer = result[0]['dealer'];
              console.log(dealer);
              var dealerArray = $.cookie('dealers') ? $.cookie('dealers') : [];
              console.log("Dealer Array before push", dealerArray);
              dealerArray.push(dealer);
              console.log("Dealer Array after push", dealerArray);
              $.cookie('dealers', dealerArray);
            }
            // IF VELOFIX, UPDATE COOKIE WITH VELOFIX INFO
            if(result[0]['velofix']){
              $.cookie('velofix', true);
            }
          })
        })
      });
    }
  }
})
