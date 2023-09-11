<template>
  <div class="py-4">
    <!-- toast notification -->
    <!-- toast notification -->
    <Notification refKey="successNotification" :options="{ duration: 5000, }" class="flex">
      <img src="../../assets/images/BSD-heureux2.svg" v-if="message.type === 'success'" class="text-success" width="55"
        height="55" alt="">

      <CheckCircleIcon v-else class="text-success" />
      <div class="ml-4 mr-4">
        <div :class="{ 'text-red-500 capitalize ': message.type != 'success' }" class="font-medium">{{ message.type }}
        </div>
        <div class="text-slate-500 mt-1">
          {{ message.message }}
        </div>
      </div>
    </Notification>
    <!-- toast notification -->

    <!-- price modal -->

    <!-- BEGIN: Super Large Modal Content -->
    <Modal size="modal-xl" :show="ouvrirTarifs" @hidden="ouvrirTarifs = false">
      <ModalBody class="p-10 text-center bg-slate-100">
        <h2 class="intro-y text-2xl font-medium my-10 text-center mr-auto">
          Tarification
        </h2>
        <!-- <pre>{{ tableauPack }}</pre> -->
        <carousel :itemsToShow="2" :wrapAround="true" :transition="500">
          <slide v-for="slide in tableauPack" :key="slide">
            <div class="intro-y flex-1 box py-16 lg:ml-5 mb-5 lg:mb-0">
              <svg class="block w-12 h-12 text-primary mx-auto" v-if="slide.nom == 'Tablette'" height="800px"
                width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28.33 28.33" xml:space="preserve">
                <g>
                  <g>
                    <path style="fill:#010002;"
                      d="M16.825,12.063H4.421c-0.309,0-0.556,0.247-0.556,0.555s0.247,0.556,0.556,0.556h12.403
                                                            			c0.309,0,0.557-0.25,0.557-0.556C17.379,12.311,17.13,12.063,16.825,12.063z" />
                    <path style="fill:#010002;"
                      d="M19.659,20.761c-0.079-0.145-0.148-0.275-0.216-0.41H2.202V4.315h20.966v13.254
                                                            			c0.004,0.002,0.007,0.002,0.01,0.002c0.286-0.186,0.634-0.313,1.021-0.313c0.25,0,0.595,0.057,0.967,0.275
                                                            			c0.119-0.018,0.253-0.029,0.395-0.029c0.546,0,1.026,0.189,1.426,0.5V4.293c0-1.011-0.82-1.83-1.832-1.83H1.831
                                                            			C0.82,2.463,0,3.281,0,4.293v16.082c0,1.012,0.821,1.83,1.831,1.83h15.415c-0.016-0.154-0.004-0.311,0.035-0.465
                                                            			c0.13-0.504,0.627-1.092,1.595-1.092C19.12,20.649,19.382,20.687,19.659,20.761z" />
                    <path style="fill:#010002;"
                      d="M7.97,10.235c0.115,0,0.208-0.093,0.208-0.209V6.138c0-0.114-0.094-0.208-0.208-0.208H4.364
                                                            			c-0.112,0-0.208,0.093-0.208,0.208v3.888c0,0.115,0.095,0.209,0.208,0.209H7.97z" />
                    <path style="fill:#010002;"
                      d="M16.825,14.364H4.421c-0.309,0-0.556,0.25-0.556,0.555c0,0.309,0.247,0.557,0.556,0.557h12.403
                                                            			c0.309,0,0.557-0.25,0.557-0.557C17.379,14.61,17.13,14.364,16.825,14.364z" />
                    <path style="fill:#010002;"
                      d="M16.825,16.862H4.421c-0.309,0-0.556,0.248-0.556,0.557c0,0.307,0.247,0.557,0.556,0.557h12.403
                                                            			c0.309,0,0.557-0.25,0.557-0.557C17.379,17.108,17.13,16.862,16.825,16.862z" />
                    <path style="fill:#010002;" d="M28.19,23.362c-0.172-1.971-0.922-3.104-1.393-4.068c-0.586-1.207-1.854-0.689-1.854-0.689
                                                            			c-0.924-0.889-1.604,0.166-1.604,0.166c-1.035-0.832-1.62,0.402-1.62,0.402c-0.139,0.027-2.094-3.141-2.151-3.24
                                                            			c-0.506-0.863-1.576-0.426-0.985,0.613c1.467,2.584,1.52,3.037,2.088,3.994c0.246,0.414,1.456,2.408,0.899,2.523
                                                            			c-0.498,0.104-1.104-0.996-1.99-1.293c-1.397-0.467-1.629,0.424-1.073,0.73c0.162,0.09,0.931,0.402,1.508,1.482
                                                            			c0.131,0.248,0.972,0.428,1.243,0.59c1.771,1.055,1.992,0.848,2.7,0.857c0.769,0.012,0.891,0.438,0.891,0.438l3.481-1.738
                                                            			C28.331,24.132,28.205,23.558,28.19,23.362z" />
                  </g>
                </g>
              </svg>

              <svg class="block w-12 h-12 text-primary mx-auto" v-if="slide.nom == 'Qr'" fill="#000000" version="1.1"
                id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 64 64" xml:space="preserve">
                <g>
                  <rect x="38" y="23" width="2" height="5" />
                  <rect x="42" y="23" width="2" height="5" />
                  <rect x="38" y="30" width="2" height="2" />
                  <rect x="42" y="30" width="2" height="2" />
                  <rect x="31" y="34" width="2" height="2" />
                  <rect x="26" y="54" width="2" height="2" />
                  <rect x="42" y="34" width="2" height="2" />
                  <rect x="38" y="38" width="2" height="2" />
                  <rect x="42" y="38" width="2" height="2" />
                  <path d="M2,2h3V0H1C0.448,0,0,0.448,0,1v4h2V2z" />
                  <path d="M63,0h-4v2h3v3h2V1C64,0.448,63.552,0,63,0z" />
                  <path d="M2,59H0v4c0,0.552,0.448,1,1,1h4v-2H2V59z" />
                  <path d="M62,62h-3v2h4c0.552,0,1-0.448,1-1v-4h-2V62z" />
                  <path
                    d="M4,5v12c0,0.552,0.448,1,1,1h12c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1H5C4.448,4,4,4.448,4,5z M6,6h10v10H6V6z" />
                  <path
                    d="M13,8H9C8.448,8,8,8.448,8,9v4c0,0.552,0.448,1,1,1h4c0.552,0,1-0.448,1-1V9C14,8.448,13.552,8,13,8z M12,12h-2v-2h2V12z" />
                  <path d="M47,18h12c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1H47c-0.552,0-1,0.448-1,1v12C46,17.552,46.448,18,47,18z M48,6h10v10
                                                        		H48V6z" />
                  <path d="M55,8h-4c-0.552,0-1,0.448-1,1v4c0,0.552,0.448,1,1,1h4c0.552,0,1-0.448,1-1V9C56,8.448,55.552,8,55,8z M54,12h-2v-2h2V12z
                                                        		" />
                  <path d="M17,46H5c-0.552,0-1,0.448-1,1v12c0,0.552,0.448,1,1,1h12c0.552,0,1-0.448,1-1V47C18,46.448,17.552,46,17,46z M16,58H6V48
                                                        		h10V58z" />
                  <path
                    d="M9,56h4c0.552,0,1-0.448,1-1v-4c0-0.552-0.448-1-1-1H9c-0.552,0-1,0.448-1,1v4C8,55.552,8.448,56,9,56z M10,52h2v2h-2V52z" />
                  <path d="M44,19h-7V7h-2v13c0,0.552,0.448,1,1,1h8V19z" />
                  <rect x="22" y="12" width="7" height="2" />
                  <rect x="26" y="8" width="7" height="2" />
                  <rect x="4" y="19" width="2" height="9" />
                  <path d="M18,25H8v2h9v4h2v-5C19,25.448,18.552,25,18,25z" />
                  <rect x="9" y="20" width="2" height="2" />
                  <rect x="21" y="18" width="2" height="8" />
                  <rect x="21" y="28" width="9" height="2" />
                  <path d="M61,29h-2v10h-3v2h4c0.552,0,1-0.448,1-1V29z" />
                  <rect x="26" y="18" width="2" height="2" />
                  <rect x="4" y="33" width="2" height="8" />
                  <rect x="4" y="42" width="9" height="2" />
                  <path d="M50,28h2v-4c0-0.552-0.448-1-1-1h-5v2h4V28z" />
                  <rect x="9" y="33" width="2" height="2" />
                  <rect x="20" y="32" width="2" height="8" />
                  <rect x="20" y="42" width="9" height="2" />
                  <rect x="8" y="38" width="9" height="2" />
                  <rect x="21" y="52" width="2" height="4" />
                  <rect x="20" y="48" width="9" height="2" />
                  <path d="M36,44v-5c0-0.552-0.448-1-1-1H25v2h9v4H36z" />
                  <rect x="26" y="32" width="2" height="2" />
                  <rect x="15" y="34" width="2" height="2" />
                  <rect x="59" y="53" width="2" height="7" />
                  <rect x="54" y="58" width="3" height="2" />
                  <rect x="54" y="52" width="2" height="4" />
                  <path d="M61,44c0-0.552-0.448-1-1-1H49v2h10v6h2V44z" />
                  <path d="M48,56v-5c0-0.552-0.448-1-1-1H36v2h10v4H48z" />
                  <rect x="50" y="47" width="7" height="2" />
                  <rect x="20" y="58" width="7" height="2" />
                  <rect x="30" y="51" width="2" height="9" />
                  <rect x="32" y="46" width="4" height="2" />
                  <path d="M47,36h5v-2h-4v-6h-2v7C46,35.552,46.448,36,47,36z" />
                  <rect x="50" y="30" width="5" height="2" />
                  <rect x="54" y="20" width="3" height="2" />
                  <rect x="59" y="20" width="2" height="5" />
                  <rect x="54" y="25" width="2" height="2" />
                  <path d="M39,17h4c0.552,0,1-0.448,1-1V3h-2v12h-3V17z" />
                  <path d="M24,5h15V3H23c-0.552,0-1,0.448-1,1v5h2V5z" />
                  <path d="M25,24h7c0.552,0,1-0.448,1-1v-8h-2v7h-6V24z" />
                  <rect x="34" y="23" width="2" height="4" />
                  <rect x="36" y="54" width="7" height="2" />
                  <rect x="36" y="58" width="9" height="2" />
                  <path d="M50,58h-2v2h3c0.552,0,1-0.448,1-1v-8h-2V58z" />
                  <rect x="16" y="42" width="2" height="2" />
                  <rect x="39" y="42" width="4" height="2" />
                  <rect x="46" y="38" width="2" height="3" />
                  <rect x="45" y="43" width="2" height="2" />
                  <rect x="39" y="46" width="3" height="2" />
                  <rect x="50" y="38" width="2" height="2" />
                  <rect x="54" y="34" width="3" height="2" />
                  <rect x="35" y="34" width="5" height="2" />
                  <rect x="34" y="29" width="2" height="3" />
                </g>
              </svg>

              <svg class="block w-12 h-12 text-primary mx-auto" v-if="slide.nom == 'Kit'" fill="#000000" height="800px"
                width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 290.063 290.063" xml:space="preserve">
                <g>
                  <path id="circle8018" d="M23.865,0c-1.827-0.015-3.517,0.967-4.408,2.562c-25.898,44.856-25.898,100.144,0,145
                                                        		c1.345,2.412,4.391,3.276,6.803,1.931c2.412-1.345,3.276-4.391,1.931-6.803c-0.024-0.043-0.048-0.085-0.074-0.128
                                                        		c-24.119-41.776-24.119-93.224,0-135c1.415-2.372,0.64-5.441-1.732-6.856C25.623,0.251,24.753,0.008,23.865,0z M266.047,0.004
                                                        		c-2.76,0.107-4.91,2.43-4.804,5.19c0.032,0.836,0.274,1.65,0.702,2.369c24.119,41.776,24.119,93.224,0,135
                                                        		c-1.416,2.371-0.642,5.441,1.729,6.857s5.441,0.642,6.857-1.729c0.025-0.042,0.05-0.085,0.074-0.128
                                                        		c25.898-44.856,25.898-100.144,0-145C269.688,0.92,267.927-0.068,266.047,0.004z M81.098,25c-1.827-0.015-3.517,0.967-4.408,2.562
                                                        		c-16.966,29.386-16.966,65.614,0,95c1.345,2.412,4.391,3.276,6.803,1.931c2.412-1.345,3.276-4.391,1.931-6.803
                                                        		c-0.024-0.043-0.048-0.085-0.074-0.128c-15.188-26.306-15.188-58.694,0-85c1.415-2.372,0.64-5.441-1.732-6.856
                                                        		C82.855,25.251,81.986,25.008,81.098,25z M208.815,25.004c-2.76,0.107-4.91,2.43-4.804,5.19c0.032,0.836,0.274,1.65,0.702,2.369
                                                        		c15.188,26.306,15.188,58.694,0,85c-1.416,2.371-0.642,5.441,1.729,6.857c2.371,1.416,5.441,0.642,6.857-1.729
                                                        		c0.025-0.042,0.05-0.085,0.074-0.128c16.966-29.386,16.966-65.614,0-95C212.456,25.92,210.694,24.932,208.815,25.004z
                                                        		 M145.031,40.063c-19.271,0-35,15.729-35,35c0,17.573,13.082,32.196,30,34.637v130.363h-115c-13.764,0-25,11.236-25,25
                                                        		s11.236,25,25,25h240c13.764,0,25-11.236,25-25s-11.236-25-25-25h-115V109.699c16.918-2.441,30-17.064,30-34.637
                                                        		C180.031,55.792,164.302,40.063,145.031,40.063z M145.031,50.063c13.866,0,25,11.134,25,25s-11.134,25-25,25s-25-11.134-25-25
                                                        		S131.165,50.063,145.031,50.063z M145.031,57.563c-1.381-0.02-2.516,1.084-2.535,2.465c-0.02,1.381,1.084,2.516,2.465,2.535
                                                        		c0.024,0,0.047,0,0.071,0c6.933,0,12.5,5.567,12.5,12.5c-0.02,1.381,1.084,2.516,2.465,2.535c1.381,0.02,2.516-1.084,2.535-2.465
                                                        		c0-0.024,0-0.047,0-0.071C162.531,65.427,154.667,57.563,145.031,57.563z M25.031,250.063h240c8.396,0,15,6.604,15,15
                                                        		s-6.604,15-15,15h-240c-8.396,0-15-6.604-15-15S16.635,250.063,25.031,250.063z M25.031,260.063
                                                        		c-2.761-0.039-5.032,2.168-5.071,4.929c-0.039,2.761,2.168,5.032,4.929,5.071c0.047,0.001,0.094,0.001,0.141,0h180
                                                        		c2.761,0.039,5.032-2.168,5.071-4.929c0.039-2.761-2.168-5.032-4.929-5.071c-0.047-0.001-0.094-0.001-0.141,0H25.031z
                                                        		 M225.031,260.063c-2.761,0-5,2.239-5,5s2.239,5,5,5s5-2.239,5-5S227.793,260.063,225.031,260.063z M245.031,260.063
                                                        		c-2.761,0-5,2.239-5,5s2.239,5,5,5s5-2.239,5-5S247.793,260.063,245.031,260.063z M265.031,260.063c-2.761,0-5,2.239-5,5
                                                        		s2.239,5,5,5s5-2.239,5-5S267.793,260.063,265.031,260.063z" />
                </g>
              </svg>

              <svg class="block w-12 h-12 text-primary mx-auto" v-if="slide.nom == 'All'" width="800px" height="800px"
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 6C9 6.39397 9.0776 6.78407 9.22836 7.14805C9.37913 7.51203 9.6001 7.84274 9.87868 8.12132C10.1573 8.3999 10.488 8.62087 10.852 8.77164C11.2159 8.9224 11.606 9 12 9C12.394 9 12.7841 8.9224 13.1481 8.77164C13.512 8.62087 13.8427 8.3999 14.1213 8.12132C14.3999 7.84274 14.6209 7.51203 14.7716 7.14805C14.9224 6.78407 15 6.39396 15 6C15 5.60603 14.9224 5.21593 14.7716 4.85195C14.6209 4.48797 14.3999 4.15725 14.1213 3.87868C13.8427 3.6001 13.512 3.37912 13.148 3.22836C12.7841 3.0776 12.394 3 12 3C11.606 3 11.2159 3.0776 10.8519 3.22836C10.488 3.37913 10.1573 3.6001 9.87868 3.87868C9.6001 4.15726 9.37912 4.48797 9.22836 4.85195C9.0776 5.21593 9 5.60604 9 6L9 6Z"
                  stroke="#222222" />
                <path
                  d="M4.43781 13.9015C4.09663 14.0985 3.79758 14.3607 3.55775 14.6733C3.31792 14.9858 3.142 15.3426 3.04004 15.7231C2.93807 16.1037 2.91206 16.5006 2.96348 16.8912C3.0149 17.2818 3.14275 17.6584 3.33974 17.9996C3.53672 18.3408 3.79897 18.6398 4.11153 18.8796C4.42408 19.1195 4.78081 19.2954 5.16136 19.3974C5.5419 19.4993 5.9388 19.5253 6.32939 19.4739C6.71999 19.4225 7.09663 19.2946 7.43781 19.0977C7.779 18.9007 8.07804 18.6384 8.31787 18.3259C8.5577 18.0133 8.73362 17.6566 8.83559 17.276C8.93756 16.8955 8.96357 16.4986 8.91215 16.108C8.86072 15.7174 8.73287 15.3408 8.53589 14.9996C8.33891 14.6584 8.07665 14.3594 7.7641 14.1195C7.45154 13.8797 7.09481 13.7038 6.71427 13.6018C6.33373 13.4998 5.93683 13.4738 5.54623 13.5252C5.15564 13.5767 4.779 13.7045 4.43781 13.9015L4.43781 13.9015Z"
                  stroke="#222222" />
                <path
                  d="M19.5622 13.9015C19.9034 14.0985 20.2024 14.3607 20.4422 14.6733C20.6821 14.9859 20.858 15.3426 20.96 15.7231C21.0619 16.1037 21.0879 16.5006 21.0365 16.8912C20.9851 17.2818 20.8572 17.6584 20.6603 17.9996C20.4633 18.3408 20.201 18.6398 19.8885 18.8796C19.5759 19.1195 19.2192 19.2954 18.8386 19.3974C18.4581 19.4993 18.0612 19.5253 17.6706 19.4739C17.28 19.4225 16.9034 19.2946 16.5622 19.0977C16.221 18.9007 15.922 18.6384 15.6821 18.3259C15.4423 18.0133 15.2664 17.6566 15.1644 17.276C15.0624 16.8955 15.0364 16.4986 15.0879 16.108C15.1393 15.7174 15.2671 15.3408 15.4641 14.9996C15.6611 14.6584 15.9234 14.3594 16.2359 14.1195C16.5485 13.8797 16.9052 13.7038 17.2857 13.6018C17.6663 13.4998 18.0632 13.4738 18.4538 13.5252C18.8444 13.5767 19.221 13.7045 19.5622 13.9015L19.5622 13.9015Z"
                  stroke="#222222" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9.00254 6.12533C9.0008 6.08372 8.99993 6.04203 8.99993 6.0003C8.99993 5.65294 9.06026 5.30857 9.17787 4.98247C9.03301 5.03346 8.8894 5.08843 8.74719 5.14733C7.71592 5.5745 6.77889 6.2006 5.98959 6.9899C5.20029 7.7792 4.57419 8.71623 4.14702 9.7475C3.71986 10.7788 3.5 11.8841 3.5 13.0003C3.5 13.5265 3.54885 14.0502 3.64523 14.5648C3.86884 14.2999 4.13691 14.0755 4.43774 13.9018C4.47388 13.8809 4.51042 13.8609 4.54733 13.8415C4.51586 13.5628 4.5 13.2819 4.5 13.0003C4.5 12.0154 4.69399 11.0401 5.0709 10.1302C5.44781 9.22024 6.00026 8.39345 6.6967 7.69701C7.36051 7.03319 8.14275 6.5002 9.00254 6.12533ZM14.9973 6.12528C15.8572 6.50014 16.6395 7.03315 17.3033 7.697C17.9997 8.39344 18.5522 9.22023 18.9291 10.1302C19.306 11.0401 19.5 12.0154 19.5 13.0003C19.5 13.282 19.4841 13.5628 19.4527 13.8416C19.4895 13.8609 19.526 13.881 19.5621 13.9018C19.863 14.0755 20.1311 14.3 20.3547 14.565C20.4511 14.0503 20.5 13.5265 20.5 13.0003C20.5 11.8841 20.2801 10.7788 19.853 9.74749C19.4258 8.71622 18.7997 7.77919 18.0104 6.98989C17.2211 6.2006 16.2841 5.57449 15.2528 5.14733C15.1105 5.0884 14.9669 5.03342 14.822 4.98242C14.9396 5.30854 14.9999 5.65292 14.9999 6.0003C14.9999 6.04201 14.9991 6.08368 14.9973 6.12528ZM17.533 19.4529C17.1916 19.3917 16.8631 19.2717 16.5621 19.098C16.5261 19.0772 16.4906 19.0556 16.4555 19.0334C15.9665 19.3945 15.4343 19.6957 14.8701 19.9294C13.9602 20.3063 12.9849 20.5003 12 20.5003C11.0151 20.5003 10.0398 20.3063 9.12988 19.9294C8.56568 19.6957 8.03345 19.3945 7.54443 19.0334C7.50935 19.0556 7.47378 19.0772 7.43775 19.098C7.13681 19.2717 6.80829 19.3917 6.46694 19.4528C7.14728 20.0362 7.91668 20.5093 8.74719 20.8533C9.77846 21.2804 10.8838 21.5003 12 21.5003C13.1162 21.5003 14.2215 21.2804 15.2528 20.8533C16.0833 20.5093 16.8527 20.0362 17.533 19.4529Z"
                  fill="#222222" />
              </svg>
              <!-- <BriefcaseIcon class="block w-12 h-12 text-primary mx-auto" /> -->
              <div class="text-xl font-medium text-center mt-10">{{ slide.nom }}</div>

              <div v-for="item in slide.grilleTarifaires" class="text-slate-500 px-10 text-center mx-auto mt-2">
                {{ item.type }} : {{ item.prix }} XOF pour {{ item.mois }} mois

              </div>
              <div class="flex justify-center">
                <div class="relative text-5xl font-semibold mt-8 mx-auto">
                  <span class="absolute text-2xl top-0 left-0 -ml-4"></span> {{ slide.montant }}
                </div>
              </div>
              <button type="button" @click="ouvrirFormulaire(slide)"
                class="btn btn-rounded-primary py-3 px-4 block mx-auto mt-8">
                Ajouter Maintenant
              </button>
            </div>
          </slide>



          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
        <table class="table mt-5">
          <thead class="table-light">
            <tr>
              <th class="whitespace-nowrap">#</th>
              <th class="whitespace-nowrap">Type d'équipement</th>
              <th class="whitespace-nowrap text-center">Prix </th>
              <th class="whitespace-nowrap">Durée</th>
              <th class="whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>

            <tr v-for="(data, index) in grilleTarifaires " :key="index">
              <td> {{ index + 1 }} </td>
              <td><span class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{ data.type.toUpperCase() }}</span>
              </td>
              <td> {{ data.prix }} XOF</td>
              <td> {{ data.mois }} mois</td>
              <td class="flex space-x-2 items-center">
                <Tippy tag="a" href="javascript:;" class="tooltip " content="cliquez pour souscrire">
                  <span @click="ouvrirFormulaire(data)" class="text-blue-500 cursor-pointer">
                    <EditIcon />
                  </span>
                </Tippy>
              </td>
            </tr>
          </tbody>
        </table>
      </ModalBody>
    </Modal>
    <!-- END: Super Large Modal Content -->

    <!-- BEGIN: Super Large Modal Content -->
    <Modal size="modal-xl" :show="ouvrirReabonnementTarifs" @hidden="ouvrirReabonnementTarifs = false">
      <ModalBody class="p-10 text-center bg-slate-100">
        <h2 class="intro-y text-2xl font-medium my-10 text-center mr-auto">
          Tarification
        </h2>
        <table class="table mt-5">
          <thead class="table-light">
            <tr>
              <th class="whitespace-nowrap">#</th>
              <th class="whitespace-nowrap">Type d'équipement</th>
              <th class="whitespace-nowrap text-center">Prix </th>
              <th class="whitespace-nowrap">Durée</th>
              <th class="whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in grilleTarifaires " :key="index">
              <td v-if="data.type == typeReabonnement"> {{ index + 1 }} </td>
              <td v-if="data.type == typeReabonnement"><span
                  class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{ data.type.toUpperCase() }}</span>
              </td>
              <td v-if="data.type == typeReabonnement"> {{ data.prix }} XOF</td>
              <td v-if="data.type == typeReabonnement"> {{ data.mois }} mois</td>
              <td v-if="data.type == typeReabonnement" class="flex space-x-2 items-center">

                <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2" content="cliquez pour modifier">
                  <span @click="ouvrirFormulaireReabonnement(data)"
                    class="text-blue-500 cursor-pointer flex justify-start items-center">
                    <RepeatIcon class="mr-2" /> Souscrire
                  </span>
                </Tippy>
              </td>
            </tr>
          </tbody>
        </table>
      </ModalBody>
    </Modal>
    <!-- END: Super Large Modal Content -->

    <!-- price modal end -->

    <!-- modal de payement -->

    <Modal :show="payModalPreview" @hidden="payModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">

          <div class="text-3xl mt-5">Détail du pack</div>
          <div class="text-slate-500 mt-2 space-x-2" v-if="infoPayement">
            <span> Nom: <span class="font-bold text-red-300">{{ infoPayement.nom }}</span> </span>
            <span>Quantité :<span class="font-bold text-red-300">{{ infoPayement.nbre }}</span> </span>

            <p>Prix : <span class="font-black text-lg text-red-700">{{ infoPayement.montant }} XOF</span></p>
          </div>
          <div>
            <p>Description : {{ infoPayement.description }}</p>
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button v-if="chargement2" class="btn btn-warning mr-1 mb-2">
            Payement en cours
            <LoadingIcon icon="three-dots" color="1a202c" class="w-4 h-4 ml-2" />
          </button>
          <button v-else type="button" @click="payPack" class="btn w-24 btn-danger">
            Payer
          </button>

        </div>

      </ModalBody>
    </Modal>
    <!-- fin modal de payement -->

    <Modal :show="payReabonnementModalPreview" @hidden="payReabonnementModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">

          <div class="text-3xl mt-5">Détail du pack</div>
          <div class="text-slate-500 mt-2 space-x-2" v-if="infoPayement">
            <span> Nom: <span class="font-bold text-red-300">{{ infoPayement.nom }}</span> </span>
            <span>Quantité :<span class="font-bold text-red-300">{{ infoPayement.nbre }}</span> </span>

            <p>Prix : <span class="font-black text-lg text-red-700">{{ infoPayement.montant }} XOF</span></p>
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button v-if="chargement2" class="btn btn-warning mr-1 mb-2">
            Payement en cours
            <LoadingIcon icon="three-dots" color="1a202c" class="w-4 h-4 ml-2" />
          </button>
          <button v-else type="button" @click="payReabonnementPack" class="btn w-24 btn-danger">
            Payer
          </button>

        </div>

      </ModalBody>
    </Modal>


    <!-- BEGIN: Modal Content -->
    <Modal :show="deleteModalPreview" @hidden="deleteModalPreview = false">
      <ModalBody class="p-0">
        <div class="p-5 text-center">
          <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
          <div class="text-3xl mt-5">Vous etes sur de supprimer {{ deleteData.nom }} ?</div>
          <div class="text-slate-500 mt-2">
            Cette operation est irreverssible ? <br />Cliquer
            sur annuler pour annuler l'operation
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button type="button" @click="deleteModalPreview = false" class="btn btn-outline-secondary w-24 mr-1">
            Annuler
          </button>
          <button type="button" @click="deleteBSD" class="btn btn-danger w-24">
            Supprimer
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->



     <!-- BEGIN: Modal organisation -->
     <Modal :show="organisationModal" @hidden="organisationModal = false">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeBSD">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control"
              placeholder="Nom équipement" />
          </div>
          <div>
            <label for="regular-form-1" class="form-label">Organisation </label>


            <TomSelect v-model="formData.type" :options="{ placeholder: 'Selectionez le type' }" class="w-full">

              <option v-for="(type, index) in types" :key="index" :value="type.id">{{ type.nom }}
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

        <form v-else key="modifier" @submit.prevent="updateBSD">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control"
              placeholder="Nom équipement" />
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



    <!-- BEGIN: Modal Content -->
    <Modal :show="showModal" @hidden="showModal = false">
      <ModalBody class="p-10 ">
        <form v-if="!isUpdate" key="ajouter" @submit.prevent="storeBSD">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="formData.nom" class="form-control"
              placeholder="Nom équipement" />
          </div>
          <div>
            <label for="regular-form-1" class="form-label">Type </label>


            <TomSelect v-model="formData.type" :options="{ placeholder: 'Selectionez le type' }" class="w-full">

              <option v-for="(type, index) in types" :key="index" :value="type.id">{{ type.nom }}
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

        <form v-else key="modifier" @submit.prevent="updateBSD">
          <div>
            <label for="regular-form-1" class="form-label">Nom</label>
            <input id="regular-form-1" type="text" required v-model="saveUpdate.nom" class="form-control"
              placeholder="Nom équipement" />
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

    <Modal size="modal-xl" :show="InformationPreview" @hidden="InformationPreview = false">
      <ModalBody class="p-10 text-center bg-slate-100">
        <h2 class="intro-y text-2xl font-medium my-10 text-center mr-auto">
          Niveau de batterie
        </h2>
        <table class="table mt-5">
          <thead class="table-light">
            <tr>
              <th class="whitespace-nowrap">#</th>
              <th class="whitespace-nowrap">Batterie</th>
              <th class="whitespace-nowrap text-center">Solaire </th>
              <th class="whitespace-nowrap">Date de cration</th>
            </tr>
          </thead>
          <tbody>

            <tr v-for="(data, index) in informations " :key="index">
              <td> {{ index + 1 }} </td>
              <td>{{ data.bat }}</td>
              <td> {{ data.solar }}</td>
              <td> {{ data.created_at }}</td>
            </tr>
          </tbody>
        </table>
        <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
          <div class="box p-5 zoom-in">
            <div class="flex">
              <div class="text-lg font-medium truncate mr-3">Batterie</div>
              <div
                class="bg-yellow-100 shadow-2xl py-1 px-2 flex items-center  rounded-full text-xs  dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">
                {{ lastBatterie }}
              </div>
            </div>
            <div class="mt-1">
              <SimpleLineChart1 :chartData="batterie" :height="58" class="-ml-1" />
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
          <div class="box p-5 zoom-in">
            <div class="flex">
              <div class="text-lg font-medium truncate mr-3">Solaire</div>
              <div
                class="bg-yellow-100 shadow-2xl py-1 px-2 flex items-center  rounded-full text-xs  dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">
                {{ lastSolaire }}
              </div>
            </div>
            <div class="mt-1">
              <SimpleLineChart1 :chartData="solaire" :height="58" class="-ml-1" />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>

    <!-- @click="router.push({ name: 'Tarifications' })" -->
    <div class=" flex justify-between ">
      <button @click="showTarification" class="btn btn-primary flex space-x-2 items-center">
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
            <th class="whitespace-nowrap">Nom de l'équipement</th>
            <th class="whitespace-nowrap">Type d'équipement</th>
            <th class="whitespace-nowrap text-center">Code de configuration </th>
            <th class="whitespace-nowrap">Etat</th>
            <th class="whitespace-nowrap text-center">Duree d'abonnement</th>
            <th v-if="$h.getPermission('write.equipement')" class="whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="(data, index) in resultQuery " :key="index">
            <td> {{ index + 1 }} </td>

            <td>{{ data.nom }}</td>

            <td v-if="data.type == 'tablette'">
              <span :style="{'background':'blue'}" class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{ data.type.toUpperCase() }}</span>
            </td>

            <td v-else-if="data.type == 'qr'">
              <span :style="{'background':'red'}" class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{ data.type.toUpperCase() }}</span>
            </td>

            <td v-if="data.type == 'kit'">
              <span :style="{'background':'green'}" class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{ data.type.toUpperCase() }}</span>
            </td>

            <td class="text-center" v-if="data.type.toLowerCase() == 'qr'">
              <!-- <a target="_blank" class="text-blue-600" :href="FRONT_BASE_URL + 'voter/' + data.code">{{ data.code }} </a>
              <button type="button" @click="showQRCodeModal(data.code)"
                class="btn btn-elevated-danger py-1 px-1 w-full my-1  xl:mr-1 align-top">
                Générer QR Code
              </button> -->
              <a @click="infoModal()" target="_blank" class="text-blue-600" :href="FRONT_BASE_URL + 'voter/' + data.code">
               Cliquer pour répondre au sondage</a>
              <img :src="data.qrCode" alt="QR Code" v-if="data.qrCode">
            </td>
            <td class="text-center" v-else> <a>{{ data.code }}</a></td>

            <td v-if="data.statut">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </td>
            <td v-else>
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            </td>

            <td v-if="data.statut" class="text-center">
              <div class="text-xs text-left px-1 rounded-full  text-white mr-1"
                v-for="date in data.souscriptionNonExpires">
                <p class="font-bold text-black my-0.5">
                  Début: <span class="text-xs px-1 rounded-full bg-warning text-white mr-1"> {{ date.debut }}</span>
                </p>
                <p class="font-bold text-black my-0.5"> Fin: <span
                    class="text-xs px-1 rounded-full bg-warning text-white mr-1"> {{ date.fin }}</span> </p>
              </div>
            </td>
            <td v-else class="text-center">
              Début: <span class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{ data.souscription?.debut }} /
                {{
                  data.souscription?.fin }}</span> <br>
              Fin: <span class="text-xs px-1 rounded-full bg-warning text-white mr-1">{{
                data.souscription?.fin }}</span>
            </td>

            <td v-if="$h.getPermission('write.equipement')" class="space-y-2 ">

              <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                content="cliquez pour dérouler le menu des actions">
                <Dropdown class="inline-block" placement="top-end">
                  <DropdownToggle class="mr-1">
                    <AlignJustifyIcon />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                        content="cliquez pour modifier">
                        <span @click="modifier(index, data)"
                          class="text-black cursor-pointer flex justify-start items-center">
                          <EditIcon class="mr-2" /> Modifier
                        </span>
                      </Tippy>
                      <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                        content="cliquez pour supprimer">
                        <span @click="supprimer(index, data)"
                          class="text-black cursor-pointer flex justify-start items-center">
                          <Trash2Icon class="mr-2" /> Supprimer
                        </span>
                      </Tippy>

                      <Tippy v-if="data.type == 'kit'" tag="a" href="javascript:;" class="tooltip  inline-block my-2"
                        content="cliquez pour voir les feedbacks par bsd">
                        <span @click="getInformation(data)"
                          class="text-black cursor-pointer flex justify-start items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-trending-up mr-2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                          </svg>Voir Information </span>
                      </Tippy>

                      <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2 justify-start items-center"
                        content="cliquez pourprolonger ou réabonner">
                        <span class="text-black cursor-pointer flex " @click="showReabonnementTarification(data)">
                          <DollarSignIcon class="mr-2" /> Se réabonner
                        </span>
                      </Tippy>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </Tippy>

              <Tippy tag="a" href="javascript:;" class="tooltip inline-block my-2"
                content="date création et de mise à jour">
                <div class="text-center">
                  <InfoIcon href="javascript:;" :name="'custom-tooltip-content' + index" class="tooltip" />
                </div>
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
              </Tippy>
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


      <!-- modal ajout de bsd -->

      <Modal :show="showModal2" @hidden="close">
        <ModalBody class="p-10 ">
          <form key="ajouter" @submit.prevent="saveInfo">
            <div class="mb-2">
              <label for="regular-form-1" class="form-label">Conctact</label>
              <input id="regular-form-1" type="number" required v-model="formDataPack.contact" class="form-control mb-1"
                placeholder="Entrer votre numéro de téléphone" />
              <span class="text-black" v-if="valideConctact">Saisie Correct</span>
              <span class="text-red-500" v-else>Votre contact doit contenir au moin 8 caractères</span>
            </div>

            <button class="btn btn-danger py-3 px-4 w-full my-3  xl:mr-3 align-top">
              <span class="text-sm font-semibold uppercase" v-if="!chargement">
                Passer la commande
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

      <!-- fin modal d'ajout -->

      <Modal :show="showModal3" @hidden="close">
        <ModalBody class="p-10 ">
          <form key="ajouter" @submit.prevent="saveInfoReabonnement">
            <div class="mb-2">
              <label for="regular-form-1" class="form-label">Conctact</label>
              <input id="regular-form-1" type="number" required v-model="formDataPackReabonnement.contact"
                class="form-control mb-1" placeholder="Entrer votre numéro de téléphone" />
              <span class="text-black" v-if="valideConctact">Saisie Correct</span>
              <span class="text-red-500" v-else>Votre contact doit contenir au moin 8 caractères</span>
            </div>

            <button class="btn btn-danger py-3 px-4 w-full my-3  xl:mr-3 align-top">
              <span class="text-sm font-semibold uppercase" v-if="!chargement">
                Passer la commande
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

      <Modal :show="qrModalPreview" @hidden="qrModalPreview = false">
        <ModalBody class="py-3">
          <div class="qr-code-modal-content ">
            <img :src="qrCodeUrl" alt="QR Code" />
            <qrcode-vue :value="lien" :size="size" level="H" />

            <div class="qr-code-modal-buttons  w-1/2">
              <button type="button" @click="downloadQRCode" class="btn btn-primary py-1 px-2 w-full mx-1">
                Télécharger
              </button>
              <button type="button" @click="qrModalPreview = false" class="btn btn-danger py-1 px-2 w-full mx-">
                Fermer
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

    </div>

  </div>

