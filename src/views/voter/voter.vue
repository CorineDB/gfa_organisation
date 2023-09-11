<template>
  <div class=" bg  flex flex-col  justify-evenly   text-black  relative">

    <!-- Debut messagerie -->

    <!-- bouton flottant -->
    <div
      class="fixed bottom-[3rem]   right-[1.7rem]  lg:top-[2.5rem] rounded-lg  h-[70px]  flex justify-end items-center w-auto gap-3  bg-white p-3 shadow-xl">
      <div class="hidden sm:block relative h-12 w-12 shrink-0">
        <div class="absolute bottom-1 right-0 h-2 w-2 rounded-xl bg-green-600"></div>
        <img class="h-12 w-12 rounded-full object-cover object-center"
          src="https://images.unsplash.com/photo-1584940120743-8981ca35b012?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
          alt="" />
      </div>
      <div class="overflow-hidden">
        <h2 class="font-semibold">Formulez </h2>
        <p class="truncate text-sm text-slate-500  font-semibold">votre plainte</p>
      </div>

      <div class="col-span-6 sm:col-span-3 xl:col-span-2 ">
        <span class="w-8 h-8  hidden sm:block">
          <svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#2d3748" class="w-full h-full">
            <g fill="none" fill-rule="evenodd" stroke-width="4">
              <circle cx="22" cy="22" r="1">
                <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1"
                  keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline"
                  keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
              </circle>
              <circle cx="22" cy="22" r="1">
                <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1"
                  keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline"
                  keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
              </circle>
            </g>
          </svg>
        </span>
      </div>
      <div v-show="boiteDialog"
        class="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full bg-indigo-500 ring-indigo-300 ring-offset-2 transition-all duration-300 hover:bg-indigo-600 focus:outline-none focus:ring-2"
        @click="boiteDialog = false" role="button" aria-label="Call  My wife " tabindex="1">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
          <path
            d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z">
          </path>
        </svg>

      </div>

      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full bg-indigo-500 ring-indigo-300 ring-offset-2 transition-all duration-300 hover:bg-indigo-600 focus:outline-none focus:ring-2"
        role="button" @click="ouvrirFermerDiscution">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
          <path
            d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.515 5 6.934V22l5.34-4.005C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8z">
          </path>
        </svg>

      </div>

    </div>
    <!-- bouton flottant -->

    <!-- pop-up messagerie -->
    <section v-if="boiteDialog" class="chatbox-popup">
      <header class="chatbox-popup__header">
        <aside style="flex:3">
          <svg class=" chatbox-popup__avatar" xmlns="http://www.w3.org/2000/svg" width="80" height="80"
            viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
            <path
              d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z">
            </path>
          </svg>

        </aside>
        <aside style="flex:8">
          <h1 class="h1_chat">{{ campagneEnCours.entreprise.nom }}</h1> Company(Online)
        </aside>

        <div v-show="boiteDialog"
          class="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full bg-indigo-500 ring-indigo-300 ring-offset-2 transition-all duration-300 hover:bg-indigo-600 focus:outline-none focus:ring-2"
          @click="boiteDialog = false" role="button" aria-label="Call  My wife " tabindex="1">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
            <path
              d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z">
            </path>
          </svg>

        </div>


      </header>
      <main class="chatbox-popup__main">
        Nous prenons votre plainte de façon anonyme afin de mieux vous satisfaire et ameliorer la qualité de notre service
        . Merci de nous faire confiance
      </main>
      <footer class="chatbox-popup__footer">
        <aside style="flex:10" class="mr-1">
          <textarea @input="inputChange"
            class="border border-gray-400 rounded-lg focus:outline-none focus:border-transparent placeholder:text-xs  md:placeholder:text-sm "
            rows="1" type="text" v-model="plainte" placeholder="Laissez votre plainte ici !"></textarea>

          <!-- <textarea class="border border-gray-400 rounded-lg focus:outline-none focus:border-transparent"></textarea> -->
        </aside>
        <aside style="flex:1;color:#888;text-align:center;">


          <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2" content="Envoyer">
            <span @click="envoyerCommentaire"
              class="text-black cursor-pointer hover:bg-gray-300 hover:p-1  hover:rounded-md  flex justify-start items-center">
              <SendIcon class="hover:text-blue-500" />
            </span>
          </Tippy>

        </aside>
      </footer>
    </section>
    <!--fin pop-up messagerie -->

    <!-- fin messagerie -->

    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 5000, }" class="flex items-center">



      <!-- passable -->

      <picture v-if="passable" class="">
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f_1f3fe/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f_1f3fe/512.gif" alt=":pray:" width="55" height="55">
      </picture>


      <!-- mauvais  -->
      <picture v-if="mauvais" class="">
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/512.gif" alt=":cry:" width="55" height="55">
      </picture>


      <!-- bien  -->
      <picture v-if="bien" class="">
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.gif" alt=":smiling_face_with_3_hearts:"
          width="55" height="55">
      </picture>


      <!--       
      <img src="../../assets/images/BSD-heureux2.svg" v-if="messages.type === 'success'" class="text-success" width="55"
        height="55" alt=""> -->











      <!-- <svg v-if="messages.type === 'success'" class="text-success" width="55" height="55" viewBox="0 0 200 200"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1611_8554)">
          <path
            d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
            fill="#3AAA35" />
          <path
            d="M162.768 22.16C176.164 39.5945 183.41 60.9736 183.376 82.96C183.376 138.188 138.604 182.96 83.376 182.96C60.5306 182.993 38.3687 175.169 20.608 160.8C29.9345 173.001 41.9501 182.885 55.7201 189.684C69.49 196.483 84.643 200.013 100 200C155.228 200 200 155.228 200 100C200.013 85.0664 196.675 70.3201 190.231 56.8483C183.787 43.3764 174.402 31.5224 162.768 22.16V22.16Z"
            fill="#2B7E27" />
          <path
            d="M100.868 155.352C84.468 155.176 70.98 149.996 59.508 139.66C57.224 137.608 56.896 134.808 58.64 132.768C60.384 130.728 63.204 130.556 65.572 132.616C70.06 136.524 74.852 139.944 80.42 142.088C98.572 149.08 115.456 146.745 131.072 135.084C132.316 134.152 133.428 133.04 134.696 132.148C136.852 130.636 139.452 130.948 140.992 132.796C142.532 134.644 142.448 137.42 140.5 139.284C137.686 141.981 134.589 144.366 131.264 146.4C121.66 152.28 111.064 155.276 100.868 155.352Z"
            fill="#1D1D1B" />
          <path
            d="M152.1 88.028C152.048 96.616 144.996 103.66 136.5 103.628C132.371 103.576 128.425 101.913 125.504 98.9938C122.583 96.0744 120.918 92.1294 120.864 88C120.836 79.412 128.064 72.216 136.628 72.344C140.758 72.3778 144.706 74.0478 147.606 76.9879C150.506 79.928 152.122 83.8982 152.1 88.028V88.028Z"
            fill="#1D1D1B" />
          <path
            d="M47.508 87.94C47.5005 83.7973 49.1391 79.8214 52.0632 76.8868C54.9872 73.9522 58.9573 72.2994 63.1 72.292C67.2427 72.2846 71.2186 73.9231 74.1532 76.8472C77.0878 79.7713 78.7406 83.7413 78.748 87.884C78.816 96.416 71.528 103.716 63.036 103.628C58.9057 103.578 54.9612 101.903 52.0554 98.9677C49.1496 96.032 47.5161 92.0706 47.508 87.94Z"
            fill="#1D1D1B" />
          <path
            d="M142.1 84.248C140.1 84.08 138.28 83.508 137.148 81.7C135.896 79.7 136.912 77.7 139.292 77.652C140.398 77.6219 141.493 77.8756 142.474 78.3889C143.454 78.9021 144.287 79.6578 144.892 80.584C145.165 80.9153 145.334 81.3203 145.377 81.7475C145.419 82.1748 145.334 82.6051 145.132 82.984C144.484 84.172 143.348 84.332 142.1 84.248Z"
            fill="#5A5F62" />
          <path
            d="M68.3719 84.248C67.0199 84.308 65.5479 83.556 64.2719 82.372C63.3559 81.516 62.8919 80.42 63.2919 79.204C63.7279 77.88 65.0039 77.64 66.1639 77.648C67.0432 77.6376 67.9147 77.8133 68.7213 78.1635C69.5278 78.5137 70.2512 79.0305 70.8439 79.68C71.6439 80.536 72.308 81.528 71.752 82.836C71.196 84.144 69.9999 84.208 68.3719 84.248Z"
            fill="#5A5E62" />
        </g>
        <defs>
          <clipPath id="clip0_1611_8554">
            <rect width="200" height="200" fill="white" />
          </clipPath>
        </defs>
      </svg> -->



      <!-- <svg width="75" height="75" v-else viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
          fill="#BE1622" />
        <path
          d="M162.768 22.16C176.163 39.5946 183.41 60.9736 183.376 82.96C183.376 138.188 138.604 182.96 83.3759 182.96C60.5305 182.993 38.3686 175.169 20.6079 160.8C29.9344 173.001 41.95 182.885 55.72 189.684C69.4899 196.483 84.6429 200.013 99.9999 200C155.228 200 200 155.228 200 100C200.013 85.0664 196.675 70.3202 190.231 56.8483C183.787 43.3764 174.402 31.5224 162.768 22.16V22.16Z"
          fill="#A6151C" />
        <path
          d="M128.192 129.34C137.392 136.688 142.72 146.444 145.668 157.632C146.644 161.344 143.788 164.192 140.008 163.552L131.376 162.092C130.528 161.504 130.144 160.628 129.828 159.692C129.148 157.672 128.564 155.616 127.548 153.692C126.611 151.821 124.985 150.387 123.012 149.692C116.276 147.292 109.412 145.692 102.212 145.36C93.1486 144.98 84.1046 146.478 75.648 149.76C74.5487 150.162 73.5456 150.79 72.7032 151.603C71.8607 152.416 71.1975 153.396 70.756 154.48C69.956 156.328 69.32 158.232 68.708 160.144C68.513 160.969 68.0238 161.694 67.332 162.184C64.464 162.68 61.608 163.296 58.724 163.64C55.604 164.016 53.072 161.24 53.888 157.96C56.644 146.844 61.696 137.012 70.776 129.62C71.1016 129.582 71.4312 129.645 71.72 129.8C75.572 132.972 80.42 133.292 84.976 134.432C89.4 135.544 93.964 135.86 98.464 135.896C106.903 135.983 115.297 134.666 123.304 132C124.494 131.637 125.587 131.012 126.504 130.172C126.935 129.683 127.542 129.384 128.192 129.34V129.34Z"
          fill="#1D1D1B" />
        <path
          d="M67.3281 162.184C67.9557 159.276 68.8944 156.443 70.1281 153.736C71.1961 151.3 73.0761 149.736 75.5801 148.812C85.0548 145.191 95.2275 143.767 105.332 144.648C111.655 145.251 117.862 146.732 123.776 149.048C124.873 149.463 125.872 150.101 126.71 150.921C127.548 151.742 128.207 152.728 128.644 153.816C129.834 156.473 130.748 159.245 131.372 162.088C119.064 160.428 106.708 159.536 94.2801 159.904C85.9732 160.122 77.686 160.822 69.4601 162C68.7561 162.108 68.0401 162.128 67.3281 162.184Z"
          fill="#FEFEFE" />
        <path
          d="M128.192 129.34C126.992 131.228 125.276 132.348 123.14 133.008C107.348 137.901 91.5576 137.919 75.7682 133.06C73.7002 132.424 71.9962 131.408 70.7722 129.62C74.8997 125.943 79.7982 123.237 85.1082 121.7C100.688 117.2 115.14 119.396 128.192 129.34Z"
          fill="#FEFEFE" />
        <path
          d="M100.248 165.688C102.631 165.485 105.03 165.735 107.32 166.424C109.428 167.124 110.592 168.824 110.256 170.648C109.856 172.788 108.444 174.068 106.072 173.808C101.86 173.344 97.6719 173.496 93.4879 173.808C91.0879 173.992 89.6679 172.724 89.3519 170.608C89.0679 168.7 90.1519 167.008 92.3199 166.42C94.9042 165.741 97.583 165.494 100.248 165.688V165.688Z"
          fill="#A6151C" />
        <path
          d="M168.328 59.684C172.728 65.84 174.924 72.64 174.664 80.276C174.176 94.644 162.596 107.596 148.34 109.528C128.148 112.26 111.512 97.164 112.304 76.808C112.348 75.712 112.588 74.624 112.74 73.536C119.792 69.784 126.224 64.86 134.052 62.58C140.491 60.6424 147.11 59.3638 153.808 58.764C157.628 58.456 161.436 58.5 165.248 58.476C166.4 58.468 167.6 58.484 168.328 59.684Z"
          fill="#FEFEFE" />
        <path
          d="M168.328 59.6841C159.424 58.6881 150.632 59.5281 141.928 61.3761C133.028 63.2641 124.8 66.7041 117.416 72.0641C116.028 73.0721 114.576 73.8921 112.756 73.5361C111.429 72.998 110.336 72.0056 109.672 70.7361C108.532 68.7761 107.272 66.8921 106.108 64.9361C104.616 62.4041 105.1 59.9161 107.26 58.6401C109.34 57.4081 111.636 58.1201 113.26 60.4921C115.204 63.3441 115.196 63.3281 118.22 61.5881C128.22 55.8361 139.02 52.7041 150.412 51.4241C156.414 50.8063 162.457 50.7059 168.476 51.1241C170.508 51.2441 172.184 51.9881 172.896 54.0161C173.48 55.6761 173.048 57.2161 171.772 58.4681C170.8 59.4001 169.544 59.4881 168.328 59.6841Z"
          fill="#1D1D1B" />
        <path
          d="M142 76.696C145.607 76.6859 149.07 78.1091 151.628 80.6525C154.185 83.1958 155.628 86.651 155.638 90.258C155.648 93.8649 154.225 97.3281 151.681 99.8858C149.138 102.443 145.683 103.886 142.076 103.896C134.656 103.94 128.456 97.78 128.4 90.296C128.344 82.812 134.516 76.724 142 76.696Z"
          fill="#1D1D1B" />
        <path
          d="M140.648 83.3639C140.688 85.3159 138.224 87.9679 136.228 88.1199C134.736 88.2319 133.872 87.2999 134.252 85.8199C134.468 84.8689 134.92 83.9877 135.567 83.2578C136.214 82.5279 137.034 81.9728 137.952 81.6439C139.476 81.0759 140.62 81.8559 140.648 83.3639Z"
          fill="#FCFCFC" />
        <path
          d="M86.8719 73.528C89.9119 93.288 74.9199 110.608 55.1519 109.852C43.1999 109.396 33.9999 103.752 28.5039 93.092C22.7999 82 23.7879 71.068 30.6319 60.66C30.8479 60.336 31.0599 60.012 31.2759 59.692C31.8199 58.696 32.7879 58.524 33.7679 58.492C48.0639 58.064 61.9159 59.972 74.8439 66.492C77.4688 67.7614 79.9554 69.2989 82.2639 71.08C83.6559 72.216 85.4079 72.588 86.8719 73.528Z"
          fill="#FEFEFE" />
        <path
          d="M86.872 73.5281C84.972 73.9281 83.504 72.9841 82.048 71.9641C67.04 61.4241 50.12 58.5321 32.232 59.5401C31.9107 59.5732 31.5916 59.6239 31.276 59.6921C29.488 59.4721 27.808 59.0601 26.936 57.2281C26.6517 56.6787 26.4975 56.0712 26.4854 55.4527C26.4733 54.8342 26.6035 54.2211 26.866 53.661C27.1285 53.1008 27.5162 52.6084 27.9993 52.222C28.4824 51.8355 29.0478 51.5653 29.652 51.4321C32.372 50.7681 35.2 50.8321 37.968 50.8321C51.968 50.8321 65.408 53.4281 78.012 59.7121C79.868 60.6361 81.656 61.7121 83.42 62.7801C84.288 63.3121 84.752 63.2001 85.264 62.3281C85.8586 61.2514 86.5652 60.2405 87.372 59.3121C88.0007 58.6458 88.8391 58.2156 89.747 58.0933C90.6549 57.971 91.5773 58.164 92.36 58.6401C93.932 59.5641 94.916 61.6361 94.204 63.3361C92.832 66.6321 90.76 69.5561 88.664 72.4361C88.284 72.9561 87.48 73.1721 86.872 73.5281Z"
          fill="#1D1D1B" />
        <path
          d="M57.4839 76.6921C61.088 76.6823 64.5503 78.0952 67.1186 80.6238C69.6869 83.1523 71.1535 86.5922 71.1999 90.1961C71.3199 97.572 65.1679 103.796 57.6559 103.896C50.2279 104 44.0559 97.896 43.9839 90.3721C43.9626 86.7685 45.3723 83.3039 47.9035 80.7389C50.4347 78.174 53.8804 76.7185 57.4839 76.6921V76.6921Z"
          fill="#1D1D1B" />
        <path
          d="M60.212 81.5C62.836 81.432 65.716 84.552 65.412 86.608C65.248 87.784 64.492 88.208 63.348 88.12C61.428 87.948 59.012 85.464 58.948 83.536C58.936 82.352 59.42 81.54 60.212 81.5Z"
          fill="#FCFCFC" />
      </svg>  -->

      <!-- <CheckCircleIcon v-if="messages.type === 'success'" class="text-success" /> -->


      <div class="ml-4 mr-4 ">
        <!-- <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}
        </div> -->
        <div class="text-slate-500 mt-1">
          {{ messages.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->


    <div class=" my-5 lg:my-0">
      <img v-if="entrepriseLogo" class="mx-auto max-h-[100px]   " :src="entrepriseLogo">
      <img v-else class="mx-auto w-auto max-w-prose " src="../../assets/images/logo.png">

    </div>



    <Modal :show="showImage" @hidden="showImage = false">


      <!-- passable -->

      <picture v-if="passable" class="absolute left-1/2 z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f_1f3fe/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f64f_1f3fe/512.gif" alt=":pray:" width="32" height="32">
      </picture>


      <!-- mauvais  -->
      <picture v-if="mauvais" class="absolute left-1/2 z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/512.gif" alt=":cry:" width="32" height="32">
      </picture>


      <!-- bien  -->
      <picture v-if="bien" class="absolute left-1/2 z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.gif" alt=":smiling_face_with_3_hearts:"
          width="32" height="32">
      </picture>




    </Modal>






    <div class="my-6 lg:my-2 mx-auto  text-center ">
      <p v-if="campagneEnCours.nom" class="text-lg  intro-x  text-center my-3">{{ campagneEnCours.nom
      }}</p>

      <p v-else class="text-lg text-center  intro-x  my-3"> Campagne Name </p>

      <h1 v-if="indicateurEnCours.nom"
        class="text-xl w-2/3 sm:w-full sm:text-xl md:text-2xl lg:text-3xl intro-x   xl:text-2xl  2xl:text-4xl  font-black text-black  _text-violet-900  border-blue-700 inline-block mx-auto ">
        {{ i + 1 }} - {{ indicateurEnCours.nom }}
      </h1>

      <h1 v-else
        class="text-xl w-2/3 sm:w-full  intro-x  sm:text-xl md:text-2xl lg:text-3xl   xl:text-2xl  2xl:text-4xl  font-black text-black  _text-violet-900  border-blue-700 inline-block mx-auto ">
        Indicateur en cours
      </h1>
    </div>



    <img src="" alt="">

    <!-- bouton -->
    <div class="flex justify-around h-1/3 items-center ">


      <div class="flex flex-col items-center">
        <button :disabled="desactiverBouton" class="pushable rounded-full flex  flex-row  justify-center items-center "
          @click="voter(1)">
          <span class="front shadow-xl shadow-green-500  flex justify-center items-center">

            <svg class=" h-auto w-[6.25rem]  md:w-[9.375rem] lg:w-[12.5rem]   xl:w-[15.625rem]  2xl:w-[18.75rem]"
              width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1611_8554)">
                <path
                  d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
                  fill="#3AAA35" />
                <path
                  d="M162.768 22.16C176.164 39.5945 183.41 60.9736 183.376 82.96C183.376 138.188 138.604 182.96 83.376 182.96C60.5306 182.993 38.3687 175.169 20.608 160.8C29.9345 173.001 41.9501 182.885 55.7201 189.684C69.49 196.483 84.643 200.013 100 200C155.228 200 200 155.228 200 100C200.013 85.0664 196.675 70.3201 190.231 56.8483C183.787 43.3764 174.402 31.5224 162.768 22.16V22.16Z"
                  fill="#2B7E27" />
                <path
                  d="M100.868 155.352C84.468 155.176 70.98 149.996 59.508 139.66C57.224 137.608 56.896 134.808 58.64 132.768C60.384 130.728 63.204 130.556 65.572 132.616C70.06 136.524 74.852 139.944 80.42 142.088C98.572 149.08 115.456 146.745 131.072 135.084C132.316 134.152 133.428 133.04 134.696 132.148C136.852 130.636 139.452 130.948 140.992 132.796C142.532 134.644 142.448 137.42 140.5 139.284C137.686 141.981 134.589 144.366 131.264 146.4C121.66 152.28 111.064 155.276 100.868 155.352Z"
                  fill="#1D1D1B" />
                <path
                  d="M152.1 88.028C152.048 96.616 144.996 103.66 136.5 103.628C132.371 103.576 128.425 101.913 125.504 98.9938C122.583 96.0744 120.918 92.1294 120.864 88C120.836 79.412 128.064 72.216 136.628 72.344C140.758 72.3778 144.706 74.0478 147.606 76.9879C150.506 79.928 152.122 83.8982 152.1 88.028V88.028Z"
                  fill="#1D1D1B" />
                <path
                  d="M47.508 87.94C47.5005 83.7973 49.1391 79.8214 52.0632 76.8868C54.9872 73.9522 58.9573 72.2994 63.1 72.292C67.2427 72.2846 71.2186 73.9231 74.1532 76.8472C77.0878 79.7713 78.7406 83.7413 78.748 87.884C78.816 96.416 71.528 103.716 63.036 103.628C58.9057 103.578 54.9612 101.903 52.0554 98.9677C49.1496 96.032 47.5161 92.0706 47.508 87.94Z"
                  fill="#1D1D1B" />
                <path
                  d="M142.1 84.248C140.1 84.08 138.28 83.508 137.148 81.7C135.896 79.7 136.912 77.7 139.292 77.652C140.398 77.6219 141.493 77.8756 142.474 78.3889C143.454 78.9021 144.287 79.6578 144.892 80.584C145.165 80.9153 145.334 81.3203 145.377 81.7475C145.419 82.1748 145.334 82.6051 145.132 82.984C144.484 84.172 143.348 84.332 142.1 84.248Z"
                  fill="#5A5F62" />
                <path
                  d="M68.3719 84.248C67.0199 84.308 65.5479 83.556 64.2719 82.372C63.3559 81.516 62.8919 80.42 63.2919 79.204C63.7279 77.88 65.0039 77.64 66.1639 77.648C67.0432 77.6376 67.9147 77.8133 68.7213 78.1635C69.5278 78.5137 70.2512 79.0305 70.8439 79.68C71.6439 80.536 72.308 81.528 71.752 82.836C71.196 84.144 69.9999 84.208 68.3719 84.248Z"
                  fill="#5A5E62" />
              </g>
              <defs>
                <clipPath id="clip0_1611_8554">
                  <rect width="200" height="200" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>


        </button>

        <p class="text-lg font-bold mt-3"> Bon</p>
      </div>


      <div class="flex flex-col items-center">

        <button :disabled="desactiverBouton" class="pushable rounded-full flex justify-center items-center"
          @click="voter(2)">
          <span class="front shadow-xl shadow-yellow-300 ">
            <svg class=" h-auto w-[6.25rem]  md:w-[9.375rem] lg:w-[12.5rem]   xl:w-[15.625rem]  2xl:w-[18.75rem]"
              width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
                fill="#F39200" />
              <path
                d="M162.76 22.16C176.16 39.6 183.4 60.96 183.36 82.96C183.36 138.2 138.6 182.96 83.3601 182.96C60.5201 183 38.3601 175.16 20.6001 160.8C39.5201 185.52 68.8801 200.04 100 200C155.24 200 200 155.24 200 100C200.04 69.76 186.32 41.12 162.76 22.16Z"
                fill="#D78300" />
              <path
                d="M101.88 127.16C114.08 127.44 125.16 131.36 133.52 141.24C136.64 144.96 139.04 149.08 139.68 154.04C140.24 158.16 138.16 159.92 134.16 158.76C131.68 158 129.36 156.84 127 155.72C120.96 152.84 114.88 150.16 108.24 148.92C99.2 147.24 90.68 149.04 82.48 152.64C78.52 154.4 74.6 156.32 70.64 158.04C68.64 158.92 66.4 160.04 64.4 158.36C62.32 156.6 63.04 154.12 63.68 151.96C66 143.88 71.28 138.04 78.16 133.6C85.24 129.04 93.16 127.32 101.88 127.16Z"
                fill="#1D1D1B" />
              <path
                d="M135.88 102.28C127 102.04 119.76 94.6 120.12 86.08C120.48 77.12 127.8 70.08 136.36 70.4C145.4 70.72 152.32 77.96 152.04 86.8C151.8 95.56 144.52 102.52 135.88 102.28Z"
                fill="#1D1D1B" />
              <path
                d="M139.88 75.8C142.28 75.72 145.32 78.56 145.4 80.96C145.44 82.68 144.36 83.68 142.68 83.32C140.6 82.96 138.84 81.56 137.92 79.64C136.96 77.72 137.96 75.88 139.88 75.8Z"
                fill="#5A5F63" />
              <path
                d="M63.48 102.28C54.68 102.28 47.52 95.12 47.52 86.32C47.52 77.52 54.68 70.36 63.48 70.36C72.24 70.4 79.48 77.6 79.48 86.32C79.48 95.04 72.24 102.28 63.48 102.28Z"
                fill="#1D1D1B" />
              <path
                d="M70.2798 83.4C68.0398 83.32 65.0798 80.72 64.7998 78.56C64.5598 76.88 65.9198 75.64 67.7598 75.84C69.8398 76.08 72.4798 78.6 72.8398 80.68C73.0798 82.2 71.8798 83.44 70.2798 83.4Z"
                fill="#595E62" />
            </svg>
          </span>

        </button>
        <p class="text-lg font-bold mt-3"> Passable</p>
      </div>


      <div class="flex flex-col items-center">
        <button :disabled="desactiverBouton" class="pushable rounded-full flex justify-center items-center"
          @click="voter(3)">
          <span class="front  shadow-xl shadow-red-400">
            <svg class=" h-auto    w-[6.25rem]  md:w-[9.375rem] lg:w-[12.5rem]   xl:w-[15.625rem]  2xl:w-[18.75rem]"
              width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
                fill="#BE1622" />
              <path
                d="M162.768 22.16C176.163 39.5946 183.41 60.9736 183.376 82.96C183.376 138.188 138.604 182.96 83.3759 182.96C60.5305 182.993 38.3686 175.169 20.6079 160.8C29.9344 173.001 41.95 182.885 55.72 189.684C69.4899 196.483 84.6429 200.013 99.9999 200C155.228 200 200 155.228 200 100C200.013 85.0664 196.675 70.3202 190.231 56.8483C183.787 43.3764 174.402 31.5224 162.768 22.16V22.16Z"
                fill="#A6151C" />
              <path
                d="M128.192 129.34C137.392 136.688 142.72 146.444 145.668 157.632C146.644 161.344 143.788 164.192 140.008 163.552L131.376 162.092C130.528 161.504 130.144 160.628 129.828 159.692C129.148 157.672 128.564 155.616 127.548 153.692C126.611 151.821 124.985 150.387 123.012 149.692C116.276 147.292 109.412 145.692 102.212 145.36C93.1486 144.98 84.1046 146.478 75.648 149.76C74.5487 150.162 73.5456 150.79 72.7032 151.603C71.8607 152.416 71.1975 153.396 70.756 154.48C69.956 156.328 69.32 158.232 68.708 160.144C68.513 160.969 68.0238 161.694 67.332 162.184C64.464 162.68 61.608 163.296 58.724 163.64C55.604 164.016 53.072 161.24 53.888 157.96C56.644 146.844 61.696 137.012 70.776 129.62C71.1016 129.582 71.4312 129.645 71.72 129.8C75.572 132.972 80.42 133.292 84.976 134.432C89.4 135.544 93.964 135.86 98.464 135.896C106.903 135.983 115.297 134.666 123.304 132C124.494 131.637 125.587 131.012 126.504 130.172C126.935 129.683 127.542 129.384 128.192 129.34V129.34Z"
                fill="#1D1D1B" />
              <path
                d="M67.3281 162.184C67.9557 159.276 68.8944 156.443 70.1281 153.736C71.1961 151.3 73.0761 149.736 75.5801 148.812C85.0548 145.191 95.2275 143.767 105.332 144.648C111.655 145.251 117.862 146.732 123.776 149.048C124.873 149.463 125.872 150.101 126.71 150.921C127.548 151.742 128.207 152.728 128.644 153.816C129.834 156.473 130.748 159.245 131.372 162.088C119.064 160.428 106.708 159.536 94.2801 159.904C85.9732 160.122 77.686 160.822 69.4601 162C68.7561 162.108 68.0401 162.128 67.3281 162.184Z"
                fill="#FEFEFE" />
              <path
                d="M128.192 129.34C126.992 131.228 125.276 132.348 123.14 133.008C107.348 137.901 91.5576 137.919 75.7682 133.06C73.7002 132.424 71.9962 131.408 70.7722 129.62C74.8997 125.943 79.7982 123.237 85.1082 121.7C100.688 117.2 115.14 119.396 128.192 129.34Z"
                fill="#FEFEFE" />
              <path
                d="M100.248 165.688C102.631 165.485 105.03 165.735 107.32 166.424C109.428 167.124 110.592 168.824 110.256 170.648C109.856 172.788 108.444 174.068 106.072 173.808C101.86 173.344 97.6719 173.496 93.4879 173.808C91.0879 173.992 89.6679 172.724 89.3519 170.608C89.0679 168.7 90.1519 167.008 92.3199 166.42C94.9042 165.741 97.583 165.494 100.248 165.688V165.688Z"
                fill="#A6151C" />
              <path
                d="M168.328 59.684C172.728 65.84 174.924 72.64 174.664 80.276C174.176 94.644 162.596 107.596 148.34 109.528C128.148 112.26 111.512 97.164 112.304 76.808C112.348 75.712 112.588 74.624 112.74 73.536C119.792 69.784 126.224 64.86 134.052 62.58C140.491 60.6424 147.11 59.3638 153.808 58.764C157.628 58.456 161.436 58.5 165.248 58.476C166.4 58.468 167.6 58.484 168.328 59.684Z"
                fill="#FEFEFE" />
              <path
                d="M168.328 59.6841C159.424 58.6881 150.632 59.5281 141.928 61.3761C133.028 63.2641 124.8 66.7041 117.416 72.0641C116.028 73.0721 114.576 73.8921 112.756 73.5361C111.429 72.998 110.336 72.0056 109.672 70.7361C108.532 68.7761 107.272 66.8921 106.108 64.9361C104.616 62.4041 105.1 59.9161 107.26 58.6401C109.34 57.4081 111.636 58.1201 113.26 60.4921C115.204 63.3441 115.196 63.3281 118.22 61.5881C128.22 55.8361 139.02 52.7041 150.412 51.4241C156.414 50.8063 162.457 50.7059 168.476 51.1241C170.508 51.2441 172.184 51.9881 172.896 54.0161C173.48 55.6761 173.048 57.2161 171.772 58.4681C170.8 59.4001 169.544 59.4881 168.328 59.6841Z"
                fill="#1D1D1B" />
              <path
                d="M142 76.696C145.607 76.6859 149.07 78.1091 151.628 80.6525C154.185 83.1958 155.628 86.651 155.638 90.258C155.648 93.8649 154.225 97.3281 151.681 99.8858C149.138 102.443 145.683 103.886 142.076 103.896C134.656 103.94 128.456 97.78 128.4 90.296C128.344 82.812 134.516 76.724 142 76.696Z"
                fill="#1D1D1B" />
              <path
                d="M140.648 83.3639C140.688 85.3159 138.224 87.9679 136.228 88.1199C134.736 88.2319 133.872 87.2999 134.252 85.8199C134.468 84.8689 134.92 83.9877 135.567 83.2578C136.214 82.5279 137.034 81.9728 137.952 81.6439C139.476 81.0759 140.62 81.8559 140.648 83.3639Z"
                fill="#FCFCFC" />
              <path
                d="M86.8719 73.528C89.9119 93.288 74.9199 110.608 55.1519 109.852C43.1999 109.396 33.9999 103.752 28.5039 93.092C22.7999 82 23.7879 71.068 30.6319 60.66C30.8479 60.336 31.0599 60.012 31.2759 59.692C31.8199 58.696 32.7879 58.524 33.7679 58.492C48.0639 58.064 61.9159 59.972 74.8439 66.492C77.4688 67.7614 79.9554 69.2989 82.2639 71.08C83.6559 72.216 85.4079 72.588 86.8719 73.528Z"
                fill="#FEFEFE" />
              <path
                d="M86.872 73.5281C84.972 73.9281 83.504 72.9841 82.048 71.9641C67.04 61.4241 50.12 58.5321 32.232 59.5401C31.9107 59.5732 31.5916 59.6239 31.276 59.6921C29.488 59.4721 27.808 59.0601 26.936 57.2281C26.6517 56.6787 26.4975 56.0712 26.4854 55.4527C26.4733 54.8342 26.6035 54.2211 26.866 53.661C27.1285 53.1008 27.5162 52.6084 27.9993 52.222C28.4824 51.8355 29.0478 51.5653 29.652 51.4321C32.372 50.7681 35.2 50.8321 37.968 50.8321C51.968 50.8321 65.408 53.4281 78.012 59.7121C79.868 60.6361 81.656 61.7121 83.42 62.7801C84.288 63.3121 84.752 63.2001 85.264 62.3281C85.8586 61.2514 86.5652 60.2405 87.372 59.3121C88.0007 58.6458 88.8391 58.2156 89.747 58.0933C90.6549 57.971 91.5773 58.164 92.36 58.6401C93.932 59.5641 94.916 61.6361 94.204 63.3361C92.832 66.6321 90.76 69.5561 88.664 72.4361C88.284 72.9561 87.48 73.1721 86.872 73.5281Z"
                fill="#1D1D1B" />
              <path
                d="M57.4839 76.6921C61.088 76.6823 64.5503 78.0952 67.1186 80.6238C69.6869 83.1523 71.1535 86.5922 71.1999 90.1961C71.3199 97.572 65.1679 103.796 57.6559 103.896C50.2279 104 44.0559 97.896 43.9839 90.3721C43.9626 86.7685 45.3723 83.3039 47.9035 80.7389C50.4347 78.174 53.8804 76.7185 57.4839 76.6921V76.6921Z"
                fill="#1D1D1B" />
              <path
                d="M60.212 81.5C62.836 81.432 65.716 84.552 65.412 86.608C65.248 87.784 64.492 88.208 63.348 88.12C61.428 87.948 59.012 85.464 58.948 83.536C58.936 82.352 59.42 81.54 60.212 81.5Z"
                fill="#FCFCFC" />
            </svg>
          </span>
        </button>
        <p class="text-lg font-bold mt-3"> Médiocre</p>
      </div>


    </div>
    <!-- bouton -->


    <div class="h-[100px] text-center font-bold my-3">

    </div>


    <div class="absolute left-1/2 -translate-x-1/2 bottom-[50px] font-bold ">
      <span class="py-1 px-2 bg-pending rounded-lg shadow-lg">{{ i + 1 }} </span> / {{
        campagneEnCours.indicateurSelect.length }}
    </div>



    <svg class=" hidden  absolute bottom-0 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#0099ff" fill-opacity="1"
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
      </path>
    </svg>


    <div
      class="text-xs sm:text-sm w-full items-center  text-center  bg-[#0E74BC]  p-1 border  flex  absolute bottom-0     flex-col  text-white ">
      <img class="w-[50px] inline-block" src="../../assets/images/logo.png" alt="">
      <span class="text-[11px] text-white inline-block font-medium">Made by CELERITE HOLDING</span>
    </div>






  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue'; import { helper as $h } from "@/utils/helper";

import { useRouter, useRoute } from 'vue-router'
import BsdService from "@/services/modules/bsd.service";
import CampagneService from "@/services/modules/campagne.service";
import { API_BASE_URL } from "@/services/configs/environment";


const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const successNotification = ref();
const search = ref('')
const refresh = ref(0)
const resolutions = ref([])
const boiteDialog = ref(false)
const desactiverBouton = ref(false)
const plainte = ref('') // contenu de la plainte du client

const messages = reactive({
  type: 'success',
  message: '',
})

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggles = () => {
  // Show notification
  successNotification.value.showToast();
};


const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const campagneId = ref(0)
const end = ref(0)
const lastRequete = ref(new Date().getTime())
const bsdId = ref([])
const updateTypeId = ref([])
const campagnes = ref([])
const bsdCampagnes = ref([])
const bien = ref(false)
const passable = ref(false)
const mauvais = ref(false)
const emoticonModal = ref(true)
const info = ref({
  campagnesListe: [],
  lastDate: []
})

const campagneEnCours = reactive({
  nom: '',
  id: '',
  index: "",
  entreprise: {
    nom: '',
    refresh: 0
  },
  indicateurSelect: []
})
const indicateurEnCours = reactive({
  nom: '',
  id: '',
})
const c = ref(0)
const i = ref(0)
const formData = reactive({
  valeur: '',
  indicateurId: Number,
  bsdCampagneId: Number,
  commentaire: '',
})

const message = reactive({
  type: 'success',
  message: '',
})

const getLocalStorageInfo = ref({})

onMounted(function () {

  if (localStorage.getItem('infoVotes')) {
    getLocalStorageInfo.value = JSON.parse(localStorage.getItem('infoVotes'))
  }





  getCampagne()
  lancerMaFonction()

})

const entrepriseLogo = ref('')
function getCampagne() {
  BsdService.campagnes(route.params.code).then((data) => {
    campagnes.value = data.data.data[0]
    // console.log(campagnes.value[0].entreprise.admin.profil)

    entrepriseLogo.value = API_BASE_URL + campagnes.value[0].entreprise.admin.profil



    bsdCampagnes.value = data.data.data[1]
    bsdId.value = data.data.data[2]

    c.value = 0
    i.value = 0
    campagneEnCours.nom = campagnes.value[c.value].nom
    campagneEnCours.id = campagnes.value[c.value].id
    campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
    campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.refresh
    campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

    indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
    indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id

    refresh.value = campagneEnCours.entreprise.refresh




  }).catch((e) => {
    // disabled()
    //alert(e)
  })
}

// provide("bind[successNotification]", (el) => {
//   // Binding
//   successNotification.value = el;
// });
// const successNotificationToggle = () => {
//   // Show notification
//   successNotification.value.showToast();
// };

function maFonction() {
  if ((new Date().getTime() - lastRequete.value >= (refresh.value * 1000)) && i.value) {
    getCampagne()
  }
}


function lancerMaFonction() {
  setInterval(() => {
    maFonction();
  }, 1000);
  setInterval(() => {
    if (i.value == 0) {

      const synth = window.speechSynthesis;

      // Création d'un objet d'énoncé (phrase) 
      const utterance = new SpeechSynthesisUtterance('Welcome to our company, please leave your complaint here. Thank you');

      // Sélection de la voix féminine
      utterance.voice = synth.getVoices().find((voice) => voice.name === 'Google UK English Female');

      // Lancement de la synthèse vocale
      synth.speak(utterance);

      const audiotest = new SpeechSynthesisUtterance("Bienvenue Chez nous ,veuillez laisser votre plainte ici");

      window.speechSynthesis.speak(audiotest);
    }

  },

    15200);


}



// show emoticon   -------------------------------->
const showImage = ref(false);
const hideImageAfterDelay = () => {

  setTimeout(() => {
    showImage.value = false;

    //  console.log('ok')
  }, 1500);
};
// show emoticon   -------------------------------->




let couple = reactive({
  campagneId: '',
  indicateurId: ''

})

const verification = ref(false);



function voter(value) {

  //  desactiverBouton.value = true

  if (!end.value) {



    formData.valeur = value
    formData.indicateurId = indicateurEnCours.id
    formData.bsdCampagneId = bsdCampagnes.value[c.value]

    couple.campagneId = formData.bsdCampagneId
    couple.indicateurId = formData.indicateurId

    if (!localStorage.getItem("infoVotes")) {


      if (value == '1') {
        showImage.value = true
        bien.value = true
        passable.value = false
        mauvais.value = false
        hideImageAfterDelay()


      }


      if (value == '2') {
        showImage.value = true


        bien.value = false
        passable.value = true
        mauvais.value = false
        hideImageAfterDelay()

      }


      if (value == '3') {
        showImage.value = true
        bien.value = false
        passable.value = false
        mauvais.value = true
        hideImageAfterDelay()


      }


      BsdService.voter(bsdId.value, formData).then((data) => {

        // desactiverBouton.value = false /




        messages.message = "Votre avis a été pris en compte"
        successNotificationToggles()



        const audio = new Audio('../src/assets/son/son1.mp3');
        audio.play();
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 800);
        lastRequete.value = new Date().getTime()
        i.value++


        info.value.campagnesListe.push(couple)

        couple = {
          campagneId: '',
          indicateurId: ''
        }

        info.value.lastDate.push(new Date)

        localStorage.setItem('infoVotes', JSON.stringify(info.value))

        // desactiverBouton.value = false

        if (i.value == campagneEnCours.indicateurSelect.length) {
          i.value = 0
          c.value++

          if (c.value == campagnes.value.length) {
            i.value = 0
            c.value = 0
            // end.value = 1

            // afficher message de fin

            message.type = 'success'
            message.message = 'Merci pour le temps que vous nous avez accordé ,Aurevoir'

            console.log(message.message)
            successNotificationToggles()
            const audiotest = new SpeechSynthesisUtterance(message.message);
            window.speechSynthesis.speak(audiotest);

            // setTimeout(messageFin.value = false, 5000);
          }
        }

        campagneEnCours.nom = campagnes.value[c.value].nom
        campagneEnCours.id = campagnes.value[c.value].id
        campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
        campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
        campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect
        if (i.value == 1) {
          const message = new SpeechSynthesisUtterance(campagneEnCours.nom);
          window.speechSynthesis.speak(message);

        }
        indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
        indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id
        setTimeout(function () {
          const message = new SpeechSynthesisUtterance(indicateurEnCours.nom);
          window.speechSynthesis.speak(message);
        }, 2000);



      }).catch((e) => {


        // disabled()
        //alert(e)
      })


    } else {




      // let objetPresent = getLocalStorageInfo.value.campagnesListe.find(item => item.campagneId === couple.campagneId && item.indicateurId === couple.indicateurId) 

      for (var a = 0; a < getLocalStorageInfo.value.campagnesListe.length; a++) {

        if (couple.campagneId == getLocalStorageInfo.value.campagnesListe[a].campagneId && couple.indicateurId == getLocalStorageInfo.value.campagnesListe[a].indicateurId) {

          verification.value = true


        }
      }


      console.log(verification.value)

      if (verification.value) {

        verification.value = false



        messages.message = "Vous avez déja donné votre avis pour ce indicateur"
        successNotificationToggles()

        // desactiverBouton.value = false

        i.value++

        if (i.value == campagneEnCours.indicateurSelect.length) {
          i.value = 0
          c.value++

          if (c.value == campagnes.value.length) {
            i.value = 0
            c.value = 0
            // end.value = 1

            // afficher message de fin

            message.type = 'success'
            message.message = 'Merci pour le temps que vous nous avez accordé ,Aurevoir'

            console.log(message.message)
            successNotificationToggles()
            const audiotest = new SpeechSynthesisUtterance(message.message);
            window.speechSynthesis.speak(audiotest);

            // setTimeout(messageFin.value = false, 5000);
          }
        }



        campagneEnCours.nom = campagnes.value[c.value].nom
        campagneEnCours.id = campagnes.value[c.value].id
        campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
        campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
        campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

        if (i.value == 1) {
          const message = new SpeechSynthesisUtterance(campagneEnCours.nom);
          window.speechSynthesis.speak(message);

        }


        indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
        indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id





      } else {


        if (value == '1') {
          showImage.value = true
          bien.value = true
          passable.value = false
          mauvais.value = false
          hideImageAfterDelay()


        }


        if (value == '2') {
          showImage.value = true


          bien.value = false
          passable.value = true
          mauvais.value = false
          hideImageAfterDelay()

        }


        if (value == '3') {
          showImage.value = true
          bien.value = false
          passable.value = false
          mauvais.value = true
          hideImageAfterDelay()


        }



        BsdService.voter(bsdId.value, formData).then((data) => {

          // desactiverBouton.value = false



          messages.message = "Votre avis a été pris en compte"
          successNotificationToggles()

          const audio = new Audio('../src/assets/son/son1.mp3');
          audio.play();
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 800);
          lastRequete.value = new Date().getTime()
          i.value++


          // couple.campagneId = formData.bsdCampagneId

          // couple.indicateurId = formData.indicateurId


          info.value = JSON.parse(localStorage.getItem('infoVotes'))

          info.value.campagnesListe.push(couple)

          couple = {
            campagneId: '',
            indicateurId: ''
          }

          info.value.lastDate.push(new Date)

          localStorage.setItem('infoVotes', JSON.stringify(info.value))



          if (i.value == campagneEnCours.indicateurSelect.length) {
            i.value = 0
            c.value++

            if (c.value == campagnes.value.length) {
              i.value = 0
              c.value = 0
              // end.value = 1

              // afficher message de fin

              message.type = 'success'
              message.message = 'Merci pour le temps que vous nous avez accordé ,Aurevoir'

              console.log(message.message)
              successNotificationToggles()
              const audiotest = new SpeechSynthesisUtterance(message.message);
              window.speechSynthesis.speak(audiotest);

              // setTimeout(messageFin.value = false, 5000);
            }
          }

          campagneEnCours.nom = campagnes.value[c.value].nom
          campagneEnCours.id = campagnes.value[c.value].id
          campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
          campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
          campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

          if (i.value == 1) {
            const message = new SpeechSynthesisUtterance(campagneEnCours.nom);
            window.speechSynthesis.speak(message);

          }

          indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
          indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id

          setTimeout(function () {
            const message = new SpeechSynthesisUtterance(indicateurEnCours.nom);
            window.speechSynthesis.speak(message);
          }, 2000);



        }).catch((e) => {
          // disabled()
          //alert(e)
        })
      }




    }


  }

}





