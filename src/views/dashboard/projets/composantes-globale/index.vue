<template>
test

</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { getStringValueOfStatutCode } from "@/utils/index";
import ProjetService from "@/services/modules/projet.service.js";
import ComposantesService from "@/services/modules/composante.service";
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },

  methods: {},

  created() {},
  mounted() {},
};
</script>

<style></style>
