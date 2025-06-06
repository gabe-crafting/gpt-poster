<script setup lang="ts">
import type {TextareaProps} from "#ui/components/Textarea.vue";
import {useClipboard, useTextSelection} from "@vueuse/core";

interface TooledTextareaProps {
  transcribedText?: string;
}

interface HistoryString {
  text: string;
  date: Date;
}

const textElement = ref<HTMLTextAreaElement>();
const disabled = ref<boolean>(false);

const value = defineModel<string>({
  required: true,
  default: '' as string,
})

const props = withDefaults(defineProps<TextareaProps & TooledTextareaProps>(), {
  transcribedText: '',
})

const handleSelect = (event: Event) => {
  textElement.value = event.target as HTMLTextAreaElement;
};

const replaceText = (replacement: string) => {
  if (textElement.value) {
    const target = textElement.value;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const selectedText = target.value.substring(start, end);
    const currentText: string = value.value as string;

    if (selectedText) {
      // // Update the value with the selected text
      if (value.value !== undefined) {
        value.value = currentText.slice(0, start) +
        replacement +
        currentText.slice(end) as typeof value.value;
      }

      return
    }

    value.value = currentText.substring(0, start) +
    replacement +
    currentText.substring(target.selectionEnd) as typeof value.value;
  }
}

const clearText = () => {
  if (value.value !== undefined) {
    value.value = "" as typeof value.value;
  }
}


const {copy} = useClipboard({source: ""})

const onfocus = (event: FocusEvent) => {
  textElement.value = event.target as HTMLTextAreaElement;
}

defineExpose({
  replaceText,
})
</script>

<template>
  <div class="main-container">
    <UButtonGroup class="tool-buttons" orientation="vertical" size="lg">
      <UTooltip text="Copy this text to clipboard">
        <UButton icon="material-symbols:content-copy-outline" @click="copy(value)"/>
      </UTooltip>
      <UTooltip text="Replace selected text with microphone input">
        <UButton icon="mdi:microphone-plus" @click="replaceText(transcribedText)" :disabled="disabled"/>
      </UTooltip>
      <UTooltip text="Clear Text">
        <UButton icon="material-symbols:delete-rounded" @click="clearText()" :disabled="disabled"/>
      </UTooltip>
      <UTooltip text="Clear Text">
        <UButton :icon="`${disabled ? 'famicons:lock-closed-outline' : 'famicons:lock-open-outline'}`"
                 @click="disabled = !disabled"/>
      </UTooltip>
    </UButtonGroup>
    <UTextarea v-model="value" v-bind="props" @select="handleSelect" :disabled="disabled" @focus="onfocus"/>
  </div>
</template>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  display: flex;
}
</style>