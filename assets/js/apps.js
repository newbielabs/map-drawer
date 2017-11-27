var app = new thisApp();

$(function() {
	app.initMap();

	$('.stroke-color, .fill-color').spectrum({
		preferredFormat: 'hex',
	    color: '#f00',
	    cancelText: 'Close',
	    chooseText: 'Apply',
	});

	$('.stroke-color').bind('change', function() {
		app.changeStrokeColor(this.value);
	});

	$('.fill-color').bind('change', function() {
		app.changeFillColor(this.value);
	});

	$('nav li>.action').bind('click', function() {
		$('nav li>.action').removeClass('active');
		$('nav li .setting').hide();
		$(this).addClass('active');
		$('#' + $(this).attr('rel')).find('.setting').show();

		if ($(this).attr('rel') == 'line')
		{
			app.poly.setMap(null);
			app.poly = null;
        	app.initLine();
		}
		else
		{
			app.poly.setMap(null);
			app.poly = null;
        	app.initArea();
		}
	});

	$('.pop textarea').bind('click', function () {
		$(this).select();
	});
	
	$('nav > ul').niceScroll({cursorborder:'none',horizrailenabled: false,cursorcolor: "#CCC",background: "rgba(0,0,0,0.1)",cursorfixedheight:60});
});

function thisApp()
{
	this.map;
	this.poly;

	this.initMap = function()
	{
        app.map = new google.maps.Map(document.getElementById('map'), {
          	zoom: 12,
          	center: {lat: -6.914744, lng: 107.609810},
				streetViewControl: false,
        });

        app.initLine();

        google.maps.event.addListener(app.map, 'click', function(e) {app.drawLine(e)});
    }

    this.initLine = function(event)
    {
        app.poly = new google.maps.Polyline({
			strokeColor: $('#line .stroke-color').val(),
			strokeOpacity: 1.0,
			strokeWeight: 3,
			editable: true,
		});

		app.poly.setMap(app.map);
		google.maps.event.addListener(app.poly, 'rightclick', function(e) {app.removeLine(e)});
    }

    this.initArea = function(event)
    {
        app.poly = new google.maps.Polygon({
			strokeColor: $('#area .stroke-color').val(),
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: $('#area .fill-color').val(),
			fillOpacity: 0.35,
			editable: true,
        });

		app.poly.setMap(app.map);
		google.maps.event.addListener(app.poly, 'rightclick', function(e) {app.removeLine(e)});
    }

    this.drawLine = function(event)
    {
		var path = app.poly.getPath();

        path.push(event.latLng);

        // console.log(path.getArray());
    }

    this.removeLine = function(event)
    {
    	if ( ! app.poly || event.vertex == undefined) {
			return;
		}

		app.poly.getPath().removeAt(event.vertex);
    }

    this.changeStrokeColor = function(color)
    {
    	if ( ! app.poly || color == undefined) {
			return;
		}

    	app.poly.setOptions({strokeColor: color});
    }

    this.changeFillColor = function(color)
    {
    	if ( ! app.poly || color == undefined) {
			return;
		}

    	app.poly.setOptions({fillColor: color});
    }

    this.getCode = function()
    {
    	$('.pop').fadeIn('fast', function() {
    		var data;
			if ($('nav li>.action.active').attr('rel') == 'line')
			{

				data = {
					strokeColor: $('#line .stroke-color').val(),
					path: app.poly.getPath().getArray()
		        };
			}
			else
			{
				data = {
					strokeColor: $('#area .stroke-color').val(),
					fillColor: $('#area .fill-color').val(),
					paths: app.poly.getPath().getArray()
		        };
			}

    		$('.pop textarea').val(JSON.stringify(data));
    	});
    }

    this.closePop = function()
    {
    	$('.pop').hide();
    	$('.pop textarea').val('');
    }
}