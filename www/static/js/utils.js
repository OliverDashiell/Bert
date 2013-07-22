
if (!Array.prototype.diff){
    Array.prototype.diff = function(other){
        var len = this.length;
        var result = [];
        for(var i=0; i<len; i++){
            if(other.indexOf(this[i]) == -1){
                result.push(this[i]);
            }
        }
        return result;
    };
}

function set_background_grid(selector, grid_width, colour, background_colour){
    // will set the background image of selector to the
    // dataURL of a canvas grid using colour for the lines
	if(!grid_width){
		grid_width = 17;
	}
	if(!colour){
		colour = "#ccc";
	}
	var canvas = $('<canvas width="' + grid_width + '" height="' + grid_width + '">');
	var context = canvas[0].getContext('2d');

	context.beginPath();
	if(background_colour){
		context.rect(0, 0, grid_width, grid_width);
		context.fillStyle = background_colour;
		context.fill();
	}
	context.moveTo(0, grid_width);
	context.lineTo(grid_width, grid_width);
	context.lineTo(grid_width, 0);
    context.strokeStyle = colour;
	context.stroke();

	var url = canvas[0].toDataURL();
	$(selector).css({"background":"url("+url + ")"});
}



function checkOverlap(dims1, dims2) {
    var x1 = dims1[0], y1 = dims1[1],
        w1 = dims1[2], h1 = dims1[3],
        x2 = dims2[0], y2 = dims2[1],
        w2 = dims2[2], h2 = dims2[3];
    return !(y2 + h2 <= y1 || y1 + h1 <= y2 || x2 + w2 <= x1 || x1 + w1 <= x2);
}