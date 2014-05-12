$(document).ready(function() {
  $('.menu-title .toggle').click(function(event) {
    event.stopPropagation();
    event.preventDefault();

    $('.menu-wrapper').toggleClass('visible');
  });

  $(document).click(function() {
    $('.menu-wrapper').removeClass('visible');
  });
});