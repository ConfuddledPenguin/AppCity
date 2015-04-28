
var map;
var markers = [];
var markers_ID = [];
var markers_Info  = [];
var Marks;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var pos;
// var directionsCanvas = document.getElementById('directions-canvas').style.visibility="hidden";
var Add_marker;

var apiBase2 = "https://devweb2014.cis.strath.ac.uk/~gvb12182/CS317/AppCity/api/v1/";
var placesFetched2 = 0;



function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function clearMarkers() {
  setAllMap(null);
}
function showMarkers() {
  setAllMap(map);
}
function deleteMarkers() {
  clearMarkers();
  markers = [];
}






function AddMarkers(Marks) {console.log(Marks.length);
for (var i = Marks.length - 1; i >= 0; i--) {
  AddMarkerManually(Marks[i]);
};
}

function AddMarkerManually(Marker) {
   
 var LatLng = new google.maps.LatLng(Marker["Lat_coord"],Marker["Long_coord"]);
    marker = new google.maps.Marker({
    position: LatLng,
    map: map,
    draggable:false,
    title: Marker["Name"],
    labelContent: "$425K",
       labelAnchor: new google.maps.Point(22, 0),
       labelClass: "labels", // the CSS class for the label
       labelStyle: {opacity: 0.75}
  });



 var contentString = 
                      '<div  "class="box placebox" placeid="1">'+
                        '<a  href="#" class="small-placebox-1">'+
                          '<img =  src="'+Marker["Image"]+'" alt="Image of Place 2" '+
                        '</a>'+
                        '<a href="#" class="small-placebox-1">'+
                          '<div  class="info clearfix">'+
                            '<h2>'+Marker["Name"]+'</h2>'+
                            '<p>'+Marker["Short_des"]+'</p>'+
                          '</div>'+
                        '</a>'+
                      '</div>';

    var iw1 = new google.maps.InfoWindow({
       content: contentString
     });
     google.maps.event.addListener(marker, "click", function (e) { 
        iw1.open(map, this); 
        console.log(e);
      });
     google.maps.event.addListener(marker, "dblclick", function (e) {calcRoute(pos, LatLng);  });
   markers_ID.push(Marker["ID"])
   markers_Info[Marker["ID"]] = Marker;
   markers[Marker["ID"]] = marker;
}


function AddMarker() {
	 var listener1 = google.maps.event.addListener(map, 'click', function(event) { 

    Add_marker = new google.maps.Marker({
    position: event.latLng,
    map: map,
    draggable:false,
    title: ''
  });
    google.maps.event.removeListener(listener1);
     google.maps.event.addListener(Add_marker, "dblclick", function (e) {calcRoute(pos,  event.latLng);  });
     

    markers.push(Add_marker);
});
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
  pos = new google.maps.LatLng(55.861,-4.2435);
  if (typeof pos_callback !== 'undefined') {
          pos_callback();
  }
  var options = {
    map: map,
    position: pos,
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);

   /*AddMarker();*/
} 

function getBounds(){
  var temp = map.getBounds();
  
  return {tl_lat:temp["Da"]["j"],
          tl_long:temp["va"]["j"],
          br_lat:temp["Da"]["k"],
          br_long:temp["va"]["k"],
          offset: 1};
}


function calcRoute(start, end) {

  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      document.getElementById('Directions').style.visibility = "visible";
      directionsDisplay.setDirections(response);
    }
  });
}
function CenterControl(controlDiv, map, center) {

  // We set up a variable for this since we're adding event listeners later.

  var control = this;

  // Set the center property upon construction
  control.center_ = center;
  controlDiv.style.clear = 'both';

  // Set CSS for the control border
  var goCenterUI = document.createElement('div');
  goCenterUI.style.backgroundColor = '#fff';
  goCenterUI.style.border = '2px solid #fff';
  goCenterUI.style.borderRadius = '3px';
  goCenterUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  goCenterUI.style.cursor = 'pointer';
  goCenterUI.style.float = 'left';
  goCenterUI.style.marginBottom = '22px';
  goCenterUI.style.textAlign = 'center';
  goCenterUI.style.visibility = 'hidden';
  goCenterUI.title = 'Click for directions';
  goCenterUI.id = 'Directions';
  controlDiv.appendChild(goCenterUI);

  // Set CSS for the control interior
  var goCenterText = document.createElement('div');
  goCenterUI.style.color = 'rgb(25,25,25)';
  goCenterUI.style.fontFamily = 'Roboto,Arial,sans-serif';
  goCenterUI.style.fontSize = '16px';
  goCenterUI.style.lineHeight = '38px';
  goCenterUI.style.paddingLeft = '5px';
  goCenterUI.style.paddingRight = '5px';
  goCenterUI.innerHTML = 'Directions';
  goCenterUI.appendChild(goCenterText);

  // Set CSS for the setCenter control border
  var setCenterUI = document.createElement('div');
  setCenterUI.style.backgroundColor = '#fff';
  setCenterUI.style.border = '2px solid #fff';
  setCenterUI.style.borderRadius = '3px';
  setCenterUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  setCenterUI.style.cursor = 'pointer';
  setCenterUI.style.float = 'left';
  setCenterUI.style.marginBottom = '22px';
  setCenterUI.style.marginLeft = '12px';
  setCenterUI.style.textAlign = 'center';
  setCenterUI.title = 'Click to Add Locations to the map';
  controlDiv.appendChild(setCenterUI);

  // Set CSS for the control interior
  var setCenterText = document.createElement('div');
  setCenterText.style.color = 'rgb(25,25,25)';
  setCenterText.style.fontFamily = 'Roboto,Arial,sans-serif';
  setCenterText.style.fontSize = '16px';
  setCenterText.style.lineHeight = '38px';
  setCenterText.style.paddingLeft = '5px';
  setCenterText.style.paddingRight = '5px';
  setCenterText.innerHTML = 'Add Locations';
  setCenterUI.appendChild(setCenterText);

  // Setup the click event listener for 'Center':
  // simply set the map to the control's current center property.
  google.maps.event.addDomListener(goCenterUI, 'click', function() {
    var currentCenter = control.getCenter();
    map.setCenter(currentCenter);
  });

  // Setup the click event listener for 'Set':
  // Set the control's center to the current Map center.
  google.maps.event.addDomListener(setCenterUI, 'click', function() {
    AddMarker();
  });
}


