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
	
	/*
	  var toolbar = $(".aloha-toolbar");
	$(toolbar[0]).click(function(){
		console.log(toolbar[0]);
	});
	
	 */
	
	Aloha.ready(function() {
		// hide loading div
		$('#aloha-loading').hide();
		$('#aloha-loading span').html('Loading Plugins');
	});
};

function saveTextChanges(fromPresToEdit) {
	var arrayOfTextOfSlides = new Array();
	var id = "";
	var dataX = "";
	var dataY = "";
	var dataScale = "";
	var dataRotate = "";
	var styleOfDiv = "";
	
	var $ = Aloha.jQuery;
	
	var counter = 0;
	
	$(".fakeClassNameForAloha").each(function(index){
		//console.log("bhka");
		//console.log(index);
		var currentDiv;
		if(fromPresToEdit) {
			//console.log($(this)[0].parentElement.parentElement);
			currentDiv = $(this)[0].parentElement.parentElement;
		}
		else
		{
			//console.log($(this)[0].parentElement);
			currentDiv = $(this)[0].parentElement;
		}
		
		id += $(currentDiv).attr("id");
		id += "*&";
		//console.log("id = "+id);
		
		dataX += $(currentDiv).attr("data-x");
		dataX += "*&";
		//console.log("dataX = "+dataX);
		
		dataY += $(currentDiv).attr("data-y");
		dataY += "*&";
		//console.log("dataY = "+dataY);
		
		dataScale += $(currentDiv).attr("data-scale");
		dataScale += "*&";
		//console.log("dataScale = "+dataScale);
		
		dataRotate += $(currentDiv).attr("data-rotate");
		dataRotate += "*&";
		//console.log("dataRotate = "+dataRotate);
		
		styleOfDiv += $(currentDiv).attr("style");
		styleOfDiv += "*&";
		//console.log(styleOfDiv);
		
		arrayOfTextOfSlides[counter++] = $(this).context.outerHTML;
		// This will be saved as a string, not as an array.
		// So, we will use the *& to seperate
		// HTML text of every slide.
		arrayOfTextOfSlides[counter++] = "*&";
		return;
	});
	// console.log("SAVEtex");
			// console.log(sessionStorage.id);
			// console.log(sessionStorage.dataX);
			// console.log(sessionStorage.dataY);
			// console.log(sessionStorage.dataScale);
			// console.log(sessionStorage.dataRotate);
			// console.log(sessionStorage.styleOfDiv);
			// console.log("nedofSAVEtex");
			// alert("ok");
			
	var HTMLOfNewSlidesID = "";
	var HTMLOfNewSlidesStyle = "";
	var HTMLOfNewSlidesInner = "";

	// Since we do not know the id, but we know that every new 
	// slide has id of a known string and a number (starting from 2)
	// we will search for them, while there is no next new slide		
	var idOfNewSlide = 2;
	var newSlides = $("#builderAutoSlide"+idOfNewSlide);
	
	if(newSlides[0] == undefined) {
		// no new slides
		HTMLOfNewSlidesID += "No new slides";
	}
	
	
	while(newSlides[0] != undefined) {
		//console.log($(newSlides[0]).find(".fakeClassNameForNewAloha")[0].innerHTML);
		
		HTMLOfNewSlidesID += $(newSlides[0]).attr("id") + "*&";
		HTMLOfNewSlidesStyle += $(newSlides[0]).attr("style") + "*&";
		HTMLOfNewSlidesInner += $(newSlides[0]).find(".fakeClassNameForNewAloha")[0].innerHTML +
			"*&";
			
		newSlides = $("#builderAutoSlide"+ ++idOfNewSlide);
	}
	
// console.log(HTMLOfNewSlidesID);	
// console.log(HTMLOfNewSlidesStyle);
// console.log(HTMLOfNewSlidesInner);	
	
	if(typeof(Storage)!=="undefined") {
		sessionStorage.HTMLtextOfSlidesArray = arrayOfTextOfSlides;
		sessionStorage.id = id;
		sessionStorage.dataX = dataX;
		sessionStorage.dataY = dataY;
		sessionStorage.dataScale = dataScale;
		sessionStorage.dataRotate = dataRotate;
		sessionStorage.styleOfDiv = styleOfDiv;
		sessionStorage.HTMLOfNewSlidesID = HTMLOfNewSlidesID;
		sessionStorage.HTMLOfNewSlidesStyle = HTMLOfNewSlidesStyle;
		sessionStorage.HTMLOfNewSlidesInner = HTMLOfNewSlidesInner;
	}
	else {
		console.log("ERROR. Web storage not supported!!!!!");
	}
}

