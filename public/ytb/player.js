function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function onLoad(){
  document.title = "YouTube | " + getParameterByName("title")
  document.getElementById("yout").src = "https://www.youtube.com/embed/"+getParameterByName("ytb");
}

window.onload = onLoad;
