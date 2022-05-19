sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/core/routing/History"
], function (Controller,
    formatter,
    History) {
    "use strict";

    return Controller.extend("waseem.ui.controller.BaseController", {
        formatter: formatter,
        onInit: function () {

        },
        onGoBack: function () {
            // alert()
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            // console.log(sPreviousHash);
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("home", {}, false);
            }
        },
        goHome: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("home", {}, false);
        },
        isValidEMail: function (oEvent) {
            var mail = oEvent.getSource().getValue();
            if (!this.formatter.isValidMail(mail)) {
                oEvent.getSource().setValueState("Error");
            }
            else {
                oEvent.getSource().setValueState("None");

            }
        },
        onValidPhoneNumber: function (oEvent) {
            var phone = oEvent.getSource().getValue();
            if (this.formatter.phoneNumber(phone)) {
                oEvent.getSource().setValueState("None");
            } else {
                oEvent.getSource().setValueState("Error");
            }
        },
        isValidName: function (oEvent) {
            var text = oEvent.getSource().getValue();
            let returnValue = this.formatter.isName(text)
            if (returnValue == true) {
                oEvent.getSource().setValueState("None");
            }
            else {
                oEvent.getSource().setValueState("Error");
                oEvent.getSource().setValueStateText(this.getView().getModel("i18n").getResourceBundle().getText("invalidName"));
            }
        }
    });
});