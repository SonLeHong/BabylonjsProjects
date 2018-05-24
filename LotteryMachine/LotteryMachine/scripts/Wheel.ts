class Wheel {
    model: BABYLON.Mesh;
    rotateSpeed: number = 5;
    currentSpeed: number = 1;
    deltaSpeed: number = 0.1;
    scene: BABYLON.Scene;

    constructor(public diameter: number, public thickness: number, scene: BABYLON.Scene) {
        //Wheel Material 
        var wheelMaterial = new BABYLON.StandardMaterial("wheel_mat", scene);
        var wheelTexture = new BABYLON.Texture("http://i.imgur.com/ZUWbT6L.png", scene);
        wheelMaterial.diffuseTexture = wheelTexture;

        //Set color for wheel tread as black
        var faceColors = [];
        faceColors[1] = new BABYLON.Color3(0, 0, 0);

        //set texture for flat face of wheel 
        var faceUV = [];
        faceUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
        faceUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

        this.model = BABYLON.MeshBuilder.CreateCylinder("wheelFI", { diameter: 3, height: 1, tessellation: 24, faceColors: faceColors, faceUV: faceUV }, scene);
        this.model.material = wheelMaterial;

        //rotate wheel so tread in xz plane  
        this.model.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
        this.scene = scene;
    }

    public rotate() {
        // let _self = this;
        this.currentSpeed = this.rotateSpeed;
        //this.scene.registerBeforeRender(this.update);
        this.scene.registerBeforeRender(() => this.update());
    }

    public update() {
        if (this.currentSpeed <= 0) {
            this.scene.unregisterBeforeRender(() => this.update());
            return;
        }
        var dt = this.scene.getEngine().getDeltaTime() / 1000; //convert ms -> s
        console.log(dt);
        this.model.rotate(BABYLON.Axis.Z, Math.PI / 64 * this.currentSpeed * dt, BABYLON.Space.WORLD);
        this.currentSpeed -= this.deltaSpeed;
    }
}