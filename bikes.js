$(document).ready(function(){
  // CREATE COOKIE
  $.cookie('name', 'brendan');
  // Cookies.set('name', 'brendan');
  // STORE ZIPCODE

  // STORE DEALER ARRAY
  // STORE VELOFIX ARRAY
  var test = $.cookie('name');
  console.log(test);

  // IF COOKIE VALUES, INVOKE FUNCTION TO RENDER PURCHASE OPTIONS

  // FUNCTION TO RENDER PURCHASE OPTIONS

  // FUNCTION TO PERFORM ZIPCODE LOOKUP
  function zipcodeLookup(zipcode){
    $.getJSON( "URL", function( data ) {
      // SET COOKIE WITH ZIPCODES???
      var zipcodes = {"zip_codes":["80302","80304","80310","80306","80307","80308","80309","80314","80321","80322","80323","80328","80329","80301"]};

      // FOR EACH ZIPCODE, QUERY STORE/VELOFIX CONDITIONS
      $.each( zipcode, function( key, val ) {
        items.push( "<li id='" + key + "'>" + val + "</li>" );
        // QUERY WES'S API
        $.getJSON("http://departmentofscience.com/clients/spot/query.php?postcode=`item`", function(){
          // IF STORE AND VELOFIX, SET COOKIE ACCORDINGLY

          // ELSE IF STORE AND !VELOFIX

          // ELSE IF !STORE AND VELOFIX, SET COOKIE ACCORDINGLY

          // ELSE IF !STORE AND !VELOFIX, SET COOKIE ACCORDINGLY

        })

      });

      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "body" );
    });

  }
})
