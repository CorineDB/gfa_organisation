<template>
  <div v-if="loader" class="loader absolute w-full  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

  <div class="py-4">

    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000, }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}
        </div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form key="ajouter" @submit.prevent="updateRefresh">
          <div>
            <label for="regular-form-1" class="form-label">Durée(en seconde)</label>
            <input id="regular-form-1" type="number" required v-model="formData.refresh" class="form-control"
              placeholder="" />
          </div>
          <button class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              Modifier
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
      <button @click="refreshChange" class="btn btn-primary flex space-x-2 items-center">
        <PlusSquareIcon />
        <span class="uppercase font-semibold"> Modifier la durée</span>
      </button>

      <div class="search hidden sm:block float-right">
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
            <th class="whitespace-nowrap">FeedBacks</th>
            <th class="whitespace-nowrap">Campagne </th>
            <th class="whitespace-nowrap">Indicateur </th>
            <th class="whitespace-nowrap">Bsd </th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>
            <td class="text-white rounded-b-lg bg-green-700 content-center	" v-if="data.valeur == 1">Execellent</td>
            <td class="text-white bg-yellow-700 " v-else-if="data.valeur == 2">Passable</td>
            <td class="text-white content-center	 bg-red-800" v-else>Mediocre</td>
            <td>{{ data.campagne.nom }}</td>
            <td>{{ data.indicateur.nom }}</td>
            <td>{{ data.bsd.nom }}</td>
            <td> {{ data.created_at }} </td>
            <td> {{ data.updated_at }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4" v-if="totalPages() > 1">
        <button
          class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-l-md px-4 py-2 m-1 focus:outline-none"
          :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <template v-if="totalPages() <= 7">
          <button
            class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
            :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in totalPages()" :key="pageNumber"
            @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
        </template>
        <template v-else>
          <template v-if="currentPage <= 4">
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
          <template v-else-if="currentPage >= totalPages() - 3">
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">
              1
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }"
              v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
          </template>
          <template v-else>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">
              1
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }"
              v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
        </template>
        <button
          class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-r-md px-4 py-2 m-1 focus:outline-none"
          :disabled="currentPage === totalPages()" @click="currentPage++">Next</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue'; import { helper as $h } from "@/utils/helper";

import EntrepriseService from "@/services/modules/entreprise.service";


const currentPage = ref(1)
const itemsPerPage = ref(10)
const showModal = ref(false)
const successNotification = ref();
const search = ref('')
const bsds = ref([])
const chargement = ref(false)
const isUpdate = ref(false)
const userInfo =  reactive({

})

const loader = ref(false)

const formData = reactive({
  refresh: ''
})

const message = reactive({
  type: 'success',
  message: '',
})

const resultQuery = computed(() => {
  if (search.value) {
    return bsds.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.code.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return bsds.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return bsds.value.slice(startIndex, endIndex);

  }
})

onMounted(function () {
  if (!$h.getPermission('read.feedback')) {
    router.push('/error-page')
  }
  getData()

  userInfo.value = JSON.parse(localStorage.getItem("bsdInfo")); 
  

  formData.refresh =  userInfo.value.users.entreprise.refresh


  console.log(formData.refresh)

})

const getData = function () {
  loader.value = true
  EntrepriseService.votes().then((data) => {

    loader.value = false

    bsds.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function totalPages() {
  return Math.ceil(bsds.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
}

function close() {
  formData.nom = ''
  showModal.value = false
}



provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};


const refreshChange = function () {
  showModal.value = true
  isUpdate.value = false
}


const updateRefresh = function () {
  if (chargement.value == false) {
    chargement.value = true
    EntrepriseService.updateRefresh(formData).then((data) => {

   
      formData.refresh = data.data.data

      console.log(formData.refresh)
      userInfo.value.users.entreprise.refresh  =  formData.refresh 


      localStorage.setItem("bsdInfo" ,  JSON.stringify(userInfo.value) ) 


      message.type = 'success'
      message.message = 'Durée mise a jour'
      successNotificationToggle()
      close()
      getData()
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
</script>

<style lang="scss" scoped>
.loader {
  border: 16px solid #000000aa;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 0.5s linear infinite;
  /* Safari */
  animation: spin 0.5s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.bg-custom {
  background-color: #00000000;
}
</style>