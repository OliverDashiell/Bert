
function Zombie(selector,paneX,paneY){
	this.init(136,136,paneX,paneY);
	this.paneY = paneY
	this.bind(selector);
	this.running = null;
	this.rate = 120;
	this.pace = -6;
}
Zombie.prototype = new Sprite();

Zombie.prototype.walk = function(){
    this.reset();
	this._walk_();
}

Zombie.prototype._walk_ = function(){
	var that = this;
	var value = null;
	if(this.paneX < 1 || this.paneX > 4){
		value = 1;
	} else {
		value = this.paneX + 1;
	}
	this.set_paneX(value);
	this.pace_x();
	this.display();
	this.running = setTimeout(function(){that._walk_()},this.rate);
};

Zombie.prototype.stop = function(){
	clearTimeout(this.running);
	this.running = null;
	this.paneX = 0;
	this.display();
};

Zombie.prototype.reset = function(){
	this.target.css({top:-this.height,left:this.max_width+this.width,position:"relative"});
};

Zombie.prototype.upgrade = function(){
    if(this.paneY < 9){
        this.paneY = this.paneY + 1;
    } else {
        this.paneY = 0;
    }
};
