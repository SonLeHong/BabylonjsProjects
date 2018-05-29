class Wheel {
    model: BABYLON.Mesh;
    currentRotateSteps: number = 0;   
    scene: BABYLON.Scene;
    updateMethod: BABYLON.Nullable<() => void>;
    subdivisions: number = E_WHEEL_VALUE.MAX;
    rotateDoneCallback: BABYLON.Nullable<(wheel: Wheel) => void>;
    stepToRotateThroungItem: number = 4; //we need to rotate x step (x update loops) to pass 1 item
    wheelValue: E_WHEEL_VALUE = 0;
    currentState: E_WHEEL_STATE = E_WHEEL_STATE.IDLE;
    wheelValues: number[] = [-1, -1, -1];
    constructor(public id: number, public gameMain: GameMain) {
        //Wheel Material 
        this.scene = gameMain.scene;
        this.model = gameMain.createMesh(gameMain.assets['wheel'], 'wheel');
        this.model.scaling = new BABYLON.Vector3(5, 5, 5);
        this.model.rotate(BABYLON.Axis.X, -0.15, BABYLON.Space.WORLD); //just aligh the wheel, dont mind this
        this.model.rotate(BABYLON.Axis.X, - Math.PI / 4, BABYLON.Space.WORLD);
        this.updateMethod = (<() => void>this.update.bind(this));
        this.rotateDoneCallback = (<(this) => void>gameMain.wheelRotateDoneCallback.bind(gameMain));        
    }

    public rotate(rotateSteps: number): void {
        this.currentState = E_WHEEL_STATE.ROTATE;
        console.log("rotateStep[" + this.id + "] = " + rotateSteps);
        this.currentRotateSteps = rotateSteps * this.stepToRotateThroungItem;
        this.wheelValue = (this.wheelValue + rotateSteps) % this.subdivisions;
        for (let i = 0; i < 3; i++) {
            this.wheelValues[i] = (this.wheelValue + i) % E_WHEEL_VALUE.MAX;
        }
        this.scene.registerBeforeRender(this.updateMethod);
    }

    public update(): void {
        if (this.currentRotateSteps <= 0) {
            this.scene.unregisterBeforeRender(this.updateMethod);
            this.rotateDoneCallback(this);           
            return;
        }

        this.model.rotate(BABYLON.Axis.X, - (2 * Math.PI) / (this.subdivisions * this.stepToRotateThroungItem), BABYLON.Space.WORLD);
        this.currentRotateSteps -= 1;
    }
}