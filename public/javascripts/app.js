var carousel = new Carousel("#carousel");
var earth = new Earth("#earth", "#carousel");

function dataCenter(element) {
	$(element).css("top", Math.max(0, (($(element).parent().height() - $(element).outerHeight()) / 2) + 
                                                $(element).parent().scrollTop()) + "px");
    $(element).css("left", Math.max(0, (($(element).parent().width() - $(element).outerWidth()) / 2) + 
                                                $(element).parent().scrollLeft()) + "px");
}

/**
 * requestAnimationFrame and cancel polyfill
 */
(function () {
    carousel.init();
    //earth.init();
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
    };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
    };
    
    //$('#carousel ul').prepend('<li><h2>first dataset ...</h2></li>');
    //carousel.addPane();

        $(window).on("load resize orientationchange", function () {
      //$('.wind div').css("position","re");
dataCenter("li .data");
dataCenter(".wind .data");
dataCenter(".pressure .data");
dataCenter(".sunset .data");
dataCenter(".sunrise .data");
});

}());

function Earth(element, touch) {
	var self = this;
	element = $(element);
	touch = $(touch);
	current = 0;
	panes = 2;

	    function handleHammer(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();

        switch (ev.type) {
        case 'dragdown':
        	console.log('dragdown');
        	console.log(ev.gesture.deltaY);
        	px = (($('>ul>li',element).height / panes) / 100) * ev.gesture.deltaY;
            element.css("top", ev.gesture.deltaY + "px");
            break;
        case 'dragup':
            console.log('dragup');
            var px = ((element.height * 1) / 100) * ev.gesture.deltaY;
            element.css("top", ev.gesture.deltaY + "px");
            break;
        case 'swipedown':
            self.prev();
            ev.gesture.stopDetect();
            console.log('swipedown');
            break;
        }
    }
/*element.hammer({
        drag_lock_to_axis: true
    })
        .on("dragdown dragup release", handleHammer);*/}

/**
 * super simple carousel
 * animation between panes happens with css transitions
 */