</template>

<script setup>
  import QrcodeVue from 'qrcode.vue'

import { ref, reactive, onMounted, provide, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import BsdService from "@/services/modules/bsd.service";
import QRCode from 'qrcode';
import { FRONT_BASE_URL } from "@/services/configs/environment";
import PackService from '../../services/modules/pack.service';
import SouscriptionService from '../../services/modules/souscription.service';
import GrilleTarifaireService from '../../services/modules/grilleTarifaire.service';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useColorSchemeStore } from "@/stores/color-scheme";
import SimpleLineChart1 from "@/components/simple-line-chart-1/Main.vue";
import { helper as $h } from "@/utils/helper";

const showModal2 = ref(false) //ouvre le modal d'ajout de bsd
const showModal3 = ref(false)
const tableauPack = ref([])
const grilleTarifaires = ref([])
const ouvrirTarifs = ref(false)
const ouvrirReabonnementTarifs = ref(false)
const typeReabonnement = ref('')
const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const deleteModalPreview = ref(false)
const qrModalPreview = ref(false)
const successNotification = ref();
const search = ref('')
const bsds = ref([])
const bsdId = ref('')
const packId = ref('')
const grilleTarifaireId = ref('')
const InformationPreview = ref(false) // ouvre le modal des stats par campagnes
const informations = ref({})
const lastBatterie = ref(0)
const lastSolaire = ref(0)

