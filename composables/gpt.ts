export const useGpt = () => {
    const runtimeConfig = useRuntimeConfig()

    const gptResponse = ref<string>('');
    const gptLoading = ref(false);
    const error = ref<string | null>(null);

    const sendToGpt = async (userInput: string) => {
        gptLoading.value = true;
        error.value = "";
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${runtimeConfig.public.openAI}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",  // or "gpt-3.5-turbo"
                    messages: [{role: "user", content: userInput}]
                })
            });

            const data = await response.json();

            gptResponse.value = data.choices[0].message.content;
        } catch {
            error.value = "An error occurred while fetching data from the server";
        } finally {
            gptLoading.value = false;
        }
    }

    return {gptResponse, gptLoading, error, sendToGpt};
}