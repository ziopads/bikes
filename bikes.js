$(document).ready(function(){
  ///////////////////////////////////////////////////////////////////////
  // DECLARE FUNCTIONS FOR SHOW/HIDE PRODELIVERY DIV
  ///////////////////////////////////////////////////////////////////////
  function hideProdelivery(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_dealer').hide();
    $('#prodelivery_dealers').hide();
    $('#prodelivery_velofix').hide();
    $('#prodelivery_both').hide();
    $('#prodelivery_no').hide();
  }

  function showProdeliveryLoading(){
    $('#prodelivery_dealer').hide();
    $('#prodelivery_dealers').hide();
    $('#prodelivery_velofix').hide();
    $('#prodelivery_both').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_loading').show();
  }

  function showProdelivery_dealer(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_dealers').hide();
    $('#prodelivery_velofix').hide();
    $('#prodelivery_both').hide();
    $('#prodelivery_dealer').show();
  }

  function showProdelivery_dealers(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_dealer').hide();
    $('#prodelivery_velofix').hide();
    $('#prodelivery_both').hide();
    $('#prodelivery_dealers').show();
  }

  function showProdelivery_velofix(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_dealer').hide();
    $('#prodelivery_dealers').hide();
    $('#prodelivery_both').hide();
    $('#prodelivery_velofix').show();
  }

  function showProdelivery_both(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_dealer').hide();
    $('#prodelivery_dealers').hide();
    $('#prodelivery_velofix').hide();
    $('#prodelivery_both').show();
  }

  function showProdelivery_no(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_dealer').hide();
    $('#prodelivery_dealers').hide();
    $('#prodelivery_velofix').hide();
    $('#prodelivery_both').hide();
    $('#prodelivery_no').show();
  }
  ////////////////////////////////////////////////////////////////////////
  hideProdelivery();

  // $(document).keypress(function(e) {
  //   e.preventDefault();
  //   if($('#postcode').val()) {
  //     search();
  //   }
  // });

  ///////////////////////////////////////////////////////////////////////
  // EVENTHANDLER FOR POSTCODE SEARCH BUTTON
  ///////////////////////////////////////////////////////////////////////
  $('#postcode_search').click(search);
  $("button[name='checkout']").attr( "disabled", "disabled" );

  function search(){
    $('#delivery_method').val('');
    showProdeliveryLoading();
    var postcode = $('#postcode').val();
    if(!postcode){
      if($.cookie('postcode')){
        postcode = $.cookie('postcode');
      } else {
        showProdelivery_no();
        return
      }
    }
    $.cookie.raw = true;
    $.cookie('postcode', postcode, { expires: 30, path: '/' });
    $.cookie('dealers', [], { expires: 30, path: '/' });
    $.cookie('velofix', 'false', { expires: 30, path: '/' });
    $.cookie('deliveryOption', '', { expires: 30, path: '/' });
    $.cookie('selectedDeliveryOption', '', { expires: 30, path: '/' });
    $("button[name='checkout']").removeAttr('disabled');
    postcodeLookup(postcode);
  }

  ///////////////////////////////////////////////////////////////////////
  // IF COOKIE:POSTCODE, INVOKE FUNCTION TO RENDER PURCHASE OPTIONS
  ///////////////////////////////////////////////////////////////////////
  if($.cookie('postcode')){
    $('#postcode').attr('placeholder', ($.cookie('postcode')));
    renderPurchaseOptions();
    // $("button[name='checkout']").removeAttr('disabled');
  }

  if($.cookie('selectedDeliveryOption')){
    $("button[name='checkout']").removeAttr('disabled');
  }

  ///////////////////////////////////////////////////////////////////////
  // FUNCTION TO RENDER PURCHASE OPTIONS
  ///////////////////////////////////////////////////////////////////////
  function renderPurchaseOptions(){
    // FIRST, DELETE ANY EXISTING LIST ITEMS
    $('.postcode_results').empty();
    //////////////////////////
    if($.cookie('velofix') == 'true' && $.cookie('dealers')){
      showProdelivery_both();
      var deliveryOptions = [];
      var dealerOptionsFromCookie = $.cookie('dealers');
      if(dealerOptionsFromCookie.length){
        var arrayFromCookieDealer = dealerOptionsFromCookie.split(',');
        for (var i = 0; i < arrayFromCookieDealer.length; i++) {
          deliveryOptions.push(arrayFromCookieDealer[i]);
        }
      }
      if($.cookie('velofix') === 'true'){
       deliveryOptions.push('Velofix Delivery');
      }
      for (var i = 0; i < deliveryOptions.length; i++) {
        $('.postcode_results').append($('<li>' + deliveryOptions[i] + '</li>'));
      }
      if($.cookie('selectedDeliveryOption')){
        var string = $.cookie('selectedDeliveryOption');
        $('li:contains("' + string + '")').addClass('selected').css('color', '#004cff');
        $('#delivery_method').val(string);
        $("button[name='checkout']").removeAttr('disabled');
      }
    //////////////////////////
    } else if($.cookie('velofix') == 'false' && $.cookie('dealers')){
      var deliveryOptions = [];
      var dealerOptionsFromCookie = $.cookie('dealers');
      var arrayFromCookieDealer = dealerOptionsFromCookie.split(',');
      //////////////////////////
      if(arrayFromCookieDealer.length == 1){
        showProdelivery_dealer();
        $('.postcode_results').append($('<li class="selected" style="color: #004cff">' + arrayFromCookieDealer[0] + '</li>'));
        $.cookie('selectedDeliveryOption', arrayFromCookieDealer[0], { expires: 30, path: '/' });
        $('#delivery_method').val(arrayFromCookieDealer[0]);
        $("button[name='checkout']").removeAttr('disabled');
      //////////////////////////
      } else if(arrayFromCookieDealer.length > 1){
        showProdelivery_dealers();
        for (var i = 0; i < arrayFromCookieDealer.length; i++) {
          deliveryOptions.push(arrayFromCookieDealer[i]);
        }
        for (var i = 0; i < deliveryOptions.length; i++) {
          $('.postcode_results').append($('<li>' + deliveryOptions[i] + '</li>'));
        }
        if($.cookie('selectedDeliveryOption')){
          var string = $.cookie('selectedDeliveryOption');
          $('li:contains("' + string + '")').addClass('selected').css('color', '#004cff');
          $('#delivery_method').val(string);
          $("button[name='checkout']").removeAttr('disabled');
        }
      }
    } else if($.cookie('velofix') == 'true' && $.cookie('dealers') == ''){
      showProdelivery_velofix();
      $.cookie('selectedDeliveryOption', 'Velofix', { expires: 30, path: '/' });
      $('#delivery_method').val('Velofix');
      $("button[name='checkout']").removeAttr('disabled');
    } else {
      showProdelivery_no();
      $.cookie('selectedDeliveryOption', 'Direct Ship', { expires: 30, path: '/' });
      $('#delivery_method').val('Direct Ship');
      $("button[name='checkout']").removeAttr('disabled');
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // EVENTHANDLER FOR POSTCODE_RESULTS
  // adds eventhandler to each prodelivery option to select default,
  //  deselect previous default,
  //  and update styling accordingly
  ///////////////////////////////////////////////////////////////////////
  $('.postcode_results').on('click', 'li', function(e){
    $('.postcode_results li.selected').css('color', '#888');
    $('#postcode li.selected').removeClass('selected');
    $(this).addClass('selected').css('color', '#004cff');
    var selected = $(this).text();
    $.cookie('selectedDeliveryOption', selected, { expires: 30, path: '/' });
    $('#delivery_method').val(selected);
    $("button[name='checkout']").removeAttr('disabled');
  })

  /////////////////////////////////////////////////////////////////////////
  // FUNCTION TO FIND DEALERSHIP POSTAL CODES
  /////////////////////////////////////////////////////////////////////////
  function postcodeLookup(postcode){
    var country = isNaN(postcode) ? "ca": "us";
    return Promise.all([getDealers(country, postcode), getVelofix(country, postcode)])
    .then(function(){
      renderPurchaseOptions()
    })
  }

  /////////////////////////////////////////////////////////////////////////
  // FUNCTION TO FETCH DELIVERY INFO (SECOND API CALL)
  /////////////////////////////////////////////////////////////////////////
  function getArrayOfPostcodes(data){
    if(!data.postalCodes){
      console.log(data.status.message);
      $.cookie('postcode', '', { expires: 30, path: '/' });
      return false;
    }
    var postalCodes = [];
    for (var i = 0; i < data.postalCodes.length; i++) {
      postalCodes.push(data.postalCodes[i]['postalCode']);
    }
    return postalCodes;
  }

  /////////////////////////////////////////////////////////////////////////
  // GET DEALERS
  /////////////////////////////////////////////////////////////////////////
  function getDealers(country, postcode){
    return $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=16&maxRows=40&username=spotbrand&postalcode=" + postcode)
      .catch(function(err){
        console.log("Please enter a valid postal code");
      })
      .then(function(data){
        return getArrayOfPostcodes(data);
      })
      .then(function(postalCodeArray){
        if(!postalCodeArray){
          return false;
        }
        // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
        var arrayOfPromises = postalCodeArray.map(fetchDealers);
        return Promise.all(arrayOfPromises)
          .then(function(arrayOfValuesOrErrors){
            var dealerArray = [];
            for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
              if(arrayOfValuesOrErrors[i]){
                var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
                // IF THERE ARE MULTIPLE DEALERSHIPS IN THE SAME POSTCODE,
                // DEAL WITH IT HERE
                dealerArray.push(dealer);
              }
            }
            $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
          })
          .catch(function(err){
            console.log("ERROR: ", err);
          })
      })
  }

  /////////////////////////////////////////////////////////////////////////
  // GET VELOFIX
  /////////////////////////////////////////////////////////////////////////
  function getVelofix(country, postcode){
    return $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=160&maxRows=40&username=spotbrand&postalcode=" + postcode)
      .catch(function(err){
        console.log("Please enter a valid postal code");
      })
      .then(function(data){
        return getArrayOfPostcodes(data);
      })
      .then(function(postalCodeArray){
        if(!postalCodeArray){
          return false;
        }
        // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
        var arrayOfPromises = postalCodeArray.map(fetchVelofix);
        return Promise.all(arrayOfPromises)
          .then(function(arrayOfValuesOrErrors){
            for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
              if(arrayOfValuesOrErrors[i]){
                $.cookie('velofix', true, { expires: 30, path: '/' });
              }
            }
          })
          .catch(function(err){
            console.log("ERROR: ", err);
          })
      })
  }

  /////////////////////////////////////////////////////////////////////////
  // FETCH DEALERS
  /////////////////////////////////////////////////////////////////////////
  function fetchDealers(postcode){
    return $.getJSON("https://spotbrand.com/prodelivery/dealers.php?postcode=" + postcode)
    .catch(error => Promise.resolve({}))
    .then(function(data){
      if(!data[0]){
        return;
      }
      return data;
    })
  }

  /////////////////////////////////////////////////////////////////////////
  // FETCH VELOFIX
  /////////////////////////////////////////////////////////////////////////
  function fetchVelofix(postcode){
    return $.getJSON("https://spotbrand.com/prodelivery/velofix.php?postcode=" + postcode)
      .catch(error => Promise.resolve({}))
      .then(function(data){
        if(!data[0]){
          return;
        }
        return data;
      })
  }
  /////////////////////////////////////////////////////////////////////////
})
