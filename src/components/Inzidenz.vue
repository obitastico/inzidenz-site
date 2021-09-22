<template>
  <div>
    <h1>Inzidenz von München:</h1>
    <div id="container">
      <p id="inzidenz" class="zoom">{{ inzidenz }}</p>
    </div>
    <p>Für genauere Information <a href="http://tobias.reicherzer.de/corona">hier</a> klicken</p>
    <p>Stand:&nbsp;{{ last_updated }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Inzidenz",
  data() {
    return {
      inzidenz: "&nbsp;",
      last_updated: "NaN"
    }
  },

  created() {
    let ags = "09162";
    let url = `https://api.corona-zahlen.org/districts/${ags}`;
    axios.get(url)
      .then((response) => {
        this.inzidenz = response.data.data[ags].weekIncidence.toFixed(1);
        const meta = response.data.meta;

        let date = new Date(meta.lastUpdate);

        let options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };

        this.last_updated = date.toLocaleTimeString("de-DE", options);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style scoped src="../assets/inzidenz.css"></style>