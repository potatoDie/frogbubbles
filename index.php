<?php
/**
 * Based on frogFreedom2
 * Define a number of frogs, with coordinates and a health/radius.
 * They will grow if there's room. Collapse if not
 *
 * Visualize with SVG
 *
 * The frogs have a pulse, and update (themselves) at each pulse.
 * The Director will then visualize the state of affairs on each frame.
 */
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="style.css">
	<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>	
	<script src="functions.js"></script>
	<script src="main.js"></script>
</head>
<body>
	<div id="wrap">
	</div>
	<div class="mute-container">
		<input type="checkbox" name="un-mute" id="un-mute" checked="false">
	    <label for="un-mute" class="unmute">
	        <img src="http://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg" alt="Speaker_Icon.svg" title="Unmute/speaker icon">
	    </label>
	    <label for="un-mute" class="mute">
	    	<img src="http://upload.wikimedia.org/wikipedia/commons/3/3f/Mute_Icon.svg" alt="Mute_Icon.svg" title="Mute icon">
	    </label>
	</div>
</body>
</html>