$(function(){
	$(window).scroll(function(){
		var top = $("body")[0].scrollTop;
		if(top>500){
			$(".toTop").removeClass("none");
		}else{
			$(".toTop").addClass("none");
		}
	})
	$(".toTop a").bind("click",function(event){
        $('html, body').stop().animate({
            scrollTop: 0
        }, 1000,'swing');
        event.preventDefault();
	})
});