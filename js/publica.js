tinymce.init({
    selector: '#description'
});

Dropzone.options.imageUpload = {
    url: '/upload-image', // Specify your server script to handle the upload
    maxFiles: 1, // Adjust based on your need
    acceptedFiles: 'image/*',
    dictDefaultMessage: 'Drop your image here or click to upload (Only images)',
    // Additional options can be added here
};
