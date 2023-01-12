var canvas = null;
var gl = null;
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;


var shaderProgramObject;
var projectionMatrix;

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame ||
                            window.oRequestAnimationFrame ||
                            window.msRequestAnimationFrame;
                            
/*
To stop animation 
var cancelAnimationFrame = window.cancelAnimationFrame ||
                            window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
                            window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
                            window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
                            window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame;
*/

var dynamicModel;

function main()
{
    // Code
    canvas = document.getElementById("RAK");
    if(!canvas)
    {
        console.log("Faied to obtain canvas");
    }
    else
    {
        console.log("Obtained canvas successfully");
    }

    // Backup canvas dimensions
    canvas_original_width = canvas.width;
    canvas_original_height = canvas.height;

    // initialize
    initialize();

    // resize
    resize();

    // display
    display();

    // Adding keyboard & mouse event listeners 
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);
    window.addEventListener("resize", resize, false);
}

function toggleFullscreen()
{
    // code
    var fullscreen_element = document.fullscreenElement ||
                                document.mozFullScreenElement ||
                                document.webkitFullscreenElement ||
                                document.msFullscreenElement ||
                                null;

    if(fullscreen_element == null) // if not fullscreen
    {
        if(canvas.requstFullscreen)
            canvas.requstFullscreen();
        else if(canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if(canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if(canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();

        bFullscreen = true;
    }
    else
    {
        if(document.exitFullscreen)
            document.exitFullscreen();
        else if(document.mozExitFullScreen)
            document.mozExitFullScreen();
        else if(document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if(document.msExitFullscreen)
            document.msExitFullscreen();

        bFullscreen = false;
    }
}

function initialize()
{
    //code
    // Get 2D context frm canvas
    gl = canvas.getContext("webgl2");
    if(!gl)
    {
        console.log("Faied to obtain WebGL2.0 context");
    }
    else
    {
        console.log("Obtained WebGL2.0 context successfully");
    }

    // Set viewport width & height
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    // Depth related changes
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    dynamicModel = new DynamicModel("Resources/walk.json");

    projectionMatrix = mat4.create();

    // Clear screen by blue color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function resize()
{
    //code
    if(bFullscreen == true)
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else
    {
        canvas.width = canvas_original_width;
        canvas.height = canvas_original_height;
    }

    if ( canvas.height == 0)
        canvas.height = 1;     // To avoid divided by 0 in future code.

    gl.viewport(0, 0, canvas.width, canvas.height);
    
    mat4.perspective(projectionMatrix, 45, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 10000);
}

function display()
{
    //code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Transformations
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0.0, 0.0, 0.0], [0.0, 0.0, -100.0], [0.0, 1.0, 0.0]);

    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0.0, -15.2, -100.0]); // translate it down so it's at the center of the scene
    mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 0.2]);	// it's a bit too big for our scene, so scale it down

    dynamicModel.draw(modelMatrix, viewMatrix, projectionMatrix);

    // Double buffering emulation
    requestAnimationFrame(display, canvas);
}

function update()
{
    //code
}

// Keyboard Event Listener
function keyDown(event)
{
    // Code
    switch(event.keyCode)
    {
        case 27:
            uninitialize();
            window.close();  // No supported in all browsers 
            break;

        case 70:
            toggleFullscreen(); 
            break;
    }
}

// Mouse Event Listener
function mouseDown()
{
    // Code
}

function uninitialize()
{
    //code 
    dynamicModel.uninitialize();
}
