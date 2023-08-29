try {
    document.getElementById("diary-entry").addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
            e.preventDefault(); // Prevent the default browser "Save Page" action
            document.getElementById("myForm").submit(); // Submit the form
        }
    });
    
} catch (error) {}

function loadFiles(data) {
    const documentItemsContainer = document.getElementById('documentItems');
    documentItemsContainer.innerHTML = '';
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
        }
    } else {
        // No document found
        var errorMessage = document.createElement('p');
        errorMessage.innerText = 'Document not found.';
        documentItemsContainer.appendChild(errorMessage);
    }
}