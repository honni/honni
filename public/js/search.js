$("#filter-results").click(function() {
  $("#filters").slideToggle();
});

function setSortBy(sortOption) {
  document.getElementById('sortby').value = sortOption;
  filterResults();
}

function toggleProducerType(id) {
  var producerType = document.getElementById(id);
  
  // Toggle the producer type
  producerType.checked = !producerType.checked;

  filterResults();
}

// Submits the form with all of the filter options
function filterResults() {
  document.getElementById('filter-form').submit();
}