var script = document.createElement('script');
script.src = 'jquery.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

function swap (tabs){
		
			$(".tab").removeClass("ui-tabs-active ui-state-active")
			$("#tab"+tabs).addClass("ui-tabs-active ui-state-active");
			$(".content").hide();
			$("#contentTab"+tabs).show();
		
		
}
