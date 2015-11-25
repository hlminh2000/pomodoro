
// global canvas variables
var c;
var ctx;
var vCenter;
var hCenter;
var clockHCenter;

// global variables to track status
var running = false;
var startFresh = true;


$(document).ready(function(){

	// Animate Start/Stop button on hover
	$('button').mouseenter(function(){
		$(this).clearQueue().animate({
			width : '43%'
		}, 200);
	});
	$('button').focus(function(){
		$(this).clearQueue().animate({
			width : '43%'
		}, 200);
	});

	// Animate Reset button on hover
	$('button').mouseleave(function(){
		$(this).clearQueue().animate({
			width : '40%'
		}, 200);
	});
	$('button').focusout(function(){
		$(this).clearQueue().animate({
			width : '40%'
		}, 200);
	});

//------------------------------------------------------------------------------------
	// Create canvas object
	c = document.getElementById('clock'),
	ctx = c.getContext('2d'),
	vCenter = c.width/2,
	hCenter = c.height/2,
	clockHCenter = 225;

	// Start the page off fresh
	reset(500, 500);

	// Initialize input variables
	var shh = 0,	// Session hour
			smm = 0,	// Session minutes
			sss = 0,	// Session seconds
			bhh = 0,	// Break hours
			bmm = 0,	// Break minutes
			bss = 0;	// Break seconds

	// Declare variables to use
	var startRunTime = new Date();
	var startPauseTime = new Date();
	var endTime = new Date();
	var duration;
	var timeLeft;

	$('#startStop').click(function(){
		// get user inputs
		shh = document.getElementById('shh').value;
		smm = document.getElementById('smm').value;
		sss = document.getElementById('sss').value;
		bhh = document.getElementById('bhh').value;
		bmm = document.getElementById('bmm').value;
		bss = document.getElementById('bss').value;


		// If starting from fresh
		if (!running && startFresh){
			document.getElementById('startStop').innerHTML = "PAUSE";
			$(this).addClass("red");
			running = true;
			endTime.setTime(startRunTime.getTime() + (shh*3600000) + (smm*60000) + (sss*1000));
			duration = endTime.getTime() - startRunTime.getTime();
			timeLeft = duration;
			console.log(timeLeft);
		}

		// If running and needs to pause
		else if (running) {
			document.getElementById('startStop').innerHTML = "START";
			$(this).removeClass("red");
			running = false;
			startPauseTime = Date.now();
			timeLeft = endTime.getTime() - startPauseTime;
			console.log(timeLeft);
		}

		// If starting after a pause
		else if (running && !startFresh) {

			$(this).addClass("red");
			document.getElementById('startStop').innerHTML = "PAUSE";
			running = true;
		}

		drawClock(duration, timeLeft);
	});


	$('#reset').click(function(){
		reset(500, 500);
		$('#startStop').removeClass("red");
		document.getElementById('startStop').innerHTML = "START";
		running = false;
		startFresh = true;
		startRunTime = new Date();
		startPauseTime = new Date();
		endTime = new Date();
	});
	//-------------------------------------------------------------------------------------
});








function drawClock(duration, timeLeft){

//	console.log(running);
//	console.log(timeLeft);


	ctx.clearRect(0,0,c.height, c.width);

	if(running){
		timeLeft -= 10;
	}

	else {

	}

	// Draw clock text
	var hours = Math.floor(timeLeft/3600000),
			minutes = Math.floor((timeLeft - hours*3600000)/60000),
			seconds = Math.floor((timeLeft - hours*3600000 - minutes*60000)/1000),
			hourString = hours<10 ? "0"+hours : hours,
			minuteString = minutes<10 ? "0"+minutes : minutes,
			secondString = seconds<10 ? "0"+seconds : seconds
			timeString = hourString + ":" + minuteString + ":" + secondString;
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

//	console.log(timeLeft);

	if(timeLeft > 0)
		setTimeout('drawClock(' + duration + ', ' + timeLeft+ ')', 10);
	else{
		reset(500, 500);
	}
}










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
