$(document).ready(function(){
  $('#prodelivery_yes').hide();
  $('#prodelivery_no').hide();
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
  if($.cookie('postcode')){
    $('#postcode').attr('placeholder', ($.cookie('postcode')));
  }
  // ELSE IF !COOKIE:POSTCODE, INVOKE FUNCTION TO PERFORM POSTCODE LOOKUP

  ///////////////////////////////////////////////////////////////////////
  // FUNCTION TO RENDER PURCHASE OPTIONS
  ///////////////////////////////////////////////////////////////////////
  function renderPurchaseOptions(){
    console.log("RENDER PURCHASE OPTIONS");
    // FIRST, DELETE ANY EXISTING LIST ITEMS
    $('#postcode_results').empty();

    // IF !DEALER && !VELOFIX, SHOW PRODELIVERY_NO, HIDE PRODELIVERY_YES
    if(!$.cookie('velofix') && !$.cookie('dealers')){
      $('#prodelivery_no').show();
      $('#prodelivery_yes').hide();
    }

    // ELSE IF DEALER || VELOFIX, SHOW PRODELIVERY_YES, HIDE PRODELIVERY_NO
    else if($.cookie('velofix') || $.cookie('dealers')){
      $('#prodelivery_yes').show();
      $('#prodelivery_no').hide();
      var deliveryOptions = [];
      console.log("deliveryOptions", deliveryOptions);
      var dealerOptionsFromCookie = $.cookie('dealers');
      console.log("dealerOptionsFromCookie", dealerOptionsFromCookie);
      console.log("deliveryOptions", deliveryOptions);
      if(dealerOptionsFromCookie.length){
        // for (var i = 0; i < dealerOptionsFromCookie.length; i++) {
          deliveryOptions.push(dealerOptionsFromCookie);
        // }
      }
      if($.cookie('velofix') === true){
       deliveryOptions.push('Velofix Delivery');
      }
      deliveryOptions.push('Mail it to me')
      console.log("DELIVERY OPTIONS: ", deliveryOptions);
      for (var i = 0; i < deliveryOptions.length; i++) {
        $('#postcode_results').append($('<li>' + deliveryOptions[i] + '</li>'));
      }
      $('#postcode_results').on('click', 'li', function(e){
        $('li.selected').removeClass('selected');
        $(this).addClass('selected');
        console.log($(this).text());
        updateHiddenDeliveryOption($(this).text())
      })
    }
  }

  // EVENTHANDLER: FUNCTION TO WRITE hiddenDeliveryOption
  function updateHiddenDeliveryOption(string){
    $('#hiddenDeliveryOption').text(string);
  }

  // FUNCTION TO PERFORM POSTCODE LOOKUP
  function postcodeLookup(postcode) {
    // var postalCodes = []
    console.log(postcode);
    // IF !NUMERIC, QUERY CANADA
    if(isNaN(postcode)){
      $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=ca&radius=16&username=spotbrand&postalcode=" + postcode, function(data) {
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
      $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=us&radius=16&username=spotbrand&postalcode=" + postcode)
        .then(function(data) {
          // GET ARRAY OF JUST THE POSTAL CODES FROM THE API DATA
          var postalCodes = [];
          for (var i = 0; i < data.postalCodes.length; i++) {
            postalCodes.push(data.postalCodes[i]['postalCode']);
          }
          console.log("POSTAL CODES from geonames api call: ", postalCodes);
          return postalCodes;
        })
        .then(function(postalCodeArray){
          // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
          var arrayOfPromises = postalCodeArray.map(fetchDeliveryInfo);
          return Promise.all(arrayOfPromises)
            .then(function(arrayOfValuesOrErrors){
              var dealerArray = [];
              for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
                if(arrayOfValuesOrErrors[i]){
                  var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
                  if(dealer === 'velofix'){
                    $.cookie('velofix', true, { expires: 30, path: '/' });
                  } else {
                    dealerArray.push(dealer);
                  }
                }
              }
              $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
              renderPurchaseOptions();
            })
            .catch(function(err){
              console.log("ERROR: ", err);
            })
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
  function fetchDeliveryInfo(postcode){
    return $.getJSON("https://spotbrand.com/prodelivery/query.php?postcode=" + postcode)
      .catch(error => Promise.resolve({ color: "red",   message: "Fail ;_;" }))
      .then(function(data){
        if(!data[0]){
          return;
        }
        console.log(data[0]['dealer']);
        console.log(data);
        return data;
      })
  }

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

})