function Carousel(element) {
    var self = this;
    element = $(element);

    var container = $(">ul", element);
    var panes = $(">ul>li", element);

    var pane_width = 0;
    var pane_count = panes.length;

    var current_pane = 0;


    /**
     * initial
     */
    this.init = function () {
        setPaneDimensions();
        $(window).on("load resize orientationchange", function () {
            setPaneDimensions();
            //updateOffset();
        })
    };


    /**
     * set the pane dimensions and scale the container
     */
    function setPaneDimensions() {
        pane_width = element.width();
        panes.each(function () {
            $(this).width(pane_width);
        });
        container.width(pane_width * pane_count);
    };


    /**
     * show pane by index
     * @param   {Number}    index
     */
    this.showPane = function (index) {
        // between the bounds
        index = Math.max(0, Math.min(index, pane_count - 1));
        current_pane = index;

        var offset = -((100 / pane_count) * current_pane);
        setContainerOffset(offset, true);
    };

    this.addPane = function () {
        container = $(">ul", element);
        panes = $(">ul>li", element);
        pane_count = panes.length;
        current_pane = current_pane + 1;
        setPaneDimensions();
        //this.showPane(current_pane);
        var index = Math.max(0, Math.min(current_pane, pane_count - 1));
        current_pane = index;

        var offset = -((100 / pane_count) * current_pane);
        setContainerOffset(offset, false);
    }

    function setContainerOffset(percent, animate) {
        container.removeClass("animate");

        if (animate) {
            container.addClass("animate");
        }

        if (Modernizr.csstransforms3d) {
            container.css("transform", "translate3d(" + percent + "%,0,0) scale3d(1,1,1)");
        } else if (Modernizr.csstransforms) {
            container.css("transform", "translate(" + percent + "%,0)");
        } else {
            var px = ((pane_width * pane_count) / 100) * percent;
            container.css("left", px + "px");
        }
    }

    this.next = function () {
        return this.showPane(current_pane + 1, true);
    };
    this.prev = function () {
        return this.showPane(current_pane - 1, true);
    };



    function handleHammer(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();

        switch (ev.type) {
        case 'dragright':
        case 'dragleft':
            // stick to the finger
            var pane_offset = -(100 / pane_count) * current_pane;
            var drag_offset = ((100 / pane_width) * ev.gesture.deltaX) / pane_count;

            // slow down at the first and last pane
            if ((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
                (current_pane == pane_count - 1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
                drag_offset *= .4;
            }

            setContainerOffset(drag_offset + pane_offset);
            break;

        case 'swipeleft':
            self.next();
            ev.gesture.stopDetect();
            break;

        case 'swiperight':
            self.prev();
            ev.gesture.stopDetect();
            break;

        case 'release':
            // more then 50% moved, navigate
            if (Math.abs(ev.gesture.deltaX) > pane_width / 3) {
                if (ev.gesture.direction == 'right') {
                    self.prev();
                } else {
                    self.next();
                }
            } else {
                self.showPane(current_pane, true);
            }
            break;
        }
    }

    element.hammer({
        drag_lock_to_axis: true
    })
        .on("release dragleft dragright swipeleft swiperight", handleHammer);
}

   $.get('data/latest', function (data) {
	  console.log(data);
	  var direction, time, date;
	  $('h2.atmo').text('Sol '+data.sol+' it was '+data.atmo_opacity+' on Mars.');
	  $('.mintemp').html(' '+parseFloat(((data.min_temp_fahrenheit -32) * 5 / 9).toFixed(2)) + ' &#x2103; ');
	  $('.maxtemp').html(' '+parseFloat(((data.max_temp_fahrenheit -32) * 5 / 9).toFixed(2)) + ' &#x2103; ');
	  switch (data.wind_direction) {
		  case 'N': direction = 'North'; break;
		  case 'S': direction = 'South'; break;
		  case 'E': direction = 'East'; break;
		  case 'W': direction = 'West'; break;
		  default: direction = ''; break;
	  }
	  $('.wind .data h3').text(parseFloat((Math.round(data.wind_speed * 3600 / 1610.3*1000)/1000).toFixed(2)) + ' mph ' + direction);
	  $('.pressure .data h3').text(parseFloat((data.pressure / 100).toFixed(2)) + ' hPa');
	  date = (new Date(data.sunrise));
	  time = date.getMinutes();
	  switch (time) {
		  case 0: time = '00'; break;
	  }
	  $('.sunrise .data h3').text(date.getHours() + ':' + time);
	  date = (new Date(data.sunset));
	  time = date.getMinutes();
	  switch (time) {
		  case 0: time = '00'; break;
	  }
  	  $('.sunset .data h3').text(date.getHours() + ':' + time);
   });
   
      $.get('data/archive', function (data) {
   	  var atmo, slide;
	  $.each(data, function(i, item) {
		  	//alert(data[i].sol);
		  	switch (data[i].atmo_opacity) {
			  	case null:
			  		atmo = '';
			  		break;
			  	default:
			  		atmo =  ' it was '+data[i].atmo_opacity+' on Mars';
			  		break;
		  	}
		  	slide = $('<li><div class="data"><h2>Sol '+data[i].sol+atmo+'</h2><img src="/images/sun.svg" type="image/svg+xml" style="height: 40%;"/><h3>Min: '+parseFloat(((data[i].min_temp_fahrenheit -32) * 5 / 9).toFixed(2)) + ' &#x2103; / Max: '+parseFloat(((data[i].max_temp_fahrenheit -32) * 5 / 9).toFixed(2)) + ' &#x2103;</h3></div></li>');
		  	slide.data('slideno',i);
		  	$('#carousel ul').prepend(slide);
            carousel.addPane();
    	});
    	dataCenter("li .data");
   });