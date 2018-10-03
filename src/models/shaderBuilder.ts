import { ShaderProgram } from "./shaderProgram";

export class ShaderBuilder {
    private shaders: Array<ShaderProgram>;
    constructor() {
        this.shaders = new Array<ShaderProgram>();
    }

    /**
     * addShader
     */
    public addShader(shader: ShaderProgram) {
        if (shader === null) {
            throw Error("Cannot add a null shader!");
        }

        this.shaders.push(shader);
    }

    /**
     * initShaders
     */
    public initShaders(gl: WebGLRenderingContext): WebGLProgram {
        if (gl === null) {
            throw Error("GL Rendering context cannot be null!");
        }

        const shaderProgram = gl.createProgram();
        this.shaders.forEach((shader) => {
            let loadedShader = this.loadShader(gl, shader);
            gl.attachShader(shaderProgram, loadedShader);

        });

        gl.linkProgram(shaderProgram);
  
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
  
        return shaderProgram;
    }

    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    private loadShader(gl: WebGLRenderingContext, shaderProgram: ShaderProgram): WebGLShader {
        const shader = gl.createShader(shaderProgram.shaderType);
    
        // Send the source to the shader object  
        gl.shaderSource(shader, shaderProgram.shaderSrc);
    
        // Compile the shader program
        gl.compileShader(shader);
    
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
    
        return shader;
    }
}