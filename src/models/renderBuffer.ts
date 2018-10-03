export class RenderBuffer {
    private readonly positionBuffer: WebGLBuffer;
    private readonly colorBuffer: WebGLBuffer;

    constructor(position: WebGLBuffer, color: WebGLBuffer) {
        this.positionBuffer = position;
        this.colorBuffer = color;
    }

    get position(): WebGLBuffer {
        return this.positionBuffer;
    }

    get color(): WebGLBuffer {
        return this.colorBuffer;
    }
}