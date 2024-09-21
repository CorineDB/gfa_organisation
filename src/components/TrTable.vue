<template>
  <div>
    <div>
      <div class="">
       
        <div @click.stop="updateData" v-if="isVisible" :class="{'whitespace-nowrap':depliment}"  class="text-xs cursor-pointer">
          <p v-if="!depliment" class="cursor-pointer _font-semibold">
            <span v-if="money"> {{data | formatNumber }}  </span> 
            <span v-else> {{data}}</span> 
<!--             <span @click="deplier" class=" cursor-pointer font-black text-xl px-1 rounded-md" v-if="attribut ? attribut.length > 30 : 0" :title="attribut" >...</span>
 -->          </p>
          <p v-else class="cursor-pointer font-semibold flex space-x-2"> 
            <span> {{ data }}</span>
            <span @click="depliment=false" >
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M8 7v4L2 6l6-5v4h5a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H8z"></path></g></svg>
            </span>
          </p>
        </div>
      </div>
     
      <input  type="text" v-if="!isVisible" v-model="data" @keyup.enter="update" class="border w-full  border-primary py-1 px-2 text-xs "/>
      <select name="" v-model="data" class="border w-full block my-1 border-primary py-1 px-2 text-xs "  @change="hideSelect(data)" v-if="select" id="">
        <option v-for="option in options" :key="option.id" :value="option[optionsKey]"> {{option[optionsKey]}}  </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props:['data', 'objet', 'isEditable','isSelect','options','optionsKey','updateKey','money'],
  data() {
    return {
      isVisible:true,
      select:false,
      delay: 700,
      clicks: 0,
      timer: null,
      attribut: `${this.data}`,
      depliment:false
    }
  },
   methods: {

      edit()
      {
        if(this.isEditable)  {
          this.isVisible = false
        }
          
      },
      
      update() {
        this.isVisible = true
        if(this.data !== this.attribut){
          this.$emit('update', this.objet?.id, this.objet?.extra, this.objet?.attribut, this.attribut)
              //this.data = this.attribut
        }
      },

      showSelect() {
          this.status = true
          this.isVisible = false
      },
      
      hideSelect(data) {
          this.select = false
          let id = ''
          this.options.forEach(element => {
           if(element[this.optionsKey] == data)  {
              id = element.id
           }
          });
          this.$emit('update', this.objet?.id, this.objet?.extra,this.updateKey, id)
      },

      deplier() {
        this.depliment = true
      },
      
      updateData(event) {
        
        if(this.isEditable && this.isSelect){ 
          
          this.clicks++;
          if (this.clicks === 1) {
            this.timer = setTimeout( () => {
              this.clicks = 0
            }, this.delay);
          } else {
            clearTimeout(this.timer);  
            this.select = true
            this.clicks = 0;
          }         
        }
        else if(this.isEditable == false) {
          this.clicks++;
          if (this.clicks === 1) {
            this.timer = setTimeout( () => {
              this.clicks = 0
            }, this.delay);
          } else {
            clearTimeout(this.timer);  
            this.isVisible = true
            this.clicks = 0;
          }  
        }
        else {
          this.clicks++;
          if (this.clicks === 1) {
            this.timer = setTimeout( () => {
              this.clicks = 0
            }, this.delay);
          } else {
            clearTimeout(this.timer);  
            this.isVisible = false
            this.clicks = 0;
          }  
        }
        
      }, 

      changeState(event) {
        this.clicks++;
        if (this.clicks === 1) {
          this.timer = setTimeout( () => {
            this.clicks = 0
          }, this.delay);
        } else {
          clearTimeout(this.timer);  
          this.isVisible = false
          this.clicks = 0;
        }         
      }, 
      showSelect() {
          this.status = true
          this.isVisible = false
      }
  }
}
</script>

<style>

</style>