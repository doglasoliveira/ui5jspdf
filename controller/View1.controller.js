sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "thirdparty/jsPDF"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, jsPDF, EXIF) {
        "use strict";

        return Controller.extend("pdfmobile.controller.View1", {
            onInit: function () {

            },

            onSelecFile: function (oEvent) {
                if (oEvent.getSource().oFileUpload.files.length > 0) {
                    const file = oEvent.getSource().oFileUpload.files[0];
                    let oBlobFile = new Blob([file], { type: file.type });

                    const oReader = new FileReader();

                    oReader.onload = function (e) {
                        var imagem = new Image();
                        imagem.src = e.target.result;
                        imagem.onload = function () {
                            let doc = new jsPDF.jsPDF({
                                orientation: 'p', // Define a orientação da página como retrato
                                unit: 'mm', // Define as unidades como milímetros
                                format: 'a4', // Define o formato da página como A4
                              });
                            doc.addImage(e.target.result, 'JPEG', 0, 0, 297, 210, null, null, null);
                            let sFileName = `${oEvent.getSource().oFileUpload.title}.pdf`;
                            doc.save(sFileName);
                        };
                    };
                    oReader.readAsDataURL(oBlobFile);
                }
            }

        });
    });
