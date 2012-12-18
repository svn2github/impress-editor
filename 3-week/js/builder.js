var s=2;

builder=(function(){
  var state={
    editing:false,
    $node:false,
    data:{
      x:0,
      y:0,
      z:0,
      rotate:0,
      rotateX:0,
      rotateY:0,
      scale:0
    }
  },
  config={
  	rotation:0,
    rotateStep:0.5,
    scaleStep:0.02,
    visualScaling:10,
    visualRotation:0,
    redrawFunction:false,
    setTransformationCallback:false
  },
  defaults={
    x:0,
    y:0,
    z:0,
    rotate:0,
    scale:1
  },
  mouse={
    prevX:false,
    prevY:false,
    activeFunction:false
  },
  handlers={},
  redrawTimeout,
  //nodes
  $menu,$controls,$controls2,$controls3,$controls4,$controls5,$controls6,$impress,$overview;

  handlers.move=function(x,y){
    
    var v=fixVector(x,y);
	
	//console.log(v.x)
	//console.log(v.y)
    state.data.x = state.data.x+v.x;
    state.data.y = state.data.y+v.y;
    //console.log(state.data.x)
	//console.log(state.data.y)
  };
  handlers.scale=function(x){
    state.data.scale+= -x * config.scaleStep/10;
  };
  handlers.rotate=function(x){
   // console.log(state.rotate);
    state.data.rotate-= -x*config.rotateStep;
  };
    handlers.rotateX=function(x,y){
    	var v=fixVector(x,y);
   // console.log(state.rotate);
    state.data.rotateX+= -v.y*config.rotateStep;
    state.data.rotateY+= v.x*config.rotateStep;
  };
  // handlers.rotateY=function(x,y){
   // // console.log(state.rotate);
    // state.data.rotateY-= -x*config.rotateStep;
  // };
  

  function init(conf){
    config=$.extend(config,conf);
    config.visualScaling=$(".active").attr("data-scale");
    config.visualRotation=$(".active").attr("data-rotate");
    //console.log($(".active").attr("data-scale"))
    if(config.setTransformationCallback){
      config.setTransformationCallback(function(x){
        // guess what, it indicates slide change too :)
       // $controls.hide();
    	  //console.log("aki")
    	  if(state.editing==true)
    	  editContents()
    	  //console.log($(".active").attr("id"))
    	  if($(".active").attr("id")=="overview"){
    		  $("#sidecontrolers").hide();
    	  }
    	  else{
    		  $("#sidecontrolers").show();
    	  }
        //setting pu movement scale
        config.visualScaling=x.scale;
        console.log("hi")
        numberSlide();
        if(x.rotate.z==undefined)
        config.visualRotation= x.rotate;
        else config.visualRotation= x.rotate.z;
        //console.log(x.scale);
      //TODO: implement rotation handling for move
      
        config.rotation=(x.rotate.z);
        console.log('rotate',x.rotate.z);
      //I don't see why I should need translation right now, but who knows...
      })
    }
    
    $('body').addClass('edit');
    $(".step").css("width","512px");
    $impress=$('#impress');
    $overview=$('#overview');
    
    $menu=$('<div></div>').addClass('builder-main');
    $('<div></div>').addClass('builder-bt bt-add').appendTo($menu).text('Add new').on('click',addSlide);
    $('<div></div>').addClass('builder-bt bt-overview').appendTo($menu).text('Overview').on('click',function(){
      config['goto']('overview');
    });
    $('<div></div>').addClass('builder-bt bt-download').appendTo($menu).text('Get file').on('click',downloadResults);
    $('<input type="file" id="files" name="files[]" multiple />').addClass('builder-bt bt-download').appendTo($menu);
    $('<div></div>').addClass('builder-bt bt-new').appendTo($menu).text('New Presentation').on('click',newFile);
    $('<div></div>').addClass('builder-bt');
    $('<span></span>').addClass('builder-bt').text('Background Color').appendTo($menu).click(mainShowColor);
    $colors=$('<div></div>').attr('id', 'divcolors');
    $('<label for="color">First Gradient</label>').attr('class', 'mlctrans').appendTo($colors);
    $('<input type="text" placeholder="Background">').attr('id', 'firstBackground').attr('class','mctrans').addClass('builder-bt').text('Edit').appendTo($colors).on("keyup",setBackground);
    $('<label for="color">Second Gradient</label>').attr('class', 'mlctrans').appendTo($colors);
    $('<input type="text" placeholder="Background">').attr('id', 'secondBackground').attr('class','mctrans').addClass('builder-bt').text('Edit').appendTo($colors).on("keyup",setBackground);
    $('<label for="color">Third Gradient</label>').attr('class', 'mlctrans').appendTo($colors);
    $('<input type="text" placeholder="Background">').attr('id', 'thirdBackground').attr('class','mctrans').addClass('builder-bt').text('Edit').appendTo($colors).on("keyup",setBackground);
    $colors.appendTo($menu)
    $menu.appendTo('body');
    document.getElementById('files').addEventListener('change', openFile, false);
    
    $controls=$('<div></div>').addClass('builder-controls move');
    $('<div></div>').addClass('bt-move').attr('title','Move').data('func','move').appendTo($controls);
    $controls3=$('<div></div>').addClass('builder-controls rotate');
    $('<div></div>').addClass('bt-rotate').attr('title','Rotate').data('func','rotate').appendTo($controls3);
    $controls4=$('<div></div>').addClass('builder-controls scale');
    $('<div></div>').addClass('bt-scale').attr('title','Scale').data('func','scale').appendTo($controls4);
    $controls5=$('<div></div>').addClass('builder-controls rotatex');
    $('<div></div>').addClass('bt-rotateXaxial').attr('title','RotateX').data('func','rotateX').appendTo($controls5);  //added
    $controls6=$('<div></div>').addClass('builder-controls delete');
	$('<div></div>').addClass('bt-delete').appendTo($controls6).click(deleteContents);
    // $controls6=$('<div></div>').addClass('builder-controls');
    // $('<div></div>').addClass('bt-rotateYaxial').attr('title','RotateY').data('func','rotateY').appendTo($controls6); //added
//     
//     
    $controls2=$('<div></div>').addClass('builder-controls text').attr('id', 'sidecontrolers');
    $('<input type="text" >').attr('id', 'nSlide').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",changeSlideOrder);
    $('<span></span>').attr('id', 'edit').addClass('builder-bt').text('Edit').appendTo($controls2).click(editContents);
    $('<span></span>').addClass('builder-bt').text('FlashSlide').appendTo($controls2).click(wrapContents);
    $('<span></span>').addClass('builder-bt').text('Input').appendTo($controls2).click(showMoves);
    $('<span></span>').addClass('builder-bt').text('Slide Color').appendTo($controls2).click(showColor);
    
    
    //Input Box for Color
    $('<label for="color">First Gradient</label>').attr('class', 'lctrans').appendTo($controls2);
    $('<input type="text" placeholder="Slide Color">').attr('id', 'firstColor').attr('class','ctrans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",setColor);
    $('<label for="color">Second Gradient</label>').attr('class', 'lctrans').appendTo($controls2);
    $('<input type="text" placeholder="Slide Color">').attr('id', 'secondColor').attr('class','ctrans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",setColor);
    $('<label for="color">Third Gradient</label>').attr('class', 'lctrans').appendTo($controls2);
    $('<input type="text" placeholder="Slide Color">').attr('id', 'thirdColor').attr('class','ctrans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",setColor);
    
    
    //Input Box for Move
    $('<label for="mx">Move X</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Move X">').attr('id', 'mx').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",movex);
    $('<label for="my">Move Y</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Move Y">').attr('id', 'my').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",movey);
    $('<label for="mz">Move Z</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Move Z">').attr('id', 'mz').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",movez);
    
    
    //Input Box for Rotate
    $('<label for="rx">Rotate X</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Rotate X">').attr('id', 'rx').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",rotx);
    $('<label for="ry">Rotate Y</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Rotate Y">').attr('id', 'ry').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",roty);
    $('<label for="rz">Rotate Z</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Rotate Z">').attr('id', 'rz').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",rotz);
    
    
    //Scale & Zoom
    $('<label for="s">Scale</label>').attr('class', 'ltrans').appendTo($controls2);
    $('<input type="text" placeholder="Scale">').attr('id', 's').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",scale);
    $('<label for="slider">Zoom</label>').appendTo($controls2);
    $('<div></div>').attr('id', 'zoomSlider').addClass('builder-bt').appendTo($controls2);

    
    
    var showTimer2;
    $controls2.appendTo('body').on('mousedown','div',function(e){
      state.$node=$(".active");	
      e.preventDefault();
      mouse.activeFunction=handlers[$(this).data('func')];
      loadData();
      mouse.prevX=e.pageX;
      mouse.prevY=e.pageY;
      $(document).on('mousemove.handler1',handleMouseMove);
      return false;
    }).on('mouseenter',function(){
      clearTimeout(showTimer2);
      
    });
    if($(".active").attr("id")=="overview"){
		  $("#sidecontrolers").hide();
	  }
	  else{
		  $("#sidecontrolers").show();
	  }
    numberSlide();
    $("#mx").attr("value",$(".active").attr("data-x") || 0);
	$("#my").attr("value",$(".active").attr("data-y") || 0);
	$("#mz").attr("value",$(".active").attr("data-z") || 0);
	$("#rx").attr("value",$(".active").attr("data-rotate-x") || 0);
	$("#ry").attr("value",$(".active").attr("data-rotate-y") || 0);
	$("#rz").attr("value",$(".active").attr("data-rotate") || 0);
	$("#s").attr("value",$(".active").attr("data-scale") || 0);
	
    var showTimer;
    $controls.appendTo('.step').on('mousedown','div',function(e){
    	console.log(this.parentNode.parentNode.id)
    	state.$node=$("#"+this.parentNode.parentNode.id);	
      e.preventDefault();
      mouse.activeFunction=handlers[$(this).data('func')];
      loadData();
      mouse.prevX=e.pageX;
      mouse.prevY=e.pageY;
      $(document).on('mousemove.handler1',handleMouseMove);
      return false;
    }).on('mouseenter',function(){
      clearTimeout(showTimer);
      
    });
    $controls3.appendTo('.step').on('mousedown','div',function(e){
    	state.$node=$("#"+this.parentNode.parentNode.id);	
      e.preventDefault();
      mouse.activeFunction=handlers[$(this).data('func')];
      loadData();
      mouse.prevX=e.pageX;
      mouse.prevY=e.pageY;
      $(document).on('mousemove.handler1',handleMouseMove);
      return false;
    }).on('mouseenter',function(){
      clearTimeout(showTimer);
      
    });
    $controls4.appendTo('.step').on('mousedown','div',function(e){
    	state.$node=$("#"+this.parentNode.parentNode.id);	
      e.preventDefault();
      mouse.activeFunction=handlers[$(this).data('func')];
      loadData();
      mouse.prevX=e.pageX;
      mouse.prevY=e.pageY;
      $(document).on('mousemove.handler1',handleMouseMove);
      return false;
    }).on('mouseenter',function(){
      clearTimeout(showTimer);
      
    });
    $controls5.appendTo('.step').on('mousedown','div',function(e){
    	state.$node=$("#"+this.parentNode.parentNode.id);	
      e.preventDefault();
      mouse.activeFunction=handlers[$(this).data('func')];
      loadData();
      mouse.prevX=e.pageX;
      mouse.prevY=e.pageY;
      $(document).on('mousemove.handler1',handleMouseMove);
      return false;
    }).on('mouseenter',function(){
      clearTimeout(showTimer);
      
    });
      $controls6.appendTo('.step')
    $(document).on('mouseup',function(){
      mouse.activeFunction=false;
      $(document).off('mousemove.handler1');
    });
    
    $('body').on('mouseenter','.step',function(){
      var $t=$(this);
      showTimer=setTimeout(function(){
        if(!mouse.activeFunction){
          //show controls
          state.$node=$t;
          
        }
      },500);
      $t.data('showTimer',showTimer);
    }).on('mouseleave','.step',function(){
      //not showing when not staying
      clearTimeout($(this).data('showTimer'));
    });
    
    $(window).on('beforeunload',function(){ return 'All changes will be lost'; });
    $("#overview .builder-controls").remove();
    config.showMenu();
    config['goto']('start');
    
    
  }
  

 
  
  var sequence = function(){
    
    //return function(){
      return s++;
    //}
  }
  
  function addSlide(contenido){
	    //query slide id
	    var id,$step;
	    //console.log(contenido)
	    id='builderAutoSlide'+sequence();
	    var $ = Aloha.jQuery;
	    if (contenido==undefined || contenido.type=="click")		{		
	    	$step=$('<div></div>').addClass('step').html('<div class="fakeClassNameForAloha"><h1>This is a new step. </h1> How about some contents?</div>').aloha();
	    	$step[0].dataset.scale=3;
	    	}
	   	else{
	   		$step=$('<div></div>');
	   		$step[0]=contenido;
	   		id=$step[0].id;
	   		$($step[0]).addClass("future")
	   	}
	    $step[0].id=id;
	    
	    
	    //console.log(id)
	    
	    $step.insertBefore($('.step:last')); //not too performant, but future proof
	    
	    var $Scontrols=$('<div></div>').addClass('builder-controls move');
	    $('<div></div>').addClass('bt-move').attr('title','Move').data('func','move').appendTo($Scontrols);
	    var $Scontrols3=$('<div></div>').addClass('builder-controls rotate');
	    $('<div></div>').addClass('bt-rotate').attr('title','Rotate').data('func','rotate').appendTo($Scontrols3);
	    var $Scontrols4=$('<div></div>').addClass('builder-controls scale');
	    $('<div></div>').addClass('bt-scale').attr('title','Scale').data('func','scale').appendTo($Scontrols4);
	    var $Scontrols5=$('<div></div>').addClass('builder-controls rotatex');
	    $('<div></div>').addClass('bt-rotateXaxial').attr('title','RotateX').data('func','rotateX').appendTo($Scontrols5);  //added
	    var $Scontrols6=$('<div></div>').addClass('builder-controls delete');
		$('<div>X</div>').addClass('bt-delete').appendTo($Scontrols6).click(deleteContents);
	        var showTimer;
	    $Scontrols.appendTo($("#"+id+"")).on('mousedown','div',function(e){
	    	console.log(this.parentNode.parentNode.id)
	    	state.$node=$("#"+this.parentNode.parentNode.id);	
	      e.preventDefault();
	      mouse.activeFunction=handlers[$(this).data('func')];
	      loadData();
	      mouse.prevX=e.pageX;
	      mouse.prevY=e.pageY;
	      $(document).on('mousemove.handler1',handleMouseMove);
	      return false;
	    }).on('mouseenter',function(){
	      clearTimeout(showTimer);
	      
	    });
	    $Scontrols3.appendTo($("#"+id+"")).on('mousedown','div',function(e){
	    	state.$node=$("#"+this.parentNode.parentNode.id);	
	      e.preventDefault();
	      mouse.activeFunction=handlers[$(this).data('func')];
	      loadData();
	      mouse.prevX=e.pageX;
	      mouse.prevY=e.pageY;
	      $(document).on('mousemove.handler1',handleMouseMove);
	      return false;
	    }).on('mouseenter',function(){
	      clearTimeout(showTimer);
	      
	    });
	    $Scontrols4.appendTo($("#"+id+"")).on('mousedown','div',function(e){
	    	state.$node=$("#"+this.parentNode.parentNode.id);	
	      e.preventDefault();
	      mouse.activeFunction=handlers[$(this).data('func')];
	      loadData();
	      mouse.prevX=e.pageX;
	      mouse.prevY=e.pageY;
	      $(document).on('mousemove.handler1',handleMouseMove);
	      return false;
	    }).on('mouseenter',function(){
	      clearTimeout(showTimer);
	      
	    });
	    $Scontrols5.appendTo($("#"+id+"")).on('mousedown','div',function(e){
	    	state.$node=$("#"+this.parentNode.parentNode.id);	
	      e.preventDefault();
	      mouse.activeFunction=handlers[$(this).data('func')];
	      loadData();
	      mouse.prevX=e.pageX;
	      mouse.prevY=e.pageY;
	      $(document).on('mousemove.handler1',handleMouseMove);
	      return false;
	    }).on('mouseenter',function(){
	      clearTimeout(showTimer);
	      
	    });
	    // $Scontrols.appendTo($("#"+id+""));
	    // $Scontrols3.appendTo($("#"+id+""));
	    // $Scontrols4.appendTo($("#"+id+""));
	    // $Scontrols5.appendTo($("#"+id+""));
	    
	     $Scontrols6.appendTo($("#"+id+""));
	    $("#"+id).css("width","512px");
	    //console.log($step[0],$(".active").parent().children(".step"))
	    config.newStepAtPosition($step[0],$(".active").parent().children(".step").length-2);//get number of childs minus 1;
	    createDivForTextEdit();
	    config.showMenu();
	    $(".active").removeClass("active");
	    // jump to the overview slide to make some room to look around
	    config['goto']('overview');
	  }
  function newFile(){
  	var r=confirm("Are you sure you want to create a new file.\n If you create a new file you will lose all your slides. ");
	if (r==true)
	  {
	  	var parent=$(".active").parent();
	  	var children=$(".active").parent().children();
	 	  //console.log($(".active").parent().children())
	 	  for(var i=0;i<children.length;i++){
	 	  	//console.log(children[i].id)
	 	  	config.deleteStep(children[i].id)
  			children[i].parentNode.removeChild(children[i]);
	 	  }
	 	  var id,$step;
		    id='overview';
		    $step=$('<div></div>').addClass('step');
		    $step[0].id=id;
		    $step[0].dataset.scale=1;
		    $step[0].dataset.z=5000;
		    parent.append($step[0]) //not too performant, but future proof
		    config.creationFunction($step[0]);
		    // jump to the overview slide to make some room to look around
		    config['goto']('overview');
	 	  addSlide();
	 	 config.showMenu();
	  }
	else return;
  }
  function changeSlideOrder(event){
	  	if(event.keyCode==13){
	  		var position=numberSlide(1);
	  		var fposition= $("#nSlide").val();
	  		console.log(position)
	  		console.log(fposition)
	  		if(fposition>0 && fposition<$(".active").parent().children(".step").length && (position+1)!=fposition){
	  			console.log($(".active").parent().children(".step"))
	  			var placeid=$(".active").parent().children(".step")[fposition-1]
	  			console.log(placeid)
	  			$current = $(".active");
	  			deleteContents();
	  			if((position+1)<fposition)$current.insertAfter(placeid);
	  			if((position+1)>fposition)$current.insertBefore(placeid);
	  			 config.newStepAtPosition($current[0],fposition-1);
	  			 numberSlide();
	  			config.showMenu();
	  		}
	  		
	  		
	  		
	  		
	  		// console.log($("#mx").val())
	  		
	  	}
	  	
	  	//config.newStepAtPosition($step[0],$(".active").parent().children(".step").length-2);
	  }
	  function numberSlide(input){
	  	var parent=$(".active").parent();
		  	var children=$(".active").parent().children();
		 	  //console.log($(".active").parent().children())
		 	  for(var i=0;i<children.length;i++){
		 	  	//console.log(children[i].id)
		 	  	if(children[i].id==$(".active").attr("id")){
		 	  		if (input!=1)$("#nSlide").attr("value",i+1);
		 	  		return(i);		
		 	  	}
		 	  }
	  }
  
  
	  function openFile(evento){
			var files = evento.target.files; // FileList object
			var file = files[0];
			var start = 0;
		    var stop = file.size - 1;
		    var reader = new FileReader();
		    	
		    // If we use onloadend, we need to check the readyState.
		    reader.onloadend = function(evt) {
		      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
		      	console.log("here");
		        var $a=evt.target.result;
		        //console.log($a);
		        var test = $($a).find(".step");
		        appendManySlides(test);
		        loadEditor();
		      }
		      
		    };
		    reader.readAsBinaryString(file);
		  }
		  
		  function appendManySlides(slides){
		  	var parent=$(".active").parent();
			  	var children=$(".active").parent().children();
			 	  //console.log($(".active").parent().children())
			 	  for(var i=0;i<children.length;i++){
			 	  	//console.log(children[i].id)
			 	  	config.deleteStep(children[i].id)
		  			children[i].parentNode.removeChild(children[i]);
			 	  }
			 	  var id,$step;
				    id='overview';
				    $step=$('<div></div>').addClass('step');
				    $step[0].id=id;
				    $step[0].dataset.scale=1;
				    $step[0].dataset.z=5000;
				    parent.append($step[0]) //not too performant, but future proof
				    config.creationFunction($step[0]);
				    // jump to the overview slide to make some room to look around
				config['goto']('overview');
				for(var y=0;y<slides.length-1;y++){
					console.log(slides[y])
					addSlide(slides[y]);
				}
				
		  }
  
  function downloadResults() {
    var uriContent,content,$doc;
    
    var BlobBuilder = (function(w) {
      return w.BlobBuilder || w.WebKitBlobBuilder || w.MozBlobBuilder;
    })(window);
    
    $doc=$(document.documentElement).clone();
    var data = $doc.find(".fakeClassNameForAloha");
	//console.log(data);
    var allSlides = new Array();
    for( var i = 0 ; i < data.length ; i++ ) {
    	allSlides[i] = data[i].parentElement;
    }            
    for(var i = 0 ; i < allSlides.length ; i++) {
    	Aloha.jQuery(allSlides[i]).css("display" , "inline");
	}
    
    
    $doc.find(".fakeClassNameForAloha").each(function(){
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
    //remove all scripting
    $doc.find('script').remove();
    //remove colorpicker
    $doc.find('.colorpicker').remove();
    $doc.find('#help').remove();
    $doc.find('.aloha-character-picker-overlay').remove();
    $doc.find('.repository-browser-modal-overlay').remove();
    $doc.find('.repository-browser-modal-window').remove();
    //remove all current transforms
    $doc.find('.fallback-message').remove();
    $doc.find('.menu, .aloha, .aloha-ui,#prevBtnEditMode ,#nextBtnEditMode,#btnAloha').remove();
    $doc.find(' #impress>div').removeAttr('style');
    $doc.find('body').removeAttr('class');
    //remove gui
    $doc.find('.builder-controls, .builder-main, .counter').remove();
    
    $doc.find('.previous').each(function(index,element){element.classList.remove('previous');});
    $doc.find('.active').each(function(index,element){element.classList.remove('active');});
    $doc.find('.present').each(function(index,element){element.classList.remove('present');});
    $doc.find('.past').each(function(index,element){element.classList.remove('past');});
    $doc.find('.future').each(function(index,element){element.classList.remove('future');});
    //put overview at the end
    $doc.find('#overview').appendTo($doc.find('#impress'));
    //add flash slides
    $doc.find('head').append('<style type="text/css">.step.flash.future {opacity:0;} .step.flash.past {opacity:0;}</style>');
    //add impress.js simple init
    $doc.find('body').attr('class','impress-not-supported')[0].innerHTML+='<script src="https://raw.github.com/bartaz/impress.js/master/js/impress.js"></script><script>impress().init()</script>';
    $.get("img/embeddedCanvas.txt",function(data) {
    	$doc.find('body').attr('class','impress-not-supported')[0].innerHTML+=data;
    	  content=$doc[0].outerHTML;
    	   //remove stuff
    	   var bb = new BlobBuilder;
    	   bb.append(content);
    	   saveAs(bb.getBlob("text/html;charset=utf-8"), "presentation.html");
    	})
    
  }
  
  function editContents() {
    var $t = $(this);
    if(state.editing===true){
      state.editing=false;
      state.$node.html($t.parent().find('textarea').val());
      state.$node.removeClass('builder-justcreated');
      $t.parent().find('textarea').remove();
      $t.text('Edit');
    }else{
      var $txt=$('<textarea>').on('keydown keyup',function(e){
        e.stopPropagation();
      });
      $t.text('OK');
      state.editing=true;
      $t.after($txt.val($(".active .fakeClassNameForAloha").html()));
    }
  }
  

  // Put the content of each slide inside a white box with some css
  function wrapContents() {
    $(".active").toggleClass('flash');
  }
  
  function showMoves() {
	    $(".trans").toggle( "slide", 500 );
	    $(".ltrans").toggle( "scale", 500 );
	      }
	      
  function showColor(){
  	$(".ctrans").toggle("slide", 500);
  	$(".lctrans").toggle("scale", 500);
  }
  function mainShowColor(){
	  	$(".mctrans").toggle("slide", 500);
	  	$(".mlctrans").toggle("scale", 500);
	  }

  // Upcoming delete function
  function deleteContents() {
	  if($(this).attr("id")!="overview"){
	config.deleteStep($(this).parent().parent().attr("id"))
    $(this).parent().parent().remove();
	config.showMenu();
	config['goto']("overview");}
	
  }

  
  function loadData(){
    //console.log('load',state.$node[0]);
    //state.data=state.$node[0].dataset;
    //add defaults
    
    
    state.data.x=parseFloat(state.$node[0].dataset.x) || defaults.x;   
    state.data.y=parseFloat(state.$node[0].dataset.y) || defaults.y;  
    state.data.z=parseFloat(state.$node[0].dataset.z) || defaults.z;    
    state.data.scale=parseFloat(state.$node[0].dataset.scale) || defaults.scale;   
    state.data.rotate=parseFloat(state.$node[0].dataset.rotate) || defaults.rotate;
    state.data.rotateX=parseFloat(state.$node[0].dataset.rotateX) || defaults.rotate;
    state.data.rotateY=parseFloat(state.$node[0].dataset.rotateY) || defaults.rotate;   
    
  }
  
  function redraw(){
    clearTimeout(redrawTimeout);
    redrawTimeout=setTimeout(function(){
      //state.$node[0].dataset=state.data;
      //console.log("redraw");
      state.$node[0].dataset.scale=state.data.scale;
      state.$node[0].dataset.rotate=state.data.rotate;
      state.$node[0].dataset.rotateX=state.data.rotateX;
      state.$node[0].dataset.rotateY=state.data.rotateY;
      state.$node[0].dataset.x=state.data.x;
      state.$node[0].dataset.y=state.data.y;
      state.$node[0].dataset.z=state.data.z;
      /**/
      $("#mx").attr("value",$(".active").attr("data-x") || 0);		
	  $("#my").attr("value",$(".active").attr("data-y") || 0);		
	  $("#mz").attr("value",$(".active").attr("data-z") || 0);		
	  $("#rx").attr("value",$(".active").attr("data-rotate-x") || 0);		
      $("#ry").attr("value",$(".active").attr("data-rotate-y") || 0);		
      $("#rz").attr("value",$(".active").attr("data-rotate") || 0);		
      $("#s").attr("value",$(".active").attr("data-scale") || 0);
      console.log(state.data,state.$node[0].dataset,state.$node[0].dataset===state.data);
        
      config.redrawFunction(state.$node[0]);
    //console.log(['redrawn',state.$node[0].dataset]);
    },20);
  }
  
  function fixVector(x,y){
    var result={x:0,y:0},
      angle=(config.visualRotation/180)*Math.PI,
     
      cs=Math.cos(angle),
      sn=Math.sin(angle);
      //console.log(state.data.rotate);
	 
    result.x = (x*cs - y*sn) * config.visualScaling;
    result.y = (x*sn + y*cs) * config.visualScaling;
    console.log(cs)
    console.log(config.visualScaling)
    console.log(result.x)
    return result;
  }
  
  //setting the color of the slide
  var setColor=function  (event){
    console.log("set color");
      
      //check that is a number
      //check that the key is enter(checking the value)
    console.log(event.keyCode)
      if(event.keyCode==13){
        console.log("-webkit-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstColor").val()+", "+$("#secondColor").val()+", "+$("#thirdColor").val() + ")")
        state.$node=$(".active").css("background-image", "-webkit-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstColor").val()+", "+$("#secondColor").val()+", "+$("#thirdColor").val() + ")");
        state.$node=$(".active").css("background-image", "-moz-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstColor").val()+", "+$("#secondColor").val()+", "+$("#thirdColor").val() + ")");
        state.$node=$(".active").css("background-image", "-o-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstColor").val()+", "+$("#secondColor").val()+", "+$("#thirdColor").val() + ")");
        state.$node=$(".active").css("background-image", "radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstColor").val()+", "+$("#secondColor").val()+", "+$("#thirdColor").val() + ")");
      }
    }
    
  
  //setting Background color for the bady
  var setBackground=function (event){
    if(event.keyCode==13){
      $("body").css("background-image", "-webkit-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstBackground").val()+", "+$("#secondBackground").val()+", "+$("#thirdBackground").val() + ")");
        $("body").css("background-image", "-moz-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstBackground").val()+", "+$("#secondBackground").val()+", "+$("#thirdBackground").val() + ")");
        $("body").css("background-image", "-o-radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstBackground").val()+", "+$("#secondBackground").val()+", "+$("#thirdBackground").val() + ")");
        $("body").css("background-image", "radial-gradient(0% 100%, circle farthest-corner,"+  $("#firstBackground").val()+", "+$("#secondBackground").val()+", "+$("#thirdBackground").val() + ")");
    }
  }
	  
	  
	  
    var movex=function  (event){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)
	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.x = $("#mx").val();
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
  var movey=function (event,text){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)

  	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.y = $("#my").val();
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
var movez=function (event,text){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)

  	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.z = $("#mz").val();
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
var rotx=function (event,text){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)

  	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.rotateX = $("#rx").val();
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
var roty=function (event,text){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)

  	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.rotateY = $("#ry").val();
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
var rotz=function (event,text){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)

  	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.rotate = $("#rz").val();
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
  var scale=function (event,text){

  	
  	//check that is a number
  	//check that the key is enter(checking the value)

  	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active");
  		loadData();
  		state.data.scale = $("#s").val()*0.01;
  		// console.log($("#mx").val())
  		redraw();
  	}
  }
  
  function handleMouseMove(e){
    e.preventDefault();
    e.stopPropagation();
    //console.log(e.pageX)
      
    var x=((e.pageX-mouse.prevX)/screen.width)*1980,
    y=((e.pageY-mouse.prevY)/screen.height)*1430;
        
    mouse.prevX=e.pageX;
    mouse.prevY=e.pageY;
    if(mouse.activeFunction){
      mouse.activeFunction(x,y);
      redraw();
    }
    
    return false;
  }
  
  return {
    init:init
  };

})();


  $(document).ready(function(){

	// for the .hint message
	    var fade_out = function() {
	      $(".hint").fadeOut('slow');
	    }
	    if( (document.location.href).indexOf("?edit/") === -1 ) {
	      $('body').append('<div class="hint"><p>Press "h" to see the options</p></div>');
	       setTimeout(fade_out, 5000);
	       $(".hint").click(function ( event ) {
    	      event.preventDefault();
    	      $(this).hide();
	       });
	    }
		 
	    
	    // about the menu for the options
	    if( (document.location.href).indexOf("?edit/") === -1 ) {
	    	document.addEventListener("keyup", function ( event ) {
	    		if ( event.keyCode === 72 ) {
	    			$('.sidebar').css('margin-left',0);
	    			if($('.sidebar').css('margin-left') == '0px') {
	    				$('.sidebar').css('margin-left', -400);
	    			}
	    		}
	    	}, false);
	    }
	    
	    
		  // slideshow with play and pause
		  var timing;
			function slideShow() {
				setTimeout(impress().next, 3000);
				document.addEventListener('impress:stepenter', function(e){
					if (typeof timing !== 'undefined') clearTimeout(timing);
					var duration = (e.target.getAttribute('data-transition-duration') ? e.target.getAttribute('data-transition-duration') : 3000); 
					timing = setTimeout(impress().next, duration);
				});
			}
			
			
		if( (document.location.href).indexOf("?edit/") === -1 ) {
//			$('body').append('<button id="btnShow">Play</button>');
//			$('body').append('<button id="btnPause">Pause</button>');
//	        var auto = $('#btnShow');
//	        var pause = $('#btnPause');
//	        
//	        auto.click(function () {
//	          slideShow();
//	            $('#btnShow').hide();
//	          $('#btnPause').show();
//	        });
//	        pause.click(function () {
//	          clearTimeout(timing); 
//	          $('#btnPause').hide();
//	          $('#btnShow').show();    
//	        });

	        // press keys for play and pause
	        // press 'p' for play
	        $('.impress-supported').keydown(function(event) {
	          if (event.keyCode == 80) {
	            slideShow();
	            $('#btnShow').hide();
	            $('#btnPause').show();
	          }
	          // press 'o' for pause
	          else {
	            if (event.keyCode == 79) {
	              clearTimeout(timing); 
	              $('#btnPause').hide();
	              $('#btnShow').show();   
	            }
	          }
	        });
		}	

		
		
	//Function to prevent the user of setting as input letters
	  $(".trans").keydown(function(event) {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)  ||
            (event.keyCode==189 || event.keyCode==173)
            
            ) {
                 // let it happen, don't do anything
                 return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey ||event.keyCode==109|| (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    });
	    $("#nSlide").keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) || 
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)  ||
	            (event.keyCode==189 || event.keyCode==173)
	            
	            ) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey ||event.keyCode==109|| (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault(); 
	            }   
	        }
	    });
	  
	  
});


//Function for the zoom.
$(function() {
        $( "#zoomSlider" ).slider({
            //range: "min",
            min: 1,
            max: 20,
            value: 10,
            slide: function( event, ui ) {
            	var val= ui.value;
            	$("#impress").css("-webkit-transform","scale("+val/10+")");
            	$("#impress").css("-moz-transform","scale("+val/10+")");
            }
        });
        $( "#amount" ).val( $( "#zoomSlider" ).slider( "value" ) );
    });
