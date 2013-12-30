
function SpriteSheetItem(x,y,width,height){
	this.offset_x = ko.observable(x || 0);
	this.offset_y = ko.observable(y || 0);
	this.width = ko.observable(width || 0);
	this.height = ko.observable(height || 0);
}

SpriteSheetItem.prototype.to_style = function(offset){
    if(!offset){
        offset = 0; 
    }
	return { top: this.offset_y() + "px",
			 left: this.offset_x() + "px",
			 width: (this.width()+offset) + "px",
			 height: (this.height()+offset) + "px" }
};

function SpriteSheet(sheet, grid_width, snap_size){
	this.sheet = ko.observable(sheet);
	this.grid_width = ko.observable(grid_width || -1);
	this.snap_size = ko.observable(snap_size || 16);
	this.grid_list = ko.observableArray();
    this.sheet_width = ko.observable(0);
    this.sheet_height = ko.observable(0);
    
    this.to_size_style = ko.computed(function(){
        return {
            width: this.sheet_width() + "px",
            height: this.sheet_height() + "px"
        };
    },this);
    
    this.to_style = ko.computed(function(){
        return {
            width: this.sheet_width() + "px",
            height: this.sheet_height() + "px",
            'background-image': "url(images/spritesheets/"+this.sheet()+")",
            'background-repeat': "no-repeat"
        };
    },this);
}

SpriteSheet.prototype.add_item = function(x,y,width,height){
	var result = new SpriteSheetItem(x,y,width,height);
	this.grid_list.push(result);
	return result;
};


SpriteSheet.prototype.remove_item = function(item){
	var index = this.grid_list.indexOf(item);
    if(index !== -1){
        this.grid_list.splice(index, 1);
    }
	return index;
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
	this.map_index = ko.computed(function(){
		return [this.map_x()/16,
				this.map_y()/16];
	},this);
	this.map_coords = ko.computed(function(){
		return [this.map_x(),
				this.map_y(),
				this.map_x()+this.width(),
				this.map_y()+this.height()];
	},this);
	this.map_rect = ko.computed(function(){
		return [this.map_x(),
				this.map_y(),
				this.width(),
				this.height()];
	},this);
}

SpriteListItem.prototype.contains = function(x,y){
	var rect = this.map_coords();
	return (rect[0] <= x && rect[2] > x &&
		    rect[1] <= y && rect[3] > y);
};

SpriteListItem.prototype.overlaps = function(item){
    return checkOverlap(this.map_rect(),item.map_rect());
};

SpriteListItem.prototype.to_style = function(offset){
    if(!offset){
        offset = 0; 
    }
	return { top: this.map_y() + "px",
			 left: this.map_x() + "px",
			 width: (this.width()+offset) + "px",
			 height: (this.height()+offset) + "px",
            'background-repeat': "no-repeat",
            'background-image': "url(images/spritesheets/"+this.sheet()+")",
            'background-position': "-"+this.offset_x()+"px -"+this.offset_y()+"px"}
};


function Appl(width,height,grid_size){
	this.Constants = {
		tools: ["paint","delete"],
		default_layer: "background",
        default_grid_size: 16
	};

	this.width = ko.observable(width || 640);
	this.height = ko.observable(height || 480);
    this.grid_size = ko.observable(grid_size || this.Constants.default_grid_size);

	this.tools = ko.observableArray(this.Constants.tools);
	this.selected_tool = ko.observable(this.Constants.tools[0]);
	
	this.layers = ko.observableArray([this.Constants.default_layer]);
	this.selected_layer = ko.observable(this.layers()[0]);
	
	this.sprite_sheets = ko.observableArray();
	this.selected_sheet = ko.observable();
	this.sheet_drag_rect = ko.observable();
	this.selected_sprite_item = ko.observable();
    this.selected_sprite_item.subscribe(function(){
        this.selected_tool(this.Constants.tools[0]);
    },this);
    this.selected_sheet.subscribe(function(){
        this.selected_sprite_item(null);
    },this);
	
	this.sprite_list = ko.observableArray();
	this.sprite_list.subscribe($.proxy(this._sprites_changed_,this));
	
	this.selected_sprite_item_index = ko.computed(function(){
		if(this.selected_sheet() && this.selected_sprite_item()){
			return this.selected_sheet().grid_list().indexOf(this.selected_sprite_item());
		}
		return -1;
	},this);
    
    this.to_style = ko.computed(function(){
        return {
            width: this.width() + "px",
            height: this.height() + "px"
        };
    },this);
}

Appl.prototype.save = function(){
    // returns an object to be saved
    return {};  
};

Appl.prototype.load = function(saved_map){
    // will update state from saved_map
};

Appl.prototype._sprites_changed_ = function(sprite_list_array){
    /*
        from the sprite list array
        check each item's layer is in this.layers()
        if not in this.layer then add it
     */
	
    for(var i = 0; i<this.sprite_list().length; i++) {
        if(this.layers.indexOf(this.sprite_list()[i].layer()) === -1) {
            this.layers.push(this.sprite_list()[i].layer());
        }
    }
};

