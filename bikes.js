$(document).ready(function(){
  ///////////////////////////////////////////////////////////////////////
  // DECLARE FUNCTIONS FOR SHOW/HIDE PRODELIVERY DIV
  ///////////////////////////////////////////////////////////////////////
  function hideProdelivery(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_yes').hide();
    $('#prodelivery_no').hide();
  }

  function showProdeliveryLoading(){
    $('#prodelivery_yes').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_loading').show();
  }

  function showProdelivery_yes(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_no').hide();
    $('#prodelivery_yes').show();
  }

  function showProdelivery_no(){
    $('#prodelivery_loading').hide();
    $('#prodelivery_yes').hide();
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

  // ///////////////////////////////////////////////////////////////////////
  // // EVENTHANDLER FOR POSTCODE SEARCH BUTTON
  // ///////////////////////////////////////////////////////////////////////
  // $('#postcode_search').on('click', function(){
  //   $('#hiddenDeliveryOption').empty();
  //   $('#prodelivery_yes').hide();
  //   $('#prodelivery_no').hide();
  //   $('#prodelivery_loading').show();
  //   var postcode = $('#postcode').val();
  //   $.cookie.raw = true;
  //   $.cookie('postcode', postcode, { expires: 30, path: '/' });
  //   $.cookie('dealers', [], { expires: 30, path: '/' });
  //   $.cookie('velofix', false, { expires: 30, path: '/' });
  //   $.cookie('deliveryOption', '', { expires: 30, path: '/' });
  //   $.cookie('selectedDeliveryOption', '', { expires: 30, path: '/' });
  //   postcodeLookup(postcode);
  // });

  ///////////////////////////////////////////////////////////////////////
  // EVENTHANDLER FOR POSTCODE SEARCH BUTTON
  ///////////////////////////////////////////////////////////////////////
  $('#postcode_search').click(search);

  function search(){
    $('#hiddenDeliveryOption').empty();
    showProdeliveryLoading();
    var postcode = $('#postcode').val();
    console.log("postcode: ", postcode);
    $.cookie.raw = true;
    $.cookie('postcode', postcode, { expires: 30, path: '/' });
    $.cookie('dealers', [], { expires: 30, path: '/' });
    $.cookie('velofix', false, { expires: 30, path: '/' });
    $.cookie('deliveryOption', '', { expires: 30, path: '/' });
    $.cookie('selectedDeliveryOption', '', { expires: 30, path: '/' });
    postcodeLookup(postcode);
  }

  ///////////////////////////////////////////////////////////////////////
  // IF COOKIE:POSTCODE, INVOKE FUNCTION TO RENDER PURCHASE OPTIONS
  ///////////////////////////////////////////////////////////////////////
  if($.cookie('postcode')){
    $('#postcode').attr('placeholder', ($.cookie('postcode')));
    renderPurchaseOptions();
  }

  ///////////////////////////////////////////////////////////////////////
  // FUNCTION TO RENDER PURCHASE OPTIONS
  ///////////////////////////////////////////////////////////////////////
  function renderPurchaseOptions(){
    // FIRST, DELETE ANY EXISTING LIST ITEMS
    $('#postcode_results').empty();
    // IF !DEALER && !VELOFIX, SHOW PRODELIVERY_NO, HIDE PRODELIVERY_YES
    if($.cookie('velofix') === 'false' && $.cookie('dealers') === ''){
      showProdelivery_no();
    }
    // ELSE IF DEALER || VELOFIX, SHOW PRODELIVERY_YES, HIDE PRODELIVERY_NO
    else if($.cookie('velofix') || $.cookie('dealers')){
      showProdelivery_yes();
      var deliveryOptions = [];
      var dealerOptionsFromCookie = $.cookie('dealers');
      // console.log("dealerOptionsFromCookie: ", dealerOptionsFromCookie);
      if(dealerOptionsFromCookie.length){
        var arrayFromCookieDealer = dealerOptionsFromCookie.split(',');
        for (var i = 0; i < arrayFromCookieDealer.length; i++) {
          deliveryOptions.push(arrayFromCookieDealer[i]);
        }
      }
      // console.log("deliveryOptions: ", deliveryOptions);
      if($.cookie('velofix') === true){
       deliveryOptions.push('Velofix Delivery');
      }
      // console.log("deliveryOptions after velofix: ", deliveryOptions);

      // deliveryOptions.push('Mail it to me');
      for (var i = 0; i < deliveryOptions.length; i++) {
        $('#postcode_results').append($('<li>' + deliveryOptions[i] + '</li>'));
      }
      if($.cookie('selectedDeliveryOption')){
        var string = $.cookie('selectedDeliveryOption');
        $('li:contains("' + string + '")').addClass('selected').css('color', '#004cff');
        $('#hiddenDeliveryOption').text(string);
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // EVENTHANDLER FOR POSTCODE_RESULTS
  // adds eventhandler to each prodelivery option to select default,
  //  deselect previous default,
  //  and update styling accordingly
  ///////////////////////////////////////////////////////////////////////
  $('#postcode_results').on('click', 'li', function(e){
    $('#postcode_results li.selected').css('color', '#888');
    $('#postcode li.selected').removeClass('selected');
    $(this).addClass('selected').css('color', '#004cff');
    var selected = $(this).text();
    console.log("SELECTED VARIABLE: ", selected);
    // $.cookie('selectedDeliveryOption', JSON.stringify(selected), { expires: 30, path: '/' })
    $.cookie('selectedDeliveryOption', selected, { expires: 30, path: '/' });
    $('#hiddenDeliveryOption').text(selected);
  })


                                                                                // //////////////////////////////////////////////////////////////////////
                                                                                // // FUNCTION TO PERFORM POSTCODE LOOKUP
                                                                                // //////////////////////////////////////////////////////////////////////
                                                                                // function postcodeLookup(postcode) {
                                                                                //   // var postalCodes = []
                                                                                //   // IF !NUMERIC, QUERY CANADA
                                                                                //   if(isNaN(postcode)){
                                                                                //     $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=ca&radius=16&maxRows=20&username=spotbrand&postalcode=" + postcode)
                                                                                //     .catch(function(err){
                                                                                //       console.log("Please enter a valid postal code");
                                                                                //     })
                                                                                //     .then(function(data) {
                                                                                //       // GET ARRAY OF JUST THE POSTAL CODES FROM THE API DATA
                                                                                //       if(!data.postalCodes){
                                                                                //         console.log(data.status.message);
                                                                                //         $.cookie('postcode', '', { expires: 30, path: '/' });
                                                                                //         return false;
                                                                                //       }
                                                                                //       var postalCodes = [];
                                                                                //       for (var i = 0; i < data.postalCodes.length; i++) {
                                                                                //         postalCodes.push(data.postalCodes[i]['postalCode']);
                                                                                //       }
                                                                                //       return postalCodes;
                                                                                //     })
                                                                                //     .then(function(postalCodeArray){
                                                                                //       if(!postalCodeArray){
                                                                                //         return false;
                                                                                //       }
                                                                                //       // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
                                                                                //       var arrayOfPromises = postalCodeArray.map(fetchDeliveryInfo);
                                                                                //       return Promise.all(arrayOfPromises)
                                                                                //         .then(function(arrayOfValuesOrErrors){
                                                                                //           var dealerArray = [];
                                                                                //           for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
                                                                                //             if(arrayOfValuesOrErrors[i]){
                                                                                //               var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
                                                                                //               if(dealer === 'velofix'){
                                                                                //                 $.cookie('velofix', true, { expires: 30, path: '/' });
                                                                                //               } else {
                                                                                //                 dealerArray.push(dealer);
                                                                                //               }
                                                                                //             }
                                                                                //           }
                                                                                //           $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
                                                                                //           renderPurchaseOptions();
                                                                                //         })
                                                                                //         .catch(function(err){
                                                                                //           console.log("ERROR: ", err);
                                                                                //         })
                                                                                //     });
                                                                                //
                                                                                //   // ELSE IF NUMERIC, QUERY US
                                                                                //   } else {
                                                                                //     $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=us&radius=16&maxRows=20&username=spotbrand&postalcode=" + postcode)
                                                                                //     .catch(function(err){
                                                                                //       console.log("Please enter a valid postal code");
                                                                                //     })
                                                                                //     .then(function(data) {
                                                                                //       console.log(data);
                                                                                //         // GET ARRAY OF JUST THE POSTAL CODES FROM THE API DATA
                                                                                //         if(!data.postalCodes){
                                                                                //           console.log(data.status.message);
                                                                                //           $.cookie('postcode', '', { expires: 30, path: '/' });
                                                                                //           return false;
                                                                                //         }
                                                                                //         var postalCodes = [];
                                                                                //         for (var i = 0; i < data.postalCodes.length; i++) {
                                                                                //           postalCodes.push(data.postalCodes[i]['postalCode']);
                                                                                //         }
                                                                                //         console.log(postalCodes);
                                                                                //         return postalCodes;
                                                                                //       })
                                                                                //       .then(function(postalCodeArray){
                                                                                //         if(!postalCodeArray){
                                                                                //           return false;
                                                                                //         }
                                                                                //         // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
                                                                                //         var arrayOfPromises = postalCodeArray.map(fetchDeliveryInfo);
                                                                                //         return Promise.all(arrayOfPromises)
                                                                                //           .then(function(arrayOfValuesOrErrors){
                                                                                //             var dealerArray = [];
                                                                                //             for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
                                                                                //               if(arrayOfValuesOrErrors[i]){
                                                                                //                 var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
                                                                                //                 if(dealer === 'velofix'){
                                                                                //                   $.cookie('velofix', true, { expires: 30, path: '/' });
                                                                                //                 } else {
                                                                                //                   dealerArray.push(dealer);
                                                                                //                 }
                                                                                //               }
                                                                                //             }
                                                                                //             $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
                                                                                //             renderPurchaseOptions();
                                                                                //           })
                                                                                //           .catch(function(err){
                                                                                //             console.log("ERROR: ", err);
                                                                                //           })
                                                                                //       });
                                                                                //   }
                                                                                // }
  // /////////////////////////////////////////////////////////////////////////
  // // FUNCTION TO FIND DEALERSHIP POSTAL CODES
  // /////////////////////////////////////////////////////////////////////////
  // function postcodeLookup(postcode){
  //   var country = isNaN(postcode) ? "ca": "us";
  //   console.log(country, postcode);
  //   // return Promise.all([getDealers(country, postcode), getVelofix(country, postcode)])
  //   return Promise.all([getDealers(country, postcode)])
  //     .then(function(){
  //       console.log("WE MADE IT");
  //       // renderPurchaseOptions()
  //     })
  //     .catch(function(err){
  //       console.log("Promise.all error at highest level: ", err);
  //     })
  // }
  /////////////////////////////////////////////////////////////////////////
  // FUNCTION TO FIND DEALERSHIP POSTAL CODES
  /////////////////////////////////////////////////////////////////////////
  function postcodeLookup(postcode){
    var country = isNaN(postcode) ? "ca": "us";
    console.log(country, postcode);
    $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=16&maxRows=40&username=spotbrand&postalcode=" + postcode)
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
        console.log("arrayOfPromises: ", arrayOfPromises);
        return Promise.all(arrayOfPromises)
          .then(function(arrayOfValuesOrErrors){
            console.log("arrayOfValuesOrErrors: ", arrayOfValuesOrErrors);
            var dealerArray = [];
            for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
              if(arrayOfValuesOrErrors[i]){
                var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
                dealerArray.push(dealer);
              }
            }
            $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
            console.log("brendan");
            return "brendan";
          })
          .catch(function(err){
            console.log("ERROR: ", err);
          })
      })
      .then(function(){
        console.log("THE TIME IS NOW");
        $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=160&maxRows=20&username=spotbrand&postalcode=" + postcode)
            .catch(function(err){
              console.log("Please enter a valid postal code");
            })
            .then(function(data){
              console.log("velofix postcodes: ", data);
              return getArrayOfPostcodes(data);
            })
            .then(function(postalCodeArray){
              console.log("postalCodeArray for velofix: ", postalCodeArray);
              if(!postalCodeArray){
                return false;
              }
              // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
              var arrayOfPromises = postalCodeArray.map(fetchVelofix);
              console.log("arrayOfPromises: ", arrayOfPromises);
              return Promise.all(arrayOfPromises)
                .then(function(arrayOfValuesOrErrors){
                  console.log(arrayOfValuesOrErrors);
                  for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
                    if(dealer === 'velofix'){
                      $.cookie('velofix', true, { expires: 30, path: '/' });
                    }
                  }
                  $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
                })
                .catch(function(err){
                  console.log("ERROR: ", err);
                })
            })
      })
      .then(function(){
        renderPurchaseOptions();
      })
  }
  //                                                                               $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=16&maxRows=20&username=spotbrand&postalcode=" + postcode)
  //                                                                                 .catch(function(err){
  //                                                                                   console.log("Please enter a valid postal code");
  //                                                                                 })
  //                                                                                 .then(getArrayOfPostcodes(data))
  //                                                                                 .then(getDealers(data))
  //                                                                                 .then(function(data) {
  //                                                                                   console.log(data);
  //                                                                                     // GET ARRAY OF JUST THE POSTAL CODES FROM THE API DATA
  //                                                                                     if(!data.postalCodes){
  //                                                                                       console.log(data.status.message);
  //                                                                                       $.cookie('postcode', '', { expires: 30, path: '/' });
  //                                                                                       return false;
  //                                                                                     }
  //                                                                                     var postalCodes = [];
  //                                                                                     for (var i = 0; i < data.postalCodes.length; i++) {
  //                                                                                       postalCodes.push(data.postalCodes[i]['postalCode']);
  //                                                                                     }
  //                                                                                     console.log(postalCodes);
  //                                                                                     return postalCodes;
  //                                                                                   })
  //                                                                                   .then(function(postalCodeArray){
  //                                                                                     if(!postalCodeArray){
  //                                                                                       return false;
  //                                                                                     }
  //                                                                                     // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
  //                                                                                     var arrayOfPromises = postalCodeArray.map(fetchDeliveryInfo);
  //                                                                                     return Promise.all(arrayOfPromises)
  //                                                                                       .then(function(arrayOfValuesOrErrors){
  //                                                                                         var dealerArray = [];
  //                                                                                         for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
  //                                                                                           if(arrayOfValuesOrErrors[i]){
  //                                                                                             var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
  //                                                                                             if(dealer === 'velofix'){
  //                                                                                               $.cookie('velofix', true, { expires: 30, path: '/' });
  //                                                                                             } else {
  //                                                                                               dealerArray.push(dealer);
  //                                                                                             }
  //                                                                                           }
  //                                                                                         }
  //                                                                                         $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
  //                                                                                         renderPurchaseOptions();
  //                                                                                       })
  //                                                                                       .catch(function(err){
  //                                                                                         console.log("ERROR: ", err);
  //                                                                                       })
  //                                                                                   });
  //   // GET VELOFIX
  //   $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=160&maxRows=20&username=spotbrand&postalcode=" + postcode)
  //     .catch(function(err){
  //       console.log("Please enter a valid postal code");
  //     })
  //     .then(getVelofix(data))
  // }

  // /////////////////////////////////////////////////////////////////////////
  // // FUNCTION TO FETCH DELIVERY INFO (SECOND API CALL)
  // /////////////////////////////////////////////////////////////////////////
  // function fetchDeliveryInfo(postcode){
  //   return $.getJSON("https://spotbrand.com/prodelivery/query.php?postcode=" + postcode)
  //     .catch(error => Promise.resolve({}))
  //     .then(function(data){
  //       if(!data[0]){
  //         return;
  //       }
  //       return data;
  //     })
  // }
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
    console.log(postalCodes);
    return postalCodes;
  }

  // /////////////////////////////////////////////////////////////////////////
  // // GET DEALERS
  // /////////////////////////////////////////////////////////////////////////
  //
  // function getDealers(country, postcode){
  //   $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=16&maxRows=40&username=spotbrand&postalcode=" + postcode)
  //     .catch(function(err){
  //       console.log("Please enter a valid postal code");
  //     })
  //     .then(function(data){
  //       return getArrayOfPostcodes(data);
  //     })
  //     .then(function(postalCodeArray){
  //       if(!postalCodeArray){
  //         return false;
  //       }
  //       // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
  //       var arrayOfPromises = postalCodeArray.map(fetchDealers);
  //       console.log("arrayOfPromises: ", arrayOfPromises);
  //       return Promise.all(arrayOfPromises)
  //         .then(function(arrayOfValuesOrErrors){
  //           console.log("arrayOfValuesOrErrors: ", arrayOfValuesOrErrors);
  //           var dealerArray = [];
  //           for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
  //             // console.log(arrayOfValuesOrErrors[i]);
  //             if(arrayOfValuesOrErrors[i]){
  //               var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
  //               dealerArray.push(dealer);
  //             }
  //           }
  //           $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
  //           console.log("brendan");
  //           return "brendan";
  //         })
  //         .catch(function(err){
  //           console.log("ERROR: ", err);
  //         })
  //         return "wes";
  //     })
  // }

  // /////////////////////////////////////////////////////////////////////////
  // // GET VELOFIX
  // /////////////////////////////////////////////////////////////////////////
  //
  // function getDealers(country, postcode){
  //   $.getJSON( "https://secure.geonames.net/findNearbyPostalCodesJSON?country=" + country + "&radius=160&maxRows=20&username=spotbrand&postalcode=" + postcode)
  //     .catch(function(err){
  //       console.log("Please enter a valid postal code");
  //     })
  //     .then(function(data){
  //       return getArrayOfPostcodes(data);
  //     })
  //     .then(function(postalCodeArray){
  //       if(!postalCodeArray){
  //         return false;
  //       }
  //       // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
  //       var arrayOfPromises = postalCodeArray.map(fetchVelofix);
  //       console.log("arrayOfPromises: ", arrayOfPromises);
  //       return Promise.all(arrayOfPromises)
  //         .then(function(arrayOfValuesOrErrors){
  //           var dealerArray = [];
  //           for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
  //             console.log(arrayOfValuesOrErrors[i]);
  //             if(arrayOfValuesOrErrors[i]){
  //               var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
  //               dealerArray.push(dealer);
  //             }
  //           }
  //           $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
  //         })
  //         .catch(function(err){
  //           console.log("ERROR: ", err);
  //         })
  //     })
  // }

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


  // .then(function(postalCodeArray){
  //   if(!postalCodeArray){
  //     return false;
  //   }
  //   // CREATE AN ARRAY OF PROMISES FOR SECOND API CALL
  //   var arrayOfPromises = postalCodeArray.map(fetchDeliveryInfo);
  //   return Promise.all(arrayOfPromises)
  //     .then(function(arrayOfValuesOrErrors){
  //       var dealerArray = [];
  //       for (var i = 0; i < arrayOfValuesOrErrors.length; i++) {
  //         if(arrayOfValuesOrErrors[i]){
  //           var dealer = arrayOfValuesOrErrors[i][0]['dealer'];
  //           if(dealer === 'velofix'){
  //             $.cookie('velofix', true, { expires: 30, path: '/' });
  //           } else {
  //             dealerArray.push(dealer);
  //           }
  //         }
  //       }
  //       $.cookie('dealers', dealerArray, { expires: 30, path: '/' });
  //       renderPurchaseOptions();
  //     })
  //     .catch(function(err){
  //       console.log("ERROR: ", err);
  //     })

})
