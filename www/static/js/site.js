

$(function(){
    var audio = false;
	var bert = window.bert = new Bert("#bert");
	var zombie = window.zombie = new Zombie("#zombie",0,1);
    
    function play_zombie_walk(){
        if(audio === true){
            $("#zombie_audio")[0].currentTime = 0;
            $("#zombie_audio")[0].play();
        }
    }
    
    function stop_zombie_walk(){
        $("#zombie_audio")[0].pause();
    }
    
    function play_zombie_death(){
        if(audio === true){
            $("#zombie_audio")[0].pause();
            $("#zombie_death_audio")[0].play();
        }
    }

	$("#run").click(function(evt){
		$(evt.target).toggleClass("active");
		bert.toggle_running();
	});
	$("#attack").click(function(){
		bert.stop();
		$("#run").removeClass("active");
		bert.attack();
        play_zombie_death();
		zombie.stop();
        setTimeout( function(){
            zombie.reset();
            zombie.upgrade();
            zombie.walk();
            play_zombie_walk();
        }, 1000);
	});
	$(document).delegate(".weapon","click",function(evt){
		$(".weapon").removeClass("active");
		var $target = $(evt.target);
		var weapon = parseInt($target.attr('data-value'),10);
		if(bert.paneY === weapon){
			bert.set_paneY(0, true);
		} else {
			bert.set_paneY(weapon, true);
			 $target.addClass("active");
		}
	});
    $("#audio").click(function(evt){
		$(evt.target).toggleClass("active");
        audio = !audio;
        if(audio === true){
            play_zombie_walk();
        } else {
            stop_zombie_walk();
        }
    });
	$(document).keypress(function(evt){
		if(evt.keyCode === 32){
			$("#run").toggleClass("active");
			bert.toggle_running();
			evt.preventDefault();
		}
        console.log(evt.keyCode);
	});
	
	zombie.walk();
    play_zombie_walk();
	
	$("#fullscreen").click(function(e){
		toggle_fullscreen($(".scene")[0]);
	});
});
