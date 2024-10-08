<template>
 
</template>

<script>

export default {

  props: ['template', 'champs', 'cols', 'submitText', 'sendRequest', 'isAllPairSaufDescrip', 'attrs', 'savedInput', 'submitted'],
  components: {
    
  },
  datas() {
    return {
      file: '',
      image: '',
    }
  },
  mounted() {

    if (localStorage.getItem("formData")) {
      this.savedInput = []
      this.savedInput = JSON.parse(localStorage.getItem("formData"))

      for (let i = 0; i < this.champs.length; i++) {
        this.champs[i].data = this.savedInput[i]
      }
    }

  },
  methods: {

    save() {
      if (this.sendRequest !== undefined && this.sendRequest === false) {
        this.$emit('sendForm')

      } else {
        this.$emit('sendForm')
      }
    },
    close() {
      this.$emit('closeModal', this.savedInput)
      localStorage.removeItem('formData')
      // this.savedInput = []
      // for (let i = 0; i < this.champs.length; i++) {
      //   this.savedInput.push(this.champs[i].data)
      // }

      // const parsed = JSON.stringify(this.savedInput);
      // localStorage.setItem('formData', parsed);

    },
   
    addSomeThing(champName){
      this.$emit('addSomeThing',champName)
     
    },
   

    previewFiles(event) {
      this.file = event.target.files;
      this.$emit('getFile', this.file)

    },
    previewImage(event) {
      this.image = event.target.files[0];
      this.$emit('getImage', this.image)
    }

  },
  computed: {
    Inputs() {
      let datas = []
      if (this.champs != undefined || this.champs != null) {
        this.champs.forEach(element => {
          if (element.isSelect === false && element.isTextArea === false) {
            datas.push(element)
          }
        });
      }


      return datas
    },
    Selects() {
      let datas = []
      if (this.champs != undefined || this.champs != null) {
        this.champs.forEach(element => {
          if (element.isSelect === true && element.isTextArea === false) {
            datas.push(element)
          }
        });
      }
      return datas
    },
    TextArea() {
      let datas = []
      if (this.champs != undefined || this.champs != null) {
        this.champs.forEach(element => {
          if (element.isTextArea === true && element.isSelect === false) {
            datas.push(element)
          }
        });
      }
      return datas
    },
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom {
  font-size: 9px;
  box-sizing: border-box;
}
</style>