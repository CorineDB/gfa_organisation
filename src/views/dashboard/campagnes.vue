<template>
  <div class="py-4">
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 3000, }" class="flex">
      <CheckCircleIcon v-if="message.type === 'success'" class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}
        </div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->


    <!-- BEGIN:Campagne Stats Modal Toggle -->

    <!-- BEGIN: Modal Content -->


    <Modal size="modal-xl" :show="CampagneStatPreview" @hidden="CampagneStatPreview = false">

      <a @click="CampagneStatPreview = false" class="absolute right-0 top-0 mt-3 mr-3" href="javascript:;">
        <XIcon class="w-8 h-8 text-slate-400" />
      </a>
      <ModalBody class="p-10 text-center">
        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <!-- <ShoppingCartIcon class="report-box__icon text-primary" /> -->
                  <div class="ml-auto">

                    <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="100%">
                      100%
                      <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.value">
                  {{
                    statistique.value.passable[0] + statistique.value.mediocre[0] +
                    statistique.value.excellent[0] }}

                </div>
                <div class="text-base text-slate-500 mt-1">FeedBack</div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <!-- <CreditCardIcon class="report-box__icon text-pending" /> -->
                  <div class="ml-auto">
                    <Tippy tag="div" class="report-box__indicator bg-danger cursor-pointer"
                      content="2% Lower than last month" v-if="statistique.value">
                      {{ statistique.value.excellent[1] }}
                      <ChevronDownIcon class="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div class="flex justify-between  items-center mt-2">
                  <div>
                    <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.value">
                      {{ statistique.value.excellent[0] }} </div>
                    <div class="text-base text-slate-500 mt-1">Excelent</div>
                  </div>
                  <div>
                    <svg width="65" height="65" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_1601_496)">
                        <path
                          d="M45 90C69.8528 90 90 69.8528 90 45C90 20.1472 69.8528 0 45 0C20.1472 0 0 20.1472 0 45C0 69.8528 20.1472 90 45 90Z"
                          fill="#3AAA35" />
                        <path
                          d="M73.2456 9.97198C79.2736 17.8175 82.5345 27.4381 82.5192 37.332C82.5192 62.1846 62.3718 82.332 37.5192 82.332C27.2388 82.3469 17.2659 78.8261 9.27361 72.36C13.4705 77.8503 18.8775 82.2982 25.074 85.3577C31.2705 88.4173 38.0893 90.0059 45 90C69.8526 90 90 69.8526 90 45C90.006 38.2798 88.5037 31.644 85.604 25.5817C82.7043 19.5194 78.4811 14.1851 73.2456 9.97198Z"
                          fill="#2B7E27" />
                        <path
                          d="M45.3906 69.9084C38.0106 69.8292 31.941 67.4982 26.7786 62.847C25.7508 61.9236 25.6032 60.6636 26.388 59.7456C27.1728 58.8276 28.4418 58.7502 29.5074 59.6772C31.527 61.4358 33.6834 62.9748 36.189 63.9396C44.3574 67.086 51.9552 66.0354 58.9824 60.7878C59.5422 60.3684 60.0426 59.868 60.6132 59.4666C61.5834 58.7862 62.7534 58.9266 63.4464 59.7582C64.1394 60.5898 64.1016 61.839 63.225 62.6778C61.9585 63.8912 60.5651 64.9648 59.0688 65.88C54.747 68.526 49.9788 69.8742 45.3906 69.9084Z"
                          fill="#1D1D1B" />
                        <path
                          d="M68.445 39.6126C68.4216 43.4772 65.2482 46.647 61.425 46.6326C59.5667 46.6093 57.7911 45.861 56.4767 44.5472C55.1623 43.2335 54.4131 41.4582 54.3888 39.6C54.3762 35.7354 57.6288 32.4972 61.4826 32.5548C63.341 32.57 65.1175 33.3215 66.4226 34.6446C67.7278 35.9676 68.455 37.7542 68.445 39.6126Z"
                          fill="#1D1D1B" />
                        <path
                          d="M21.3786 39.573C21.3753 37.7088 22.1126 35.9196 23.4284 34.5991C24.7443 33.2785 26.5308 32.5348 28.395 32.5314C30.2592 32.5281 32.0484 33.2654 33.3689 34.5812C34.6895 35.8971 35.4333 37.6836 35.4366 39.5478C35.4672 43.3872 32.1876 46.6722 28.3662 46.6326C26.5076 46.6099 24.7325 45.8566 23.4249 44.5355C22.1173 43.2144 21.3822 41.4318 21.3786 39.573Z"
                          fill="#1D1D1B" />
                        <path
                          d="M63.945 37.9116C63.045 37.836 62.226 37.5786 61.7166 36.765C61.1532 35.865 61.6104 34.965 62.6814 34.9434C63.1792 34.9299 63.6721 35.044 64.1132 35.275C64.5543 35.5059 64.929 35.846 65.2014 36.2628C65.3243 36.4119 65.4002 36.5941 65.4195 36.7864C65.4387 36.9787 65.4004 37.1723 65.3094 37.3428C65.0178 37.8774 64.5066 37.9494 63.945 37.9116Z"
                          fill="#5A5F62" />
                        <path
                          d="M30.7674 37.9116C30.159 37.9386 29.4966 37.6002 28.9224 37.0674C28.5102 36.6822 28.3014 36.189 28.4814 35.6418C28.6776 35.046 29.2518 34.938 29.7738 34.9416C30.1695 34.9369 30.5616 35.016 30.9246 35.1736C31.2876 35.3312 31.6131 35.5637 31.8798 35.856C32.2398 36.2412 32.5386 36.6876 32.2884 37.2762C32.0382 37.8648 31.5 37.8936 30.7674 37.9116Z"
                          fill="#5A5E62" />
                      </g>
                      <defs>
                        <clipPath id="clip0_1601_496">
                          <rect width="90" height="90" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <!-- <MonitorIcon class="report-box__icon text-warning" /> -->
                  <div class="ml-auto">
                    <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer"
                      content="12% Higher than last month" v-if="statistique.value">
                      {{ statistique.value.passable[1] }}
                      <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div class="flex justify-between  items-center m-2">
                  <div>
                    <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.value">
                      {{ statistique.value.passable[0] }}

                    </div>
                    <div class="text-base text-slate-500 mt-1">
                      Passable
                    </div>
                  </div>
                  <div>
                    <svg width="65" height="65" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_1601_756)">
                        <path
                          d="M45 90C69.8528 90 90 69.8528 90 45C90 20.1472 69.8528 0 45 0C20.1472 0 0 20.1472 0 45C0 69.8528 20.1472 90 45 90Z"
                          fill="#F39200" />
                        <path
                          d="M73.242 9.97198C79.272 17.82 82.53 27.432 82.512 37.332C82.512 62.19 62.37 82.332 37.512 82.332C27.234 82.35 17.262 78.822 9.26999 72.36C17.784 83.484 30.996 90.018 45 90C69.858 90 90 69.858 90 45C90.018 31.392 83.844 18.504 73.242 9.97198Z"
                          fill="#D78300" />
                        <path
                          d="M45.846 57.222C51.336 57.348 56.322 59.112 60.084 63.558C61.488 65.232 62.568 67.086 62.856 69.318C63.108 71.172 62.172 71.964 60.372 71.442C59.256 71.1 58.212 70.578 57.15 70.074C54.432 68.778 51.696 67.572 48.708 67.014C44.64 66.258 40.806 67.068 37.116 68.688C35.334 69.48 33.57 70.344 31.788 71.118C30.888 71.514 29.88 72.018 28.98 71.262C28.044 70.47 28.368 69.354 28.656 68.382C29.7 64.746 32.076 62.118 35.172 60.12C38.358 58.068 41.922 57.294 45.846 57.222Z"
                          fill="#1D1D1B" />
                        <path
                          d="M61.146 46.026C57.15 45.918 53.892 42.57 54.054 38.736C54.216 34.704 57.51 31.536 61.362 31.68C65.43 31.824 68.544 35.082 68.418 39.06C68.31 43.002 65.034 46.134 61.146 46.026Z"
                          fill="#1D1D1B" />
                        <path
                          d="M62.946 34.11C64.026 34.074 65.394 35.352 65.43 36.432C65.448 37.206 64.962 37.656 64.206 37.494C63.27 37.332 62.478 36.702 62.064 35.838C61.632 34.974 62.082 34.146 62.946 34.11Z"
                          fill="#5A5F63" />
                        <path
                          d="M28.566 46.026C24.606 46.026 21.384 42.804 21.384 38.844C21.384 34.884 24.606 31.662 28.566 31.662C32.508 31.68 35.766 34.92 35.766 38.844C35.766 42.768 32.508 46.026 28.566 46.026Z"
                          fill="#1D1D1B" />
                        <path
                          d="M31.626 37.53C30.618 37.494 29.286 36.324 29.16 35.352C29.052 34.596 29.664 34.038 30.492 34.128C31.428 34.236 32.616 35.37 32.778 36.306C32.886 36.99 32.346 37.548 31.626 37.53Z"
                          fill="#595E62" />
                      </g>
                      <defs>
                        <clipPath id="clip0_1601_756">
                          <rect width="90" height="90" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <!-- <UserIcon class="report-box__icon text-success" /> -->
                  <div class="ml-auto">

                    <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer"
                      content="22% Higher than last month" v-if="statistique.value">
                      {{ statistique.value.mediocre[1] }}
                      <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>

                <div class="flex justify-between  items-center m-2">
                  <div>
                    <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.value">
                      {{ statistique.value.mediocre[0] }}
                    </div>
                    <div class="text-base text-slate-500 mt-1">
                      Médiocre
                    </div>
                  </div>
                  <div>
                    <svg width="65" height="65" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_1601_3429)">
                        <path
                          d="M45 90C69.8528 90 90 69.8528 90 45C90 20.1472 69.8528 0 45 0C20.1472 0 0 20.1472 0 45C0 69.8528 20.1472 90 45 90Z"
                          fill="#BE1622" />
                        <path
                          d="M73.2456 9.97198C79.2736 17.8175 82.5345 27.4381 82.5192 37.332C82.5192 62.1846 62.3718 82.332 37.5192 82.332C27.2388 82.347 17.2659 78.8261 9.27362 72.36C13.4705 77.8503 18.8776 82.2982 25.074 85.3577C31.2705 88.4173 38.0894 90.0059 45 90C69.8526 90 90 69.8526 90 45C90.006 38.2798 88.5037 31.644 85.604 25.5817C82.7043 19.5194 78.4811 14.1851 73.2456 9.97198Z"
                          fill="#A6151C" />
                        <path
                          d="M57.6864 58.203C61.8264 61.5096 64.224 65.8998 65.5506 70.9344C65.9898 72.6048 64.7046 73.8864 63.0036 73.5984L59.1192 72.9414C58.7376 72.6768 58.5648 72.2826 58.4226 71.8614C58.1166 70.9524 57.8538 70.0272 57.3966 69.1614C56.9752 68.3196 56.2434 67.6742 55.3554 67.3614C52.3242 66.2814 49.2354 65.5614 45.9954 65.412C41.9169 65.2408 37.8471 65.9149 34.0416 67.392C33.5469 67.5731 33.0956 67.8556 32.7165 68.2214C32.3373 68.5871 32.0389 69.0281 31.8402 69.516C31.4802 70.3476 31.194 71.2044 30.9186 72.0648C30.8309 72.436 30.6107 72.7624 30.2994 72.9828C29.0088 73.206 27.7236 73.4832 26.4258 73.638C25.0218 73.8072 23.8824 72.558 24.2496 71.082C25.4898 66.0798 27.7632 61.6554 31.8492 58.329C31.9958 58.3118 32.1441 58.3401 32.274 58.41C34.0074 59.8374 36.189 59.9814 38.2392 60.4944C40.23 60.9948 42.2838 61.137 44.3088 61.1532C48.1062 61.1923 51.8837 60.5998 55.4868 59.4C56.0222 59.2367 56.5142 58.9556 56.9268 58.5774C57.1209 58.3575 57.3938 58.223 57.6864 58.203Z"
                          fill="#1D1D1B" />
                        <path
                          d="M30.2976 72.9828C30.58 71.6741 31.0024 70.3995 31.5576 69.1812C32.0382 68.085 32.8842 67.3812 34.011 66.9654C38.2746 65.336 42.8523 64.6953 47.3994 65.0916C50.2445 65.3631 53.038 66.0295 55.6992 67.0716C56.1929 67.2582 56.6425 67.5453 57.0196 67.9146C57.3967 68.2839 57.693 68.7275 57.8898 69.2172C58.4252 70.4128 58.8366 71.6601 59.1174 72.9396C53.5788 72.1926 48.0186 71.7912 42.426 71.9568C38.6879 72.0551 34.9587 72.37 31.257 72.9C30.9402 72.9486 30.618 72.9576 30.2976 72.9828Z"
                          fill="#FEFEFE" />
                        <path
                          d="M57.6864 58.203C57.1464 59.0526 56.3742 59.5566 55.413 59.8536C48.3066 62.0556 41.2008 62.0634 34.0956 59.877C33.165 59.5908 32.3982 59.1336 31.8474 58.329C33.7048 56.6743 35.9091 55.4565 38.2986 54.765C45.3096 52.74 51.813 53.7282 57.6864 58.203Z"
                          fill="#FEFEFE" />
                        <path
                          d="M45.1116 74.5596C46.1838 74.4684 47.2636 74.5807 48.294 74.8908C49.2426 75.2058 49.7664 75.9708 49.6152 76.7916C49.4352 77.7546 48.7998 78.3306 47.7324 78.2136C45.837 78.0048 43.9524 78.0732 42.0696 78.2136C40.9896 78.2964 40.3506 77.7258 40.2084 76.7736C40.0806 75.915 40.5684 75.1536 41.544 74.889C42.7069 74.5835 43.9124 74.4722 45.1116 74.5596Z"
                          fill="#A6151C" />
                        <path
                          d="M75.7476 26.8578C77.7276 29.628 78.7158 32.688 78.5988 36.1242C78.3792 42.5898 73.1682 48.4182 66.753 49.2876C57.6666 50.517 50.1804 43.7238 50.5368 34.5636C50.5566 34.0704 50.6646 33.5808 50.733 33.0912C53.9064 31.4028 56.8008 29.187 60.3234 28.161C63.221 27.2891 66.1997 26.7137 69.2136 26.4438C70.9326 26.3052 72.6462 26.325 74.3616 26.3142C74.88 26.3106 75.42 26.3178 75.7476 26.8578Z"
                          fill="#FEFEFE" />
                        <path
                          d="M75.7476 26.8578C71.7408 26.4096 67.7844 26.7876 63.8676 27.6192C59.8626 28.4688 56.16 30.0168 52.8372 32.4288C52.2126 32.8824 51.5592 33.2514 50.7402 33.0912C50.1428 32.8491 49.6509 32.4025 49.3524 31.8312C48.8394 30.9492 48.2724 30.1014 47.7486 29.2212C47.0772 28.0818 47.295 26.9622 48.267 26.388C49.203 25.8336 50.2362 26.154 50.967 27.2214C51.8418 28.5048 51.8382 28.4976 53.199 27.7146C57.699 25.1262 62.559 23.7168 67.6854 23.1408C70.3861 22.8628 73.1057 22.8176 75.8142 23.0058C76.7286 23.0598 77.4828 23.3946 77.8032 24.3072C78.066 25.0542 77.8716 25.7472 77.2974 26.3106C76.86 26.73 76.2948 26.7696 75.7476 26.8578Z"
                          fill="#1D1D1B" />
                        <path
                          d="M63.9 34.5132C65.5231 34.5087 67.0816 35.1491 68.2325 36.2936C69.3835 37.4381 70.0326 38.993 70.0371 40.6161C70.0417 42.2392 69.4012 43.7977 68.2567 44.9486C67.1122 46.0995 65.5573 46.7487 63.9342 46.7532C60.5952 46.773 57.8052 44.001 57.78 40.6332C57.7548 37.2654 60.5322 34.5258 63.9 34.5132Z"
                          fill="#1D1D1B" />
                        <path
                          d="M63.2916 37.5138C63.3096 38.3922 62.2008 39.5856 61.3026 39.654C60.6312 39.7044 60.2424 39.285 60.4134 38.619C60.5106 38.191 60.7141 37.7945 61.0051 37.466C61.2961 37.1376 61.6653 36.8878 62.0784 36.7398C62.7642 36.4842 63.279 36.8352 63.2916 37.5138Z"
                          fill="#FCFCFC" />
                        <path
                          d="M39.0924 33.0876C40.4604 41.9796 33.714 49.7736 24.8184 49.4334C19.44 49.2282 15.3 46.6884 12.8268 41.8914C10.26 36.9 10.7046 31.9806 13.7844 27.297C13.8816 27.1512 13.977 27.0054 14.0742 26.8614C14.319 26.4132 14.7546 26.3358 15.1956 26.3214C21.6288 26.1288 27.8622 26.9874 33.6798 29.9214C34.861 30.4926 35.98 31.1845 37.0188 31.986C37.6452 32.4972 38.4336 32.6646 39.0924 33.0876Z"
                          fill="#FEFEFE" />
                        <path
                          d="M39.0924 33.0876C38.2374 33.2676 37.5768 32.8428 36.9216 32.3838C30.168 27.6408 22.554 26.3394 14.5044 26.793C14.3598 26.8079 14.2162 26.8307 14.0742 26.8614C13.2696 26.7624 12.5136 26.577 12.1212 25.7526C11.9933 25.5054 11.9239 25.232 11.9184 24.9537C11.913 24.6753 11.9716 24.3995 12.0897 24.1474C12.2078 23.8953 12.3823 23.6738 12.5997 23.4998C12.8171 23.3259 13.0715 23.2043 13.3434 23.1444C14.5674 22.8456 15.84 22.8744 17.0856 22.8744C23.3856 22.8744 29.4336 24.0426 35.1054 26.8704C35.9406 27.2862 36.7452 27.7704 37.539 28.251C37.9296 28.4904 38.1384 28.44 38.3688 28.0476C38.6364 27.5631 38.9543 27.1082 39.3174 26.6904C39.6003 26.3906 39.9776 26.197 40.3862 26.1419C40.7947 26.0869 41.2098 26.1738 41.562 26.388C42.2694 26.8038 42.7122 27.7362 42.3918 28.5012C41.7744 29.9844 40.842 31.3002 39.8988 32.5962C39.7278 32.8302 39.366 32.9274 39.0924 33.0876Z"
                          fill="#1D1D1B" />
                        <path
                          d="M25.8678 34.5114C27.4896 34.507 29.0477 35.1428 30.2034 36.2807C31.3591 37.4185 32.0191 38.9665 32.04 40.5882C32.094 43.9074 29.3256 46.7082 25.9452 46.7532C22.6026 46.8 19.8252 44.0532 19.7928 40.6674C19.7832 39.0458 20.4176 37.4867 21.5566 36.3325C22.6956 35.1783 24.2462 34.5233 25.8678 34.5114Z"
                          fill="#1D1D1B" />
                        <path
                          d="M27.0954 36.675C28.2762 36.6444 29.5722 38.0484 29.4354 38.9736C29.3616 39.5028 29.0214 39.6936 28.5066 39.654C27.6426 39.5766 26.5554 38.4588 26.5266 37.5912C26.5212 37.0584 26.739 36.693 27.0954 36.675Z"
                          fill="#FCFCFC" />
                      </g>
                      <defs>
                        <clipPath id="clip0_1601_3429">
                          <rect width="90" height="90" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <!-- <pre class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y text-left" v-if="statistique" >{{ statistique }}</pre> -->

        <div class="col-span-12 lg:col-span-6 mt-8">
          <div class="intro-y block sm:flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Rapport Annuel des campagnes</h2>
            <!-- <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
              <CalendarIcon class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0" />
              <Litepicker v-model="salesReportFilter" :options="{
                autoApply: false,
                singleMode: false,
                numberOfColumns: 2,
                numberOfMonths: 2,
                showWeekNumbers: true,
                dropdowns: {
                  minYear: 1990,
                  maxYear: null,
                  months: true,
                  years: true,
                },
              }" class="form-control sm:w-56 box pl-10" />
            </div> -->
          </div>
          <div class="intro-y box p-5 mt-12 sm:mt-5">
            <div class="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div class="flex justify-center items-center">
                  <div class="flex justify-between space-x-1  w-2/5">
                    <div class="flex flex-col space-y-1 ">
                      <div class="flex">
                        <span class="w-20">Code QR /C</span>
                        <span
                          class="text-xs px-1 rounded-full bg-green-500 text-white mr-1 flex items-center justify-center w-4 h-4 cursor-pointer">
                          {{ Qr }}</span>

                      </div>
                      <div class="flex">
                        <span class="w-20">Kit BSD /C</span>
                        <span
                          class="text-xs px-1 rounded-full flex items-center justify-center w-4 h-4 cursor-pointer bg-orange-300 text-white mr-1">
                          {{ kits }}</span>

                      </div>
                      <div class="flex">
                        <span class="w-20">Tablette /C</span>

                        <span
                          class="text-xs px-1 rounded-full bg-danger text-white mr-1 flex items-center justify-center w-4 h-4 cursor-pointer">
                          {{ Tablette }}</span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="report-chart">
              <ReportLineChart :graphData="graphData" :height="275" class="mt-6 -mb-6" />
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Résolution</h2>
          </div>
          <div class="intro-y box p-5 mt-5">
            <div class="mt-3">
              <ReportPieChart :chartData="chartData" :height="213" />
            </div>
            <div class="w-52 sm:w-auto mx-auto mt-8">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span class="truncate">Terminé</span>
                <span class="font-medium ml-auto"> {{ resolutionTerminer }}</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span class="truncate">En cour</span>
                <span class="font-medium ml-auto">{{ resolutionEncour }}</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span class="truncate">En retard </span>
                <span class="font-medium ml-auto">{{ resolutionEnretard }}</span>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>

    <!-- END: Campagne Stats Modal Toggle -->



    <!-- plainte modal debut -->


    <Modal size="modal-xl" :show="showPlainte" @hidden="showPlainte = false">

      <a @click="showPlainte = false" class="absolute right-0 top-0 mt-3 mr-3" href="javascript:;">
        <XIcon class="w-8 h-8 text-slate-400" />
      </a>
      <ModalBody class="p-10 text-center">
        <div class="flex justify-between items-center">
          <div class="lg:w-1/4 sm:w-auto relative mr-auto mt-3 sm:mt-0 ">
            <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 ml-3 left-0 z-10 text-slate-500" />
            <input type="text" class="form-control w-full sm:w-64 box px-10" placeholder="Rechercher" />
          </div>
          <h1 class="text-xl font-semibold text-right w-auto">Listes des plaintes de la {{ }}</h1>
        </div>
        <div class="intro-y inbox box mt-5">
          <div class="p-5 flex flex-col-reverse sm:flex-row text-slate-500 border-b border-slate-200/60">
            <div
              class="flex items-center border-t sm:border-0 border-slate-200/60 pt-5 sm:pt-0 mt-5 sm:mt-0 -mx-5 sm:mx-0 px-5 sm:px-0">
              <input class="form-check-input" type="checkbox" />
              <Dropdown class="ml-1" placement="bottom-start">
                <DropdownToggle class="w-5 h-5 block" href="javascript:;">
                  <ChevronDownIcon class="w-5 h-5" />
                </DropdownToggle>
                <DropdownMenu class="w-32">
                  <DropdownContent>
                    <DropdownItem>All</DropdownItem>

                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
              <a href="javascript:;" class="w-5 h-5 ml-5 flex items-center justify-center">
                <RefreshCwIcon class="w-4 h-4" />
              </a>
              <a href="javascript:;" class="w-5 h-5 ml-5 flex items-center justify-center">
                <MoreHorizontalIcon class="w-4 h-4" />
              </a>
            </div>
            <div class="flex items-center sm:ml-auto">
              <div class="">1 - 50 of 5,238</div>
              <a href="javascript:;" class="w-5 h-5 ml-5 flex items-center justify-center">
                <ChevronLeftIcon class="w-4 h-4" />
              </a>
              <a href="javascript:;" class="w-5 h-5 ml-5 flex items-center justify-center">
                <ChevronRightIcon class="w-4 h-4" />
              </a>
              <a href="javascript:;" class="w-5 h-5 ml-5 flex items-center justify-center">
                <SettingsIcon class="w-4 h-4" />
              </a>
            </div>
          </div>
          <div class="overflow-x-auto sm:overflow-x-visible">
            <div v-for="(plainte, index) in tableauPlainte" :key="index" class="intro-y">

              <div
                class=" inbox__item--active inbox__item inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400">
                <div class="flex px-5 py-3">
                  <div class="w-72 flex-none flex items-center mr-5">
                    <input class="form-check-input flex-none" type="checkbox" />
                    <a href="javascript:;" class="w-5 h-5  flex-none ml-4 flex items-center justify-center "
                      @click="addFavoris(plainte, index)">
                      <StarIcon v-if="plainte.favoris" fill="yellow-700" class="w-4 h-4 " />
                      <StarIcon v-else fill="white" class="w-4 h-4 " />
                    </a>
                  </div>
                  <div class="w-64 sm:w-auto truncate">
                    <span class="inbox__item--highlight"> {{ plainte.contenu }}</span>
                  </div>
                  <div class="inbox__item--time whitespace-nowrap ml-auto pl-10">
                    {{ plainte.created_at }}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ModalBody>
    </Modal>



    <!-- plainte modal fin -->



    <!-- BEGIN: Modal Content -->
    <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
          <div class="text-3xl mt-5">Vous etes sur supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">
            Cette operation est irreverssible ? <br />Cliquer
            sur annuler pour annuler l'operation
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">
            Annuler
          </button>
          <button type="button" @click="deleteCampagne" class="btn btn-danger w-24">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->


    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="close">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeCampagne">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control"
              placeholder="libellé campagne" />
          </div>
          <div class="my-2">

            <label for="regular-form-1" class="form-label">Date de debut</label>
            <input id="regular-form-1" :min="min" type="date" required v-model="formData.debut" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de fin</label>
            <input id="regular-form-1" :min="min" type="date" required v-model="formData.fin" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Indicateurs</label>
            <TomSelect v-model="formData.indicateurs" :options="{ placeholder: 'Selectionez des indicateurs' }"
              class="w-full" multiple>
              <option v-for="(indicateur, index) in indicateurs" :key="index" :value="indicateur.id">{{ indicateur.nom }}
              </option>
            </TomSelect>

          </div>

          <button class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              Ajouter
            </span>
            <span v-else class="flex justify-center items-center space-x-2">
              <span class=" px-4 font-semibold ">
                chargement ...
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>

        <form v-else key="modifier" @submit.prevent="updateGroupe">
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control"
              placeholder="libellé campagne" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de debut</label>
            <input id="regular-form-1" type="date" required v-model="saveUpdate.debut" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Date de fin</label>
            <input id="regular-form-1" type="date" required v-model="saveUpdate.fin" class="form-control"
              placeholder="" />
          </div>
          <div class="my-2">
            <label for="regular-form-1" class="form-label">Indicateurs</label>
            <TomSelect v-model="saveUpdate.indicateurs" :options="{ placeholder: 'Selectionez des indicateurs' }"
              class="w-full" multiple>
              <option v-for="(indicateur, index) in indicateurs" :key="index" :value="indicateur.id">{{ indicateur.nom }}
              </option>
            </TomSelect>

          </div>
          <button class="btn btn-primary py-3 px-4 w-full my-3  xl:mr-3 align-top">
            <span class="text-sm font-semibold uppercase" v-if="!chargement">
              modifier
            </span>
            <span v-else class="flex justify-center items-center space-x-2">
              <span class=" px-4 font-semibold ">
                chargement ...
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-center animate-spin" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Toggle -->
    <div class=" flex justify-between ">
      <button @click="addCampagne" class="btn btn-primary flex space-x-2 items-center">
        <PlusSquareIcon />
        <span class="uppercase font-semibold"> ajouter</span>
      </button>
      <div class="search hidden sm:block">
        <input type="text" class="search__input form-control border-transparent" v-model="search"
          placeholder="Recherche..." />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>

    </div>

    <!-- END: Modal Toggle -->
    <div class="overflow-x-auto mt-5">
      <table class="table mt-5">
        <thead class="table-light">
          <tr>
            <th class="whitespace-nowrap">#</th>
            <th class="whitespace-nowrap">Campagne </th>
            <th class="whitespace-nowrap">Etat </th>
            <!-- <th class="whitespace-nowrap">Debut </th>
            <th class="whitespace-nowrap">Fin </th> -->
            <th class="whitespace-nowrap">Indicateurs </th>
            <!-- <th class="whitespace-nowrap">Date creation</th>
            <th class="whitespace-nowrap">Date mise à jours</th> -->
            <th class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>
            <td>{{ data.nom }}</td>
            <td v-if="data.statut">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </td>
            <td v-else>
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            </td>
            <!-- <td>{{ data.debut }}</td>
            <td>{{ data.fin }}</td> -->
            <td> {{ data.indicateurs }} </td>
            <!-- <td> {{ data.created_at }} </td>
            <td> {{ data.updated_at }}</td> -->
            <td class=" flex space-x-1">

              <Dropdown class="inline-block" placement="top-end">
                <DropdownToggle class="mr-1">
                  <AlignJustifyIcon />
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent>
                    <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2" content="cliquez pour modifier">
                      <span @click="modifier(index, data)"
                        class="text-black cursor-pointer flex justify-start items-center">
                        <EditIcon class="mr-2" /> Modifier
                      </span>
                    </Tippy>
                    <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2" content="cliquez pour supprimer">
                      <span @click="supprimer(index, data)"
                        class="text-black cursor-pointer flex justify-start items-center">
                        <Trash2Icon class="mr-2" /> Supprimer
                      </span>
                    </Tippy>

                    <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                      content="cliquez pour ajouter  ou  voir les bsds associés">
                      <span @click="voirBSD(index, data.id)"
                        class="text-black cursor-pointer flex justify-start items-center"><svg
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-plus-circle mr-2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg> Ajouter BSD </span>
                    </Tippy>

                    <Tippy tag="a" href="javascript:;" class="tooltip  inline-block my-2"
                      content="cliquez pour voir les feedbacks par bsd">
                      <span @click="getCampagneStat(data)"
                        class="text-black cursor-pointer flex justify-start items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-trending-up mr-2">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                          <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>Voir Votes </span>
                    </Tippy>
                    <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                      content="cliquez pour exporter les stats de cette campagne">
                      <span class="text-black cursor-pointer flex justify-start items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-upload mr-2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg> Exporter </span>
                    </Tippy>

                    <Tippy v-if="data.statut" tag="a" href="javascript:;"
                      class="tooltip inline-block my-2 justify-start items-center"
                      content="cliquez pour mettre en veille cette campagne ">
                      <span @click="updateStatut(data.id, { statut: 0 })" class="text-black cursor-pointer flex ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-moon mr-2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg> Mettre en veille </span>
                    </Tippy>

                    <Tippy v-else tag="a" href="javascript:;" class="tooltip inline-block my-2 justify-start items-center"
                      content="cliquez pour mettre en veille cette campagne ">
                      <span @click="updateStatut(data.id, { statut: 1 })" class="text-black cursor-pointer flex ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          class="feather feather-moon mr-2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg> Relancer </span>
                    </Tippy>

                    <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2 justify-start items-center"
                      content="cliquez pour voir les plaintes de cette campagne">
                      <span class="text-black cursor-pointer flex " @click="getCampagnePlainte(data)">
                        <FrownIcon class="mr-2" /> Plainte
                      </span>
                    </Tippy>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>

              <div class="text-center">
                <InfoIcon href="javascript:;" :name="'custom-tooltip-content' + index" class="tooltip" />
              </div>
              <!-- END: Custom Tooltip Toggle -->
              <!-- BEGIN: Custom Tooltip Content -->
              <div class="tooltip-content">
                <TippyContent :to="'custom-tooltip-content' + index">
                  <div :id="'custom-content-tooltip' + index" class="relative">
                    <div class="my-1">
                      Date de création : {{ data.created_at }}
                    </div>
                    <div class="my-1">
                      Date de mise à jour : {{ data.updated_at }}
                    </div>

                  </div>
                </TippyContent>
              </div>


              <div class="text-center">
                <svg href="javascript:;" :name="'custom-tooltip-content' + index + '1'" class="tooltip"
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="m9.981 14.811l-.467 2.726l2.449-1.287l2.449 1.287l-.468-2.726l1.982-1.932l-2.738-.398L11.963 10l-1.225 2.481L8 12.879z" />
                  <path fill="currentColor"
                    d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm.002 16H5V8h14l.002 12z" />
                </svg>
              </div>

              <div class="tooltip-content">
                <TippyContent :to="'custom-tooltip-content' + index + '1'">
                  <div :id="'custom-content-tooltip' + index + '1'" class="relative">
                    <div class="my-1">
                      Date de début : {{ data.debut }}
                    </div>
                    <div class="my-1">
                      Date de fin : {{ data.fin }}
                    </div>
                  </div>
                </TippyContent>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4" v-if="totalPages() > 1">
        <button
          class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-l-md px-4 py-2 m-1 focus:outline-none"
          :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <template v-if="totalPages() <= 7">
          <button
            class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
            :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in totalPages()" :key="pageNumber"
            @click="goToPage(pageNumber)">
            {{ pageNumber }}
          </button>
        </template>
        <template v-else>
          <template v-if="currentPage <= 4">
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
          <template v-else-if="currentPage >= totalPages() - 3">
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">
              1
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }" v-for="pageNumber in 5" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }"
              v-for="pageNumber in [totalPages() - 3, totalPages() - 2, totalPages() - 1, totalPages()]" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
          </template>
          <template v-else>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === 1 }" @click="goToPage(1)">
              1
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === currentPage }"
              v-for="pageNumber in [currentPage - 1, currentPage, currentPage + 1]" :key="pageNumber"
              @click="goToPage(pageNumber)">
              {{ pageNumber }}
            </button>
            <span class="bg-gray-200 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1">...</span>
            <button
              class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-md px-4 py-2 m-1 focus:outline-none"
              :class="{ 'bg-gray-400': pageNumber === totalPages() }" @click="goToPage(totalPages())">
              {{ totalPages() }}
            </button>
          </template>
        </template>
        <button
          class="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-r-md px-4 py-2 m-1 focus:outline-none"
          :disabled="currentPage === totalPages()" @click="currentPage++">Next</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed } from 'vue'; import { helper as $h } from "@/utils/helper";

