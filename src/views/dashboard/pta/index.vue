<template></template>

<script>
import PtabService from "@/services/modules/pta.service.js";
import BailleursService from "@/services/modules/bailleur.service.js";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      tabPtab: [],
      annee: null,
    };
  },
  computed: {
    ...mapGetters("auths", { currentUser: "GET_AUTHENTICATE_USER" }),
  },

  methods: {
    getTab() {
      let data = {};
      if (this.annee == null) {
        const year = new Date().getFullYear();
        data = {
          programmeId: this.currentUser.programme.id,
          annee: year,
        };
      } else {
        data = {
          programmeId: this.currentUser.programme.id,
          annee: Number(this.annee),
        };
      }
      PtabService.getPta(data)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    console.log(this.currentUser);
    this.getTab();
  },
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
