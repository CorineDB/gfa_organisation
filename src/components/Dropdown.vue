<template>
  <div>
    <div class="dropdown">
      <button class="text-xs md:text-sm font-bold text-center text-gray-900 rounded-md">
        <i class="bx bx-dots-vertical-rounded bx-sm pr-2 bg-white rounded-sm"></i>
      </button>
      <div class="dropdown-content">
        <span class="option cursor-pointer  hover:bg-white" @click.stop="actions(link.name)" v-for="(link, indice) in option" :key="indice">{{link.name}}</span>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  props:['option'],
  data() {
    return {
      demo:false
    }
  },
  methods: {
    actions(option) {
      if(option == 'continuer') {
        this.$emit('gotoNext')
      }
      if(option == 'dupliquer') {
        this.$emit('dupliquer')
      }
       if(option == 'supprimer') {
        this.$emit('supprimer')
      }
      if(option == 'modifier') {
        this.$emit('modifier')
      }
      if(option == 'prolonger') {
        this.$emit('prolonger')
      }
      if(option == 'mes suivis') {
        this.$emit('suivre')
      }
      if(option == 'commenter') {
        this.$emit('commentaire')
      }
      if(option == 'changer logo') {
        this.$emit('couverture')
      }
      
    }
  }
}
</script>

<style scoped>

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
 
    display: none;
    min-width: 160px;
    position: absolute;
    inset: 0px 0px auto auto;
    margin: 0px;
    opacity: 1;
    transform: translate(-17px, 17px);
    background-color: #ffffff;
    transition: visibility 0s ease-in-out 0s, opacity .2s 0s;
    visibility: visible;
    z-index: 1;
    border-radius: 0.375rem;
    box-shadow: 0 3px 10px #00000017;
    padding: 0.5rem;
   
   
   
    


}

.dropdown-content .option {
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
  font-weight: 500;
}
.option:hover {
  background: #EEF1F6;
}

.dropdown-content a:hover {background-color: #EEF1F6}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>