/**
 * A little JavaScript library for creating and manipulating SVG
 * 
 */


var ns = "http://www.w3.org/2000/svg";

/**
 * Create an SVG DOM element
 * 
 * TODO: It would be nice if you could pass some attributes, like viewBox
 */
function createSVG() {
	
	// Create svg element
	var svg = document.createElementNS( ns, "svg");

	return svg;

}




/**
 * Create SVG circle element
 */
function createCircle ( o ) {
	var elem = document.createElementNS(ns, "circle");

	elem.setAttributeNS(null,"cx", o.cx);
	elem.setAttributeNS(null,"cy", o.cy);
	elem.setAttributeNS(null,"r", o.r);
	
	if ( o.id !== undefined ) {
		elem.setAttribute("id", o.id);
	}

	if ( o.class !== undefined ) {
		elem.setAttribute("class", o.class);
	}


	if ( o.style !== undefined ) {
		elem.setAttribute("style", o.style);
	}	

	return elem;			
}


/**
 * Create SVG path element
 */
function createPath ( o ) {
	var elem = document.createElementNS(ns, "path");

	elem.setAttributeNS(null,"d", o.d);
	
	if ( o.id !== undefined ) {
		elem.setAttribute("id", o.id);
	}

	if ( o.class !== undefined ) {
		elem.setAttribute("class", o.class);
	}

	if ( o.style !== undefined ) {
		elem.setAttribute("style", o.style);
	}

	return elem;			
}


function createSVGElem(type, attributesNS, attributes) {
	var elem = document.createElementNS(ns, type);

	for (var a in attributesNS) {
		elem.setAttributeNS(null, a, attributesNS[a]);
	}

	for (a in attributes) {
		elem.setAttribute(a, attributes[a]);
	}

	return elem;
}

/**
 * To move a SVGElement, add a function to SVGElement.prototype
 */

SVGElement.prototype.moveTo = function( x, y ) {
	
	this.setAttribute( "transform", `translate( ${x}, ${y} )` ); 
	
	// Alternative, for circles:
	// this.setAttribute('x', x);
	// this.setAttribute('y', y);
	
	// Use element.tagName if you want a function to depend on the shape
	// console.log ( this.tagName )
}


/**
 * Set radius of a circle element
 */

SVGElement.prototype.setRadius = function( r ) {

	/**
	 * Make sure it's a circle
	 */
	
	if ( this.tagName != 'circle' ) {
		return;
	}

	this.setAttribute ( "r", r );

}
