import * as THREE from 'three'

import Stats from "./stats.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer;
var controls;
var windowHalfX, windowHalfY;

// Object3D ("Group") nodes and Mesh nodes
var solarSystem = new THREE.Group();
var mercurySpin = new THREE.Group();
var venusSpin = new THREE.Group();
var earthSpin = new THREE.Group();
var moonSpin = new THREE.Group();
var marsSpin = new THREE.Group();
var jupiterSpin = new THREE.Group();
var saturnSpin = new THREE.Group();
var uranusSpin = new THREE.Group();
var neptuneSpin = new THREE.Group();

var sunMesh;
var mercuryMesh;
var venusMesh;
var earthMesh;
var moonMesh;
var marsMesh;
var jupiterMesh;
var saturnMesh;
var uranusMesh;
var neptuneMesh;



var moonOrbitRadius = 0.8;

// Define the actual orbital radii in AU (for visualization purposes, not accurate values)
var mercuryOrbitAU = 0.39;
var venusOrbitAU = 0.72;
var earthOrbitAU = 1; // Earth's orbit is the base for an Astronomical Unit
var marsOrbitAU = 1.52;
var jupiterOrbitAU = 5.2;
var saturnOrbitAU = 9.58;
var uranusOrbitAU = 19.22;
var neptuneOrbitAU = 30.05;

// Define a base orbit radius for visualization in the 3D scene
var baseOrbitRadius = 20; // This is arbitrary and will represent Earth's orbit for scaling

// Function to calculate the scaled orbit radius using square root scaling
function calculateScaledOrbitRadius(orbitAU) {
    return Math.sqrt(orbitAU) * baseOrbitRadius;
}

// Calculate the scaled orbit radii
var mercuryOrbitRadius = calculateScaledOrbitRadius(mercuryOrbitAU);
var venusOrbitRadius = calculateScaledOrbitRadius(venusOrbitAU);
var earthOrbitRadius = calculateScaledOrbitRadius(earthOrbitAU); // Will be equal to baseOrbitRadius
var marsOrbitRadius = calculateScaledOrbitRadius(marsOrbitAU);
var jupiterOrbitRadius = calculateScaledOrbitRadius(jupiterOrbitAU);
var saturnOrbitRadius = calculateScaledOrbitRadius(saturnOrbitAU);
var uranusOrbitRadius = calculateScaledOrbitRadius(uranusOrbitAU);
var neptuneOrbitRadius = calculateScaledOrbitRadius(neptuneOrbitAU);

var animation = true;

// Define a base size for Earth to set the scale
var baseSize = 1; // This will represent Earth's relative size

// Define the actual ratios
var sunSizeRatio = 109.2; // Approximate ratio of the Sun's diameter to Earth's
var mercurySizeRatio = 0.383; // Mercury's diameter relative to Earth's
var venusSizeRatio = 0.9499; // Venus's diameter relative to Earth's
var moonSizeRatio = 0.2724; // The Moon's diameter relative to Earth's
var marsSizeRatio = 0.5320; // Mars's diameter relative to Earth's
var jupiterSizeRatio = 11.209; // Jupiter's diameter relative to Earth's
var saturnSizeRatio = 9.4492; // Saturn's diameter relative to Earth's
var uranusSizeRatio = 4.007; // Uranus's diameter relative to Earth's
var neptuneSizeRatio = 3.883; // Neptune's diameter relative to Earth's

// Apply a scale factor to make the sizes more visually manageable in the 3D scene
var scaleFactor = 0.1;


var stats;

const vertexShaderCode = document.getElementById('vertexShader').textContent.trim();
const fragmentShaderCode = document.getElementById('fragmentShader').textContent.trim();

var isDynamicScalingEnabled = false;

