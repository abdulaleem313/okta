var windHref=   window.location.href;
function showRegisterBtn() {
    var referrer = document.referrer;
  if(!referrer) {
      referrer = getParameterByName('redirect_uri', windHref) ;
  }
    if (referrer) {
        var refUrl = new URL(referrer);
        var a = document.createElement("A");
        a.innerText = "Register";
        a.setAttribute('href', refUrl.origin + '/signup');
        var node = document.createElement("LI");
        node.appendChild(a);
        document.getElementById("help-links-container").appendChild(node);
    }
}
function getParameterByName(name, url = window.location.href) {
name = name.replace(/[\[\]]/g, '\\$&');
var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
setTimeout(() => {
    showRegisterBtn();
}, 1000);