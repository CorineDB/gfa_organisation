<template>
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

    <!-- END: Modal Content -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeResolution">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Titre</label>
            <input id="regular-form-1" type="text" required v-model="formData.titre" class="form-control"
              placeholder="libellé resolution" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="formData.description" class="form-control"
              placeholder="mettez une description" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de debut</label>
            <input id="regular-form-1" :min="min" type="date" required v-model="formData.debut" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de fin</label>
            <input id="regular-form-1" :min="min" type="date" required v-model="formData.fin" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Poids</label>
            <input id="regular-form-1" :min="min" type="number" required v-model="formData.poids" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Campagne </label>


            <TomSelect v-model="campagneId" :options="{ placeholder: 'Selectionez une campagne' }" class="w-full">

              <option v-for="(campagne, index) in campagnes" :key="index" :value="campagne.id">{{ campagne.nom }}
              </option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Type </label>


            <TomSelect v-model="formData.typeId" :options="{ placeholder: 'Selectionez un type' }" class="w-full">

              <option v-for="(type, index) in types" :key="index" :value="type.id">{{ type.nom }}
              </option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Utilisateurs</label>
            <TomSelect v-model="formData.attribuer" :options="{ placeholder: 'Selectionez un utilisateur' }"
              class="w-full" multiple>
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

        <form v-else key="modifier" @submit.prevent="updateResolution">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Titre</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.titre" class="form-control"
              placeholder="libellé resolution" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.description" class="form-control"
              placeholder="mettez une description" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de debut</label>
            <input id="regular-form-1" :min="min" type="date" required v-model="saveUpdate.debut" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de fin</label>
            <input id="regular-form-1" :min="min" type="date" required v-model="saveUpdate.fin" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Poids</label>
            <input id="regular-form-1" :min="min" type="number" required v-model="saveUpdate.poids" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Campagne </label>


            <TomSelect v-model="updateCampagneId" :options="{ placeholder: 'Selectionez une campagne' }" class="w-full">

              <option v-for="(campagne, index) in campagnes" :key="index" :value="campagne.id">{{ campagne.nom }}
              </option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Type </label>


            <TomSelect v-model="updateTypeId" :options="{ placeholder: 'Selectionez un type' }" class="w-full">

              <option v-for="(type, index) in types" :key="index" :value="type.id">{{ type.nom }}
              </option>
            </TomSelect>

          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Utilisateurs</label>
            <TomSelect v-model="saveUpdate.attribuer" :options="{ placeholder: 'Selectionez un utilisateur' }"
              class="w-full" multiple>
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
      <button @click="addResolution" class="btn btn-primary flex space-x-2 items-center">
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
            <th class="whitespace-nowrap">Titre </th>
            <th class="whitespace-nowrap">Description </th>
            <th class="whitespace-nowrap">Campagnes</th>
            <th class="whitespace-nowrap">Utilisateurs associés </th>
            <th class="whitespace-nowrap">Debut </th>
            <th class="whitespace-nowrap">Fin </th>
            <th class="whitespace-nowrap">Type </th>
            <th class="whitespace-nowrap">Statut provisoire </th>
            <th class="whitespace-nowrap">Statut </th>
            <th class="whitespace-nowrap">Poids </th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th>
            <th v-if="$h.getPermission('write.resolution')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="(data, index) in resultQuery " :key="index">

            <td> {{ index + 1 }} </td>
            <td>{{ data.titre }}</td>
            <td>{{ data.description }}</td>
            <td> {{ data.campagne.nom }} </td>
            <td v-for="(attr, ind) in data.attributaires" :key="ind"> <span> {{ attr.nom }}</span> </td>
            <td>{{ data.debut }}</td>
            <td>{{ data.fin }}</td>
            <td>{{ data.type.nom }}</td>
            <td>{{ data.statut }}</td>
            <td> {{ data.valider }} </td>
            <td>{{ data.poids }}</td>
            <td> {{ data.created_at }} </td>
            <td> {{ data.updated_at }}</td>
            <td v-if="$h.getPermission('write.resolution')" class="space-y-2">


              <!-- <Tippy tag="a" href="javascript:;" class="tooltip " content="cliquez pour voir les bsd">
                <span @click="voirBSD(index, data.id)" class="text-indigo-500 cursor-pointer">
                  <EyeIcon />
                </span>
              </Tippy> -->



              <Tippy tag="a" href="javascript:;" class="tooltip mx-auto"
                content="cliquez pour changer le status provisoire">

                <Dropdown class="inline-block" placement="top-end">
                  <DropdownToggle class="mr-1">
                    <AlignJustifyIcon />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                        content="cliquez pour modifier">
                        <span @click="modifier(index, data)"
                          class="text-black cursor-pointer flex justify-start items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                            <path
                              d="M15.566 11.021A7.016 7.016 0 0 0 19 5V4h1V2H4v2h1v1a7.016 7.016 0 0 0 3.434 6.021c.354.208.566.545.566.9v.158c0 .354-.212.69-.566.9A7.016 7.016 0 0 0 5 19v1H4v2h16v-2h-1v-1a7.014 7.014 0 0 0-3.433-6.02c-.355-.21-.567-.547-.567-.901v-.158c0-.355.212-.692.566-.9zm-1.015 3.681A5.008 5.008 0 0 1 17 19v1H7v-1a5.01 5.01 0 0 1 2.45-4.299c.971-.573 1.55-1.554 1.55-2.622v-.158c0-1.069-.58-2.051-1.551-2.623A5.008 5.008 0 0 1 7 5V4h10v1c0 1.76-.938 3.406-2.449 4.298C13.58 9.87 13 10.852 13 11.921v.158c0 1.068.579 2.049 1.551 2.623z">
                            </path>
                          </svg> En cour
                        </span>
                      </Tippy>
                      <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                        content="cliquez pour supprimer">
                        <span @click="supprimer(index, data)"
                          class="text-black cursor-pointer flex justify-start items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                            <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                          </svg> Terminer
                        </span>
                      </Tippy>


                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </Tippy>

              <Tippy tag="a" href="javascript:;" class="tooltip "
                content="cliquez pour changer le status de la résolution">
                <button class="btn btn-primary w-24 mr-1 mb-2"
                  @click="updateStatutResolution(data.campagne.id)">Terminer</button>
              </Tippy>


            </td>
          </tr>
        </tbody>
      </table>

    </div>
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
</template>
  
