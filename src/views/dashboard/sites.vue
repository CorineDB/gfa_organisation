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
          <button type="button" @click="deleteSite" class="btn btn-danger w-24">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeSite">

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control"
              placeholder="Ex: Gar routière international" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Adresse</label>
            <input id="regular-form-1" type="text" required v-model="formData.adresse" class="form-control"
              placeholder="ex:Cotonou, Littoral, Bénin" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Longitude</label>
            <input id="regular-form-1" type="number" required v-model="formData.longitude" class="form-control"
              placeholder="ex: 9.350000" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Latitude</label>
            <input id="regular-form-1" type="number" required v-model="formData.latitude" class="form-control"
              placeholder="ex:2.616667
        " />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Contact</label>
            <input id="regular-form-1" type="number" required v-model="formData.contact" class="form-control"
              placeholder="ex:+229 01 02 03 04" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Pays</label>
            <input id="regular-form-1" type="text" required v-model="formData.pays" class="form-control"
              placeholder="ex:Cote-ivoire" />
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

        <form v-else key="modifier" @submit.prevent="updateSite">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control"
              placeholder="" />
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Adresse</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.adresse" class="form-control"
              placeholder="" />
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
      <button @click="addSite" class="btn btn-primary flex space-x-2 items-center">
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
            <th class="whitespace-nowrap">Site</th>
            <th class="whitespace-nowrap">Adresses </th>
            <!-- <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th> -->
            <th v-if="$h.getPermission('write.site')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>
            <td>{{ data.nom }}</td>
            <td> <a :href="data.adresse" target="_blank">{{ data.adresse }}</a> </td>
            <!-- <td> {{ data.created_at }} </td>
            <td> {{ data.updated_at }}</td> -->
            <td v-if="$h.getPermission('write.site')" class="flex space-x-2 items-center">

              <Dropdown class="inline-block" placement="top-end">
                <DropdownToggle class="mr-1">
                  <AlignJustifyIcon />
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent>
                    <Tippy tag="a" href="javascript:;" class="tooltip  inline-block my-2" content="cliquez pour modifier">
                      <span @click="modifier(index, data)"
                        class="text-black cursor-pointer flex justify-start items-center">
                        <EditIcon class="mr-2" />Modifier
                      </span>
                    </Tippy>
                    <Tippy tag="a" href="javascript:;" class="tooltip  inline-block my-2"
                      content="cliquez pour supprimer">
                      <span @click="supprimer(index, data)"
                        class="text-black cursor-pointer flex justify-start items-center">
                        <Trash2Icon class="mr-2" />Supprimer
                      </span>
                    </Tippy>

                    <Tippy tag="a" href="javascript:;" class="tooltip  inline-block my-2"
                      content="cliquez pour exporter les stats de ce site">
                      <span class="text-black cursor-pointer flex justify-start items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-upload mr-2">
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

import SiteService from "@/services/modules/site.service";
const showModal = ref(false)
const deleteModalPreview = ref(false)
const successNotification = ref();
const search = ref('')
const sites = ref([])
const deleteData = reactive({})
const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const formData = reactive({
  nom: '',
  adresse: '',
  pays: '',
  longitude: Number,
  latitude: Number,
  contact: Number
})

const message = reactive({
  type: 'success',
  message: '',
})

const resultQuery = computed(() => {
  if (search.value) {
    return sites.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.adresse.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    //return sites.value;
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return sites.value.slice(startIndex, endIndex);
  }
})

onMounted(function () {

  if (!$h.getPermission('read.site')) {
    router.push('/error-page')
  }
  getData()
})

const getData = function () {
  SiteService.get().then((data) => {
    sites.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function totalPages() {
  return Math.ceil(sites.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
}

function close() {
  formData.nom = ''
  formData.adresse = ''
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


const addSite = function () {
  showModal.value = true
  isUpdate.value = false
}

const storeSite = function () {
  if (chargement.value == false) {
    chargement.value = true
    SiteService.create(formData).then((data) => {
      message.type = 'success'
      message.message = 'site creer avec success '
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
const deleteSite = function () {
  deleteModalPreview.value = false
  sites.value.splice(sites.value.indexOf(deleteData.index), 1);
  SiteService.destroy(deleteData.id).then((data) => {
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
  saveUpdate.id = data.id
  saveUpdate.nom = data.nom
  saveUpdate.adresse = data.adresse
  showModal.value = true
  isUpdate.value = true
}
const updateSite = function () {
  if (chargement.value == false) {
    chargement.value = true
    const formData = {
      nom: saveUpdate.nom,
      adresse: saveUpdate.adresse,
    }
    SiteService.update(saveUpdate.id, formData).then((data) => {
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
</script>

<style lang="scss" scoped></style>