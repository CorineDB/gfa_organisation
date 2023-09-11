<template>
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
  <div class="intro-y flex items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Mettre à jour son profil</h2>
  </div>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: Profile Menu -->
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3 flex lg:block flex-col-reverse">
      <div class="intro-y box mt-5">
        <div class="relative flex items-center p-5">
          <div class="w-12 h-12 image-fit">
            <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="usersProfileImage" />
          </div>
          <div class="ml-4 mr-auto">
            <div class="font-medium text-base">
              {{ currentUsers.nom }} {{ currentUsers.prenom }}
            </div>
            <div class="text-slate-500">{{ currentUsers.role }}</div>
          </div>

        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <a class="flex items-center text-primary font-medium" href="">
            <ActivityIcon class="w-4 h-4 mr-2" /> Information Personnel
          </a>
          <router-link class="flex items-center mt-5" to="/dashboard/resetPassword">
            <LockIcon class="w-4 h-4 mr-2" /> Changer de mot de passe
          </router-link>
        </div>
      </div>
    </div>
    <!-- END: Profile Menu -->
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Display Information -->
      <div class="intro-y box lg:mt-5">
        <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <h2 class="font-medium text-base mr-auto">Information profil</h2>
        </div>
        <div class="p-5">
          <div class="flex flex-col-reverse  xl:flex-row">
            <div class="p-5">
              <form @submit.prevent="editUserInfo()">
                <div class="grid grid-cols-12 gap-x-5">
                  <div class="col-span-12 xl:col-span-6">

                    <div class="mt-3">
                      <label for="update-profile-form-7" class="form-label">Nom</label>
                      <input id="update-profile-form-7" type="text" class="form-control" placeholder="Entrée votre nom"
                        v-model="formData.nom" />
                    </div>
                    <div class="mt-3">
                      <label for="update-profile-form-7" class="form-label">Prénom</label>
                      <input id="update-profile-form-7" type="text" class="form-control" placeholder="Entrée votre prénom"
                        v-model="formData.prenoms" />
                    </div>


                  </div>
                  <div class="col-span-12 xl:col-span-6">
                    <div class="mt-3">
                      <label for="update-profile-form-6" class="form-label">Email</label>
                      <input id="update-profile-form-6" type="text" class="form-control" placeholder="Entrér votre mail"
                        v-model="formData.email" />
                    </div>
                    <div class="mt-3">
                      <label for="update-profile-form-10" class="form-label">Phone Number</label>
                      <input id="update-profile-form-10" type="text" class="form-control" placeholder="Input text"
                        value="+229 XXXXXXXX" disabled />
                    </div>
                  </div>
                </div>
                <div class="mx-auto cursor-pointer relative mt-5">
                  <button type="submit" class="btn btn-primary py-3 px-4 w-full custom-bg  xl:mr-3 align-top">
                    <span class="text-sm font-semibold uppercase" v-if="!chargement2">
                      Mettre à jour
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
                </div>
              </form>

            </div>
            <div class="w-52 mx-auto xl:mr-0 xl:ml-6">
              <div
                class="border-2 border-dashed shadow-sm border-slate-200/60 dark:border-darkmode-400 rounded-md p-5 relative">
                <div v-if="url == null" class="h-40 relative image-fit cursor-pointer zoom-in mx-auto">

                  <div class="flex items-center p-2  justify-center w-full h-full bg-blue-400  shadow-lg cursor-pointer">
                    <!-- <span v-if="store.getInitiale != ''" key="initial store"
                      class="text-sm font-bold text-white uppercase">
                      {{ store.getInitiale }} </span> -->

                    <img :src="usersProfileImage" alt="">
                  </div>
                  <Tippy tag="div" content="Remove this profile photo?"
                    class="w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 -mr-2 -mt-2">
                    <xIcon class="w-4 h-4" />
                  </Tippy>

                </div>
                <div v-else class="h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                  <img class="rounded-md" alt="Midone Tailwind HTML Admin Template" :src="url" />
                  <Tippy tag="div" content="Remove this profile photo?"
                    class="w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 -mr-2 -mt-2">
                    <xIcon class="w-4 h-4" />
                  </Tippy>
                </div>

                <div
                  class=" text-center   absolute w-full  z-10 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/5 mt-5">
                  <label
                    class=" mx-auto p-1   cursor-pointer hover:btn-primary hover:btn font-bold border border-blue-500 rounded-sm">
                    Choisir image <input ref="file" v-on:change="handleFileUpload()" type="file" style="display: none;"
                      required>
                  </label>
                </div>

                <div class="mx-auto cursor-pointer relative mt-5">
                  <button type="submit" @click="saveProfil()"
                    class="btn btn-primary py-3 px-4 w-full custom-bg  xl:mr-3 align-top">
                    <span class="text-sm font-semibold uppercase" v-if="!chargement">
                      Sauvegarder
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Display Information -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, provide } from "vue";
import { useAuthStore } from '@/stores/modules/authentification'
import AuthentificationService from "@/services/modules/authentification.service";
import UsersService from "../../services/modules/user.service";
import { API_BASE_URL } from "@/services/configs/environment";


