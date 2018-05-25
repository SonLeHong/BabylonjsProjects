﻿class Wheel {
    model: BABYLON.Mesh;
    rotateSpeed: number = 96;
    currentSpeed: number = 320;
    deltaSpeed: number = 1;
    scene: BABYLON.Scene;
    updateMethod: BABYLON.Nullable<() => void>;
    subdivisions: number = 8;
    constructor(public gameMain: GameMain) {
        //Wheel Material 
        this.scene = gameMain.scene;
        this.model = gameMain.createMesh(gameMain.assets['wheel'], 'wheel');
        this.model.scaling = new BABYLON.Vector3(5, 5, 5);

        this.updateMethod = (<() => void>this.update.bind(this));
    }

    public rotate(): void {
        let _self = this;
        let rotateSteps = Math.floor(Math.random() * 10) + 10;
        this.currentSpeed = rotateSteps * this.subdivisions;
        this.scene.registerBeforeRender(this.updateMethod);
    }

    public update(): void {
        if (this.currentSpeed <= 0.0) {
            this.scene.unregisterBeforeRender(this.updateMethod);
            return;
        }
        var dt = this.scene.getEngine().getDeltaTime() / 1000; //convert ms -> s
        this.model.rotate(BABYLON.Axis.X, - Math.PI / 16, BABYLON.Space.WORLD);
        this.currentSpeed -= this.deltaSpeed;
    }
}