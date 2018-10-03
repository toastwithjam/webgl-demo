import { AttributeLocations } from "./attributeLocations";
import { UniformLocations } from "./uniformLocations";

export class ProgramInfo {
    private readonly shaderProgram: WebGLProgram;
    private readonly attribLocs: AttributeLocations;
    private readonly uniformLocs: UniformLocations;

    constructor(shaderProgram: WebGLProgram, attribLocs: AttributeLocations, uniformLocs: UniformLocations) {
        this.shaderProgram = shaderProgram;
        this.attribLocs = attribLocs;
        this.uniformLocs = uniformLocs;
    }

    get program(): WebGLProgram {
        return this.shaderProgram;
    }

    get attribLocations(): AttributeLocations {
        return this.attribLocs;
    }

    get uniformLocations(): UniformLocations {
        return this.uniformLocs;
    }
}