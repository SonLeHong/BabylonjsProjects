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

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, -10), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 0, 0));
        //camera.attachControl(this.engine.getRenderingCanvas());

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

        //button
        var spinButton = BABYLON.MeshBuilder.CreateBox("spinButton", { size: 3, width: 3, height: 5 }, this.scene);
        spinButton.position = new BABYLON.Vector3(5, 0, 0);
        //spinButton.
        var redMat = new BABYLON.StandardMaterial("ground", this.scene);
        redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.emissiveColor = BABYLON.Color3.Red();
        spinButton.material = redMat;

        if (spinButton.actionManager == null) {
            spinButton.actionManager = new BABYLON.ActionManager(this.scene);
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Red()));
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.White()));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickDownTrigger, spinButton, "scaling", new BABYLON.Vector3(0.5, 0.5, 0.5), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickUpTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        }

        
    }
}