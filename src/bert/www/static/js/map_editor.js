
$(function(){
	var appl = window.appl = new Appl();
	appl.sheets_visible = ko.observable(false);
	appl.sprites_visible = ko.observable(false);
	appl.edit_layers = ko.observableArray();
	
	appl.selected_sheet.subscribe(function(sheet){
		if(sheet && sheet.sheet_width() === 0){
			var image_src = "images/spritesheets/" + sheet.sheet();
			var imageObj = new Image();
			imageObj.onload = function() {
				sheet.sheet_width(imageObj.width);
				sheet.sheet_height(imageObj.height);
			};
			imageObj.src = image_src;
		}
	});
	
	$('.sheets-tool').click(function(){
		appl.sheets_visible(!appl.sheets_visible());
	});
	$('.sprites-tool').click(function(){
		appl.sprites_visible(!appl.sprites_visible());
	});
	$("#map").mousedown(function(e){
		var mouseout = false;
        var $map = $("#map");
        var posX = e.pageX - $map.offset().left,
            posY = e.pageY - $map.offset().top;
        appl.do_action(posX, posY);
        
        document.onmousemove = function(e) {
            posX = e.pageX - $map.offset().left,
                posY = e.pageY - $map.offset().top;
            appl.do_action(posX, posY);
        }
        document.onmouseup = function() {
            document.onmousemove = null
        }
	});
	
	var $container = $('#spitesheetgrid');
	var $selection = $('<div>').addClass('selection-box');
	var selection_border_width = 1;
	
	$container.on('mousedown', function(e) {
		if(e.target !== $container[0]) return;
		
		var click_y = e.pageY,
			click_x = e.pageX,
			move_x = 0,
			move_y = 0,
			width = 0,
			height = 0;

		$selection.css({
			'top':	appl.snap_to_grid(click_y - $container.offset().top),
			'left':	appl.snap_to_grid(click_x - $container.offset().left),
			'width': 0,
			'height': 0
		});
		$selection.appendTo($container);
		
		$container.on('mousemove', function(e) {			
			move_x = e.pageX;
			move_y = e.pageY;
			var new_x, new_y;

			width = appl.snap_to_grid(Math.abs(move_x - click_x)),
			height = appl.snap_to_grid(Math.abs(move_y - click_y)),
			
			new_x = (move_x < click_x) ? (click_x - width) : click_x;
			new_y = (move_y < click_y) ? (click_y - height) : click_y;
			
			$selection.css({
			'width': width - selection_border_width,
			'height': height - selection_border_width,
			'top': appl.snap_to_grid(new_y - $container.offset().top),
			'left': appl.snap_to_grid(new_x - $container.offset().left)
			});
			
		}).on('mouseup', function(e) {
			$container.off('mousemove');
			$container.off('mouseup');
			var origin_x = click_x,
				origin_y = click_y;
			
			// determine origin from click or move
			if(move_y < click_y) {
				origin_y = move_y;
			}
			if(move_x < click_x){
				origin_x = move_x;
			}
			
			var dragged_rect = [
				appl.snap_to_grid(origin_x - $container.offset().left) || 0,
				appl.snap_to_grid(origin_y - $container.offset().top) || 0,
				width,
				height
			];
			if(width >= appl.grid_size() && height >= appl.grid_size()){
				appl.sheet_drag_rect(dragged_rect);
			} else {
				appl.sheet_drag_rect(null);
				$selection.remove();
			}
		});
	});
	
	appl.__add_item__ = function(){
		$selection.remove();
		appl.add_spite_sheet_item();
	};
	
	appl.__remove_item__ = function(){
		appl.delete_sprite_sheet_item();
	};
	
	appl.__layer_dialog__ = function(){
		this.edit_layers.removeAll();
		this.edit_layers(this.get_layers_for_update());
		$(".lyr-dialog-container").show();
	};
	
	appl.__upload_dialog__ = function(){
		$(".sps-dialog-container").show();
	};
	
	appl.__open_map__ = function(){
		
	};
	
	appl.__save_map__ = function(){
		$(".mps-dialog-container").show();
		$("input[type=text]",".mps-dialog-container").first().focus();
	};
	
	set_background_grid("#map",appl.grid_size(),"#ccc");
	set_background_grid("#spitesheetgrid",appl.grid_size(),"#ccc");
	
	$(".dialog-close",".sps-dialog-container").click(function(evt){
		$(".sps-dialog-container").hide();
		evt.preventDefault();
	});
	$(".dialog-content",".sps-dialog-container").ajaxForm(function(response) {
		$(".sps-dialog-container").hide();
		// add missing new sprite sheets
		var data = $.parseJSON(response);
		var new_sheets = data.diff(appl._get_sheet_names_());
		for(var i=0; i<new_sheets.length; i++){
			appl.add_sprite_sheet(new_sheets[i]);
		}
	});
	
	$(".dialog-close",".mps-dialog-container").click(function(evt){
		$(".mps-dialog-container").hide();
		evt.preventDefault();
	});
	$(".dialog-content",".mps-dialog-container").ajaxForm({beforeSubmit:function(formData, jqForm, options){
		$(".mps-dialog-container").hide();
		formData.push({name:'filedata',value:ko.mapping.toJSON(appl),type:'json',required:false});
		console.log(formData);
		return false;
	}});
	
    function evt_to_item(evt){
        var origin = $(evt.target).parents("li").attr("data-item");
        for(var i=0; i < appl.edit_layers().length; i++){
            if(appl.edit_layers()[i].origin===origin){
                return appl.edit_layers()[i];
            }
        }
    };
    
	$(".lyr-dialog-container").
        delegate(".up-button", "click", function(evt){
            console.log("layer up");
            var item = evt_to_item(evt);
            var index = appl.edit_layers.indexOf(item);
            appl.edit_layers.splice(index, 1);
            appl.edit_layers.splice(index-1, 0, item);
            evt.preventDefault();
            return false;
        }).
        delegate(".down-button", "click", function(evt){
            console.log("layer down");
            var item = evt_to_item(evt);
            var index = appl.edit_layers.indexOf(item);
            appl.edit_layers.splice(index, 1);
            appl.edit_layers.splice(index+1, 0, item);
            evt.preventDefault();
            return false;
        }).
	    delegate(".delete-layer-button", "click", function(evt){
            console.log("layer delete");
            var item = evt_to_item(evt);
            var index = appl.edit_layers.indexOf(item);
            appl.edit_layers.splice(index, 1);
            evt.preventDefault();
            return false;
        });
	
	$(".dialog-close",".lyr-dialog-container").click(function(evt){
		$(".lyr-dialog-container").hide();
		evt.preventDefault();
		console.log("form closed");
	});
	$(".dialog-content",".lyr-dialog-container").ajaxForm({beforeSubmit:function(formData, jqForm, options){
		$(".lyr-dialog-container").hide();
		appl.update_layers(appl.edit_layers());
		console.log("form submitted");
		return false;
	}});
	
	$.getJSON("/spritesheets", function(data, textStatus, jqXHR){
		data.sort();
		for(var i=0; i<data.length; i++){
			appl.add_sprite_sheet(data[i]);
		}
		ko.applyBindings(appl);
	});
}); 