<template>
  <p class="copyright">
    Alle Angaben sind ohne Gewähr. <br class="small-br">
    Quelle:&nbsp;<a href="https://github.com/marlon360/rki-covid-api">corona-zahlen.org</a><br class="small-br">
    © Website by {{ author }} 2021
  </p>
</template>

<script>
export default {
  name: "Copyright",
  props: {
    author: String,
  }
}
</script>

<style scoped src="../assets/copyright.css"></style>