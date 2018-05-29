﻿class GameMain {
    assets = [];
    canvasName: string;
    canvas: any;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    wheels: Wheel[] = new Array(WheelNumber);
    spinRemaining: number = 50;
    spinWining: number = 0;
    textBlock: BABYLON.GUI.TextBlock;
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
            let newmesh = meshes[i].createInstance(meshes[i].name);
            newmesh.isPickable = false;
            newmesh.parent = parent;
        }
        parent.isPickable = false;
        return parent;
    }

    initGame(): void {

        //skybox
        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        //end skybox

        let ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, this.scene);
        ground.position.y = -6;
        //init wheels
        for (let i = 0; i < WheelNumber; i++) {
            this.wheels[i] = new Wheel(i, this);
            this.wheels[i].model.position.x = 3 * i;
        }
        //init lines
        BABYLON.MeshBuilder.CreateCylinder
        let cl = BABYLON.MeshBuilder.CreateCylinder("cl", { height: 10, diameter: 12, arc: 0.6, enclose: true, subdivisions: 3, hasRings: true }, this.scene);
        cl.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
        cl.rotate(BABYLON.Axis.X, - Math.PI * 3 / 4, BABYLON.Space.WORLD);
        cl.position.x = 3;
        let mat = new BABYLON.StandardMaterial("cl", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = BABYLON.Color3.Green();
        cl.material = mat;
        //cl.position.z = -10;
        //spinButton
        let spinButton = BABYLON.MeshBuilder.CreateBox("spinButton", { size: 2, width: 4, height: 2 }, this.scene);
        spinButton.position = new BABYLON.Vector3(0, -5, -6);
        let redMat = new BABYLON.StandardMaterial("ground", this.scene);
        let dynamicTexture = new BABYLON.DynamicTexture("dynamic texture", { width: 64, height: 32 }, this.scene, false);
        let font = "bold 14px monospace";

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
            spinButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (event) => {
                if (this.wheels[0].currentState == E_WHEEL_STATE.IDLE && this.wheels[1].currentState == E_WHEEL_STATE.IDLE && this.wheels[2].currentState == E_WHEEL_STATE.IDLE) {
                    if (this.spinRemaining > 0) {
                        this.spin();
                        this.spinRemaining -= 1;
                    }
                    else {
                        //message here
                    }
                }
            }));
        }

        //init GUI
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let rect1 = new BABYLON.GUI.Rectangle();
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

        this.scene.registerBeforeRender(() => {
            this.updateGUI();
        });

    }
    updateGUI(): void {
        this.textBlock.text = "";
        this.textBlock.text += "Spin Remaining: " + this.spinRemaining;
        this.textBlock.text += "\n";
        this.textBlock.text += "Spin Wining: " + this.spinWining;
    }

    spin(): void {
        let i = 0;
        let rotateSteps: number[] = new Array(WheelNumber);
        for (i = 0; i < WheelNumber; i++) {
            if (i == 0) {
                rotateSteps[i] = Math.floor(Math.random() * 20) + 10;
            }
            else {
                rotateSteps[i] = rotateSteps[i - 1] + Math.floor(Math.random() * 10);
            }
        }
        for (i = 0; i < WheelNumber; i++) {
            setTimeout((i, rotateSteps) => this.wheels[i].rotate(rotateSteps[i]), 500 * i, i, rotateSteps);
        }
    }

    wheelRotateDoneCallback(wheel: Wheel): void {
        wheel.currentState = E_WHEEL_STATE.CALLBACK_DONE;
        if (this.wheels[0].currentState == E_WHEEL_STATE.CALLBACK_DONE &&
            this.wheels[1].currentState == E_WHEEL_STATE.CALLBACK_DONE &&
            this.wheels[2].currentState == E_WHEEL_STATE.CALLBACK_DONE
        ) {
            if ((this.wheels[0].wheelValues[0] == this.wheels[1].wheelValues[0] && this.wheels[1].wheelValues[0] == this.wheels[2].wheelValues[0]) ||
                (this.wheels[0].wheelValues[1] == this.wheels[1].wheelValues[1] && this.wheels[1].wheelValues[1] == this.wheels[2].wheelValues[1]) ||
                (this.wheels[0].wheelValues[2] == this.wheels[1].wheelValues[2] && this.wheels[1].wheelValues[2] == this.wheels[2].wheelValues[2]) ||
                (this.wheels[0].wheelValues[2] == this.wheels[1].wheelValues[1] && this.wheels[1].wheelValues[1] == this.wheels[2].wheelValues[0]) ||
                (this.wheels[0].wheelValues[0] == this.wheels[1].wheelValues[1] && this.wheels[1].wheelValues[1] == this.wheels[2].wheelValues[2])
            ) {
                //win here
                this.spinWining += 1;
            }
            this.wheels[0].currentState = this.wheels[1].currentState = this.wheels[2].currentState = E_WHEEL_STATE.IDLE;
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

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        let loader = new BABYLON.AssetsManager(this.scene);
        let loadWheelTask = loader.addMeshTask("wheel", "", "./assets/wheel/", "wheel.babylon");
        loadWheelTask.onSuccess = (task) => {
            this.initMesh(task);
        }

        loader.load();
        loader.onFinish = (tasks) => {
            this.initGame();
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        };
    }
}