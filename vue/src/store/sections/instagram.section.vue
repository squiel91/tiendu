<template>
  <section class="instagram">
    <div id="curator-feed-default-feed-layout"><a href="https://curator.io" target="_blank" class="crt-logo crt-tag">Powered by Curator.io</a></div>
  </section>
</template>

<script>
  export default {
    mounted() {
      (function(){
        var i, e, d = document, s = "script";i = d.createElement("script");i.async = 1;
        i.src = "https://cdn.curator.io/published/58c34917-561a-44b6-9784-a8315feb640a.js";
        e = d.getElementsByTagName(s)[0];e.parentNode.insertBefore(i, e);
        })();
    }
  }
</script>