import { useRouter, useRoute } from 'vue-router'
import CampagneService from "@/services/modules/campagne.service";
import IndicateurService from "@/services/modules/indicateur.service";
import ReportLineChart from "@/components/report-line-chart/Main.vue";
import ReportDonutChart from "@/components/report-donut-chart/Main.vue";
import ReportPieChart from "@/components/report-pie-chart/Main.vue";

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const deleteModalPreview = ref(false)
const successNotification = ref();
const search = ref('')
const campagnes = ref([])
const indicateurs = ref([])
const deleteData = reactive({})
const saveUpdate = reactive({})
const chargement = ref(false)
const isUpdate = ref(false)
const showMenu = ref(false) //hover du dropdown 
const favorisColor = ref('')


const formData = reactive({
  nom: '',
  debut: '',
  fin: '',
  indicateurId: ''
})

// les variables pour les stats par campagnes
const statistique = reactive({})
const graphData = ref({})
const allStats = ref({})
const Qr = ref(0)
const Tablette = ref(0)
const kits = ref(0)
const resolutionEncour = ref(0)
const resolutionTerminer = ref(0)
const resolutionEnretard = ref(0)
const chartData = ref([])
const CampagneStatPreview = ref(false) // ouvre le modal des stats par campagnes
const showPlainte = ref(false) // ouvre le modal des plaintes par campagnes
const isHover = ref(false) // hover des boutons d'actions dans les tableaux
const tableauPlainte = ref([])
const colorFill = ref(["yellow", "white"])
const statusFavoris = ref('')
const campagneId = ref()

