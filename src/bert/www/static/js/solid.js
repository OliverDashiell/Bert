function Solid(x,y) {
    this.x = x;
    this.y = y;
}

Solid.prototype = new Unit();

Solid.prototype.move_to = function() {
    // nothing should happend (solids dont move)
};

Solid.prototype.pending_collides = function(unit) {
    // wont allow units to move into this static location
    if(this.x === unit.pending.x && this.y === unit.pending.y) {
        return true;
    }
    return false;
};