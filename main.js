// global variables
var stage,
	cast = [],
	frogs = [];

window.onload = function () {
		
	/**
	 * CAST
	 * Define models and associated cast members
	 */
	prepareCast();

		
	/**
	 * STAGE
	 * An svg element forms the stage where the animation takes place
	 */
	stage = createSVG();
	stage.setAttribute("viewBox", "-3 -3 6 6"); 
	stage.setAttribute("class", "stage"); 


	// Add cast members to the stage
	// Layer for layer
	
	// Frogs have multiple mascottes. Ripples go in the background
	for (var i = 0; i < Object.keys(cast).length; i++ ) {
		var member = Object.keys(cast)[i];
		if (cast[member].mascotteRipple2) {
			stage.appendChild(cast[member].mascotteRipple2);
		}
	}
	for (var i = 0; i < Object.keys(cast).length; i++ ) {
		var member = Object.keys(cast)[i];
		if (cast[member].mascotteRipple) {
			stage.appendChild(cast[member].mascotteRipple);
		}
	}
	for (var i = 0; i < Object.keys(cast).length; i++ ) {
		var member = Object.keys(cast)[i];
		if (cast[member].mascotte) {
			stage.appendChild(cast[member].mascotte);
		}
	}
		

	// add SVG to the document
	document.querySelector('#wrap').appendChild(stage);

	/**
	 * ACTION
	 */
	runAnim();
	fadeIn();

	/**
	 * UI
	 */
	setUIHandlers();
}


function runAnim() {
	requestAnimationFrame(runAnim);

	for (var i = 0; i < Object.keys(cast).length; i++ ) {
		var member = Object.keys(cast)[i];

		if (cast[member].render) {
			cast[member].render();
		}
	}
}

function fadeIn() {
	// fade in sound
	TweenMax.to(Audio.mainGainNode.gain, 8, {value: .05, delay: 0.5});

	// fade in video
	TweenMax.to(document.querySelector('svg'), 4, {opacity:1});

	TweenMax.to(document.querySelectorAll('.bubbles'), 1, 
		{
			opacity: 0, 
			delay: 4,
			yoyo: true,
			repeatDelay: 4, 
			repeat: -1
		}
	);
}

/*
 * Frog
 * Here the model and the view are connected in the sense that decisions in
 * the model are easier to understand if you think of the frog as a circle
 */
Frog = function(options) {
	let id = options.id;
	let health = options.health;
	let heartbeatrate = options.rate;
	let position = options.pos;
	let mode = 'grow';
	let step;
	
	function update() {
		switch (mode) {
			case 'grow':
				step = .01;

				if (hasCriticalHealth()) {
					mode = 'shrink';
				} else {
					health += step;
				}
				break;
			case 'shrink':
				step = 0.05;

				health -= step;
				if (health <= 0) {
					health = 0;
					mode = 'grow';
				}
				break;
			default:
				break;
		}
	}

	/**
	 * Determine if health of frog is critical, meaning
	 * it can not grow anymore based on the health of neighbour frogs
	 */
	function hasCriticalHealth() {
		let margin = -0.02;
		return Math.sqrt(health) >= calcDistanceNearestFrog() - margin;
	}

	function calcDistanceNearestFrog() {
		function distance(p, q) {
			return (Math.sqrt(Math.pow((q.x - p.x), 2) + Math.pow((q.y - p.y), 2)));
		}

		let min = Number.MAX_VALUE;

		for (let i = frogs.length - 1; i >= 0; i--) {
			if (frogs[i].id !== id) {
				let d = distance(frogs[i].position, position) - Math.sqrt(frogs[i].getHealth());
				if (d < min) {
					min = d;
				}
			}
		}
		return Math.max(0, min);
	}

	setInterval(update, 1000/heartbeatrate);

	return {
		getHealth: function() {return health;},
		position: position,
		id: id
	}
}

/**
 * View of a Frog, or anything like it
 * @param {Object} obj Object that implements getHealth
 */
ViewHealthyBeingSVG = function(obj) {
	var mascotte = createSVGElem('circle', {
			cx: obj.position.x, 
			cy: obj.position.y, 
			r: obj.getHealth()
		}
	);
	var mascotteRipple = createSVGElem('circle', {
			cx: obj.position.x, 
			cy: obj.position.y, 
			r: obj.getHealth() + .1,
			class: 'ripple'
		}
	);
	var mascotteRipple2 = createSVGElem('circle', {
			cx: obj.position.x, 
			cy: obj.position.y, 
			r: obj.getHealth() + .2,
			class: 'ripple2'
		}
	);

	return {
		mascotte: mascotte,
		mascotteRipple: mascotteRipple,
		mascotteRipple2: mascotteRipple2,
		render: function () {
			mascotte.setRadius(Math.sqrt(obj.getHealth()));
			mascotteRipple.setRadius(Math.max(.65, Math.sqrt(obj.getHealth()) + .1));
			mascotteRipple2.setRadius(Math.max(.85, Math.sqrt(obj.getHealth()) + .2));
		}
	}
}

/**
 * Model the universe
 * and choose a representation for items you want to use on the stage
 */