const currentPage = ref(1)
const itemsPerPage = ref(10)


// fin variables pour les stats par campagnes

graphData.value = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Mediocre",
      data: [0, 200, 250, 200, 700, 550, 650, 1050, 950, 1100, 900, 1200],
      borderWidth: 3,
      borderColor: '#F39200',
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
    {
      label: "Passable",
      data: [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
      borderWidth: 3,
      borderColor: '#BE1622',
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
    {
      label: "Excellent",
      data: [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      borderWidth: 3,
      borderColor: '#3AAA35',
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
  ],
}

chartData.value = [resolutionEncour, resolutionEnretard, resolutionTerminer]


const message = reactive({
  type: 'success',
  message: '',
})

const min = computed(() => {
  var d = new Date();
  var day = d.getDate() <= 9 ? `0${d.getDate()}` : d.getDate()
  var month = (d.getMonth() + 1) <= 9 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1)
  let min1 = `${d.getFullYear()}-${month}-${day}`
  return min1
})

const resultQuery = computed(() => {
  if (search.value) {
    return campagnes.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.debut.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.fin.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.indicateur.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return campagnes.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return campagnes.value.slice(startIndex, endIndex);
  }
})

onMounted(function () {
  getData()
  getIndicateur()
})

const getData = function () {
  CampagneService.get().then((data) => {
    campagnes.value = data.data.data

  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function totalPages() {
  return Math.ceil(campagnes.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
}


const getIndicateur = function () {
  IndicateurService.getAll().then((data) => {
    indicateurs.value = data.data.data
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}

function close() {
  formData.nom = ''
  formData.debut = ''
  formData.fin = ''
  formData.indicateurId = ''
  showModal.value = false
}

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};


const addCampagne = function () {
  showModal.value = true
  isUpdate.value = false
}


const storeCampagne = function () {

  if (chargement.value == false) {

    chargement.value = true
    CampagneService.create(formData).then((data) => {
      message.type = 'success'
      message.message = 'Nouveau commentaire créé'
      successNotificationToggle()
      close()
      getData()
      chargement.value = false
    }).catch((error) => {
      chargement.value = false
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message
        message.type = 'erreur'
        message.message = erreurs
        successNotificationToggle()
      } else if (error.request) {
        // Demande effectuée mais aucune réponse n'est reçue du serveur.
        //console.log(error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la demande
        //console.log('dernier message', error.message);
      }
    })
  }
}

const supprimer = function (index, data) {
  deleteModalPreview.value = true
  deleteData.id = data.id
  deleteData.nom = data.nom
  deleteData.index = index
}

const deleteCampagne = function () {
  deleteModalPreview.value = false
  campagnes.value.splice(campagnes.value.indexOf(deleteData.index), 1);
  CampagneService.destroy(deleteData.id).then((data) => {
    message.type = 'success'
    message.message = 'Operation éffectué avec success'
    successNotificationToggle()
    getData()
  }).catch((error) => {

    if (error.response) {
      // Requête effectuée mais le serveur a répondu par une erreur.
      const erreurs = error.response.data.message
      message.type = 'erreur'
      message.message = erreurs
      successNotificationToggle()
    } else if (error.request) {
      // Demande effectuée mais aucune réponse n'est reçue du serveur.
      //console.log(error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la demande
    }
  })
}

const modifier = function (index, data) {

  saveUpdate.indicateurs = []


  for (let i = 0; i < data.indicateurSelect.length; i++) {

    saveUpdate.indicateurs.push(data.indicateurSelect[i].id)

  }

  saveUpdate.nom = data.nom
  saveUpdate.debut = data.debut
  saveUpdate.fin = data.fin
  // saveUpdate.indicateurs = data.indicateurSelect
  saveUpdate.id = data.id
  showModal.value = true
  isUpdate.value = true

  console.log(data)
  console.log(saveUpdate.indicateurs)
}

const updateGroupe = function () {
  if (chargement.value == false) {
    chargement.value = true
    const formData = {
      nom: saveUpdate.nom,
      debut: saveUpdate.debut,
      fin: saveUpdate.fin,
      indicateurs: saveUpdate.indicateurs,
    }
    CampagneService.update(saveUpdate.id, formData).then((data) => {
      chargement.value = false
      message.type = 'success'
      message.message = 'Mise à jours éffectué avec succèss'
      successNotificationToggle()
      close()
      getData()
      this.getData()
    }).catch((error) => {
      chargement.value = false
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message
        message.type = 'erreur'
        message.message = erreurs
        successNotificationToggle()
      } else if (error.request) {
        // Demande effectuée mais aucune réponse n'est reçue du serveur.
        //console.log(error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la demande
        //console.log('dernier message', error.message);
      }
    })
  }
}

const voirBSD = function (index, id) {
  router.push({ name: 'CampagnesByBsd', params: { id: id } })
}
const voirVote = function (index, id) {
  router.push({ name: 'Votes', params: { id: id } })
}


//  get statistique par campagnes

function getCampagneStat(campagne) {

  CampagneStatPreview.value = true

  CampagneService.getCampagneStatistique(campagne.id, {}).then((data) => {

    var response = data.data.data
    allStats.value = response
    graphData.value.datasets[0].data = allStats.value[0].mediocre
    graphData.value.datasets[1].data = allStats.value[0].passable
    graphData.value.datasets[2].data = allStats.value[0].excellent

    Qr.value = allStats.value[0].qr
    Tablette.value = allStats.value[0].tablette
    kits.value = allStats.value[0].kit


    resolutionEncour.value = allStats.value[0].enCours[1]

    resolutionTerminer.value = allStats.value[0].terminer[1]

    resolutionEnretard.value = allStats.value[0].enRetard[1]


    console.log(allStats.value[0].excellent)
  }).catch((e) => {
    // alert(e)
  })

  CampagneService.getVote(campagne.id).then((data) => {
    statistique.value = data.data.data
  }).catch((e) => {
    // alert(e)
  })

  console.log(campagne.id)
}

function updateStatut(id, data) {

  CampagneService.updateStatut(id, data).then((data) => {
    getData()
  }).catch((e) => {
    // alert(e)
  })

  CampagneService.getVote(campagne.id).then((data) => {
    statistique.value = data.data.data
  }).catch((e) => {
    // alert(e)
  })

  console.log(campagne.id)
}

//  get les plaintes par campagne

function getCampagnePlainte(data) {

  campagneId.value = data.id

  showPlainte.value = true

  CampagneService.getPlainte(data.id).then((response) => {

    tableauPlainte.value = response.data.data

    console.log("contenu reponse" + tableauPlainte)

  }).catch((e) => {
    // disabled()
    alert(e)
  })

}

// ajouter favoris

function addFavoris(data, index) {



  CampagneService.addFavoris(data.id).then((response) => {


    tableauPlainte.value[index].favoris = response.data.data.favoris;

    statusFavoris.value = response.data.data

    CampagneService.getPlainte(campagneId.value).then((response) => {

      tableauPlainte.value = response.data.data

      console.log("contenu reponse" + tableauPlainte)

    }).catch((e) => {
      // disabled()
      alert(e)
    })

    console.log(response.data.data)
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}



</script>

<style lang="scss" scoped>
.active {
  display: block;
}
</style>