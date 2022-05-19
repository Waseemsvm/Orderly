sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"
], function (
    BaseController,
    JSONModel,
    MessageToast,
    History
) {
    "use strict";

    return BaseController.extend("waseem.ui.controller.Profile", {
        onInit: function () {
            this.getView().setModel(new JSONModel({
                visible: false
            }), "formVisibility");


            this.getView().setModel(new JSONModel({
                editable: false
            }), "profileEditable");



        },
        onGoBackFromProfile: function () {


            if (this.getView().getModel("profileEditable").getProperty("/editable")) {
                MessageToast.show("Please save the changes"); return;
            }



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
        onProfileEditButtonPress: function () {



            if (this.getView().getModel("formVisibility").getData().visible == true) {


                this.getView().getModel("profileEditable").setProperty("/editable", !this.getView().getModel("profileEditable").getData().editable);

                if (this.getView().getModel("profileEditable").getData().editable) {
                    MessageToast.show("Edit Now")
                    this.getView().byId("editButton").setText("Save");
                    this.getView().byId("editButton").setIcon("sap-icon://save")
                } else {





                    let cID = this.byId("CustomerID").getValue();
                    let cName = this.byId("customerName").getValue();
                    let cDOB = this.byId("dateOfBirth").getValue();
                    let cEmail = this.byId("customerEmail").getValue();
                    let cMob = this.byId("customerMobileNumber").getValue();


                    let flat = this.getView().byId("flat").getValue();
                    let street = this.getView().byId("street").getValue();
                    let area = this.getView().byId("area").getValue();
                    let district = this.getView().byId("district").getValue();
                    let city = this.getView().byId("city").getValue();
                    let pin = this.getView().byId("pin").getValue();
                    let state = this.getView().byId("state").getValue();
                    let country = this.getView().byId("country").getValue();

                    this.getOwnerComponent().getModel("customers").getData().map(customer => {
                        if (customer.CustomerID == cID) {
                            customer.Name = cName;
                            customer.DOB = cDOB;
                            customer.Email = cEmail;
                            customer.MobileNumber = cMob;
                        }
                    })

                    // this.getOwnerComponent().getModel("customers").refresh();

                    this.getOwnerComponent().getModel("orders").getData().map(iorder => {
                        if (iorder.orderedBy == cID) {
                            iorder.customerName = cName;
                        }

                    })

                    // this.getOwnerComponent().getModel("orders").refresh();

                    var addressID;
                    this.getOwnerComponent().getModel("customers").getData().map(icustomer => {
                        if (icustomer.CustomerID == cID) {
                            addressID = icustomer.address;
                        }
                    })




                    this.getOwnerComponent().getModel("addressList").getData().filter(iaddress => {
                        if (iaddress.addressID == addressID) {
                            console.log(iaddress);

                            iaddress.area = area
                            iaddress.city = city
                            iaddress.country = country
                            iaddress.district = district
                            iaddress.flat = flat
                            iaddress.pin = pin
                            iaddress.state = state
                            iaddress.street = street
                        }
                    })



                    this.getOwnerComponent().getModel("customers").refresh();
                    this.getOwnerComponent().getModel("orders").refresh();
                    this.getOwnerComponent().getModel("addressList").refresh();



                    MessageToast.show("Saved Successfully")
                    this.getView().byId("editButton").setText("Edit");
                    this.getView().byId("editButton").setIcon("sap-icon://edit")
                }


            } else {
                MessageToast.show("Please Select the Customer ID")
            }
        },
        onCustomerProfileSelected: function (oEvent) {

            this.byId("editButton").setVisible();

            let selectedCustomer = this.byId("customersList").getSelectedKey()
            let selectedCustomerAddress;
            let customersList = this.getOwnerComponent().getModel("customers").getData();
            let addressList = this.getOwnerComponent().getModel("addressList").getData();

            if (selectedCustomer) {
                this.getView().getModel("formVisibility").setProperty("/visible", true)
            }

            customersList.map(customer => {
                if (customer.CustomerID == selectedCustomer) {
                    selectedCustomer = customer;
                }
            });


            addressList.map(address => {
                if (address.addressID == selectedCustomer.address) {
                    selectedCustomerAddress = address;
                }
            })

            //create and set profile model on the view
            var profile = Object.assign({}, selectedCustomer, selectedCustomerAddress);

            this.getView().setModel(new JSONModel(profile), "profile");
            // console.log(profile);



        }

    });
});