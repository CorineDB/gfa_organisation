<!-- ./src/components/Notification.vue -->
<template>
  <div>
  </div>
</template>
<script>
    import Pusher from 'pusher-js' 
    import Echo from 'laravel-echo'
    import { API_BASE_URL, PUSHER_APP_CLUSTER } from "@/services/configs/environment";
    import { PUSHER_APP_KEY } from "@/services/configs/environment";
    import { PUSHER_BASE_URL } from "@/services/configs/environment";
    import { mapActions, mapMutations, mapGetters } from "vuex";
    import store from  "@/store/index"
    
    export default {
      data() {
        return {
          notifications:[]
        }
      },
      // ...
      mounted () {
        // ...
        this.subscribe()
       
      },
      computed: {
        //importation des variables du module auths
        ...mapGetters({
        currentUser: "auths/GET_AUTHENTICATE_USER",
        }),
        ...mapGetters([
          'getCount',
         ])
      },
      methods: {
        // ...
        subscribe () {
            let vm = this 
            let token = store.getters['auths/GET_ACCESS_TOKEN'] // modules.auths?.getters?.GET_ACCESS_TOKEN(modules.auths.state)
            var pusher = new Pusher(PUSHER_APP_KEY , {
                authEndpoint:  API_BASE_URL+ '/api/broadcasting/auth',
                cluster: PUSHER_APP_CLUSTER,
                encrypted: true,
                forceTLS: false,
                wsHost: PUSHER_BASE_URL,
                wsPort: 6001,
                wssPort: 6001,
                disableStats: true,
                enabledTransports: ['ws', 'wss'],
                auth: {
                    headers: {
                    authorization: `Bearer ${token}`,
                    }
                }
            });

            var channel = pusher.subscribe("private-notification." + this.currentUser?.id);
            
           

            channel.bind('notification.posted', function (data) {
              const count = data.notification.unread
              vm.$store.commit('updateCounter',count)
              const datas = data.notification.notification
              const module = datas.module
              const texte = datas.texte
              //this.notifications = {module,texte}
              vm.$toast.default(` ${module} : ${texte}`)

              
            });
        }
      },
      // ...
    }
</script>

    