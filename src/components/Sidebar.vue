<template>
  <div
    class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter _scrollbar-w-2 _scrolling-touch o lg:block bg-primary z-30 no-scrollbar overflow-y-auto"
    :class="sideBarOpen ? '' : 'hidden'" id="main-nav">
    <div class="w-full h-24 p-4 items-center text-xs text-center font-semibold uppercase text-white whitespace-nowrap">
      <div class="flex h-10 gap-2 mb-2">
        <div class="w-1/2"><img src="@/assets/images/login/logo-gouv.webp" alt="" class="w-full transparent"></div>
        <div class="w-1/2"><img src="@/assets/images/login/logo-sirat.webp" alt="" class="w-full"></div>
      </div>

      <span v-if="currentRole === 'unitee-de-gestion'">Espace : unite de gestion</span>
      <span v-else>Espace :{{ currentRole }}</span>
    </div>

    <div v-if="currentRole === 'bailleur'" class="mb-1 animation  px-4 flex items-center text-white cursor-pointer">
      <router-link to="#" style="width: 100%"
        class="flex space-x-3  items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Dashboard</span>
      </router-link>
    </div>

    <div v-if="programmeVisible" class="mb-1 animation px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/programme" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              d="M18.92 12c.04.33.08.66.08 1 0 2.08-.8 3.97-2.1 5.39-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H7v-2h2c.55 0 1-.45 1-1V8h2c1.1 0 2-.9 2-2V3.46c-.95-.3-1.95-.46-3-.46C5.48 3 1 7.48 1 13s4.48 10 10 10 10-4.48 10-10c0-.34-.02-.67-.05-1h-2.03zM10 20.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 16v1c0 1.1.9 2 2 2v1.93zM22 4v-.5a2.5 2.5 0 00-5 0V4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zm-1 0h-3v-.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V4z">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Programme</span>
      </router-link>
    </div>

    <div v-if="uniteeDeGestionVisible" class="mb-1 px-4 animation flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/unite-gestion" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              d="M16.49 15.5v-1.75L14 16.25l2.49 2.5V17H22v-1.5h-5.51zm3.02 4.25H14v1.5h5.51V23L22 20.5 19.51 18v1.75zM9.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5.75 8.9L3 23h2.1l1.75-8L9 17v6h2v-7.55L8.95 13.4l.6-3C10.85 12 12.8 13 15 13v-2c-1.85 0-3.45-1-4.35-2.45l-.95-1.6C9.35 6.35 8.7 6 8 6c-.25 0-.5.05-.75.15L2 8.3V13h2V9.65l1.75-.75">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Unite de gestion</span>
      </router-link>
    </div>

    <div v-if="currentRole === 'administrateur'"
      class="mb-1 px-4 animation flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/gouvernement" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              d="M16.49 15.5v-1.75L14 16.25l2.49 2.5V17H22v-1.5h-5.51zm3.02 4.25H14v1.5h5.51V23L22 20.5 19.51 18v1.75zM9.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5.75 8.9L3 23h2.1l1.75-8L9 17v6h2v-7.55L8.95 13.4l.6-3C10.85 12 12.8 13 15 13v-2c-1.85 0-3.45-1-4.35-2.45l-.95-1.6C9.35 6.35 8.7 6 8 6c-.25 0-.5.05-.75.15L2 8.3V13h2V9.65l1.75-.75">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Gouvernement</span>
      </router-link>
    </div>

    <div v-if="bailleursVsisible" class="mb-1 animation px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/bailleurs" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M20 4H4c-1.103 0-2 .897-2 2v2h20V6c0-1.103-.897-2-2-2zM2 18c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-6H2v6zm3-3h6v2H5v-2z">
          </path>
        </svg>
        <span class="font-semibold text-xs uppercase">Bailleurs</span>
      </router-link>
    </div>

    <div v-if="anoVisible || currentRole === 'bailleur'"
      class="mb-1 animation px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/ano" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="m21.706 5.291-2.999-2.998A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.291A.994.994 0 0 0 2 5.999V19c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5.999a.994.994 0 0 0-.294-.708zM6.414 4h11.172l.999.999H5.415L6.414 4zM4 19V6.999h16L20.002 19H4z">
          </path>
          <path d="M15 12H9v-2H7v4h10v-4h-2z"></path>
        </svg>
        <span class="font-semibold text-xs uppercase">ANO</span>
      </router-link>
    </div>

    <div
      v-if="projetVisible || composanteVisible || composanteReVisible || activiteVisible || activiteReVisible || planDecaissementVisible || tacheVisible || tacheReVisible"
      class="mb-1 px-6 animation relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck1" />
      <header class="flex justify-between items-center mb-3 cursor-pointer select-none tab-label" for="chck1">
        <div class="flex space-x-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20 3H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h4l-1.8 2.4 1.6 1.2 2.7-3.6h3l2.7 3.6 1.6-1.2L16 18h4c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 16V5h16l.001 11H4z">
            </path>
            <path d="M6 12h4v2H6z"></path>
          </svg>
          <p class="text-white text-xs font-semibold hover:text-sm transition-all duration-200 uppercase">Projets</p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>

      <div class="tab-content mb-3 bg-white">
        <div v-if="projetVisible" class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/projets" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Projets</span>
          </router-link>
        </div>

        <div v-if="composanteVisible || composanteReVisible"
          class="mb-1 flex items-center animation text-gray-700 cursor-pointer">
          <router-link to="/dashboard/projets/composantes-globale" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Composantes</span>
          </router-link>
        </div>

        <div v-if="composanteVisible || composanteReVisible"
          class="mb-1 flex items-center animation text-gray-700 cursor-pointer">
          <router-link to="/dashboard/projets/sous-composantes-globale" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Sous composantes</span>
          </router-link>
        </div>

        <div v-if="activiteVisible || activiteReVisible || planDecaissementVisible"
          class="mb-1 flex items-center animation text-gray-700 cursor-pointer">
          <router-link to="/dashboard/projets/activites-globale" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Activités</span>
          </router-link>
        </div>

        <div v-if="tacheVisible || tacheReVisible"
          class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/projets/taches-globale" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Taches</span>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="indicateurVisible || suiviIndicateurVisible" class="mb-1 animation px-6 relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck3" />
      <header class="flex justify-between mb-3 items-center cursor-pointer select-none tab-label" for="chck3">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M20 15H4v-2h16v2zm0 2H4v2h16v-2zm-5-6l5-3.55V5l-5 3.55L10 5 4 8.66V11l5.92-3.61L15 11z"></path>
            </svg>
          </span>
          <p class="text-white text-xs hover:text-sm transition-all duration-200 font-semibold uppercase">Cadre de
            résultat</p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div class="tab-content mb-3 bg-white">
        <div v-if="indicateurVisible" class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/indicateurs/" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Indicateurs</span>
          </router-link>
        </div>

        <div v-if="suiviIndicateurVisible" class="mb-1 flex animation items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/indicateurs/suivi" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Suivi</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- <div v-if="indicateurModVisible || suiviIndicateurModVisible  " class="mb-1 px-6 relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck33" />
      <header class="flex justify-between mb-3 items-center cursor-pointer select-none tab-label" for="chck3">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M20 15H4v-2h16v2zm0 2H4v2h16v-2zm-5-6l5-3.55V5l-5 3.55L10 5 4 8.66V11l5.92-3.61L15 11z"></path>
            </svg>
          </span>
          <p class="text-white text-xs font-semibold uppercase">Indicateurs MOD</p>
        </div>
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div v-if="indicateurModVisible" class="tab-content mb-3 bg-white">
        <div class="mb-1 flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/indicateurs-mod" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Indicateurs</span>
          </router-link>
        </div>

        <div v-if="suiviIndicateurModVisible" class="mb-1 flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/indicateurs/suivi-mod" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Suivi</span>
          </router-link>
        </div>
      </div>
    </div> -->

    <div
      v-if="currentRole === 'bailleur' || decaissementVisible || planDecaissementVisible || pointFinancierVisible || suiviFinancierVisible"
      class="mb-1 px-6 animation relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck5" />
      <header class="flex justify-between items-center mb-3 cursor-pointer select-none tab-label" for="chck5">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M298.9 24.31c-14.9.3-25.6 3.2-32.7 8.4l-97.3 52.1-54.1 73.59c-11.4 17.6-3.3 51.6 32.3 29.8l39-51.4c49.5-42.69 150.5-23.1 102.6 62.6-23.5 49.6-12.5 73.8 17.8 84l13.8-46.4c23.9-53.8 68.5-63.5 66.7-106.9l107.2 7.7-1-112.09-194.3-1.4zM244.8 127.7c-17.4-.3-34.5 6.9-46.9 17.3l-39.1 51.4c10.7 8.5 21.5 3.9 32.2-6.4 12.6 6.4 22.4-3.5 30.4-23.3 3.3-13.5 8.2-23 23.4-39zm-79.6 96c-.4 0-.9 0-1.3.1-3.3.7-7.2 4.2-9.8 12.2-2.7 8-3.3 19.4-.9 31.6 2.4 12.1 7.4 22.4 13 28.8 5.4 6.3 10.4 8.1 13.7 7.4 3.4-.6 7.2-4.2 9.8-12.1 2.7-8 3.4-19.5 1-31.6-2.5-12.2-7.5-22.5-13-28.8-4.8-5.6-9.2-7.6-12.5-7.6zm82.6 106.8c-7.9.1-17.8 2.6-27.5 7.3-11.1 5.5-19.8 13.1-24.5 20.1-4.7 6.9-5.1 12.1-3.6 15.2 1.5 3 5.9 5.9 14.3 6.3 8.4.5 19.7-1.8 30.8-7.3 11.1-5.5 19.8-13 24.5-20 4.7-6.9 5.1-12.2 3.6-15.2-1.5-3.1-5.9-5.9-14.3-6.3-1.1-.1-2.1-.1-3.3-.1zm-97.6 95.6c-4.7.1-9 .8-12.8 1.9-8.5 2.5-13.4 7-15 12.3-1.7 5.4 0 11.8 5.7 18.7 5.8 6.8 15.5 13.3 27.5 16.9 11.9 3.6 23.5 3.5 32.1.9 8.6-2.5 13.5-7 15.1-12.3 1.6-5.4 0-11.8-5.8-18.7-5.7-6.8-15.4-13.3-27.4-16.9-6.8-2-13.4-2.9-19.4-2.8z">
              </path>
            </svg>
          </span>
          <p class="text-white text-xs hover:text-sm transition-all duration-200 font-semibold uppercase">Gestions
            Financières</p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div class="tab-content mb-3 bg-white">
        <div v-if="pointFinancierVisible || currentRole === 'bailleur'"
          class="mb-1  flex items-center text-gray-700  cursor-pointer ">
          <router-link to="/dashboard/finances/point-financier" style="width:100%"
            class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Point financier</span>
          </router-link>
        </div>

        <div v-if="planDecaissementVisible || currentRole === 'bailleur'"
          class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/finances/plan_decaissement" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Plan de decaissement</span>
          </router-link>
        </div>

        <div v-if="decaissementVisible || currentRole === 'bailleur'"
          class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/finances/decaissement" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Décaissement</span>
          </router-link>
        </div>

        <div v-if="suiviFinancierVisible || currentRole === 'bailleur'"
          class="mb-1 animation flex items-center text-gray-700  cursor-pointer">
          <router-link to="/dashboard/finances/suivi" style="width:100%"
            class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Suivi Budgétaire</span>
          </router-link>
        </div>
      </div>
    </div>



    <div v-if="papVisible"
      class="mb-1 px-6 animation relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck8" />
      <header class="flex justify-between items-center mb-3 cursor-pointer select-none tab-label" for="chck8">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M298.9 24.31c-14.9.3-25.6 3.2-32.7 8.4l-97.3 52.1-54.1 73.59c-11.4 17.6-3.3 51.6 32.3 29.8l39-51.4c49.5-42.69 150.5-23.1 102.6 62.6-23.5 49.6-12.5 73.8 17.8 84l13.8-46.4c23.9-53.8 68.5-63.5 66.7-106.9l107.2 7.7-1-112.09-194.3-1.4zM244.8 127.7c-17.4-.3-34.5 6.9-46.9 17.3l-39.1 51.4c10.7 8.5 21.5 3.9 32.2-6.4 12.6 6.4 22.4-3.5 30.4-23.3 3.3-13.5 8.2-23 23.4-39zm-79.6 96c-.4 0-.9 0-1.3.1-3.3.7-7.2 4.2-9.8 12.2-2.7 8-3.3 19.4-.9 31.6 2.4 12.1 7.4 22.4 13 28.8 5.4 6.3 10.4 8.1 13.7 7.4 3.4-.6 7.2-4.2 9.8-12.1 2.7-8 3.4-19.5 1-31.6-2.5-12.2-7.5-22.5-13-28.8-4.8-5.6-9.2-7.6-12.5-7.6zm82.6 106.8c-7.9.1-17.8 2.6-27.5 7.3-11.1 5.5-19.8 13.1-24.5 20.1-4.7 6.9-5.1 12.1-3.6 15.2 1.5 3 5.9 5.9 14.3 6.3 8.4.5 19.7-1.8 30.8-7.3 11.1-5.5 19.8-13 24.5-20 4.7-6.9 5.1-12.2 3.6-15.2-1.5-3.1-5.9-5.9-14.3-6.3-1.1-.1-2.1-.1-3.3-.1zm-97.6 95.6c-4.7.1-9 .8-12.8 1.9-8.5 2.5-13.4 7-15 12.3-1.7 5.4 0 11.8 5.7 18.7 5.8 6.8 15.5 13.3 27.5 16.9 11.9 3.6 23.5 3.5 32.1.9 8.6-2.5 13.5-7 15.1-12.3 1.6-5.4 0-11.8-5.8-18.7-5.7-6.8-15.4-13.3-27.4-16.9-6.8-2-13.4-2.9-19.4-2.8z">
              </path>
            </svg>
          </span>
          <p class="text-white text-xs hover:text-sm transition-all duration-200 font-semibold uppercase">Gestions
            Environnementales et sociales</p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div class="tab-content mb-3 bg-white">
        <div v-if="activiteEnVisible || entrepriseExecutanteVisible || formulaireVisible || papVisible"
          class="mb-1  flex items-center text-gray-700  cursor-pointer ">
          <router-link to="/dashboard/paps" style="width:100%"
            class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">PAP</span>
          </router-link>
        </div>

      </div>
    </div>

   

    <div v-if="voirPtaVisible || voirPpmVisible"
      class="mb-1 animation px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/pta" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 11h7v2H7zm0-4h10.97v2H7zm0 8h13v2H7zM4 4h2v16H4z"></path>
        </svg>
        <span class="font-semibold text-xs uppercase">PTBA</span>
      </router-link>
    </div>
    <!-- 
    <div v-if="maitriseOeuvreVisible" class="mb-1 px-4 flex items-center text-white cursor-pointer"> -->
    <!-- <div  class="mb-1 px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/maitrise-ouvrage" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2H6c-1.206 0-3 .799-3 3z"></path></svg>
        <span class="font-semibold text-xs uppercase">Engagements et Décaissement du MOD</span>
      </router-link>
    </div> -->

    <div v-if="entrepriseExecutanteVisible || modVsisible || missionControleVisible"
      class="mb-1 animation px-6 relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck4" />
      <header class="flex justify-between mb-3 items-center cursor-pointer select-none tab-label" for="chck4">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z">
              </path>
            </svg>
          </span>
          <p class="text-white text-xs hover:text-sm transition-all duration-200 font-semibold uppercase">Entreprises
          </p>
        </div>
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div class="tab-content mb-3 bg-white">
        <div v-if="modVsisible" class="mb-1 flex animation items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/mod" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">MOD</span>
          </router-link>
        </div>

        <div v-if="missionControleVisible" class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/mission-controle" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Mission de controle</span>
          </router-link>
        </div>

        <div v-if="entrepriseExecutanteVisible" class="mb-1 flex animation items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/entreprises" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Entreprises exécutante</span>
          </router-link>
        </div>
      </div>
    </div>

    <!--  <div  class="mb-1 px-6 animation relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck4" />
      <header class="flex justify-between mb-3 items-center cursor-pointer select-none tab-label" for="chck4">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z">
              </path>
            </svg>
          </span>
          <p class="text-white text-xs hover:text-sm transition-all duration-200 font-semibold uppercase">Configuration cadre logique </p>
        </div>
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div class="tab-content mb-3 bg-white">
        <div  class="mb-1 flex animation items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/objectif-specifique" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">objectif specifique </span>
          </router-link>
        </div>

  
        <div  class="mb-1 animation flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/resultat-cadre-logique" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">resultatCadre</span>
          </router-link>
        </div>
      </div> 
    </div> -->

    <div v-if="institutionVisible" class="mb-1 px-4 animation flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/instutitions" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              d="M17 7h2v2h-2zM17 11h2v2h-2zM17 15h2v2h-2zM1 11v10h6v-5h2v5h6V11L8 6l-7 5zm12 8h-2v-5H5v5H3v-7l5-3.5 5 3.5v7z">
            </path>
            <path d="M10 3v1.97l2 1.43V5h9v14h-4v2h6V3z"></path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Instutitions</span>
      </router-link>
    </div>

    <!-- <div class="mb-1 px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/formulaire" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M448 75.2v361.7c0 24.3-19 43.2-43.2 43.2H43.2C19.3 480 0 461.4 0 436.8V75.2C0 51.1 18.8 32 43.2 32h361.7c24 0 43.1 18.8 43.1 43.2zm-37.3 361.6V75.2c0-3-2.6-5.8-5.8-5.8h-9.3L285.3 144 224 94.1 162.8 144 52.5 69.3h-9.3c-3.2 0-5.8 2.8-5.8 5.8v361.7c0 3 2.6 5.8 5.8 5.8h361.7c3.2.1 5.8-2.7 5.8-5.8zM150.2 186v37H76.7v-37h73.5zm0 74.4v37.3H76.7v-37.3h73.5zm11.1-147.3l54-43.7H96.8l64.5 43.7zm210 72.9v37h-196v-37h196zm0 74.4v37.3h-196v-37.3h196zm-84.6-147.3l64.5-43.7H232.8l53.9 43.7zM371.3 335v37.3h-99.4V335h99.4z">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Collectes</span>
      </router-link>
    </div> -->

    <!-- <div  class="mb-1 px-4 flex animation items-center text-white cursor-pointer">
      <router-link to="/dashboard/kobotoolsbox" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg>

        </span>
        <span class="font-semibold text-xs uppercase">Kobotoolsbox</span>
      </router-link>
    </div> -->


    <div v-if="auditVisible" class="mb-1 px-4 flex animation items-center text-white cursor-pointer">
      <router-link to="/dashboard/audit" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M296 250c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm184 144H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-48 458H208V148h560v320c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm440-88H728v-36.6c46.3-13.8 80-56.6 80-107.4 0-61.9-50.1-112-112-112s-112 50.1-112 112c0 50.7 33.7 93.6 80 107.4V764H520c-8.8 0-16 7.2-16 16v152c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16V780c0-8.8-7.2-16-16-16zM646 620c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50zm180 266H566v-60h260v60z">
            </path>
          </svg>

        </span>
        <span class="font-semibold text-xs uppercase">Audits</span>
      </router-link>
    </div>

    <div v-if="historiqueVisible" class="mb-1 animation px-4 flex items-center text-white cursor-pointer">
      <router-link to="/dashboard/historique" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
            stroke-linejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <desc></desc>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="12 8 12 12 14 14"></polyline>
            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Flux Activités</span>
      </router-link>
    </div>




    <div v-if="roleVisible" class="mb-1 px-4 flex animation items-center text-white cursor-pointer">
      <router-link to="/dashboard/roles" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Role et permissions</span>
      </router-link>
    </div>

    <div v-if="utilisateurVisible" class="mb-1 px-4 flex animation items-center text-white cursor-pointer">
      <router-link to="/dashboard/utilisateurs" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
            width="1.3em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              d="M20 9V6h-2v3h-3v2h3v3h2v-3h3V9h-3zM9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6.39 8.56C13.71 13.7 11.53 13 9 13s-4.71.7-6.39 1.56A2.97 2.97 0 001 17.22V20h16v-2.78c0-1.12-.61-2.15-1.61-2.66zM15 18H3v-.78c0-.38.2-.72.52-.88C4.71 15.73 6.63 15 9 15c2.37 0 4.29.73 5.48 1.34.32.16.52.5.52.88V18z">
            </path>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">Utilisateurs</span>
      </router-link>
    </div>
    <div v-if="utilisateurVisible" class="mb-1 px-4 flex animation items-center text-white cursor-pointer">
      <router-link to="/dashboard/cobo" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg width="16px" height="16px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"
            stroke="#ffffff">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC"
              stroke-width="1.32"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="m19.101 3.291-2.392-2.392507.3984-.398487c.6606-.660775 1.7319-.660775 2.3925 0 .6604.660574.6604 1.731414 0 2.391984z"
                fill="#5c5f62"></path>
              <path d="m15.6108 1.99445 2.392 2.39251-6.5028 6.50324-3.16846.7766.77644-3.16915z" fill="#5c5f62"></path>
              <path
                d="m3 3v11h3.5c.77479 0 1.38768.6623 1.92584 1.2439.00864.0093.01729.0186.02593.028.02846.0307.05688.0614.0848.0913.36511.3918.88566.6368 1.46343.6368.5778 0 1.0983-.245 1.4634-.6368.0336-.036.0675-.0726.1017-.1096l.0088-.0095c.5381-.5814 1.1515-1.2441 1.9261-1.2441h3.5v-3c0-.5523.4477-1.00001 1-1.00001s1 .44771 1 1.00001v6.5c0 .8284-.6716 1.5-1.5 1.5h-15c-.82843 0-1.5-.6716-1.5-1.5v-15c0-.82843.67157-1.5 1.5-1.5h6.5c.55229 0 1 .44772 1 1s-.44772 1-1 1z"
                fill="#5c5f62"></path>
            </g>
          </svg>
        </span>
        <span class="font-semibold text-xs uppercase">kobotoolsbox</span>
      </router-link>
    </div>
    <div v-if="utilisateurVisible" class="mb-1 px-4 flex animation items-center text-white cursor-pointer">
      <router-link to="/dashboard/rapport" style="width: 100%"
        class="flex space-x-3 items-center px-2 py-2 z-10 relative text-white hover:font-bold transition ease-in-out duration-500 cursor-pointer">
        <span class=" ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="m20 8-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase">Rapport</span>
      </router-link>
    </div>


    <div v-if="currentRole === 'unitee-de-gestion'" class="px-6 animation mb-10 relative">
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck2" />
      <header class="flex justify-between mb-3 items-center cursor-pointer select-none tab-label" for="chck2">
        <div class="flex space-x-3">
          <span class="text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em"
              width="1.3em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z">
              </path>
            </svg>
          </span>
          <p class="text-white text-xs hover:text-sm transition-all duration-200 font-semibold uppercase">Configurations
          </p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class="bx bx-chevron-down bx-sm text-white"></i>
      </header>
      <div class="tab-content bg-white mb-16">
        <!-- <div class="mb-1 flex items-center text-gray-700  cursor-pointer my-1 ">
          <router-link to="/dashboard/config" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4  hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Pays</span>
          </router-link>
        </div>

        <div class="mb-1  flex items-center text-gray-700  cursor-pointer  ">
          <router-link to="/dashboard/config/departements" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Sites</span>
          </router-link>
        </div>

         -->

        <div v-if="backupVisible" class="mb-1  flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/backup" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Sauvegarde</span>
          </router-link>
        </div>

        <div v-if="uniteDeMesureVisible" class="mb-1  flex items-center text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/unites" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Unité de mesures</span>
          </router-link>
        </div>

        <div v-if="categorieVisible" class="mb-1 flex items-center mt-2 text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/categories" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Catégories</span>
          </router-link>
        </div>




        <div v-if="siteVisible" class="mb-1 flex items-center mt-2 text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/sites" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Sites</span>
          </router-link>
        </div>

        <div v-if="alertVisible" class="mb-1 flex items-center mt-2 text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/alert" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Alertes systeme</span>
          </router-link>
        </div>
        <div class="mb-10 flex items-center mt-2 text-gray-700 cursor-pointer">
          <router-link to="/dashboard/config/rappel" style="width: 100%"
            class="flex items-center px-2 py-2 z-10 relative space-x-4 hover:font-bold transition ease-in-out duration-500 cursor-pointer">
            <span class="font-semibold text-xs">Rappel taches</span>
          </router-link>
        </div>

      </div>
      <!-- <div style="width:100%" class=" flex items-center relative z-50 mt-12 mb-16   px-2 py-2 text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <button @click="logout"  class="w-full bg-Primary text-white p-2 font-medium text-xs flex items-center space-x-3 ">
          <span class="">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"></path></svg>
          </span>
          <span class="font-semibold text-xs uppercase">Deconnexion</span>
        </button>
      </div> -->
    </div>
  </div>
