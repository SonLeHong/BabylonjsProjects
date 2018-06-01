var BoxBonus = /** @class */ (function () {
    function BoxBonus(goldBonus, position, scene) {
        this.goldBonus = goldBonus;
        this.position = position;
        this.scene = scene;
        this.model = BABYLON.MeshBuilder.CreateBox("boxbonus", { size: 5 }, this.scene);
        var mat = new BABYLON.StandardMaterial("boxbonusMat", this.scene);
        this.model.physicsImpostor = new BABYLON.PhysicsImpostor(this.model, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.4 }, this.scene);
        this.model.position = this.position;
    }
    return BoxBonus;
}());
//# sourceMappingURL=BoxBonus.js.map