var sunAxesHelper;
var mercuryAxesHelper ;
var venusAxesHelper ;
var earthAxesHelper;
var moonAxesHelper ;
var marsAxesHelper ;
var jupiterAxesHelper;
var saturnAxesHelper;
var uranusAxesHelper ;
var neptuneAxesHelper ;

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createSceneGraph() {
	var axesSize = 1; // Adjust this size as needed
	sunAxesHelper = new THREE.AxesHelper(axesSize * sunSizeRatio * 0.15); 
	mercuryAxesHelper = new THREE.AxesHelper(axesSize * mercurySizeRatio);
	venusAxesHelper = new THREE.AxesHelper(axesSize * venusSizeRatio * 0.5);
	earthAxesHelper = new THREE.AxesHelper(axesSize * 0.5);
	moonAxesHelper = new THREE.AxesHelper(axesSize * 0.1);
	marsAxesHelper = new THREE.AxesHelper(axesSize * marsSizeRatio * 0.4);
	jupiterAxesHelper = new THREE.AxesHelper(axesSize * jupiterSizeRatio * 0.2);
	saturnAxesHelper = new THREE.AxesHelper(axesSize * saturnSizeRatio * 0.2);
	uranusAxesHelper = new THREE.AxesHelper(axesSize * uranusSizeRatio * 0.2);
	neptuneAxesHelper = new THREE.AxesHelper(axesSize * neptuneSizeRatio * 0.2);
    scene = new THREE.Scene();

    // Top-level node
    scene.add(solarSystem);

	//sun branch
	solarSystem.add(sunMesh);
	sunMesh.add(sunAxesHelper);

	//mercury branch
	solarSystem.add(mercurySpin);
	mercurySpin.position.x = mercuryOrbitRadius;
	mercurySpin.rotation.z = 2.11 * Math.PI / 180;
	mercurySpin.add(mercuryMesh);
	mercurySpin.add(mercuryAxesHelper);

	//venus branch
	solarSystem.add(venusSpin);
	venusSpin.position.x = venusOrbitRadius;
	venusSpin.rotation.z = 177.36 * Math.PI / 180;
	venusSpin.add(venusMesh);
	venusSpin.add(venusAxesHelper);


    // earth branch
    solarSystem.add(earthSpin);
	earthSpin.position.x = earthOrbitRadius;
	earthSpin.rotation.z = 23.44 * Math.PI / 180;
    earthSpin.add(earthMesh);
	earthSpin.add(earthAxesHelper);
	
	// moon branch
	earthSpin.add(moonSpin);
	moonSpin.rotation.z = 5.15 * Math.PI / 180;
	moonSpin.add(moonMesh);
	moonSpin.add(moonAxesHelper);
	moonSpin.position.set(moonOrbitRadius, 0, 0)
	const moonOrbit = createOrbit(moonOrbitRadius, 0xffffff, 0.01);
	earthSpin.add(moonOrbit);

	//mars branch
	solarSystem.add(marsSpin);
	marsSpin.add(marsMesh);
	marsSpin.position.x = marsOrbitRadius;
	marsSpin.rotation.z = 25.19 * Math.PI / 180;
	marsSpin.add(marsAxesHelper);

	//jupiter branch
	solarSystem.add(jupiterSpin);
	jupiterSpin.add(jupiterMesh);
	jupiterSpin.position.x = jupiterOrbitRadius;
	jupiterSpin.rotation.z = 3.13 * Math.PI / 180;
	jupiterSpin.add(jupiterAxesHelper);

	//saturn branch
	solarSystem.add(saturnSpin);
	saturnSpin.add(saturnMesh);
	saturnSpin.position.x = saturnOrbitRadius;
	saturnSpin.rotation.z = 26.73 * Math.PI / 180;
	saturnSpin.add(saturnAxesHelper);

	//uranus branch
	solarSystem.add(uranusSpin);
	uranusSpin.add(uranusMesh);
	uranusSpin.position.x = uranusOrbitRadius;
	uranusSpin.rotation.z = 97.77 * Math.PI / 180;
	uranusSpin.add(uranusAxesHelper);

	//neptune branch
	solarSystem.add(neptuneSpin);
	neptuneSpin.add(neptuneMesh);
	neptuneSpin.position.x = neptuneOrbitRadius;
	neptuneSpin.rotation.z = 28.32 * Math.PI / 180;
	neptuneSpin.add(neptuneAxesHelper);

}

