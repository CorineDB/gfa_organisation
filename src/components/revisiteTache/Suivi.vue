<template>
  <div>
    <vtable
      id="datatable"
      :headers="headers"
      :datas="suivis"
      sendRequest="false"
    >
    </vtable>
  </div>
</template>

<script>
import Vtable from "@/components/Vtable";
export default {
  components: { Vtable },
  props: ["suivis"],
  data() {
    return {
      headers: [
        { name: "Tache", props: "tache", cle: "nom", edit: false },
        { name: "code pta", props: "tache", cle: "codePta", edit: false },
        { name: "poids initial", props: "tache", cle: "poids", edit: false },
        { name: "poids actuel", cle: "poidsActuel", edit: false },
        { name: "date de creation", cle: "created_at", edit: false },
      ],
    };
  },
};
</script>

<style></style>
