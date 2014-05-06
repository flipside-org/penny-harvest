$(function(){
  var $map = $('#map-container');
  if ($map.length == 1) {
    var lat = $map.attr('data-lat');
    var lng = $map.attr('data-lng');
    
    var map = L.mapbox.map($map[0], 'flipside.hgeapagi', { zoomControl: false, minZoom: 2 }).setView([lat, lng], 12);
    
    L.marker([lat, lng]).addTo(map);
  }
});