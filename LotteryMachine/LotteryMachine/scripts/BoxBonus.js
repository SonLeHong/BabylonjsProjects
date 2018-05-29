var BoxBonus = /** @class */ (function () {
    function BoxBonus(goldBonus, scene) {
        this.goldBonus = goldBonus;
        this.scene = scene;
        this.model = BABYLON.MeshBuilder.CreateBox("boxbonus", { size: 5 }, this.scene);
        var mat = new BABYLON.StandardMaterial("boxbonusMat", this.scene);
        this.model.physicsImpostor = new BABYLON.PhysicsImpostor(this.model, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.4 }, this.scene);
        this.model.position = new BABYLON.Vector3(30, 30, 0);
    }
    return BoxBonus;
}());
//# sourceMappingURL=BoxBonus.js.map