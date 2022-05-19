sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (
	BaseController,
	JSONModel,
	MessageToast
) {
	"use strict";



	return BaseController.extend("waseem.ui.controller.AddDetails", {
		/**
		 * @override
		 */
		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);
			var ordersCount = this.getOwnerComponent().getModel("orders").getData().length;
			var productsCount = this.getOwnerComponent().getModel("productsList").getData().length;
			var customersCount = this.getOwnerComponent().getModel("customers").getData().length;
			var oModel = new JSONModel({
				ordersCount: ordersCount,
				productsCount: productsCount,
				customersCount: customersCount

			});

			this.getView().setModel(oModel, "counts");

			this.getView().setModel(new JSONModel({ visible: false }), "visible")

			this.orderProducts = []

		},
		onAddOrderPress: function (oEvent) {

			if (!this.orderDialog) {
				this.orderDialog = this.loadFragment({
					name: "waseem.ui.view.fragments.AddOrder"
				});
			}
			this.orderDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onCloseAddOrder: function (oEvent) {

			this.byId("addOrderDialog").close();
		},
		handleSelectionFinish: function () {
			this.orderProducts = []
			var productsOrdered = this.getView().byId("products").getSelectedKeys();

			productsOrdered.length ? this.getView().getModel("visible").setProperty("/visible", true) : this.getView().getModel("visible").setProperty("/visible", false);

			console.log(productsOrdered);
			if (productsOrdered.length > 0) {
				productsOrdered.map(product => {
					this.orderProducts.push({
						productID: product,
						productQuantity: 1
					})
				})
			}
			var orderProducts = this.orderProducts
			this.getView().setModel(new JSONModel(orderProducts), "orderProducts");
		},
		onCategoriesCheck: function(oEvent){
			let value = oEvent.getSource().getValue();
			if(this.getView().getModel("categories").getData().filter(i => i.category == value).length ==0){
				oEvent.getSource().setValueState("Error")
				oEvent.getSource().setValueStateText("Please select a valid product Category");
				
			}else{
				oEvent.getSource().setValueState("None");
			}
				
		},
		onCheckCustomer: function(oEvent	){

			let customerFound = false;
			this.getView().getModel("customers").getData().filter(customer => {
				if(customer.CustomerID == oEvent.getSource().getValue()){
					customerFound = true;
				}
			})


			if(!customerFound){
				this.getView().byId("customer").setValueState("Error");
			}else{
				this.getView().byId("customer").setValueState("None")
			}

			
		},
		onDateCheck: function(oEvent){

			if(this.formatter.isValidDate(oEvent.getSource().getValue())){
				oEvent.getSource().setValueState("None");
			}else{
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText("Please Enter a valid date");
			}

			// if(isNaN(new Date(oEvent.getSource().getValue()).getTime())){
			// 	debugger;
			// }

			
		},
		onAddOrder: function (oEvent) {
			// var productsOrdered = this.getView().byId("products").getSelectedKeys();

			let productList = this.getOwnerComponent().getModel("productsList").getData()
			let customersList = this.getOwnerComponent().getModel("customers").getData();


			let deliveryDate = this.getView().byId("deliveryDate").getValue();
			let deliveredDate = this.getView().byId("deliveredDate").getValue();
			let customerId = this.getView().byId("customer").getSelectedKey();
			let coupon = this.getView().byId("couponCode").getValue();
			coupon = coupon ? coupon : "AAAAAAAAA";
			let orderid = this.formatter.generateID();
			let orderDate = this.generateCurrentDate();
			let orderStatus = this.getView().byId("orderStatus").getSelectedKey();

			if(!customerId){
				this.getView().byId("customer").setValueState("Error");
				this.getView().byId("customer").setValueStateText("Enter Valid customer id");
				return;
			}

			if(!deliveredDate){
				
				this.getView().byId("deliveredDate").setValueState("Error");
				this.getView().byId("deliveredDate").setValueStateText("Enter Valid Date");
				return;
			}

			if (!deliveredDate || !deliveryDate || !orderStatus || this.orderProducts.length == 0) {
				alert("One or more fields are empty!");
				return;
			}

			

			let addressID = this.getOwnerComponent().getModel("customers").getData().filter(customer => {
				if (customer.CustomerID == customerId) return customer;
			})[0].address;
			// console.log(this.orderProducts);


			if (new Date(deliveredDate) > new Date(deliveryDate)) {


				this.getView().byId("deliveryDate").setValueState("Error");
				this.getView().byId("deliveryDate").setValueStateText("Delivery Date should be greater than Delivered Date");
				this.getView().byId("deliveredDate").setValueState("Error");
				this.getView().byId("deliveredDate").setValueStateText("Delivered Date should be less than Delivery Date");



				MessageToast.show("Delivery Date cannot be less than Delivered Date"); return;
			}else{
				this.getView().byId("deliveryDate").setValueState("None");
				this.getView().byId("deliveredDate").setValueState("None");
			}

			let order = {
				"orderID": orderid,
				"orderDate": orderDate,
				"orderedBy": customerId,
				"coupon": coupon,
				"orderStatus": orderStatus,
				"deliveryDate": deliveryDate,
				"deliveredDate": deliveredDate,
				"AddressId": addressID,
				"productsOrdered": this.orderProducts
			}

			//added customer name
			customersList.map(customer => {
				if (order.orderedBy == customer.CustomerID) {
					order.customerName = customer.Name

				}
			})


			var total = 0, discount = 0, price = 0;
			order.productsOrdered.map(products => {
				productList.map(product => {
					if (products.productID == product.id) {
						total += ((product.price - product.discount) * products.productQuantity);

						discount += product.discount * products.productQuantity;
						price += product.price * products.productQuantity;
					}
				});
			});

			order.totalAmount = total;
			order.discount = discount;
			order.price = price;
			order.currencyCode = "INR";

			// console.log(order);debugger;

			this.getOwnerComponent().getModel("orders").getData().unshift(order);
			this.getOwnerComponent().getModel("orders").refresh();
			var ordersCount = this.getOwnerComponent().getModel("orders").getData().length;
			this.getView().getModel("counts").setProperty("/ordersCount", ordersCount);

			if (!this.orderAddSuccessDialog) {
				this.orderAddSuccessDialog = this.loadFragment({
					name: "waseem.ui.view.fragments.OrderAddSuccess"
				});
			}
			this.orderAddSuccessDialog.then(function (oDialog) {
				oDialog.open();


			});
			setTimeout(() => {
				this.byId("orderAddSuccessDialog").close();
			}, 2000);


			MessageToast.show("Added Order Successfully");
			this.onCloseAddOrder()
		},
		generateCurrentDate: function () {
			let today = new Date();
			var month = today.toDateString().slice(4, 7);
			var day = today.toDateString().slice(8, 10);
			var year = today.toDateString().slice(11, 15);
			var hours = today.getHours();
			var minutes = today.getMinutes();
			var seconds = today.getSeconds();
			var x = "PM";
			if (hours >= 12) {
				hours = hours - 12;
				x = "AM"
			}
			// +today.toLocaleString().slice(18, 21)
			// return ""+`${month} ${day}, ${year}, ${hours}:${minutes}:${seconds}${today.toLocaleString().slice(18, 21)}`.toString();
			return month + " " + day + ", " + year + ", " + hours + ":" + minutes + ":" + seconds + " " + x;
			// return String(today.getMonth() + 1) + "/" + String(today.getDate()) + "/"+String(today.getFullYear()).slice(2);
		},
		onCustomerSelected: function (oEvent) {
			let customerID = oEvent.getSource().getValue();
			let address = this.getOwnerComponent().getModel("customers").getData().filter(customer => { if (customer.CustomerID == customerID) return customer.address })

			// debugger;

			// this.getView().setModel(new JSONModel(addresses), "addresses");


		},
		onAddProductPress: function (oEvent) {

			if (!this.productDialog) {
				this.productDialog = this.loadFragment({
					name: "waseem.ui.view.fragments.AddProduct"
				});
			}
			this.productDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onRating: function (oEvent) {

			MessageToast.show("Product Rating" + oEvent.getSource().getValue());
		},
		onAddProduct: function (oEvent) {

			let productID = this.formatter.generateID();
			let productName = this.getView().byId("productName").getValue();
			let productRating = this.getView().byId("rating").getValue();
			let category = this.getView().byId("categoryComboBox").getValue();
			let productImage = (this.getView().byId("imageLink").getValue());
			let price = this.getView().byId("productPrice").getValue();
			let discount = this.getView().byId("productDiscountPrice").getValue();
			let availabelQuantity = this.getView().byId("quantity").getValue();


			if(price < discount){
				this.getView().byId("productPrice").setValueState("Error");
				this.getView().byId("productPrice").setValueStateText("Price cannot be less than discount");
				this.getView().byId("productDiscountPrice").setValueState("Error");
				this.getView().byId("productDiscountPrice").setValueStateText("Discount cannot be more than Price");
				return;
			}else{
				this.getView().byId("productPrice").setValueState("None");
				this.getView().byId("productDiscountPrice").setValueState("None");
			}


			if (!productID || !productName || !productRating || !category || !productImage || !price || !discount || !availabelQuantity) {
				alert("One or More fields are Empty !!");
				return;
			}

			// debugger;

			let product = {
				"id": productID,
				"Name": productName,
				"productType": category,
				"AvailabelQuantity": availabelQuantity,
				"productImage": productImage,
				"discount": discount,
				"price": price,
				"rating": productRating,
				"CurrencyCode": "INR"
			}
			// console.log(product);debugger;
			this.getOwnerComponent().getModel("productsList").getData().unshift(product)

			this.getOwnerComponent().getModel("productsList").refresh();
			var productsCount = this.getOwnerComponent().getModel("productsList").getData().length;
			this.getView().getModel("counts").setProperty("/productsCount", productsCount);


			if (!this.productAddSuccessDialog) {
				this.productAddSuccessDialog = this.loadFragment({
					name: "waseem.ui.view.fragments.productAddSuccessDialog"
				});
			}
			this.productAddSuccessDialog.then(function (oDialog) {
				oDialog.open();


			});
			setTimeout(() => {
				this.byId("productAddSuccessDialog").close();
			}, 2000)
			// MessageToast.show("Added product successfully");
			this.onCloseAddProduct();
		},
		onCloseAddProduct: function (oEvent) {

			this.byId("addProductDialog").close();
		},
		onAddCustomerPress: function (oEvent) {

			if (!this.customerDialog) {
				this.customerDialog = this.loadFragment({
					name: "waseem.ui.view.fragments.AddCustomer"
				});
			}
			this.customerDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onAddCustomer: function (oEvent) {
			let customerName = this.getView().byId("customerName").getValue();
			let birthDate = this.getView().byId("DOB").getValue();
			let registeredDate = this.generateCurrentDate();
			let mobile = this.getView().byId("mobileNumber").getValue();
			let email = this.getView().byId("customerEmail").getValue();
			let addressID = this.formatter.generateID();

			if (!customerName || !birthDate || !registeredDate) {
				alert("One or more fields in Personal Details Section are missing"); return;
			}

			if (!mobile || !email) {
				alert("One or more fields in Contact Section are missing"); return;
			}

			var customer = {
				"CustomerID": this.formatter.generateID(),
				"Name": customerName,
				"DOB": birthDate,
				"RegisteredOn": registeredDate,
				"MobileNumber": mobile,
				"MobileNumVerified": true,
				"Email": email,
				"EmailVerified": true,
				"address": addressID
			}


			let flat = this.getView().byId("no").getValue();
			let street = this.getView().byId("street").getValue();
			let area = this.getView().byId("area").getValue();
			let city = this.getView().byId("city").getValue();
			let district = this.getView().byId("district").getValue();
			let state = this.getView().byId("state").getValue();
			let pin = this.getView().byId("pin").getValue();
			let country = this.getView().byId("country").getSelectedKey();


			if (!flat || !street || !area || !city || !district || !state || !pin || !country) {
				alert("One or more fields in Address Section are missing"); return;
			}

			var address = {
				"addressID": addressID,
				"flat": flat,
				"street": street,
				"area": area,
				"city": city,
				"district": district,
				"state": state,
				"pin": pin,
				"country": country
			}

			let customers = this.getOwnerComponent().getModel("customers").getData();
			customers.unshift(customer);
			this.getOwnerComponent().getModel("customers").refresh()
			let addresses = this.getOwnerComponent().getModel("addressList").getData();
			addresses.unshift(address);
			this.getOwnerComponent().getModel("addressList").refresh();


			var customersCount = this.getOwnerComponent().getModel("customers").getData().length;
			this.getView().getModel("counts").setProperty("/customersCount", customersCount);


			if (!this.customerAddSuccessDialog) {
				this.customerAddSuccessDialog = this.loadFragment({
					name: "waseem.ui.view.fragments.CustomerAddSuccessDialog"
				});
			}
			this.customerAddSuccessDialog.then(function (oDialog) {
				oDialog.open();


			});
			setTimeout(() => {
				this.byId("customerAddSuccessDialog").close();
			}, 2000)

			MessageToast.show("Added customer successfully");
			this.onCloseCustomer();
		},
		onCloseCustomer: function (oEvent) {

			this.byId("addCustomerDialog").close();
		}
	});
});