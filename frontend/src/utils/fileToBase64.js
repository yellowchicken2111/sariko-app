// Read a File/Blob into a base64 data URL ("data:image/jpeg;base64,....").
// Used to send images to the backend upload endpoints as JSON.
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}
