$(document).ready(function(){
  ///////////////////////////////////////////////////////////////////////
  // EVENTHANDLER FOR POSTCODE SEARCH BUTTON
  ///////////////////////////////////////////////////////////////////////
  $('#postcode_search').on('click', function(){
    var postcode = $('#postcode').val();
    $.cookie.raw = true;
    $.cookie('postcode', postcode, { expires: 30, path: '/' })
    $.cookie('dealers', [], { expires: 30, path: '/' });
    $.cookie('velofix', false, { expires: 30, path: '/' });
    $.cookie('deliveryOption', '', { expires: 30, path: '/' });
    postcodeLookup(postcode);
  });

  ///////////////////////////////////////////////////////////////////////
  // IF COOKIE:POSTCODE, INVOKE FUNCTION TO RENDER PURCHASE OPTIONS
  // ELSE IF !COOKIE:POSTCODE, INVOKE FUNCTION TO PERFORM POSTCODE LOOKUP

  ///////////////////////////////////////////////////////////////////////
  // FUNCTION TO RENDER PURCHASE OPTIONS
  ///////////////////////////////////////////////////////////////////////
  // function renderPurchaseOptions(){
  //   // IF !DEALER && !VELOFIX, SHOW PRODELIVERY_NO, HIDE PRODELIVERY_YES
  //   /////////////////////////////
  //   // ELSE IF DEALER || VELOFIX, SHOW PRODELIVERY_YES, HIDE PRODELIVERY_NO
  //   // FIRST, DELETE ANY EXISTING LIST ITEMS
  //   console.log("RenderPurchaseOptions");
  //   // var deliveryOptions = [];
  //   var deliveryOptions = ["Brendan", "James", "Haskins"];
  //   var dealerOptionsFromCookie = $.cookie('dealers');
  //   console.log(dealerOptionsFromCookie);
  //   // if(dealerOptionsFromCookie.length){
  //   //   // PUSH EACH ELEMENT OF THE ARRAY TO deliveryOptions
  //   // }
  //   if($.cookie('velofix')){
  //     deliveryOptions.push('Velofix Delivery');
  //   }
  //   for (var i = 0; i < deliveryOptions.length; i++) {
  //     // var newItem = $('<li>' + deliveryOptions[i] + '</li>');
  //     $('#postcode_results').append($('<li>' + deliveryOptions[i] + '</li>'));
  //   }
  //   // ADD EVENTLISTENER TO SELECT/DESELECT OPTIONS (see below)
  // }

  // EVENTHANDLER: FUNCTION TO WRITE hiddenDeliveryOption
    // DELETE hiddenDeliveryOption VALUE
    // WRITE hiddenDeliveryOption VALUE

  // FUNCTION TO PERFORM POSTCODE LOOKUP
  function postcodeLookup(postcode) {
    // var postalCodes = []
    console.log(postcode);
    // IF !NUMERIC, QUERY CANADA
    if(isNaN(postcode)){
      $.getJSON( "http://api.geonames.org/findNearbyPostalCodesJSON?country=ca&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
        var postalCodes = [];
        for (var i = 0; i < data.postalCodes.length; i++) {
          postalCodes.push(data.postalCodes[i]['postalCode']);
        }
        console.log("POSTAL CODES from geonames api call: ", postalCodes);
        // FOR EACH ZIPCODE, QUERY STORE/VELOFIX CONDITIONS
        $.each(postalCodes, function(key, value) {
          // var postcode = Number.parseInt(value);
          $.getJSON("https://spotbrand.com/prodelivery/query.php?postcode=" + postcode, function(result){
            if(!result[0]){
              return
            }
            // IF DEALER, UPDATE COOKIE WITH DEALER INFO
            if(result[0]['dealer']){
              if(dealer === 'velofix'){
                $.cookie('velofix', true, { expires: 30, path: '/' });
                return
              }
              var dealer = result[0]['dealer'];
              var dealerArray = $.cookie('dealers') ? $.cookie('dealers') : [];
              dealerArray.push(dealer);
              $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
            }
            // IF VELOFIX, UPDATE COOKIE WITH VELOFIX INFO
            if(result[0]['velofix']){
              $.cookie('velofix', true, { expires: 30, path: '/' });
            }
          })
        })
      })
      .done(function(){
        // renderPurchaseOptions();
      });

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // ELSE IF NUMERIC, QUERY US
    } else {
      $.getJSON( "http://api.geonames.org/findNearbyPostalCodesJSON?country=us&radius=16&username=spotbrand&postalcode=" + postcode).then(function(data) {
        var postalCodes = [];
        for (var i = 0; i < data.postalCodes.length; i++) {
          postalCodes.push(data.postalCodes[i]['postalCode']);
        }
        console.log("POSTAL CODES from geonames api call: ", postalCodes);
        return postalCodes;
      }).then(function(postalCodeArray){
        console.log(postalCodeArray);
        var newArray = [];
        // console.log("Postal codes before the second api call: ", postalCodes);
        $.each(postalCodeArray, function(index, value) {
          var postcode = Number.parseInt(value);
          // console.log("Postcode inside $.each(): ", postcode);
          return $.getJSON("https://spotbrand.com/prodelivery/query.php?postcode=" + postcode)
          .then(function(result){
            console.log("postcode: ", postcode, "result: ", result);
            newArray.push(index);
            return postcode;
          })
        })
        return [postalCodeArray, newArray];
      })
      .then(function(result){
        console.log("RESULT: ", result);
      });


    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // // ELSE IF NUMERIC, QUERY US
    // } else {
    //   $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=us&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
    //     var postalCodes = [];
    //     for (var i = 0; i < data.postalCodes.length; i++) {
    //       postalCodes.push(data.postalCodes[i]['postalCode']);
    //     }
    //     console.log("POSTAL CODES from geonames api call: ", postalCodes);
    //     // FOR EACH ZIPCODE, QUERY STORE/VELOFIX CONDITIONS
    //     $.each(postalCodes, function(key, value) {
    //       var postcode = Number.parseInt(value);
    //       $.getJSON("https://spotbrand.com/prodelivery/query.php?postcode=" + postcode, function(result){
    //         if(!result[0]){
    //           return
    //         }
    //         console.log(result);
    //         // IF DEALER, UPDATE COOKIE WITH DEALER INFO
    //         if(result[0]['dealer']){
    //           var dealer = result[0]['dealer'];
    //           if(dealer === 'velofix'){
    //             $.cookie('velofix', true, { expires: 30, path: '/' });
    //             return
    //           }
    //           console.log(dealer);
    //           var dealerArray = $.cookie('dealers') ? $.cookie('dealers') : [];
    //           // console.log("Dealer Array before push", dealerArray);
    //           dealerArray.push(dealer);
    //           // console.log("Dealer Array after push", dealerArray);
    //           $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
    //         }
    //         // IF VELOFIX, UPDATE COOKIE WITH VELOFIX INFO
    //         if(result[0]['velofix']){
    //           $.cookie('velofix', true, { expires: 30, path: '/' });
    //         }
    //       })
    //     })
    //   })
    //   .done(function(){
    //     renderPurchaseOptions();
    //   });
    //
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    }
  }

  // FUNCTION TO SELECT DELIVERY OPTION
  function selectDeliveryOption(){
    console.log("The function 'selectDeliveryOption' just ran.");
  }



  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

})
