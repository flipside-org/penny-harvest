$(function(){
  var $map = $('#map-container');
  if ($map.length == 1) {
    var lat = $map.attr('data-lat');
    var lng = $map.attr('data-lng');
    
    var map = L.mapbox.map($map[0], 'flipside.hgeapagi', { zoomControl: false, minZoom: 2 }).setView([lat, lng], 12);
    
    // Create a divIcon for the marker.
    var impact_area = $map.attr('data-impact-area');
    var marker_icon = L.divIcon({
      className : 'marker impact-area ' + impact_area,
      iconSize: []
    });
    
    L.marker([lat, lng], {icon : marker_icon}).addTo(map);
  }
});