$(function() {
  
  $('[data-modal-id]').click(function(e) {
    e.preventDefault();
    var id = $(this).attr('data-modal-id');
    
    $('#' + id).addClass('revealed');
  });
  
  $('.modal-wrapper').click(function(e) {
    // Prevent children from triggering this.
    if(e.target == e.currentTarget) {
      $(this).removeClass('revealed');
    }
  });
  $('.modal-wrapper .dismiss').click(function(e) {
      e.preventDefault();
      $(this).closest('.modal-wrapper').removeClass('revealed');
  });
});
