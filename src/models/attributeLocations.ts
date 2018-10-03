export class AttributeLocations {
    private readonly vertexPos: number;
    private readonly color: number;

    constructor(vertexPos: number, color: number) {
        this.vertexPos = vertexPos;
        this.color = color;
    }

    get vertexPosition(): number {
        return this.vertexPos;
    }

    get vertexColor(): number {
        return this.color;
    }
}