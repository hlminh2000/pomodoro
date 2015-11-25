
// global canvas variables
var c;
var ctx;
var vCenter;
var hCenter;
var clockHCenter;
var interval;
var audio = new Audio('http://oringz.com/ringtone/droplet/sounds-812-droplet/?download');


// global variables to track status
var running = false;
var startFresh = true;

// Global setting variables
var refreshRate = 10;
var reflectionOffset = 320;
var arcColor = '#ff4731'; // original red: rgba(255, 71, 49, 1)
var breakArcColor = '#ff4731';


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

//---------------------------------------------------------------------------------------
	// Create canvas object
	c = document.getElementById('clock'),
	ctx = c.getContext('2d'),
	vCenter = c.width/2,
	hCenter = c.height/2,
	clockHCenter = 225;

	// Start the page off fresh
	resetClock(500, 500);

	// Initialize input variables
	var shh = 0,	// Session hour
			smm = 25,	// Session minutes
			sss = 0,	// Session seconds
			bhh = 0,	// Break hours
			bmm = 5,	// Break minutes
			bss = 0;	// Break seconds

	// Declare variables to use
	var startRunTime = new Date();
	var startPauseTime = new Date();
	var endTime = new Date();
	var duration = 0;
	var timeLeft = 0;

	var breakLength = 0;
	var breakTimeLeft = 0;

	$('#startStop').click(function(){
		// get user inputs
		if(!(document.getElementById('shh').value == 0
			&& document.getElementById('shh').value == 25
			&& document.getElementById('shh').value == 0
			&& document.getElementById('shh').value == 0
			&& document.getElementById('shh').value == 5
			&& document.getElementById('shh').value == 0)){
			shh = document.getElementById('shh').value;
			smm = document.getElementById('smm').value;
			sss = document.getElementById('sss').value;
			bhh = document.getElementById('bhh').value;
			bmm = document.getElementById('bmm').value;
			bss = document.getElementById('bss').value;
		}else{	//default case
			shh = 0,	// Session hour
			smm = 25,	// Session minutes
			sss = 0,	// Session seconds
			bhh = 0,	// Break hours
			bmm = 5,	// Break minutes
			bss = 0
		}



		// If starting from fresh
		if (!running && startFresh){
			document.getElementById('startStop').innerHTML = "PAUSE";
			$(this).addClass("red");
			running = true;
			startFresh = false;
			endTime.setTime(startRunTime.getTime() + (shh*3600000) + (smm*60000) + (sss*1000));
			duration = endTime.getTime() - startRunTime.getTime();
			timeLeft = duration;

			breakLength = (bhh*3600000) + (bmm*60000) + (bss*1000);
			breakTimeLeft = breakLength;

			interval = setInterval(function(){
				if ( timeLeft >= 0) {
					drawClock(duration, timeLeft);
					timeLeft -= refreshRate;
					// console.log("running");
				}
				else{
					// reset(interval);
					if(breakTimeLeft >= 0){
						drawBreakClock(breakLength, breakTimeLeft);
						breakTimeLeft -= refreshRate;
						// console.log("breaking");
					}
					else {
						endTime.setTime(startRunTime.getTime() + (shh*3600000) + (smm*60000) + (sss*1000));
						duration = endTime.getTime() - startRunTime.getTime();
						timeLeft = duration;
						breakTimeLeft = breakLength;
						// console.log("ended break");
					}
				}
			}, refreshRate);
		}

		// If running and needs to pause
		else if (running) {
			document.getElementById('startStop').innerHTML = "START";
			$(this).removeClass("red");
			running = false;
			clearInterval(interval);
		}

		// If starting after a pause
		else if (!running && !startFresh) {
			$(this).addClass("red");
			document.getElementById('startStop').innerHTML = "PAUSE";
			running = true;
			interval = setInterval(function(){
				if ( timeLeft >= 0) {
					drawClock(duration, timeLeft);
					timeLeft -= refreshRate;
				}
				else{
					// reset(interval);
					if(breakTimeLeft >= 0){
						drawBreakClock(breakLength, breakTimeLeft);
						breakTimeLeft -= refreshRate;
					}
					else {
						endTime.setTime(startRunTime.getTime() + (shh*3600000) + (smm*60000) + (sss*1000));
						duration = endTime.getTime() - startRunTime.getTime();
						timeLeft = duration;
						breakTimeLeft = breakLength;
					}
				}
			}, refreshRate);
		}

	});

	$('#reset').click(function(){
		reset(interval);
	});
	//-------------------------------------------------------------------------------------
});








function drawClock(duration, timeLeft){

//	console.log(running);
//	console.log(timeLeft);


	ctx.clearRect(0,0,c.height, c.width);

	var hours = Math.floor(timeLeft/3600000),
			minutes = Math.floor((timeLeft - hours*3600000)/60000),
			seconds = Math.floor((timeLeft - hours*3600000 - minutes*60000)/1000),
			hourString = hours<10 ? "0"+hours : hours,
			minuteString = minutes<10 ? "0"+minutes : minutes,
			secondString = seconds<10 ? "0"+seconds : seconds
			timeString = hourString + ":" + minuteString + ":" + secondString;
	ctx.clearRect(0,0,c.height, c.width);
	ctx.fillStyle = 'lightgray';
	ctx.font = '50px Poppins Light';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(timeString, vCenter, clockHCenter);

	// draw circle
	if(timeLeft <= 0){	//handle 0
		ctx.strokeStyle = 'lightgray';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
		audio.play();
	}
	else{
		ctx.strokeStyle = 'lightgray';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, 1.5*Math.PI, (1.5-(timeLeft*2/duration))*Math.PI);
		ctx.stroke();

		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, (1.5-(timeLeft*2/duration))*Math.PI, 1.5*Math.PI);
		ctx.stroke();
	}

	// draw reflection
	if(timeLeft <= 0){	//handle 0
		ctx.strokeStyle = 'lightgray';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	else{
		ctx.strokeStyle = 'lightgray';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, (0.5-((duration-timeLeft)*2/duration))*Math.PI, 0.5*Math.PI);
		ctx.stroke();

		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0.5*Math.PI, (0.5-((duration-timeLeft)*2/duration))*Math.PI);
		ctx.stroke();
	}
	var gradient = ctx.createLinearGradient(0, 0, 0, c.height-100);
	gradient.addColorStop(0, 'rgba(242, 242, 242, 0)');
	gradient.addColorStop(1, 'rgba(242, 242, 242, 1)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, c.height/2 + 80, c.width, c.height/2);

//	console.log(timeLeft);
}




