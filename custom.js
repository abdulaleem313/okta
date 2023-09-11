let BASE_URL = `https://identity.decisionspace365.io`;
if (window.location.href && window.location.href.indexOf('login.dawlmkscandev02.landmarksoftware.cloud') !== -1) {
    BASE_URL = `https://identity.dev.decisionspace365.io`;
}
if (window.location.href && window.location.href.indexOf('login-preview.ienergycloud.solutions') !== -1) {
    BASE_URL = `https://identity.devint.decisionspace365.io`;
}
let signUpPage = BASE_URL + '/auth/signup';

function showRegisterBtn() {
    let solution = getSolution();
    let requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication
        && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;
    if (requestUrl && OktaUtil.getRequestContext().authentication.request.state) {
        let state = OktaUtil.getRequestContext().authentication.request.state;
        solution = state && state.split('.').pop() ? state.split('.').pop() : solution;

    }
    let refUrl = requestUrl ? new URL(requestUrl) : null;
    if (refUrl && refUrl.host) {
        host = refUrl.host;
    }

    return [{
        title: 'Create an Account',
        className: 'register-btn',
        click: () => {
            if (solution) {
                solution = String(solution).toLowerCase();
            }
            // clicking on the button navigates to another page
            // Check host and solution conditions
            const allowedHosts = [
                'dssecurity.dsif.dev.decisionspace365.io',
                'dssecurity.dsif2.devint.decisionspace365.io',
                'dssecurity.console-app.decisionspace365.io'
            ];

            const allowedSolutions = [
                'ds365',
                'essentials',
                'vdr',
                'fdp',
                'co2storage',
                'cquest'
            ];

            if (allowedHosts.includes(host) && allowedSolutions.includes(solution)) {
                signUpPage = signUpPage.replace('identity', 'console');
            }

            let mapper;
            let matchedSolution;
            try {
                fetch(`${BASE_URL}/users/configurations/appIntegration/configurations/mapper`)
                .then(r => r.json()).then(d => {
                    mapper = d;
                    console.log(d)
                })
                .catch(error => {
                    console.error('Error fetching mapper data:', error);
                }).finally(() => {
                    if (mapper && mapper.length) {
                        for (const s of mapper) {
                            let foundKeyHost;
                            if (s && s.children) {
                                foundKeyHost = s.children.find(sol =>
                                    sol.solutionKeycloakName.toLowerCase() === solution &&
                                    sol.keycloakHostName.toLowerCase() === host.toLowerCase()
                                );
                            }
                            if (foundKeyHost) {
                                matchedSolution = s;
                                break; // Exit loop if a match is found
                            }
                        }
                    }
                    if (matchedSolution) {
                        solution = matchedSolution.solutionKeycloakName;
                        host = matchedSolution.keycloakHostName;
                    }

                    if (solution && host) {
                        window.location.href = `${signUpPage}?solution=${solution}&host=${host}`;
                    } else {
                        window.location.href = signUpPage;
                    }
                })
            } catch (error) {
                console.error('Error fetching mapper data:', error);
            }
        }
    }]
}
function getHost() {
    let requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication
        && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;

    let refUrl = requestUrl ? new URL(requestUrl) : null;
    if (refUrl && refUrl.host) {
        host = refUrl.host;
    }
    return host;
}
function getSolution() {
    let solution;
    let requestUrl = OktaUtil && OktaUtil.getRequestContext() && OktaUtil.getRequestContext().authentication
        && OktaUtil.getRequestContext().authentication.request && OktaUtil.getRequestContext().authentication.request.redirect_uri;
    if (requestUrl && OktaUtil.getRequestContext().authentication.request.state) {
        let state = OktaUtil.getRequestContext().authentication.request.state;
        solution = state && state.split('.').pop() ? state.split('.').pop() : solution;

    }
    return solution;
}

// Executes after DOM is loaded (before images and CSS):

document.addEventListener("DOMContentLoaded", function () {
    // show customized logo/small logo
    // let solutionConfig = [
    //     {"solution":"Envana","solutionKeycloakName":"esg365-app","loginUrl":"https://esg365-app.dsif.dawlmknvidmo01.ienergycloud.solutions/"},
    //     {"solution":"sample","solutionKeycloakName":"sample","loginUrl":"https://sample.devint.decisionspace365.io/"}
    // ];
    solution = getSolution();
    let solutionConfig;
    if (host) {
        fetch(`${BASE_URL}/users/configurations/appIntegration/configurations/${host}`)
            .then(r => r.json()).then(d => {
                solutionConfig = d;
                console.log(d)
            })
            .catch(error => {
                console.error('Error fetching config data:', error);
            })
            .finally(() => {
                if (solution && solutionConfig) {
                    let foundSolution = solutionConfig.find(solConf => solConf.solutionKeycloakName === solution);
                    let logo = document.getElementsByClassName("ienergy")[0];
                    let smallLogo = document.getElementsByClassName("auth-org-logo")[0];
                    if (foundSolution && logo) {
                        if (foundSolution.logo && foundSolution.logo.path) {
                            smallLogo.setAttribute('src', `${BASE_URL}/${foundSolution.logo.path}`);
                        }

                        if (foundSolution.bigLogo) {
                            logo.setAttribute('style', `background-image: url("${BASE_URL}/assets/images/gcp/${foundSolution.bigLogo}")`);
                        }

                    } else {
                        if (logo) {
                            logo.classList.add('ienergy-logo');
                        }
                    }

                    // show hallibruton small logo for envana 
                    if (solution === 'esg365-app' || solution === 'envana') {
                        let logo = document.getElementsByClassName("hal")[0];
                        logo.setAttribute('style', `background-image: url("${BASE_URL}/assets/images/gcp/landmak-logo-white.png")`);
                        let smallLogo = document.getElementsByClassName("auth-org-logo")[0];
                        smallLogo.remove(); // remove small logo
                        let headerSection = document.getElementsByClassName('okta-sign-in-header auth-header')[0];
                        headerSection.setAttribute('style', 'border-bottom:none'); // remove border

                    }

                }

            })
    }

});