function next() {

  if (!end.value) {
    i.value++

    if (i.value == campagneEnCours.indicateurSelect.length) {
      i.value = 0



      c.value++

      if (c.value == campagnes.value.length) {

        end.value = 1













        message.type = 'success'
        message.message = 'Merci pour le temps que vous nous avez accordé'
        successNotificationToggles()


      }
    }

    campagneEnCours.nom = campagnes.value[c.value].nom
    campagneEnCours.id = campagnes.value[c.value].id
    campagneEnCours.entreprise.nom = campagnes.value[c.value].entreprise.nom
    campagneEnCours.entreprise.refresh = campagnes.value[c.value].entreprise.nom
    campagneEnCours.indicateurSelect = campagnes.value[c.value].indicateurSelect

    indicateurEnCours.nom = campagneEnCours.indicateurSelect[i.value].nom
    indicateurEnCours.id = campagneEnCours.indicateurSelect[i.value].id




  }



}







// section discussion

function ouvrirFermerDiscution() {
  boiteDialog.value = !boiteDialog.value
}


function fermerDiscution() {
  boiteDialog.value = false
}

function envoyerCommentaire() {



  CampagneService.addComment(campagneEnCours.id, { contenu: plainte.value }).then((comment) => {
    console.log(campagneEnCours.id)
    plainte.value = ""
    message.type = 'success'
    message.message = 'Plainte envoyée avec succès'
    successNotificationToggles()
    boiteDialog.value = false

  }).catch((e) => {
    // disabled()
    //alert(e)
  })
}

