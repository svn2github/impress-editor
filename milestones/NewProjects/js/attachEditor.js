document.onclick = function() {
	
	if ( $('#btnAloha')[0].outerText === "Edit" ) {
		// We are in the normal mode (presentation mode),
		// so no need to attach the editor.
		// Remember than on normal mode the text of the button 
		// is "Edit" and on edit mode, the text of it is
		// Exit<br>edit<br>mode .
		return;
	}
	
	var listener = function (event) {
  		/* do nothing here */
	};
	
	Aloha.ready(function() {

		var $ = Aloha.jQuery;
		// register all editable areas
		$('.fakeClassNameForAloha').each(function() {
			$(this).aloha();
		});
$("#e").aloha();
		// hide loading div
		$('#aloha-loading').hide();
		$('#aloha-loading span').html('Loading Plugins');

	});
};

function goToEditMode() {

	var currentURL = document.location.href;
	var splitURL = currentURL.split("/");
	var currentSlide = splitURL[splitURL.length - 1];
	var indexOfHashtag = currentURL.indexOf("#");
	var targetURL = "";
	for (var i = 0; i < indexOfHashtag; i++) {
		targetURL += currentURL[i];
	}
	targetURL += "?edit/" + currentSlide + "#/" + currentSlide;

	// go to the url that gets the edit mode on
	document.location.href = targetURL;
	
	
	
}

function goToPresentationMode() {

	var currentURL = document.location.href;
	var splitURL = currentURL.split("/");
	var currentSlide = splitURL[splitURL.length - 1];
	var indexOfQuestionMark = currentURL.indexOf("?");
	var targetURL = "";
	for (var i = 0; i < indexOfQuestionMark; i++) {
		targetURL += currentURL[i];
	}
	targetURL += "#/" + currentSlide;

	// go to the url that gets the edit mode on
	document.location.href = targetURL;

}

// create the aloha button dynamically so that it won't
// be created when on edit mode
$(function() {

	// we are in the presentation mode and we want to go
	// to the edit mode
	if ((document.location.href).indexOf("?edit/") === -1) {
		$('body').append('<button id="btnAloha" onclick="goToEditMode()">Edit</button>');
	}
	// We are in edit mode and want to go to presentation mode
	else {
		$('body').append('<button id="btnAloha" onclick="goToPresentationMode()"><p>Exit</p><p>edit</p><p>mode</p></button>');
		$('body').append('<button id="nextBtnEditMode">Next</button>');
		$('body').append('<button id="prevBtnEditMode">Prev</button>');
    }
}); 