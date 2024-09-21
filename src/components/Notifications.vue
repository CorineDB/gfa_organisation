<template>
  <div>
    <!-- <div @click.stop="$emit('closeNotifModal')"  class="fixed top-0 right-0 left-0 bottom-0 bg-gray-900 z-40 bg-opacity-60 "> -->

    <div style="height:auto max-heigth:50vh"
      class="absolute  rounded-md w-3/4 md:w-2/5  position-card-notif z-50 shadow overflow-auto transform translate-x-0 transition ease-in-out duration-700 h-auto"
      id="notification" ref="notification">

      <div @click.stop="$emit('openNotif')"
        class=" shadow-2xl w-full h-auto rounded-md  bg-white overflow-y-auto p-4  left-0 right-0">
        <div class="flex items-center justify-between flex-wrap ">
          <!-- <div @click="$emit('closeNotifModal')" class="absolute -top-3 -left-0 z-50">
               <div class="py-4  text-red-500  ">
               <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
            </div> 
            </div> -->
          <p tabindex="0" class="focus:outline-none text-xl font-semibold leading-6 ">
            Notifications
          </p>
          <div class="mt-0">
            <button @click="deleteAll"
              class="bg-red-500 p-2 text-white border text-xs font-bold hover:bg-primary hover:text-white border-blue-200 transition-all duration-500  ">Effacer
              tout</button>
          </div>
        </div>
        <div class="my-2  h-1 bg-gray-200 "></div>

        <div v-for="(data, index) in datas" :key="index"
          class="w-full p-3 mt-4 bg-white rounded shadow flex flex-shrink-0">
          <div tabindex="0" aria-label="group icon" role="img" class="
                focus:outline-none
                w-8
                h-8
                border
                rounded-full
                border-gray-200
                flex flex-shrink-0
                items-center
                justify-center
              ">
            <svg stroke="currentColor" class="w-10 h-10  rounded-full" fill="currentColor" stroke-width="0"
              viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
              </path>
            </svg>
          </div>
          <div class="pl-3 w-full">
            <div class="flex items-center justify-between w-full">
              <p tabindex="0" class="focus:outline-none text-sm leading-6">
                <span class="text-indigo-700 uppercase font-semibold">{{ data.module }} :</span> {{ data.texte }}
                <span v-if="data.auteur" class="text-indigo-700 font-bold"> par {{ data.auteur.nom }}</span>
              </p>
              <div @click="viewNotification(data.id, index)" tabindex="0" aria-label="close icon" role="button"
                class="focus:outline-none cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 3.5L3.5 10.5" stroke="#4B5563" stroke-width="1.25" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M3.5 3.5L10.5 10.5" stroke="#4B5563" stroke-width="1.25" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <p tabindex="0" class="focus:outline-none text-xs leading-3 pt-1 text-gray-500">
              {{ data.created_at }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex justify-end ">
          <button @click="gotoNotification"
            class="bg-blue-200 p-2  text-primary border text-xs font-bold hover:bg-primary hover:text-white border-blue-200 transition-all duration-500 uppercase">voir
            tout </button>
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import NotificationService from "@/services/modules/notification.service.js";
export default {
  props: ['datas'],
  data() {
    return {
      show: true,
      closeNotifBox: true,
    };
  },
  methods: {
    viewNotification(id, index) {
      const data = {
        id: id
      }
      if (index > -1) { // only splice array when item is found
        this.datas.splice(index, 1); // 2nd parameter means remove one item only
      }
      NotificationService.checkMessage(data).then((data) => {

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
    deleteAll() {
      NotificationService.destroy().then((data) => {
        this.$toast.success('suppression reuissie')
        this.datas = []
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
      if (this.show == true) {
        this.closeNotifBox = false
      }
    },
    gotoNotification() {
      this.$router.push('/dashboard/notification')
    },
    active() {
      this.show = true
      this.closeNotifBox = true
    },
    notificationHandler(flag3) {
      let notification = this.$refs.notification;
      let checdiv = this.$refs.chec;
      // let flag3 = false;

      if (!flag3) {
        notification.classList.add("translate-x-full");
        notification.classList.remove("translate-x-0");
        setTimeout(function () {
          checdiv.classList.add("hidden");
        }, 1000);
        flag3 = true;
        this.show = false
      } else {
        setTimeout(function () {
          notification.classList.remove("translate-x-full");
          notification.classList.add("translate-x-0");
        }, 1000);
        checdiv.classList.remove("hidden");
        flag3 = false;
        this.show = true

      }
    },

  },


};
</script>

<style scoped>
.position-notif {
  position: absolute;
  top: -2px;
  right: -4px;

}

.position-card-notif {
  top: 63px;
  right: 16px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

}

@media screen and (max-width:915px) {
  .position-card-notif {
    top: 63px;
    right: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

  }
}

@media screen and (max-width:500px) {
  .position-card-notif {
    top: 63px;
    right: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  }
}

@media screen and (max-width:1280px) {
  .position-card-notif {
    top: 63px;
    right: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

  }
}
</style>