const value = ref('https://dashboard.mybsd.shop/voter/490D9F922')
const size = ref(300)
const lien = ref("")



const payModalPreview = ref(false)  // ouvre le modal de payement
const payReabonnementModalPreview = ref(false)  // ouvre le modal de payement

const types = [
  {
    id: 1,
    nom: "Kit"
  },
  {
    id: 2,
    nom: "Qr"
  },
  {
    id: 3,
    nom: "Tablette"
  }
]
const state = reactive({
  qrCodeUrl: '',
});
const qrCodeUrl = ref('')
const deleteData = reactive({})
const saveUpdate = reactive({})
const chargement = ref(false)
const chargement2 = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const props = defineProps({
  width: {
    type: [Number, String],
    default: "auto",
  },
  height: {
    type: [Number, String],
    default: "auto",
  },
  lineColor: {
    type: String,
    default: "",
  },
});

const colorScheme = computed(() => useColorSchemeStore().colorScheme);

const batterie = reactive({
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
      label: "# of Votes",
      data: [0, 850, 1050, 950, 1100, 900, 1200, 200, 250, 200, 500, 450, 100],
      borderWidth: 2,
      borderColor:
        colorScheme.primary,
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
  ],
})
const solaire = reactive({
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
      label: "# of Votes",
      data: [0, 850, 1050, 950, 1100, 900, 1200, 200, 250, 200, 500, 450, 100],
      borderWidth: 2,
      borderColor:
        colorScheme.primary,
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
  ],
})


