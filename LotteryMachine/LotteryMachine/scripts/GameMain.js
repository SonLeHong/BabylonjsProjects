var GameMain = /** @class */ (function () {
    function GameMain(canvasName) {
        this.assets = [];
        this.wheels = new Array(3);
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
        var _self = this;
        //let wheel1 = new Wheel(this);
        for (var i = 0; i < 3; i++) {
            this.wheels[i] = new Wheel(this);
            this.wheels[i].model.rotate(BABYLON.Axis.X, -0.15, BABYLON.Space.WORLD);
            this.wheels[i].model.position.x = 3 * i;
            setTimeout(function (i) { return _this.wheels[i].rotate(); }, 1000 * i, i);
        }
    };
    GameMain.prototype.run = function () {
        this.canvas = document.getElementById(this.canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 30, -10), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 0, 0));
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
        // here the doc for Load function: http://doc.babylonjs.com/api/classes/babylon.sceneloader#load
        //BABYLON.SceneLoader.Load("./assets/wheel/", "wheel.babylon", _self.engine, function (scene) {
        //    _self.engine.runRenderLoop(function () {
        //        scene.render();
        //    });
        //});
        //button
        //var spinButton = BABYLON.MeshBuilder.CreateBox("spinButton", { size: 3, width: 3, height: 5 }, this.scene);
        //spinButton.position = new BABYLON.Vector3(5, 0, 0);
        ////spinButton.
        //var redMat = new BABYLON.StandardMaterial("ground", this.scene);
        //redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        //redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        //redMat.emissiveColor = BABYLON.Color3.Red();
        //spinButton.material = redMat;
        //if (spinButton.actionManager == null) {
        //    spinButton.actionManager = new BABYLON.ActionManager(this.scene);
        //    spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.Red()));
        //    spinButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, spinButton.material, "emissiveColor", BABYLON.Color3.White()));
        //    spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickDownTrigger, spinButton, "scaling", new BABYLON.Vector3(0.5, 0.5, 0.5), 150));
        //    spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickUpTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        //    spinButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, spinButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        //}
    };
    return GameMain;
}());
//# sourceMappingURL=GameMain.js.map