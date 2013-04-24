// Helper Functions
;(function ($) {
    $.extend($.fn, {
        center: function () {
            this.each (function () {
                $(this).css("top", Math.max(0, (($(this).parent().height() - $(this).height()) / 2)));
            });
            return this;
        }
    })
})(Zepto)

// App Ready
$(function () {
	var isTouch = 'ontouchstart' in document.documentElement;
	var touchTrack = false;
	var touch = {};
    // run mobile check
    if (isMobile.apple.device || isMobile.android.device || isMobile.seven_inch) {
    	// is mobile hide slide arrows
    	$('.next').css('display', 'none');
    	$('.prev').css('display', 'none');
    }
    // get geolocation
    // grab slide data
    $.get('data/archive', function (data) {
    	$.each(data, function(index, item) {
    		console.log(item);
    	});
    });
    // enable the slider
    $('#days').swipeSlide({first: $('#days ul li').length, useTranslate3d: false, delay: 0.5});
    // Add tap/swipe down gesture
    /* $('#days ul li').on((isTouch ? 'touchstart' : 'mousedown'), function (ev) {
    	touchTrack = true;
    	ev = isTouch ? ev.touches[0] : ev;
    	touch.start = { x: ev.pageX, y: ev.pageY }; 
    });
    $('#days ul li').on((isTouch ? 'touchmove'  : 'mousemove'), function (ev) {
	    ev = isTouch ? ev.touches[0] : ev;
    	touch.end = { x: ev.pageX, y: ev.pageY }; 
    });
    $('#days ul li').on((isTouch ? 'touchend touchcancel touchleave' : 'mouseup mouseout mouseleave'), function (ev) {
    	if (touchTrack) {
    		touchTrack = false;
		    var distanceX = (touch.end.x - touch.start.x);
		    var distanceY = (touch.end.y - touch.start.y);
		    if(Math.abs(distanceX) < 10) {
			    $(this).fadeOut("fast", function () {
    			    $(this).toggleClass("mars").fadeIn("fast", function () {
        				$(this).css({
            				opacity: 1.0
            			})
        			});
        			$(this, 'img').attr('src', '/images/flame.svg');
    				$(this).toggleClass("earth").fadeIn("fast", function () {
        				$(this).css({
            				opacity: 1.0
            			});
        			});
    			});		    
		    }
		}
    }); */ // Disabled until I come up with a better solution
    // center all elements on resize etc
    $(window).on("load resize orientationchange", function () {
	    $('.center').center();
	});
});