var BoxBonus = (function () {
    function BoxBonus(goldBonus, position, scene, gameMain) {
        var _this = this;
        this.goldBonus = goldBonus;
        this.position = position;
        this.scene = scene;
        this.gameMain = gameMain;
        this.model = BABYLON.MeshBuilder.CreateBox("boxbonus", { size: 2 }, this.scene);
        var mat = new BABYLON.StandardMaterial("boxbonusMat", this.scene);
        mat.diffuseColor = BABYLON.Color3.Green();
        this.model.material = mat;
        this.model.physicsImpostor = new BABYLON.PhysicsImpostor(this.model, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.4 }, this.scene);
        this.model.position = this.position;
        this.model.actionManager = new BABYLON.ActionManager(this.scene);
        this.model.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function (event) {
            _this.gameMain.goldWining += goldBonus;
            _this.gameMain.showNotificationMessage("+" + goldBonus.toString() + " golds", "red", 40, 5000);
            _this.gameMain.removeBonusBoxs();
        }));
    }
    BoxBonus.prototype.blink = function () {
        var _this = this;
        this.interval = setInterval(function () {
            if (_this.model.isVisible) {
                _this.model.isVisible = false;
            }
            else {
                _this.model.isVisible = true;
            }
        }, 25);
    };
    BoxBonus.prototype.dispose = function () {
        //clearInterval(this.interval);
        this.model.dispose();
    };
    return BoxBonus;
}());
//# sourceMappingURL=BoxBonus.js.map