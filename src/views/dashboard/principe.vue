<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
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
          <div class="text-slate-500 mt-2">Cette operation est irreverssible ? <br />Cliquer sur annuler pour annuler l'operation</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">Annuler</button>
          <button type="button" @click="deletePrincipe" class="btn btn-danger w-24">Supprimer</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storePrincipe">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="libellé du groupe" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label"> Description </label>
            <input id="regular-form-1" type="text" required v-model="formData.description" class="form-control" placeholder="Description" />
          </div>
          <button class="btn btn-primary py-3 px-4 w-full my-3 xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement"> Ajouter </span>
            <span v-else class="flex justify-center items-center space-x-2">
              <span class="px-4 font-semibold"> chargement ... </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>

        <form v-else key="modifier" @submit.prevent="updatePrincipe">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control" placeholder="libellé" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Description</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.description" class="form-control" placeholder="description" />
          </div>

          <!-- <div class="my-2">
            <label for="regular-form-1" class="form-label">Groupes </label>

            <TomSelect v-model="saveUpdate.groupeId" :options="{ placeholder: 'Selectionez un groupe' }" class="w-full">
              <option :value="saveUpdate.promotionId"> {{ saveUpdate.groupeNom }} </option>
              <option v-for="(groupe, index) in gouvernances" :key="index" :value="groupe.id">{{ groupe.nom }}</option>
            </TomSelect>

          </div> -->

          <button class="btn btn-primary py-3 px-4 w-full my-3 xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement"> modifier </span>
            <span v-else class="flex justify-center items-center space-x-2">
              <span class="px-4 font-semibold"> chargement ... </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class="flex justify-between">
      <button @click="addPrincipe" class="btn btn-primary flex space-x-2 items-center">
        <PlusSquareIcon />
        <span class="uppercase font-semibold"> ajouter</span>
      </button>
      <div class="search hidden sm:block">
        <input type="text" class="search__input form-control border-transparent" v-model="search" placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
    </div>
    <div class="my-4 flex justify-between items-center">
      <span class="text-xl uppercase font-bold">principe {{ groupe }} </span>
      <button @click="toBack" class="bg-indigo-500 text-white rounded-lg font-semibold px-3 py-2 outline-none flex space-x-2 items-center">
        <CornerUpLeftIcon />
        <span class="uppercase font-semibold"> Gouvernance</span>
      </button>
    </div>
    <!-- END: Modal Toggle -->
    <div class="overflow-x-auto mt-5">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Nom</th>
            <th class="whitespace-nowrap">Description</th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th>
            <th class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in resultQuery" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.nom }}</td>
            <td>{{ data.description }}</td>
            <td>{{ data.created_at }}</td>
            <td>{{ data.updated_at }}</td>
           <td class="flex space-x-2 items-center">
             
              <Tippy tag="a" href="javascript:;" class="tooltip btn btn-secondary w-24 mr-1 mb-2" content="cliquez pour ajouter ou voir les critère">
                <span @click="voirCritere(index, data.id)" class="text-blue-500 cursor-pointer">Critères</span>
              </Tippy>
               <Tippy tag="a" href="javascript:;" class="tooltip btn btn-secondary w-24 mr-1 mb-2" content="cliquez pour modifier">
                <span @click="modifier(index, data)" class="text-blue-500 cursor-pointer">
                  Modifier
                </span>
              </Tippy>
              <Tippy tag="a" href="javascript:;" class="tooltip btn btn-secondary w-24 mr-1 mb-2" content="cliquez pour supprimer">
                <span @click="supprimer(index, data)" class="text-red-500 cursor-pointer">
                  Supprimer
                </span>
              </Tippy>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4" v-if="totalPages() > 1">
        <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-l-md px-4 py-2 m-1 focus:outline-none" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <template v-if="totalPages() <= 7">
          <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in totalPages()" :key="pageNumber" @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
        </template>
        <template v-else>
          <template v-if="currentPage <= 4">
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
          <template v-else-if="currentPage >= totalPages() - 3">
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">1</button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
          </template>
          <template v-else>
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">1</button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber" @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
        </template>
        <button class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-r-md px-4 py-2 m-1 focus:outline-none" :disabled="currentPage === totalPages()" @click="currentPage++">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import PrincipeService from "@/services/modules/principe.service";
import GouvernanceService from "@/services/modules/groupe.service";