const store = useAuthStore()
const currentUsers = reactive({})
const initial = ref()
const fullName = ref('')
const chargement = ref(false)
const chargement2 = ref(false)


const successNotification = ref();

const message = reactive({
  type: '',
  message: '',
})

const formData = reactive({
  email: '',
  nom: '',
  prenoms: '',

})


const UserInfo = ref(null)


const usersProfileImage = ref('')
onMounted(() => {

  const usersInfo = JSON.parse(localStorage.getItem("bsdInfo"));
  UserInfo.value = usersInfo

  usersProfileImage.value = API_BASE_URL + usersInfo.users.profil

 

  if (usersInfo) {
    currentUsers.id = usersInfo.users.id
    currentUsers.nom = usersInfo.users.nom
    currentUsers.prenom = usersInfo.users.prenom
    currentUsers.role = usersInfo.users.role.nom
    currentUsers.email = usersInfo.users.email
    // currentUsers.number = usersInfo.users.entreprise.contact
    let storeInitial = currentUsers.nom[0] + '' + currentUsers.prenom[0]
    storeInitial = storeInitial.toUpperCase()
    initial.value = storeInitial
    fullName.value = currentUsers.nom + ' ' + currentUsers.prenom

    formData.nom = currentUsers.nom
    formData.prenoms = currentUsers.prenom
    formData.email = currentUsers.email

  }

 

})

const file = ref(null)
const url = ref(null)

const img = ref(null)

const handleFileUpload = async () => {

  img.value = file.value.files[0]

  url.value = URL.createObjectURL(img.value)

 
}


const saveProfil = function() {

  const profileImage = new FormData()
  profileImage.append('photo', img.value)
  if (!chargement.value && url.value != null) {
    chargement.value = true

    AuthentificationService.changeProfil(profileImage).then(response => {
      chargement.value = false



      usersProfileImage.value = API_BASE_URL + response.data.data.profil

       
    
      UserInfo.value.users.profil = response.data.data.profil

    

      localStorage.setItem('bsdInfo', JSON.stringify(UserInfo.value))

      console.log( localStorage.getItem('bsdInfo') )


      message.type = response.data.statut
      message.message = response.data.message
      successNotificationToggle()
      location.reload()




    }).catch(err => {


    })
    
  }

}


const editUserInfo = () => {

  if (!chargement2.value) {
    chargement2.value = true

  


    AuthentificationService.updateUserInfo(currentUsers.id, formData).then(response => {
     
      chargement2.value = false

      console.log(response.data)

      message.type = response.data.statut
      message.message = response.data.message
      successNotificationToggle()
    

      currentUsers.nom = formData.nom
      currentUsers.prenom = formData.prenoms
      currentUsers.email = formData.email

      currentUsers.initial = currentUsers.nom[0] + '' + currentUsers.prenom[0]

      UserInfo.value.users.nom = currentUsers.nom
      UserInfo.value.users.prenom = currentUsers.prenom
      UserInfo.value.users.email = currentUsers.email
      UserInfo.value.userInitiale = currentUsers.initial

      localStorage.setItem('bsdInfo', JSON.stringify(UserInfo.value));
      

      // location.reload()


    }).catch(err => {
      chargement2.value = false
      message.type = err.data.status
      message.message = err.data.message
      successNotificationToggle()

    })
  
  }

}



provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};

</script>
<style scoped>
#upload-photo {
  opacity: 0;
  position: absolute;
  z-index: -1;
}
</style>