function init() {
    container = document.getElementById('container');

    // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
	var zoomLevel = 30; // Smaller numbers are more zoomed in
	var aspectRatio = window.innerWidth / window.innerHeight;
	var cameraHeight = zoomLevel;
	var cameraWidth = cameraHeight * aspectRatio;
	var factor = 2;
	camera = new THREE.OrthographicCamera(
	  cameraWidth / -factor, // left
	  cameraWidth / factor, // right
	  cameraHeight / factor, // top
	  cameraHeight / -factor, // bottom
	  0.001, // near
	  1000 // far
	);
    camera.position.z = 30;


    var texloader = new THREE.TextureLoader();
    

	// Create geometries with scaled sizes
	var geometrySun = new THREE.SphereGeometry(sunSizeRatio * scaleFactor, 32, 32);
	var geometryMercury = new THREE.SphereGeometry(mercurySizeRatio * scaleFactor, 32, 32);
	var geometryVenus = new THREE.SphereGeometry(venusSizeRatio * scaleFactor, 32, 32);
	var geometryEarth = new THREE.SphereGeometry(baseSize * scaleFactor, 32, 32);
	var geometryMoon = new THREE.SphereGeometry(moonSizeRatio * scaleFactor, 32, 32);
	var geometryMars = new THREE.SphereGeometry(marsSizeRatio * scaleFactor, 32, 32);
	var geometryJupiter = new THREE.SphereGeometry(jupiterSizeRatio * scaleFactor, 32, 32);
	var geometrySaturn = new THREE.SphereGeometry(saturnSizeRatio * scaleFactor, 32, 32);
	var geometryUranus = new THREE.SphereGeometry(uranusSizeRatio * scaleFactor, 32, 32);
	var geometryNeptune = new THREE.SphereGeometry(neptuneSizeRatio * scaleFactor, 32, 32);

	const sunTexture = texloader.load('tex/2k_sun.jpg');
	const mercuryTexture = texloader.load('tex/2k_mercury.jpg');
	const venusTexture = texloader.load('tex/2k_venus.jpg');
	const earthTexture = texloader.load('tex/2k_earth_daymap.jpg');
	const earthSpecularTexture = texloader.load('tex/2k_earth_specular_map.jpg');
	const moonTexture = texloader.load('tex/2k_moon.jpg');
	const moonSpecularTexture = texloader.load('tex/2k_moon_specular_map.jpg');
	const marsTexture = texloader.load('tex/2k_mars.jpg');
	const jupiterTexture = texloader.load('tex/2k_jupiter.jpg');
	const saturnTexture = texloader.load('tex/2k_saturn.jpg');
	const uranusTexture = texloader.load('tex/2k_uranus.jpg');
	const neptuneTexture = texloader.load('tex/2k_neptune.jpg');

	var materialSun = new THREE.MeshBasicMaterial({
		map: sunTexture,        
		combine: 0,
		wireframe: false
	});

	var materialMercury = new THREE.MeshLambertMaterial({
		map: mercuryTexture,        
		combine: 0,
		wireframe: false
	});

	var materialVenus = new THREE.MeshLambertMaterial({
		map: venusTexture,       
		combine: 0,
		wireframe: false
	});
    

	//This is lambertian material for earth
	// var materialEarth = new THREE.MeshLambertMaterial({
	// 	map: earthTexture,        // Color map
	// 	specularMap: earthSpecularTexture, // Specular map
	// 	specular: new THREE.Color('grey'),
	// 	combine: 0,
	// 	wireframe: false
	// });

	//This is phong material for earth, shininess and metalness can be adjusted
	var materialEarth = new THREE.MeshPhongMaterial({
		map: earthTexture,                // Color map
		specularMap: earthSpecularTexture,    // Specular map
		specular: new THREE.Color('grey'), // Specular color - can be adjusted
		shininess: 100,                   // Shininess factor - high for metallic shine
		metalness: 1.0                    // Metalness factor - defines the metal-like shine
	});

	var materialMoon = new THREE.MeshLambertMaterial({
		map: moonTexture,        
		specularMap: moonSpecularTexture, // Specular map
		combine: 0,
		wireframe: false
	});

	var materialMars = new THREE.MeshLambertMaterial({
		map: marsTexture,      
		combine: 0,
		wireframe: false
	});

	var materialJupiter = new THREE.MeshLambertMaterial({
		map: jupiterTexture,     
		combine: 0,
		wireframe: false
	});

	var materialSaturn = new THREE.MeshLambertMaterial({
		map: saturnTexture,       
		combine: 0,
		wireframe: false
	});

	var materialUranus = new THREE.MeshLambertMaterial({
		map: uranusTexture,        
		combine: 0,
		wireframe: false
	});

	var materialNeptune = new THREE.MeshLambertMaterial({
		map: neptuneTexture,        
		combine: 0,
		wireframe: false
	});


	// Add ambient light to the scene
	var ambientLight = new THREE.AmbientLight(0x202020, 10); // Color, intensity
	solarSystem.add(ambientLight);

    // Add Point Light inside the Sun
    var pointLight = new THREE.PointLight(0xffffff, 200, 100); // Color, intensity, distance
    pointLight.position.set(0, 0, 0); // Assuming the Sun is at the origin
    solarSystem.add(pointLight);

    // Task 7: material using custom Vertex Shader and Fragment Shader
    
	var uniforms = THREE.UniformsUtils.merge( [
	    { 
	    	colorTexture : { value : new THREE.Texture() }
    	},
	    THREE.UniformsLib[ "lights" ]
	] );

	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : vertexShaderCode,
		fragmentShader : fragmentShaderCode,
		lights : true
	});
	shaderMaterial.uniforms.colorTexture.value = earthTexture;

	




	sunMesh = new THREE.Mesh(geometrySun, materialSun);
	mercuryMesh = new THREE.Mesh(geometryMercury, materialMercury);
	venusMesh = new THREE.Mesh(geometryVenus, materialVenus);
    earthMesh = new THREE.Mesh(geometryEarth, materialEarth);
	moonMesh = new THREE.Mesh(geometryMoon, materialMoon);
	marsMesh = new THREE.Mesh(geometryMars, materialMars);
	jupiterMesh = new THREE.Mesh(geometryJupiter, materialJupiter);
	saturnMesh = new THREE.Mesh(geometrySaturn, materialSaturn);
	uranusMesh = new THREE.Mesh(geometryUranus, materialUranus);
	neptuneMesh = new THREE.Mesh(geometryNeptune, materialNeptune);


	

    createSceneGraph();

    renderer = new THREE.WebGLRenderer({
		antialias: true,
		setClearColor: 0x000000,
		setPixelRatio: window.devicePixelRatio,

	});
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;//damping inertia
	controls.dampingFactor = 0.05;//damping inertia factor
	controls.screenSpacePanning = false;
	controls.enableZoom = true;
	controls.enablePan = true;
	controls.minPolarAngle = 0;

	// Add event listeners
    window.addEventListener('resize', onWindowResize, true);

    var checkBoxAnim = document.getElementById('animation');
    animation = checkBoxAnim.checked;
    checkBoxAnim.addEventListener('change', (event) => {
    	animation = event.target.checked;
    });

	var checkBoxWireframe = document.getElementById('wireframe');
	checkBoxWireframe.checked = false;
    earthMesh.material.wireframe = checkBoxWireframe.checked;
    checkBoxWireframe.addEventListener('change', (event) => {
		sunMesh.material.wireframe = event.target.checked;
		mercuryMesh.material.wireframe = event.target.checked;
		venusMesh.material.wireframe = event.target.checked;
    	earthMesh.material.wireframe = event.target.checked;
		moonMesh.material.wireframe = event.target.checked;
		marsMesh.material.wireframe = event.target.checked;
		jupiterMesh.material.wireframe = event.target.checked;
		saturnMesh.material.wireframe = event.target.checked;
		uranusMesh.material.wireframe = event.target.checked;
		neptuneMesh.material.wireframe = event.target.checked;
    });

	document.getElementById('ambientLight').addEventListener('input', function(event) {
		var intensity = event.target.value;
		ambientLight.intensity = intensity;
	});

	document.getElementById('pointLight').addEventListener('input', function(event) {
		var intensity = event.target.value;
		pointLight.intensity = intensity;
	});

	document.getElementById('pointLightDistance').addEventListener('input', function(event) {
		var distance = event.target.value;
		pointLight.distance = distance;
	});

	document.getElementById('dynamicScaling').addEventListener('change', function(event) {
		isDynamicScalingEnabled = event.target.checked;
	});
	
	document.getElementById("Axis").addEventListener('change', function(event) {
		var showAxis = event.target.checked;
		sunAxesHelper.visible = showAxis;
		mercuryAxesHelper.visible = showAxis;
		venusAxesHelper.visible = showAxis;
		earthAxesHelper.visible = showAxis;
		moonAxesHelper.visible = showAxis;
		marsAxesHelper.visible = showAxis;
		jupiterAxesHelper.visible = showAxis;
		saturnAxesHelper.visible = showAxis;
		uranusAxesHelper.visible = showAxis;
		neptuneAxesHelper.visible = showAxis;
	});

	//Show FPS
	stats = new Stats();
	stats.showPanel(0); // Panel 0 = fps
	stats.dom.style.position = 'absolute';
	stats.dom.style.top = '0px';
	stats.dom.style.right = '0px';
	stats.dom.style.left = 'auto';
	document.body.appendChild(stats.dom);


	// orbits with different colors
	createOrbit(mercuryOrbitRadius, 0xff0000);
	createOrbit(venusOrbitRadius, 0xff00ff);
	createOrbit(earthOrbitRadius, 0x00ffff);
	createOrbit(marsOrbitRadius, 0xff0000);
	createOrbit(jupiterOrbitRadius, 0xff00ff);
	createOrbit(saturnOrbitRadius, 0x00ffff);
	createOrbit(uranusOrbitRadius, 0xff0000);
	createOrbit(neptuneOrbitRadius, 0xff00ff);

}

