(function(jQuery){
	jQuery.fn.FollowMenu = function(option){
		jQuery(this).append('<li id="line"></li>')
		jQueryline = jQuery("#line");
		jQueryline
	   		.width(jQuery(".active").width())
			.css("left",jQuery(".active a").position().left)
			.data("line_left",jQueryline.position().left)
			.data("line_width",jQueryline.width())
			.data("line_bottom",jQueryline.position().bottom)
			var opt = jQuery.extend(option);
	   	jQuery("li:has('a.outer')",this).hover(function(){
										
			jQueryme = jQuery("a.outer",this);
			jQuery(".active a").css("color",opt.overcolor)
			posLeft = jQueryme.position().left;
			

			nWidth = jQueryme.parent().width();
			jQueryline.stop().animate({
				left:posLeft,
				width:nWidth
			},200)
			jQuery("#main_menu li ul").css("left",posLeft+12)
		},function(){
			jQuery(".active a").css("color",opt.outcolor)
			jQueryline.stop().animate({
				left:jQueryline.data("line_left"),
				width:jQueryline.data("line_width")
			},20);
		})
	}
})(jQuery);