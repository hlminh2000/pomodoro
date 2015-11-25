

var c;
var ctx;
var vCenter;
var hCenter;
var clockHCenter;

function reset(duration, timeLeft){

	timeLeft -= 10;
	ctx.clearRect(0,0,c.height, c.width);

	// Draw clock text
	ctx.fillStyle = 'white';
	ctx.font = '50px Poppins Light';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText("00:00:00", vCenter, clockHCenter);

	//draw circle
	ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
	ctx.lineWidth = 7;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.arc(vCenter, clockHCenter, 150, (2-((timeLeft*2)/duration) - 0.5)*Math.PI, 1.5*Math.PI);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255, 71, 49, 1)';
	ctx.beginPath();
	ctx.arc(vCenter, clockHCenter, 150, 1.5*Math.PI, (2-((timeLeft*2)/duration) - 0.5)*Math.PI);
	ctx.stroke();

	if(timeLeft > 0)
		setTimeout('reset(' + duration + ', ' + timeLeft+ ')', 10);
	else{
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
}

function drawClock(duration, timeLeft, running){

	$('#startStop').click(function(){
		if (running) {
				running = false;
		}
	});

	var hours = Math.floor(timeLeft/3600000),
		minutes = Math.floor((timeLeft - hours*3600000)/60000),
		seconds = Math.floor((timeLeft - hours*3600000 - minutes*60000)/1000),
		hourString = hours<10 ? "0"+hours : hours,
		minuteString = minutes<10 ? "0"+minutes : minutes,
		secondString = seconds<10 ? "0"+seconds : seconds
		timeString = hourString + ":" + minuteString + ":" + secondString,
		paused = false;

	ctx.clearRect(0,0,c.height, c.width);

	if (running) {
			timeLeft -= 10;
	}

	// Draw clock text
	ctx.clearRect(0,0,c.height, c.width);
	ctx.fillStyle = 'white';
	ctx.font = '50px Poppins Light';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(timeString, vCenter, clockHCenter);


	//draw circle
	ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
	ctx.lineWidth = 7;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.arc(vCenter, clockHCenter, 150, 1.5*Math.PI, (2-((timeLeft*2)/duration) - 0.5)*Math.PI);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255, 71, 49, 1)';
	ctx.beginPath();
	ctx.arc(vCenter, clockHCenter, 150, (2-((timeLeft*2)/duration) - 0.5)*Math.PI,1.5*Math.PI);
	ctx.stroke();

	console.log(timeLeft);

	if(timeLeft > 0)
		setTimeout('drawClock(' + duration + ', ' + timeLeft+ ')', 10);
	else{
		reset(500, 500);
	}
}


function trigger(shh, smm, sss, bhh, bmm, bss, running){
	var startTime = new Date(),
		endTime = new Date();

	endTime.setTime(startTime.getTime() + (shh*3600000) + (smm*60000) + (sss*1000));

	var duration = endTime.getTime() - startTime.getTime();
	var timeLeft = duration;

	drawClock(duration, timeLeft, running);

}


$(document).ready(function(){

	c = document.getElementById('clock'),
	ctx = c.getContext('2d'),
	vCenter = c.width/2,
	hCenter = c.height/2,
	clockHCenter = 225;

	reset(500, 500);

	var running = false,
		shh = 0,
		smm = 0,
		sss = 0,
		bhh = 0,
		bmm = 0,
		bss = 0;

	$('button').mouseenter(function(){
		$(this).clearQueue().animate({
			width : '43%'
		}, 200);
	});

	$('button').mouseleave(function(){
		$(this).clearQueue().animate({
			width : '40%'
		}, 200);
	});

	$('#startStop').click(function(){

		shh = document.getElementById('shh').value;
		smm = document.getElementById('smm').value;
		sss = document.getElementById('sss').value;
		bhh = document.getElementById('bhh').value;
		bmm = document.getElementById('bmm').value;
		bss = document.getElementById('bss').value;

		if (!running){
			document.getElementById('startStop').innerHTML = "PAUSE";
			$(this).addClass("red");
			running = true;
			trigger(shh, smm, sss, bhh, bmm, bss, running);
		}

		else{
			document.getElementById('startStop').innerHTML = "START";
			$(this).removeClass("red");
			running = false;
		}

	});

	$('#startStop').click(function(){
	});

	$('#reset').click(function(){
		reset(500, 500);
	});

});
