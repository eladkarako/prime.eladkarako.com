/* window.jsons is available  */

var
  html     = document.querySelector('html')
  , body   = document.querySelector('body')
  , text   = document.querySelector('input')
  , number = 0
  , i      = 0
  , min, max, filename
  ;


//NUMBERS ONLY + control keys
text.onkeydown = function (ev) {
  ev.stopPropagation();

//  if (255 === ev.keyCode) return false; //Lenovo-FN key changes BACKSPACE.
  if (true === ev.shiftKey && (35 === ev.keyCode || 36 === ev.keyCode)) return true; //allow SHIFT for text navigation.
  if (16 === ev.keyCode || true === ev.shiftKey) return false; //forbid other SHIFT, because it changes 1 to ! .
  if (true === ev.ctrlKey) return true; //allow all CTRL+[???] combination, for example CTRL+A to select all text.

  return -1 !== [
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57
      , 13/*ENTER*/, 17/*CTRL*/, 18/*ALT*/, 35/*END*/, 36/*HOME*/, 37/*LEFT*/, 38/*UP*/, 39/*RIGHT*/, 40/*DOWN*/, 46/*DELETE*/, 8/*BACKSPACE*/, 116/*F5*/, 123/*F12*/
    ].indexOf(ev.keyCode)
};

text.onkeyup = function (ev) {
  if (13 !== ev.keyCode) return true;

  number = Number(text.value);

  for (i = 0; i < window.jsons.length; i += 3) {
    min = window.jsons[i + 0];
    max = window.jsons[i + 1];
    filename = window.jsons[i + 2];

    if (number < min) continue;
    if (number > max) continue;

    //here.. only if  min <= number <= max
    console.log(min + " ≤ " + number + " ≤ " + max + "  ⇒ " + filename);
    check_resource();
    return true;
  }

  //here... only if there is no range matching the number
  console.log("no range in resources, that is matching the number...");
};

function check_resource() {
  var xhr = new XMLHttpRequest()
    , json;

  xhr.onreadystatechange = function (ev) {
    if (4 !== ev.target.readyState) return;
    if (200 !== ev.target.status && 302 !== ev.target.status) {
      xhr.onerror();
      return;
    }
    console.log(filename + " load complete ✔");

    json = xhr.response;
    console.log(-1 !== json.indexOf(number) ? "Prime Number" : "Not A Prime Number");

    html.removeAttribute("class", "wait");
    body.style.cssText = "";
    text.removeAttribute("disabled");
    text.focus();
  };
  
  xhr.onerror = function () {
    console.log(filename + " load error ✖");

    html.removeAttribute("class", "wait");
    body.style.cssText = "";
    text.removeAttribute("disabled");
    text.focus();
  };

  xhr.responseType = "json";
  xhr.open("GET", "json/" + filename, true, "user", "password");
  xhr.setRequestHeader('X-Filename', filename);

  text.setAttribute("disabled", "true");
  body.style.cssText = "display:none;";
  html.setAttribute("class", "wait");

  json = xhr.send();

}


text.setAttribute("placeholder", window.jsons_range_min + " ≤ " + "✔" + " ≤ " + window.jsons_range_max);
console.log("enter number and press [ENTER↳] when done");
html.style.cssText = ""; //make HTML visible just now.
text.focus();
