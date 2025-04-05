export const useRecorder = () => {
    const audioSrc = ref('')
    const isRecording = ref(false)
    const mediaRecorderRef = ref<MediaRecorder | null>(null)
    const audioChunks = ref<Blob[]>([])
    const audioBlobRef = ref<Blob | null>(null)
    const loadingRecorder = ref(false)

    const startRecording = async () => {
        audioSrc.value = '';
        loadingRecorder.value = true;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});

            mediaRecorderRef.value = new MediaRecorder(stream);
            mediaRecorderRef.value.start();
            isRecording.value = true;
            mediaRecorderRef.value.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            };

            mediaRecorderRef.value.onstop = () => {
                const audioBlob = new Blob(audioChunks.value, {type: "audio/wav"});
                const audioUrl = URL.createObjectURL(audioBlob);
                audioBlobRef.value = audioBlob
                audioSrc.value = audioUrl;

                /* /send to backend */
                audioChunks.value = [];
                isRecording.value = false;
            };
        } catch (err) {
            console.error("Error accessing the microphone: ", err);
        } finally {
            loadingRecorder.value = false;
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.value) {
            mediaRecorderRef.value.stop();
        }
    };

    return {
        audioBlobRef,
        audioSrc,
        isRecording,
        startRecording,
        stopRecording,
        loadingRecorder
    }
}