const isUpdate = ref(false)
const formData = reactive({
  nom: ''
})
const valideConctact = ref(false)
const formDataPack = reactive({
  contact: ''
})

const formDataPackReabonnement = reactive({
  contact: '',
  grilleTarifaireId: ''
})

const infoPayement = reactive({
  id: '',
  montant: '',
  nom: '',
  nbre: '',
  description: ''

})

const message = reactive({
  type: 'success',
  message: '',
})

const resultQuery = computed(() => {
  if (search.value) {
    return bsds.value.filter((item) => {
      return search.value.toLowerCase().split(' ').every(v => item.nom.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.type.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.code.toLowerCase().includes(v)) ||
        search.value.toLowerCase().split(' ').every(v => item.created_at.toLowerCase().includes(v))
    })
  } else {
    // return bsds.value;

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return bsds.value.slice(startIndex, endIndex);
  }
})



onMounted(function () {
  if (!$h.getPermission('read.equipement')) {
    router.push('/error-page')
  }
  getData()
  getPacks()
  getGrilleTarifaires()

  tableauPack.value
})

function getInformation(kit) {

  InformationPreview.value = true

  BsdService.getInformation(kit.id).then((data) => {

    var response = data.data.data
    informations.value = response[0]
    batterie.datasets.data = response[1]
    solaire.datasets.data = response[2]
    lastBatterie.value = response[0][0].bat
    lastSolaire.value = response[0][0].solar

  }).catch((e) => {
    // alert(e)
  })

}

