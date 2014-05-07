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
    
    var source = $("#national-hub-template").html();
    var template = Handlebars.compile(source);
    
    var page_size = 20;
    
    // Render function for handlebars template. 
    var render = function(orgs) {
      var html = template({"orgs" : orgs});
      $('#national-orgs').html(html);
      
      // SHow list button.
      var $cards = $(".national > li");
      if ($cards.length > page_size) {
        $('#show-more-trigger').removeClass('disabled');
      }
      else {
        $('#show-more-trigger').addClass('disabled');
      }
      // Hide cards.
      $(".national > li").slice(page_size).addClass('hide');
    };
    
    $('#show-more-trigger').click(function(e) {
      e.preventDefault();
      var $self = $(this);
      
      if (!$self.hasClass('disabled')) {
        // Show more elements.
        $(".national > li.hide").slice(0, page_size).removeClass('hide');
         
        // Enable/Disable show list button based on cards.
        if ($(".national > li.hide").length === 0) {
          // Nothing else to show. Disable button.
          $self.addClass('disabled');
        }
        else {
          $self.removeClass('disabled');
        }
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
          render(filtered);
        }
        else {
          render(national_orgs);
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
          render(filtered);
        }
        else {
          render(national_orgs);
        }
        
      },
      // Callback after initialisation.
      cb_initialize : function() {
        var selected_keywords = PH_filters.get_active('keywords');
        var selected_impact_areas = PH_filters.get_active('impact_areas');
        
        // If nothing is active show all.
        if (!selected_keywords.length && !selected_impact_areas.length) {
          render(national_orgs);
        }
        // Priority to the impact areas. 
        else if (selected_impact_areas.length) {
          var filtered = $.grep(national_orgs, function(v) {
            return $.inArray(v.impact_area.id, selected_impact_areas) >= 0;
          });
          render(filtered);
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
          render(filtered);
        }
      },
    });
  },'json');

}




// Filters for map.
if ($('#map').length) {
  $.get('/json/local-orgs.geojson', function(geoJson){
    
    // TODO: Come back to this.
    return;
    
    var map = L.mapbox.map('map', 'flipside.hgeapagi')
        .setView([40.75, -73.9], 11);
    
    map.featureLayer.setGeoJSON(geoJson);
  
    map.featureLayer.eachLayer(function(layer) {
  
      var content = '<h1>' + layer.feature.properties.title + '<\/h1>' +
          '<h2>Impact area: ' + layer.feature.properties.impact_area + '<\/h2>' +
          '<a href="' + layer.feature.properties.url + '">Read more<\/a>';
      layer.bindPopup(content);
    });
  
  
  
  
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