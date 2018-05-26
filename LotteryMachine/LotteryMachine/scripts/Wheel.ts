﻿class Wheel {
    model: BABYLON.Mesh;
    currentRotateSteps: number = 0;   
    scene: BABYLON.Scene;
    updateMethod: BABYLON.Nullable<() => void>;
    subdivisions: number = 8;
    rotateDoneCallback: BABYLON.Nullable<(wheel: Wheel) => void>;
    stepToRotateThroungItem: number = 4; //we need to rotate x step (x update loops) to pass 1 item
    wheelValue: E_WHEEL_VALUE = 0;
    constructor(public id: number, public gameMain: GameMain) {
        //Wheel Material 
        this.scene = gameMain.scene;
        this.model = gameMain.createMesh(gameMain.assets['wheel'], 'wheel');
        this.model.scaling = new BABYLON.Vector3(5, 5, 5);
        this.model.rotate(BABYLON.Axis.X, -0.15, BABYLON.Space.WORLD); //just aligh the wheel, dont mind this
        this.model.rotate(BABYLON.Axis.X, - Math.PI/4, BABYLON.Space.WORLD);
        this.updateMethod = (<() => void>this.update.bind(this));
        this.rotateDoneCallback = (<(this) => void>gameMain.wheelRotateDoneCallback.bind(gameMain));        
    }

    public rotate(rotateSteps: number): void {
        let _self = this;
        this.currentRotateSteps = rotateSteps * this.stepToRotateThroungItem;
        this.wheelValue = rotateSteps % this.subdivisions;
        this.scene.registerBeforeRender(this.updateMethod);
    }

    public update(): void {
        if (this.currentRotateSteps <= 0) {
            this.scene.unregisterBeforeRender(this.updateMethod);
            this.rotateDoneCallback(this);
            return;
        }

        var dt = this.scene.getEngine().getDeltaTime() / 1000; //convert ms -> s
        this.model.rotate(BABYLON.Axis.X, - (2 * Math.PI) / (this.subdivisions * this.stepToRotateThroungItem), BABYLON.Space.WORLD);
        this.currentRotateSteps -= 1;
    }
}