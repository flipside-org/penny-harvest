$(document).ready(function(){
  // Other dropdowns triggered by buttons.
  $('a[data-dropdown="action-bttn"]').click(function(event) {
    event.stopPropagation();
    event.preventDefault();
    
    var $self = $(this);
    var $dropdown = $self.siblings('.action-dropdown');
    
    // Hide others.
    $('.action-dropdown').not($dropdown).removeClass('revealed');
    $('a[data-dropdown="action-bttn"]').not($self).removeClass('current');
    
    $self.toggleClass('current');
    $dropdown.toggleClass('revealed');
  });

  $(document).click(function() {
    $('.action-dropdown').removeClass('revealed');
    $('a[data-dropdown="action-bttn"]').removeClass('current');
  });

});