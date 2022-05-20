sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    'sap/ui/model/Sorter',
    "sap/ui/model/FilterOperator",
    "sap/ui/core/LocaleData"
], function (BaseController,
    JSONModel,
    Fragment,
    Device,
    Filter,
    Sorter,
    FilterOperator, LocaleData) {
    "use strict";

    return BaseController.extend("waseem.ui.controller.Master", {
        _data: {
            "dtValue": new Date()
        },
        onInit: function () {




            this.oRouter = this.getOwnerComponent().getRouter();

            let orders = this.getOwnerComponent().getModel("orders").getData();

            let productList = this.getOwnerComponent().getModel("productsList").getData()
            let customersList = this.getOwnerComponent().getModel("customers").getData();


            productList.map(product => {
                product.total = product.price - product.discount;
            })


            orders.map(order => {
                order.totalAmount = 0;
                order.discount = 0;
                var total = 0, discount = 0, price = 0;
                order.productsOrdered.map(products => {
                    productList.map(product => {



                        if (products.productID == product.id) {
                            total += (product.total * products.productQuantity);

                            discount += product.discount * products.productQuantity;
                            price += product.price * products.productQuantity;
                        }

                    });


                });

                customersList.map(customer => {
                    if (order.orderedBy == customer.CustomerID) {
                        order.customerName = customer.Name

                    }
                })




                order.totalAmount = total;
                order.discount = discount;
                order.price = price;
                order.currencyCode = "INR";

            })
            // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
            this._mViewSettingsDialogs = {};
            var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.mGroupFunctions = {
                orderStatus: function (oContext) {
                    var name = oContext.getProperty("orderStatus");

                    return {
                        key: name,
                        text: name
                    };
                },
                totalAmount: function (oContext) {
                    var price = oContext.getProperty("totalAmount");
                    // var currencyCode = oContext.getProperty("CurrencyCode");
                    var currencyCode = "INR"
                    var key, text;
                    if (price <= 1000) {
                        key = "LE1000";
                        text = "1000 " + currencyCode + " or less";
                    } else if (price <= 10000) {
                        key = "BT100-1000";
                        text = "Between 1000 and 10000 " + currencyCode;
                    } else {
                        key = "GT10000";
                        text = "More than 10000 " + currencyCode;
                    }
                    return {
                        key: key,
                        text: text
                    };
                },
                orderedBy: function (oContext) {
                    var name = oContext.getProperty("orderedBy");

                    return {
                        key: name,
                        text: name
                    };
                },
                orderStatus: function (oContext) {


                    var status = oContext.getProperty("orderStatus");
                    status = oResourceBundle.getText(status);
                    return {
                        key: status,
                        text: status,
                    }

                }
            };

        },

        onLiveSearch: function (oEvent) {

            var aFilter = [];

            var sQuery = oEvent.getSource().getValue();
            var oTable = this.byId("idProductsTable");

            var oFilterForOrderID = new Filter("orderID", FilterOperator.Contains, sQuery);
            var oFilterForOrderedBy = new Filter("customerName", FilterOperator.Contains, sQuery);
            var oFilterForTotalAmount = new Filter("totalAmount", FilterOperator.EQ, sQuery);

            aFilter.push(oFilterForOrderID);
            aFilter.push(oFilterForOrderedBy);
            aFilter.push(oFilterForTotalAmount);

            var oFilterToSetOnTable = new Filter({
                filters: aFilter,
                and: false
            });

            oTable.getBinding("items").filter(oFilterToSetOnTable, sap.ui.model.FilterType.Application); //, sap.ui.model.FilterType.Application



        },
        onListItemPressed: function (oEvent) {

            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                orderPath = oEvent.getSource().getSelectedItem().getBindingContext("orders").getPath(),
                order = orderPath.split("/").slice(-1).pop();
            this.oRouter.navTo("detail", { layout: oNextUIState.layout, order: order })
            // debugger;
        },
        getViewSettingsDialog: function (sDialogFragmentName) {
            var oView = this.getView();
            var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

            if (!pDialog) {
                pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: sDialogFragmentName,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    if (Device.system.desktop) {
                        oDialog.addStyleClass("sapUiSizeCompact");
                    }
                    return oDialog;
                });
                this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            }
            return pDialog;
            //End of getViewSettingsDialog function
        },

        /*************************Filter fragment functions and event handlers*********************************** */
        handleFilterButtonPressed: function (oEvent) {
            this.getViewSettingsDialog("waseem.ui.view.fragments.FilterDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleFilterDialogConfirm: function (oEvent) {
            var oTable = this.byId("idProductsTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [];



            mParams.filterItems.forEach(function (oItem) {
                var aSplit = oItem.getKey().split("___"),
                    sPath = aSplit[0],
                    sOperator = aSplit[1],
                    sValue1 = aSplit[2],
                    sValue2 = aSplit[3],
                    oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
                aFilters.push(oFilter);
            });
            // apply filter settings
            oBinding.filter(aFilters);

            // update filter bar
            this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
            this.byId("vsdFilterLabel").setText(mParams.filterString);
            //End of handleFilterDialogConfirm
        },

        /************************Goup Fragment functions and event handlers********************************* */
        handleGroupButtonPressed: function (oEvent) {
            this.getViewSettingsDialog("waseem.ui.view.fragments.GroupDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });

            //End of handleGroupButtonPressed
        },
        handleGroupDialogConfirm: function (oEvent) {
            var oTable = this.byId("idProductsTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                vGroup,
                aGroups = [];

            if (mParams.groupItem) {
                sPath = mParams.groupItem.getKey();
                bDescending = mParams.groupDescending;
                vGroup = this.mGroupFunctions[sPath];
                aGroups.push(new Sorter(sPath, bDescending, vGroup));
                // apply the selected group settings
                oBinding.sort(aGroups);
            } else if (this.groupReset) {
                oBinding.sort();
                this.groupReset = false;
            }

            //End of handleGroupDialogConfirm
        },
        resetGroupDialog: function (oEvent) {
            this.groupReset = true;
            //End of resetGroupDialog,
        },
        handleSortButtonPressed: function () {
            this.getViewSettingsDialog("waseem.ui.view.fragments.SortDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleSortDialogConfirm: function (oEvent) {
            var oTable = this.byId("idProductsTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];

            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));

            // apply the selected sort and group settings
            oBinding.sort(aSorters);
        }
    });
});