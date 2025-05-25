<script setup>
import {useRecorder} from "~/composables/recorder.js";
import {useSpeech} from "~/composables/speech.js";
import {useGpt} from "~/composables/gpt.js";
import {useTemplates} from "~/composables/templates.js";
import {useClipboard} from "@vueuse/core";

const {copy} = useClipboard({source: ""})

const {audioSrc, isRecording, startRecording, stopRecording, audioBlobRef, record, loadingRecorder} = useRecorder()
const {speechToText, transcribedText, loadingSpeech} = useSpeech()
const instruction = ref('Correct spelling and grammar, no additional info, just result')
const {sendToGpt, gptResponse, gptLoading} = useGpt()
const templateName = ref('')
const {templates, addTemplate, getTemplate, removeTemplate} = useTemplates()


const recording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const transcribe = () => {
  if (audioBlobRef.value) {
    speechToText(audioBlobRef.value)
  }
}

const sendToGptEvent = () => {
  if (transcribedText.value) {
    sendToGpt(transcribedText.value + ": " + instruction.value)
  }
}

const saveTemplate = () => {
  if (templateName.value && instruction.value) {
    addTemplate({name: templateName.value, content: instruction.value})
  }
}

const setTemplate = (template) => {
  instruction.value = template.content
  templateName.value = template.name
}

const loading = computed(() => {
  return loadingRecorder.value || loadingSpeech.value || gptLoading.value
})

</script>

<template>
  <div class="grid grid-cols-4 gap-2 p-2">
    <UButton :label="isRecording ? 'stop' : 'record'"
             @click="recording"
             style="height: 54px"
             :loading="loading"/>
    <div class="flex items-center justify-center col-span-3">
      <audio controls v-if="audioSrc">
        <source :src="audioSrc" type="audio/wav"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-2 w-full p-2">
    <UCard class="sm:col-span-1 col-span-2">
      <template #header>
        <p>Transcription</p>
      </template>
      <div>
        <div class="grid grid-cols-4 gap-2 pb-2">
          <UButton label="copy text" :loading="loading" @click="copy(transcribedText)"/>
          <UButton label="Transcript" @click="transcribe" :loading="loading"/>
        </div>

        <UTextarea v-model="transcribedText" class="w-full" :rows="14"/>
      </div>
    </UCard>
    <UCard class="sm:col-span-1 col-span-2">
      <template #header>
        <h1>Instructions</h1>
      </template>
      <div>
        <div class="grid grid-cols-4 gap-2 pb-2">
          <UButton label="copy text" @click="copy(instruction)"/>
          <UButton label="save template" @click="saveTemplate"/>
          <UButton label="gpt" :loading="loading" @click="sendToGptEvent"/>
        </div>

        <div class="grid grid-cols-4 gap-2 pb-2">
          <UButtonGroup v-for="template in templates">
            <UButton :label="template.name"
                     @click="setTemplate(template)"
            />
            <UButton color="neutral" variant="outline" icon="akar-icons:cross" @click="removeTemplate(template)"/>
          </UButtonGroup>
        </div>

        <UInput placeholder="Template name" class="w-full mb-2" v-model="templateName"/>
        <UTextarea v-model="instruction" class="w-full" :rows="14"/>
      </div>
    </UCard>
    <div class="col-span-2">
      <UTextarea v-model="gptResponse" class="w-full" :rows="14"/>
      <UButton label="copy text" class="mt-2" @click="copy(gptResponse)"/>
    </div>
  </div>
</template>

<style scoped>

</style>