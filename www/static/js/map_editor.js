
function SpriteSheetItem(x,y,width,height){
	this.offset_x = ko.observable(x || 0);
	this.offset_y = ko.observable(y || 0);
	this.width = ko.observable(width || 0);
	this.height = ko.observable(height || 0);
}

SpriteSheetItem.prototype.to_style = function(){
	return { top: this.offset_y() + "px",
			 left: this.offset_x() + "px",
			 width: this.width() + "px",
			 height: this.height() + "px" }
};

function SpriteSheet(sheet, grid_width, snap_size){
	this.sheet = ko.observable(sheet);
	this.grid_width = ko.observable(grid_width || -1);
	this.snap_size = ko.observable(snap_size || 17);
	this.grid_list = ko.observableArray();
}

SpriteSheet.prototype.add_item = function(x,y,width,height){
	var result = new SpriteSheetItem(x,y,width,height);
	this.grid_list.push(result);
	return result;
};


function SpriteListItem(layer, sheet, map_x, map_y, offset_x, offset_y, width, height){
	this.layer = ko.observable(layer);
	this.sheet = ko.observable(sheet);
	this.map_x = ko.observable(map_x || 0);
	this.map_y = ko.observable(map_y || 0);
	this.offset_x = ko.observable(offset_x || 0);
	this.offset_y = ko.observable(offset_y || 0);
	this.width = ko.observable(width || 0);
	this.height = ko.observable(height || 0);
	
	this.sheet_loc = ko.computed(function(){
		return [this.offset_x(),
				this.offset_y()];
	},this);
	this.sheet_rect = ko.computed(function(){
		return [this.offset_x(),
				this.offset_y(),
				this.offset_x()+this.width(),
				this.offset_y()+this.height()];
	},this);
	this.map_loc = ko.computed(function(){
		return [this.map_x(),
				this.map_y()];
	},this);
	this.map_rect = ko.computed(function(){
		return [this.map_x(),
				this.map_y(),
				this.map_x()+this.width(),
				this.map_y()+this.height()];
	},this);
}

SpriteListItem.prototype.contains = function(x,y){
	var rect = this.map_rect();
	return (rect[0] <= x && rect[2] > x &&
		    rect[1] <= y && rect[3] > y);
};

SpriteListItem.prototype.to_style = function(){
	return { top: this.map_y() + "px",
			 left: this.map_x() + "px",
			 width: this.width() + "px",
			 height: this.height() + "px" }
};



function Appl(width,height){
	this.Constants = {
		tools: ["paint","delete"],
		default_layer: "background"
	};

	this.width = ko.observable(width || 0);
	this.height = ko.observable(height || 0);

	this.tools = ko.observableArray(this.Constants.tools);
	this.selected_tool = ko.observable(this.Constants.tools[0]);
	
	this.layers = ko.observableArray([this.Constants.default_layer]);
	this.selected_layer = ko.observable(this.layers()[0]);
	
	this.sprite_sheets = ko.observableArray();
	this.selected_sheet = ko.observable();
	this.sheet_drag_rect = ko.observable();
	this.selected_sprite_item = ko.observable();
	
	this.sprite_list = ko.observableArray();
	this.sprite_list.subscribe($.proxy(this._update_layer_names_,this));
	
	this.selected_sprite_item_index = ko.computed(function(){
		if(this.selected_sheet() && this.selected_sprite_item()){
			return this.selected_sheet().grid_list().indexOf(this.selected_sprite_item());
		}
		return -1;
	},this);
}

Appl.prototype._update_layer_names_ = function(){
	this.layers(this._get_layer_names_());
};

Appl.prototype._get_layer_names_ = function() {
	var result = [this.Constants.default_layer];
	
	for(var i = 0; i<this.sprite_list().length; i++) {
		if(result.indexOf(this.sprite_list()[i].layer()) === -1) {
			result.push(this.sprite_list()[i].layer());
		}
	}
	
	result.sort();
	return result;
}

Appl.prototype.delete_layer = function(){
	// disable if selected_layer is "background"
	// will delete all sprite_list items with this layer and
	// set the selected_layer to "background"
};

Appl.prototype.add_sprite_sheet = function(sheet, grid_width, snap_size) {
	var item = new SpriteSheet(sheet, grid_width, snap_size);
	this.sprite_sheets.push(item);
	this.selected_sheet(item);
	return item;
};

Appl.prototype.add_spite_sheet_item = function(){
	// add the sheet_drag_rect as an item to the selected sheet and
	// make it the selected_sheet_item
	// TODO: worry about overlaps!
	var x = this.sheet_drag_rect()[0];
	var y = this.sheet_drag_rect()[1];
	var width = this.sheet_drag_rect()[2];
	var height = this.sheet_drag_rect()[3];
	this.selected_sprite_item(this.selected_sheet().add_item(x,y,width,height));
};

Appl.prototype.add_sprite_list_item = function(x,y){
	// add sprite item x,y to selected layer of sprite_list with selected sprite
	var layer = this.selected_layer();
	var sheet = this.selected_sheet().sheet();
	var item = this.selected_sprite_item();
	this.sprite_list.push(new SpriteListItem(layer, sheet, x, y, 
										 	 item.offset_x(), item.offset_y(), 
										 	 item.width(), item.height()));
};

Appl.prototype.remove_sprite_list_item = function(x,y){
	// remove sprite item x,y from selected layer of sprite_list
	var sprite = null;
	var width = null;
	var height = null;
	
	for(var i = this.sprite_list().length; i>0; i--) {
		sprite = this.sprite_list()[i-1];
		if(sprite.layer() == this.selected_layer() && sprite.contains(x,y)===true){
			this.sprite_list.splice(i-1,1);
		}
	}
};

Appl.prototype.do_action = function(x,y){
	// perform the selected_tool action at x,y
	if(this.selected_tool() == this.Constants.tools[0]) {
		this.add_sprite_list_item(x,y);	
	}
	else if(this.selected_tool() == this.Constants.tools[1]) {
		this.remove_sprite_list_item(x,y);
	}
};
