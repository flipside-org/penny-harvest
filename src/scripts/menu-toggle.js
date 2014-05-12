$(document).ready(function() {
  $('.toggle').click(function(event) {
    event.stopPropagation();
    event.preventDefault();

    $('.menu-wrapper').toggleClass('visible');
  });

  $(document).click(function() {
    $('.menu-wrapper').removeClass('visible');
  });
});