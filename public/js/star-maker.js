// Makes stars either visible or editable.
// id - unique id for star group on the page (f0oBaR)
// isDisabled - if the user can select a rating or not (true/false)
// rating - the numeric rating (0.5, 1, ... , 4.5, 5)
function makeStars(id, isDisabled, rating){
  var titles = ['Awesome', 'Pretty good', 'Pretty good', 'Meh', 'Meh',
                'Kinda bad', 'Kinda bad', 'Not good', 'Sucks big time',
                'Sucks big time'];
  
  var result = '';
  
  for (var i=0; i < 10; i++) {
    var ratingFromIndex = ((10 - i) / 2.0);
    
    // Creates the input field
    result += '<input type="radio" id="star' + ratingFromIndex + '-' + id;
    result += '"name="rating-' + id + '" value="' + ratingFromIndex + '"';
    
    // Disables the input field
    if (isDisabled) {
      result += ' disabled';
    }
    
    // Check the star if it's the rating
    if (rating == ratingFromIndex) {
      result += ' checked';
    }
    
    // Closes the input field and creates the label
    result += '/><label class="';
    
    // Alternate half and full stars
    if (i % 2) {
      result += 'half';
    } else {
      result += 'full';
    }
    
    // If the rating is disabled, then show the rating title for all stars
    if (isDisabled) {
      console.log("index: " + (10 - (rating * 2)) + "\tvalue: " + titles[10 - (rating * 2)]);
      result += '" for="star' + ratingFromIndex + '-' + id + '" title="';
      result += titles[10 - (rating * 2)] + ' - ' + rating + ' stars"></label>';
    }
    else {
      result += '" for="star' + ratingFromIndex + '-' + id + '" title="';
      result += titles[i] + ' - ' + ratingFromIndex + ' stars"></label>';
    }
  }
  
  console.log(result);
 
  return result;
}

module.exports = makeStars;