// Define setters and getters for this property
CenterControl.prototype.getCenter = function() {
  document.getElementById('map-canvas').style.visibility="hidden";
  document.getElementById('Directions').style.visibility = "hidden";
document.getElementById('directions-canvas').style.visibility = "visible";



}





function addPlacesInArea(){

    /*var sauce = $("#place-template").html();
    var template = Handlebars.compile(sauce);*/

    $.ajax({
      url: apiBase2 + 'Place?request=getPlacesArea',
      type: 'GET',
      data: getBounds()
    })
    .done(function(result) {
      console.log(result);
      if(result["error"]){
        if(result["error"] == true){
          alert("Fiddlesticks, I have gone wrong, sorry about that...");
          return;
        }
      }

      if(result["noPlaces"]){
        if(result["noPlaces"] == true){
          if(placesFetched2 == 0){
            alert("Sorry no places nearby, try adding some?");
          }
          return;
        }
      }
result.push({ ID: "43",
                          Name: "gfhbfgb",
                          Short_des: "grgsdbfgsv4444rgdr",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.81144851119163",
                          Long_coord: "-4.316465440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat4.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "33",
                          Name: "vsfgbvfdvdasvsdrg",
                          Short_des: "aef",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.82144451119163",
                          Long_coord: "-4.326464440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat3.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "23",
                          Name: "faefae",
                          Short_des: "23r23",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.83144751119163",
                          Long_coord: "-4.336475440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat2.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "13",
                          Name: "vsfgbsdsfr3243drg",
                          Short_des: "grgsdf34rf1324f34rgdr",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.84144151119163",
                          Long_coord: "-4.346415440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat1.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "134",
                          Name: "vsfgbsdsfr3243drg",
                          Short_des: "grgsdf34rf1324f34rgdr",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.12744151119163",
                          Long_coord: "-4.177415440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat1.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "43",
                          Name: "vsfgbsdsfr3243drg",
                          Short_des: "grgsdf34rf1324f34rgdr",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.12544151119163",
                          Long_coord: "-4.124415440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat1.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "73",
                          Name: "vsfgbsdsfr3243drg",
                          Short_des: "grgsdf34rf1324f34rgdr",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.12644151119163",
                          Long_coord: "-4.117415440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat1.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
result.push({ ID: "42",
                          Name: "vsfgbsdsfr3243drg",
                          Short_des: "grgsdf34rf1324f34rgdr",
                          Long_des: "bvstfgbhfdbstgdrsfgre",
                          Av_Rating: "434234",
                          Lat_coord: "55.12444151119163",
                          Long_coord: "-4.122415440624988",
                          Address: "h65364h536h35",
                          Image: "http://animalia-life.com/data_images/cat/cat1.jpg",
                          Link: "http://animalia-life.com/data_images/cat",
                          Phone: "h56h536h53tttt"})
      var count = 0;
      $.each(result, function(index, val) {

        if (markers_ID.indexOf(parseInt(val["ID"]))<0) {
          count++;
       };
      });
      placesFetched2 += count;

      $.each(result, function(index, val) {
        
        /*console.log(val+" : "+markers_ID.indexOf(parseInt(place["ID"]))+" : "+markers_ID);*/

        place = val;
        if (markers_ID.indexOf(parseInt(place["ID"]))<0) {
          /*console.log(val);*/
          var context = { ID: parseInt(place["ID"]),
                          Name: place["Name"],
                          Short_des: place["Short_des"],
                          Long_des: val["Long_des"],
                          Av_Rating: parseInt(val["Av_Rating"]),
                          Lat_coord: val["Lat_coord"],
                          Long_coord: val["Long_coord"],
                          Address: val["Address"],
                          Image: val["Image"],
                          Link: val["Link"],
                          Phone: val["Phone"]};
          
        AddMarkerManually(context);
          
       };
      });
    })
    .fail(function() {
      console.log("error");
    })
    .always(function(){
      fetchingMoreData = false;
    });   
  }






function Map_initialize() {
  var myStyles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
];
  var mapOptions = {
    zoom: 12,
      streetViewControl: false,
      styles: myStyles
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);
directionsDisplay.setPanel(document.getElementById('directions-canvas'));
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
if (typeof pos_callback !== 'undefined') {
          pos_callback();
      }
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
 


   

var centerControlDiv = document.createElement('div');
var centerControl = new CenterControl(centerControlDiv, map, pos);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
 google.maps.event.addListener(map, 'bounds_changed', function() {
addPlacesInArea();
});
}









google.maps.event.addDomListener(window, 'load', Map_initialize);