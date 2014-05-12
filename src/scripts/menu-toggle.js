$(document).ready(function() {
  $('.menu-title .toggle').click(function(event) {
    event.stopPropagation();
    event.preventDefault();

    $('.menu-wrapper').toggleClass('visible');
    // Hide other open dropdowns.
    $('.action-dropdown').removeClass('revealed');
    $('a[data-dropdown="action-bttn"]').removeClass('current');
  });

  $(document).click(function() {
    $('.menu-wrapper').removeClass('visible');
  });
});