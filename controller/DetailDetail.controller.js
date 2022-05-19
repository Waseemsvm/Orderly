sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (
    BaseController,
	JSONModel,
	History
) {
    "use strict";

    return BaseController.extend("waseem.ui.controller.DetailDetail", {
        onInit: function () {

            this.oRouter = this.getOwnerComponent().getRouter(),
                this.oModel = this.getOwnerComponent().getModel(),
                this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
                this.oModel.setProperty("/layout", "ThreeColumnsMidExpanded");

        },
        _onProductMatched: function (oEvent) {
            this._order = oEvent.getParameter("arguments").order || this._order || "0";
            this._product = oEvent.getParameter("arguments").product || this._product || "0";
            this.getView().bindElement({
                path: "/" + this._product,
                model: "products"
            });

            debugger;

            let productPath = this.getView().getBindingContext("products").getPath().slice(-1);

            let product = this.getView().getModel("products").getData()[productPath];
            product.quantity = oEvent.getParameter("arguments").quantity;
            var total = (product.price - product.discount) * product.quantity;
            product.total = total;


            if (product.productImage != "") {
                product.productImage = (product.productImage);
            } else {
                product.productImage = "https://st3.depositphotos.com/1031343/13660/v/1600/depositphotos_136600554-stock-illustration-not-available-sign-or-stamp.jpg";
            }

            this.getView().setModel(new JSONModel(product), "product");
            // this.getOwnerComponent().setModel(new JSONModel(product), "product")

            this.quantity = product.quantity;


        },
        maximizeEndPage: function () {
            this.getOwnerComponent().getRouter().navTo("detailDetail", {
                order: this._order, product: this._product, quantity: this.quantity, layout: sap.f.LayoutType.EndColumnFullScreen
            })
        },
        closeEndPage: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash != undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("home")
            }


        }
    });
});