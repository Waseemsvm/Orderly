sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",
    "sap/base/util/UriParameters",
    "sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UIComponent,
    JSONModel,
    library,
    UriParameters,
    FlexibleColumnLayoutSemanticHelper) {
    "use strict";

    var LayoutType = library.LayoutType;


    return UIComponent.extend("waseem.ui.Component", {
        metadata: {
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            // alert('component ready')

            var oModel = new JSONModel();
            this.setModel(oModel);

            var ordersModel = new JSONModel("data/Order.json");
            this.setModel(ordersModel, "orders");


            //read and set the address model
            var addressModel = new JSONModel("data/CustomerAddress.json");
            this.setModel(addressModel, "addressList");

            //read and set the products model

            var productsModel = new JSONModel("data/Product.json");
            this.setModel(productsModel, "productsList");


            var categories = [
                { category: "Electronics" },
                { category: "Fashion" },
                { category: "Mobiles" },
                { category: "Furniture" },
                { category: "Grocery" },
                { category: "Toys" }]
            this.setModel(new JSONModel(categories), "categories");

                

            this.getRouter().initialize();
        },
        getHelper: function () {
            var oFCL = this.getRootControl().byId("fcl"),
                oParams = UriParameters.fromQuery(location.search);

                var oSettings = {
                    defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
                    mode: oParams.get("mode"),
                    initialColumnsCount: oParams.get("initial"),
                    maxColumnsCount: oParams.get("max")
                };



            return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
        },
        /**
         * @override
         */
        onAfterRendering: function () {
            UIComponent.prototype.onAfterRendering.apply(this, arguments);
            


        }
    });
});