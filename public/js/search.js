$("#filter-results").click(function() {
  $("#filters").slideToggle();
});

// sets the sortby input's value so that it's known when filter-form is submitted
function setSortBy(sortOption) {
  document.getElementById('sortby').value = sortOption;
  filterResults();
}

function toggleProduceType(id) {
  var produceType = document.getElementById(id);
  
  // Toggle the produce type
  produceType.checked = !produceType.checked;

  filterResults();
}

function clearProduceTypeFilter() {
  var produceTypes = $("#produce-filter :input:checkbox");
  
  // Unchecks all of the produce type filters
  for (var i=0; i < produceTypes.length; i++) {
    produceTypes[i].checked = false;
  }
  
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
