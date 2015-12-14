function validateProduce() {
  var form = document.forms["add-produce"];
  
  // Clears any previous errors
  $(form).find("div.has-error").removeClass("has-error has-feedback");
  $(form).find("span").remove();
  
  var isValid = true;
  
  // Missing checks for produce name and price becuse HTML5 handles it
  
  // Check if image has a value
  if (form["image"].value == "") {
    invalidateField(form["image"], "Missing image", '#9F4F48');
    isValid = false;
    
  } else {
    // Check if the file has an image extension
    var extension = form["image"].value.substring(
                    form["image"].value.lastIndexOf('.') + 1).toLowerCase();
    
    if (extension != "jpg" && extension != "png" && extension != "jpeg"
        && extension != "bmp" && extension != "svg" && extension != "gif") {
      
      invalidateField(form["image"], "Invalid image type", '#9F4F48');
      isValid = false;
    }
    
    // Make sure file is < 10MB because Parse can only store files smaller than that
    if(form["image"].files[0].size > 10000000) {
      invalidateField(form["image"], "Image must be < 10MB", '#9F4F48');
      isValid = false;
    }
  }
  
  return isValid;
}

function validateInfo() {
  var form = document.forms["update-info"];

  // Clears any previous errors
  $(form).find("div.has-error").removeClass("has-error has-feedback");
  $(form).find("span").remove();
  
  var isValid = true;
  
  if (form['phoneNumber'].value == '(') {
    form['phoneNumber'].value = '';
  } else if (form['phoneNumber'].value.length != 14) {
    invalidateField(form["phoneNumber"], "Invalid phone number", '#9F4F48');
    isValid = false;
  }
  
  if (form['addressFirst'].value.split(' ').length == 1) {
    invalidateField(form['addressFirst'], "Invalid street address", '9F4F48');
    isValid = false;
  }
  
  if (form['addressSecond'].value.split(' ').length != 3) {
    invalidateField(form['addressSecond'], "Invalid city, sate, zipcode", '9F4F48');
    isValid = false;
  }
  
  // Check if image has a value
  if (form["image"].value != "") {
    // Check if the file has an image extension
    var extension = form["image"].value.substring(
                    form["image"].value.lastIndexOf('.') + 1).toLowerCase();
    
    if (extension != "jpg" && extension != "png" && extension != "jpeg"
        && extension != "bmp" && extension != "svg" && extension != "gif") {
      
      invalidateField(form["image"], "Invalid image type", '#9F4F48');
      isValid = false;
    }
    // Make sure file is < 10MB because Parse can only store files smaller than that
    else if (form["image"].files[0].size > 10000000) {
      invalidateField(form["image"], "Image must be < 10MB", '#9F4F48');
      isValid = false;      
    }
  }
  return isValid;
}