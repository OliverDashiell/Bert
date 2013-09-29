
function Sprite(){};

Sprite.prototype.init = function(width,height,paneX,paneY){
	this.width = width;
	this.height = height;
	this.paneX = paneX || 0;
	this.paneY = paneY || 0;
};

Sprite.prototype.bind = function(selector){
	this.max_width = document.width;
	this.target = $(selector);
	this.target.css({width:this.width,height:this.height});
	this.display();
};

Sprite.prototype.set_paneX = function(value, display){
	this.paneX = value;
	if(display === true){
		this.display();
	}
};

Sprite.prototype.pace_x = function(){
	var left = this.target.css("left");
	if(left === "auto"){
		left = 0;
		this.target.css("position","relative");
	} else {
		left = parseInt(left,10) + this.pace;
		if(left > this.max_width){
			left = (this.width * -1) + this.pace;
		} else if(left < -this.width) {
			left = this.max_width;
		}
	}
	this.target.css("left", left + "px");
};

Sprite.prototype.set_paneY = function(value, display){
	this.paneY = value;
	if(display === true){
		this.display();
	}
};

Sprite.prototype.display = function(selector){
	var offset_x = this.paneX * this.width;
	var offset_y = this.paneY * this.height;
	this.target.css("background-position","-" + offset_x + "px -" + offset_y + "px");
};