const getData = function () {
  BsdService.getBsdByEntreprise().then((data) => {
    bsds.value = data.data.data

    console.log(bsds.value)
  }).catch((e) => {
    // disabled()
    alert(e)
  })
}
function close() {
  formData.nom = ''
  showModal.value = false
}

function totalPages() {
  return Math.ceil(bsds.value.length / itemsPerPage.value);
}

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages()) {
    return;
  }
  currentPage.value = pageNumber;
}



provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggles = () => {
  // Show notification
  successNotification.value.showToast();
};





const addBSD = function () {
  showModal.value = true
  isUpdate.value = false
}


const storeBSD = function () {
  if (chargement.value == false) {
    chargement.value = true
    BsdService.create(formData).then((data) => {
      close()
      message.type = 'success'
      message.message = 'Nouveau BSD ajouté'
      successNotificationToggles()

      getData()
      chargement.value = false
    }).catch((error) => {
      chargement.value = false
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message
        message.type = 'erreur'
        message.message = erreurs
        successNotificationToggles()
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
const deleteBSD = function () {
  deleteModalPreview.value = false
  bsds.value.splice(bsds.value.indexOf(deleteData.index), 1);
  BsdService.destroy(deleteData.id).then((data) => {
    message.type = 'success'
    message.message = 'Operation éffectué avec success'
    successNotificationToggles()
    getData()
  }).catch((error) => {

    if (error.response) {
      // Requête effectuée mais le serveur a répondu par une erreur.
      const erreurs = error.response.data.message
      message.type = 'erreur'
      message.message = erreurs
      successNotificationToggles()
    } else if (error.request) {
      // Demande effectuée mais aucune réponse n'est reçue du serveur.
      //console.log(error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la demande
    }
  })
}

const generateQRCode = (code) => {
  let qrCodeData = FRONT_BASE_URL + `/voter/${code}`;
  // lien = FRONT_BASE_URL + `/voter/${code}`;


  QRCode.toDataURL(qrCodeData, (err, url) => {
    if (err) throw err;
    state.qrCodeUrl = url;
    qrCodeUrl.value = url;
  });
}

const downloadQRCode = () => {
  const link = document.createElement('a');
  link.href = state.qrCodeUrl;
  link.download = 'qr-code.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const showQRCodeModal = function (code) {
  generateQRCode(code);
  qrModalPreview.value = true;
}

const modifier = function (index, data) {
  saveUpdate.nom = data.nom
  saveUpdate.id = data.id
  showModal.value = true
  isUpdate.value = true
}
const updateBSD = function () {
  if (chargement.value == false) {
    chargement.value = true
    const formData = {
      nom: saveUpdate.nom,
    }
    BsdService.update(saveUpdate.id, formData).then((data) => {
      chargement.value = false
      close()
      message.type = 'success'
      message.message = 'Mise à jours éffectué avec succèss'
      successNotificationToggles()

      getData()
      this.getData()
    }).catch((error) => {
      chargement.value = false
      if (error.response) {
        // Requête effectuée mais le serveur a répondu par une erreur.
        const erreurs = error.response.data.message
        message.type = 'erreur'
        message.message = erreurs
        successNotificationToggles()
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

watch(formDataPack, (value) => {

  if (formDataPack.contact.toString().length < 8) {
    valideConctact.value = false
  } else {
    valideConctact.value = true

  }

})

// get tarification
function getPacks() {
  PackService.get().then((data) => {
    tableauPack.value = data.data.data


  }).catch((e) => {
    // disabled()
    //alert(e)
  })

}

function getGrilleTarifaires() {
  GrilleTarifaireService.get().then((data) => {
    grilleTarifaires.value = data.data.data


  }).catch((e) => {
    // disabled()
    //alert(e)
  })

}

// ouvrir le modal de tarification

function showTarification() {
  ouvrirTarifs.value = true
}

function showReabonnementTarification(data) {
  typeReabonnement.value = data.type
  ouvrirReabonnementTarifs.value = true
  bsdId.value = data.id
}

const organisationModal = ref(false)

const infoModal = function(){
  organisationModal.value = true
}



// commander un bsd

function saveInfo() {

  formDataPack.packId = packId.value
  var form = {
    contact: formDataPack.contact,
    packId: packId.value
  }


  SouscriptionService.create(form).then((reponse) => {

    message.type = reponse.data.statut

    message.message = reponse.data.message

    successNotificationToggles()

    showModal2.value = false

  }).catch((e) => {


    message.type = e.response.data.statut
    message.message = e.response.data.message
    successNotificationToggles()

    // disabled()
    // alert(e)
  })


}

function saveInfoReabonnement() {

  showModal2.value = true
  var form = {
    contact: formDataPackReabonnement.contact,
    grilleTarifaireId: grilleTarifaireId.value
  }

  BsdService.reabonnement(bsdId.value, form).then((reponse) => {

    message.type = reponse.data.statut
    message.message = reponse.data.message
    successNotificationToggles()
    showModal2.value = false
    infoPayement.id = reponse.data.data[0].id
    infoPayement.montant = reponse.data.data[0].montant

    infoPayement.nom = reponse.data.data[0].souscription.abonnementable.type
    infoPayement.nbre = reponse.data.data[0].souscription.nbre
    bsdId.value = reponse.data.data[1].id

    payReabonnementModalPreview.value = true


    // payModalPreview.value = true
  }).catch((e) => {
    message.type = e.statut
    message.message = e.message
    successNotificationToggles()

    // disabled()
    // alert(e)
  })
}

// payement 

function payPack() {


  chargement2.value = true

  BsdService.payPack(infoPayement.id).then((response) => {
    chargement2.value = false
    payModalPreview.value = false
    message.type = 'success'
    message.message = 'Payement éffectuée avec succès'
    successNotificationToggles()

  }).catch((e) => {
    chargement2.value = false
    message.type = 'echec'
    message.message = 'Le payement à échoué'
    successNotificationToggles()

    // disabled()

  })
}

function payReabonnementPack() {

  chargement2.value = true

  BsdService.payReabonnementPack(infoPayement.id, bsdId.value).then((response) => {
    chargement2.value = false
    payReabonnementModalPreview.value = false
    message.type = 'success'
    message.message = 'Payement éffectuée avec succès'
    successNotificationToggles()

  }).catch((e) => {
    chargement2.value = false
    message.type = 'echec'
    message.message = 'Le payement à échoué'
    successNotificationToggles()
  })
}

// clique sur bouton ajouter pour ajouter un pack

function ouvrirFormulaire(data) {

  showModal2.value = true
  packId.value = data.id

}

function ouvrirFormulaireReabonnement(data) {
  showModal3.value = true
  grilleTarifaireId.value = data.id

}





</script>

<style lang="scss" scoped>
.qr-code-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qr-code-modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* Chrome */
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Opéra*/
input::-o-inner-spin-button,
input::-o-outer-spin-button {
  -o-appearance: none;
  margin: 0
}</style>