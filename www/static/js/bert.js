
function Bert(selector){
	this.init(136,136);
	this.bind(selector);
	this.running = null;
	this.rate = 80;
	this.pace = 12;
}
Bert.prototype = new Sprite();

Bert.prototype.run = function(){
	var that = this;
	var value = null;
	if(this.paneX < 1 || this.paneX > 7){
		value = 1;
	} else {
		value = this.paneX + 1;
	}
	this.set_paneX(value);
	this.pace_x();
	this.display();
	this.running = setTimeout(function(){that.run()},this.rate);
};

Bert.prototype.stop = function(){
	clearTimeout(this.running);
	this.running = null;
	this.paneX = 0;
	this.display();
};

Bert.prototype.toggle_running = function(){
	if(this.running){
		this.stop();
	} else {
		this.run();
	}
};

Bert.prototype.attack = function(){
	var that = this;
	this.set_paneX(9, true);
	setTimeout(function(){that.set_paneX(10, true);},300);
	setTimeout(function(){that.set_paneX(11, true);},600);
	setTimeout(function(){that.set_paneX(12, true);},900);
	setTimeout(function(){that.set_paneX(13, true);},1200);
	setTimeout(function(){that.set_paneX(0, true);},1500);
};

