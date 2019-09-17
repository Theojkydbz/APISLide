
// Client ID and API key from the Developer Console
var CLIENT_ID = '<YOURCLIENT_ID>';
var API_KEY = '<YOURAPI_KEY>';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://slides.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/presentations";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var createButton = document.getElementById('create_button');
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
    }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        createButton.onclick = handleCreateClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    createButton.style.display = 'block';
    listSlides();
    } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    createButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 *  Sign out the user upon button click.
 */
function handleCreateClick(event) {
    createSlide();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Prints the number of slides and elements in a sample presentation:
 * https://docs.google.com/presentation/d/<<EXAMPLEIDPRES>>
 */
function listSlides() {
    gapi.client.slides.presentations.get({
    presentationId: '<EXAMPLEIDPRES>'
    }).then(function(response) {
    var presentation = response.result;
    var length = presentation.slides.length;
    appendPre('The presentation contains ' + length + ' slides:');
    for (i = 0; i < length; i++) {
        var slide = presentation.slides[i];
        appendPre('- Slide #' + (i + 1) + ' contains ' +
            slide.pageElements.length + ' elements.')
    }
    }, function(response) {
    appendPre('Error: ' + response.result.error.message);
    });
}

function editSlides(id) {
    console.log(id)
    var requests = [{
        createSlide: {
            objectId: id,
            insertionIndex: '1',
            slideLayoutReference: {
                predefinedLayout: 'TITLE_AND_TWO_COLUMNS'
            }
        }
    }];
    
    // If you wish to populate the slide with elements, add element create requests here,
    // using the pageId.
    
    // Execute the request.
    gapi.client.slides.presentations.batchUpdate({
        presentationId: id,
        requests: requests
    }).then((createSlideResponse) => {
        appendPre(`Created slide with ID: ${createSlideResponse.result.replies[0].createSlide.objectId}`);
    });
}

function createSlide() {
    return gapi.client.slides.presentations.create({
    "alt": "json",
    "resource": {}
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                debugger

                editSlides(JSON.parse(response.body).presentationId)
            },
            function(err) { console.error("Execute error", err); });
}



function identifyId() {
    return gapi.client.slides.presentations.get({})
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }