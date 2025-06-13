<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <video controls>
      <source src="https://randomromania.com/intro-vid.mp4">
    </video>
    <NuxtLink to="/gpt-poster"><img src="https://randomromania.com/prod-tool.jpg"></NuxtLink>
  </div>
</template>

<style scoped>
.products {
  display: flex;
  justify-content: center;
  align-content: center;
}

p {
  margin: 10px 0;
}
</style>