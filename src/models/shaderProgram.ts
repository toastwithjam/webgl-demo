import { Shader } from "../interfaces/shader";

export class ShaderProgram implements Shader {
    private readonly src: string;
    private type: number;

    constructor(src: string, shaderType: number) {
        this.src = src;
        this.type = shaderType;
    }

    get shaderSrc(): string {
        return this.src;
    }

    get shaderType(): number {
        return this.type;
    }
}