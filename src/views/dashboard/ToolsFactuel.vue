<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000, }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}
        </div>
        <div class="mt-1 text-slate-500">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Vous etes sur supprimer {{ deleteData.nom }} ?</div>
          <div class="mt-2 text-slate-500">
            Cette operation est irreverssible ? <br />Cliquer
            sur annuler pour annuler l'operation
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="w-24 mr-1 btn btn-outline-secondary">
            Annuler
          </button>
          <button type="button" @click="deleteGroupe" class="w-24 btn btn-danger">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->








    <!-- BEGIN: Modal Content -->
    <Modal size="modal-xl" :show="showModal" @hidden="close" id="modxxl">
      <ModalBody class="lg:p-10 ">

        <div class="w-full p-4 font-bold text-center text-white bg-blue-900 rounded">
          FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE
        </div>

        <table class="w-full mt-12 text-sm border-collapse table-fixed">
          <tbody>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Structure :</td>
              <td>Lorem ipsum dolor sit amet.</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
              <td>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Date d’auto-évaluation :</td>
              <td>Lorem ipsum dolor sit.</td>
            </tr>
          </tbody>
        </table>

        <table class="w-full mt-12 text-sm border-collapse table-auto">
          <thead class="text-left bg-green-200">
            <tr>
               <th class="pl-2">Principe</th>
               <th>Indice Factuel</th>
            </tr>
           
          </thead>
          <tbody>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Redevabilité</td>
              <td>0.56</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Transparence</td>
              <td>0.56</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Participation</td>
              <td>0.56</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Egalité et non-discrimination / inclusion</td>
              <td>0.56</td>
            </tr>
            <tr class="border-b border-slate-300">
              <td class="p-2 font-medium">Efficacité et efficience</td>
              <td>0.56</td>
            </tr>
          </tbody>
        </table>

        <table class="w-full mt-12 border-collapse table-auto" border="0" cellpadding="0" cellspacing="0">
          <thead class="text-left bg-blue-900">
            <tr>
              <th scope="col" class="p-2 text-white">Principes</th>
              <th scope="col" class="p-2 text-white">Critères</th>
              <th scope="col" class="w-full p-2 text-white">Indicateurs</th>
              <th scope="col" class="p-2 text-white whitespace-nowrap">Réponse <br>(Oui / Non)</th>
              <th scope="col" class="p-2 text-white">Note</th>
              <th scope="col" class="p-2 text-white whitespace-nowrap">Sources de vérification</th>
            </tr>
            <tr class="bg-white border-t-8 border-white">
              <th class="p-2 my-2 text-center bg-yellow-300" colspan="5">INDICE FACTUEL DE GOUVERNANCE</th>
              <th class="p-2 text-center bg-yellow-300">0.59</th>
            </tr>
            <tr class="bg-white border-t-8 border-white">
              <th class="p-2 my-2 bg-yellow-300" colspan="5">Gouvernance politique</th>
              <th class="p-2 text-center bg-yellow-300">0.59</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="p-2 font-bold bg-yellow-500" rowspan="5">Redevabilité</td>
              <td class="p-2 bg-yellow-500" rowspan="4">Légitimité/légalité</td>
              <td class="p-2 bg-green-600">Rôles et responsabilité clairement définis</td>
              <td class="p-2 text-center bg-green-600">1</td>
              <td class="p-2 bg-green-600">10</td>
            </tr>
            <tr class="text-white bg-red-600">
              <td class="p-2 ">Organes statutaires fonctionnels</td>
              <td class="p-2 text-center">2</td>
              <td class="p-2">15</td>
            </tr>
            <tr class="bg-yellow-500">
              <td class="p-2">Existence de statuts et règlement intérieur</td>
              <td class="p-2 text-center">3</td>
              <td class="p-2">6</td>
            </tr>
            <tr class="bg-green-500">
              <td class="p-2">Rédaction et validation des rapports d’activités</td>
              <td class="p-2 text-center">3</td>
              <td class="p-2">6</td>
            </tr>
            <tr class="font-bold bg-yellow-500 ">
              <td colspan="2" class="px-2"></td>
              <td class="px-2 text-xs whitespace-nowrap">Score Factuel</td>
              <td class="px-2">0.43</td>
            </tr>
            <!-- row 2 -->
            <tr>
              <td class="p-2 font-bold" rowspan="5">Redevabilité</td>
              <td class="p-2" rowspan="4">Légitimité/légalité</td>
              <td class="p-2">Rôles et responsabilité clairement définis</td>
              <td class="p-2 text-center">1</td>
              <td class="p-2">10</td>
            </tr>
            <tr>
              <td class="p-2">Organes statutaires fonctionnels</td>
              <td class="p-2 text-center">2</td>
              <td class="p-2">15</td>
            </tr>
            <tr>
              <td class="p-2">Existence de statuts et règlement intérieur</td>
              <td class="p-2 text-center">3</td>
              <td class="p-2">6</td>
            </tr>
            <tr>
              <td class="p-2">Rédaction et validation des rapports d’activités</td>
              <td class="p-2 text-center">3</td>
              <td class="p-2">6</td>
            </tr>
            <tr class="subTotatlRow">
              <td colspan="2" class="px-2 sub-total-text"> ->\ </td>
              <td class="px-2 text-xs font-bold whitespace-nowrap">Score Factuel</td>
              <td class="px-2">0.43</td>
            </tr>

          </tbody>
        </table>

      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class="flex justify-end ">
      <!-- <button @click="addGroupe" class="flex items-center space-x-2 btn btn-primary">
        <PlusSquareIcon />
        <span class="font-semibold uppercase"> ajouter</span>
      </button> -->
      <div class="hidden search sm:block">
        <input type="text" class="border-transparent search__input form-control" v-model="search"
          placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>

    </div>
    <!-- END: Modal Toggle -->

    <div class="mt-5 overflow-x-auto">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Structure </th>
            <th class="whitespace-nowrap">Nom, Prénom et qualité du point focal Gouvernance </th>
            <th class="whitespace-nowrap">Date d’auto-évaluation </th>

            <th v-if="$h.getPermission('write.indicateur')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>
            <td>{{ data.nom }}</td>
            <td>{{ data.description }}</td>
            <td>{{ data.created_at }}</td>
            <!-- <td> {{ data.created_at }} </td>
            <td> {{ data.updated_at }}</td> -->
            <td v-if="$h.getPermission('write.indicateur')" class="flex items-center space-x-2">


              <Dropdown class="inline-block" placement="top-end">
                <DropdownToggle class="mr-1">
                  <AlignJustifyIcon />
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent>
                    <!-- <Tippy tag="a" href="javascript:;" class="inline-block my-2 tooltip" content="cliquez pour modifier">
                      <span @click="modifier(index, data)"
                        class="flex items-center justify-start text-black cursor-pointer">
                        <EditIcon class="mr-2" />Modifier
                      </span>
                    </Tippy> -->
                    <Tippy tag="a" href="javascript:;" class="inline-block my-2 tooltip" content="cliquez pour modifier">
                      <span @click="modifier(index, data)"
                        class="flex items-center justify-start text-black cursor-pointer">
                        <EditIcon class="mr-2" />Fiche synthèse
                      </span>
                    </Tippy>
                    <!-- <Tippy tag="a" href="javascript:;" class="inline-block my-2 tooltip" content="cliquez pour supprimer">
                      <span @click="supprimer(index, data)"
                        class="flex items-center justify-start text-black cursor-pointer">
                        <Trash2Icon class="mr-2" />Supprimer
                      </span>
                    </Tippy> -->
                    <!-- <Tippy tag="a" href="javascript:;" class="inline-block my-2 tooltip"
                      content="cliquez pour ajouter ou voir les indicateurs">
                      <span @click="voirIndicateur(index, data.id)"
                        class="flex items-center justify-start text-black cursor-pointer"><svg
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="mr-2 feather feather-plus-circle">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>Ajouter Indicateur</span>
                    </Tippy> -->
                    <Tippy tag="a" href="javascript:;" class="inline-block my-2 tooltip"
                      content="cliquez pour voir les stats de ce indicateur">
                      <span class="flex items-center justify-start text-black cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="mr-2 feather feather-trending-up">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                          <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>Voir Stats</span>
                    </Tippy>
                    <Tippy tag="a" href="javascript:;" class="inline-block my-2 tooltip"
                      content="cliquez pour exporter les stats de ce indicateur">
                      <span class="flex items-center justify-start text-black cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="mr-2 feather feather-upload">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>Exporter</span>
                    </Tippy>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>


              <div class="text-center">
                <InfoIcon href="javascript:;" :name="'custom-tooltip-content' + index" class="tooltip" />
              </div>
              <!-- END: Custom Tooltip Toggle -->
              <!-- BEGIN: Custom Tooltip Content -->
              <div class="tooltip-content">
                <TippyContent :to="'custom-tooltip-content' + index">
                  <div :id="'custom-content-tooltip' + index" class="relative">
                    <div class="my-1">
                      Date de création : {{ data.created_at }}
                    </div>
                    <div class="my-1">
                      Date de mise à jour : {{ data.updated_at }}
                    </div>

                  </div>
                </TippyContent>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4" v-if="totalPages() > 1">
        <button
          class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-l-md focus:outline-none"
          :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <template v-if="totalPages() <= 7">
          <button
            class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
            :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in totalPages()" :key="pageNumber"
            @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
        </template>
        <template v-else>
          <template v-if="currentPage <= 4">
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
          <template v-else-if="currentPage >= totalPages() - 3">
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">
              1
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }"
              v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
          </template>
          <template v-else>
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">
              1
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }"
              v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
            <button
              class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
        </template>
        <button
          class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-r-md focus:outline-none"
          :disabled="currentPage === totalPages()" @click="currentPage++">Next</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue'; import { helper as $h } from "@/utils/helper";

