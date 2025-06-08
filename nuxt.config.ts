// https://nuxt.com/docs/api/configuration/nuxt-config
import {process} from "std-env";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/ui'],
    ssr: false,
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        public: {
            apiBase: '/api',
            posterPass: process.env.POSTER_PASS,
            deepgram: process.env.DEEPGRAM_API_KEY,
            uploadPreset: process.env.UPLOAD_PRESET,
            elevenLabs: process.env.ELEVEN_LABS_API_KEY,
            openAI: process.env.OPENAI_API_KEY,
            cloudName: process.env.CLOUD_NAME,
            deepseek: process.env.DEEPSEEK_KEY
        }
    }
})