function loadTextOfSlides() {
	
	
	if(typeof(Storage)!=="undefined") {
		if(sessionStorage.length != 0){
			
			var test = new Array();
			var arrayID = new Array();
			var counter = -1;
			test[0] = "";
			
			// console.log("LOAD");
			// console.log(sessionStorage.id);
			// console.log(sessionStorage.dataX);
			// console.log(sessionStorage.dataY);
			// console.log(sessionStorage.dataScale);
			// console.log(sessionStorage.dataRotate);
			// console.log(sessionStorage.styleOfDiv);
			
			var currentElement = "";
			for( var i = 0 ; i < sessionStorage.id.length ; i++ ) {
				while(sessionStorage.id[i] != "*" && sessionStorage.id[i+1] != "&"){
					currentElement += sessionStorage.id[i];
					i++;
				}
				arrayID[++counter] = currentElement;
				i++;
				currentElement = "";
			}
			//console.log(arrayID);
			
			var arrayDataX = new Array();
			counter = -1;
			currentElement = "";
			for( var i = 0 ; i < sessionStorage.dataX.length ; i++ ) {
				while(sessionStorage.dataX[i] != "*" && sessionStorage.dataX[i+1] != "&"){
					currentElement += sessionStorage.dataX[i];
					i++;
				}
				arrayDataX[++counter] = currentElement;
				i++;
				currentElement = "";
			}
			//console.log(arrayDataX);
			
			var arrayDataY = new Array();
			counter = -1;
			currentElement = "";
			for( var i = 0 ; i < sessionStorage.dataY.length ; i++ ) {
				while(sessionStorage.dataY[i] != "*" && sessionStorage.dataY[i+1] != "&"){
					currentElement += sessionStorage.dataY[i];
					i++;
				}
				arrayDataY[++counter] = currentElement;
				i++;
				currentElement = "";
			}
			//console.log(arrayDataY);
			
			var arrayDataScale = new Array();
			counter = -1;
			currentElement = "";
			for( var i = 0 ; i < sessionStorage.dataScale.length ; i++ ) {
				while(sessionStorage.dataScale[i] != "*" && sessionStorage.dataScale[i+1] != "&"){
					currentElement += sessionStorage.dataScale[i];
					i++;
				}
				arrayDataScale[++counter] = currentElement;
				i++;
				currentElement = "";
			}
			//console.log(arrayDataScale);
			
			var arrayDataRotate = new Array();
			counter = -1;
			currentElement = "";
			for( var i = 0 ; i < sessionStorage.dataRotate.length ; i++ ) {
				while(sessionStorage.dataRotate[i] != "*" && sessionStorage.dataRotate[i+1] != "&"){
					currentElement += sessionStorage.dataRotate[i];
					i++;
				}
				arrayDataRotate[++counter] = currentElement;
				i++;
				currentElement = "";
			}
			//console.log(arrayDataRotate);
			
			var arrayStyleOfDiv = new Array();
			counter = -1;
			currentElement = "";
			for( var i = 0 ; i < sessionStorage.styleOfDiv.length ; i++ ) {
				while(sessionStorage.styleOfDiv[i] != "*" && sessionStorage.styleOfDiv[i+1] != "&"){
					currentElement += sessionStorage.styleOfDiv[i];
					i++;
				}
				arrayStyleOfDiv[++counter] = currentElement;
				i++;
				currentElement = "";
			}
			//console.log(arrayStyleOfDiv);
			counter = 0;
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
			var deletedSlides = 0;
			$(".fakeClassNameForAloha").each(function(index){
				//console.log(index);
				//console.log($(this).context.innerHTML);
				// $(this).context.outerHTML = test[index];
				if(arrayID[index] != undefined) {
					// console.log(index);
					// console.log("id");
					// console.log(arrayID[index]);
					// console.log("dataX");
					// console.log(arrayDataX[index]);
					// console.log("dataY");
					// console.log(arrayDataY[index]);
					// console.log("data-scale");
					// console.log(arrayDataScale[index]);
					// console.log("data-rotate");
					// console.log(arrayDataRotate[index]);
					// console.log("style");
					// console.log(arrayStyleOfDiv[index]);
					
					$("#"+arrayID[index]).attr("data-x" , arrayDataX[index])
						.attr("data-y" , arrayDataY[index]).attr("data-scale" , arrayDataScale[index])
						.attr("data-rotate" , arrayDataRotate[index]).
						attr("style" , arrayStyleOfDiv[index]);	
				}
				else {
					deletedSlides++;
					
					var currentStepId;
					var found;
					
					for(var i = 0 ; i < index+deletedSlides ; i++) {
						found = false;
						currentStepId = impress().getStep(i).id;
						console.log(currentStepId);
						for(var j = 0 ; j < arrayID.length ; j++) {
							if(arrayID[j] == currentStepId)
								found = true;
						}
						if(!found) {
							console.log(currentStepId);
							if(currentStepId != "overview") {
								impress().deleteStep(currentStepId);
								$("#"+currentStepId).remove();
							}
						}
					}
				}
			});
			
			console.log(sessionStorage.HTMLOfNewSlidesID);	
			console.log(sessionStorage.HTMLOfNewSlidesStyle);
			console.log(sessionStorage.HTMLOfNewSlidesInner);	
			
			if(sessionStorage.HTMLOfNewSlidesID != "No new slides") {
				var newSlidesID = new Array();
				var counter = -1;
				currentElement = "";
				for( var i = 0 ; i < sessionStorage.HTMLOfNewSlidesID.length ; i++ ) {
					while(sessionStorage.HTMLOfNewSlidesID[i] != "*" && sessionStorage.HTMLOfNewSlidesID[i+1] != "&"){
						currentElement += sessionStorage.HTMLOfNewSlidesID[i];
						i++;
					}
					newSlidesID[++counter] = currentElement;
					i++;
					currentElement = "";
				}
				console.log(newSlidesID);
				
				var newSlidesStyle = new Array();
				counter = -1;
				currentElement = "";
				for( var i = 0 ; i < sessionStorage.HTMLOfNewSlidesStyle.length ; i++ ) {
					while(sessionStorage.HTMLOfNewSlidesStyle[i] != "*" && sessionStorage.HTMLOfNewSlidesStyle[i+1] != "&"){
						currentElement += sessionStorage.HTMLOfNewSlidesStyle[i];
						i++;
					}
					newSlidesStyle[++counter] = currentElement;
					i++;
					currentElement = "";
				}
				console.log(newSlidesStyle);
				
				var newSlidesInner = new Array();
				counter = -1;
				currentElement = "";
				for( var i = 0 ; i < sessionStorage.HTMLOfNewSlidesInner.length ; i++ ) {
					while(sessionStorage.HTMLOfNewSlidesInner[i] != "*" && sessionStorage.HTMLOfNewSlidesInner[i+1] != "&"){
						currentElement += sessionStorage.HTMLOfNewSlidesInner[i];
						i++;
					}
					newSlidesInner[++counter] = currentElement;
					i++;
					currentElement = "";
				}
				console.log(newSlidesInner);
				
				for( var i = 0 ; i < newSlidesInner.length ; i++) {
					$("#overview").before(
						"<div id='" + newSlidesID[i] + "'"
						+ " class='step future'>"  
						//+ "<div class='wrap'>"
						+ "<div "
						+" class='fakeClassNameForAloha'>"
					    + newSlidesInner[i]
						+ "</div>"
						+ "<div class='counter'>"
						+ "</div>"
						
						+ "</div>"
					);
					$("#"+newSlidesID[i]).attr("style" , newSlidesStyle[i]);
				}
				
				//$('#overview').before(newSlides[0]);
			}
			
			
			
			var numberOfSlides = 0;
			$(".fakeClassNameForAloha").each(function(index){
				numberOfSlides++;
				$(this).context.outerHTML = test[index];
			});
			// overview counts too
			numberOfSlides++;
			
			//Update counter of slides
			$(".counter").each(function(){
				var numberOfCurrentSlide = (this.innerHTML.split("/"))[0];
				this.innerHTML = numberOfCurrentSlide-deletedSlides + " / " + numberOfSlides;
			});
			
		}
		
	}
	else {
		console.log("ERROR. Web storage not supported!!!!!");
	}
}

function goToEditMode() {

	saveTextChanges(true);

	//saveSlides();

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

	saveTextChanges(false);

	//saveSlides();

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
		//loadSlides();
		$('body').append('<button id="btnAloha" onclick="goToEditMode()">Edit</button>');
	}
	// We are in edit mode and want to go to presentation mode
	else {
		loadTextOfSlides();
		//loadSlides();
		$('body').append('<button id="btnAloha" onclick="goToPresentationMode()"><p>Exit</p><p>edit</p><p>mode</p></button>');
		$('body').append('<button id="nextBtnEditMode">Next</button>');
		$('body').append('<button id="prevBtnEditMode">Prev</button>');
    }
}); 