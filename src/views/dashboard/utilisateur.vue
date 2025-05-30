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
          <div class="text-3xl mt-5">Vous etes sur supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">Cette operation est irreverssible ? <br />Cliquer sur annuler pour annuler l'operation</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">Annuler</button>
          <button type="button" @click="deleteUser" class="btn btn-danger w-24">Supprimer</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">Ajouter un utilisateur</h2>
      </ModalHeader>
      <form @submit.prevent="storeUser">
        <ModalBody class="p-10">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Nom</label>
              <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control" placeholder="Nom" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
            </div>
            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Prenoms</label>
              <input id="regular-form-1" type="text" required v-model="formData.prenom" class="form-control" placeholder="Prenoms" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.prenom">{{ messageErreur.prenom }}</p>
            </div>

            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Email</label>
              <input id="regular-form-1" type="email" required v-model="formData.email" class="form-control" placeholder="Email" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
            </div>

            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Contact</label>
              <input id="regular-form-1" type="text" required v-model="formData.contact" class="form-control" placeholder="Contact" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p>
            </div>

            <div class="col-span-6">
              <label for="regular-form-1" class="form-label">Poste</label>
              <input id="regular-form-1" type="text" required v-model="formData.poste" class="form-control" placeholder="Poste" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.poste">{{ messageErreur.poste }}</p>
            </div>

            <div class="col-span-6">
              <div class="">
                <label class="form-label">Roles</label>
                <div class="flex w-full">
                  <TomSelect v-model="formData.roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-11/12 pr-3">
                    <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.nom }}</option>
                  </TomSelect>
                  <button @click="openCreateModal" class="btn w-10 h-10 btn-primary mr-1 mb-2">
                    <PlusIcon class="w-5 h-5" />
                  </button>
                </div>

                <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.roles">{{ messageErreur.roles }}</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="flex gap-2">
            <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
            <VButton :loading="isLoading" label="Ajouter" />
          </div>
        </ModalFooter>
      </form>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class="flex justify-between">
      <div class="search hidden sm:block">
        <input type="text" class="search__input form-control border-transparent" v-model="searchs" placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      <div class="flex items-center space-x-2">
        <button @click="addUsers" class="btn btn-primary flex space-x-2 items-center">
          <PlusSquareIcon />
          <span class="uppercase font-semibold"> ajouter</span>
        </button>
        <DownloadPDFButton :tableIds="['userOIN']" pageName="Utilisateurs" format="a4" />
      </div>
    </div>
    <!-- END: Modal Toggle -->

    <div class="overflow-x-auto mt-5">
      <table id="userOIN" class="table mt-5">
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
            <th class="whitespace-nowrap">Actions</th>
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
                <span v-for="(role, index) in data.roles" :key="index" class="bg-primary text-white rounded-md px-2 py-1 text-xs">
                  {{ role.nom }}
                </span>
              </div>
            </td>

            <td>{{ data.created_at }}</td>
            <!-- v-if="$h.getPermission('write.utilisateur')" -->
            <td class="flex space-x-2 items-center">
              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour modifier">
                <span @click="openUpdateModal(data)" class="text-blue-500 cursor-pointer">
                  <EditIcon />
                </span>
              </Tippy>

              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour modifier">
                <Trash2Icon class="text-red-500 cursor-pointer" @click="supprimer(index, data)" />
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

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Ajouter un Rôle</h2>
    </ModalHeader>
    <form @submit.prevent="createData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.nom" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

          <div class="my-2">
            <label for="regular-form-2" class="form-label">Description</label>
            <textarea id="regular-form-2" placeholder="Description du role" required v-model="payload.description" class="w-full px-3 py-2 mt-1 border-2 border-gray-300 form-control focus:outline-none focus:ring-2 focus:border-transparent" rows="2"></textarea>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.description">{{ messageErreur.description }}</p>
          </div>

          <div class="w-full">
            <div class="flex w-full">
              <v-select :reduce="(projet) => projet.id" class="w-full" v-model="payload.permissions" multiple label="nom" :options="permissions">
                <template #search="{ attributes, events }">
                  <input class="vs__search form-input" :required="!payload.permissions" v-bind="attributes" v-on="events" />
                </template>
              </v-select>
              <label class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Permissions <span class="text-danger">*</span> </label>
            </div>
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.permissions">{{ messageErreur.permissions }}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetRoleForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <Modal backdrop="static" size="modal-xl" :show="updateModal" @hidden="updateModal = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">Modifier un utilisateur</h2>
    </ModalHeader>
    <form @submit.prevent="submitUpdateData">
      <ModalBody>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formEdit.nom" class="form-control" placeholder="Nom" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
          </div>
          <div>
            <label for="regular-form-1" class="form-label">Prenoms</label>
            <input id="regular-form-1" type="text" required v-model="formEdit.prenom" class="form-control" placeholder="Prenoms" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.prenom">{{ messageErreur.prenom }}</p>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Email</label>
            <input id="regular-form-1" type="email" required v-model="formEdit.email" class="form-control" placeholder="Email" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Contact</label>
            <input id="regular-form-1" type="number" v-model="formEdit.contact" class="form-control" placeholder="Contact" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p>
          </div>

          <div>
            <label for="regular-form-1" class="form-label">Poste</label>
            <input id="regular-form-1" type="text" v-model="formEdit.poste" class="form-control" placeholder="Poste" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.poste">{{ messageErreur.poste }}</p>
          </div>

          <div class="">
            <label class="form-label">Roles</label>
            <TomSelect v-model="formEdit.roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-full">
              <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.nom }}</option>
            </TomSelect>
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.roles">{{ messageErreur.roles }}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" label="Modifier" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from "vue";
import UsersService from "../../services/modules/user.service";
import RoleService from "@/services/modules/roles.permissions.service";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import DownloadPDFButton from "@/components/DownloadPDFButton.vue";

