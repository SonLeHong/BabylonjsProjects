var GameMain = /** @class */ (function () {
    function GameMain(canvasName) {
        this.assets = [];
        this.wheels = new Array(WheelNumber);
        this.wheelValues = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        this.wheelStates = [E_WHEEL_STATE.IDLE, E_WHEEL_STATE.IDLE, E_WHEEL_STATE.IDLE];
        this.spinRemaining = 50;
        this.spinWining = 0;
        this.canvasName = canvasName;
    }
    GameMain.prototype.initMesh = function (task) {
        this.assets[task.name] = { meshes: task.loadedMeshes };
    };
    GameMain.prototype.createMesh = function (obj, name) {
        var parent = new BABYLON.Mesh(name, this.scene);
        var meshes = obj.meshes;
        for (var i = 0; i < meshes.length; i++) {
            var newmesh = meshes[i].createInstance(meshes[i].name);
            newmesh.isPickable = false;
            newmesh.parent = parent;
        }
        parent.isPickable = false;
        return parent;
    };
    GameMain.prototype.initGame = function () {
        var _this = this;
        var ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, this.scene);
        ground.position.y = -6;
        //init wheels
        for (var i = 0; i < WheelNumber; i++) {
            this.wheels[i] = new Wheel(i, this);
            this.wheels[i].model.position.x = 3 * i;
        }
        //init lines
        BABYLON.MeshBuilder.CreateCylinder;
        var cl = BABYLON.MeshBuilder.CreateCylinder("cl", { height: 10, diameter: 12, arc: 0.6, enclose: true, subdivisions: 3, hasRings: true }, this.scene);
        cl.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
        cl.rotate(BABYLON.Axis.X, -Math.PI * 3 / 4, BABYLON.Space.WORLD);
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
        if (spinButton.actionManager == null) {
            spinButton.actionManager = new BABYLON.ActionManager(this.scene);
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Red()));
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Blue()));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickDownTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 0.5, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickUpTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function (event) {
                if (_this.spinRemaining > 0) {
                    _this.spin();
                    _this.spinRemaining -= 1;
                }
                else {
                }
            }));
        }
        //init GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rect1.adaptWidthToChildren = true;
        rect1.height = "80px";
        //rect1.cornerRadius = 20;
        rect1.color = "Orange";
        rect1.thickness = 0;
        //rect1.background = "green";
        advancedTexture.addControl(rect1);
        this.textBlock = new BABYLON.GUI.TextBlock();
        this.textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.textBlock.text += "Spin Remaining: " + this.spinRemaining;
        this.textBlock.text += "\n";
        this.textBlock.text += "Spin Wining: " + this.spinWining;
        this.textBlock.color = "white";
        this.textBlock.width = "300px";
        this.textBlock.fontSize = 24;
        rect1.addControl(this.textBlock);
        this.scene.registerBeforeRender(function () {
            _this.updateGUI();
        });
    };
    GameMain.prototype.updateGUI = function () {
        this.textBlock.text = "";
        this.textBlock.text += "Spin Remaining: " + this.spinRemaining;
        this.textBlock.text += "\n";
        this.textBlock.text += "Spin Wining: " + this.spinWining;
    };
    GameMain.prototype.spin = function () {
        var _this = this;
        var i = 0;
        var rotateSteps = new Array(WheelNumber);
        for (i = 0; i < WheelNumber; i++) {
            if (i == 0) {
                rotateSteps[i] = Math.floor(Math.random() * 20) + 10;
            }
            else {
                rotateSteps[i] = rotateSteps[i - 1] + Math.floor(Math.random() * 10);
            }
        }
        for (i = 0; i < WheelNumber; i++) {
            setTimeout(function (i, rotateSteps) { return _this.wheels[i].rotate(rotateSteps[i]); }, 500 * i, i, rotateSteps);
        }
    };
    GameMain.prototype.wheelRotateDoneCallback = function (wheel) {
        var i = 0;
        console.log(wheel.id + ": " + wheel.wheelValue);
        for (i = 0; i < 3; i++) {
            this.wheelValues[wheel.id][i] = (wheel.wheelValue + i) % E_WHEEL_VALUE.MAX;
        }
        this.wheelStates[wheel.id] = E_WHEEL_STATE.CALLBACK_DONE;
        if (this.wheelStates[0] == E_WHEEL_STATE.CALLBACK_DONE &&
            this.wheelStates[1] == E_WHEEL_STATE.CALLBACK_DONE &&
            this.wheelStates[2] == E_WHEEL_STATE.CALLBACK_DONE) {
            if ((this.wheelValues[0][0] == this.wheelValues[1][0] && this.wheelValues[1][0] == this.wheelValues[2][0]) ||
                (this.wheelValues[0][1] == this.wheelValues[1][1] && this.wheelValues[1][1] == this.wheelValues[2][1]) ||
                (this.wheelValues[0][2] == this.wheelValues[1][2] && this.wheelValues[1][2] == this.wheelValues[2][2]) ||
                (this.wheelValues[0][2] == this.wheelValues[1][1] && this.wheelValues[1][1] == this.wheelValues[2][0]) ||
                (this.wheelValues[0][0] == this.wheelValues[1][1] && this.wheelValues[1][1] == this.wheelValues[2][2])) {
                //win here
                var a = 0;
                a = 1;
            }
        }
    };
    GameMain.prototype.run = function () {
        var _this = this;
        this.canvas = document.getElementById(this.canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-5, 15, -35), this.scene);
        camera.setTarget(new BABYLON.Vector3(3, 3, 0));
        camera.attachControl(this.engine.getRenderingCanvas());
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 50, 0), this.scene);
        h.intensity = 0.8;
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        var loader = new BABYLON.AssetsManager(this.scene);
        var loadWheelTask = loader.addMeshTask("wheel", "", "./assets/wheel/", "wheel.babylon");
        loadWheelTask.onSuccess = function (task) {
            _this.initMesh(task);
        };
        loader.load();
        loader.onFinish = function (tasks) {
            _this.initGame();
            _this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
    };
    return GameMain;
}());
//# sourceMappingURL=GameMain.js.map