<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue';
import { helper as $h } from "@/utils/helper";

import { useRouter, useRoute } from 'vue-router'
import CampagneService from "@/services/modules/campagne.service";
import TypeService from "@/services/modules/type.service";
import UsersService from '../../services/modules/user.service';

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const successNotification = ref();
const search = ref('')
const resolutions = ref([])


const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const users = ref([])
const types = ref([])
const campagneId = ref()
const updateCampagneId = ref([])
const updateTypeId = ref([])
const campagnes = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const formData = reactive({
  titre: '',
  description: '',
  fin: Date,
  debut: Date,
  poids: Number,
  attribuer: [],
  typeId: Number
})

const message = reactive({
  type: 'success',
  message: '',
})

const min = computed(() => {
  var d = new Date();
  var day = d.getDate() <= 9 ? `0${d.getDate()}` : d.getDate()
  var month = (d.getMonth() + 1) <= 9 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1)
  let min1 = `${d.getFullYear()}-${month}-${day}`
  return min1
})

const resultQuery = computed(() => {
  if (search.value) {
    return resolutions.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.debut.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.fin.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.indicateur.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return resolutions.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return resolutions.value.slice(startIndex, endIndex);
  }
})

onMounted(function () {

  if (!$h.getPermission('read.resolution')) {
    router.push('/error-page')
  }

  getResolution()
  getCampagne()
  getUser()
  getType()
})



function getCampagne() {
  CampagneService.get().then((data) => {
    campagnes.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function totalPages() {
  return Math.ceil(resolutions.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
}

function getUser() {
  UsersService.get().then((data) => {
    users.value = data.data.data


  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function getType() {
  TypeService.get().then((data) => {
    types.value = data.data.data


  }).catch((e) => {
    // disabled()
    // alert(e)
  })
}


function close() {
  formData.nom = ''
  formData.debut = ''
  formData.fin = ''
  formData.indicateurId = ''
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
function getResolution() {
  CampagneService.getAllResolution().then((data) => {

    resolutions.value = data.data.data

    for (let i = 0; i < resolutions.value.length; i++) {

      let obj = resolutions.value[i]

      for (let j in resolutions.value[i]) {
        if (resolutions.value[i].statut === 0) {
          obj.statut = 'En attente'

        } else if (resolutions.value[i].statut === 1) {
          obj.statut = 'En cour'
        } else if (resolutions.value[i].statut === 2) {
          obj.statut = 'Terminé'
        } else if (resolutions.value[i].statut === 3) {
          obj.statut = 'En retard'
        }
        if (resolutions.value[i].valider === 0) {
          obj.valider = 'Non valider'

        } else if (resolutions.value[i].valider === 1) {
          obj.valider = 'Valider'
        }


      }
    }

  })
}

function addResolution() {
  showModal.value = true
  isUpdate.value = false
}
function updateStatutResolution(idcampagne) {
  CampagneService.updatestatutResolution(idcampagne, 3).then((data) => {
    message.type = 'success'
    message.message = 'resolution terminé'
    successNotificationToggle()
    close()
    getResolution()
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

const storeResolution = function () {

  if (chargement.value == false) {
    chargement.value = true
    CampagneService.postResolution(campagneId.value, formData).then((data) => {
      message.type = 'success'
      message.message = 'Nouvelle résolution crée'
      successNotificationToggle()
      close()
      getResolution()
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
  
<style lang="scss" scoped></style>