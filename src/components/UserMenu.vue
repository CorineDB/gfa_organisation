<template>
  <div class="usermenu inline-block -mt-6">
    <button class="text-sm drop-button  text-gray-700 focus:outline-none" @click.prevent="toggleDD('userDropDown')">
      <div class="flex items-center  mx-2 justify-center w-12 h-12 bg-blue-400 rounded-full shadow-lg cursor-pointer"  >
        <span class="text-lg font-bold text-white uppercase"> JD </span>
      </div>
      John Doe
      <svg
        class="h-3 ml-1 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
      <path
        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
      />
      </svg>
    </button>
    <div
      id="userDropDown"
      class="dropdownlist absolute top-2 right-0 bg-white  shadow-md pin-r mt-3 p-3 overflow-auto z-30 invisible">
    <router-link
      to="/users/compte"
      class="p-2 hover:bg-grey-darkest  text-sm no-underline hover:no-underline block"><i class="fa fa-user fa-fw"></i> Mon compte
    </router-link>
    <router-link
      to="/users/settings"
      class="p-2 hover:bg-grey-darkest  text-sm no-underline hover:no-underline block"><i class="fa fa-cog fa-fw"></i> Parametre
    </router-link>
    <div class="border border-grey-darkest"></div>
      <span @click="logout"
        href="#"
        class="p-2 hover:bg-grey-darkest cursor-pointer  text-sm no-underline hover:no-underline block">
        <i class="fas fa-sign-out-alt fa-fw"></i> Se Deconnecter
      </span>
    </div>
  </div>
</template>

<script>
//import {parseJwt,refresh,autologout} from '~/components/Token'
export default {
  data() {
    return {
      currentUsers:{},
      token:'',
      idUsers:'',
      initial:'',
      tokenDevice:''
    }
  },
  mounted() {
    //this.getData()
    window.onclick = event => {
      if (
        !event.target.matches('.drop-button') &&
        !event.target.matches('.drop-search')
      ) {
        const dropdowns = document.getElementsByClassName('dropdownlist');
        for (let i = 0; i < dropdowns.length; i++) {
          const openDropdown = dropdowns[i];
          if (!openDropdown.classList.contains('invisible')) {
            openDropdown.classList.add('invisible');
          }
        }
      }
    }
    
  },
  methods: {
    async getData() {
      const usersInfo = JSON.parse(localStorage.getItem('usersInfo'))
      if(usersInfo) {
        this.token = usersInfo.token
        this.idUsers = usersInfo.id
        this.tokenDevice = usersInfo.tokenDevice
        const refresh_token = usersInfo.refresh_token
        const expiration = usersInfo.expirationToken
        if(refresh(expiration)) {
          try {
            const response = await this.$axios.$post('/api/token/refresh', {
            refresh_token: refresh_token
            })
            const usersInfo = {
              roles:parseJwt(response.token).roles,
              id:parseJwt(response.token).id,
              username:parseJwt(response.token).username,
              token:response.token,
              refresh_token:response.refresh_token,
              expirationToken:parseJwt(response.token).exp

            }
            localStorage.setItem('usersInfo',JSON.stringify(usersInfo))
            const UsersInfos = JSON.parse(localStorage.getItem('usersInfo'))
            this.token = UsersInfos.token
          } catch (error) {
            alert("invalide refresh token "+ error)
          }
        }
        try {
          await this.$axios.$put(`/api/v1/users/${this.idUsers}`, {
            tokenDevice:this.tokenDevice
          },{headers: { Authorization: `Bearer ${this.token}` } 
          })
          const users = await this.$axios.$get(`/api/v1/users/${this.idUsers}`,{ headers: {'Accept':'application/json', Authorization: `Bearer ${this.token}`}})
          this.currentUsers = users
          this.initial = users.firstName.substring(0,1) + ' ' +users.lastName.substring(0,1)
          localStorage.setItem('currentUsers',JSON.stringify(users))
        } catch (error) {
          alert(error)
        }
      }
    },
    toggleDD(myDropMenu) {
      document.getElementById(myDropMenu).classList.toggle('invisible');
    },
    logout() {
      localStorage.removeItem('usersInfo');
      localStorage.removeItem('currentUsers')
      this.$router.push('/')
      this.$toast.show({
        type: 'success',
        title: 'Success',
        message: 'Déconnexion réussie',
      })
    },
    
  },
 
  
};
</script>

<style  scoped>
#userDropDown {
  min-width: 180px;
}

button {
  display: flex;
  align-items: center;
}
.usermenu {
  position: relative;
  top: 12px;
}
</style>