function render() {

	var fps = 60;

    // Perform animations
    if (animation) {
		sunMesh.rotation.y += (2 * Math.PI) / (25 * fps);//25 seconds per rotation

		// Mercury orbit around Sun
		mercurySpin.rotation.y += (2 * Math.PI) / (88 * fps);//88 seconds per rotation
		mercurySpin.position.x = mercuryOrbitRadius * Math.cos(mercurySpin.rotation.y);
		mercurySpin.position.z = - mercuryOrbitRadius * Math.sin(mercurySpin.rotation.y);

		mercuryMesh.rotation.y += (2 * Math.PI) / (58.6 * fps);//58.6 seconds per rotation

		// Venus orbit around Sun
		venusSpin.rotation.y += (2 * Math.PI) / (225 * fps);//225 seconds per rotation
		venusSpin.position.x = venusOrbitRadius * Math.cos(venusSpin.rotation.y);
		venusSpin.position.z = - venusOrbitRadius * Math.sin(venusSpin.rotation.y);

		venusMesh.rotation.y += (2 * Math.PI) / (243 * fps);//243 seconds per rotation

        // Earth orbit around Sun
        earthSpin.rotation.y += (2 * Math.PI) / (365 * fps);//365 seconds per rotation
        earthSpin.position.x = earthOrbitRadius * Math.cos(earthSpin.rotation.y);
        earthSpin.position.z = - earthOrbitRadius * Math.sin(earthSpin.rotation.y);

		earthMesh.rotation.y += (2 * Math.PI) / fps;
		
		// Moon orbit around Earth
		moonSpin.rotation.y += (2 * Math.PI) / (27.3 * fps);//27.3 seconds per rotation
		moonSpin.position.x = moonOrbitRadius * Math.cos(moonSpin.rotation.y);
		moonSpin.position.z = - moonOrbitRadius * Math.sin(moonSpin.rotation.y);

		moonMesh.rotation.y = -earthSpin.rotation.y;

		// Mars orbit around Sun
		marsSpin.rotation.y += (2 * Math.PI) / (687 * fps);//687 seconds per rotation
		marsSpin.position.x = marsOrbitRadius * Math.cos(marsSpin.rotation.y);
		marsSpin.position.z = - marsOrbitRadius * Math.sin(marsSpin.rotation.y);

		marsMesh.rotation.y += (2 * Math.PI) / (1.03 * fps);//1.03 seconds per rotation

		// Jupiter orbit around Sun
		jupiterSpin.rotation.y += (2 * Math.PI) / (4333 * fps);//4333 seconds per rotation
		jupiterSpin.position.x = jupiterOrbitRadius * Math.cos(jupiterSpin.rotation.y);
		jupiterSpin.position.z = - jupiterOrbitRadius * Math.sin(jupiterSpin.rotation.y);

		jupiterMesh.rotation.y += (2 * Math.PI) / (0.41 * fps);//0.41 seconds per rotation
		
		// Saturn orbit around Sun
		saturnSpin.rotation.y += (2 * Math.PI) / (10759 * fps);//10759 seconds per rotation
		saturnSpin.position.x = saturnOrbitRadius * Math.cos(saturnSpin.rotation.y);
		saturnSpin.position.z = - saturnOrbitRadius * Math.sin(saturnSpin.rotation.y);
		
		saturnMesh.rotation.y += (2 * Math.PI) / (0.45 * fps);//0.45 seconds per rotation

		// Uranus orbit around Sun
		uranusSpin.rotation.y += (2 * Math.PI) / (30687 * fps);//30687 seconds per rotation
		uranusSpin.position.x = uranusOrbitRadius * Math.cos(uranusSpin.rotation.y);
		uranusSpin.position.z = - uranusOrbitRadius * Math.sin(uranusSpin.rotation.y);

		uranusMesh.rotation.y += (2 * Math.PI) / (0.72 * fps);//0.72 seconds per rotation

		// Neptune orbit around Sun
		neptuneSpin.rotation.y += (2 * Math.PI) / (60190 * fps);//60190 seconds per rotation
		neptuneSpin.position.x = neptuneOrbitRadius * Math.cos(neptuneSpin.rotation.y);
		neptuneSpin.position.z = - neptuneOrbitRadius * Math.sin(neptuneSpin.rotation.y);

		neptuneMesh.rotation.y += (2 * Math.PI) / (0.67 * fps);//0.67 seconds per rotation


    }

    // Render the scene
	if(isDynamicScalingEnabled){
		adjustPlanetScales();
		adjustSunTransparency();
	}
    renderer.render(scene, camera);

}

