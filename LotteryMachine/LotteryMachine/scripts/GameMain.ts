class GameMain
{
    canvas: any;
    engine: BABYLON.Engine;

    constructor(canvasName: string) {
        this.canvas = document.getElementById(canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);

    }
}