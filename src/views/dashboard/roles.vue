<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
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
          <div class="mt-5 text-3xl">Vous etes sur de supprimer {{ deleteData.nom }} ?</div>
          <div class="mt-2 text-slate-500">Cette operation est irreverssible ? <br />Cliquer sur annuler pour annuler l'operation</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="w-24 mr-1 btn btn-outline-secondary">Annuler</button>
          <button type="button" @click="deleteRole" class="w-24 btn btn-danger">Supprimer</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeRole">
          <div>
            <label for="regular-form-1" class="form-label">Nom<span class="text-danger">*</span> </label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="Libellé du role" />
          </div>
          <div class="my-2">
            <label for="regular-form-2" class="form-label">Description</label>
            <textarea id="regular-form-2" placeholder="Description du role" v-model="formData.description" required class="w-full px-3 py-2 mt-1 border-2 border-gray-300 form-control focus:outline-none focus:ring-2 focus:border-transparent" rows="2"></textarea>
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Permissions<span class="text-danger">*</span> </label>
            <TomSelect v-model="formData.permissions" multiple :options="{ placeholder: 'Selectionez une permissions' }" class="w-full">
              <option v-for="(permission, index) in permissions" :key="index" :value="permission.id">{{ permission.nom }}</option>
            </TomSelect>
          </div>
          <button class="w-full px-4 py-3 my-3 align-top btn btn-primary xl:mr-3">
            <span class="text-sm font-semibold uppercase" v-if="!chargement"> Ajouter </span>
            <span v-else class="flex items-center justify-center space-x-2">
              <span class="px-4 font-semibold"> chargement ... </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>

        <form v-else key="modifier" @submit.prevent="updateRole">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control" placeholder="Libellé du role" />
          </div>
          <div>
            <label for="regular-form-2" class="form-label">Description</label>
            <textarea id="regular-form-2" placeholder="Description du role" v-model="saveUpdate.description" required class="w-full px-3 py-2 mt-1 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent" rows="3"></textarea>
          </div>

          <div class="my-2">
            <label for="regular-form-1" class="form-label">Permissions </label>
            <TomSelect v-model="saveUpdate.permissions" multiple :options="{ placeholder: 'Selectionez une permissions' }" class="w-full">
              <option v-for="(permission, index) in permissions" :key="index" :value="permission.id">{{ permission.nom }}</option>
            </TomSelect>
          </div>
          <button class="w-full px-4 py-3 my-3 align-top btn btn-primary xl:mr-3">
            <span class="text-sm font-semibold uppercase" v-if="!chargement"> modifier </span>
            <span v-else class="flex items-center justify-center space-x-2">
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
      <button @click="addRole" class="flex items-center space-x-2 btn btn-primary">
        <PlusSquareIcon />
        <span class="font-semibold uppercase"> ajouter</span>
      </button>
      <div class="hidden search sm:block">
        <input type="text" class="border-transparent search__input form-control" v-model="search" placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
    </div>
    <!-- END: Modal Toggle -->
    <div class="mt-5 overflow-x-auto">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Role</th>
            <th class="whitespace-nowrap">Permissions</th>
            <th class="whitespace-nowrap">Date creation</th>
            <th v-if="$h.getPermission('write.role')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in resultQuery" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.nom }}</td>
            <td>
              <div class="grid grid-cols-5 gap-1">
                <span v-for="(permission, index) in data.permissions" class="p-2 text-xs text-white rounded-md bg-primary">
                  {{ permission.nom }}
                </span>
              </div>
            </td>
            <td>{{ data.created_at }}</td>
            <td v-if="$h.getPermission('write.role')" class="space-y-3">
              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour modifier">
                <span @click="modifier(index, data)" class="text-blue-500 cursor-pointer">
                  <EditIcon />
                </span>
              </Tippy>
              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour supprimer">
                <span @click="supprimer(index, data)" class="text-red-500 cursor-pointer">
                  <Trash2Icon />
                </span>
              </Tippy>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-center mt-4" v-if="totalPages() > 1">
      <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-l-md focus:outline-none" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <template v-if="totalPages() <= 7">
        <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in totalPages()" :key="pageNumber" @click="goToPage(pageNumber)">
          {{ pageNumber }}
        </button>
      </template>
      <template v-else>
        <template v-if="currentPage <= 4">
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
          <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
            {{ totalPages() }}
          </button>
        </template>
        <template v-else-if="currentPage >= totalPages() - 3">
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">1</button>
          <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
          <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber" @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
        </template>
        <template v-else>
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">1</button>
          <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber" @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
          <span class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md">...</span>
          <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none" :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
            {{ totalPages() }}
          </button>
        </template>
      </template>
      <button class="px-4 py-2 m-1 text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-r-md focus:outline-none" :disabled="currentPage === totalPages()" @click="currentPage++">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from "vue";
import RoleService from "@/services/modules/roles.permissions.service";
import { helper as $h } from "@/utils/helper";

const showModal = ref(false);
const deleteModalPreview = ref(false);
const successNotification = ref();
const search = ref("");
const roles = ref([]);
const permissions = ref([]);
const deleteData = reactive({});
const saveUpdate = reactive({});
const chargement = ref(false);
const isUpdate = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const formData = reactive({
  nom: "",
  description: "",
  permissions: [],
});

const message = reactive({
  type: "success",
  message: "",
});

const resultQuery = computed(() => {
  if (search.value) {
    return roles.value.filter((item) => {
      return (
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.nom.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.created_at.toLowerCase().includes(v))
      );
    });
  } else {
    // return roles.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return roles.value.slice(startIndex, endIndex);
  }
});

onMounted(function () {
  /* if (!$h.getPermission('read.role')) {
   // router.push('/error-page')
  } */

  const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));
  if (usersInfo.role) {
    permissions.value = usersInfo.role[0].permissions;
  }
  getData();
});

const getData = function () {
  RoleService.getRole()
    .then((data) => {
      roles.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      alert(e);
    });
};

function close() {
  formData.nom = "";
  formData.description = "";
  formData.permissions = [];
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

const addRole = function () {
  showModal.value = true;
  isUpdate.value = false;
};

const storeRole = function () {
  if (chargement.value == false) {
    chargement.value = true;
    RoleService.create(formData)
      .then((data) => {
        message.type = "success";
        message.message = "Nouveau role ajouté";
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

function totalPages() {
  return Math.ceil(roles.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
};

const supprimer = function (index, data) {
  deleteModalPreview.value = true;
  deleteData.id = data.id;
  deleteData.nom = data.nom;
  deleteData.description = data.description;
  deleteData.index = index;
};
const deleteRole = function () {
  deleteModalPreview.value = false;
  roles.value.splice(roles.value.indexOf(deleteData.index), 1);
  RoleService.destroy(deleteData.id)
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
  saveUpdate.nom = data.nom;
  saveUpdate.description = data.description;
  saveUpdate.id = data.id;
  saveUpdate.permissions = [];
  data.permissions.forEach((data) => {
    saveUpdate.permissions.push(data.id);
  });

  showModal.value = true;
  isUpdate.value = true;
};
const updateRole = function () {
  if (chargement.value == false) {
    chargement.value = true;
    const formData = {
      nom: saveUpdate.nom,
      description: saveUpdate.description,
      permissions: saveUpdate.permissions,
    };
    RoleService.update(saveUpdate.id, formData)
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
</script>

<style lang="scss" scoped></style>
