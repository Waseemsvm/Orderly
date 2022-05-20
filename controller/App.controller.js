sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("waseem.ui.controller.App", {
		onInit: function () {
			document.getElementById("container").removeAttribute("class");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
			
			
		},
		onBeforeRouteMatched: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			
			var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}



		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			
			// Save the current route name
			this.currentRouteName = sRouteName;
			this.currentOrder = oArguments.order;
			// this.currentSupplier = oArguments.supplier;

			
		},
		onAvatarPress: function () {
			this.getOwnerComponent().getRouter().navTo("profile")
		},
		logoPressed: function () {
			this.getOwnerComponent().getRouter().navTo("home")
		},
		onproductSwitcherPressed: function () {

			this.getOwnerComponent().getRouter().navTo("addDetails");

		},
		onSearchText: function (oEvent) {
			let text = oEvent.getSource().getValue();

			window.find(text, false, false);
			// this.byId("pageSearch").click();


		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();

			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, { layout: sLayout, order: this.currentOrder }, true);
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});


});