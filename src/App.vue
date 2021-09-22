<template>
  <div id="app">
    <Inzidenz/>
    <Copyright author="Tobias Reicherzer"/>
  </div>
</template>

<script>
import Inzidenz from "@/components/Inzidenz";
import Copyright from "@/components/Copyright";

export default {
  name: 'App',
  components: {
    Inzidenz,
    Copyright
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  background-color: #4d4d4d;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

html {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
}
</style>
