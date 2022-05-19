sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";


    return BaseController.extend("waseem.ui.controller.Detail", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter(),
                this.oModel = this.getOwnerComponent().getModel(),
                this.oRouter.getRoute("detail").attachPatternMatched(this._onOrderMatched, this);
                this.oModel.setProperty("/layout", "TwoColumnsMidExpanded");
        },
        onProductItemPress: function (oEvent) {

            debugger;
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
            // var productPath = oEvent.getSource().getSelectedItem().getBindingContext("items").getPath();
            var productPath = oEvent.getSource().getSelectedContextPaths()[0].slice(-1);
            // product = productPath().split("/").slice(-1).pop();
            let selectedProductID = this.getView().getModel("products").getData()[productPath].id;

            var selectedOrderPath = oEvent.getSource().getBindingContext("orders").getPath().slice(-1);
            let quantity;
            oEvent.getSource().getBindingContext("orders").getModel("orders").getData()[selectedOrderPath].productsOrdered.map(order => {
                if (order.productID == selectedProductID) {
                    quantity = order.productQuantity;
                }
            });


            this.oRouter.navTo("detailDetail", { layout: oNextUIState.layout, order: selectedOrderPath, product: productPath, quantity: quantity })
        },
        closeMiddlePage: function (oEvent) {
            this.getOwnerComponent().getRouter().navTo("home");
        },
        maximizeMiddlePage: function (oEvent) {

            var sNextLayout = sap.f.LayoutType.MidColumnFullScreen;
            // debugger;
            this.oRouter.navTo("detail", { layout: sNextLayout, order: this._order });

        },
        _onOrderMatched: function (oEvent) {

            debugger;

            this._order = oEvent.getParameter("arguments").order || this._order || "0";
            this.getView().bindElement({
                path: "/" + this._order,
                model: "orders"
            });


            let orderPath = this.getView().getBindingContext("orders").getPath().slice(1);
            let customerID = this.getView().getModel("orders").getData()[orderPath].orderedBy
            // let addressID = this.getView().getModel("orders").getData()[orderPath].AddressId
            let addressID;
            let productIDs = this.getView().getModel("orders").getData()[orderPath].productsOrdered


            let productsData = [];

            //loop through the customers model and find the customer object with the required customer id
            //set the model to the view as customer model

            //map the customer id with the id associated with the order and set the model
            this.getView().getModel("customers").getData().map(i => {
                if (i.CustomerID == customerID) {
                    addressID = i.address;

                    this.getView().setModel(new JSONModel(i), "customer");
                    return;
                }
            })

            // console.log(addressID);

            //map the addressids to the addressList model and set to the view
            this.getView().getModel("addressList").getData().map(i => {
                if (i.addressID == addressID) {
                    this.getView().setModel(new JSONModel(i), "address");
                    return;
                }
            })


            //map the products to the productsList model and push the ordered products objects to array
            // this.getView().getModel("productsList").getData().map(product => {
            //     console.log(product);
            // })

            let productList = this.getView().getModel("productsList").getData();

            // let x = this.getView().getModel("orders").getData()[orderPath].productsOrdered;

            productIDs.map(products => {
                productList.map(product => {
                    if (product.id == products.productID) {
                        product.quantity = products.productQuantity
                        productsData.push(product);
                    }
                })
            })

            this.getOwnerComponent().setModel(new JSONModel(productsData), "products");

            // debugger;
            // console.log(productsData);
            // return;

        }
    });


});