function animate() {
    requestAnimationFrame(animate); // Request to be called again for next frame
	controls.update();
	stats.begin();
    render();
	stats.end();
}

function createOrbit(radius, color, yOffset = 0) {
    const orbitGeometry = new THREE.CircleGeometry(radius, 64);
    orbitGeometry.deleteAttribute('normal'); // Optional, remove if not necessary
    orbitGeometry.deleteAttribute('uv'); // Optional, remove if not necessary
    // Remove the center vertex and the last vertex that closes the circle
    const orbitPositions = orbitGeometry.attributes.position.array;
    const newOrbitPositions = new Float32Array((orbitPositions.length / 3 - 2) * 3);
    for (let i = 3, j = 0; i < orbitPositions.length - 3; i += 3, j += 3) {
        newOrbitPositions[j] = orbitPositions[i];
        newOrbitPositions[j + 1] = orbitPositions[i + 1];
        newOrbitPositions[j + 2] = orbitPositions[i + 2];
    }
    const newOrbitGeometry = new THREE.BufferGeometry();
    newOrbitGeometry.setAttribute('position', new THREE.BufferAttribute(newOrbitPositions, 3));
    const orbitMaterial = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
    const orbit = new THREE.LineLoop(newOrbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate to lay flat
    orbit.position.y = yOffset; // Raise above ground
	scene.add(orbit);
    return orbit;
}

function adjustPlanetScales() {
	const minScale = 1; // Minimum scale for planets
    const maxScale = 5; // Maximum scale for visibility when far away
    const minDistance = 10; // Minimum distance for scaling effect
    const maxDistance = 50; // Distance at which maximum scale is applied
    
    const distanceFromSun = camera.position.distanceTo(sunMesh.position);
    const planetScale = calculateScaleBasedOnDistance(distanceFromSun, minScale, maxScale, minDistance, maxDistance);
    
    // Apply the calculated scale to each planet
    mercuryMesh.scale.set(planetScale, planetScale, planetScale);
    venusMesh.scale.set(planetScale, planetScale, planetScale);
    earthMesh.scale.set(planetScale, planetScale, planetScale);
	moonMesh.scale.set(planetScale, planetScale, planetScale);
	marsMesh.scale.set(planetScale, planetScale, planetScale);
	jupiterMesh.scale.set(planetScale, planetScale, planetScale);
	saturnMesh.scale.set(planetScale, planetScale, planetScale);
	uranusMesh.scale.set(planetScale, planetScale, planetScale);
	neptuneMesh.scale.set(planetScale, planetScale, planetScale);

	//axeshelper 
	mercuryAxesHelper.scale.set(planetScale, planetScale, planetScale);
	venusAxesHelper.scale.set(planetScale, planetScale, planetScale);
	earthAxesHelper.scale.set(planetScale, planetScale, planetScale);
	moonAxesHelper.scale.set(planetScale, planetScale, planetScale);
	marsAxesHelper.scale.set(planetScale, planetScale, planetScale);
	jupiterAxesHelper.scale.set(planetScale, planetScale, planetScale);
	saturnAxesHelper.scale.set(planetScale, planetScale, planetScale);
	uranusAxesHelper.scale.set(planetScale, planetScale, planetScale);
	neptuneAxesHelper.scale.set(planetScale, planetScale, planetScale);
	controls.update();
}


function adjustSunTransparency() {
    const distanceFromSun = camera.position.distanceTo(sunMesh.position);
    const transparencyThreshold = 10; // Define a suitable threshold
    if (distanceFromSun < transparencyThreshold) {
        sunMesh.material.opacity = 0.5;
        sunMesh.material.transparent = true;
    } else {
        sunMesh.material.opacity = 1.0;
        sunMesh.material.transparent = false;
    }
}

function calculateScaleBasedOnDistance(distanceFromSun, minScale, maxScale, minDistance, maxDistance) {
    // Clamp the distance within the min and max bounds
    const clampedDistance = Math.min(Math.max(distanceFromSun, minDistance), maxDistance);
    // Normalize the clamped distance between 0 and 1
    const normalizedDistance = (clampedDistance - minDistance) / (maxDistance - minDistance);
    // Calculate scale using an inverse lerp, where the scale decreases as the distance decreases
    const scale = minScale + (1 - normalizedDistance) * (maxScale - minScale);
    return scale;
}

init(); // Set up the scene
animate(); // Enter an infinite loop
