/*var mine;
$(function() {
			//console.log("edw1111");
			Aloha.bind( 'aloha-editable-created', function( jEvent, editable ) {
       			var currentID = editable.getId();
       			mine = currentID;
       			console.log(currentID);
       			gatherIDs();
       		});
			
		});
		
		function gatherIDs() {
		//	console.log("mazeuw ta id " +mine);
			var strID = "#" + mine;
			currentElement = $(strID);
	//		console.log(currentElement[0]);		
	
};
*/

//Hide the sidebar
/*
		Aloha.settings = {
			sidebar: {
        		disabled: true // or false for shwoing the slidebar
			}
		};

Aloha.ready( function(){
   Aloha.Sidebar.right.hide(); // .show();
   console.log($(".aloha-sidebar-bar"));
   $(".aloha-sidebar-bar").css("display","none");
});
*/


document.onclick = function() {
	
	if ( $('#btnAloha')[0].outerText === "Edit" ) {
		// We are in the normal mode (presentation mode),
		// so no need to attach the editor.
		// Remember than on normal mode the text of the button 
		// is "Edit" and on edit mode, the text of it is
		// Exit<br>edit<br>mode .
		return;
	}
	
	
	Aloha.ready(function() {
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

function saveTextChanges() {
	var arrayOfTextOfSlides = new Array();
	
	
	var $ = Aloha.jQuery;
	
	var counter = 0;
	
	$(".fakeClassNameForAloha").each(function(){
		//console.log("bhka");
		//console.log($(this).context.innerHTML);
		arrayOfTextOfSlides[counter++] = $(this).context.innerHTML;
		// This will be saved as a string, not as an array.
		// So, we will use the *& to seperate
		// HTML text of every slide.
		arrayOfTextOfSlides[counter++] = "*&";
	});
	
	if(typeof(Storage)!=="undefined") {
		sessionStorage.HTMLtextOfSlidesArray = arrayOfTextOfSlides;
	}
	else {
		console.log("ERROR. Web storage not supported!!!!!");
	}
}

function loadTextOfSlides() {
	
	
	if(typeof(Storage)!=="undefined") {
		if(sessionStorage.HTMLtextOfSlidesArray !== undefined){
			
			var test = new Array();
			var counter = 0;
			test[0] = "";
		
			// length -1 because the last elements will be \0
			for(var i=0;i<sessionStorage.HTMLtextOfSlidesArray.length-1;i++){
				//	console.log("eimaste sto "+i+" loop");
				//	console.log(sessionStorage.HTMLtextOfSlidesArray[i]);
				if( sessionStorage.HTMLtextOfSlidesArray[i] == "," ) {
					if( sessionStorage.HTMLtextOfSlidesArray[i+1] == "*" ) {
						if( sessionStorage.HTMLtextOfSlidesArray[i+2] == "&" ) {
							// we found the seperator
							i += 3;
							counter ++;
							test[counter] = "";
							continue;
						}
					}
				}
			
				test[counter] += sessionStorage.HTMLtextOfSlidesArray[i];
	
			}
		// for(var h =0;h<test.length;h++) {
			// console.log("loop "+h);
			// console.log(test[h]);
		// }
			$(".fakeClassNameForAloha").each(function(index){
				$(this).context.innerHTML = test[index];
				//console.log($(this));
			});
		}
	}
	else {
		console.log("ERROR. Web storage not supported!!!!!");
	}
}

function goToPresentationMode() {	

	saveTextChanges();

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
		loadTextOfSlides();
		$('body').append('<button id="btnAloha" onclick="goToEditMode()">Edit</button>');
	}
	// We are in edit mode and want to go to presentation mode
	else {
		$('body').append('<button id="btnAloha" onclick="goToPresentationMode()"><p>Exit</p><p>edit</p><p>mode</p></button>');
		$('body').append('<button id="nextBtnEditMode">Next</button>');
		$('body').append('<button id="prevBtnEditMode">Prev</button>');
    }
}); 