<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000, }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}</div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->
    <!-- BEGIN: Breadcrumb -->

    <nav aria-label="breadcrumb" class="-intro-x mr-auto hidden sm:flex">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Application</a></li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
    </nav>

    <!-- END: Breadcrumb -->


    <!-- BEGIN: Notifications -->
    <Dropdown class="intro-x mr-auto sm:mr-6">
      <DropdownToggle tag="div" role="button" class="notification notification--bullet cursor-pointer">
        <BellIcon class="notification__icon dark:text-slate-500" />
      </DropdownToggle>
      <DropdownMenu class="notification-content pt-2">
        <DropdownContent tag="div" class="notification-content__box">
          <div class="notification-content__title">Notifications</div>
          <div v-for="(faker, fakerKey) in $_.take($f(), 5)" :key="fakerKey"
            class="cursor-pointer relative flex items-center" :class="{ 'mt-5': fakerKey }">
            <div class="w-12 h-12 flex-none image-fit mr-1">
              <img alt="Tinker Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
              <div
                class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600">
              </div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">{{
                  faker.users[0].name
                }}</a>
                <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">
                  {{ faker.times[0] }}
                </div>
              </div>
              <div class="w-full truncate text-slate-500 mt-0.5">
                {{ faker.news[0].shortContent }}
              </div>
            </div>
          </div>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
    <!-- END: Notifications -->


    <!-- BEGIN: Account Menu -->


    <Dropdown class="intro-x w-8 h-8">
      <DropdownToggle tag="div" role="button" class="dropdown-toggle image-fit zoom-in">
        <div class="flex items-center   justify-center w-8 h-8 bg-blue-400 rounded-full shadow-lg cursor-pointer">
          <img v-if="usersProfileImage" :src="usersProfileImage" alt="">
          <span v-else class="text-sm font-bold p-2 text-white uppercase">
            {{  currentUsers.initiale }} </span>
        </div>
      </DropdownToggle>
      <DropdownMenu class="w-56">
        <DropdownContent class="bg-primary text-white">
          <DropdownHeader tag="div" class="!font-normal">
            <div class="font-medium">
              <!-- {{  currentUsers.prenom }} -->
              <span > {{  currentUsers.nom  }} 
              </span>
            </div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              {{ currentUsers.role }}
            </div>
          </DropdownHeader>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5 ">
            <span @click="gotoProfil" class="flex space-y-2 w-full" to="">
              <UserIcon class="w-4 h-4 mr-2" /> Profil
            </span>
          </DropdownItem>
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <router-link class="flex space-y-2 w-full" to="/dashboard/resetPassword">
              <LockIcon class="w-4 h-4 mr-2" /> Réinitialiser le Mot de Passe
            </router-link>
          </DropdownItem>

          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5">
            <span class="cursor-pointer flex space-x-2 items-center" @click="logout">
              <ToggleRightIcon class="w-4 h-4 mr-2" /> Se déconnecter
            </span>
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>


    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
  

 
</template>

<script setup>
import { ref, reactive, onMounted, provide } from "vue";
import { useAuthStore } from '@/stores/modules/authentification'
import AuthentificationService from "@/services/modules/auth.service";
import { useRouter, useRoute } from 'vue-router'
import { API_BASE_URL } from "@/services/configs/environment";
const router = useRouter()
const route = useRoute()
const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};

const store = useAuthStore()
const currentUsers = reactive({})
const successNotification = ref();
const initiale = ref()


const message = reactive({
  type: 'success',
  message: '',
})

const usersProfileImage = ref('')

onMounted(() => {
  const usersInfo = JSON.parse(localStorage.getItem('authenticateUser'));

  console.log('usersInfo' , usersInfo)
 
  if (usersInfo) {
    // usersProfileImage.value = API_BASE_URL + usersInfo.users.profil
    // currentUsers.nom = usersInfo.profil.nom
    currentUsers.nom = "test"
   // currentUsers.prenom = usersInfo.users.prenom
    currentUsers.role = usersInfo.role[0].nom
  //  + currentUsers.prenom[0]
    let storeInitial = currentUsers.nom[0] + '' 
    storeInitial = storeInitial.toUpperCase()
    initiale.value = storeInitial
    currentUsers.initiale = initiale.value

  }
  
  
})

const logout = () => {
  AuthentificationService.logout().then(() => {

    localStorage.removeItem("bsdInfo")
    store.resetInfo()
    message.type = 'success'
    message.message = 'Vous êtes déconnecté'
    successNotificationToggle()
    //toast success
    setTimeout(() => {
      router.push('/')
    }, 100)
  }).catch((error) => {
    setTimeout(() => {
      router.push('/')
    }, 100)
    if (error.response) {
      const message = error.response.data.message
      message.type = 'erreur'
      message.message = message
      successNotificationToggle()
    }


  })

}

const gotoProfil = () => {
  router.push('/dashboard/profil')
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
