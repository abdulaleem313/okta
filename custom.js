// domainMapping keycloack URLs i.e https://dssecurity.dsif2.devint.decisionspace365.io/auth/realms/DecisionSpace_Integration_Server/broker/okta/endpoint'

// README
// purpose of this code is to show a REGISTER button, and if user coming from application A it should send user to CURRENT_SIGNUP_PAGE_URL (i.e identity application prod/dev/qa env) with a query appName=A

var DEFAULT_SIGNUP_PAGE_URL = `https://identity.devint.decisionspace365.io/auth/signup?appName=ds365`; // if user directly land on login page/ not coming from applicaitons
var CURRENT_SIGNUP_PAGE_URL = 'https://identity.devint.decisionspace365.io/auth/signup?appName='; // where should user redirect? if coming from applicaiton

// if key matches send to domain with appname
var domainMapping = [
{
    domain: 'https://identity.dev.decisionspace365.io/auth/signup',
    matchingKeys: ['dev.decisionspace365.io'],
    appName: 'ds365'
},
{
    domain: 'https://identity.devint.decisionspace365.io/auth/signup',
    matchingKeys: ['devint.decisionspace365.io'],
    appName: 'ds365'
}];



function showRegisterBtn() {
    var appName = '';
    var requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication
        && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;
        if(requestUrl && OktaUtil.getRequestContext().authentication.request.state) {
            var state = OktaUtil.getRequestContext().authentication.request.state;
            appName = state && state.split('.').pop() ? state.split('.').pop(): appName;

        }
    var redirectUri;
    var refUrl = requestUrl ? new URL(requestUrl) : null;
    if (requestUrl && refUrl && refUrl.origin) {
        domainMapping.forEach(dm => {
            var found = dm.matchingKeys.find(mk => refUrl.origin.includes(mk));
            if (found) {
                redirectUri = dm;
            }
        })
        // if redirect uri is identity dev/devint
        if(redirectUri && redirectUri.domain) {
            return [{
                text: 'Register',
                href: redirectUri.domain + `?appName=${appName}`
            }];
        }
        // if there is some appname in state redirect to devint
        if(appName !=='' ) {
            return [{
                text: 'Register',
                href: `${CURRENT_SIGNUP_PAGE_URL}${appName}`
            }];
        }
    }
    return [{
        text: 'Register',
        href: DEFAULT_SIGNUP_PAGE_URL
    }];
}
