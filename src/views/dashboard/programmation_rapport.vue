<template>
  <div class="py-4">

    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000, }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
          <div class="text-3xl mt-5">Vous etes sur de supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">
            Cette operation est irreverssible ? <br />Cliquer
            sur annuler pour annuler l'operation
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">
            Annuler
          </button>
          <button type="button" @click="deleteProgrammation" class="btn btn-danger w-24">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeProgrammation">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control"
              placeholder="Nom équipement" />
          </div>
          <div>
            <label for="regular-form-1" class="form-label">Frequence</label>
            <input id="regular-form-1" type="number" required v-model="formData.frequence" class="form-control"
              placeholder="30(jours)" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Campagnes</label>
            <TomSelect v-model="formData.campagnes" :options="{ placeholder: 'Selectionez des campagnes' }" class="w-full"
              multiple>
              <option v-for="(campagne, index) in campagnes" :key="index" :value="campagne.id">{{ campagne.nom }}
              </option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Utilisateurs</label>
            <TomSelect v-model="formData.users" :options="{ placeholder: 'Selectionez un utilisateur' }" class="w-full"
              multiple>
              <option v-for="(user, index) in users" :key="index" :value="user.id">{{ user.nom }} {{ user.prenom }}
              </option>
            </TomSelect>

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

        <form v-else key="modifier" @submit.prevent="updateProgrammation">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control"
              placeholder="Nom équipement" />
          </div>
          <div>
            <label for="regular-form-1" class="form-label">Frequence</label>
            <input id="regular-form-1" type="number" required v-model="saveUpdate.frequence" class="form-control"
              placeholder="30(jours)" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Campagnes</label>
            <TomSelect v-model="saveUpdate.campagnes" :options="{ placeholder: 'Selectionez des campagnes' }"
              class="w-full" multiple>
              <option v-for="(campagne, index) in campagnes" :key="index" :value="campagne.id">{{ campagne.nom }}
              </option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Utilisateurs</label>
            <TomSelect v-model="saveUpdate.users" :options="{ placeholder: 'Selectionez un utilisateur' }" class="w-full"
              multiple>
              <option v-for="(user, index) in users" :key="index" :value="user.id">{{ user.nom }} {{ user.prenom }}
              </option>
            </TomSelect>

          </div>
          <button class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              modifier
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
      <button @click="addProgrammation" class="btn btn-primary flex space-x-2 items-center">
        <PlusSquareIcon />
        <span class="uppercase font-semibold"> ajouter</span>
      </button>
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
            <th class="whitespace-nowrap">Nom </th>
            <th class="whitespace-nowrap">Fréquence(en jour) </th>
            <th class="whitespace-nowrap">Campagne </th>
            <th class="whitespace-nowrap">Utilisateurs </th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th>
            <th v-if="$h.getPermission('write.rapport')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>
            <td>{{ data.nom }}</td>
            <td>{{ data.frequence }}</td>
            <td>{{ data.campagnes }}</td>
            <td>{{ data.users }}</td>
            <td> {{ data.created_at }} </td>
            <td> {{ data.updated_at }}</td>
            <td v-if="$h.getPermission('write.rapport')" class="flex space-x-2 items-center">
              <Tippy tag="a" href="javascript:;" class="tooltip " content="cliquez pour modifier">
                <span @click="modifier(index, data)" class="text-blue-500 cursor-pointer">
                  <EditIcon />
                </span>
              </Tippy>
              <Tippy tag="a" href="javascript:;" class="tooltip " content="cliquez pour supprimer">
                <span @click="supprimer(index, data)" class="text-red-500 cursor-pointer">
                  <Trash2Icon />
                </span>
              </Tippy>

            </td>
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
import { ref, reactive, onMounted, provide, computed } from 'vue';
import EntrepriseService from "@/services/modules/entreprise.service";
import CampagneService from "@/services/modules/campagne.service";
import UsersService from "@/services/modules/user.service";
import { helper as $h } from "@/utils/helper";


const showModal = ref(false)
const deleteModalPreview = ref(false)
const successNotification = ref();
const search = ref('')
const programmations = ref([])
const campagnes = ref([])
const users = ref([])
const deleteData = reactive({})
const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const formData = reactive({
  nom: ''
})

const message = reactive({
  type: 'success',
  message: '',
})

const resultQuery = computed(() => {
  if (search.value) {
    return programmations.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.code.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return programmations.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return programmations.value.slice(startIndex, endIndex);
  }
})

onMounted(function () {
  if (!$h.getPermission('read.rapport')) {
    router.push('/error-page')
  }
  getData()
  getCampagne()
  getUser()
})

function getCampagne() {
  CampagneService.get().then((data) => {
    campagnes.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}



function getUser() {
  UsersService.get().then((data) => {
    users.value = data.data.data


  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

const getData = function () {
  EntrepriseService.programmationRapports().then((data) => {
    programmations.value = data.data.data

    /*var usersR = []
    programmations.forEach(element => {
      const users = element.users
      users.forEach(element => {
        
      });
    });*/
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function totalPages() {
  return Math.ceil(programmations.value.length / itemsPerPage.value);
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


const addProgrammation = function () {
  showModal.value = true
  isUpdate.value = false
}


const storeProgrammation = function () {
  if (chargement.value == false) {
    chargement.value = true
    EntrepriseService.programmationRapport(formData).then((data) => {
      message.type = 'success'
      message.message = 'Nouvelle Programmation ajouté'
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

const supprimer = function (index, data) {
  deleteModalPreview.value = true
  deleteData.id = data.id
  deleteData.nom = data.nom
  deleteData.index = index
}
const deleteProgrammation = function () {
  deleteModalPreview.value = false
  programmations.value.splice(programmations.value.indexOf(deleteData.index), 1);
  BsdService.destroy(deleteData.id).then((data) => {
    message.type = 'success'
    message.message = 'Operation éffectué avec success'
    successNotificationToggle()
    getData()
  }).catch((error) => {

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
    }
  })
}

const modifier = function (index, data) {
  saveUpdate.nom = data.nom
  saveUpdate.frequence = data.frequence
  saveUpdate.campagnes = data.campagnes
  saveUpdate.id = data.id
  showModal.value = true
  isUpdate.value = true
}
const updateProgrammation = function () {
  if (chargement.value == false) {
    chargement.value = true
    const formData = {
      nom: saveUpdate.nom,
      frequence: saveUpdate.frequence,
      campagnes: saveUpdate.campagnes,
      users: saveUpdate.users
    }
    EntrepriseService.programmationRapportUpdate(saveUpdate.id, formData).then((data) => {
      chargement.value = false
      message.type = 'success'
      message.message = 'Mise à jours éffectué avec succèss'
      successNotificationToggle()
      close()
      getData()
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

<style lang="scss" scoped></style>