async function uploadImage() {
    const input = document.getElementById('upload');
    const preview = document.getElementById('preview');
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');

    if (!input.files[0]) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
    }
    reader.readAsDataURL(input.files[0]);

    // Send to backend
    loading.style.display = 'block';
    
    const formData = new FormData();
    formData.append('image', input.files[0]);

    try {
        const response = await fetch('/process', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        output.src = `data:image/jpeg;base64,${result.image}`;
        output.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loading.style.display = 'none';
    }
}