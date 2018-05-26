var GameMain = (function () {
    function GameMain(canvasName) {
        this.assets = [];
        this.wheels = new Array(WheelNumber);
        this.wheelValues = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
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
        var ground = BABYLON.Mesh.CreateGround("ground1", 50, 50, 2, this.scene);
        ground.position.y = -10;
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
        //cl.position.z = -10;
        //spinButton
        var spinButton = BABYLON.MeshBuilder.CreateBox("spinButton", { size: 1, width: 1, height: 2 }, this.scene);
        spinButton.position = new BABYLON.Vector3(0, 0, -10);
        var redMat = new BABYLON.StandardMaterial("ground", this.scene);
        redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.emissiveColor = BABYLON.Color3.Red();
        spinButton.material = redMat;
        var _self = this;
        if (spinButton.actionManager == null) {
            spinButton.actionManager = new BABYLON.ActionManager(this.scene);
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Red()));
            spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Blue()));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickDownTrigger, spinButton, "scaling", new BABYLON.Vector3(0.5, 0.5, 0.5), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickUpTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            spinButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function (event) {
                _self.spin();
            }));
        }
    };
    GameMain.prototype.spin = function () {
        var _this = this;
        var i = 0;
        var rotateSteps = new Array(WheelNumber);
        for (i = 0; i < WheelNumber; i++) {
            if (i == 0) {
                rotateSteps[i] = Math.floor(Math.random() * 20) + 20;
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
        for (i = 0; i < 3; i++) {
            wheel.gameMain.wheelValues[wheel.id][i] = wheel.wheelValue + i;
        }
        if (wheel.id == WheelNumber - 1) {
            if (wheel.gameMain.wheelValues[0][0] == wheel.gameMain.wheelValues[1][0] && wheel.gameMain.wheelValues[1][0] == wheel.gameMain.wheelValues[2][0] ||
                wheel.gameMain.wheelValues[0][1] == wheel.gameMain.wheelValues[1][1] && wheel.gameMain.wheelValues[1][1] == wheel.gameMain.wheelValues[2][1] ||
                wheel.gameMain.wheelValues[0][2] == wheel.gameMain.wheelValues[1][2] && wheel.gameMain.wheelValues[1][2] == wheel.gameMain.wheelValues[2][2] ||
                wheel.gameMain.wheelValues[0][2] == wheel.gameMain.wheelValues[1][1] && wheel.gameMain.wheelValues[1][1] == wheel.gameMain.wheelValues[2][0] ||
                wheel.gameMain.wheelValues[0][0] == wheel.gameMain.wheelValues[1][1] && wheel.gameMain.wheelValues[1][1] == wheel.gameMain.wheelValues[2][2]) {
                //win here
                var a = 0;
                a = 1;
            }
        }
    };
    GameMain.prototype.run = function () {
        this.canvas = document.getElementById(this.canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-5, 15, -30), this.scene);
        camera.setTarget(new BABYLON.Vector3(3, 3, 0));
        camera.attachControl(this.engine.getRenderingCanvas());
        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 50, 0), this.scene);
        h.intensity = 0.8;
        window.addEventListener("resize", function () {
            _self.engine.resize();
        });
        var _self = this;
        var loader = new BABYLON.AssetsManager(this.scene);
        var loadWheelTask = loader.addMeshTask("wheel", "", "./assets/wheel/", "wheel.babylon");
        loadWheelTask.onSuccess = function (task) {
            _self.initMesh(task);
        };
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
    };
    return GameMain;
}());
//# sourceMappingURL=GameMain.js.map