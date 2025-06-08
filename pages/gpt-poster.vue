<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const correctPassword = runtimeConfig.public.posterPass

console.log(correctPassword)

const securePage = () => {

  if (correctPassword === localStorage.getItem("password")) {
    return
  }

  let userInput = prompt("Please enter the password:");

  if (userInput === null) {
    navigateTo('/'); // Redirect to another page
  }
  // Check if password is empty
  else if (userInput === "") {
    alert("Password cannot be empty! Try again.");
    securePage(); // Re-prompt
  }
  // Check if password is correct
  else if (userInput !== correctPassword) {
    alert("Incorrect password! Try again.");
    securePage(); // Re-prompt
  } else {
    alert("Access granted! Welcome!");
    localStorage.setItem("password", userInput);
    // Allow access to page content
  }
}

onMounted(() => {
  securePage()
})
</script>

<template>
  <Main/>
</template>

<style scoped>

</style>