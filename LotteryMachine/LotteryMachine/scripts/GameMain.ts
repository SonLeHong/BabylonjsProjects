class GameMain {
    assets = [];
    canvasName: string;
    canvas: any;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    wheels: Wheel[] = new Array(WheelNumber);
    spinRemaining: number = 50;
    spinWining: number = 0;
    goldWining: number = 0;
    textBlock: BABYLON.GUI.TextBlock;
    textNotification: BABYLON.GUI.TextBlock;
    backgroundMusic: BABYLON.Sound;
    spinSound: BABYLON.Sound;
    currentGameState: E_GAME_STATE;
    bonusBoxs: BoxBonus[] = new Array(3);
    cheat: boolean = false;
    showNotifyTimeoutId: number;
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
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.4 }, this.scene);

        //init wheels
        for (let i = 0; i < WheelNumber; i++) {
            this.wheels[i] = new Wheel(i, this);
            this.wheels[i].model.position.x = 3 * i;
        }
        //init lines
        let cl = BABYLON.MeshBuilder.CreateCylinder("cl", { height: 10, diameter: 12, arc: 0.7, enclose: true, subdivisions: 3, hasRings: true }, this.scene);
        cl.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD);
        cl.rotate(BABYLON.Axis.X, - Math.PI * 3 / 4, BABYLON.Space.WORLD);
        cl.position.x = 3;
        let mat = new BABYLON.StandardMaterial("cl", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
        mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveColor = BABYLON.Color3.Blue();
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
                if (this.currentGameState == E_GAME_STATE.WAIT_PICK_BONUS) {
                    return;
                }
                this.currentGameState = E_GAME_STATE.SPIN;
            }));
        }

        //cheatButton
        let cheatButton = BABYLON.MeshBuilder.CreateBox("cheatButton", { size: 2, width: 4, height: 2 }, this.scene);
        cheatButton.position = new BABYLON.Vector3(10, -5, -6);
        let redMatCheatButton = new BABYLON.StandardMaterial("ground", this.scene);
        let dynamicTextureCheatButton = new BABYLON.DynamicTexture("dynamic texture", { width: 64, height: 32 }, this.scene, false);

        redMatCheatButton.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMatCheatButton.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMatCheatButton.emissiveColor = BABYLON.Color3.Red();
        redMatCheatButton.diffuseTexture = dynamicTextureCheatButton;
        cheatButton.material = redMatCheatButton;
        dynamicTextureCheatButton.drawText("Cheat", 20, 16, font, "green", "white", true, true);
        cheatButton.setPivotPoint(new BABYLON.Vector3(0, -1, 0));
        if (cheatButton.actionManager == null) {
            cheatButton.actionManager = new BABYLON.ActionManager(this.scene);
            cheatButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, cheatButton.material, "emissiveColor", BABYLON.Color3.Red()));
            cheatButton.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, cheatButton.material, "emissiveColor", BABYLON.Color3.Blue()));
            cheatButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickDownTrigger, cheatButton, "scaling", new BABYLON.Vector3(1, 0.5, 1), 150));
            cheatButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickUpTrigger, cheatButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            cheatButton.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, cheatButton, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            cheatButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (event) => {
                if (this.currentGameState == E_GAME_STATE.WAIT_PICK_BONUS) {
                    return;
                }
                this.cheat = true;
                this.currentGameState = E_GAME_STATE.SPIN;
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
        this.textBlock.color = "White";
        this.textBlock.width = "300px";
        this.textBlock.fontSize = 24;
        rect1.addControl(this.textBlock);

        let rect2 = new BABYLON.GUI.Rectangle();
        rect2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rect2.adaptWidthToChildren = true;
        rect2.height = "80px";
        //rect1.cornerRadius = 20;
        rect2.color = "Orange";
        rect2.thickness = 0;
        //rect1.background = "green";
        advancedTexture.addControl(rect2);

        this.textNotification = new BABYLON.GUI.TextBlock();
        this.textNotification.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.textNotification.color = "red";
        this.textNotification.width = "300px";
        this.textNotification.fontSize = 36;
        rect2.addControl(this.textNotification);

        this.currentGameState = E_GAME_STATE.IDLE;
        //this.scene.registerBeforeRender(() => {
        //    this.updateGUI();
        //});
    }

    showNotificationMessage(text: string, textColor: string, fontSize: number, timeOut: number): void {
        this.textNotification.text = text;
        this.textNotification.color = textColor;
        this.textNotification.fontSize = fontSize;
        clearTimeout(this.showNotifyTimeoutId);
        this.showNotifyTimeoutId = setTimeout((timeOut) => {
            this.textNotification.text = "";
        }, timeOut);
    }

    update(): void {
        switch (this.currentGameState) {
            case E_GAME_STATE.INIT:
                this.initGame();
                break;
            case E_GAME_STATE.IDLE:
                break;
            case E_GAME_STATE.SPIN:                
                if (this.wheels[0].currentState == E_WHEEL_STATE.IDLE && this.wheels[1].currentState == E_WHEEL_STATE.IDLE && this.wheels[2].currentState == E_WHEEL_STATE.IDLE) {
                    if (this.spinRemaining > 0) {
                        this.spin();
                        this.spinRemaining -= 1;
                        this.showNotificationMessage("-1 spin", "red", 32, 2000);
                    }
                    else {
                        //message here
                    }
                }
                this.currentGameState = E_GAME_STATE.UPDATE_WHEEL;
                break;
            case E_GAME_STATE.UPDATE_WHEEL:
                for (let i = 0; i < WheelNumber; i++) {
                    if (this.wheels[i].currentState == E_WHEEL_STATE.ROTATE) {
                        this.wheels[i].update();
                    }
                }
                break;
            case E_GAME_STATE.PICK_BONUS:
                for (let i = 0; i < 3; i++) {
                    let goldBonus = Math.floor(Math.random() * 5) + 5;
                    setTimeout((i, goldBonus) => {
                        this.bonusBoxs[i] = new BoxBonus(goldBonus * 100, new BABYLON.Vector3(10 * i - 5, 10, -10), this.scene, this);
                    }, 500 * (i), i, goldBonus);
                }
                this.currentGameState = E_GAME_STATE.WAIT_PICK_BONUS;
                break;
            default:
                break;
        }
        this.updateGUI();
    }

    removeBonusBoxs(): void {
        for (let i = 0; i < 3; i++) {
            this.bonusBoxs[i].dispose();
            this.bonusBoxs[i] = null;
        }
        this.currentGameState = E_GAME_STATE.IDLE;
    }

    updateGUI(): void {
        this.textBlock.text = "";
        this.textBlock.text += "Spin Remaining: " + this.spinRemaining;
        this.textBlock.text += "\n";
        this.textBlock.text += "Gold Wining: " + this.goldWining;
    }

    spin(): void {
        let i = 0;
        //let rotateSteps: number[] = [1, 1, 1];
        let rotateSteps: number[] = new Array(WheelNumber);
        if (this.cheat) {
            rotateSteps[0] = Math.floor(Math.random() * 10) + 5;
            let value0 = (this.wheels[0].wheelValue + rotateSteps[0]) % E_WHEEL_VALUE.MAX;
            for (let i = 1; i <= 2; i++) {
                if (value0 >= this.wheels[i].wheelValue) {
                    rotateSteps[i] = value0 - this.wheels[i].wheelValue;
                }
                else {
                    rotateSteps[i] = E_WHEEL_VALUE.MAX - this.wheels[i].wheelValue + value0;
                }
            }
        }
        else {
            for (i = 0; i < WheelNumber; i++) {
                if (i == 0) {
                    rotateSteps[i] = Math.floor(Math.random() * 10) + 5;
                }
                else {
                    rotateSteps[i] = rotateSteps[i - 1] + Math.floor(Math.random() * 5);
                }
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
            let wheelValuesWin: E_WHEEL_VALUE[] = new Array();
            let win: boolean = false;

            if (this.wheels[0].wheelValues[0] == this.wheels[1].wheelValues[0] && this.wheels[1].wheelValues[0] == this.wheels[2].wheelValues[0]) {
                wheelValuesWin.push(this.wheels[0].wheelValues[0]);
                win = true;
            }
            if (this.wheels[0].wheelValues[1] == this.wheels[1].wheelValues[1] && this.wheels[1].wheelValues[1] == this.wheels[2].wheelValues[1]) {
                wheelValuesWin.push(this.wheels[0].wheelValues[1]);
                win = true;
            }
            if (this.wheels[0].wheelValues[2] == this.wheels[1].wheelValues[2] && this.wheels[1].wheelValues[2] == this.wheels[2].wheelValues[2]) {
                wheelValuesWin.push(this.wheels[0].wheelValues[2]);
                win = true;
            }
            if (this.wheels[0].wheelValues[2] == this.wheels[1].wheelValues[1] && this.wheels[1].wheelValues[1] == this.wheels[2].wheelValues[0]) {
                wheelValuesWin.push(this.wheels[0].wheelValues[2]);
                win = true;
            }
            if (this.wheels[0].wheelValues[0] == this.wheels[1].wheelValues[1] && this.wheels[1].wheelValues[1] == this.wheels[2].wheelValues[2]) {
                wheelValuesWin.push(this.wheels[0].wheelValues[0]);
                win = true;
            }
            this.currentGameState = E_GAME_STATE.IDLE;
            this.wheels[0].currentState = this.wheels[1].currentState = this.wheels[2].currentState = E_WHEEL_STATE.IDLE;
            if (win) {
                if (wheelValuesWin.indexOf(E_WHEEL_VALUE.BAR) >= 0) {
                    this.spinRemaining += 30;
                    this.showNotificationMessage("+30 spins", "red", 40, 5000);
                }
                else if (wheelValuesWin.indexOf(E_WHEEL_VALUE.SEVEN_NUMBER) >= 0) {
                    this.currentGameState = E_GAME_STATE.PICK_BONUS;
                }
                else {
                    this.spinRemaining += 10;
                    this.showNotificationMessage("+10 spins", "red", 40, 5000);
                }
            }

        }
    }

    run(): void {

        this.canvas = document.getElementById(this.canvasName);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.enablePhysics();

        let camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-5, 5, -35), this.scene);
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

        let loadBackgroundMusicTask = loader.addBinaryFileTask("load BackgroundMusic task", "sounds/violons18.wav");
        loadBackgroundMusicTask.onSuccess = (task) => {
            this.backgroundMusic = new BABYLON.Sound("backgroundMusic", task.data, this.scene, null, { loop: true });
        }

        let loadspinSoundTask = loader.addBinaryFileTask("load SpinSound task", "sounds/violons18.wav");
        loadspinSoundTask.onSuccess = (task) => {
            this.spinSound = new BABYLON.Sound("spinSound", task.data, this.scene, null, { loop: false });
        }

        loader.load();
        loader.onFinish = (tasks) => {
            this.currentGameState = E_GAME_STATE.INIT;

            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
            this.scene.registerBeforeRender(() => {
                this.update();
            });
        };
    }
}