<template>
  <vtable id="datatable" :headers="headers" :datas="suivis" sendRequest="false">
  </vtable>
</template>

<script>
import ComposanteService from "@/services/modules/composante.service.js";
import Vtable from "@/components/Vtable";
export default {
  components: { Vtable },
  props: ["suivis"],
  data() {
    return {
      headers: [
        { name: "Composante", props: "composante", cle: "nom", edit: false },
        { name: "code pta", props: "composante", cle: "codePta", edit: false },
        {
          name: "poids initial",
          props: "composante",
          cle: "poids",
          edit: false,
        },
        { name: "poids actuel", cle: "poidsActuel", edit: false },
        { name: "date de creation", cle: "created_at", edit: false },
      ],
    };
  },
};
</script>

<style></style>
