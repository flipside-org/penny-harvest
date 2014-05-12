$(function() {

// Setup the filter panel and its open/close animation.
// It also includes cookies to remember the last state.
var $filters = $('.filters');
if ($filters.length) {
  // Extend filters with some methods.
  $filters = $.extend($filters, {
    open : function () {
      $(this).animate({bottom: 0}, 250);
    },
    close : function () {
      var $self = $(this);
      // Leave 8px.
      var bottom_distance = $self.height() - 8;
      $self.animate({bottom: -bottom_distance}, 250);
    }
  });
  
  // Click listener.
  var $toggle_btn = $('.filters-toggle');
  $toggle_btn.click(function(e) {
    e.preventDefault();
    var $self = $(this);
    
    if ($self.isActive()) {
      createCookie('filter_panel', 'close', 10);
      $self.deactivate();
      $filters.close();
    }
    else {
      createCookie('filter_panel', 'open', 10);
      $self.activate();
      $filters.open();
    }
  });
  
  // Open and close based on cookies.
  var filter_panel = readCookie('filter_panel');
  if (filter_panel !== null) {
    if (filter_panel == 'open') {
      $filters.open();
      $toggle_btn.activate();
    }
    else {
      $filters.close();
      $toggle_btn.deactivate();
    }
  }
}

// Filters for map.
if ($('#national-orgs').length) {
  $.get('/json/national-orgs.json', function(national_orgs){
    
    // Render function for handlebars template. 
    function renderer(orgs) {
      
      this.page_size = 20;
      this.current_page = 0;
      this.render_batch = null;
      
      var source = $("#national-hub-template").html();
      this.template = Handlebars.compile(source);
      
      this.content_holder = $('#national-orgs .national');
      this.load_more_button = $('#show-more-trigger');
      
      this.render = function(orgs) {
        // If orgs is null means that we are rendering a previous batch.
        // This is used by the load more button.
        if (orgs === null) {
          orgs = render_batch;
        }
        else {
          // When there are new orgs to render, reset everything.
          this.reset();
          render_batch = orgs;
        }
        
        var start = this.page_size * this.current_page;
        var end = start + this.page_size;
        var to_render = orgs.slice(start, end);
        
        var html = this.template({"orgs" : to_render});
        this.content_holder.append(html);
        
        // Check if next rendering would yield results.
        // If not, disable the button.
        var start = this.page_size * (this.current_page + 1);
        var end = start + this.page_size;
        var to_render = orgs.slice(start, end);
        if (to_render.length == 0) {
          this.load_more_button.addClass('disabled');
        }
        
      };
      
      this.reset = function() {
        this.current_page = 0;
        this.load_more_button.removeClass('disabled');
        this.content_holder.html('');
      };
     
      this.render_next = function() {
        this.current_page++;
        this.render(null);
      };
    };
    
    var renderer = new renderer();
    
    $('#show-more-trigger').click(function(e) {
      e.preventDefault();
      var $self = $(this);
      
      if (!$self.hasClass('disabled')) {
        // Show more elements.
        renderer.render_next();
      }
      
    });
    
    
    // Initialise.
    PH_filters.init({
      // Callback for when a impact area is clicked.
      cb_click_impact_area : function() {
        var selected_impact_areas = PH_filters.get_active('impact_areas');
        
        if (selected_impact_areas.length) {
          var filtered = $.grep(national_orgs, function(v) {
            return $.inArray(v.impact_area.id, selected_impact_areas) >= 0;
          });
          renderer.render(filtered);
        }
        else {
          renderer.render(national_orgs);
        }
        
      },
      // Callback for when a keyword is clicked.
      cb_click_keyword : function() {
        var selected_keywords = PH_filters.get_active('keywords');
        
        if (selected_keywords.length) {
          var filtered = $.grep(national_orgs, function(v) {
            // Keywords are exclusive, meaning that all of them must be present.
            for (var i in selected_keywords) {
              if ($.inArray(selected_keywords[i].id, v.keywords) == -1) {
                return false;
              }
            }
            return true;
          });
          renderer.render(filtered);
        }
        else {
          renderer.render(national_orgs);
        }
        
      },
      // Callback after initialisation.
      cb_initialize : function() {
        var selected_keywords = PH_filters.get_active('keywords');
        var selected_impact_areas = PH_filters.get_active('impact_areas');
        
        // If nothing is active show all.
        if (!selected_keywords.length && !selected_impact_areas.length) {
          renderer.render(national_orgs);
        }
        // Priority to the impact areas. 
        else if (selected_impact_areas.length) {
          var filtered = $.grep(national_orgs, function(v) {
            return $.inArray(v.impact_area.id, selected_impact_areas) >= 0;
          });
          renderer.render(filtered);
        }
        // Keywords are last.
        else if (selected_keywords.length) {
          var filtered = $.grep(national_orgs, function(v) {
            // Keywords are exclusive, meaning that all of them must be present.
            for (var i in selected_keywords) {
              if ($.inArray(selected_keywords[i].id, v.keywords) == -1) {
                return false;
              }
            }
            return true;
          });
          renderer.render(filtered);
        }
      },
    });
  },'json');

}




// Filters for map.
if ($('#map').length) {
  $.get('/json/local-orgs.geojson', function(geoJson){
    
    var map = L.mapbox.map('map', 'flipside.hgeapagi', {
      zoomControl: false,
      minZoom : 3,
      maxZoom : 18,
      maxBounds: L.latLngBounds([-90, -180], [90, 180])
    }).setView([40.75, -73.9], 11);
    
    // Customise marker cluster icons.
    var markers = new L.MarkerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: function(cluster) {
        return new L.DivIcon({
          className : 'marker cluster',
          iconSize: [],
          html: cluster.getChildCount()
        });
      }
    });
    
    // Loop over features to create markers.
    $.each(geoJson.features, function(i, feature) {
      var props = feature.properties;
      
      // Create a divIcon for the marker.
      var marker_icon_classes = 'marker impact-area ' + props.impact_area.class;
      var marker_icon = L.divIcon({
        className : marker_icon_classes,
        iconSize: [],
        popupAnchor : [0, -30]
      });
      
      var marker = L.marker(feature.geometry.coordinates, {
        title : props.title,
        icon : marker_icon
      });
      
      // Marker popup.
      var popup = '<article><header><h1 class="hd-xs">' + props.title + '</h1></header>' +
        '<div class="content">' + props.content + '</div>' +
        '<footer><a href="' + props.url + '" class="go-link">Learn more about us</a></footer></article>';
      marker.bindPopup(popup);
      
      // Add to cluster.
      markers.addLayer(marker);
    });
    
    // Add cluster layer to map.
    map.addLayer(markers);
    
    // Geocode object.
    function Geocoder(key) {
      this.key = key;
      this.url = 'http://www.mapquestapi.com/geocoding/v1/address';
      
      this.query = function(location, callback) {
        $.get(this.url, {
          key : this.key,
          location : location
        }, function(res) {
          if (res.results[0].locations.length > 0) {
            callback(true, res.results[0].locations[0]);
          }
          else {
            callback(false, []);
          }
        });
      };
    }
    
    var geocoder = new Geocoder('Fmjtd|luur290y2h%2Cr5%3Do5-90zl54');
    
    // Listener for form submission.
    $('.geocoder form').submit(function(event) {
      event.preventDefault();
      
      var queryString = $('.map-geocoder-input', this).val();
      geocoder.query(queryString, function(success, location) {
        if (success) {
          var lat = location.latLng.lat;
          var lng = location.latLng.lng;
          var zoom = 1;
          
          switch (location.geocodeQuality) {
            case 'COUNTRY':
              zoom = 7;
            break;
            case 'CITY':
              zoom = 14;
            break;
            case 'ADDRESS':
              zoom = 17;
            break;
            case 'STREET':
              zoom = 17;
            break;
          }
          map.setView([lat, lng], zoom, { animate : true });
        }
      });
    });
    
    // Geolocation.
    if (!navigator.geolocation) {
      $('.map-geocoder-locate').remove();
    }
    else {
      // Click for locate button.
      $('.map-geocoder-locate').click(function(event) {
        event.preventDefault();
        $(this).addClass('locating');
        
        map.locate();
      });
      
      // Once we've got a position, zoom and center the map
      // on it.
      map.on('locationfound', function(e) {
        $('.map-geocoder-locate').removeClass('locating');
        map.fitBounds(e.bounds);
      });
      
      // If the user chooses not to allow their location
      // to be shared.
      map.on('locationerror', function() {
        $('.map-geocoder-locate').removeClass('locating');
      });
    }
    
  // TODO: Come back to this.
  return;
  
  // Initialise.
  PH_filters.init({
    // Callback for when a impact area is clicked.
    cb_click_impact_area : function() {
      
      var selected_impact_areas = PH_filters.get_active('impact_areas');
      map.featureLayer.setFilter(function(f) {
        // When no impact area return all.
        if (selected_impact_areas.length)
          return $.inArray(f.properties.impact_area, selected_impact_areas) >= 0;
        else
          return true;
      });
        
    },
    // Callback for when a keyword is clicked.
    cb_click_keyword : function() {
      
      var selected_keywords = PH_filters.get_active('keywords');
      map.featureLayer.setFilter(function(f) {
        // When no impact area return all.
        if (selected_keywords.length) {
          // Keywords are exclusive, meaning that all of them must be present.
          for (var i in selected_keywords) {
            if ($.inArray(selected_keywords[i], f.properties.keywords) == -1) {
              return false;
            }
          }
        }
        return true;
      });
    },
    
    // Callback after initialization.
    cb_initialize : function() {
      var selected_keywords = PH_filters.get_active('keywords');
      var selected_impact_areas = PH_filters.get_active('impact_areas');
      
      // If nothing is active show all.
      if (!selected_keywords.length && !selected_impact_areas.length) {
        map.featureLayer.setFilter(function(f) { return true; });
      }
      // Priority to the impact areas. 
      else if (selected_impact_areas.length) {
        map.featureLayer.setFilter(function(f) {
          return $.inArray(f.properties.impact_area, selected_impact_areas) >= 0;
        });
      }
      // Keywords are last.
      else if (selected_keywords.length) {
        map.featureLayer.setFilter(function(f) {
          // Keywords are exclusive, meaning that all of them must be present.
          for (var i in selected_keywords) {
            if ($.inArray(selected_keywords[i], f.properties.keywords) == -1) {
              return false;
            }
          }
          return true;
        });
      }
    },
  });
  },'json');

}

});