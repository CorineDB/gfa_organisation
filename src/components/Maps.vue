<template>
  <div class="bg-white  p-2 shadow-sm">
    <div id='map' class='map'></div>
  </div>
</template>

<script>
export default {
  mounted() {
     var map = tt.map({
        key: '<your-tomtom-maps-API-key>',
        container: 'map',
       
      });
      map.addControl(new tt.FullscreenControl());
      map.addControl(new tt.NavigationControl());
  }
}
</script>

<style>

</style>