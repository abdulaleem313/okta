
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
    var requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication 
    && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;
    

    var refUrl = requestUrl ? new URL(requestUrl): null;
    if (requestUrl && refUrl && refUrl.origin) {
        
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
        document.getElementById("help-links-container").addEventListener('click', event => {
            document.getElementById("help-links-container").appendChild(node);
        });
    }
}
setTimeout(() => {
    showRegisterBtn();
}, 1000);