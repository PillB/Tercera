// Initialize TinyMCE Editor
tinymce.init({ selector: '#description' });

// Initialize Dropzone for image upload
Dropzone.options.imageUpload = {
    url: '/upload-image', // Server script for handling uploads
    maxFiles: 1,
    acceptedFiles: 'image/*',
    dictDefaultMessage: 'Drop your image here or click to upload (Only images)',
};

// Initialize Tagify for tagging
new Tagify(document.querySelector('#tags'));

// Form submission with AJAX and DOMPurify
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const title = DOMPurify.sanitize(document.getElementById('title').value);
    const description = tinymce.get('description').getContent();
    const category = DOMPurify.sanitize(document.getElementById('category').value);
    const tags = DOMPurify.sanitize(document.getElementById('tags').value);
    const image = document.querySelector('#image-upload').dropzone.files[0]; // Get the uploaded file

    // Create FormData object for AJAX request
    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    if (image) formData.append('image', image);

    // AJAX request to server
    fetch('/submit-project', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle response
        console.log('Success:', data);
        // Redirect or show success message
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors here
    });
});
