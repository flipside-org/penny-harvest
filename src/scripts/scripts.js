$(document).foundation();







if ($('#map').length) {


$.get('/json/local-orgs.geojson', function(geoJson){
  var map = L.mapbox.map('map', 'flipside.hgeapagi')
      .setView([40.75, -73.9], 11);
  
  map.featureLayer.setGeoJSON(geoJson);

  map.featureLayer.eachLayer(function(layer) {

    var content = '<h1>' + layer.feature.properties.title + '<\/h1>' +
        '<h2>Impact area: ' + layer.feature.properties.impact_area + '<\/h2>' +
        '<a href="' + layer.feature.properties.url + '">Read more<\/a>';
    layer.bindPopup(content);
  });




// Initialize.
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














$.get('/json/national-orgs.json', function(national_orgs){  
  
  var source = $("#national-entry").html();
  var template = Handlebars.compile(source);
  
  var page_size = 2;
  
  var render = function(orgs) {
    var html = template({"orgs" : orgs});
    $('#national-orgs').html(html);
    
    // SHow list button.
    var $cards = $(".national > li");
    if ($cards.length > page_size) {
      $('#trigger-show').removeAttr('disabled');
    }
    else {
      $('#trigger-show').attr('disabled', '');
    }
    // Hide cards.
    $(".national > li").slice(page_size).addClass('hide');
  };
  
  $('#trigger-show').click(function() {
    $(".national > li.hide").slice(0, page_size).removeClass('hide');
     
    // Enable/Disable show list button based on cards.
    if ($(".national > li.hide").length === 0) {
      // Nothing else to show. Disable button.
      $('#trigger-show').attr('disabled', '');
    }
    else {
      $('#trigger-show').removeAttr('disabled');
    }
  });
  
  
  // Initialize.
  PH_filters.init({
    // Callback for when a impact area is clicked.
    cb_click_impact_area : function() {
      var selected_impact_areas = PH_filters.get_active('impact_areas');
      
      if (selected_impact_areas.length) {
        var filtered = $.grep(national_orgs, function(v) {
          return $.inArray(v.impact_area, selected_impact_areas) >= 0;
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
            if ($.inArray(selected_keywords[i], v.keywords) == -1) {
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
    // Callback after initialization.
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
          return $.inArray(v.impact_area, selected_impact_areas) >= 0;
        });
        render(filtered);
      }
      // Keywords are last.
      else if (selected_keywords.length) {
        var filtered = $.grep(national_orgs, function(v) {
          // Keywords are exclusive, meaning that all of them must be present.
          for (var i in selected_keywords) {
            if ($.inArray(selected_keywords[i], v.keywords) == -1) {
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
