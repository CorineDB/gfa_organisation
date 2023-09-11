<template>
  <div class="py-4">
    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form key="ajouter" @submit.prevent="updateRefresh">
          <div>
            <label for="regular-form-1" class="form-label">Dureé(en seconde)</label>
            <input id="regular-form-1" type="number" required v-model="formData.refresh" class="form-control"
              placeholder="30" />
          </div>
          <button class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              Ajouter
            </span>
            <span v-else class="flex justify-center items-center space-x-2">
              <span class=" px-4 font-semibold ">
                chargement ...
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Toggle -->
    <div class=" flex justify-between ">

      <div class="search hidden sm:block">
        <input type="text" class="search__input form-control border-transparent" v-model="search"
          placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>

    </div>
    <!-- END: Modal Toggle -->
    <div class="overflow-x-auto mt-5">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Site</th>
            <th class="whitespace-nowrap">Adresses </th>
            <th class="whitespace-nowrap">Equipements </th>
            <th class="whitespace-nowrap">Feedbacks </th>
            <th class="whitespace-nowrap">Date creation</th>

          </tr>
        </thead>
        <tbody>


          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>
            <td>{{ data.site }}</td>
            <td>{{ data.adresse }}</td>
            <td>{{ data.bsd }}</td>
            <td>{{ data.vote }}</td>
            <td>{{ data.dateVote }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue';
import CampagneService from "@/services/modules/campagne.service";
import EntrepriseService from "@/services/modules/entreprise.service";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const search = ref('')
const votes = ref([])
const showModal = ref(false)
const formData = reactive({
  refresh: '',
})


const resultQuery = computed(() => {
  if (search.value) {
    return votes.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.site.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.adresse.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.bsd.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return votes.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return votes.value.slice(startIndex, endIndex);
  }
})

onMounted(function () {
  getData()
})

const refreshChange = function () {
  showModal.value = true
}

function close() {
  formData.refresh = 30
  showModal.value = false
}

const updateRefresh = function () {

  if (chargement.value == false) {

    chargement.value = true
    EntrepriseService.updateRefresh(formData).then((data) => {
      message.type = 'success'
      message.message = 'Durée mise a jour'
      successNotificationToggle()
      close()
      chargement.value = false
    }).catch((error) => {
      chargement.value = false
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message
        message.type = 'erreur'
        message.message = erreurs
        successNotificationToggle()
      } else if (error.request) {
        // Demande effectuée mais aucune réponse n'est reçue du serveur.
        //console.log(error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la demande
        //console.log('dernier message', error.message);
      }
    })
  }
}
const getData = function () {

  CampagneService.getVote(route.params.id).then((data) => {
    const allData = []
    const datas = data.data.data
    datas.forEach((data) => {
      const site = data.nom
      const adresse = data.adresse
      const bsds = data.bsds
      bsds.forEach((bs) => {
        const bsd = bs.nom
        const votes = bs.votes
        votes.forEach((v) => {
          const valeurVote = v.valeur
          let vote = ''
          if (valeurVote == 4) { vote = "médiocre" }
          if (valeurVote == 3) { vote = "passable" }
          if (valeurVote == 2) { vote = "bon" }
          if (valeurVote == 1) { vote = "excéllent" }
          const dateVote = v.created_at

          allData.push({ site, adresse, bsd, vote, dateVote })

        })
      })
    })
    votes.value = allData
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

</script>

<style lang="scss" scoped></style>