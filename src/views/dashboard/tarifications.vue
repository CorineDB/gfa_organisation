<template>
  <h2 class="intro-y text-2xl font-medium my-10 text-center mr-auto">
    Tarification
  </h2>


  <!-- <vueper-slides class="no-shadow w-11/12 h-auto mx-auto " :slide-ratio = "1/2"  fixed-height = "100%"  bullets-inside transition-speed="250" :visible-slides="3" :slide-multiple="false" >
    <vueper-slide v-for="(pack, index) in tableauPack" :key="index" :style="'background-color: ' + ['none']">

      <template #content>
        <div class="intro-y flex-1 box py-16 lg:ml-5 mb-5 lg:mb-0">
          <BriefcaseIcon class="block w-12 h-12 text-primary mx-auto" />
          <div class="text-xl font-medium text-center mt-10">{{ pack.nom }}</div>
          <div class="text-slate-600 dark:text-slate-500 text-center mt-5">
            1 Domain <span class="mx-1">•</span> 10 Users
            <span class="mx-1">•</span> 20 Copies
          </div>
          <div class="text-slate-500 px-10 text-center mx-auto mt-2">
            {{ pack.info }}
          </div>
          <div class="flex justify-center">
            <div class="relative text-5xl font-semibold mt-8 mx-auto">
              <span class="absolute text-2xl top-0 left-0 -ml-4">$</span> {{ pack.prix }}
            </div>
          </div>
          <button type="button" class="btn btn-rounded-primary py-3 px-4 block mx-auto mt-8">
            PURCHASE NOW
          </button>
        </div>



      </template>
    </vueper-slide>
  </vueper-slides> -->









  <!-- END: Pricing Content -->
</template>

<script>
import PackService from '../../services/modules/pack.service';


export default {
 
  data() {
    return {
      tableauPack: [],
      slides: [
        {
          title: 'Slide #1',
          content: "<div clas</div>"
        },
        {
          title: 'Slide #2',
          content: 'Slide 2 content.'
        }
      ]
    }
  },

  mounted() {
    this.getPacks()
  },

  methods: {


    getPacks() {
      PackService.get().then((data) => {

        this.tableauPack = data.data.data

        console.log(Object.prototype.toString.apply(this.tableauPack))

        console.log(this.tableauPack)
      }).catch((e) => {
        // disabled()
        //alert(e)
      })

    }
  }


}
</script>
<style scoped>
.vueperslides__arrow {
  color: blue
}


.vueperslides__parallax-wrapper{
  padding-bottom: 40% !important  ;
}
</style>

