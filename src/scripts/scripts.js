$(document).foundation();


$(function() {
  
  var $filters = $('.filters');  
  if ($filters.length) {    
    // Extend filters with some methods.
    $filters = $.extend($filters, {
      open : function () {
        $(this).animate({
          bottom: 0
        }, 250);
      },
      
      close : function () {
        var $self = $(this);
        // Leave 8px.
        var bottom_distance = $self.height() - 8;
        $self.animate({
          bottom: -bottom_distance
        }, 250);
      },
      
    });
    
    // Click listener.
    var $toggle_btn = $('.filters-toggle');
    $toggle_btn.click(function(e) {
      e.preventDefault();
      var $self = $(this);
      
      if ($self.hasClass('on')) {
        $self.removeClass('on');
        createCookie('filter_panel', 'close', 10);
        $filters.close();
      }
      else {
        $self.addClass('on');
        createCookie('filter_panel', 'open', 10);
        $filters.open();
      }
    });
    
    // Open and close based on cookies.
    var filter_panel = readCookie('filter_panel');
    if (filter_panel !== null) {
      if (filter_panel == 'open') {
        $filters.open();
        $toggle_btn.addClass('on');
      }
      else {
        $filters.close();
        $toggle_btn.removeClass('on');
      }
    }
  }
});