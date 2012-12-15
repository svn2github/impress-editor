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
var s=0;

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
function saveChanges(){
	var arrayOfTextOfSlides = new Array();
	var $step = $(".step");
	$($step).find(".builder-controls").remove();
	var all="";
	var counter=0;
	
	$($step).each(function(index){
		arrayOfTextOfSlides[counter++] = $(this).context.outerHTML;
		arrayOfTextOfSlides[counter++] = "*&"
	});
	console.log(arrayOfTextOfSlides)
	if(typeof(Storage)!=="undefined") {
		console.log($($step[0]).html())
		//for(var i=0;i<$step.length;i++)
			sessionStorage.steps = arrayOfTextOfSlides;//[i];
			
		}
	else {
		console.log("ERROR. Web storage not supported!!!!!");
	}
}
function loadChanges(){
	if(typeof(Storage)!=="undefined") {
		if(sessionStorage.length != 0){
			
			var counter = 0;
			var test = new Array();
			test[counter] = "";
			for(var i=0;i<sessionStorage.steps.length-1;i++){
				//	console.log("eimaste sto "+i+" loop");
				//	console.log(sessionStorage.HTMLtextOfSlidesArray[i]);
				if( sessionStorage.steps[i] == "," ) {
					if( sessionStorage.steps[i+1] == "*" ) {
						if( sessionStorage.steps[i+2] == "&" ) {
							// we found the seperator
							i += 3;
							counter ++;
							test[counter] = "";
							continue;
						}
					}
				}
				
				test[counter] += sessionStorage.steps[i];
				
			}
			//console.log(test)
			//console.log(test[1]);
			appendManySlides(test)
		}
	}
	else {
		console.log("ERROR. Web storage not supported!!!!!");
	}
}
  var sequence = function(){
    
    //return function(){
      return s++;
    //}
  }
function addSlide(contenido){
	    //query slide id
	    var id,$step;
	    id='builderAutoSlide'+sequence();
	    var $ = Aloha.jQuery;
	    if (contenido==undefined || contenido.type=="click")		{		
	    	$step=$('<div></div>').addClass('step builder-justcreated').html('<div class="fakeClassNameForNewAloha"><h1>This is a new step. </h1> How about some contents?</div>').aloha();
	    	$step[0].dataset.scale=3;
	    	}
	   	else{
	   		$step=$(contenido);
	   		id=$step[0].id;
	   		$($step[0]).addClass("future")
	   	}
	    $step[0].id=id;
	    
	    
	    $step.insertBefore($('.step:last')); //not too performant, but future proof
	    
	    $("#"+id).css("width","512px");
	    //console.log($step[0],$(".active").parent().children(".step"))
	    impress().newStepAtPosition($step[0],$(".active").parent().children(".step").length-2);//get number of childs minus 1;
	    
	    // jump to the overview slide to make some room to look around
	    impress()['goto']('overview');
	  }
function appendManySlides(slides){
		  	var parent=$(".active").parent();
			  	var children=$(".active").parent().children();
			 	  //console.log($(".active").parent().children())
			 	  for(var i=0;i<children.length;i++){
			 	  	//console.log(children[i].id)
			 	  	impress().deleteStep(children[i].id)
		  			children[i].parentNode.removeChild(children[i]);
			 	  }
			 	  //console.log(slides)
			 	  //console.log($("#impress"))
			 	  var id,$step;
				    id='overview';
				    $step=$('<div></div>').addClass('step');
				    $step[0].id=id;
				    $step[0].dataset.scale=1;
				    $step[0].dataset.z=5000;
				    parent.append($step[0]) //not too performant, but future proof
				    impress().newStep($step[0]);
				    impress()["goto"]("overview")
				    // jump to the overview slide to make some room to look around
				
				for(var y=0;y<slides.length-1;y++){
				//console.log($(slides[y]).attr("id"))
					if($(slides[y]).attr("id")!="overview")
					addSlide(slides[y]);
				}
				
		  }
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
						//console.log(currentStepId);
						for(var j = 0 ; j < arrayID.length ; j++) {
							if(arrayID[j] == currentStepId)
								found = true;
						}
						if(!found) {
							//console.log(currentStepId);
							if(currentStepId != "overview") {
								impress().deleteStep(currentStepId);
								$("#"+currentStepId).remove();
							}
						}
					}
				}
			});
			
			//console.log(sessionStorage.HTMLOfNewSlidesID);	
			//console.log(sessionStorage.HTMLOfNewSlidesStyle);
			//console.log(sessionStorage.HTMLOfNewSlidesInner);	
			
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

function loadEditor() {
	$(".fakeClassNameForAloha").each(function(){
		//console.log(this);
		
		Aloha.jQuery(this).aloha();
		
		//console.log("AFTER:");
		//console.log(this);
		
	});
}

function rmvEditor() {
	$(".fakeClassNameForAloha").each(function(){
		//console.log($(this)[0].id);
		var id = $(this)[0].id;
		if(id) {
			$(this).removeClass("aloha-editable")
				.removeClass("aloha-block-blocklevel-sortable")
				.removeClass("ui-sortable").removeClass("aloha-editable-highlight")
				.attr("contenteditable","false");
		}
		// this will not work (we have modified it)
		//	Aloha.jQuery("#"+id).mahalo();
		
		
		//console.log("AFTER:");
		//console.log($(this));
		
	});
}

