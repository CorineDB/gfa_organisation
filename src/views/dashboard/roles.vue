<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import RoleService from "@/services/modules/roles.permissions.service";
import TypeGouvernance from "@/services/modules/typeGouvernance.service";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";

const payload = reactive({
  nom: "",
  description: "",
  permissions: [],
});

const messageErreur = ref({});
const tabulator = ref();
const idSelect = ref("");
const showModalCreate = ref(false);
const deleteModalPreview = ref(false);
const isLoading = ref(false);
const isLoadingData = ref(true);
const isCreate = ref(true);
const programmes = ref([]);
const permissions = ref([]);
const datas = ref([]);
const searchValue = ref("");

const getInfoUsers = async () => {
  await RoleService.getInfo()
    .then((result) => {
      permissions.value = result.data.data.role[0].permissions;
      // datas.value = result.data.data;
      // isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      // isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  // initTabulator();
};

const createData = async () => {
  isLoading.value = true;
  await RoleService.create(payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
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
const getDatas = async () => {
  isLoadingData.value = true;
  await RoleService.getRole()
    .then((result) => {
      datas.value = result.data.data;
      isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  initTabulator();
};

const getPermissionDatas = async () => {
  //isLoadingData.value = true;
  await RoleService.getPermission()
    .then((result) => {
      permissions.value = result.data.data;
      //isLoadingData.value = false;
    })
    .catch((e) => {
      console.error(e);
      //isLoadingData.value = false;
      toast.error("Une erreur est survenue: Liste des type des options.");
    });
  initTabulator();
};
const updateData = async () => {
  isLoading.value = true;
  await RoleService.update(idSelect.value, payload)
    .then(() => {
      isLoading.value = false;
      getDatas();
      resetForm();
      toast.success("Rôles et permissions modifiée.");
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
const submitData = () => (isCreate.value ? createData() : updateData());
const deleteData = async () => {
  isLoading.value = true;
  await RoleService.destroy(idSelect.value)
    .then(() => {
      deleteModalPreview.value = false;
      isLoading.value = false;
      toast.success("Rôles et permissions supprimée");
      getDatas();
    })
    .catch((e) => {
      isLoading.value = false;

      toast.error("Une erreur est survenue, ressayer");
    });
};
const getProgrammes = () => {
  TypeGouvernance.getAllProgrammes()
    .then((result) => {
      programmes.value = result.data.data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Une erreur est survenue: Liste des Programmes.");
    });
};
const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulatore", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 10,
    columns: [
      {
        title: "Nom",
        field: "nom",
      },
      {
        title: "Permissions",
        field: "permissions",
        formatter: (cell) => {
          const permissions = cell.getValue(); // Récupère le tableau des permissions
          if (!permissions || permissions.length === 0) {
            return "<span>Aucune permission</span>";
          }

          // Générer des badges dynamiques
          return permissions.map((permission) => `<span class="inline-block p-1 text-xs text-white rounded-md bg-primary">${permission.nom}</span>`).join(" ");
        },
        formatterParams: {
          htmlOutput: true, // Active l'insertion HTML dans la cellule
        },
      },
      {
        title: "Date de création",
        field: "created_at",
      },
      {
        title: "Actions",
        field: "actions",
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-center gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };

          const modifyButton = createButton("Modifier", "btn btn-primary text-xs p-1.5", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("Supprimer", "btn btn-danger text-xs p-1.5", () => {
            handleDelete(cell.getData());
          });

          container.append(modifyButton, deleteButton);

          return container;
        },
      },
    ],
  });
};
const handleEdit = (params) => {
  messageErreur.value = {};
  isCreate.value = false;
  idSelect.value = params.id;
  payload.nom = params.nom;
  payload.description = params.description;
  payload.permissions = params.permissions.map((permission) => permission.id);

  console.log("permisions", payload.permissions);
  // payload.programmeId = params.programmeId;
  showModalCreate.value = true;
};
const handleDelete = (params) => {
  idSelect.value = params.id;
  deleteModalPreview.value = true;
};
const cancelSelect = () => {
  deleteModalPreview.value = false;
  idSelect.value = "";
};
const resetForm = () => {
  payload.nom = "";
  payload.description = "";
  payload.permissions = [];
  // payload.programmeId = "";
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // payload.programmeId = "";
  showModalCreate.value = isCreate.value = true;
  messageErreur.value = {};
};

const mode = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));
const applyFilter = () => {
  if (tabulator.value) {
    const query = searchValue.value.toLowerCase();
    tabulator.value.setFilter((data) => {
      return data.nom.toLowerCase().includes(query) || data.created_at.toLowerCase().includes(query);
    });
  }
};
onMounted(() => {
  initTabulator();
  // const usersInfo = JSON.parse(localStorage.getItem("authenticateUser"));
  // if (usersInfo.role) {
  //   permissions.value = usersInfo.role[0].permissions;
  // }
  getDatas();
  // getPermissionDatas();
  getInfoUsers();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Rôles et permissions</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <input type="text" v-model="searchValue" @input="applyFilter" class="w-56 pr-10 form-control box" placeholder="Recherche..." />
          <SearchIcon class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
      <div class="flex">
        <button class="mr-2 shadow-md btn btn-primary" @click="openCreateModal"><PlusIcon class="w-4 h-4 mr-3" />Ajouter un Rôle</button>
      </div>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box">
    <div class="overflow-x-auto scrollbar-hidden" v-show="!isLoadingData">
      <div id="tabulatore" ref="tabulatore" class="mt-5 table-report table-report--tabulator"></div>
    </div>
    <div class="overflow-x-auto scrollbar-hidden" v-if="!isLoadingData">
      <!-- <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Role</th>
            <th class="whitespace-nowrap">Permissions</th>
            <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in datas" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.nom }}</td>
            <td>
              <div class="grid grid-cols-5 gap-1">
                <span v-for="(permission, index) in data.permissions" :key="index" class="p-2 text-xs text-white rounded-md bg-primary">
                  {{ permission.nom }}
                </span>
              </div>
            </td>
            <td>{{ data.created_at }}</td>
            <td class="space-y-3">
              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour modifier">
                <span @click="handleEdit(data)" class="text-blue-500 cursor-pointer">
                  <EditIcon />
                </span>
              </Tippy>
              <Tippy tag="a" href="javascript:;" class="tooltip" content="cliquez pour supprimer">
                <span @click="handleDelete(data)" class="text-red-500 cursor-pointer">
                  <Trash2Icon />
                </span>
              </Tippy>
            </td>
          </tr>
        </tbody>
      </table> -->
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <!-- Modal Register & Update -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="showModalCreate = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ mode }} un Rôle</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Nom" v-model="payload.nom" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

          <div class="my-2">
            <label for="regular-form-2" class="form-label">Description</label>
            <textarea id="regular-form-2" placeholder="Description du role" required v-model="payload.description" class="w-full px-3 py-2 mt-1 border-2 border-gray-300 form-control focus:outline-none focus:ring-2 focus:border-transparent" rows="2"></textarea>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.description">{{ messageErreur.description }}</p>
          </div>
          <!-- <div>
            <label class="form-label">Permissions <span class="text-danger">*</span> </label>
            <TomSelect v-model="payload.permissions" multiple :options="{ placeholder: 'Selectionez  un secteur' }" class="w-full">
              <option value=""></option>
              <option v-for="(permission, index) in permissions" :key="index" :value="permission.id">{{ permission.nom }}</option>
            </TomSelect>
            <div v-if="messageErreur.permissions" class="mt-2 text-danger">{{ messageErreur.permissions }}</div>
          </div> -->
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
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 align-top btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="mode" />
        </div>
      </ModalFooter>
    </form>
  </Modal>
  <!-- End Modal -->

  <!-- Modal Delete -->
  <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Suppression</div>
        <div class="mt-2 text-slate-500">Supprimer cette Rôles et permissions?</div>
      </div>
      <div class="flex justify-center w-full gap-3 py-4 text-center">
        <button type="button" @click="cancelSelect" class="mr-1 btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>
  <!-- End Modal -->
</template>
