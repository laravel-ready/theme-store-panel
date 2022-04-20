import * as FilePond from "filepond";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginFileValidateType);

const defaultOptions = {
    instantUpload: false,
    allowProcess: false,
    multiple: false,
    name: "filepond",
    maxFileSize: "2MB",
    maxFiles: 1,
    acceptedFileTypes: ["image/*"],
};

export default {
    create(options) {
        return FilePond.create({ ...defaultOptions, ...options });
    },

    setOptions(options) {
        FilePond.setOptions(options);
    },
};
