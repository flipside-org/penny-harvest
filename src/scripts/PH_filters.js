(function($) {
  $.fn.activate = function() {
    return this.addClass('on');
  };
  $.fn.activateToggle = function() {
    return this.toggleClass('on');
  };
  $.fn.deactivate = function() {
    return this.removeClass('on');
  };
  $.fn.is_active = function() {
    return this.hasClass('on');
  };
  $.fn.getFilterId = function() {
    return this.attr('data-filter-id');
  };
  $.fn.getByFilterId = function(id) {
    return this.filter('[data-filter-id="' + id + '"]');
  };
  $.fn.getActivated = function() {
    return this.filter('.on');
  };
})(jQuery);

/**
 * Static object to setup filters.
 */
var PH_filters = {
  // Default settings.
  settings : {
    cb_click_impact_area : function() {},
    cb_click_keyword : function() {},
    cb_initialize : function() {},
  },
  
  // Store the impact_area filters
  impact_areas : [],
  // Store keywords filters
  keywords : [],
  
  /**
   * Init function.
   */
  init : function(options) {
    // Extend settings
    PH_filters.settings = $.extend({}, PH_filters.settings, options);
    
    // Get impact_areas filters
    PH_filters.impact_areas = $('[data-filter-type="impact_area"]');
    // Get keywords filters
    PH_filters.keywords = $('[data-filter-type="keyword"]');
    
    // Click listeners to activate.
    PH_filters.impact_areas.click(function(e) {
      e.preventDefault();
      $(this).activateToggle();
      // Unselect all keywords.
      PH_filters.keywords.deactivate();
      
      PH_filters.settings.cb_click_impact_area.apply(this);
      
      // Save state.
      PH_filters.save_to_url();
    });
    
    PH_filters.keywords.click(function(e) {
      e.preventDefault();
      $(this).activateToggle();
      // Unselect all impact areas.
      PH_filters.impact_areas.deactivate();
      
      PH_filters.settings.cb_click_keyword.apply(this);
      
      // Save state.
      PH_filters.save_to_url();
    });
    
    // Load filters from url.
    PH_filters.load_from_url();
    
    PH_filters.settings.cb_initialize();
  },
  
  /**
   * Returns the active filters of the given type in an array.
   * Only returns the filter id
   * @param string type
   *   Filter type.
   * @return array
   *   Filter id
   */
  get_active: function(type) {
    // Empty jQuery object to start with.
    var active = [];
    switch (type) {
      case 'impact_areas':
        PH_filters.impact_areas.getActivated().each(function() {
          active.push($(this).getFilterId());
        });
        break;
      case 'keywords':
        PH_filters.keywords.getActivated().each(function() {
          active.push($(this).getFilterId());
        });
        break;
    }
    return active;
  },
  
  /**
   * Save application state to the url in Base64 encoded format.
   */
  save_to_url: function() {
    // Use keys as small as possible to shrink encoded string.
    var data = {
      // impact_areas
      i: PH_filters.get_active('impact_areas'),
      // keywords
      k: PH_filters.get_active('keywords')
    };
    
    if (data.i.length === 0 && data.k.length === 0) {
      location.hash = '!';
    }
    else {
      // Encode and save to URL.
      var encoded = Base64.encodeObj(data);
      location.hash = encoded;
    }
    
  },
  
  /**
   * Loads the application status from the Url.
   */
  load_from_url: function() {
    if (!location.hash || location.hash == "#!")
      return false;
    
    // Load hash from url.
    var hash = location.hash.substring(1);
    var data = Base64.decodeObj(hash);
    
    if (data === null)
      return false;
    
    // Reset app status.
    // Impact areas.
    $.each(data.i, function(i, v) {
      PH_filters.impact_areas.getByFilterId(v).activate();
    });
    
    $.each(data.k, function(i, v) {
      PH_filters.keywords.getByFilterId(v).activate();
    });
  },
};