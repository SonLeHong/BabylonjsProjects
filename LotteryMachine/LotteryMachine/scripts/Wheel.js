var Wheel = (function () {
    function Wheel(id, gameMain) {
        this.id = id;
        this.gameMain = gameMain;
        this.currentRotateSteps = 0;
        this.subdivisions = E_WHEEL_VALUE.MAX;
        this.stepToRotateThroungItem = 4; //we need to rotate x step (x update loops) to pass 1 item
        this.wheelValue = 0;
        this.currentState = E_WHEEL_STATE.IDLE;
        this.wheelValues = [-1, -1, -1];
        //Wheel Material 
        this.scene = gameMain.scene;
        this.model = gameMain.createMesh(gameMain.assets['wheel'], 'wheel');
        this.model.scaling = new BABYLON.Vector3(5, 5, 5);
        this.model.rotate(BABYLON.Axis.X, -0.15, BABYLON.Space.WORLD); //just aligh the wheel, dont mind this
        this.model.rotate(BABYLON.Axis.X, -Math.PI / 4, BABYLON.Space.WORLD);
        this.updateMethod = this.update.bind(this);
        this.rotateDoneCallback = gameMain.wheelRotateDoneCallback.bind(gameMain);
    }
    Wheel.prototype.rotate = function (rotateSteps) {
        this.currentState = E_WHEEL_STATE.ROTATE;
        console.log("rotateStep[" + this.id + "] = " + rotateSteps);
        this.currentRotateSteps = rotateSteps * this.stepToRotateThroungItem;
        this.wheelValue = (this.wheelValue + rotateSteps) % this.subdivisions;
        for (var i = 0; i < 3; i++) {
            this.wheelValues[i] = (this.wheelValue + i) % E_WHEEL_VALUE.MAX;
        }
        //this.scene.registerBeforeRender(this.updateMethod);
    };
    Wheel.prototype.update = function () {
        if (this.currentRotateSteps <= 0) {
            //this.scene.unregisterBeforeRender(this.updateMethod);
            this.currentState = E_WHEEL_STATE.STOP;
            this.rotateDoneCallback(this);
            return;
        }
        this.model.rotate(BABYLON.Axis.X, -(2 * Math.PI) / (this.subdivisions * this.stepToRotateThroungItem), BABYLON.Space.WORLD);
        this.currentRotateSteps -= 1;
    };
    return Wheel;
}());
//# sourceMappingURL=Wheel.js.map