<template>
  <div class="sticky top-0 z-40">
    <div class="w-full h-16 px-6 bg-primary border-b flex items-center justify-between">
      <!-- left navbar -->
      <div class="flex">
        <!-- mobile hamburger -->
        <div class="lg:hidden flex items-center mr-4">
          <button class="hover:text-blue-500 hover:border-white focus:outline-none navbar-burger"
            @click="toggleSidebar()">
            <svg class="h-5 w-5" v-bind:style="{ fill: 'white' }" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
      </div>
      <!-- right navbar -->
      <div class="flex items-center relative">

        <div
          class="absolute inset-y-0 right-0 flex space-x-3 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <router-link v-if="fichierVisible" class="text-white" to="/dashboard/fileManager"><svg stroke="currentColor"
              fill="currentColor" class="h-6 w-6" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3z"></path>
              <path
                d="M20 5h-8.586L9.707 3.293A.996.996 0 0 0 9 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z">
              </path>
            </svg></router-link>
          <button @click="viewNotification" :class="{'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' : showNotification}"
            class="bg-white w-10 h-10 flex justify-center items-center relative rounded-full text-gray-700 hover:text-gray-900 ">

            <!-- Heroicon name: outline/bell -->
            <img src="/img/bell.gif" class="h-6 w-6 object-contain" alt="">

            <span v-if="getCount > 100 "
              class=" text-small px-1 absolute top-0 -right-3 bg-red-500 text-white rounded-full"> 99+ </span>
            <span v-else class=" text-small px-1 absolute top-0 -right-3 bg-red-500 text-white rounded-full">
              {{getCount}} </span>
          </button>

          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button @click="openMenu = !openMenu" type="button" class=" text-sm rounded-full outline-none "
                id="user-menu" aria-expanded="false" aria-haspopup="true">
                <div
                  class="flex items-center  mx-2 justify-center w-10 h-10 bg-blue-400 rounded-full shadow-lg cursor-pointer">
                  <span class="text-small font-bold text-white uppercase"> {{ cigle }} </span>
                </div>


              </button>
            </div>

            <div v-if="openMenu"
              class="origin-top-right absolute divide-y z-50 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
              <router-link to="/dashboard/profil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"> {{ currentUser.nom }}  </router-link>
              
              <span @click.prevent="deconnecter"
                class="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Se
                déconnecter</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <notifications v-if="showNotification" :datas="notifications" @openNotif="openNotif"
      @closeNotifModal="closeNotifModal"></notifications>
  </div>
</template>

<script>
import Notifications from '@/components/Notifications'
import { mapState, mapGetters, mapActions } from 'vuex'
import getCigle from '../utils/get-cigle'
import NotificationService from "@/services/modules/notification.service.js";
import BackupService from "@/services/modules/backup.service.js";

export default {
  name: 'Navbar',
  components: {
    Notifications
  },
  computed: {
    ...mapState(['sideBarOpen']),
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' }),
    ...mapGetters([
      'getCount',
    ])
  },
  data() {
    return {
      cigle: null,
      dropDownOpen: false,
      openMenu: false,
      showNotification: false,
      notifications: [],
      total: 0,
      fichierVisible: false,

    }
  },
  methods: {
    //Charger les fonctions 
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-un-fichier') {
          this.fichierVisible = true
        }


      });
    },
    getNotification() {
      NotificationService.get().then((data) => {
        const datas = data.data.data
        this.total = datas.length
        this.$store.commit('updateCounter', this.total)
        this.notifications = datas.slice(Math.max(datas.length - 5, 0))
      }).catch((error) => {
        if (error.response) {
              // Requête effectuée mais le serveur a répondu par une erreur.
              const message = error.response.data.message
              this.$toast.error(message)
              } else if (error.request) {
                // Demande effectuée mais aucune réponse n'est reçue du serveur.
                //console.log(error.request);
              } else {
              // Une erreur s'est produite lors de la configuration de la demande
              //console.log('dernier message', error.message);
          }
      })
    },
    closeNotifModal() {
      this.showNotification = false
    },

    viewNotification() {
      this.getNotification()
      this.showNotification = ! this.showNotification
    },
    openNotif() {
      this.showNotification = true
    },
    ...mapActions('auths', { logout: "LOGOUT" }),

    toggleSidebar() {
      this.$store.dispatch('toggleSidebar')
    },

    deconnecter() {
      this.logout().then((response) => {
        if (response.statut === "success" || response.status === 200) {
          this.$router.push('/')

          this.$toast.success("Déconnexion réussie")
        } else {
          this.$toast.error(response.message)
        }
      })
    }

  },

  mounted() {
    this.getNotification()
    this.getPermission()
    let nom =''

    if (this.currentUser.nom != undefined)
      nom = this.currentUser.nom

    if (this.currentUser.prenom != undefined)
      nom += this.currentUser.prenom

    this.cigle = getCigle(nom)

    /* const usersInfo = JSON.parse(localStorage.getItem('usersInfos'))
      if(usersInfo) {
        this.currentUsers = usersInfo
         this.userRule = this.currentUsers.role
        
        console.log('role', this.userRule)
        
      } */

  },
}
</script>
<style scoped>
.active{
  background: #000;
}
</style>

 