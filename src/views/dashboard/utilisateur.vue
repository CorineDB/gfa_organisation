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
          <div class="mt-5 text-3xl">Vous etes sur supprimer {{ deleteData.nom }} ?</div>
          <div class="mt-2 text-slate-500">Cette operation est irreverssible ? <br />Cliquer sur annuler pour annuler l'operation</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="w-24 mr-1 btn btn-outline-secondary">Annuler</button>
          <button type="button" @click="deleteUser" class="w-24 btn btn-danger">Supprimer</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Content -->
    <Modal size="modal-xl" :show="showModal" @hidden="close">
      <ModalBody class="p-10">
        <form @submit.prevent="storeUser">
          <div class="grid grid-cols-2 gap-4">
            <!-- <div>
              <label for="regular-form-1" class="form-label">Nom entreprise</label>
              <input id="regular-form-1" type="text" required v-model="formData.entrepriseNom" class="form-control" placeholder="Nom de l'entreprise" />
            </div> -->
            <div>
              <label for="regular-form-1" class="form-label">Nom</label>
              <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="Nom" />
            </div>
            <div>
              <label for="regular-form-1" class="form-label">Prenoms</label>
              <input id="regular-form-1" type="text" required v-model="formData.prenom" class="form-control" placeholder="Prenoms" />
            </div>
            <!-- <div>
              <label for="regular-form-1" class="form-label">Contact</label>
              <input id="regular-form-1" type="number" required v-model="formData.entrepriseContact" class="form-control" placeholder="Contact" />
            </div> -->
            <div>
              <label for="regular-form-1" class="form-label">Email</label>
              <input id="regular-form-1" type="email" required v-model="formData.email" class="form-control" placeholder="Email" />
            </div>

            <div>
              <label for="regular-form-1" class="form-label">Contact</label>
              <input id="regular-form-1" type="number" v-model="formData.contact" class="form-control" placeholder="Contact" />
            </div>

            <div>
              <label for="regular-form-1" class="form-label">Poste</label>
              <input id="regular-form-1" type="text" v-model="formData.poste" class="form-control" placeholder="Poste" />
            </div>

            <div class="">
              <label class="form-label">Roles</label>
              <TomSelect v-model="formData.roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-full">
                <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.nom }}</option>
              </TomSelect>
            </div>
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
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class="flex justify-between">
      <button @click="addUsers" class="flex items-center space-x-2 btn btn-primary">
        <PlusSquareIcon />
        <span class="font-semibold uppercase"> ajouter</span>
      </button>
      <div class="hidden search sm:block">
        <input type="text" class="border-transparent search__input form-control" v-model="search" placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
    </div>
    <!-- END: Modal Toggle -->
    <!--  <div class="mt-5 overflow-x-auto">
      <table class="table mt-5">
          <thead class="table-light">
              <tr>
                <th class="whitespace-nowrap">#</th>
                <th class="whitespace-nowrap">Nom</th>
                <th class="whitespace-nowrap">Prenoms </th>
                <th class="whitespace-nowrap">Entreprise </th>
                <th class="whitespace-nowrap">Email </th>
                <th class="whitespace-nowrap">Contact </th>
                <th class="whitespace-nowrap">Date creation</th>
                <th class="whitespace-nowrap">Date mise à jours</th>
                <th class="whitespace-nowrap">Actions</th>
              </tr>
          </thead>
          <tbody>
            
            <tr v-for="(data , index) in resultQuery " :key="index">
              <td> {{ index +1 }} </td>
              <td>{{data.nom}}</td>
              <td>{{data.prenom}}</td>
              <td> 
                <span v-if="data.entreprise !=null" key="entreprise">{{data.entreprise.nom }}</span>
                <span v-else key="non entreprise"> Pas d'entreprise </span>
              </td>
              <td>{{data.email}}</td>
              <td> 
                <span v-if="data.entreprise !=null" key="entreprise">{{data.entreprise.contact }}</span>
                <span v-else key="non entreprise"> Pas de contact </span>
              </td>
              <td> {{data.created_at}} </td>
              <td> {{data.updated_at}}</td>
              <td class="flex items-center space-x-2">

                <Tippy 
                  tag="a" 
                  href="javascript:;" 
                  class="tooltip " 
                  content="cliquez pour modifier"> 
                  <span @click="supprimer(index,data.id)" class="text-red-500 cursor-pointer"><Trash2Icon /></span>
                </Tippy>
              </td>
            </tr>
          </tbody>
      </table>
    </div> -->

    <div v-if="resultQuery.length > 0" class="mt-5 overflow-x-auto">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Nom</th>
            <th class="whitespace-nowrap">Prenoms</th>
            <th class="whitespace-nowrap">Email</th>
            <th class="whitespace-nowrap">Contact</th>
            <th class="whitespace-nowrap">Poste</th>
            <th class="whitespace-nowrap">Type utilisateur</th>
            <th class="whitespace-nowrap">Date creation</th>
            <th v-if="$h.getPermission('write.utilisateur')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in resultQuery" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.nom }}</td>
            <td>{{ data.prenom }}</td>

            <td>{{ data.email }}</td>
            <td>{{ data.contact }}</td>
            <td :class="data.poste ? 'text-black' : 'text-red-500'" :style="{ color: data.poste ? '#000000' : '#a9aaad', fontStyle: data.poste ? 'normal' : 'italic' }">{{ data.poste ?? "Non défini" }}</td>
            <td>
              <div class="flex flex-wrap gap-1">
                <span v-for="(role, index) in data.roles" class="px-2 py-1 text-xs text-white rounded-md bg-primary">
                  {{ role.nom }}
                </span>
              </div>
            </td>

            <td>{{ data.created_at }}</td>
            <td v-if="$h.getPermission('write.utilisateur')" class="flex items-center space-x-2">
              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour modifier">
                <span @click="modifier(index, data)" class="text-blue-500 cursor-pointer">
                  <EditIcon />
                </span>
              </Tippy>

              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour modifier">
                <span @click="supprimer(index, data)" class="text-red-500 cursor-pointer">
                  <Trash2Icon />
                </span>
              </Tippy>
            </td>
          </tr>
        </tbody>
      </table>
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
    <div v-else class="flex justify-center w-full my-5 text-base">Aucune données disponible</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from "vue";
