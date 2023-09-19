sap.ui.loader.config({
    // activate real async loading and module definitions
    async: true,

    // load thirparty from cdn
    paths: {
        "thirdparty/canvg": "https://cdnjs.cloudflare.com/ajax/libs/canvg/3.0.10/umd.min",
        "thirdparty/jsPDF": "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min",
        "thirdparty/exif-js": "https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min"
    },

    // provide dependency and export metadata for non-UI5 modules
    // canvg is already laoded by sap/viz/libs/canvg sap-ui-core l.1829
    // but it's an older version, like that we dont have conflict
    shim: {
        "thirdparty/canvg": {
            amd: true,
            exports: "canvg"
        },
        "thirdparty/jsPDF": {
            amd: true,
            exports: "jspdf",
            deps: ["thirdparty/canvg"]
        },
        "thirdparty/exif-js": {
            amd: true,
            exports: "exif-js"
        }
    }
});

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "pdfmobile/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("pdfmobile.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);