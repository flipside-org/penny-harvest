$(document).ready(function() {
  $('.menu-title .toggle').click(function(event) {
    event.stopPropagation();
    event.preventDefault();

    $('.menu-wrapper').toggleClass('visible');
    $('.action-dropdown').removeClass('revealed');
  });

  $(document).click(function() {
    $('.menu-wrapper').removeClass('visible');
  });
});