const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const deleteModalPreview = ref(false);
const successNotification = ref();
const groupe = ref("");
const search = ref("");
const principe = ref([]);
const gouvernances = ref([]);
const deleteData = reactive({});
const saveUpdate = reactive({});
const chargement = ref(false);
const isUpdate = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const formData = reactive({
  nom: "",
  description: "",
});

const message = reactive({
  type: "success",
  message: "",
});

const resultQuery = computed(() => {
  if (search.value) {
    return principe.value.filter((item) => {
      return (
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.nom.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.description.toString().toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.created_at.toLowerCase().includes(v))
      );
    });
  } else {
    // return principe.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return principe.value.slice(startIndex, endIndex);
  }
});

onMounted(function () {
  getData();
  // getGouvernance()
});

const getData = function () {
  PrincipeService.get(route.params.id)
    .then((data) => {
      principe.value = data.data.data;
      groupe.value = principe.value[0].groupe.nom;
    })
    .catch((e) => {
      // disabled()
      // alert(e)
    });
};
const getGouvernance = function () {
  GouvernanceService.getGouvernanceByEntreprise()
    .then((data) => {
      gouvernances.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      // alert(e)
    });
};
function close() {
  formData.nom = "";
  formData.description = "";
  showModal.value = false;
}

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};

const addPrincipe = function () {
  showModal.value = true;
  isUpdate.value = false;
};

function totalPages() {
  return Math.ceil(principe.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
};

const storePrincipe = function () {
  if (chargement.value == false) {
    chargement.value = true;
    formData.gouvernance_id = route.params.id;
    PrincipeService.create(formData)
      .then((data) => {
        message.type = "success";
        message.message = "Nouveaux indicateur créee";
        successNotificationToggle();
        close();
        getData();
        chargement.value = false;
      })
      .catch((error) => {
        chargement.value = false;
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const erreurs = error.response.data.message;
          message.type = "erreur";
          message.message = erreurs;
          successNotificationToggle();
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      });
  }
};

const supprimer = function (index, data) {
  deleteModalPreview.value = true;
  deleteData.id = data.id;
  deleteData.nom = data.nom;
  deleteData.index = index;
};
const deletePrincipe = function () {
  deleteModalPreview.value = false;
  principe.value.splice(principe.value.indexOf(deleteData.index), 1);
  PrincipeService.destroy(deleteData.id)
    .then((data) => {
      message.type = "success";
      message.message = "Operation éffectué avec success";
      successNotificationToggle();
      getData();
    })
    .catch((error) => {
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message;
        message.type = "erreur";
        message.message = erreurs;
        successNotificationToggle();
      } else if (error.request) {
        // Demande effectuée mais aucune réponse n'est reçue du serveur.
        //console.log(error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la demande
      }
    });
};

const modifier = function (index, data) {
  console.log(data.id);

  saveUpdate.nom = data.nom;
  saveUpdate.description = data.description;
  saveUpdate.principe_id = data.id;
  // saveUpdate.gouvernance_id = data.id
  // saveUpdate.groupeNom = data.groupe.nom
  showModal.value = true;
  isUpdate.value = true;
};
const updatePrincipe = function () {
  console.log(saveUpdate.principe_id);

  if (chargement.value == false) {
    chargement.value = true;
    const formData = {
      nom: saveUpdate.nom,
      description: saveUpdate.description,
      principe_id: saveUpdate.principe_id,
    };
    PrincipeService.update(saveUpdate.principe_id, formData)
      .then((data) => {
        chargement.value = false;
        message.type = "success";
        message.message = "Mise à jours éffectué avec succèss";
        successNotificationToggle();
        close();
        getData();
        this.getData();
      })
      .catch((error) => {
        chargement.value = false;
        if (error.response) {
          // Requête effectuée mais le serveur a répondu par une erreur.
          const erreurs = error.response.data.message;
          message.type = "erreur";
          message.message = erreurs;
          successNotificationToggle();
        } else if (error.request) {
          // Demande effectuée mais aucune réponse n'est reçue du serveur.
          //console.log(error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          //console.log('dernier message', error.message);
        }
      });
  }
};

const voirCritere = function (index, id) {
  console.log(id);
  router.push({ name: "Critere", params: { id: id } });
};

const toBack = function () {
  router.go(-1);
};
</script>

<style lang="scss" scoped></style>
