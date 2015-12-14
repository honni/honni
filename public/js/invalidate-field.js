function invalidateField(field, helpText, color) {
  // Cast to jQuery object
  field = $(field);
  
  // Clear the value in the field
  field.val("");
  
  // Add invalid attributes to parent
  var parent = field.parent();
  parent.addClass("has-error has-feedback");
  parent.append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
  
  parent.append("<span class='help-block' style='color:"
                + color + "'>" + helpText + "</span>");
}