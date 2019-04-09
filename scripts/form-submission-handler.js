/*
  This program is mostly copied from https://github.com/dwyl/html-form-send-email-via-google-script-without-server
  Check their tutorial for more detail.
*/

// get all data in form and return object
function getFormData() {
  var elements = document.getElementById("gform").elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append
                                              // the current checked value to
                                              // the end of it, along with
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space
                                  // from the  string to make the output
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });
  //console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var body = document.querySelector('.modal-body');
  var formButton = document.getElementById('form-submit');
  var data = getFormData();         // get the values submitted in the form
  var url = event.target.action;
  var xhr = new XMLHttpRequest();
  // body.style.display = 'none'; // hide form
  // formButton.style.display= "none";
  // document.getElementById('thankyou_message').style.display = 'block';
  // document.querySelector(".modal-title").textContent="DONE!";
  xhr.open('post', url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
      //console.log( xhr.status, xhr.statusText );
      //console.log(xhr.responseText);
      return;
  };
  // url encode form data for sending as post data
  var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  }).join('&');
  xhr.send(encoded);
}

function initForm(event) {
  document.querySelector(".modal-title").textContent="Notify me when available";
  document.querySelector('.modal-body').style.display = 'block';
  document.getElementById('form-submit').style.display = 'inline';
  document.getElementById('thankyou_message').style.display = 'none';
}

function loaded() {
  //console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  var notify = document.querySelectorAll('.notify-btn');
  form.addEventListener("submit", handleFormSubmit, false);
  for (let i = 0; i<notify.length; i++) {
    btn=notify[i];
    btn.addEventListener("click",initForm);
  }
}

window.onload = loaded;