Appl.prototype._get_layer_names_ = function() {    
    return this.layers();
};

Appl.prototype.get_layers_for_update = function(){
    var result = [];
    var layers = this._get_layer_names_();
    for(var i=0; i<layers.length;i++){
        result.push({
            title: ko.observable(layers[i]),
            origin: layers[i]
        });
    }
    return result;
};

Appl.prototype.update_layers = function(new_layer_items){
    var layer_names = this._get_layer_names_();
    var new_layer_names = [];
    var new_layer_titles = [];
    
    for(var i = 0; i<new_layer_items.length; i++){
        var from_name = new_layer_items[i].origin;
        var to_name = new_layer_items[i].title();
        
        new_layer_names.push(from_name);
        new_layer_titles.push(to_name);
        
        if(this.selected_layer() == from_name && from_name != to_name){
            this.selected_layer(to_name);
        }
    }
    
    var layers_to_delete = layer_names.diff(new_layer_names);
    for(var i = 0; i<layers_to_delete.length; i++){
        this._delete_layer_(layers_to_delete[i]);
    }
    
    this.layers(new_layer_titles);
    this._update_sprite_layers_(new_layer_items);
};

Appl.prototype._update_sprite_layers_ = function(new_layer_names){
    for(var j = 0; j<new_layer_names.length; j++){
        if(new_layer_names[j].title() != new_layer_names[j].origin){
            for(var i = 0; i<this.sprite_list().length; i++){
                if(this.sprite_list()[i].layer() === new_layer_names[j].origin) {
                    this.sprite_list()[i].layer(new_layer_names[j].title());
                }
            }
        }
    }
    this._sort_sprite_list_();
};

Appl.prototype._sort_sprite_list_ = function(){
    var layer_names = this._get_layer_names_();
    this.sprite_list.sort(function(l,r){
        var l_index = layer_names.indexOf(l.layer());
        var r_index = layer_names.indexOf(r.layer());
        
        return l_index - r_index;
    });
}

Appl.prototype.delete_layer = function(){
	// disable if only one layer exsists
	// will delete all sprite_list items with this layer and
	// set the selected_layer to layer 0

    if(this.layers().length > 1) {
        this._delete_layer_(this.selected_layer());
    }
};

Appl.prototype._delete_layer_ = function(layer_to_delete){        
    for(var i = this.sprite_list().length; i>0; i--) {
        sprite = this.sprite_list()[i-1];
        
        if(sprite.layer() == layer_to_delete){
            this.sprite_list.splice(i-1,1);
        }
    }
    
    var layer_to_delete_index = this.layers().indexOf(layer_to_delete);
    if(layer_to_delete_index !== -1){
        this.layers.splice(layer_to_delete_index, 1);
    }
    this.selected_layer(this.layers()[0]);
};

Appl.prototype.add_sprite_sheet = function(sheet, grid_width, snap_size) {
	var item = new SpriteSheet(sheet, grid_width, snap_size);
	this.sprite_sheets.push(item);
	this.selected_sheet(item);
	return item;
};

Appl.prototype.snap_to_grid = function(val){
    var snap_size = this.selected_sheet().snap_size();
    var snap = snap_size * Math.floor(val/snap_size);
    if (snap >= snap_size) {
        return snap;
    }
    else {
        return null;
    }
};

Appl.prototype.add_spite_sheet_item = function(){
	// add the sheet_drag_rect as an item to the selected sheet and
	// make it the selected_sheet_item
	// TODO: worry about overlaps!
	var x = this.sheet_drag_rect()[0];
	var y = this.sheet_drag_rect()[1];
	var width = this.sheet_drag_rect()[2];
	var height = this.sheet_drag_rect()[3];
  
    if(x != null && y != null && width != null && height != null) {
      this.selected_sprite_item(this.selected_sheet().add_item(x,y,width,height));
    }
};

Appl.prototype.delete_sprite_sheet_item = function(){
    //delete selected sprite_sheet_item
    if(this.selected_sprite_item()){
        var item = this.selected_sprite_item();
        this.selected_sprite_item(null);
        this.selected_sheet().remove_item(item);
    }
};

Appl.prototype.add_sprite_list_item = function(x,y){
	// add sprite item x,y to selected layer of sprite_list with selected sprite
	var adjusted_x = this.snap_to_grid(x);
    var adjusted_y = this.snap_to_grid(y);
    var layer = this.selected_layer();
	var sheet = this.selected_sheet().sheet();
	var item = this.selected_sprite_item();
    if(layer && sheet && item){
        var new_item = new SpriteListItem(layer, sheet, adjusted_x, adjusted_y, 
                                                 item.offset_x(), item.offset_y(), 
                                                 item.width(), item.height());
        var other_item = null;
        
        for(var i=0; i < this.sprite_list().length; i++){
            other_item = this.sprite_list()[i];
            if(new_item.layer() === other_item.layer() &&
               new_item.overlaps(other_item)){
                //console.log(new_item.map_rect(),other_item.map_rect());
                return;   
            }
        }
        this.sprite_list.push(new_item);
    }
    this._sort_sprite_list_();
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
