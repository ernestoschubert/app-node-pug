import { Dropzone } from "dropzone"

const maxFiles = 1

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.image = {
    // dictDefaultMessage: "Drop your images here",
    acceptedFiles: ".png,.jpg,.jpeg",
    maxFilesize: 5,
    maxFiles: maxFiles,
    parallelUploads: maxFiles,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictMaxFilesExceeded: `Cantidad maxima de archivos(${maxFiles}) excedido`,
    headers: {
        'CSRF-Token': token
    },
    paramName: "image",
    init: function () {
        const dropzone = this;
        const btnPublish = document.querySelector("#publish");
        btnPublish.addEventListener('click', function () {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length === 0) {
                window.location.href = "/myproperties"
            }
        })
    }
}