</template>
<script>
import PermissionsService from "@/services/modules/permission.service.js";
import { mapState, mapGetters, mapActions } from 'vuex'
import forEach from 'ramda/src/forEach';
import uniteeDeGestions from '@/store/modules/uniteeDeGestions';
export default {
  name: "sidebar",
  computed: {
    ...mapState(['sideBarOpen']),
    ...mapGetters('auths', { currentUser: 'GET_AUTHENTICATE_USER' })
  },
  data() {
    return {
      currentRole: '',
      permissions: [],
      programmeVisible: false,
      uniteeDeGestionVisible: false,
      bailleursVsisible: false,
      roleVisible: false,
      anoVisible: false,
      projetVisible: false,
      composanteVisible: false,
      composanteReVisible: false,
      activiteVisible: false,
      activiteReVisible: false,
      tacheVisible: false,
      tacheReVisible: false,
      suiviTacheVisible: false,
      suiviTacheReVisible: false,
      indicateurVisible: false,
      indicateurModVisible: false,
      planDecaissementVisible: false,
      modVsisible: false,
      missionControleVisible: false,
      entrepriseExecutanteVisible: false,
      suiviFinancierVisible: false,
      checklistVisible: false,
      pointFinancierVisible: false,
      decaissementVisible: false,
      papVisible: false,
      utilisateurVisible: false,
      voirPtaVisible: false,
      voirPpmVisible: false,
      institutionVisible: false,
      dashboardProjetVisible: false,
      raccourcieElementVisible: false,
      statistiqueActiviteVisible: false,
      statistiqueActiviteReVisible: false,
      voirDecaissementVisible: false,
      suiviIndicateurVisible: false,
      suiviIndicateurModVisible: false,
      revisionVisible: false,
      listeEntrepriseModVisible: false,
      listeEntrepriseMoVisible: false,
      activiteEnvMoVisible: false,
      listeEntrepriseExecVisible: false,
      passationModVisible: false,
      passationMissionVisible: false,
      passationEntrepriseVisible: false,
      checklistModVisible: false,
      gouvernementVisible: false,
      activiteEnVisible: false,
      formulaireVisible: false,
      uniteDeMesureVisible: false,
      categorieVisible: false,
      siteVisible: false,
      alertVisible: false,
      historiqueVisible: false,
      backupVisible: false,
      maitriseOeuvreVisible: false,
      auditVisible: false,
    }
  },
  methods: {
    getPermission() {
      this.currentUser.role[0].permissions.forEach(element => {
        if (element.slug === 'voir-un-utilisateur') {
          this.utilisateurVisible = true
        }
        if (element.slug === 'voir-un-audit') {
          this.auditVisible = true
        }
        if (element.slug === 'voir-une-institution') {
          this.institutionVisible = true
        }
        if (element.slug === 'voir-ptab') {
          this.voirPtaVisible = true
        }
        if (element.slug === 'voir-ppm') {
          this.voirPpmVisible = true
        }

        if (element.slug === 'voir-un-decaissement') {
          this.decaissementVisible = true
        }
        if (element.slug === 'voir-un-pap') {
          this.papVisible = true
        }
        if (element.slug === 'voir-un-programme') {
          this.programmeVisible = true
        }
        if (element.slug === 'voir-un-suivi-financier') {
          this.pointFinancierVisible = true
        }
        if (element.slug === 'voir-une-checklist') {
          this.checklistVisible = true
        }
        if (element.slug === 'voir-une-unitee-de-gestion') {
          this.uniteeDeGestionVisible = true
        }
        if (element.slug === 'voir-un-mod') {
          this.modVsisible = true
        }
        if (element.slug === 'voir-une-mission-de-controle') {
          this.missionControleVisible = true
        }
        if (element.slug === 'voir-une-entreprise-executante') {
          this.entrepriseExecutanteVisible = true
        }
        if (element.slug === 'voir-un-suivi-financier') {
          this.suiviFinancierVisible = true
        }
        if (element.slug === 'voir-un-bailleur') {
          this.bailleursVsisible = true
        }
        if (element.slug === 'voir-un-ano') {
          this.anoVisible = true
        }
        if (element.slug === 'voir-un-role') {
          this.roleVisible = true
        }
        if (element.slug === 'voir-un-projet') {
          this.projetVisible = true
        }
        if (element.slug === 'voir-une-composante') {
          this.composanteVisible = true
        }
        if (element.slug === 'voir-une-composante-revise') {
          this.composanteReVisible = true
        }
        if (element.slug === 'voir-une-activite') {
          this.activiteVisible = true
        }
        if (element.slug === 'voir-une-activite-revise') {
          this.activiteReVisible = true
        }
        if (element.slug === 'voir-une-tache') {
          this.tacheVisible = true
        }
        if (element.slug === 'voir-un-suivi-tache') {
          this.suiviTacheVisible = true
        }
        if (element.slug === 'voir-une-tache-revise') {
          this.tacheReVisible = true
        }
        if (element.slug === 'voir-un-suivi-tache-revise') {
          this.suiviTacheReVisible = true
        }
        if (element.slug === 'voir-un-indicateur') {
          this.indicateurVisible = true
        }
        if (element.slug === 'voir-un-indicateur-mod') {
          this.indicateurModVisible = true
        }

        if (element.slug === 'voir-un-suivi-indicateur') {
          this.suiviIndicateurVisible = true
        }
        if (element.slug === 'voir-un-suivi-indicateur-mod') {
          this.suiviIndicateurModVisible = true
        }

        if (element.slug === 'voir-un-plan-de-decaissement') {
          this.planDecaissementVisible = true
        }
        if (element.slug === 'voir-un-dashboard') {
          this.dashboardProjetVisible = true
        }
        if (element.slug === 'voir-raccourcir-composante-activite-tache') {
          this.raccourcieElementVisible = true
        }
        if (element.slug === 'voir-une-statistique') {
          this.statistiqueActiviteVisible = true
        }
        if (element.slug === 'voir-une-statistique-revise') {
          this.statistiqueActiviteReVisible = true
        }
        if (element.slug === 'voir-un-decaissement') {
          this.decaissementVisible = true
        }
        if (element.slug === 'voir-revision-ptab') {
          this.revisionVisible = true
        }
        if (element.slug === 'voir-un-decaissement') {
          this.decaissementVisible = true
        }
        if (element.slug === 'voir-une-liste-entreprise-mod') {
          this.listeEntrepriseModVisible = true
        }
        if (element.slug === 'voir-une-liste-entreprise-mission-de-controle') {
          this.listeEntrepriseMoVisible = true
        }
        if (element.slug === 'voir-activite-environnementale-mission-de-controle') {
          this.activiteEnvMoVisible = true
        }
        if (element.slug === 'voir-activite-environnementale-mission-de-controle') {
          this.activiteEnvMoVisible = true
        }
        if (element.slug === 'voir-une-liste-entreprise-entreprise-exec') {
          this.listeEntrepriseExecVisible = true
        }
        if (element.slug === 'voir-passation-mission-de-controle') {
          this.passationMissionVisible = true
        }
        if (element.slug === 'voir-passation-entreprise-executante') {
          this.passationEntrepriseVisible = true
        }
        if (element.slug === 'voir-passation-mod') {
          this.passationModVisible = true
        }
        if (element.slug === 'voir-une-checklist-mod') {
          this.checklistModVisible = true
        }
        if (element.slug === 'voir-un-gouvernement') {
          this.gouvernementVisible = true
        }
        if (element.slug === 'voir-une-activite-environnementale') {
          this.activiteEnVisible = true
        }
        if (element.slug === 'voir-un-formulaire') {
          this.formulaireVisible = true
        }
        if (element.slug === 'voir-une-configuration-alerte') {
          this.alertVisible = true
        }
        if (element.slug === 'voir-un-site') {
          this.siteVisible = true
        }
        if (element.slug === 'voir-une-categorie') {
          this.categorieVisible = true
        }
        if (element.slug === 'voir-une-unite-de-mesure') {
          this.uniteDeMesureVisible = true
        }
        if (element.slug === 'voir-un-historique') {
          this.historiqueVisible = true
        }
        if (element.slug === 'faire-un-backup') {
          this.backupVisible = true
        }
        if (element.slug === 'voir-une-maitrise-oeuvre') {
          this.maitriseOeuvreVisible = true
        }


      });

    },

  },
  mounted() {
    this.getPermission()
    if (this.currentUser != undefined) {
      this.currentRole = this.currentUser.type

    }
  }
};
</script>

<style scoped>
.router-link-exact-active {
  color: #fff;
  font-weight: bold;
  padding: 10px 18px;
  background-color: #00acee;
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
  display: none;
}

input:checked+.tab-label .test {
  background-color: rgb(255, 255, 255);
}

input:checked+.tab-label .test svg {
  transform: rotate(180deg);
  stroke: #000;
}

input:checked+.tab-label::after {
  transform: rotate(90deg);
}

input:checked~.tab-content {
  max-height: 100vh;
  display: block;
  transition: all 0.5s;
}

.bx.bx-chevron-down {
  font-weight: 700;
}

/* img.transparent {
  color: #222;
  background: hsl(0,0%,90%) url("chrome://global/skin/media/imagedoc-lightnoise.png");
} */

.animation:hover {
  transform: rotate(-1deg);
  transition: all 0.2s ease-in-out;
}
</style>
