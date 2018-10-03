import { mat4 } from "gl-matrix";

import { fsSource } from "./shaders/frag";
import { vsSource } from "./shaders/vert";

import { ShaderBuilder } from "./models/shaderBuilder";
import { ShaderProgram } from "./models/shaderProgram";

import { RenderBuffer } from "./models/renderBuffer";

import { AttributeLocations } from "./models/attributeLocations";
import { UniformLocations } from "./models/uniformLocations";
import { ProgramInfo } from "./models/programInfo";

const canvas:HTMLCanvasElement = document.querySelector("#glCanvas");

// Initialize the GL context
const gl = canvas.getContext("webgl");

function main() {
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const attribLocations = new AttributeLocations(
        gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        gl.getAttribLocation(shaderProgram, 'aVertexColor'));
    
    const uniformLocations = new UniformLocations(
        gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'));
    
    const programInfo = new ProgramInfo(shaderProgram, attribLocations, uniformLocations);
    const buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers);
}

function initBuffers(gl: WebGLRenderingContext) {

    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.
    const positions = [
    -1.0,  1.0,
    1.0,  1.0,
    -1.0, -1.0,
    1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);
                const colors = [
                    1.0,  1.0,  1.0,  1.0,    // white
                    1.0,  0.0,  0.0,  1.0,    // red
                    0.0,  1.0,  0.0,  1.0,    // green
                    0.0,  0.0,  1.0,  1.0,    // blue
                  ];
                
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    return new RenderBuffer(positionBuffer, colorBuffer);
}

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: RenderBuffer) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
                modelViewMatrix,     // matrix to translate
                [-0.0, 0.0, -6.0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    const vertexCount = 4;
    drawColors(gl, programInfo, buffers);    
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function drawColors(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: RenderBuffer) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const shaderBuilder = new ShaderBuilder();
    shaderBuilder.addShader(new ShaderProgram(vsSource, gl.VERTEX_SHADER));
    shaderBuilder.addShader(new ShaderProgram(fsSource, gl.FRAGMENT_SHADER));
    return shaderBuilder.initShaders(gl);
}

main();