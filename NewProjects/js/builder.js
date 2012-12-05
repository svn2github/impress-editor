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
    scaleStep:0.005,
    visualScaling:10,
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
  $menu,$controls,$controls2,$controls3,$controls4,$controls5,$controls6,$controls7,$controls8,$impress,$overview;

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
    
    if(config.setTransformationCallback){
      config.setTransformationCallback(function(x){
        // guess what, it indicates slide change too :)
       // $controls.hide();
        
        //setting pu movement scale
        config.visualScaling=x.scale;
        console.log(x.scale);
      //TODO: implement rotation handling for move
      
        config.rotation=(x.rotate.z);
        console.log('rotate',x.rotate.z);
      //I don't see why I should need translation right now, but who knows...
      })
    }
    
    $('body').addClass('edit');
    
    $impress=$('#impress');
    $overview=$('#overview');
    
    $menu=$('<div></div>').addClass('builder-main');
    $('<div></div>').addClass('builder-bt bt-add').appendTo($menu).text('Add new').on('click',addSlide);
    $('<div></div>').addClass('builder-bt bt-overview').appendTo($menu).text('Overview').on('click',function(){
      config['goto']('overview');
    });
    $('<div></div>').addClass('builder-bt bt-download').appendTo($menu).text('Get file').on('click',downloadResults);
    $('<div></div>').addClass('builder-bt bt-download').appendTo($menu).text('style.css').on('click',downloadStyle);
    
    
    $menu.appendTo('body');
    
    
    $controls=$('<div></div>').addClass('builder-controls move');
    $('<div></div>').addClass('bt-move').attr('title','Move').data('func','move').appendTo($controls);
    $controls3=$('<div></div>').addClass('builder-controls rotate');
    $('<div></div>').addClass('bt-rotate').attr('title','Rotate').data('func','rotate').appendTo($controls3);
    $controls4=$('<div></div>').addClass('builder-controls scale');
    $('<div></div>').addClass('bt-scale').attr('title','Scale').data('func','scale').appendTo($controls4);
    $controls5=$('<div></div>').addClass('builder-controls rotatex');
    $('<div></div>').addClass('bt-rotateXaxial').attr('title','RotateX').data('func','rotateX').appendTo($controls5);  //added
    // $controls6=$('<div></div>').addClass('builder-controls');
    // $('<div></div>').addClass('bt-rotateYaxial').attr('title','RotateY').data('func','rotateY').appendTo($controls6); //added
