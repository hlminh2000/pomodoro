
// global canvas variables
var c;
var ctx;
var vCenter;
var hCenter;
var clockHCenter;
var interval;
var audio = new Audio('./Drop.mp3');

// global variables to track status
var running = false;
var startFresh = true;

// Global setting variables
var refreshRate = 10;
var reflectionOffset = 310;
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
	reset();

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

	var playSound = () => {return audio.play()};

	$('#startStop').click(function(){
		// get user inputs, if input is different from
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
			startFresh = false;
			endTime.setTime(startRunTime.getTime() + (shh*3600000) + (smm*60000) + (sss*1000));
			duration = endTime.getTime() - startRunTime.getTime();
			timeLeft = duration;

			breakLength = (bhh*3600000) + (bmm*60000) + (bss*1000);
			breakTimeLeft = breakLength;

			interval = setInterval(function(){
				if ( timeLeft >= 0) {
					drawClock(duration, timeLeft, false);
					timeLeft -= refreshRate;
					playSound = () => {return audio.play()};
				}
				else{
					playSound();
					playSound = () => {return 0};
					// reset(interval);
					if(breakTimeLeft >= 0){
						drawClock(breakLength, breakTimeLeft, true, false);
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
						drawClock(breakLength, breakTimeLeft, true, false);
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





function drawClock(duration, timeLeft, isBreaking, isResetting){

	ctx.clearRect(0,0,c.height, c.width);
	var arcBeginning,
			arcEnd,
			reflectionArcBeginning,
			reflectionArcEnd;

	ctx.fillStyle = 'lightgray';
	ctx.font = '50px Poppins Light';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';

	arcBeginning = 1.5*Math.PI;
	arcEnd = 	(2-((timeLeft	*2)/duration) - 0.5)*Math.PI;
	reflectionArcBeginning = 0.5*Math.PI;
	reflectionArcEnd = (0.5-((duration-timeLeft)*2/duration))*Math.PI;

	if(isBreaking){
		ctx.fillText("00:00:00", vCenter, clockHCenter);
	}
	else if (isResetting) {
		ctx.fillText("00:25:00", vCenter, clockHCenter);
	}
	else{
		var hours = Math.floor(timeLeft/3600000),
				minutes = Math.floor((timeLeft - hours*3600000)/60000),
				seconds = Math.floor((timeLeft - hours*3600000 - minutes*60000)/1000),
				hourString = hours<10 ? "0"+hours : hours,
				minuteString = minutes<10 ? "0"+minutes : minutes,
				secondString = seconds<10 ? "0"+seconds : seconds
				timeString = hourString + ":" + minuteString + ":" + secondString;
		ctx.fillText(timeString, vCenter, clockHCenter);
		arcBeginning = (1.5-(timeLeft*2/duration))*Math.PI;
		arcEnd = 	1.5*Math.PI;
		reflectionArcBeginning = (0.5-((duration-timeLeft)*2/duration))*Math.PI;
		reflectionArcEnd = 0.5*Math.PI;
	}

	// draw circle
	if(timeLeft <= 0 && !isResetting){	//handle 0
		ctx.strokeStyle = 'lightgray';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	else if (timeLeft <= 0 && isResetting) {
		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	else{
		ctx.strokeStyle = 'lightgray';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, arcEnd, arcBeginning);
		ctx.stroke();

		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter, 150, arcBeginning, arcEnd);
		ctx.stroke();
	}

	// draw reflection
	if(timeLeft <= 0){	//handle 0
		ctx.strokeStyle = 'lightgray';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	if(timeLeft <= 0){	//handle 0
		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, 0*Math.PI, 2*Math.PI);
		ctx.stroke();
	}
	else{
		ctx.strokeStyle = 'lightgray';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, reflectionArcBeginning, reflectionArcEnd);
		ctx.stroke();

		ctx.strokeStyle = arcColor;
		ctx.beginPath();
		ctx.arc(vCenter, clockHCenter + reflectionOffset, 150, reflectionArcEnd, reflectionArcBeginning);
		ctx.stroke();
	}
	var gradient = ctx.createLinearGradient(0, 0, 0, c.height-100);
	gradient.addColorStop(0, 'rgba(242, 242, 242, 0)');
	gradient.addColorStop(1, 'rgba(242, 242, 242, 1)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, c.height/2 + 80, c.width, c.height/2);
}





function reset(){
	var duration = 500,
			timeLeft = duration;

	clearInterval(interval);

	interval = setInterval(function(){
		if ( timeLeft >= 0) {
			drawClock(duration, timeLeft, false, true);
			timeLeft -= refreshRate;
		}
		else{
			clearInterval(interval);
		}
	}, refreshRate);

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
