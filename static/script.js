// Shared Functions
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if(errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
    }
}

// Index Page Functionality
if(document.getElementById('dropZone')) {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('upload');
    const fileInfo = document.getElementById('fileInfo');
    const preview = document.getElementById('preview');
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');
    const resultActions = document.getElementById('resultActions');
    const confidenceBar = document.getElementById('confidenceBar');

    // Drag & Drop handlers
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    async function handleFile(file) {
        errorMessage.classList.add('hidden');
        resultActions.classList.add('hidden');
        
        if(!file.type.startsWith('image/')) {
            showError('Please upload an image file');
            return;
        }

        fileInfo.innerHTML = `
            <i class="fas fa-file-image"></i>
            ${file.name} (${(file.size/1024).toFixed(1)}KB)
        `;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);

        loading.classList.remove('hidden');
        output.style.display = 'none';
        
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/process', {
                method: 'POST',
                body: formData
            });

            if(!response.ok) throw new Error(`Server error: ${response.status}`);

            const result = await response.json();
            
            output.src = `data:image/jpeg;base64,${result.image}`;
            output.style.display = 'block';
            resultActions.classList.remove('hidden');
            confidenceBar.style.width = '75%';

        } catch (error) {
            showError(`Processing failed: ${error.message}`);
        } finally {
            loading.classList.add('hidden');
        }
    }

    function downloadResult() {
        const link = document.createElement('a');
        link.download = 'garbage-analysis-result.jpg';
        link.href = output.src;
        link.click();
    }

    // Initialize confidence bar
    if(confidenceBar) confidenceBar.style.width = '0';
}

// Resources Page Initialization
if(document.querySelector('.resource-container')) {
    // Add any resource page specific JS here
    console.log('Resources page loaded');
}