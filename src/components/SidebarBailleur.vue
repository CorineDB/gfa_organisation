<template>
  <div  class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0  md:left-0 h-screen scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter _scrollbar-w-2 _scrolling-touch  o lg:block bg-primary z-30 no-scrollbar overflow-y-auto" :class="sideBarOpen ? '' : 'hidden'" id="main-nav">
    <div class="w-full h-20  flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">PAPC</p>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/dashboard" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <span class=" ">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase ">Dashboard</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/ano" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <span class=" ">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase">DANO</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/pta" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <span class=" ">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase">PTAB</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer ">
      <router-link to="/bailleurs/composantes" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" t="1569683753031" viewBox="0 0 1024 1024" version="1.1" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8c-3.1-3.1-8.2-3.1-11.3 0L517 485.3l-86.1-86.2c-3.1-3.1-8.2-3.1-11.3 0L275.3 543.4c-3.1 3.1-3.1 8.2 0 11.3l36.8 36.8z"></path><path d="M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1c-3.7 2.4-4.7 7.3-2.3 11l30.3 47.2v0.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-0.1l30.3-47.2c2.4-3.7 1.3-8.6-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 512H160V232h704v440z"></path></svg>
        <span class="font-semibold text-xs uppercase">Composantes</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/sous-composantes" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" t="1569683753031" viewBox="0 0 1024 1024" version="1.1" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8c-3.1-3.1-8.2-3.1-11.3 0L517 485.3l-86.1-86.2c-3.1-3.1-8.2-3.1-11.3 0L275.3 543.4c-3.1 3.1-3.1 8.2 0 11.3l36.8 36.8z"></path><path d="M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1c-3.7 2.4-4.7 7.3-2.3 11l30.3 47.2v0.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-0.1l30.3-47.2c2.4-3.7 1.3-8.6-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 512H160V232h704v440z"></path></svg>
        <span class="font-semibold text-xs uppercase">Sous composantes</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/activites" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" t="1569683753031" viewBox="0 0 1024 1024" version="1.1" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8c-3.1-3.1-8.2-3.1-11.3 0L517 485.3l-86.1-86.2c-3.1-3.1-8.2-3.1-11.3 0L275.3 543.4c-3.1 3.1-3.1 8.2 0 11.3l36.8 36.8z"></path><path d="M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1c-3.7 2.4-4.7 7.3-2.3 11l30.3 47.2v0.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-0.1l30.3-47.2c2.4-3.7 1.3-8.6-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 512H160V232h704v440z"></path></svg>
        <span class="font-semibold text-xs uppercase">Activités</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer ">
      <router-link to="/bailleurs/taches" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-white  hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" t="1569683753031" viewBox="0 0 1024 1024" version="1.1" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8c-3.1-3.1-8.2-3.1-11.3 0L517 485.3l-86.1-86.2c-3.1-3.1-8.2-3.1-11.3 0L275.3 543.4c-3.1 3.1-3.1 8.2 0 11.3l36.8 36.8z"></path><path d="M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1c-3.7 2.4-4.7 7.3-2.3 11l30.3 47.2v0.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-0.1l30.3-47.2c2.4-3.7 1.3-8.6-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 512H160V232h704v440z"></path></svg>
        <span class="font-semibold text-xs uppercase">Taches</span>
      </router-link>
    </div>

   

    <div class="mb-3 px-6 relative" >
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck3">
      <header class="flex justify-between mb-3 items-center  cursor-pointer select-none tab-label" for="chck3">
        <div class="flex space-x-3 flex-wrap justify-end ">
          <span class="text-white ">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 15H4v-2h16v2zm0 2H4v2h16v-2zm-5-6l5-3.55V5l-5 3.55L10 5 4 8.66V11l5.92-3.61L15 11z"></path></svg>
          </span>
          <p class="text-white  text-xs font-semibold uppercase">Indicateurs</p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class='bx bx-chevron-down bx-sm text-white'></i>
      </header>
      <div class="tab-content mb-3 bg-white ">
        <div class="mb-3  flex items-center text-gray-700  cursor-pointer  ">
          <router-link to="/bailleurs/indicateurs" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Indicateurs</span>
          </router-link>
        </div>

        <div class="mb-3  flex items-center text-gray-700  cursor-pointer  ">
          <router-link to="/bailleurs/indicateurs/suivi" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">SUIVI</span>
          </router-link>
        </div>
      </div>
      
    </div>

    <div class="mb-3 px-6 relative" >
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck5">
      <header class="flex justify-between items-center mb-3  cursor-pointer select-none tab-label" for="chck5">
       <div class="flex space-x-3 flex-wrap justify-end ">
         <span class="text-white ">
           <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M298.9 24.31c-14.9.3-25.6 3.2-32.7 8.4l-97.3 52.1-54.1 73.59c-11.4 17.6-3.3 51.6 32.3 29.8l39-51.4c49.5-42.69 150.5-23.1 102.6 62.6-23.5 49.6-12.5 73.8 17.8 84l13.8-46.4c23.9-53.8 68.5-63.5 66.7-106.9l107.2 7.7-1-112.09-194.3-1.4zM244.8 127.7c-17.4-.3-34.5 6.9-46.9 17.3l-39.1 51.4c10.7 8.5 21.5 3.9 32.2-6.4 12.6 6.4 22.4-3.5 30.4-23.3 3.3-13.5 8.2-23 23.4-39zm-79.6 96c-.4 0-.9 0-1.3.1-3.3.7-7.2 4.2-9.8 12.2-2.7 8-3.3 19.4-.9 31.6 2.4 12.1 7.4 22.4 13 28.8 5.4 6.3 10.4 8.1 13.7 7.4 3.4-.6 7.2-4.2 9.8-12.1 2.7-8 3.4-19.5 1-31.6-2.5-12.2-7.5-22.5-13-28.8-4.8-5.6-9.2-7.6-12.5-7.6zm82.6 106.8c-7.9.1-17.8 2.6-27.5 7.3-11.1 5.5-19.8 13.1-24.5 20.1-4.7 6.9-5.1 12.1-3.6 15.2 1.5 3 5.9 5.9 14.3 6.3 8.4.5 19.7-1.8 30.8-7.3 11.1-5.5 19.8-13 24.5-20 4.7-6.9 5.1-12.2 3.6-15.2-1.5-3.1-5.9-5.9-14.3-6.3-1.1-.1-2.1-.1-3.3-.1zm-97.6 95.6c-4.7.1-9 .8-12.8 1.9-8.5 2.5-13.4 7-15 12.3-1.7 5.4 0 11.8 5.7 18.7 5.8 6.8 15.5 13.3 27.5 16.9 11.9 3.6 23.5 3.5 32.1.9 8.6-2.5 13.5-7 15.1-12.3 1.6-5.4 0-11.8-5.8-18.7-5.7-6.8-15.4-13.3-27.4-16.9-6.8-2-13.4-2.9-19.4-2.8z"></path></svg>
          </span>
          <p class="text-white text-xs font-semibold uppercase">Gestions Financières</p>
       </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class='bx bx-chevron-down bx-sm text-white'></i>
      </header>
      <div class="tab-content mb-3 bg-white ">
        <div class="mb-3 flex items-center text-gray-700  cursor-pointer">
          <router-link to="/bailleurs/finances/decaissement" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Décaissement</span>
          </router-link>
        </div>

        <div class="mb-3  flex items-center text-gray-700  cursor-pointer ">
          <router-link to="/bailleurs/finances/plan_decaissement" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Plan de decaissement</span>
          </router-link>
        </div>

        <div class="mb-3  flex items-center text-gray-700  cursor-pointer">
          <router-link to="/bailleurs/finances/suivi" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Suivi financier</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="mb-3 px-6 relative" >
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck4">
      <header class="flex justify-between mb-3 items-center  cursor-pointer select-none tab-label" for="chck4">
        <div class="flex space-x-3 flex-wrap justify-end ">
          <span class=" text-white">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"></path></svg>
          </span>
          <p class="text-white  text-xs font-semibold uppercase">Entreprises  </p>
        </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class='bx bx-chevron-down bx-sm text-white'></i>
      </header>
      <div class="tab-content mb-3 bg-white ">
        <div class="mb-3  flex items-center text-gray-700  cursor-pointer  ">
          <router-link to="/bailleurs/mod" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">MOD</span>
          </router-link>
        </div>

        <div class="mb-3  flex items-center text-gray-700  cursor-pointer  ">
          <router-link to="/bailleurs/mission-controle" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Mission de controle</span>
          </router-link>
        </div>

         <div class="mb-3  flex items-center text-gray-700  cursor-pointer  ">
          <router-link to="/bailleurs/entreprises" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Entreprises exécutante</span>
          </router-link>
        </div>
        
      </div>
    </div>
     <div class="mb-3 px-6 relative" >
      <input class="w-full absolute z-10 cursor-pointer opacity-0 h-5 top-0" type="checkbox" id="chck5">
      <header class="flex justify-between items-center mb-3  cursor-pointer select-none tab-label" for="chck5">
       <div class="flex space-x-3">
         <span class="text-white ">
           <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M298.9 24.31c-14.9.3-25.6 3.2-32.7 8.4l-97.3 52.1-54.1 73.59c-11.4 17.6-3.3 51.6 32.3 29.8l39-51.4c49.5-42.69 150.5-23.1 102.6 62.6-23.5 49.6-12.5 73.8 17.8 84l13.8-46.4c23.9-53.8 68.5-63.5 66.7-106.9l107.2 7.7-1-112.09-194.3-1.4zM244.8 127.7c-17.4-.3-34.5 6.9-46.9 17.3l-39.1 51.4c10.7 8.5 21.5 3.9 32.2-6.4 12.6 6.4 22.4-3.5 30.4-23.3 3.3-13.5 8.2-23 23.4-39zm-79.6 96c-.4 0-.9 0-1.3.1-3.3.7-7.2 4.2-9.8 12.2-2.7 8-3.3 19.4-.9 31.6 2.4 12.1 7.4 22.4 13 28.8 5.4 6.3 10.4 8.1 13.7 7.4 3.4-.6 7.2-4.2 9.8-12.1 2.7-8 3.4-19.5 1-31.6-2.5-12.2-7.5-22.5-13-28.8-4.8-5.6-9.2-7.6-12.5-7.6zm82.6 106.8c-7.9.1-17.8 2.6-27.5 7.3-11.1 5.5-19.8 13.1-24.5 20.1-4.7 6.9-5.1 12.1-3.6 15.2 1.5 3 5.9 5.9 14.3 6.3 8.4.5 19.7-1.8 30.8-7.3 11.1-5.5 19.8-13 24.5-20 4.7-6.9 5.1-12.2 3.6-15.2-1.5-3.1-5.9-5.9-14.3-6.3-1.1-.1-2.1-.1-3.3-.1zm-97.6 95.6c-4.7.1-9 .8-12.8 1.9-8.5 2.5-13.4 7-15 12.3-1.7 5.4 0 11.8 5.7 18.7 5.8 6.8 15.5 13.3 27.5 16.9 11.9 3.6 23.5 3.5 32.1.9 8.6-2.5 13.5-7 15.1-12.3 1.6-5.4 0-11.8-5.8-18.7-5.7-6.8-15.4-13.3-27.4-16.9-6.8-2-13.4-2.9-19.4-2.8z"></path></svg>
          </span>
          <p class="text-white text-xs font-semibold uppercase">Activité Environnement MOD</p>
       </div>
        <!-- <div class="rounded-full border border-gray h-6 w-6 flex items-center justify-center test">
          <svg aria-hidden="true" class="" data-reactid="266" fill="none" height="24" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div> -->
        <i class='bx bx-chevron-down bx-sm text-white'></i>
      </header>
      <div class="tab-content mb-3 bg-white ">
        <div class="mb-1 flex items-center text-gray-700  cursor-pointer">
          <router-link to="/dashboard/environements/indicateurs" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Activité de MOD</span>
          </router-link>
        </div>

        <div class="mb-1  flex items-center text-gray-700  cursor-pointer ">
          <router-link to="/dashboard/environement/suivi" style="width:100%" class="flex items-center  px-2 py-2 z-10 relative space-x-4 text-gray-700 hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
            <span class="font-semibold text-xs">Suivi environnement</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/ong" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <span class=" ">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M17 7h2v2h-2zM17 11h2v2h-2zM17 15h2v2h-2zM1 11v10h6v-5h2v5h6V11L8 6l-7 5zm12 8h-2v-5H5v5H3v-7l5-3.5 5 3.5v7z"></path><path d="M10 3v1.97l2 1.43V5h9v14h-4v2h6V3z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase">ONG / Agences de comunications</span>
      </router-link>
    </div>

    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
      <router-link to="/bailleurs/PAP" style="width:100%" class="flex space-x-3 items-center  px-2 py-2 z-10 relative   text-white hover:font-bold  transition ease-in-out duration-500  cursor-pointer">
        <span class=" ">
         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z"></path></svg>
        </span>
        <span class="font-semibold text-xs uppercase">PAPs</span>
      </router-link>
    </div>
    <div class="mb-3 px-4 flex items-center text-white  cursor-pointer">
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
       this.currentRole = this.currentUser.type

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

