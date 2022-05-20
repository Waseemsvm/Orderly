sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("waseem.ui.controller.SplashScreen", {

        onInit: function () {

            this._oView = this.getView();
            this._oView.addEventDelegate({
                onBeforeHide: function (oEvent) {
                    // alert("beforehide")
                },

                onAfterHide: function (oEvent) {
                    // alert("after hide")
                }
            }, this)

            var oRouter = this.getOwnerComponent().getRouter();

            setTimeout(function () {
                oRouter.navTo("home");
            }, 3000);
        },
        onAfterRendering: function () {
            this.getView().byId("splashScreenPage").setBusy(false)
        },
        /**
         * @override
         */
        onExit: function () {
            BaseController.prototype.onExit.apply(this, arguments);


        }
    });
});