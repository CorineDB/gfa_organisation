<template>
  <!-- component -->
  <div style="height:800px" class="flex-1 p:2   flex flex-col ">
    <div style="height:10%" class="flex  justify-between py-3 border-b-2 border-gray-200">
        <div class="relative flex items-center space-x-4">
          <div class="relative">
              <span class="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                    <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
            <svg stroke="currentColor" class="w-10 h-10  rounded-full" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>

          </div>
          <div class="flex flex-col leading-tight">
              <div class="mt-1 flex items-center">
                <span class="text-gray-700 mr-3">{{currentUser.nom}} </span>
              </div>
              <span class="text-sm font-semibold text-gray-600">{{currentUser.type}}</span>
          </div>
        </div>
       
    </div>
    <div id="messages" style="height:80%" class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      
        <div class="chat-message for-you">
          <div  class="flex items-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">Can be verified on any platform using docker</span></div>
              </div>
                <svg stroke="currentColor" class="w-6 h-6 order-1  rounded-full" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
          </div>
          <p class="text-xs my-2  text-gray-500 italic text-left">  <span> demo 1 à 20h 35 min   </span> </p>
        </div>
        <div class="chat-message for-me">
          <div  class="flex items-end justify-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">Your error message says permission denied, npm global installs must be given root privileges.</span></div>
              </div>
             <svg stroke="currentColor" class=" rounded-full order-2" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
          </div>
          <p class="text-xs my-2  text-gray-500 italic text-right">  <span> {{currentUser.nom}} à 20h 35 min   </span> </p>
        </div>

        <div class="chat-message for-you">
          <div  class="flex items-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">Can be verified on any platform using docker</span></div>
              </div>
              <svg stroke="currentColor" class="w-6 h-6 order-1  rounded-full" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
          </div>
            <p class="text-xs my-2  text-gray-500 italic text-left">  <span> demo 2 à 20h 35 min   </span> </p>
        </div>
        <div  class="chat-message for-me">
          <div class="flex items-end justify-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">Your error message says permission denied, npm global installs must be given root privileges.</span></div>
              </div>
              <svg stroke="currentColor" class=" rounded-full order-2" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
          </div>
          <p class="text-xs my-2  text-gray-500 italic text-right">  <span> {{currentUser.nom}} à il y à 3 min   </span> </p>
        </div>
       <div  class="chat-message for-you">
          <div   class="flex items-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">Can be verified on any platform using docker</span></div>
              </div>
                 <svg stroke="currentColor" class="w-6 h-6 order-1  rounded-full" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
          </div>
          <p class="text-xs my-2  text-gray-500 italic text-left">  <span> demo3 à 10h 55 min   </span> </p>
        </div>
        <div  class="chat-message for-me">
          <div  class="flex items-end justify-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">Your error message says permission denied, npm global installs must be given root privileges.</span></div>
              </div>
             <svg stroke="currentColor" class=" rounded-full order-2" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
          </div>
          <p class="text-xs my-2  text-gray-500 italic text-right">  <span> {{currentUser.nom}} à 15 septembre 2022    </span> </p>
        </div>
      
    </div>
    <div style="height:10%" class="border-t-2 border-gray-200 px-4 pt-4 mb-2 ">
        <div class="relative flex">
          
          <input type="text" v-model="message" @keyup.enter="$emit('sendMessage',message)" placeholder="Laissez un commentaire !" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3">
          <div class="absolute right-2 flex items-center inset-y-0  ">
              
              <button type="button" @click="$emit('sendMessage',message)"  class="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
             
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
          </div>
        </div>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState} from "vuex";
export default {
  props:['isOnlyRead'],
  data() {
    return {
      message:''
    }
  },
  computed: {
    ...mapGetters('auths', {currentUser : 'GET_AUTHENTICATE_USER'})
  },
    mounted() {
      
      const el = document.getElementById('messages')
	    el.scrollTop = el.scrollHeight
    }
}
</script>

<style scoped>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>