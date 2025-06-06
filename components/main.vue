<script setup>
import {useRecorder} from "~/composables/recorder.js";
import {useSpeech} from "~/composables/speech.js";
import {useGpt} from "~/composables/gpt.js";
import {useTemplates} from "~/composables/templates.js";

const {audioSrc, isRecording, startRecording, stopRecording, audioBlobRef, record, loadingRecorder} = useRecorder()
const {speechToText, transcribedText, loadingSpeech} = useSpeech()
const {sendToGpt, gptResponse, gptLoading} = useGpt()

const initialText = ref('')
const instruction = ref('Correct spelling and grammar, no additional info, just result')
const gptResponseText = ref('')

const gptInput = ref(null)

const templateName = ref('')
const {templates, addTemplate, getTemplate, removeTemplate} = useTemplates()

const recording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

watch(audioBlobRef, async (audioBlob) => {
  if (audioBlobRef.value) {
    await speechToText(audioBlobRef.value)
  }
})

const transcribe = () => {
  initialText.value = transcribedText.value
}

const sendToGptEvent = async () => {
  console.log("sendToGptEvent")
  if (transcribedText.value) {
    await sendToGpt(initialText.value + ": " + instruction.value)
    gptResponseText.value = gptResponse.value
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

const addToGpt = async () => {
  if (transcribedText.value) {
    await sendToGpt(initialText.value + ": " + instruction.value)
    gptInput.value.replaceText(gptResponse.value)
  }
}

</script>

<template>
  <!-- RECORDER -->
  <div class="grid grid-cols-4 gap-2 p-2">
    <UTooltip :text="transcribedText || `No text recorded yet`">
      <UButton :label="isRecording ? 'stop' : 'record'"
               @click="recording"
               style="height: 54px"
               :loading="loading"/>
    </UTooltip>
    <div class="flex items-center justify-center col-span-3">
      <audio controls v-if="audioSrc">
        <source :src="audioSrc" type="audio/wav"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>

  <!-- INITIAL -->
  <div class="grid grid-cols-2 gap-2 w-full p-2">
    <UCard class="sm:col-span-1 col-span-2">
      <template #header>
        <UButtonGroup size="lg">
          <UBadge color="neutral" variant="outline" size="lg" label="Initial Text"/>
          <UTooltip text="Recorded text into the box">
            <UButton label="Transcribe" icon="material-symbols:edit" @click="transcribe" :loading="loading"/>
          </UTooltip>
        </UButtonGroup>
      </template>
      <div>
        <TooledTextarea :transcribedText="transcribedText" v-model="initialText" class="w-full" :rows="14"/>
      </div>
    </UCard>

    <!--  INSTRUCTIONS  -->
    <UCard class="sm:col-span-1 col-span-2">
      <template #header>
        <UButtonGroup class="text-lg" size="lg">
          <UBadge color="neutral" variant="outline" size="lg" label="Instruction"/>
          <UTooltip text="Run GPT">
            <UButton icon="hugeicons:chat-gpt" :loading="loading" @click="sendToGptEvent"/>
          </UTooltip>
          <UTooltip text="Run GPT and replace the selection with the output">
            <UButton :loading="loading" @click="addToGpt">
              <Icon name="hugeicons:chat-gpt"/>
              <Icon name="material-symbols:arrow-forward-rounded"/>
              <Icon name="material-symbols:newspaper"/>
            </UButton>
          </UTooltip>
        </UButtonGroup>
      </template>
      <div>

        <div class="flex flex-wrap gap-2 mb-2">
          <UButtonGroup v-for="template in templates">
            <UButton :label="template.name"
                     @click="setTemplate(template)"
            />
            <UButton color="neutral" variant="outline" icon="akar-icons:cross" @click="removeTemplate(template)"/>
          </UButtonGroup>
        </div>

        <UButtonGroup class="w-full mb-2">
          <UInput placeholder="Template name" class="w-full" v-model="templateName"/>
          <UTooltip text="Save template">
            <UButton icon="material-symbols:add-2-rounded" @click="saveTemplate"/>
          </UTooltip>
        </UButtonGroup>
        <TooledTextarea :transcribedText="transcribedText" v-model="instruction" class="w-full" :rows="14"/>
      </div>
    </UCard>

    <!-- RESULT -->
    <div class="col-span-2">
      <TooledTextarea :transcribedText="transcribedText" v-model="gptResponseText" class="w-full" :rows="14"
                      ref="gptInput"/>
    </div>
  </div>
</template>