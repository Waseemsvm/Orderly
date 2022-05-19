sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    "sap/ui/model/type/Currency"
], function (NumberFormat,
    Currency) {

    // debugger;

    return {
        availableStatus: function (state) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (state) {
                case 'A': return oResourceBundle.getText("A");
                case 'B': return oResourceBundle.getText("B");
                case 'C': return oResourceBundle.getText("C");
                default: return state;
            }
        },
        availableState: function (state) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (state) {
                case 'A': return parseInt(oResourceBundle.getText("AColor"));
                case 'B': return parseInt(oResourceBundle.getText("BColor"));
                case 'C': return parseInt(oResourceBundle.getText("CColor"));

                default: return state;
            }
        },
        productPriceFormatter: function (price) {
            if (price >= 1000) {
                return "Success";
            } else if (price >= 500) {
                return "Warning";
            } else if (price >= 100) {
                return "Error";
            } else {
                return "Information";
            }
        },
        currencyFormatterWithQuantity: function (price, currencyCode, quantity) {


            var oCurrencyFormat = NumberFormat.getCurrencyInstance({
                currencyCode: true,
                showMeasure: false
            });
            return oCurrencyFormat.format(quantity * price, currencyCode);
        },
        currencyFormatter: function (price, currencyCode) {


            var oCurrencyFormat = NumberFormat.getCurrencyInstance({
                currencyCode: true,
                showMeasure: false
            });



            return oCurrencyFormat.format(price, currencyCode);
        },
        generateID: function () {
            return "ID" + Math.random().toString(16).slice(2).toUpperCase();
        },

        phoneNumber: function (number) {
            // var phoneno = /^\d{10}$/;
            if (/^\d{10}$/.test(number)) {
                return true;
            }
            else {
                return false;
            }
        },
        isName: function (name) {
            if (name != null) {
                if (/^[a-zA-Z\s]+$/.test(name) == true) {
                    if (name.length < 3) {
                        return "minName";
                    } else if (name.length > 30) {
                        return "maxName";
                    } else {
                        return true;
                    }
                } else {
                    return "nonAlphaError";
                }
            } else {
                return "null"
            }
        },
        isValidMail: function (mail) {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            
            if (mailformat.test(mail)) {
                return true;
            } else {
                return false;
            }
        },
        isValidDate: function(date){
            var dateformat = /^[a-zA-Z]{3}\s\d{1,2},\s\d{4},\s\d{2}:\d{2}:\d{2}\s[A|P]M/;
            if(dateformat.test(date)){
                return true;
            }else{
                return false;
            }
        }

    }
});