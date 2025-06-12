<script setup lang="ts">
import {ref, onMounted} from 'vue'

const correctPassword = ref<string | null>(null)

const fetchPassword = async () => {
  try {
    const response = await fetch('/api/password');
    const data = await response.json()
    correctPassword.value = data.password
  } catch (error) {
    alert('Failed to fetch password.')
    navigateTo('/')
  }
}

const securePage = () => {
  if (correctPassword.value === localStorage.getItem('password')) {
    return
  }

  let userInput = prompt('Please enter the password:')

  if (userInput === null) {
    navigateTo('/')
  } else if (userInput === '') {
    alert('Password cannot be empty! Try again.')
    securePage()
  } else if (userInput !== correctPassword.value) {
    alert('Incorrect password! Try again.')
    securePage()
  } else {
    alert('Access granted! Welcome!')
    localStorage.setItem('password', userInput)
  }
}

onMounted(async () => {
  await fetchPassword()
  if (correctPassword.value) {
    securePage()
  }
})
</script>

<template>
  <Main/>
</template>

<style scoped>

</style>