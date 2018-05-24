class GameMain {
    canvasName: string;
    canvas: any;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(canvasName: string) {
        this.canvasName = canvasName;
    }

    run() {
        this.canvas = document.getElementById(this.canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 50, -50), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 150, -50), this.scene);
        //camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(this.engine.getRenderingCanvas());

        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 100, 0), this.scene);
        h.intensity = 0.8;

        let _self = this;

        window.addEventListener("resize", function () {
            _self.engine.resize();
        });

        this.engine.runRenderLoop(function () {
            _self.scene.render();
        });

        var wheel1: Wheel = new Wheel(10, 2, this.scene);
        wheel1.rotate();
    }
}