//     
//     
    $controls2=$('<div></div>').addClass('builder-controls text dragme');
    $('<span></span>').attr('id', 'edit').addClass('builder-bt').text('Edit').appendTo($controls2).click(editContents);
    $('<span></span>').addClass('builder-bt').text('Wrap').appendTo($controls2).click(wrapContents);
    $('<span></span>').addClass('builder-bt').text('Delete').appendTo($controls2).click(deleteContents);
    $('<span></span>').addClass('builder-bt').text('Swap').appendTo($controls2).click(goSwap);
    $('<label for="color">Background Color</label>').appendTo($controls2);
    $('<input type="text" placeholder="Color">').attr('id', 'color').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",setColor);
    $('<label for="mx">Move X</label>').appendTo($controls2);
    $('<input type="text" placeholder="Move X">').attr('id', 'mx').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",movex);
    $('<label for="my">Move Y</label>').appendTo($controls2);
    $('<input type="text" placeholder="Move Y">').attr('id', 'my').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",movey);
    $('<label for="mz">Move Z</label>').appendTo($controls2);
    $('<input type="text" placeholder="Move Z">').attr('id', 'mz').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",movez);
    $('<label for="rx">Rotate X</label>').appendTo($controls2);
    $('<input type="text" placeholder="Rotate X">').attr('id', 'rx').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",rotx);
    $('<label for="ry">Rotate Y</label>').appendTo($controls2);
    $('<input type="text" placeholder="Rotate Y">').attr('id', 'ry').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",roty);
    $('<label for="rz">Rotate Z</label>').appendTo($controls2);
    $('<input type="text" placeholder="Rotate Z">').attr('id', 'rz').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",rotz);
    $('<label for="s">Scale</label>').appendTo($controls2);
    $('<input type="text" placeholder="Scale">').attr('id', 's').attr('class', 'trans').addClass('builder-bt').text('Edit').appendTo($controls2).on("keyup",scale);
    
    
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
    $("#mx").attr("value",$(".active").attr("data-x") || 0);
	$("#my").attr("value",$(".active").attr("data-y") || 0);
	$("#mz").attr("value",$(".active").attr("data-z") || 0);
	$("#rx").attr("value",$(".active").attr("data-rotate-x") || 0);
	$("#ry").attr("value",$(".active").attr("data-rotate-y") || 0);
	$("#rz").attr("value",$(".active").attr("data-rotate") || 0);
	$("#s").attr("value",$(".active").attr("data-scale") || 0);
	
    var showTimer;
    $controls.appendTo('.step').on('mousedown','div',function(e){
    	state.$node=$(".active");	
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
    	state.$node=$(".active");	
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
    	state.$node=$(".active");	
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
    	state.$node=$(".active");	
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
     // $controls6.appendTo('.step').on('mousedown','div',function(e){
     	// state.$node=$(".active");	
      // e.preventDefault();
      // mouse.activeFunction=handlers[$(this).data('func')];
      // loadData();
      // mouse.prevX=e.pageX;
      // mouse.prevY=e.pageY;
      // $(document).on('mousemove.handler1',handleMouseMove);
      // return false;
    // }).on('mouseenter',function(){
      // clearTimeout(showTimer);
//       
    // });
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
          showControls(state.$node);
          
        }
      },500);
      $t.data('showTimer',showTimer);
    }).on('mouseleave','.step',function(){
      //not showing when not staying
      clearTimeout($(this).data('showTimer'));
    });
    
    $(window).on('beforeunload',function(){ return 'All changes will be lost'; });
    $("#overview .builder-controls").hide();
    
    config['goto']('start');
    
    
  }
  

 
  
  var sequence = (function(){
    var s=2;
    return function(){
      return s++;
    }
  })()
  
  function addSlide(){
    //query slide id
    var id,$step;
    id='builderAutoSlide'+sequence();
    var $ = Aloha.jQuery;						
    $step=$('<div></div>').addClass('step builder-justcreated').html('<div class="fakeClassNameForNewAloha"><h1>This is a new step. </h1> How about some contents?</div>').aloha();
    $step[0].id=id;
    $step[0].dataset.scale=3;
    $controls.appendTo($step);
    $controls3.appendTo($step);
    $controls4.appendTo($step);
    $controls5.appendTo($step);
    //$controls6.appendTo($step);
    $step.insertBefore($('.step:last')); //not too performant, but future proof
    config.deleteStep("overview");
    config.creationFunction($step[0]);
    //config.creationFunction($overview);
    // jump to the overview slide to make some room to look around
    config['goto']('overview');
  }
  
  
  function downloadStyle(){
   
    var uriContent,content,$doc;
    
    var BlobBuilder = (function(w) {
      return w.BlobBuilder || w.WebKitBlobBuilder || w.MozBlobBuilder;
    })(window);

    // it works in server so run it from eclipse
    $.get('css/style.css', function (content) {
      var bb = new BlobBuilder;
      bb.append(content);
      saveAs(bb.getBlob("text/css;charset=utf-8"), "default.css");
    });

  }
  
  function downloadResults() {
    var uriContent,content,$doc;
    
    var BlobBuilder = (function(w) {
      return w.BlobBuilder || w.WebKitBlobBuilder || w.MozBlobBuilder;
    })(window);

    $doc=$(document.documentElement).clone();
    //remove all scripting
    $doc.find('script').remove();
    //remove all current transforms
    $doc.find('.step, body, #impress, #impress>div').removeAttr('style');
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
    //add impress.js simple init
    $doc.find('body').attr('class','impress-not-supported')[0].innerHTML+='<script src="https://raw.github.com/bartaz/impress.js/master/js/impress.js"></script><script>impress().init()</script>';
    content=$doc[0].outerHTML;
    //remove stuff
    var bb = new BlobBuilder;
    bb.append(content);
    saveAs(bb.getBlob("text/html;charset=utf-8"), "presentation.html");
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
      $t.after($txt.val($(".active").html()));
    }
  }
  

  // Put the content of each slide inside a white box with some css
  function wrapContents() {
    $(".active").toggleClass('slide');
  }


  // Upcoming delete function
  function deleteContents() {
	  if($(".active").attr("id")!="overview"){
	config.deleteStep($(".active").attr("id"))
    $(".active").remove();
	config['goto'](1);}
	
  }

  // testing swap function for specific slides.. but it doesn't work as it should 
  function goSwap () {
      $text = $("#prj");
      $cal = $("#prj-wt");
    
      // put cal before text
      var t = $($cal).clone();
      $($cal).remove();
      $($text).before(t);
   }

  function showControls($where){
    var top,left,pos=$where.offset();
    //not going out the edges (at least one way)
    // top=(pos.top>0)? pos.top+(100/config.visualScaling) : 0;
    // left=(pos.left>0)? pos.left+(100/config.visualScaling) : 0;
     
    
    // $controls.show().offset({
     // // top:top,
     // // left:left
    // });
  }
  
  
  function loadData(){
    console.log('load',state.$node[0]);
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
      showControls(state.$node);
    //console.log(['redrawn',state.$node[0].dataset]);
    },20);
  }
  
  function fixVector(x,y){
    var result={x:0,y:0},
      angle=(state.data.rotate/180)*Math.PI,
      cs=Math.cos(angle),
      sn=Math.sin(angle);
      //console.log(state.data.rotate);
	var scale;
	scale=state.data.scale;
	if(scale==0){
		scale=0.1;
	}
	console.log(scale)
    result.x = (x*cs - y*sn) * config.visualScaling*0.2;
    result.y = (x*sn + y*cs) * config.visualScaling*0.2;
    return result;
  }
  var setColor=function  (event){
	console.log("set color");
  	
  	//check that is a number
  	//check that the key is enter(checking the value)
	console.log(event.keyCode)
  	if(event.keyCode==13){
  		state.$node=$(".active").css("background-color",$("#color").val());
  		loadData();
  		state.data.x = $("#color").val();
  		$('body').css("background", $("#color").val());
  		redraw();
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
      
      
    var x=e.pageX-mouse.prevX,
    y=e.pageY-mouse.prevY;
        
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
  
  // fix the draggable
	  $( ".dragme" ).draggable({ cursor: "move" }, { containment: "parent" });
  
	  
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
		$(function(){
			if( (document.location.href).indexOf("?edit/") === -1 ) {
				$('body').append('<button id="btnShow">Play</button>');
				$('body').append('<button id="btnPause">Pause</button>');
			}
			var auto = $('#btnShow');
			var pause = $('#btnPause');
			
			auto.click(function () {
				console.log('auto')
				slideShow();
			  	$('#btnShow').hide();
				$('#btnPause').show();
			});
			pause.click(function () {
				console.log('pause') 
				clearTimeout(timing); 
				$('#btnPause').hide();
			 	$('#btnShow').show();    
			});
		});
	  
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

});
 // $(document).ready(function(){
 	// $(".active").dataset.x;
 	// console.log()
	// $("mx").attr("value",)
// });