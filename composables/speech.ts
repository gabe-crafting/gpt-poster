export const useSpeech = () => {
    const transcribedText = ref('')
    const {public: {deepgram, uploadPreset, elevenLabs, openAI, cloudName}} = useRuntimeConfig()
    const loadingSpeech = ref(false)

    const uploadToCloudinary = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('upload_preset', uploadPreset); // You can create an unsigned upload preset in Cloudinary

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                return data.secure_url
                // You can use `data.secure_url` for further actions, such as displaying a link to the uploaded audio
            } else {
                console.error('Error uploading audio:', data.error.message);
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    }

    const sendUrlToDeepgram = async (audioUrl: string) => {
        const response = await fetch('https://api.deepgram.com/v1/listen?punctuate=true', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${deepgram}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: audioUrl,
            }),
        });

        if (!response.ok) {
            // Log the response for debugging purposes
            const errorResponse = await response.text();  // Text format for better logging
            console.error('Deepgram API Error:', errorResponse);
            throw new Error(`Failed to transcribe audio: ${response.statusText}`);
        }

        const result = await response.json();
        return result.results.channels[0].alternatives[0].transcript;
    }

    const speechToText = async (audioBlob: Blob) => {
        loadingSpeech.value = true
        try {
            // cloudinary
            const cloudLink = await uploadToCloudinary(audioBlob)
            // deepgram
            transcribedText.value = await sendUrlToDeepgram(cloudLink)
        } catch (err) {
            console.error(err);
        } finally {
            loadingSpeech.value = false
        }
    }

    const getTranscribedText = () => {
        return transcribedText.value;
    }

    return {speechToText, transcribedText, loadingSpeech, getTranscribedText}
}