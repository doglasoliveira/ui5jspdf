sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "thirdparty/jsPDF",
    "pdfmobile/Exif"
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
                    this.fixImageOrientation(file, (fixedBlob) => {
                        const doc = new jsPDF();
                        doc.addImage(fixedBlob, 'JPEG', 10, 10); // Exemplo de uso
                        let sFileName = `${oEvent.getSource().oFileUpload.title}.pdf`;
                        doc.save(sFileName);
                    });
                }
            },
            fixImageOrientation: (file, callback) => {
                if (file.type.startsWith('image/')) {
                    EXIF.getData(file, function () {
                        const orientation = EXIF.getTag(this, 'Orientation');
                        const img = new Image();
                        img.src = URL.createObjectURL(file);

                    oReader.onload = function (e) {
                        var imagem = new Image();
                        imagem.src = e.target.result;
                        imagem.onload = function () {
                            let doc = new jsPDF.jsPDF({
                                orientation: 'l', // Define a orientação da página como retrato
                                unit: 'mm', // Define as unidades como milímetros
                                format: 'a4', // Define o formato da página como A4
                              });
                            doc.addImage(e.target.result, 'JPEG', 0, 0, 297, 210, null, null, null);
                            let sFileName = `${oEvent.getSource().oFileUpload.title}.pdf`;
                            doc.save(sFileName);
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            if ([5, 6, 7, 8].includes(orientation)) {
                                canvas.width = img.height;
                                canvas.height = img.width;
                            } else {
                                canvas.width = img.width;
                                canvas.height = img.height;
                            }
                            switch (orientation) {
                                case 2:
                                    // Flip horizontal
                                    ctx.transform(-1, 0, 0, 1, canvas.width, 0);
                                    break;
                                case 3:
                                    // 180° rotation
                                    ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height);
                                    break;
                                case 4:
                                    // Flip vertical
                                    ctx.transform(1, 0, 0, -1, 0, canvas.height);
                                    break;
                                case 5:
                                    // 90° rotation and flip vertical
                                    ctx.transform(0, 1, 1, 0, 0, 0);
                                    break;
                                case 6:
                                    // 90° rotation
                                    ctx.transform(0, 1, -1, 0, canvas.height, 0);
                                    break;
                                case 7:
                                    // 90° rotation and flip horizontal
                                    ctx.transform(0, -1, -1, 0, canvas.height, canvas.width);
                                    break;
                                case 8:
                                    // 270° rotation
                                    ctx.transform(0, -1, 1, 0, 0, canvas.width);
                                    break;
                                default:
                                    break;
                            }
                            ctx.drawImage(img, 0, 0);
                            canvas.toBlob((blob) => {
                                callback(blob);
                            }, file.type);
                        };
                    };
                    oReader.readAsDataURL(oBlobFile);
                    });
                } else {
                    callback(file);
                }
            }

        });
    });
