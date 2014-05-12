$(document).foundation();

$('a.disabled, bttn.disabled').click(function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
});