// Get the canvas element and context
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// Check if WebGL is available
if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
} else {
    // Set clear color to black, fully opaque
    gl.clearColor(1.0, 0.647, 0.0, 1.0);  // RGBA for orange

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function createShader(gl, sourceCode, type) {
    // Create a shader object
    const shader = gl.createShader(type);
    // Attach the GLSL code
    gl.shaderSource(shader, sourceCode);
    // Compile the shader
    gl.compileShader(shader);
    // Check the compilation status
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    // Create a program object
    const program = gl.createProgram();
    // Attach the shaders
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // Link the program
    gl.linkProgram(program);
    // Check the link status
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

// Get shader source code from HTML
const vertexSource = document.getElementById('vertex-shader').textContent;
const fragmentSource = document.getElementById('fragment-shader').textContent;

// Compile shaders
const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

// Link shaders into a program
const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(shaderProgram);


function createTextCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';  // Red text
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Happy Birthday', canvas.width / 2, canvas.height / 2);
    return canvas;
}

// Function to create text canvas
function createTextCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Happy Birthday', canvas.width / 2, canvas.height / 2);
    return canvas;
}

// Additional shader setup
const program = shaderProgram;  // Assume shaderProgram is your compiled shader program
gl.useProgram(program);

const positionAttribLocation = gl.getAttribLocation(program, "position");
const texcoordAttribLocation = gl.getAttribLocation(program, "texcoord");
const rotationXUniformLocation = gl.getUniformLocation(program, "rotationX");
const rotationYUniformLocation = gl.getUniformLocation(program, "rotationY");

// Define rectangle vertices and texture coordinates
const vertices = new Float32Array([
    -0.5,  0.5,  0.0, 1.0,  // Top-left corner
    -0.5, -0.5,  0.0, 0.0,  // Bottom-left corner
     0.5,  0.5,  1.0, 1.0,  // Top-right corner
     0.5, -0.5,  1.0, 0.0,  // Bottom-right corner
]);

// Create and bind vertex buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Define vertex attribute pointers
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(texcoordAttribLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(texcoordAttribLocation);


// Create a WebGL texture from the text canvas
const textCanvas = createTextCanvas();
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// ... (Set up your WebGL buffers and draw the texture on a rectangle here)

const textureUniformLocation = gl.getUniformLocation(program, "u_texture");
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(textureUniformLocation, 0);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: 0, y: 0 };

// Mouse Events
canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', stopDragging);
canvas.addEventListener('mouseleave', stopDragging);

// Touch Events
canvas.addEventListener('touchstart', (e) => {
    startDragging(e.touches[0]);
});
canvas.addEventListener('touchmove', (e) => {
    drag(e.touches[0]);
    e.preventDefault(); // Prevent scrolling while dragging
});
canvas.addEventListener('touchend', stopDragging);

function startDragging(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
}

function drag(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    rotation.x += deltaY * 0.01;
    rotation.y += deltaX * 0.01;

    // Redraw WebGL scene here...
    drawScene();

    previousMousePosition = { x: e.clientX, y: e.clientY };
}

function stopDragging() {
    isDragging = false;
}


// Drawing function
function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.uniform1f(rotationXUniformLocation, rotation.x);
    gl.uniform1f(rotationYUniformLocation, rotation.y);
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// Ensure initial draw
drawScene();	

document.addEventListener("DOMContentLoaded", function() {
    const audioElement = document.getElementById("birthdaySong");
    audioElement.play();
});
let animationFrameId = null;

function playAudio() {
    const audioElement = document.getElementById("birthdaySong");
    audioElement.play();

    // If you have an animation loop, start/restart it here
    if (animationFrameId === null) {
        animate();  // Assume animate is your function that calls requestAnimationFrame
    }
}

function pauseAudio() {
    const audioElement = document.getElementById("birthdaySong");
    audioElement.pause();

    // If you have an animation loop, pause it here
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function animate() {
   // Clear the WebGL canvas
   gl.clear(gl.COLOR_BUFFER_BIT);

   // Update uniforms (e.g., rotation) if necessary
   // ...

   // Bind buffers, if not already bound
   // ...

   // Draw the WebGL content
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Request the next frame
    animationFrameId = requestAnimationFrame(animate);
}
