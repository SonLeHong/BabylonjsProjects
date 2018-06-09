class BoxBonus {
    model: BABYLON.Mesh;
    interval: number;
    constructor(public goldBonus: number, public position: BABYLON.Vector3, public scene: BABYLON.Scene, public gameMain: GameMain) {
        this.model = BABYLON.MeshBuilder.CreateBox("boxbonus", { size: 2 }, this.scene);
        let mat = new BABYLON.StandardMaterial("boxbonusMat", this.scene);
        mat.diffuseColor = BABYLON.Color3.Green();
        this.model.material = mat;
        this.model.physicsImpostor = new BABYLON.PhysicsImpostor(this.model, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.4 }, this.scene);
        this.model.position = this.position;

        this.model.actionManager = new BABYLON.ActionManager(this.scene);
        this.model.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, (event) => {
            this.gameMain.goldWining += goldBonus;
            this.gameMain.showNotificationMessage("+" + goldBonus.toString() + " golds", "red", 40, 5000);
            this.gameMain.removeBonusBoxs();
        }));
    }

    blink(): void {
        this.interval = setInterval(() => {
            if (this.model.isVisible) {
                this.model.isVisible = false;
            } else {
                this.model.isVisible = true;
            }
        }, 25);
    }

    dispose(): void {
        //clearInterval(this.interval);
        this.model.dispose();
    }
}