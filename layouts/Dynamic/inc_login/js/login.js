jQuery(function($){
				

				$(".ac_login").toggle(function(){
		$("#login_form").show()							   
	},function(){
		$("#login_form").hide()							   
	})		
	
	 $(".ac_login").click(function(e) {
       
            $("#login_form").show();
            e.stopPropagation();
       
    });
    $("#login_form").click(function(e) {
        e.stopPropagation();
    });
    $(document).click(function() {
        $("#login_form").hide();
    });

})
function enterIn(evt){
	var browser=navigator.appName
  		var evt=evt?evt:(window.event?window.event:null);
  		if(browser=="Microsoft Internet Explorer"){
			if (evt.keyCode==13){
				document.getElementById("button_login").click();
				}
		}
}

function completeLogin(ret_obj, response_tags, params, fo_obj) {
    var url =  current_url.setQuery('act','');
    location.href = url;
}

