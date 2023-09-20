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

            onSelecFile: function (event) {
                const file = event.getParameters().files[0];

                // Verifique se o arquivo é uma imagem
                if (file.type.startsWith('image/')) {
                    const img = new Image();
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    img.onload = () => {
                        let width = img.width;
                        let height = img.height;

                        // Detecte a orientação da imagem e aplique a correção, se necessário
                        if (width > height) {
                            // A imagem está em modo paisagem, então gire-a para o modo retrato
                            canvas.width = height;
                            canvas.height = width;
                            ctx.rotate(Math.PI / 2); // Rotação de 90 graus (pi/2 radianos)
                            ctx.drawImage(img, 0, -height, width, height);
                        } else {
                            // A imagem já está em modo retrato, não é necessário girar
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                        }

                        // Converta o canvas para um Blob
                        canvas.toBlob((blob) => {
                            // Crie um novo documento PDF usando jsPDF
                            const doc = new jsPDF();
                            const pdfWidth = doc.internal.pageSize.getWidth();
                            const pdfHeight = doc.internal.pageSize.getHeight();

                            // Adicione a imagem corrigida ao PDF
                            doc.addImage(blob, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                            // Salve ou exiba o PDF, por exemplo:
                            //doc.save('documento.pdf'); // Para salvar o PDF
                            // Ou
                            window.open(doc.output('bloburl'), '_blank'); // Para exibir o PDF em uma nova janela do navegador

                        }, file.type);
                    };

                    // Carregue a imagem
                    img.src = URL.createObjectURL(file);
                }

            }
        });
    });
