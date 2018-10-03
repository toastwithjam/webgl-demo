export class UniformLocations {

    private readonly projectionMat: WebGLUniformLocation;
    private readonly modelViewMat: WebGLUniformLocation;

    constructor(projection: WebGLUniformLocation, modelView: WebGLUniformLocation) {
        this.projectionMat = projection;
        this.modelViewMat = modelView;
    }

    get projectionMatrix(): WebGLUniformLocation {
        return this.projectionMat;
    }

    get modelViewMatrix(): WebGLUniformLocation {
        return this.modelViewMat;
    }
}