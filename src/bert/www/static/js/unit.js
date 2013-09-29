function Unit(x,y){
	this.x = x || 0;
	this.y = y || 0;
	this.pending = {};
}

Unit.prototype.loc = function(){
	return [this.x, this.y];
};

Unit.prototype.pending_loc = function(){
    if(this.pending.x !== undefined){
        return [this.pending.x, this.pending.y];
    }
	return [this.x, this.y];
};

Unit.prototype.move_to = function(x,y){
	this.pending.x = x;
	this.pending.y = y;
};

Unit.prototype.clear_move = function() {
    delete this.pending.x;
    delete this.pending.y;
}

Unit.prototype._commit_ = function(){
	for(name in this.pending){
		this[name] = this.pending[name];
        delete this.pending[name];
	}
};

Unit.prototype.collides = function(unit) {
    if(this.x === unit.x && this.y === unit.y) {
        return true;
    } 
    return false;
};

Unit.prototype.pending_collides = function(unit) {
    var other_loc = unit.pending_loc();
    var my_loc = this.pending_loc();
    if(my_loc[0] == other_loc[0] && my_loc[1] == other_loc[1]){
         return true;   
    }
    return false;
};