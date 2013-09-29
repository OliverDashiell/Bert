
function Map(width, height){
	this.width = width || 0;
	this.height = height || 0;
	this.units = [];
	this.selected_units = [];
}

Map.prototype.add_unit = function(unit){
    for(var i=0; i<this.units.length; i++) {
        if(this.units[i].collides(unit) === true) {
            throw "unit collision";
        }
    }
    this.units.push(unit);
};

Map.prototype.remove_unit = function(unit){
	this.units.splice(this.units.indexOf(unit),1);
};

Map.prototype.select_unit = function(unit){
	this.selected_units.push(unit);
};

Map.prototype.deselect_unit = function(unit){
	this.selected_units.splice(this.selected_units.indexOf(unit),1);
};

Map.prototype.clear_selection = function(){
	this.selected_units.splice(0,this.selected_units.length);
};

Map.prototype.commit = function() {
    var resolving = true;
    while(resolving){
        resolving = false;
        for(var i=0; i<this.units.length; i++) {
            var unit = this.units[i];
            var collides = false;
            
            for(var j=0; j<this.units.length; j++) {
                var other = this.units[j];
                
                if(unit === other) continue;
                
                if(unit.pending_collides(other)) {
                    collides = true;
                    other.clear_move();
                }
            }
            
            if(collides === true) {
                unit.clear_move();
                resolving = true;
            }
        }
    }
    
    for(var i=0; i<this.units.length; i++) {
        this.units[i]._commit_();
    }
};