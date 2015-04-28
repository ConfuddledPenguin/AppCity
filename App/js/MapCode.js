
var map;
var markers = [];
var Marks;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var pos;
var directionsCanvas = document.getElementById('directions-canvas').style.visibility="hidden";
var Add_marker;
var pos_callback;

function Map_initialize() {
  var mapOptions = {
    zoom: 12,
      streetViewControl: false
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
 


  Marks =[{Lat_coord: 55.78468204710858, Long_coord: -4.477302001953125,ID: 0 , Name: '2hi test 1!!!!!!'},
          {Lat_coord: 55.78468204310858, Long_coord: -4.473302001953125,ID: 1 , Name: '1hi test 1!!!!!!'},
          {Lat_coord: 55.78445204310858, Long_coord: -4.472302001953125,ID: 2 , Name: '3hi test 1!!!!!!'},
          {Lat_coord: 55.78488304310858, Long_coord: -4.478130200953125,ID: 3 , Name: '4hi test 1!!!!!!'},
          {Lat_coord: 55.78368204310858, Long_coord: -4.47832001953125,ID: 4 , Name: '5hi test 1!!!!!!'},
          {Lat_coord: 55.78268206310858, Long_coord: -4.47002001953125,ID: 5 , Name: '6hi test 1!!!!!!'}
          ];
  AddMarkers(Marks);

var centerControlDiv = document.createElement('div');
var centerControl = new CenterControl(centerControlDiv, map, pos);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
AddMarker();

}

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
    title: Marker["ID"].toString(),
    labelContent: "$425K",
       labelAnchor: new google.maps.Point(22, 0),
       labelClass: "labels", // the CSS class for the label
       labelStyle: {opacity: 0.75}
  });

 var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<p>'+
      Marker["Name"]+
      '</p>'+
      '</div>'+
      '</div>';

    var iw1 = new google.maps.InfoWindow({
       content: contentString
     });
     google.maps.event.addListener(marker, "click", function (e) { iw1.open(map, this); });
     google.maps.event.addListener(marker, "dblclick", function (e) {calcRoute(pos, LatLng);  });
   markers.push(marker);
}


function AddMarker() {
	 var listener1 = google.maps.event.addListener(map, 'click', function(event) { 

    Add_marker = new google.maps.Marker({
    position: event.latLng,
    map: map,
    draggable:true,
    title: ''
  });
    google.maps.event.removeListener(listener1);
     google.maps.event.addListener(Add_marker, "dblclick", function (e) {calcRoute(pos,  event.latLng);  });
     google.maps.event.addListener(Add_marker, "dragend", function (e,Add_marker) {
            markers.push(Add_marker);
       });

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
  return map.getBounds();
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

  /*// Set CSS for the setCenter control border
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
  setCenterUI.title = 'Click to change the center of the map';
  controlDiv.appendChild(setCenterUI);

  // Set CSS for the control interior
  var setCenterText = document.createElement('div');
  setCenterText.style.color = 'rgb(25,25,25)';
  setCenterText.style.fontFamily = 'Roboto,Arial,sans-serif';
  setCenterText.style.fontSize = '16px';
  setCenterText.style.lineHeight = '38px';
  setCenterText.style.paddingLeft = '5px';
  setCenterText.style.paddingRight = '5px';
  setCenterText.innerHTML = 'Set Center';
  setCenterUI.appendChild(setCenterText);*/

  // Setup the click event listener for 'Center':
  // simply set the map to the control's current center property.
  google.maps.event.addDomListener(goCenterUI, 'click', function() {
    var currentCenter = control.getCenter();
    map.setCenter(currentCenter);
  });

/*  // Setup the click event listener for 'Set':
  // Set the control's center to the current Map center.
  google.maps.event.addDomListener(setCenterUI, 'click', function() {
    var newCenter = map.getCenter();
    control.setCenter(newCenter);
  });*/
}


// Define setters and getters for this property
CenterControl.prototype.getCenter = function() {
  document.getElementById('map-canvas').style.visibility="hidden";
  document.getElementById('Directions').style.visibility = "hidden";
document.getElementById('directions-canvas').style.visibility = "visible";



}



google.maps.event.addDomListener(window, 'load', Map_initialize);