import { useRouter, useRoute } from 'vue-router'
import GroupeService from "@/services/modules/groupe.service";

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const deleteModalPreview = ref(false)
const successNotification = ref();
const search = ref('')
const groupes = ref([])
const deleteData = reactive({})
const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const formData = reactive({
  nom: '',
  description: ''
})

const message = reactive({
  type: 'success',
  message: '',
})

const resultQuery = computed(() => {
  if (search.value) {
    return groupes.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.description.toString().toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return groupes.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return groupes.value.slice(startIndex, endIndex);
  }
})

onMounted(function () {

  if (!$h.getPermission('read.indicateur')) {
   // router.push('/error-page')
  }

  getData()
})

const getData = function () {
  GroupeService.getGroupeByEntreprise().then((data) => {
    groupes.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function totalPages() {
  return Math.ceil(groupes.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
}
function close() {
  formData.nom = ''
  formData.description = ''
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


const addGroupe = function () {
  showModal.value = true
  isUpdate.value = false
}


const storeGroupe = function () {
  if (chargement.value == false) {
    chargement.value = true
    GroupeService.create(formData).then((data) => {
      message.type = 'success'
      message.message = 'Nouveaux groupe créee'
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

const deleteGroupe = function () {
  deleteModalPreview.value = false
  groupes.value.splice(groupes.value.indexOf(deleteData.index), 1);
  GroupeService.destroy(deleteData.id).then((data) => {
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
  saveUpdate.description = data.description
  saveUpdate.id = data.id
  showModal.value = true
  isUpdate.value = true
}
const updateGroupe = function () {
  if (chargement.value == false) {
    chargement.value = true
    const formData = {
      nom: saveUpdate.nom,
      description: saveUpdate.description
    }
    GroupeService.update(saveUpdate.id, formData).then((data) => {
      chargement.value = false
      message.type = 'success'
      message.message = 'Mise à jours éffectué avec succèss'
      successNotificationToggle()
      close()
      getData()
      this.getData()
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
const voirIndicateur = function (index, id) {
  router.push({ name: 'Indicateurs', params: { id: id } })
}
const toBack = function () {
  router.go(-1)
};

</script>

<style>
#modxxl>.modal-body {
  padding: 0.50rem !important;
}

#modxxl>.modal.overflow-y-auto.show {
  padding-left: 0% !important;
}

#modxxl>.modal.show>.modal-dialog {
  width: 100% !important;
}

#modxxl> .modal.show>.modal-dialog.modal-dialog {
  margin-top: 1% !important;
}

@media (min-width: 1024px) {
  #modxxl>.modal .modal-dialog {
    width: 100% !important;
    height: 100%;
  }
}

@media (min-width: 640px) {
  #modxxl>.modal .modal-dialog {
    width: 100% !important;
    height: 100%;
  }
}

/* table {
  width: 100%;
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: #b4b4b4;
}  */

/* table th {
  background: #b4b4b4;
  color: #fff;
} */

/* table td {
  border-width: 1px 1px 0 0;
  border-style: solid;
  border-color: #111111;
  padding: 3px 5px;
} */
</style>