// agrandir le champs de text

function inputChange(e) {
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
}

</script>

<style  scoped>
.pushable {
  border-radius: 100%;
  border: none;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;

}

.front {
  display: block;
  border-radius: 100%;
  font-size: 1.25rem;
  transform: translateY(-6px);
}



.pushable:active .front {
  transform: translateY(-2px);
}

.custom-bg {
  color: white;
  background-color: red;
  border: 2px solid white;

}


.bg {
  background-color: white;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}




.chatbox-popup {
  display: flex;
  position: absolute;
  box-shadow: 5px 5px 25px 0 rgba(46, 61, 73, 0.2);
  flex-direction: column;
  /* display: none; */
  top: 115px;
  right: 40px;
  width: 377px;
  height: auto;
  background-color: #fff;
  border-radius: 16px;
  z-index: 10;
}

.chatbox-popup__header {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 16px;
  color: #fff;
  background-color: #0360a5;
  align-items: center;
  justify-content: space-around;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
}

.chatbox-popup__avatar {
  margin-top: -12px;
  background-color: #0360a5;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.chatbox-popup__main {
  box-sizing: border-box;
  width: 100%;
  padding: calc(2 * 16px) 16px;
  line-height: calc(16px + 16px / 2);
  color: #888;
  text-align: center;
}


.chatbox-popup__footer {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 16px;
  border-top: 1px solid #ddd;
  align-items: center;

  justify-content: space-around;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}


.h1_chat {
  margin: 0;
  font-size: 16px;
  line-height: 1;
}


textarea {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding-top: auto;
  display: flex;
  justify-self: center;
  align-items: center;
  font-family: inherit;
  font-size: 16px;
  line-height: calc(16px + 16px / 2);
  color: #888;
  background-color: none;

  /* border: solid 10px; */
  resize: none;
  overflow: hidden;
}

textarea:focus {
  border-style: none;
}

button {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

}

textarea::placeholder {
  color: #888;
}






@media screen and (max-width: 480px) {

  .chatbox-popup {

    /* display: none; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: 0px;
    height: fit-content;
    width: 300px;

  }

  .chatbox-popup__header {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: 8px;
    color: #fff;
    background-color: #0360a5;
    align-items: center;
    justify-content: space-around;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }


  .chatbox-popup__avatar {
    margin-top: -3px;
    background-color: #0360a5;
    border: 2.5px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 50px;
    height: auto;
  }


  .chatbox-popup__footer {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: 8px;
    border-top: 1px solid #ddd;
    align-items: center;

    justify-content: space-around;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
  }


}


/*  */</style>