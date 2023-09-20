sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "thirdparty/jsPDF"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, jsPDF) {
        "use strict";

        return Controller.extend("pdfmobile.controller.View1", {
            onInit: function () {

            },

            onSelecFile: function (event) {
                const file = event.getParameters().files[0];
                if (file.type.startsWith('image/')) {
                    const img = new Image();
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    img.onload = () => {
                        let width = img.width;
                        let height = img.height;
                        if (width > height) {
                            canvas.width = height;
                            canvas.height = width;
                            ctx.rotate(Math.PI / 2);
                            ctx.drawImage(img, 0, -height, width, height);
                        } else {
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                        }

                        canvas.toBlob((blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const dataURL = reader.result;
                                const doc = new jsPDF.jsPDF();
                                const pdfWidth = doc.internal.pageSize.getWidth();
                                const pdfHeight = doc.internal.pageSize.getHeight();
                                doc.addImage(dataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                                //doc.save('documento.pdf'); // Download pdf just test
                                window.open(doc.output('bloburl'), '_blank'); 
                            };

                            reader.readAsDataURL(blob);
                        }, file.type);
                    };
                    img.src = URL.createObjectURL(file);
                }
            }
        });
    });
