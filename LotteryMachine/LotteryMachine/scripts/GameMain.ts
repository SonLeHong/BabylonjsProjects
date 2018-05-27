class GameMain {
    assets = [];
    canvasName: string;
    canvas: any;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    wheels: Wheel[] = new Array(WheelNumber);
    wheelValues: number[][] = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
    wheelStates: E_WHEEL_STATE[] = [E_WHEEL_STATE.IDLE, E_WHEEL_STATE.IDLE, E_WHEEL_STATE.IDLE];
    constructor(canvasName: string) {
        this.canvasName = canvasName;
    }

    initMesh(task): void {
        this.assets[task.name] = { meshes: task.loadedMeshes };
    }

    createMesh(obj, name): BABYLON.Mesh {
        let parent = new BABYLON.Mesh(name, this.scene);

        let meshes = obj.meshes;
        for (let i = 0; i < meshes.length; i++) {
            var newmesh = meshes[i].createInstance(meshes[i].name);
            newmesh.isPickable = false;
            newmesh.parent = parent;
        }
        parent.isPickable = false;
        return parent;
    }

    initGame(): void {
        var ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, this.scene);
        ground.position.y = -6;
        //init wheels
        for (var i = 0; i < WheelNumber; i++) {
            this.wheels[i] = new Wheel(i, this);
            this.wheels[i].model.position.x = 3 * i;
        }
        //init lines
        BABYLON.MeshBuilder.CreateCylinder
        var cl = BABYLON.MeshBuilder.CreateCylinder("cl", { height: 10, diameter: 12, arc: 0.6, enclose: true, subdivisions: 3, hasRings: true }, this.scene);
        cl.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
        cl.rotate(BABYLON.Axis.X, - Math.PI * 3 / 4, BABYLON.Space.WORLD);
        cl.position.x = 3;
        var mat = new BABYLON.StandardMaterial("cl", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = BABYLON.Color3.Green();
        cl.material = mat;
        //cl.position.z = -10;
        //spinButton
        var spinButton = BABYLON.MeshBuilder.CreateBox("spinButton", { size: 2, width: 4, height: 2 }, this.scene);
        spinButton.position = new BABYLON.Vector3(0, -5, -6);
        var redMat = new BABYLON.StandardMaterial("ground", this.scene);
        var dynamicTexture = new BABYLON.DynamicTexture("dynamic texture", { width: 64, height: 32 }, this.scene, false);   
        var font = "bold 14px monospace";
        
        redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.emissiveColor = BABYLON.Color3.Red();
        redMat.diffuseTexture = dynamicTexture;
        spinButton.material = redMat;
        dynamicTexture.drawText("Spin", 20, 16, font, "green", "white", true, true);
        spinButton.setPivotPoint(new BABYLON.Vector3(0, -1, 0));
        let _self = this;
        if (spinButton.actionManager == null) {
            spinButton.actionManager = new BABYLON.ActionManager(this.scene);
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Red()));
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Blue()));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickDownTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 0.5, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickUpTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function (event) {
                _self.spin();
            }));
        }

        //init GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rect1.adaptWidthToChildren = true;
        rect1.height = "40px";
        rect1.cornerRadius = 20;
        rect1.color = "Orange";
        rect1.thickness = 0;
        //rect1.background = "green";
        advancedTexture.addControl(rect1);

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Hello world";
        text1.color = "white";
        text1.width = "150px";
        text1.fontSize = 24;
        rect1.addControl(text1);    

    }

    spin(): void {
        let i = 0;
        var rotateSteps: number[] = new Array(WheelNumber);
        for (i = 0; i < WheelNumber; i++) {
            if (i == 0) {
                rotateSteps[i] = Math.floor(Math.random() * 20) + 10;
            }
            else {
                rotateSteps[i] = rotateSteps[i - 1] + Math.floor(Math.random() * 10);
            }
        }
        for (i = 0; i < WheelNumber; i++) {
            //this.wheels[i].rotate(1);
            setTimeout((i, rotateSteps) => this.wheels[i].rotate(rotateSteps[i]), 500 * i, i, rotateSteps);
        }
    }

    wheelRotateDoneCallback(wheel: Wheel): void {
        let i = 0;
        console.log(wheel.id + ": " + wheel.wheelValue);
        for (i = 0; i < 3; i++) {
            wheel.gameMain.wheelValues[wheel.id][i] = (wheel.wheelValue + i) % E_WHEEL_VALUE.MAX;
        }
        wheel.gameMain.wheelStates[wheel.id] = E_WHEEL_STATE.CALLBACK_DONE;

        if (wheel.gameMain.wheelStates[0] == E_WHEEL_STATE.CALLBACK_DONE &&
            wheel.gameMain.wheelStates[1] == E_WHEEL_STATE.CALLBACK_DONE &&
            wheel.gameMain.wheelStates[2] == E_WHEEL_STATE.CALLBACK_DONE
        ) {
            if ((wheel.gameMain.wheelValues[0][0] == wheel.gameMain.wheelValues[1][0] && wheel.gameMain.wheelValues[1][0] == wheel.gameMain.wheelValues[2][0]) ||
                (wheel.gameMain.wheelValues[0][1] == wheel.gameMain.wheelValues[1][1] && wheel.gameMain.wheelValues[1][1] == wheel.gameMain.wheelValues[2][1]) ||
                (wheel.gameMain.wheelValues[0][2] == wheel.gameMain.wheelValues[1][2] && wheel.gameMain.wheelValues[1][2] == wheel.gameMain.wheelValues[2][2]) ||
                (wheel.gameMain.wheelValues[0][2] == wheel.gameMain.wheelValues[1][1] && wheel.gameMain.wheelValues[1][1] == wheel.gameMain.wheelValues[2][0]) ||
                (wheel.gameMain.wheelValues[0][0] == wheel.gameMain.wheelValues[1][1] && wheel.gameMain.wheelValues[1][1] == wheel.gameMain.wheelValues[2][2])
            ) {
                //win here
                var a = 0;
                a = 1;
            }
        }
    }

    run(): void {

        this.canvas = document.getElementById(this.canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        let camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-5, 15, -35), this.scene);
        camera.setTarget(new BABYLON.Vector3(3, 3, 0));
        camera.attachControl(this.engine.getRenderingCanvas());

        // Hemispheric light to light the scene
        let h = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 50, 0), this.scene);
        h.intensity = 0.8;

        window.addEventListener("resize", function () {
            _self.engine.resize();
        });

        let _self = this;
        var loader = new BABYLON.AssetsManager(this.scene);
        var loadWheelTask = loader.addMeshTask("wheel", "", "./assets/wheel/", "wheel.babylon");
        loadWheelTask.onSuccess = function (task) {
            _self.initMesh(task);
        }
        //loadWheelTask.onError = function (task, message, exception) {
        //    _self.initMesh(task);
        //}
        loader.load();
        loader.onFinish = function (tasks) {
            _self.initGame();
            _self.engine.runRenderLoop(function () {
                _self.scene.render();
            });
        };
    }
}