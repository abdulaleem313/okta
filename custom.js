var windHref=   window.location.href;
var domainMapping = [{
    domain: 'https://decisionspace365.io',
    matchingKeys: ['decisionspace365.io']
},
{
    domain: 'https://getting-started.distwf5.dawlmkscandev02.landmarksoftware.io',
    matchingKeys: ['landmarksoftware.io']
},
{
    domain: 'https://geoweb.neftex.com/',
    matchingKeys: ['neftex.com']
}]

function showRegisterBtn() {
    var referrer = '' 
    // var referrer = document.referrer;
    // if(!referrer) {}
    if(!windHref){
        console.log('no windows href')
        return;
    }
    referrer = getParameterByName('redirect_uri', windHref) ;
    var refUrl = referrer ? new URL(referrer): null;
    if (referrer && refUrl && refUrl.origin) {
        
        var a = document.createElement("A");
        a.innerText = "Register";
        var redirectUri;
        domainMapping.forEach(dm=> {
            var found = dm.matchingKeys.find(mk => refUrl.origin.includes(mk));
            if(found) {
                redirectUri = dm.domain;
            }
        })
        a.setAttribute('href', redirectUri + '/signup');
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