function goToEditMode() {

	saveChanges(true);
	

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

	saveChanges(false);
	

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

function removeWrapDivIfAny() {
	$(".wrap").each(function(){
		//console.log(this);
		if(this){
			if($(this).children()){
				$(this).children().unwrap();
			}
		}
	});
}

function displayAllSlides() {
	removeWrapDivIfAny();
	
	var data = Aloha.jQuery("body").find(".fakeClassNameForAloha");
		//console.log(data);
    var allSlides = new Array();
    for( var i = 0 ; i < data.length ; i++ ) {
    	allSlides[i] = data[i].parentElement;
	}            
    for(var i = 0 ; i < allSlides.length ; i++) {
    	Aloha.jQuery(allSlides[i]).css("display" , "inline");
   	}	
}

function removeSidebar() {
	$(".aloha-sidebar-bar").remove();
}

function colorPicker() {
	
		$("body").click(function(e) {
			// Cache our variables
			var colorpicker = $(".colorpicker");
			var btnColorSelector = $("#btnColorSelector");
			
			//console.log($(colorpicker).css("display"));
			//console.log(e.srcElement.id);
			
			
			
			if(btnColorSelector.length == 0) {
				// The button is not created, so create it
				//console.log($(".aloha-ui-toolbar > .ui-tabs > div"));
				$('.aloha-ui-toolbar > .ui-tabs').append('<div id="colorSelector"></div>');
			//console.log($("#tab-ui-container-1"));
				$('#tab-ui-container-1').prepend('<div class="aloha-ui-component-group unselectable="on""><span unselectable="on"><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" id="btnColorSelector"></button></span></div>');
			}
			
			
			// Show the colorpicker. Hide the toolbar
			if( ($(colorpicker).css("display") == "none") ){
		
					$(btnColorSelector).click(function(){
						var pos = document.location.href.lastIndexOf("/");
						var urlID = "";
						for( var i = pos+1 ; i < document.location.href.length ; i++ ) {
							urlID += document.location.href.charAt(i);
						}
						
    			//console.log(urlID);
    					if ( urlID != "overview" ) {
    						var offset = btnColorSelector.offset();
						
							if(offset.top != 0 && offset.left !=0) {
    							$(colorpicker).css("position" , "absolute").
    								css("left" , offset.left - 18).css("top" , offset.top + 52);
    						}
    					
    						colorpicker.show();
    						$(".aloha-toolbar").hide();
    				
    					}
    					else {
    						console.log("You can not change the color while in overview.");
    					}
    				});
			}
			else {
			//console.log(e.srcElement.parentElement.className);
			//console.log(e.srcElement.className);
			
				var classOfParent = e.srcElement.parentElement.className;
			
				// Was the click out inside the colorpicker? If no check for the submit.
				// Or the button may have been clicked.
				if((e.srcElement.className.indexOf("colorpicker") != -1) 
					|| (classOfParent.indexOf("colorpicker") != -1) 
					|| (classOfParent.indexOf("colorpicker_color") != -1) 
					|| (classOfParent.indexOf("colorpicker_hue") != -1) 
					|| (classOfParent.indexOf("colorpicker_new_color") != -1) 
					|| (classOfParent.indexOf("colorpicker_current_color") != -1) 
					|| (classOfParent.indexOf("colorpicker_hex") != -1) 
					|| (classOfParent.indexOf("colorpicker_field") != -1) 
					|| (classOfParent.indexOf("colorpicker_submit") != -1) 			
					|| (e.srcElement.id == "btnColorSelector") )
				{
					//console.log(classOfParent)
					if(e.srcElement.className.indexOf("colorpicker_submit") != -1) {
						// Submit, so apply the new color and hide colorpicker
						
						var newCol = $(".colorpicker_new_color").css("background-color");
						
						//console.log("newCol= " + newCol);
						//console.log($(".active"));
						
						$(".active").css("color" , newCol);
						
						colorpicker.hide();
						$(".aloha-toolbar").show();
					}
				}
				else {
					// If yes, hide the colorpicker.
					//console.log("Hide the colorpicker");
					
					colorpicker.hide();
					$(".aloha-toolbar").show();
				}	
			}
		});
}

// create the aloha button dynamically so that it won't
// be created when on edit mode
$(function() {

	// we are in the presentation mode and we want to go
	// to the edit mode
	
	if ((document.location.href).indexOf("?edit/") === -1) {
		loadChanges();
		$('body').append('<button id="btnAloha" onclick="goToEditMode()">Edit</button>');
		rmvEditor();	
	}
	// We are in edit mode and want to go to presentation mode
	else {
		loadChanges();
		//loadSlides();
		$('body').append('<button id="btnAloha" onclick="goToPresentationMode()"><p>Exit</p><p>edit</p><p>mode</p></button>');
		$('body').append('<button id="nextBtnEditMode">Next</button>');
		$('body').append('<button id="prevBtnEditMode">Prev</button>');
		loadEditor();
		colorPicker();
		var iAPI = impress();
		//iAPI.showMenu();
		builder.init({
	  "goto":iAPI['goto'], //it makes me feel better this way
	  creationFunction:iAPI.newStep, //future API method that adds a new step
	  redrawFunction:iAPI.initStep, //future API method that (re)draws the step
	  setTransformationCallback:iAPI.setTransformationCallback, //future API method that lets me know when transformations change
	  deleteStep:iAPI.deleteStep,
	  showMenu:iAPI.showMenu,
	  newStepAtPosition:iAPI.newStepAtPosition
	});
	}
	
    displayAllSlides();
    removeSidebar();
}); 