function prepareCast() {
	// Add bubbly frame
	let bubblyFramePathData = "M -1.1049604,-1.9337 A 0.8287203,0.8287203 0 0 0 -1.9336808,-1.105 0.8287203,0.8287203 0 0 0 -1.7213931,-0.5526 0.8287203,0.8287203 0 0 0 -1.9336808,0 0.8287203,0.8287203 0 0 0 -1.7213931,0.5524 0.8287203,0.8287203 0 0 0 -1.9336808,1.105 0.8287203,0.8287203 0 0 0 -1.1049604,1.9337 0.8287203,0.8287203 0 0 0 -0.5525522,1.7214 0.8287203,0.8287203 0 0 0 0,1.9337 0.8287203,0.8287203 0 0 0 0.5524082,1.7214 0.8287203,0.8287203 0 0 0 1.1049604,1.9337 0.8287203,0.8287203 0 0 0 1.9336808,1.105 0.8287203,0.8287203 0 0 0 1.7213931,0.5525 0.8287203,0.8287203 0 0 0 1.9336808,0 0.8287203,0.8287203 0 0 0 1.7213931,-0.5524 0.8287203,0.8287203 0 0 0 1.9336808,-1.105 0.8287203,0.8287203 0 0 0 1.1049604,-1.9337 0.8287203,0.8287203 0 0 0 0.5525522,-1.7214 0.8287203,0.8287203 0 0 0 0,-1.9337 0.8287203,0.8287203 0 0 0 -0.5524082,-1.7214 0.8287203,0.8287203 0 0 0 -1.1049604,-1.9337 Z";

	cast['bubblyFrame'] = {mascotte: createPath({
			id: "bubblyFrame",
			class: "bubbles",
			d: bubblyFramePathData
		})
	};
	cast['bubblyFrame2'] = {mascotte: createPath({
			id: "bubblyFrame2",
			class: "bubbles",
			d: bubblyFramePathData
		})
	};

	// Just a square to complement the ripple circles
	cast['ripplescreen'] = {mascotteRipple: createPath({
			d: "M -1.5, -1.5 h 3 v 3 h -3 z",
			class: 'ripple'
		})
	};

	function getRandomPoint() {
		return {x: 3 * (Math.random() - 0.5), y: 3 * (Math.random() - 0.5)};
	}

	function gridPoint(i) {
		let cols = 3,
			rows = 3,
			dx = 1.5,
			dy = 1.5;

		return {x: ((i%cols) - (cols - 1)/2) * dx, y: (Math.floor(i/rows) - (rows - 1)/2) * dy};	
	}

	var frogData = [
		{id: 0, pos: gridPoint(0), health: Math.random()/10, rate: 60},
		{id: 1, pos: gridPoint(1), health: Math.random()/10, rate: 50},
		{id: 2, pos: gridPoint(2), health: Math.random()/10, rate: 59},
		{id: 3, pos: gridPoint(3), health: Math.random()/10, rate: 51},
		{id: 4, pos: gridPoint(4), health: Math.random()/10, rate: 59},
		{id: 5, pos: gridPoint(5), health: Math.random()/10, rate: 56},
		{id: 6, pos: gridPoint(6), health: Math.random()/10, rate: 53},
		{id: 7, pos: gridPoint(7), health: Math.random()/10, rate: 52},
		{id: 8, pos: gridPoint(8), health: Math.random()/10, rate: 49},
	];

	function freq(step) {
		return Math.pow(2, step/12);
	}

	let baseFreq = 220;

	for (let i = 0; i < frogData.length; i++) {
		frogs.push(Frog(frogData[i]));
		cast[`frog${frogData[i].id}`] = ViewHealthyBeingSVG(frogs[i]);

		cast[`frogAudio${frogData[i].id}`] = ViewAudioFrog(frogs[i], baseFreq * (i/5 + 1));
	}

}

// AUDIO
var ViewAudioFrog = function(frog, frequency) {
	var oscillator = audioCtx.createOscillator();
	oscillator.type = 'sine';

	setFrequency(frequency);

	var gainNode = audioCtx.createGain();
	setGain(frog.getHealth());

	// connect nodes
	oscillator.connect(gainNode);
	gainNode.connect(Audio.mainGainNode);

	oscillator.start();
	
	function setFrequency(p) {
		oscillator.frequency.value = p;
	}
	
	function setGain(v) {
		gainNode.gain.value = v;
	}

	return {
		render: function() {
			setGain(frog.getHealth());
		}
	}
}


// we need (just) one global audio context
var audioCtx = new AudioContext();
var Audio = {
	mainGainNode: audioCtx.createGain()
}
Audio.mainGainNode.gain.value = 0;
Audio.mainGainNode.connect(audioCtx.destination);




function setUIHandlers() {
	document.getElementById('un-mute').onclick = function() {
	    if (this.checked) {
	    	// fade in sound
	    	TweenMax.to(Audio.mainGainNode.gain, 10, {value: .05});
	    } else {
	    	// fade out sound
	    	TweenMax.to(Audio.mainGainNode.gain, 1, {value: 0});
	    }
	};
}
