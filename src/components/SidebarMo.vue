<template>
  <div  class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0  md:left-0 h-screen scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter _scrollbar-w-2 _scrolling-touch  o lg:block bg-primary z-30 no-scrollbar overflow-y-auto" :class="sideBarOpen ? '' : 'hidden'" id="main-nav">
    <div class="w-full h-20  flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">PAPC</p>
    </div>
    <div class="mb-1 px-4 flex items-center text-white  cursor-pointer  ">
      <router-link to="/mo/mission-controle" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"></path></svg>
        <span class="font-semibold text-xs">Mission de controle</span>
      </router-link>
    </div>

    <div class="mb-1 px-4 flex items-center text-white  cursor-pointer  ">
      <router-link to="/mo/entreprises" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"></path></svg>
        <span class="font-semibold text-xs">Entreprises exécutante</span>
      </router-link>
    </div>
    
    <div class="mb-1 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/mo/ong" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <span class=" ">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M17 7h2v2h-2zM17 11h2v2h-2zM17 15h2v2h-2zM1 11v10h6v-5h2v5h6V11L8 6l-7 5zm12 8h-2v-5H5v5H3v-7l5-3.5 5 3.5v7z"></path><path d="M10 3v1.97l2 1.43V5h9v14h-4v2h6V3z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase">ONG / Agences de comunications</span>
      </router-link>
    </div>

    <div class="mb-1 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/dashboard/profil" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1.3em" height="1.3em" stroke-linecap="round" stroke-linejoin="round" class="icon icon-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span class="font-semibold text-xs uppercase">Profil</span>
      </router-link>
    </div>


  </div>
</template>
<script>

import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: "sidebar",
    data() {
      return {
        currentRole:''
      }
    },
    computed: {
      ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
    },
    mounted() {
      if(this.currentUser != undefined) {
       this.currentRole = this.currentUser.role[0].nom
       
      }
    }
}
</script>

<style scoped>
  .router-link-exact-active
  {
    color: #fff;
    font-weight: bold;
    padding: 10px 18px;
    background-color: #00ACEE;
  }
  .scrollbar-w-2::-webkit-scrollbar {
    width: 0.8rem;
    height: 0.8rem;
  }

  .scrollbar-track-blue-lighter::-webkit-scrollbar-track {
    background-color: #ccc;
  }

  .scrollbar-thumb-blue::-webkit-scrollbar-thumb {
    --bg-opacity: 1;
    background-color: #2d3748;
    background-color: rgba(45, 55, 72, var(--bg-opacity));
  }

  .scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
    border-radius: 0rem;
  }
  .tab {
    overflow: hidden;
  }
  .tab-content {
    max-height: 0vh;
    display:none;

  }
  input:checked + .tab-label .test {
    background-color: rgb(255, 255, 255);
  }
  input:checked + .tab-label .test svg {
    transform: rotate(180deg);
    stroke: #000;

  }
  input:checked + .tab-label::after {
    transform: rotate(90deg);
  }
  input:checked ~ .tab-content {
  max-height: 100vh;
    display:block;
    transition: all 0.5s;
  }
  .bx.bx-chevron-down {
    font-weight: 700;
  }
</style>