function drawBreakClock(breakLength, breakTimeLeft){

	//	console.log(running);
	//	console.log(breakTimeLeft);


		ctx.clearRect(0,0,c.height, c.width);

		ctx.fillStyle = 'lightgray';
		ctx.font = '50px Poppins Light';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillText("00:00:00", vCenter, clockHCenter);


		//draw circle
		if(breakTimeLeft <= 0){		// handle 0
			ctx.strokeStyle = breakArcColor;
			ctx.beginPath();
			ctx.arc(vCenter, clockHCenter, 150, 0*Math.PI, 2*Math.PI);
			ctx.stroke();
		}
		else{
			ctx.strokeStyle = 'lightgray';
			ctx.lineWidth = 7;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.arc(vCenter, clockHCenter, 150, (2-((breakTimeLeft*2)/breakLength) - 0.5)*Math.PI, 1.5*Math.PI);
			ctx.stroke();

			ctx.strokeStyle = breakArcColor;
			ctx.beginPath();
			ctx.arc(vCenter, clockHCenter, 150, 1.5*Math.PI, (2-((breakTimeLeft	*2)/breakLength) - 0.5)*Math.PI);
			ctx.stroke();
		}


		// draw reflection
		if(breakTimeLeft <= 0){	//handle 0
			ctx.strokeStyle = 'lightgray';
			ctx.beginPath();
			ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0*Math.PI, 2*Math.PI);
			ctx.stroke();
		}
		else{
			ctx.strokeStyle = 'lightgray';
			ctx.lineWidth = 7;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0.5*Math.PI, (0.5-((breakLength-breakTimeLeft)*2/breakLength))*Math.PI);
			ctx.stroke();

			ctx.strokeStyle = breakArcColor;
			ctx.beginPath();
			ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, (0.5-((breakLength-breakTimeLeft)*2/breakLength))*Math.PI, 0.5*Math.PI);
			ctx.stroke();
		}
		var gradient = ctx.createLinearGradient(0, 0, 0, c.height-100);
		gradient.addColorStop(0, 'rgba(242, 242, 242, 0)');
		gradient.addColorStop(1, 'rgba(242, 242, 242, 1)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, c.height/2 + 80, c.width, c.height/2);


	//	console.log(breakTimeLeft);
}








function reset(){
	clearInterval(interval);
	resetClock(500, 500);
	$('#startStop').removeClass("red");
	document.getElementById('startStop').innerHTML = "START";
	running = false;
	startFresh = true;
	startRunTime = new Date();
	startPauseTime = new Date();
	endTime = new Date();
	document.getElementById('shh').value = 0;
	document.getElementById('smm').value = 25;
	document.getElementById('sss').value = 0;
	document.getElementById('bhh').value = 0;
	document.getElementById('bmm').value = 5;
	document.getElementById('bss').value = 0;
}

function resetClock(duration, timeLeft){


	timeLeft -= 10;
	ctx.clearRect(0,0,c.height, c.width);

	// Draw clock text
	ctx.fillStyle = 'lightgray';
	ctx.font = '50px Poppins Light';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText("00:25:00", vCenter, clockHCenter);

	//draw circle
	ctx.strokeStyle = 'lightgray';
	ctx.lineWidth = 7;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.arc(vCenter, clockHCenter, 150, (2-((timeLeft*2)/duration) - 0.5)*Math.PI, 1.5*Math.PI);
	ctx.stroke();

	ctx.strokeStyle = arcColor;
	ctx.beginPath();
	ctx.arc(vCenter, clockHCenter, 150, 1.5*Math.PI, (2-((timeLeft*2)/duration) - 0.5)*Math.PI);
	ctx.stroke();

	// draw reflection
	if(timeLeft <= 0){	//handle 0
		ctx.strokeStyle = 'lightgray';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	else{
		ctx.strokeStyle = 'lightgray';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0.5*Math.PI, (0.5-((duration-timeLeft)*2/duration))*Math.PI);
		ctx.stroke();

		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, (0.5-((duration-timeLeft)*2/duration))*Math.PI, 0.5*Math.PI);
		ctx.stroke();
	}

	if(timeLeft > 0)
		setTimeout('resetClock(' + duration + ', ' + timeLeft+ ')', 10);
	else{
		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	var gradient = ctx.createLinearGradient(0, 0, 0, c.height-100);
	gradient.addColorStop(0, 'rgba(242, 242, 242, 0)');
	gradient.addColorStop(1, 'rgba(242, 242, 242, 1)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, c.height/2 + 80, c.width, c.height/2);
}