import UsersService from "../../services/modules/user.service";
import RoleService from "@/services/modules/roles.permissions.service";
import { helper as $h } from "@/utils/helper";

const showModal = ref(false);
const deleteModalPreview = ref(false);
const successNotification = ref();
const search = ref("");
const users = ref([]);
const roles = ref([]);
const deleteData = reactive({});
const saveUpdate = reactive({});
const chargement = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isUpdate = ref(false);
/* const formData = reactive({
  nom:'',
  prenom:'',
  password:'demo1234',
  email:'',
  entrepriseNom:'',
  entrepriseContact:''
}) */

const formData = reactive({
  nom: "",
  prenom: "",
  password: "demo1234",
  email: "@gmail.com",
  contact: "",
  poste: "",
  roles: [],
});

const message = reactive({
  type: "success",
  message: "",
});

const resultQuery = computed(() => {
  if (search.value) {
    return users.value.filter((item) => {
      return (
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.nom.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.prenom.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.email.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.poste.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.contact.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.role.nom.toLowerCase().includes(v)) ||
        //search.value.toLowerCase().split(' ').every(v => item.entreprise.nom.toLowerCase().includes(v)) ||
        search.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.created_at.toLowerCase().includes(v))
      );
    });
  } else {
    // return users.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return users.value.slice(startIndex, endIndex);
  }
});

onMounted(function () {
  if (!$h.getPermission("read.utilisateur")) {
    //router.push('/error-page')
  }
  getData();
  getRole();
});

const getRole = function () {
  RoleService.getRole()
    .then((data) => {
      roles.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      alert(e);
    });
};

const getData = function () {
  UsersService.get()
    .then((data) => {
      users.value = data.data.data;
    })
    .catch((e) => {
      // disabled()
      alert(e);
    });
};

function totalPages() {
  return Math.ceil(users.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
};
function close() {
  formData.nom = "";
  (formData.prenom = ""), (formData.contact = ""), (formData.poste = ""), (formData.email = "@gmail.com"), (formData.roles = []);
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

const addUsers = function () {
  showModal.value = true;
  isUpdate.value = false;
};

/* 
  const storeUser = function() {
    if(chargement.value == false) {
      chargement.value = true
      UsersService.create(formData).then((data) => {
        message.type = 'success'
        message.message = 'Nouveau utilisateur'
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
            message.message =  erreurs
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
  } */

const storeUser = function () {
  if (chargement.value == false) {
    chargement.value = true;
    console.log(formData);
    UsersService.addUsers(formData)
      .then((data) => {
        message.type = "success";
        message.message = "Nouveau utilisateur";
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
  deleteData.prenom = data.prenom;
  deleteData.poste = data.poste;
  deleteData.email = data.email;
  deleteData.contact = data.contact;
  deleteData.index = index;
};

const deleteUser = function () {
  deleteModalPreview.value = false;
  users.value.splice(users.value.indexOf(deleteData.index), 1);
  UsersService.destroy(deleteData.id)
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
</script>

<style lang="scss" scoped></style>