// Modfier un utilisateur
const updateModal = ref(false);

const formEdit = reactive({
  nom: "",
  prenom: "",
  email: "",
  contact: "",
  poste: "",
  roles: [],
});

const showModalCreate = ref(false);
const payload = reactive({
  nom: "",
  description: "",
  permissions: [],
});

const resetRoleForm = () => {
  payload.nom = "";
  payload.description = "";
  payload.permissions = [];

  showModalCreate.value = false;
};

const permissions = ref([]);

const getInfoUsers = async () => {
  await RoleService.getInfo()
    .then((result) => {
      permissions.value = result.data.data.role[0].permissions;
    })
    .catch((e) => {
      console.error(e);

      toast.error("Une erreur est survenue: Liste des type des options.");
    });
};

const createData = async () => {
  isLoading.value = true;
  await RoleService.create(payload)
    .then(() => {
      isLoading.value = false;
      getRole();
      resetRoleForm();
      toast.success("Rôles et permissions créer.");
    })
    .catch((e) => {
      isLoading.value = false;
      console.error(e);
      toast.error("Vérifier les informations et ressayer.");
      if (e.response && e.response.data && e.response.data.errors) {
        messageErreur.value = e.response.data.errors;
      } else {
        toast.error("Une erreur inconnue s'est produite");
      }
    });
};

const openCreateModal = () => {
  // payload.programmeId = "";
  showModalCreate.value = true;
  messageErreur.value = {};
};

const userId = ref([]);

const messageErreur = ref({});

const openUpdateModal = function (data) {
  messageErreur.value = {};
  console.log(data);
  updateModal.value = true;
  formEdit.nom = data.nom;
  formEdit.prenom = data.prenom;
  formEdit.contact = data.contact;
  formEdit.email = data.email;
  formEdit.poste = data.poste;
  userId.value = data.id;
  console.log("role.id", data.roles[0].id);
  formEdit.roles = data.roles.map((role) => role.id);
};

const resetForm = () => {
  formEdit.nom = "";
  formEdit.prenom = "";
  formEdit.contact = "";
  formEdit.email = "";
  formEdit.poste = "";
  formEdit.roles = [];

  updateModal.value = false;
  showModal.value = false;
};

const isLoading = ref(false);

const submitUpdateData = function () {
  isLoading.value = true;
  console.log(formData);
  UsersService.update(userId.value, formEdit)
    .then((data) => {
      toast.success("Utilisateur modifié avec succès");
      resetForm();
      getData();
      isLoading.value = false;
    })
    .catch((error) => {
      isLoading.value = false;
      toast.error("Une erreur est survenue");

      if (error.response && error.response.data && error.response.data.errors) {
        messageErreur.value = error.response.data.errors;
      } else {
        toast.error("Une erreur inconnue s'est produite");
      }
    });
};

const showModal = ref(false);
const deleteModalPreview = ref(false);
const successNotification = ref();
const searchs = ref("");
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
  if (searchs.value) {
    return users.value.filter((item) => {
      return (
        searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.nom.toLowerCase().includes(v)) ||
        searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.prenom.toLowerCase().includes(v)) ||
        searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.email.toLowerCase().includes(v)) ||
        searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.poste.toLowerCase().includes(v)) ||
        searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.contact.toLowerCase().includes(v)) ||
        searchs.value
          .toLowerCase()
          .split(" ")
          .every((v) => item.role.nom.toLowerCase().includes(v)) ||
        //searchs.value.toLowerCase().split(' ').every(v => item.entreprise.nom.toLowerCase().includes(v)) ||
        searchs.value
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
  getInfoUsers();
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
  messageErreur.value = {};
  showModal.value = true;
  isUpdate.value = false;
};

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
        console.log(error);
        chargement.value = false;
        toast.error("Vérifier les informations et ressayer.");
        if (error.response && error.response.data && error.response.data.errors) {
          messageErreur.value = error.response.data.errors;
        } else {
          toast.error("Une erreur inconnue s'est produite");
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
