<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <div class="text-center">
      <h1>Welcome to right to bear farms</h1>
      <p>We are a rural tech hub</p>
      <h2>Our products:</h2>
    </div>
    <div class="products m-12">
      <UCard class="w-lg text-left">
        <NuxtLink to="/gpt-poster"><i/> GPT-poster</NuxtLink>
        <p>Generate posts by voice, record them and correct them via AI with our editor</p>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.products {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>