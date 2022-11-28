// domainMapping keycloack URLs i.e https://dssecurity.dsif2.devint.decisionspace365.io/auth/realms/DecisionSpace_Integration_Server/broker/okta/endpoint'

// README
// purpose of this code is to show a REGISTER button, and if user coming from application A it should send user to CURRENT_SIGNUP_PAGE_URL (i.e identity application prod/dev/qa env) with a query solution=A

// var DEFAULT_SIGNUP_PAGE_URL = `https://identity.devint.decisionspace365.io/auth/signup?solution=ds365`; // if user directly land on login page/ not coming from applicaitons
var signUpPage = `https://identity.devint.decisionspace365.io/auth/signup`;
let env = 'devint';
if (window.location.href && window.location.href.indexOf('login.dawlmkscandev02.landmarksoftware.cloud') !== -1) {
    signUpPage = `https://identity.dev.decisionspace365.io/auth/signup`;
    env = 'dev';
}
var solution;
var host;

function showRegisterBtn() {
    if(signUpPage === `https://identity.dev.decisionspace365.io/auth/signup`) {
        return; // dont show for dev
    }
    var solution = '';
    var requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication
        && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;
        if(requestUrl && OktaUtil.getRequestContext().authentication.request.state) {
            var state = OktaUtil.getRequestContext().authentication.request.state;
            solution = state && state.split('.').pop() ? state.split('.').pop(): solution;

        }
    var redirectUri;
    var refUrl = requestUrl ? new URL(requestUrl) : null;
    if(refUrl && refUrl.host) {
        host = refUrl.host;
    }

    if (requestUrl && refUrl && refUrl.origin && solution) {
        // if there is some solution in state redirect to devint
        return [{
            text: 'Donâ€™t have an account? Register now',
            href: `${signUpPage}?solution=${solution}&host=${host}`
        }]; 
    }

    return [{
        text: 'Donâ€™t have an account? Register now',
        href: signUpPage
    }];
    
    // let config = {
    //     ...OktaUtil.getSignInWidgetConfig()
    // }
    // config.customButtons = [{
    //     title: 'Donâ€™t Have An Account? Register Now',
    //     className: 'register-btn',
    //     click: () => {
    //         // clicking on the button navigates to another page
    //         window.location.href = solution ? `${signUpPage}?solution=${solution}` : signUpPage;
    //     }
    // }];

}

function getSolution() {
    var solution;
    var requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication
        && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;
        if(requestUrl && OktaUtil.getRequestContext().authentication.request.state) {
            var state = OktaUtil.getRequestContext().authentication.request.state;
            solution = state && state.split('.').pop() ? state.split('.').pop(): solution;

        }

    var refUrl = requestUrl ? new URL(requestUrl) : null;
    if(refUrl && refUrl.host) {
        host = refUrl.host;
    }
    return solution;
}


// function showRegisterBtnFunc() {
//     // show register button
//     var signUpHeading = document.getElementsByClassName('okta-form-title o-form-head')[0]; 
//     var registerLink = document.createElement('a' );
//     let innerText = signUpHeading.innerHTML;

//     registerLink.innerHTML = 'Donâ€™t have an account? Register now';
//     // registerLink.className = 'register-link';
//     registerLink.setAttribute('style', `
//     display: block;
//     margin-bottom: 30px;
//     text-decoration-line: underline;
//     color: #3275B8;
//     font-weight: 500;
//     font-size: 12px;`);
//     if(solutionName) {
//         registerLink.setAttribute('href', `${signUpPage}?solution=${solution}`);
//     } else {
//         registerLink.setAttribute('href', `${signUpPage}`);
//     }
//     // only show in sign in page
//     if(innerText.toLocaleLowerCase().indexOf('sign in') !== -1) {
//         signUpHeading.after(registerLink, signUpHeading.nextElementSibling );
//     }

// }

// Executes after DOM is loaded (before images and CSS):

document.addEventListener("DOMContentLoaded", function() {
    // show customized logo/small logo
    // var solutionConfig = [
    //     {"solution":"Envana","solutionKeycloakName":"esg365-app","loginUrl":"https://esg365-app.dsif.dawlmknvidmo01.ienergycloud.solutions/"},
    //     {"solution":"sample","solutionKeycloakName":"sample","loginUrl":"https://sample.devint.decisionspace365.io/"}
    // ];
    solution = getSolution();
    let solutionConfig;
 
  fetch(`https://identity.dev.decisionspace365.io/users/configurations/appIntegration/configurations/${host}`)
  .then(r=>r.json()).then(d=>{
    solutionConfig =d;
    console.log(d)
}).finally(()=> {

    
        
    if (solution && solutionConfig) {
        var foundSolution = solutionConfig.find(solConf => solConf.solutionKeycloakName === solution);
        let logo = document.getElementsByClassName("ienergy")[0];
        let smallLogo = document.getElementsByClassName("auth-org-logo")[0];
        if(foundSolution && logo) {
            smallLogo.setAttribute('src' , `https://identity.${env}.decisionspace365.io/${foundSolution.logo.path}`);
            logo.setAttribute('style', `background-image: url("https://identity.${env}.decisionspace365.io/assets/images/gcp/${foundSolution.bigLogo}")`);
        } else {
            if (logo) {
                logo.classList.add('ienergy-logo');
            }
        }

        // show hallibruton small logo for envana 
        if(solution === 'esg365-app') {
            let logo = document.getElementsByClassName("hal")[0];
            logo.setAttribute('style', `background-image: url("https://identity.${env}.decisionspace365.io/assets/images/gcp/landmak-logo-white.png")`);
            let smallLogo = document.getElementsByClassName("auth-org-logo")[0];
            smallLogo.remove(); // remove small logo
            var headerSection = document.getElementsByClassName('okta-sign-in-header auth-header')[0];
            headerSection.setAttribute('style', 'border-bottom:none'); // remove border

        }
        
    }

  })
    setTimeout(() => {
        // showRegisterBtnFunc(solution);
        
        // var backLink = document.getElementsByClassName('js-back')[0];
        // backLink.addEventListener('click', function (e) {
        //     showRegisterBtnFunc(solution)
        //     e.preventDefault();
        //     e.stopPropagation();
        //     // Custom link behavior
        // });
    }, 1000);
    


});
