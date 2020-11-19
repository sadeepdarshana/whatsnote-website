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
  document.title = "Audio | " + getParameterByName("title")
  document.getElementById("caption").innerHTML = getParameterByName("title");
  document.getElementById("audioplayersrc").src = "https://whatsnote.live/"+getParameterByName("mp3");
  document.getElementById("audioplayer").load();
}

window.onload = onLoad;