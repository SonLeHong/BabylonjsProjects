var Wheel = /** @class */ (function () {
    function Wheel(gameMain) {
        this.gameMain = gameMain;
        this.rotateSpeed = 96;
        this.currentSpeed = 320;
        this.deltaSpeed = 1;
        this.subdivisions = 8;
        //Wheel Material 
        this.scene = gameMain.scene;
        this.model = gameMain.createMesh(gameMain.assets['wheel'], 'wheel');
        this.model.scaling = new BABYLON.Vector3(5, 5, 5);
        this.updateMethod = this.update.bind(this);
    }
    Wheel.prototype.rotate = function () {
        var _self = this;
        var rotateSteps = Math.floor(Math.random() * 10) + 10;
        this.currentSpeed = rotateSteps * this.subdivisions;
        this.scene.registerBeforeRender(this.updateMethod);
    };
    Wheel.prototype.update = function () {
        if (this.currentSpeed <= 0.0) {
            this.scene.unregisterBeforeRender(this.updateMethod);
            return;
        }
        var dt = this.scene.getEngine().getDeltaTime() / 1000; //convert ms -> s
        this.model.rotate(BABYLON.Axis.X, -Math.PI / 16, BABYLON.Space.WORLD);
        this.currentSpeed -= this.deltaSpeed;
    };
    return Wheel;
}());
//# sourceMappingURL=Wheel.js.map