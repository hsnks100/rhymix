(function ($) {
	$.fn.wss_slide = function(option){
				opt = $.extend(option);

		var index=0;
	var mode =opt.mode;
	 _speed=parseInt(opt.speedd);
	var waittime=opt.wait_time;
	var slide_height=opt.slide_height;
	var control_w = opt.control_middle;
	
	
	$(".main_slide_control li:first img").show();;
	$('.main_slide')
		.mousewheel(function(event, delta, deltaX, deltaY) {
		if (delta > 0){
		if(index==0){index=$(".main_slide li").length;}
			index -= 1;
			show();
		}
			else if (delta < 0){
				if(index==$(".main_slide li").length-1){index=-1;}
			index += 1;
			show();
		}
		return false;
	});
	$(".main_slide_control li").click(function(){
		if(!$(this).hasClass("on")){
		index = $(this).index();
		show();
		}
	})
	$(".go_back").click(function(){
		if(index==0){index=$(".main_slide li").length;}
		index -= 1;
		show();
	})
	$(".go_after").click(function(){
		if(index==$(".main_slide li").length-1){index=-1;}
		index += 1;
		show();
		
	})
	$(".main_slide li").eq(index).fadeIn();
	$(".main_slide_control li").eq(index).show();;
	
	function show(){
		if(mode=="mode01"){ 
			$(".main_slide li").stop(true,true).fadeOut(_speed);	
			$(".main_slide li").stop(true,true).eq(index).fadeIn(_speed);
			control();
		}else if(mode=="mode02"){
			var a = parseInt(slide_height);
			$(".main_slide li:first").stop(true,false).animate({marginTop:-a*(index)},_speed);
			control();
		}else if(mode=="mode03"){
			var a = $(".main_slide li:first").width();
			
			$(".main_slide").stop(true,false).animate({marginLeft:-a*index},_speed);
			
			control();
		}
	}
	
	function control(){
		$(".main_slide_control").find("img.control_over").hide();
		$(".main_slide_control li img.control_over").eq(index).show();
	}
	if(control_w=="Y"){
	$(".main_slide_control li:first").css("margin-left",($(".main_slide_control").width()/2-$(".main_slide_control li").length*15)+($(".main_slide_control li").length-1)*5);
	}
	$(".go_back").css("top",$(".main_slide li").height()/2-23);
	$(".go_after").css("top",$(".main_slide li").height()/2-23);
	$("#main_slide").hover(function(){
		$(".go_back").show();
		$(".go_after").show();
		s_stop();
	},function(){
		$(".go_back").hide();
		$(".go_after").hide();
		s_start();
	})
	$(".go_back").hover(function(){
		$(this).addClass("over");
	},function(){
		$(this).removeClass("over");
	})
	$(".go_after").hover(function(){
		$(this).addClass("over");
	},function(){
		$(this).removeClass("over");
	})
	function auto_play(){
		if(index==$(".main_slide li").length-1){index=-1;}
		index += 1;
		show();
	}
	function s_start(){
		auto = setInterval(auto_play,waittime);
	}
	function s_stop(){
		clearInterval(auto)
	}
s_start();
		
	};
})(jQuery);
