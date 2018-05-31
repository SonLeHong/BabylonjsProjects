class BoxBonus {
    model: BABYLON.Mesh;
    constructor(public goldBonus: number, public position: BABYLON.Vector3, public scene: BABYLON.Scene) {
        this.model = BABYLON.MeshBuilder.CreateBox("boxbonus", { size: 5 }, this.scene);
        let mat = new BABYLON.StandardMaterial("boxbonusMat", this.scene);
        this.model.physicsImpostor = new BABYLON.PhysicsImpostor(this.model, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.4 }, this.scene);
        this.model.position = this.position;
    }
}