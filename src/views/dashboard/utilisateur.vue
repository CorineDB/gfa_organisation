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
          <!-- <button type="button" @click="deleteUser" class="btn btn-danger w-24">Supprimer</button> -->
          <VButton :loading="isLoading" label="Supprimer" class="btn btn-danger w-24" @click="deleteUser" />
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
              <label for="nom" class="form-label">Nom</label>
              <input id="nom" name="nom" type="text" required v-model="formData.nom" class="form-control" placeholder="Nom" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
            </div>
            <div class="col-span-6">
              <label for="prenom" class="form-label">Prenoms</label>
              <input id="prenom" name="prenom" type="text" required v-model="formData.prenom" class="form-control" placeholder="Prenoms" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.prenom">{{ messageErreur.prenom }}</p>
            </div>

            <div class="col-span-6">
              <label for="email" class="form-label">Email</label>
              <input id="email" name="email" type="email" required v-model="formData.email" class="form-control" placeholder="Email" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
            </div>

            <div class="col-span-6">
              <!-- <label for="contact" class="form-label">Contact</label>
              <input id="contact" name="contact" type="text" required v-model="formData.contact" class="form-control" placeholder="Contact" /> -->
              <InputForm class="" type="text" label="Contact" maxlength="13" v-model="formData.contact" :control="messageErreur.contact && messageErreur.contact.join(', ')" />
              <p class="text-xs text-primary mt-3">Ecrivez le numéro directement sans espace ni de signe + (Ex : 22977887787)</p>
              
              <!-- Message de validation avec animation -->
              <div class="mt-2 _min-h-[1.5rem]">
                <p v-if="isValidCreate" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Numéro valide
                </p>
                <p v-else-if="formData.contact && String(formData.contact).length > 0" class="flex items-center text-red-500 font-medium text-sm">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Numéro invalide
                </p>
              </div>
              <!-- <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p> -->
            </div>

            <div class="col-span-6">
              <label for="poste" class="form-label">Poste</label>
              <input id="poste" name="poste" type="text" required v-model="formData.poste" class="form-control" placeholder="Poste" />
              <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.poste">{{ messageErreur.poste }}</p>
            </div>

            <div class="col-span-6">
              <div class="">
                <label for="roles" class="form-label">Roles</label>
                <div class="flex w-full">
                  <TomSelect v-model="formData.roles" id="roles" name="roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-11/12 pr-3">
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

    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm mt-5 bg-white">
      <table id="userOIN" class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
            <th class="px-6 py-4 whitespace-nowrap">#</th>
            <th class="px-6 py-4 whitespace-nowrap">Nom & Prénoms</th>
            <th class="px-6 py-4 whitespace-nowrap">Contact</th>
            <th class="px-6 py-4 whitespace-nowrap">Poste</th>
            <th class="px-6 py-4 whitespace-nowrap">Rôles</th>
            <th class="px-6 py-4 whitespace-nowrap">Date création</th>
            <th class="px-6 py-4 whitespace-nowrap text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(data, index) in resultQuery" :key="index" class="hover:bg-gray-50/80 transition-colors duration-200">
            <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">{{ data.nom }} {{ data.prenom }}</span>
                <span class="text-xs text-gray-500">{{ data.email }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ data.contact }}</td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="data.poste ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500 italic'"
              >
                {{ data.poste ?? "Non défini" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="(role, index) in data.roles" :key="index" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  {{ role.nom }}
                </span>
                <span v-if="!data.roles || data.roles.length === 0" class="text-xs text-gray-400 italic">Aucun rôle</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ new Date(data.created_at).toLocaleDateString() }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-3">
                <Tippy tag="button" content="Modifier" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none">
                  <EditIcon class="w-4 h-4" @click="openUpdateModal(data)" />
                </Tippy>
                <Tippy tag="button" content="Supprimer" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none">
                  <Trash2Icon class="w-4 h-4" @click="supprimer(index, data)" />
                </Tippy>
              </div>
            </td>
          </tr>
          <tr v-if="resultQuery.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center justify-center">
                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="text-lg font-medium">Aucun utilisateur trouvé</p>
                <p class="text-sm text-gray-400">Essayez d'ajouter un nouvel utilisateur</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Moderne -->
    <div class="flex items-center justify-between mt-6 px-2" v-if="totalPages() > 1">
      <div class="text-sm text-gray-500">
        Affichage de <span class="font-medium text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> à <span class="font-medium text-gray-900">{{ Math.min(currentPage * itemsPerPage, users.length) }}</span> sur <span class="font-medium text-gray-900">{{ users.length }}</span> résultats
      </div>
      
      <div class="flex items-center gap-1">
        <button 
          class="p-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <template v-if="totalPages() <= 7">
          <button 
            v-for="pageNumber in totalPages()" 
            :key="pageNumber" 
            @click="goToPage(pageNumber)"
            class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors"
            :class="pageNumber === currentPage ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'"
          >
            {{ pageNumber }}
          </button>
        </template>
        
        <template v-else>
          <!-- Logique de pagination complexe (inchangée mais stylisée) -->
          <template v-if="currentPage <= 4">
            <button v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors" :class="pageNumber === currentPage ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'">{{ pageNumber }}</button>
            <span class="px-2 text-gray-400">...</span>
            <button @click="goToPage(totalPages())" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">{{ totalPages() }}</button>
          </template>
          
          <template v-else-if="currentPage >= totalPages() - 3">
            <button @click="goToPage(1)" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">1</button>
            <span class="px-2 text-gray-400">...</span>
            <button v-for="pageNumber in 5" :key="pageNumber" @click="goToPage(pageNumber)" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors" :class="pageNumber === currentPage ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'">{{ pageNumber }}</button>
            <span class="px-2 text-gray-400">...</span>
            <button v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber" @click="goToPage(pageNumber)" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors" :class="pageNumber === currentPage ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'">{{ pageNumber }}</button>
          </template>
          
          <template v-else>
            <button @click="goToPage(1)" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">1</button>
            <span class="px-2 text-gray-400">...</span>
            <button v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber" @click="goToPage(pageNumber)" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors" :class="pageNumber === currentPage ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'">{{ pageNumber }}</button>
            <span class="px-2 text-gray-400">...</span>
            <button @click="goToPage(totalPages())" class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">{{ totalPages() }}</button>
          </template>
        </template>

        <button 
          class="p-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="currentPage === totalPages()" 
          @click="currentPage++"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
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
          <InputForm id="role_nom" name="role_nom" label="Nom" v-model="payload.nom" />
          <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>

          <div class="my-2">
            <label for="role_description" class="form-label">Description</label>
            <textarea id="role_description" name="role_description" placeholder="Description du role" required v-model="payload.description" class="w-full px-3 py-2 mt-1 border-2 border-gray-300 form-control focus:outline-none focus:ring-2 focus:border-transparent" rows="2"></textarea>
            <p class="text-red-500 text-[12px] -mt-2 col-span-12" v-if="messageErreur.description">{{ messageErreur.description }}</p>
          </div>

          <div class="w-full">
            <div class="flex w-full">
              <v-select :reduce="(projet) => projet.id" class="w-full" v-model="payload.permissions" multiple label="nom" :options="permissions">
                <template #search="{ attributes, events }">
                  <input class="vs__search form-input" id="permissions" name="permissions" :required="!payload.permissions" v-bind="attributes" v-on="events" />
                </template>
              </v-select>
              <label for="permissions" class="absolute z-10 px-3 ml-1 text-sm font-medium duration-100 ease-linear -translate-y-3 bg-white form-label peer-placeholder-shown:translate-y-2 peer-placeholder-shown:px-0 peer-placeholder-shown:text-slate-400 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:font-medium peer-focus:text-primary peer-focus:text-sm">Permissions <span class="text-danger">*</span> </label>
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
            <label for="edit_nom" class="form-label">Nom</label>
            <input id="edit_nom" name="edit_nom" type="text" required v-model="formEdit.nom" class="form-control" placeholder="Nom" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.nom">{{ messageErreur.nom }}</p>
          </div>
          <div>
            <label for="edit_prenom" class="form-label">Prenoms</label>
            <input id="edit_prenom" name="edit_prenom" type="text" required v-model="formEdit.prenom" class="form-control" placeholder="Prenoms" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.prenom">{{ messageErreur.prenom }}</p>
          </div>

          <div>
            <label for="edit_email" class="form-label">Email</label>
            <input id="edit_email" name="edit_email" type="email" required v-model="formEdit.email" class="form-control" placeholder="Email" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.email">{{ messageErreur.email }}</p>
          </div>

          <div>
            <!-- <label for="edit_contact" class="form-label">Contact</label>
            <input id="edit_contact" name="edit_contact" type="number" v-model="formEdit.contact" class="form-control" placeholder="Contact" /> -->
            <InputForm class="" type="text" label="Contact" maxlength="13" v-model="formEdit.contact" :control="messageErreur.contact && messageErreur.contact.join(', ')" />
            <p class="text-xs text-primary mt-3">Ecrivez le numéro directement sans espace ni de signe + (Ex : 22977887787)</p>
            
            <!-- Message de validation avec animation -->
            <div class="mt-2 _min-h-[1.5rem]">
              <p v-if="isValidEdit" class="flex items-center text-green-600 font-medium text-sm animate-pulse">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Numéro valide
              </p>
              <p v-else-if="formEdit.contact && String(formEdit.contact).length > 0" class="flex items-center text-red-500 font-medium text-sm">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Numéro invalide
              </p>
            </div>
            <!-- <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.contact">{{ messageErreur.contact }}</p> -->
          </div>

          <div>
            <label for="edit_poste" class="form-label">Poste</label>
            <input id="edit_poste" name="edit_poste" type="text" v-model="formEdit.poste" class="form-control" placeholder="Poste" />
            <p class="text-red-500 text-[12px] mt-2 col-span-12" v-if="messageErreur.poste">{{ messageErreur.poste }}</p>
          </div>

          <div class="">
            <label for="edit_roles" class="form-label">Roles</label>
            <TomSelect v-model="formEdit.roles" id="edit_roles" name="edit_roles" multiple :options="{ placeholder: 'Selectionez les roles' }" class="w-full">
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
import { ref, reactive, onMounted, provide, computed, getCurrentInstance } from "vue";
import UsersService from "../../services/modules/user.service";
import RoleService from "@/services/modules/roles.permissions.service";
import { helper as $h } from "@/utils/helper";
import { toast } from "vue3-toastify";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import DownloadPDFButton from "@/components/DownloadPDFButton.vue";

// Validation du téléphone
const { proxy } = getCurrentInstance();

const isValidEdit = computed(() => {
  // Convertir en chaîne et supprimer les espaces
  const contactValue = formEdit.contact ? String(formEdit.contact).trim() : "";
  
  // Vérifier que le contact n'est pas vide
  if (!contactValue) {
    return false;
  }
  
  // Vérifier que le contact contient entre 8 et 13 chiffres
  if (!/^\d{8,13}$/.test(contactValue)) {
    return false;
  }
  
  // Vérifier avec libphonenumber-js pour le format du pays (BJ = Bénin)
  return proxy.$isValidPhoneNumber(contactValue, "BJ");
});

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
// const chargement = ref(false); // Supprimé car remplacé par isLoading
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

// Validation du téléphone (Création)
const isValidCreate = computed(() => {
  const contactValue = formData.contact ? String(formData.contact).trim() : "";
  if (!contactValue) return false;
  if (!/^\d{8,13}$/.test(contactValue)) return false;
  return proxy.$isValidPhoneNumber(contactValue, "BJ");
});

const storeUser = function () {
  if (isLoading.value == false) {
    isLoading.value = true;
    console.log(formData);
    UsersService.addUsers(formData)
      .then((data) => {
        message.type = "success";
        message.message = "Nouveau utilisateur";
        successNotificationToggle();
        close();
        getData();
        isLoading.value = false;
      })
      .catch((error) => {
        console.log(error);
        isLoading.value = false;
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
  // deleteModalPreview.value = false; // On garde le modal ouvert pendant le chargement
  isLoading.value = true;
  
  // On ne supprime pas localement avant la confirmation du serveur pour éviter les désynchronisations
  // users.value.splice(users.value.indexOf(deleteData.index), 1); <-- Cette ligne était incorrecte de toute façon

  UsersService.destroy(deleteData.id)
    .then((data) => {
      toast.success("Utilisateur supprimé avec succès");
      getData(); // Rafraîchir la liste depuis le serveur
      isLoading.value = false;
      deleteModalPreview.value = false; // Fermer le modal après succès
    })
    .catch((error) => {
      console.error(error);
      isLoading.value = false;
      deleteModalPreview.value = false; // Fermer le modal même en cas d'erreur ou le laisser ouvert ?
      if (error.response) {
        toast.error(error.response.data.message || "Erreur lors de la suppression");
      } else {
        toast.error("Une erreur est survenue lors de la suppression");
      }
    });
};
</script>

<style lang="scss" scoped></style>
