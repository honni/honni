function validateReview() {
  var form = document.forms["review"];
  
  var isValid = true;
  
  // If the rating doesn't have a value
  if (!form['rating-review'].value) {
    // If there isn't help text already add some
    if (!document.getElementById("rating-help-text")) {
      var helpElement = document.createElement("h4");
      helpElement.id = "rating-help-text";
      helpElement.style.float = "right";
      helpElement.appendChild(document.createTextNode("Must select a rating"));

      document.getElementById("rating-group").appendChild(helpElement);
    }
    
    isValid = false;
  }
  
  return isValid;
}