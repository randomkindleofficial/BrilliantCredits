document.getElementById('fileUpload').addEventListener('change', function (e) {
    e.preventDefault();

    // Get the file input element
    var fileInput = document.getElementById('fileUpload');

    // Get the uploaded files
    var files = fileInput.files;

    // Clear previous previews
    var previewItemsContainer = document.getElementById('previewItems');
    previewItemsContainer.innerHTML = '';

    // Loop through the files and create preview items
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Create a preview item element
        var previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        // Check file type and create appropriate preview element
        if (file.type.includes('image')) {
            var imagePreview = document.createElement('img');
            imagePreview.className = 'preview-image';
            imagePreview.src = URL.createObjectURL(file);
            previewItem.appendChild(imagePreview);
        } else if (file.type.includes('pdf')) {
            var pdfPreview = document.createElement('embed');
            pdfPreview.className = 'preview-pdf';
            pdfPreview.src = URL.createObjectURL(file) + '#toolbar=0&navpanes=0&scrollbar=0';
            previewItem.appendChild(pdfPreview);
        }

        // Set the filename as the content of the preview item
        var filename = document.createElement('p');
        filename.innerText = file.name;
        previewItem.appendChild(filename);

        // Append the preview item to the container
        previewItemsContainer.appendChild(previewItem);
    }
});


document.getElementById('getDocumentName').addEventListener('change', function (e) {
    e.preventDefault();

    // Get the document name input element
    var getDocumentNameInput = document.getElementById('getDocumentName');

    // Clear previous document items
    var documentItemsContainer = document.getElementById('documentItems');
    documentItemsContainer.innerHTML = '';

    // Get the document name value
    var docName = getDocumentNameInput.value.trim();

    // Send a GET request to retrieve the document URLs
    fetch('/documents/' + docName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Include any necessary data to send with the POST request
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.urls && data.urls.length > 0) {
            // Loop through the document URLs and create elements based on the file type
            for (var i = 0; i < data.urls.length; i++) {
                var url = data.urls[i];

                // Determine the file extension from the URL
                var parsedUrl = new URL(url);
                const fileName = decodeURIComponent(parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1));


                // Extract the file extension from the URL
                var fileExtension = parsedUrl.pathname.split('.').pop().toLocaleLowerCase();

                console.log(fileExtension, 1);

                if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                    var imageElement = document.createElement('img');
                    imageElement.src = url;

                    // Add margin class
                    imageElement.classList.add('m-2');

                    // Calculate the maximum dimensions
                    var maxWidth = 900;
                    var maxHeight = 450;

                    // Set the maximum width and height of the image while maintaining aspect ratio
                    imageElement.onload = function () {
                        var aspectRatio = imageElement.width / imageElement.height;
                        if (aspectRatio > 1) {
                            // Landscape image
                            if (imageElement.width > maxWidth) {
                                imageElement.width = maxWidth;
                                imageElement.height = maxWidth / aspectRatio;
                            }
                        } else {
                            // Portrait or square image
                            if (imageElement.height > maxHeight) {
                                imageElement.height = maxHeight;
                                imageElement.width = maxHeight * aspectRatio;
                            }
                        }
                    };

                    // Append the image element to the container
                    documentItemsContainer.appendChild(imageElement);

                    // Open the image in a new tab when clicked
                    imageElement.addEventListener('click', function () {
                        window.open(url, '_blank');
                    });


                } else if (fileExtension === 'pdf') {
                    // Create a link element for PDF files
                    var documentLink = document.createElement('a');
                    documentLink.href = url;
                    documentLink.target = '_blank';
                    documentLink.innerText = fileName;
                    documentLink.classList.add('btn', 'btn-outline-light', 'm-2');

                    // Append the document link to the container
                    documentItemsContainer.appendChild(documentLink);

                }
                else if (fileExtension) {
                    // Create a link element for PDF files
                    var documentLink = document.createElement('a');
                    documentLink.href = url;
                    documentLink.target = '_blank';
                    documentLink.innerText = fileName;
                    documentLink.classList.add('btn', 'btn-outline-light', 'm-2');

                    // Append the document link to the container
                    documentItemsContainer.appendChild(documentLink);

                } 
            }
        } else {
            // No document found
            var errorMessage = document.createElement('p');
            errorMessage.innerText = 'Document not found.';
            documentItemsContainer.appendChild(errorMessage);
        }
    })
    .catch(error => {
        console.error(error);
        // Display an error message
        var errorMessage = document.createElement('p');
        errorMessage.innerText = 'An error occurred while retrieving the document.';
        documentItemsContainer.appendChild(errorMessage);
    });
});