function validateLogin() {
  var form = document.forms["login"];
  
  // Clears any previous errors
  $(form).find("div.has-error").removeClass("has-error has-feedback");
  $(form).find("span").remove();
  
  var isValid = true;
  
  // Check if email has a value
  if (form["email"].value == "") {
    invalidateField(form["email"], "Missing email");
    isValid = false;
    
  } else {
    // Check if email is valid
    var regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    if (!form["email"].value.match(regex)) {
      invalidateField(form["email"], "Invalid email address");
      isValid = false;
    }
  }
  
  // Check if password is missing
  if (form["password"].value == "") {
    invalidateField(form["password"], "Missing password");
    isValid = false;
  }
  
  return isValid;
}

/* There is a lot of unesseary checks because HTML5
   can check if a field has a value */
function validateSignup() {
  var form = document.forms["signup"];
  
  // Clears any previous errors
  $(form).find("div.has-error").removeClass("has-error has-feedback");
  $(form).find("span").remove();
  
  var isValid = true;
      
  // Check if email has a value
  if (form["email"].value == "") {
    invalidateField(form["email"], "Missing email");
    isValid = false;
    
  } else {
    // Check if email is valid
    var regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    if (!form["email"].value.match(regex)) {
      invalidateField(form["email"], "Invalid email address");
      isValid = false;
    }
  }
  
  // Check if zipcode has a value
  if (form["zipcode"].value == "") {
    invalidateField(form["zipcode"], "Missing ZIP code");
    isValid = false;
    
  } else {
    // Check if zipcode is valid
    var regex = /^\d{5,5}(-\d{4,4})?$/;
    if (!form["zipcode"].value.match(regex)) {
      invalidateField(form["zipcode"], "Invalid ZIP code");
    }
  }
  
  // Check if both passwords are missing
  if (form["password"].value == "" && form["confirm-password"].value == "") {
    invalidateField(form["password"], "Missing password");
    invalidateField(form["confirm-password"], "Missing password confirmation");
    isValid = false;
  }
  // password is empty and confirmation is not empty
  else if (form["password"].value == "" && form["confirm-password"].value != "") {
    invalidateField(form["password"], "Missing password");
    invalidateField(form["confirm-password"], "Passwords don't match");
    isValid = false;
  }
  // password is not empty and confirmation is empty
  else if (form["password"].value != "" && form["confirm-password"].value == "") {
    invalidateField(form["password"], "Passwords don't match");
    invalidateField(form["confirm-password"], "Missing password");
    isValid = false;
  }
  // Check if passwords don't match  
  else if (form["password"].value != form["confirm-password"].value) {
    invalidateField(form["password"], "Passwords don't match");
    invalidateField(form["confirm-password"], "Passwords don't match");
    isValid = false;
  }
  
  // Check if they selected a producer type
  // This is never true becuase of HTML5 validation
  if (form["producerType"].value == "") {
    isValid = false;
  }
  
  return isValid;
}

function invalidateField(field, helpText) {
  // Cast to jQuery object
  field = $(field);
  
  // Clear the value in the field
  field.val("");
  
  // Add invalid attributes to parent
  var parent = field.parent();
  parent.addClass("has-error has-feedback");
  parent.append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
  
  parent.append("<span class='help-block' style='color:#fff'>" + helpText + "</span>");
}