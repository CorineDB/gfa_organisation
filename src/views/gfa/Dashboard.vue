<template>
  
  <div class="flex items-center mt-4">

    <h2 class="text-lg font-medium mr-5 whitespace-nowrap">Filtre :</h2>
    <div class="w-full flex items-center gap-2">

      <Dropdown class="md:ml-auto md:mt-0 w-full">
        <DropdownToggle class="btn btn-outline-secondary font-normal w-full text-left">
          {{ selectedIndicateur.name }}
          <ChevronDownIcon class="w-4 h-4 ml-2" />
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent class="overflow-y-auto h-32">
            <DropdownItem v-for="(indicateurOfCampagne, index ) in indicateurOfCampagnes" :key="index"
              @click="choixIndicateur(indicateurOfCampagne)">
              {{
                indicateurOfCampagne.nom }}</DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>

      <Dropdown class="md:ml-auto md:mt-0 w-full">
        <DropdownToggle class="btn btn-outline-secondary font-normal w-full text-left">
          {{ selectedIndicateur.name }}
          <ChevronDownIcon class="w-4 h-4 ml-2" />
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent class="overflow-y-auto h-32">
            <DropdownItem v-for="(indicateurOfCampagne, index ) in indicateurOfCampagnes" :key="index"
              @click="choixIndicateur(indicateurOfCampagne)">
              {{
                indicateurOfCampagne.nom }}</DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>

      <Dropdown class="md:ml-auto md:mt-0 w-full">
        <DropdownToggle class="btn btn-outline-secondary font-normal w-full text-left">
          {{ selectedIndicateur.name }}
          <ChevronDownIcon class="w-4 h-4 ml-2" />
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent class="overflow-y-auto h-32">
            <DropdownItem v-for="(indicateurOfCampagne, index ) in indicateurOfCampagnes" :key="index"
              @click="choixIndicateur(indicateurOfCampagne)">
              {{
                indicateurOfCampagne.nom }}</DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
  
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div class="grid grid-cols-12 gap-6">

        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Principe de Perception</h2>
            <a href="" class="ml-auto flex items-center text-primary">
              <RefreshCcwIcon class="w-4 h-4 mr-3" /> Actualiser
            </a>
          </div>
          <div class="grid grid-cols-12 lg:grid-cols-10 gap-6 mt-5">
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <div class="ml-auto z-10 font-medium">
                      <Tippy tag="div"
                        class="_report-box__indicator bg-success cursor-pointer rounded-full text-white animate-pulse"
                        content="100%">
                        <CircleIcon class="w-6 h-6" />
                      </Tippy>
                    </div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6"
                    v-if="statistique.passable && statistique.mediocre && statistique.excellent"> {{
                      statistique.passable[0] + statistique.mediocre[0] +
                      statistique.excellent[0] }}
                  </div>
                  <div class="text-base text-slate-500 mt-1">TOTAL FICHE</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <div v-if="statistique.excellent" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-danger cursor-pointer" content="">
                        {{ statistique.excellent[1] }}
                        <ChevronDownIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>
                    <div class="w-full bg-red-600 absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.excellent"> {{
                    statistique.excellent[0] }} </div>

                  <div class="text-base text-slate-500 mt-1">Non Observé</div>

                </div>
              </div>
            </div>

            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">

                    <div v-if="statistique.passable" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="">
                        {{ statistique.passable[1] }}
                        <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>

                    <div class="w-full bg-orange-500 absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.passable"> {{
                    statistique.passable[0] }} </div>
                  <div class="text-base text-slate-500 mt-1">Partiellement Observé</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <!-- <UserIcon class="report-box__icon text-success" /> -->
                    <div v-if="statistique.mediocre" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="">
                        {{ statistique.mediocre[1] }}
                        <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>

                    <div class="w-full bg-yellow-400 absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>

                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.mediocre"> {{
                    statistique.mediocre[0] }}</div>

                  <div class="text-base text-slate-500 mt-1">Moyennement Observé</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <!-- <UserIcon class="report-box__icon text-success" /> -->
                    <div v-if="statistique.mediocre" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="">
                        {{ statistique.mediocre[1] }}
                        <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>
                    <div class="w-full bg-success absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>

                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.mediocre"> {{
                    statistique.mediocre[0] }}</div>

                  <div class="text-base text-slate-500 mt-1">Observé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->

        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Principe Factuel</h2>
            <a href="" class="ml-auto flex items-center text-primary">
              <RefreshCcwIcon class="w-4 h-4 mr-3" /> Actualiser
            </a>
          </div>
          <div class="grid grid-cols-12 lg:grid-cols-10 gap-6 mt-5">
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <div class="ml-auto z-10 font-medium">
                      <Tippy tag="div"
                        class="_report-box__indicator bg-success cursor-pointer rounded-full text-white animate-pulse"
                        content="100%">
                        <CircleIcon class="w-6 h-6" />
                      </Tippy>
                    </div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6"
                    v-if="statistique.passable && statistique.mediocre && statistique.excellent"> {{
                      statistique.passable[0] + statistique.mediocre[0] +
                      statistique.excellent[0] }}
                  </div>
                  <div class="text-base text-slate-500 mt-1">TOTAL FICHE</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <div v-if="statistique.excellent" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-danger cursor-pointer" content="">
                        {{ statistique.excellent[1] }}
                        <ChevronDownIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>
                    <div class="w-full bg-red-600 absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.excellent"> {{
                    statistique.excellent[0] }} </div>

                  <div class="text-base text-slate-500 mt-1">Non Observé</div>

                </div>
              </div>
            </div>

            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">

                    <div v-if="statistique.passable" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="">
                        {{ statistique.passable[1] }}
                        <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>

                    <div class="w-full bg-orange-500 absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.passable"> {{
                    statistique.passable[0] }} </div>
                  <div class="text-base text-slate-500 mt-1">Partiellement Observé</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <!-- <UserIcon class="report-box__icon text-success" /> -->
                    <div v-if="statistique.mediocre" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="">
                        {{ statistique.mediocre[1] }}
                        <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>

                    <div class="w-full bg-yellow-400 absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>

                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.mediocre"> {{
                    statistique.mediocre[0] }}</div>

                  <div class="text-base text-slate-500 mt-1">Moyennement Observé</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-4 lg:col-span-2 intro-y relative">
              <div class="report-box zoom-in">
                <div class="box p-5 min-card-height">
                  <div class="flex">
                    <div v-if="statistique.mediocre" class="ml-auto z-10 font-medium">
                      <Tippy tag="div" class="report-box__indicator bg-success cursor-pointer" content="">
                        {{ statistique.mediocre[1] }}
                        <ChevronUpIcon class="w-4 h-4 ml-0.5" />
                      </Tippy>
                    </div>
                    <div class="w-full bg-success absolute top-0 left-0 p-4 rounded-t-[6px]"></div>
                  </div>

                  <div class="text-3xl font-medium leading-8 mt-6" v-if="statistique.mediocre"> {{
                    statistique.mediocre[0] }}</div>

                  <div class="text-base text-slate-500 mt-1">Observé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->

        <!-- BEGIN: Sales Report -->

        <!-- choix export excel -->
        <Modal :show="voirOptionExcel" @hidden="voirOptionExcel = false">
          <a @click="voirOptionExcel = false" class="absolute right-0 top-0 mt-3 mr-3" href="javascript:;">
            <XIcon class="w-8 h-8 text-slate-400" />
          </a>
          <ModalBody class="p-10 text-center">
            <p class="my-2 text-lg">Choisir la donnée à exporter </p>
            <div class="flex justify-center space-x-1">
              <button @click="exportToExcel('Campagne')" class="btn btn-primary mr-1">Campagne</button>
              <!-- END: Hide Modal Toggle -->
              <!-- BEGIN: Toggle Modal Toggle -->
              <button @click="exportToExcel('Indicateur')" class="btn btn-primary mr-1">Indicateur</button>
              <!-- END: Toggle Modal Toggle -->
              <button @click="exportToExcel('Site')" class="btn btn-primary mr-1">Site</button>

            </div>
            <!-- BEGIN: Hide Modal Toggle -->

          </ModalBody>
        </Modal>



        <div class="col-span-12 lg:col-span-6 mt-8">
          <div class="intro-y block sm:flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Outil de Perception</h2>
            <div class="flex justify-center items-center ">
              <input class="mr-2" @click="isDisabled = !isDisabled" type="checkbox" name="multidate" id="multidate">
              <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                <CalendarIcon class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0" />
                <Litepicker :disabled="isDisabled" v-model="salesReportFilter" @update:modelValue="filterDate(a)"
                  :options="{
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
              </div>
            </div>

          </div>
          <div class="intro-y box p-5 mt-12 sm:mt-5">
            <div class="flex justify-between space-x-1  ">

              <!-- <div class="flex flex-col space-y-1 ">
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
              </div> -->
              <!-- bouton exporter -->
              <div>
                <Dropdown :show="closeExport">
                  <DropdownToggle class="btn btn-primary flex justify-evenly items-center space-x-1">
                    <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
                      <path d="M11 16h2V7h3l-4-5-4 5h3z"></path>
                      <path
                        d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
                      </path>
                    </svg>
                    Exporter
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-48">
                    <DropdownContent>

                      <!-- exportation excel avec option -->
                      <!-- @click="exportToExcel()" -->
                      <DropdownItem @click="voirOptionExcel = true">

                        <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                          style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                          <path
                            d="M4 21h15.893c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zm0-2v-5h4v5H4zM14 7v5h-4V7h4zM8 7v5H4V7h4zm2 12v-5h4v5h-4zm6 0v-5h3.894v5H16zm3.893-7H16V7h3.893v5z">
                          </path>
                        </svg>

                        Excel

                      </DropdownItem>

                      <!-- exportation pdf  -->
                      <DropdownItem @click="generateReport()">
                        <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                          style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                          <path
                            d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z">
                          </path>
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z">
                          </path>
                        </svg>
                        Pdf
                      </DropdownItem>

                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <!-- fin bouton exporter -->
            </div>

            <div class="flex flex-col">
              <div class="flex items-center flex-wrap gap-2 mt-2">

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal">
                    {{ selectedIndicateur.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem v-for="(indicateurOfCampagne, index ) in indicateurOfCampagnes" :key="index"
                        @click="choixIndicateur(indicateurOfCampagne)">
                        {{
                          indicateurOfCampagne.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>

                <!-- <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal">
                    {{ selectedType.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem v-for="(type, index ) in types" :key="index" @click="choixtype(type)">{{
                        type.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown> -->

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal" v-if="campagnes">
                    {{ selectedSite.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem v-for="(siteOfCampagne, index ) in siteOfCampagnes" :key="index"
                        @click="choixSite(siteOfCampagne)">{{
                          siteOfCampagne.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="truncate btn btn-outline-secondary font-normal">
                    {{ selectedCampagne.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem class="truncate" v-for="(campagne, index ) in campagnes" :key="index"
                        @click="choixCampagne(campagne)">
                        {{
                          campagne.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal" v-if="campagnes">
                    {{ selectedYear }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem v-for="(year, index ) in years" :key="index" @click="choixAnnee(year)">{{
                        year }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>


                <!-- <div class="flex">
                  <div
                    class="z-30 rounded-l w-12 flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-1 dark:border-dark-4 -mr-1 p-1">
                    Année
                  </div>
                  <TomSelect v-model="selectedYear" :options="{
                    placeholder: 'Veuillez choisir une année',
                  }" class="w-20">
                    <option v-for="(year, index ) in years" :key="index" :value="year">{{ year }}</option>
                  </TomSelect>

                </div> -->
              </div>
              <p v-if="messageForUser" class="border text-right text-red-500 inline p-1 w-auto">Veuillez choisir une
                campagne</p>
            </div>
            <div class="report-chart">
              <ReportLineChart id="rapportAnnuel" :graphData="graphData" :height="275" class="mt-6 -mb-6" />
            </div>
          </div>
        </div>

        <!-- graph 2 -->
        <div class="col-span-12 lg:col-span-6 mt-8">
          <div class="intro-y block sm:flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Outil Factuel</h2>
            <div class="flex justify-center items-center ">
              <input class="mr-2" @click="isDisabled = !isDisabled" type="checkbox" name="multidate" id="multidate">
              <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                <CalendarIcon class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0" />
                <Litepicker :disabled="isDisabled" v-model="salesReportFilter" @update:modelValue="filterDate(a)"
                  :options="{
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
              </div>
            </div>

          </div>
          <div class="intro-y box p-5 mt-12 sm:mt-5">
            <div class="flex justify-between space-x-1  ">

              <!-- <div class="flex flex-col space-y-1 ">
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
              </div> -->
              <!-- bouton exporter -->
              <div>
                <Dropdown :show="closeExport">
                  <DropdownToggle class="btn btn-primary flex justify-evenly items-center space-x-1">
                    <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;">
                      <path d="M11 16h2V7h3l-4-5-4 5h3z"></path>
                      <path
                        d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
                      </path>
                    </svg>
                    Exporter
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-48">
                    <DropdownContent>

                      <!-- exportation excel avec option -->
                      <!-- @click="exportToExcel()" -->
                      <DropdownItem @click="voirOptionExcel = true">

                        <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                          style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                          <path
                            d="M4 21h15.893c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zm0-2v-5h4v5H4zM14 7v5h-4V7h4zM8 7v5H4V7h4zm2 12v-5h4v5h-4zm6 0v-5h3.894v5H16zm3.893-7H16V7h3.893v5z">
                          </path>
                        </svg>

                        Excel

                      </DropdownItem>

                      <!-- exportation pdf  -->
                      <DropdownItem @click="generateReport()">
                        <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                          style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                          <path
                            d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z">
                          </path>
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z">
                          </path>
                        </svg>
                        Pdf
                      </DropdownItem>

                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <!-- fin bouton exporter -->
            </div>

            <div class="flex flex-col">
              <div class="flex items-center flex-wrap gap-2 mt-2">

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal">
                    {{ selectedIndicateur.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem v-for="(indicateurOfCampagne, index ) in indicateurOfCampagnes" :key="index"
                        @click="choixIndicateur(indicateurOfCampagne)">
                        {{
                          indicateurOfCampagne.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>

                <!-- <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal">
                    {{ selectedType.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem v-for="(type, index ) in types" :key="index" @click="choixtype(type)">{{
                        type.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown> -->

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal" v-if="campagnes">
                    {{ selectedSite.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-auto pb-1">
                      <DropdownItem v-for="(siteOfCampagne, index ) in siteOfCampagnes" :key="index"
                        @click="choixSite(siteOfCampagne)">{{
                          siteOfCampagne.nom }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="truncate btn btn-outline-secondary font-normal">
                    {{ selectedCampagne.name }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32">
                      <DropdownItem class="truncate" v-for="(campagne, index ) in campagnes" :key="index"
                        @click="choixCampagne(campagne)">
                        {{
                          campagne.nom }}</DropdownItem>

                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown class="md:ml-auto md:mt-0">
                  <DropdownToggle class="btn btn-outline-secondary font-normal" v-if="campagnes">
                    {{ selectedYear }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>

                  <DropdownMenu class="w-40">
                    <DropdownContent class="overflow-y-auto h-32 pb-1">
                      <DropdownItem v-for="(year, index ) in years" :key="index" @click="choixAnnee(year)">{{
                        year }}</DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>


                <!-- <div class="flex">
                  <div
                    class="z-30 rounded-l w-12 flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-1 dark:border-dark-4 -mr-1 p-1">
                    Année
                  </div>
                  <TomSelect v-model="selectedYear" :options="{
                    placeholder: 'Veuillez choisir une année',
                  }" class="w-20">
                    <option v-for="(year, index ) in years" :key="index" :value="year">{{ year }}</option>
                  </TomSelect>

                </div> -->
              </div>
              <p v-if="messageForUser" class="border text-right text-red-500 inline p-1 w-auto">Veuillez choisir une
                campagne</p>
            </div>
            <div class="report-chart">
              <!-- <ReportLineChart id="rapportAnnuel" :graphData="graphData" :height="275" class="mt-6 -mb-6" /> -->
              <ReportBarChart1 id="rapportAnnuel" :graphData="graphDataFac" :height="290" class="mt-6 -mb-6" />
            </div>
          </div>
        </div>

        <!-- BEGIN: Weekly Top Seller -->
        <!-- <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Résolution</h2>
            <a href="http://localhost:3000/dashboard/resolution" class="ml-auto text-primary truncate">Voir plus</a>

          </div>
          <div class="intro-y box p-5 mt-5">
            <div class="mt-3">
              <ReportPieChart :chartData="chartData" :height="213" />
            </div>
            <div class="w-52 sm:w-auto mx-auto mt-8">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span class="truncate">Terminé</span>
                <span class="font-medium ml-auto"> {{ resolutionTerminer }}%</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span class="truncate">En cour</span>
                <span class="font-medium ml-auto">{{ resolutionEncour }}%</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span class="truncate">En retard </span>
                <span class="font-medium ml-auto">{{ resolutionEnretard }}%</span>
              </div>
            </div>
          </div>
        </div> -->
        <!-- END: Weekly Top Seller -->
        <!-- BEGIN: Sales Report -->
        <!-- <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Statistique journalier</h2>
            <a href="" class="ml-auto text-primary truncate">Voir plus</a>
          </div>
          <div class="intro-y box p-5 mt-5">
            <div class="mt-3">
              <ReportDonutChart :chartData="dayStatC" :height="213" />
            </div>
            <div class="w-52 sm:w-auto mx-auto mt-8">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span class="truncate">bon</span>
                <span class="font-medium ml-auto">{{ jexcellent }}%</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                <span class="truncate">Passable</span>
                <span class="font-medium ml-auto">{{ jpassable }}%</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 bg-danger rounded-full mr-3"></div>
                <span class="truncate">mediocre</span>
                <span class="font-medium ml-auto">{{ jmediocre }}%</span>
              </div>
            </div>
          </div>
        </div> -->
        <!-- END: Sales Report -->


        <!-- BEGIN: General Report -->
        <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
          <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
            <div class="box p-5 zoom-in">
              <div class="flex items-center">
                <div class="w-1/2 text-center flex-none">
                  <div class="text-lg font-medium ">STATS/J/ Tous campagnes</div>
                  <div class="text-slate-500">KIT BSD </div>
                </div>
                <div class="flex w-4/5 mx-auto justify-evenly">
                  <!-- <div class="flex flex-col space-y-1 ">
                    <div class="flex">
                      <span class="w-20">Excellent</span>
                      <span v-if="statistique.toutCampagneJExcellentKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentKit[0] }}</span>

                      <span v-if="statistique.toutCampagneJExcellentKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentKit[1] }}%</span>

                    </div>
                    <div class="flex">
                      <span class="w-20">Passable</span>
                      <span v-if="statistique.toutCampagneJPassableKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableKit[0] }}</span>

                      <span v-if="statistique.toutCampagneJPassableKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableKit[1] }}%</span>

                    </div>
                    <div class="flex">
                      <span class="w-20">Médiocre</span>
                      <span v-if="statistique.toutCampagneJMediocreKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreKit[0] }}</span>

                      <span v-if="statistique.toutCampagneJMediocreKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreKit[1] }}%</span>

                    </div>
                  </div> -->
                  <div class="flex-none ml-auto relative">
                    <ReportDonutChart :chartData="dayStatAllKit" :width="90" :height="90" />
                    <div v-if="statistique.toutCampagneJExcellentKit"
                      class="font-medium absolute w-full h-full  text-green-700 flex items-center justify-center top-0 left-0">
                      {{ statistique.toutCampagneJExcellentKit[1] }} %

                    </div>
                    <span v-if="statistique.toutCampagneJExcellentQr"
                      class="p-0.5 tracking-[0.1em] flex items-center justify-center rounded-full shadow-2xl bg-blue-700 text-white mr-1">
                      <span v-if="statistique.toutCampagneJExcellentKit"
                        class="p-0.5 tracking-[0.1em] flex items-center justify-center rounded-full shadow-2xl bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentKit[0] }}
                      </span>

                      <span v-if="statistique.toutCampagneJPassableKit"
                        class="p-0.1 tracking-[.0.1em] flex items-center justify-center rounded-full shadow-2xl bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableKit[0] }}</span>

                      <span v-if="statistique.toutCampagneJMediocreKit"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full shadow-2xl bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreKit[0] }}</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
            <div class="box p-5 zoom-in">
              <div class="flex  items-center">
                <div class="w-1/2 text-center flex-none">
                  <div class="text-lg font-medium ">STATS/J/ Tous campagnes</div>
                  <div class="text-slate-500">QR code </div>
                </div>
                <div class="flex w-4/5 mx-auto justify-evenly">
                  <!-- <div class="flex flex-col space-y-1 ">
                    <div class="flex">
                      <span class="w-20">Excellent</span>
                      <span v-if="statistique.toutCampagneJExcellentQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentQr[0] }}</span>

                      <span v-if="statistique.toutCampagneJExcellentQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentQr[1] }}%</span>

                    </div>
                    <div class="flex">
                      <span class="w-20">Passable</span>
                      <span v-if="statistique.toutCampagneJPassableQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableQr[0] }}</span>

                      <span v-if="statistique.toutCampagneJPassableQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableQr[1] }}%</span>

                    </div>
                    <div class="flex">
                      <span class="w-20">Médiocre</span>

                      <span v-if="statistique.toutCampagneJMediocreQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreQr[0] }}</span>

                      <span v-if="statistique.toutCampagneJMediocreQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreQr[1] }}%</span>

                    </div>
                  </div> -->
                  <div class="flex-none ml-auto relative">
                    <ReportDonutChart :chartData="dayStatAllQr" :width="90" :height="90" />
                    <div v-if="statistique.toutCampagneJExcellentQr"
                      class="font-medium absolute w-full h-full  text-green-700 flex items-center justify-center top-0 left-0">
                      {{ statistique.toutCampagneJExcellentQr[1] }}%

                    </div>
                    <span v-if="statistique.toutCampagneJExcellentQr"
                      class="p-0.5 tracking-[0.1em] flex items-center justify-center rounded-full bg-blue-700 text-white mr-1">
                      <span v-if="statistique.toutCampagneJExcellentQr"
                        class="p-0.5 tracking-[0.1em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentQr[0] }}
                      </span>

                      <span v-if="statistique.toutCampagneJPassableQr"
                        class="p-0.1 tracking-[.0.1em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableQr[0] }}</span>

                      <span v-if="statistique.toutCampagneJMediocreQr"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreQr[0] }}</span>
                    </span>


                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
            <div class="box p-5 zoom-in">
              <div class="flex  items-center">
                <div class="w-1/2 text-center flex-none">
                  <div class="text-lg font-medium ">STATS/J/ Tous campagnes</div>
                  <div class="text-slate-500">TABLETTE </div>
                </div>
                <div class="flex w-4/5 mx-auto justify-evenly">
                  <!-- <div class="flex flex-col space-y-1 ">
                    <div class="flex">
                      <span class="w-20">Excellent</span>
                      <span v-if="statistique.toutCampagneJExcellentTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentTablette[0] }}
                      </span>

                      <span v-if="statistique.toutCampagneJExcellentTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">

                        {{ statistique.toutCampagneJExcellentTablette[1] }}%
                      </span>

                    </div>
                    <div class="flex">
                      <span class="w-20">Passable</span>

                      <span v-if="statistique.toutCampagneJPassableTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableTablette[0] }}
                      </span>

                      <span v-if="statistique.toutCampagneJPassableTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableTablette[1] }}%
                      </span>

                    </div>
                    <div class="flex">
                      <span class="w-20">Médiocre</span>

                      <span v-if="statistique.toutCampagneJMediocreTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreTablette[0] }}
                      </span>

                      <span v-if="statistique.toutCampagneJMediocreTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreTablette[1] }} %
                      </span>

                    </div>
                  </div> -->
                  <div class="flex-none ml-auto relative">
                    <ReportDonutChart :chartData="dayStatAllTab" :width="90" :height="90" />
                    <div v-if="statistique.toutCampagneJExcellentTablette"
                      class="font-medium absolute w-full h-full text-green-700 flex items-center justify-center top-0 left-0">
                      {{ statistique.toutCampagneJExcellentTablette[1] }}%

                    </div>
                    <span v-if="statistique.toutCampagneJExcellentTablette"
                      class="p-0.5 tracking-[0.1em] flex items-center justify-center rounded-full bg-blue-700 text-white mr-1">
                      <span v-if="statistique.toutCampagneJExcellentTablette"
                        class="p-0.5 tracking-[0.1em] flex items-center justify-center rounded-full bg-green-500 text-white mr-1">
                        {{ statistique.toutCampagneJExcellentTablette[0] }}
                      </span>

                      <span v-if="statistique.toutCampagneJPassableTablette"
                        class="p-0.1 tracking-[.0.1em] flex items-center justify-center rounded-full bg-orange-300 text-white mr-1">
                        {{ statistique.toutCampagneJPassableTablette[0] }}</span>

                      <span v-if="statistique.toutCampagneJMediocreTablette"
                        class="p-0.5 tracking-[.01em] flex items-center justify-center rounded-full bg-danger text-white mr-1">
                        {{ statistique.toutCampagneJMediocreTablette[0] }}</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
            <div class="box p-5 zoom-in">
              <div class="flex">
                <div class="text-lg font-medium truncate mr-3">Trafics de notation</div>
                <div
                  class="bg-yellow-100 shadow-2xl py-1 px-2 flex items-center  rounded-full text-xs  dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">
                  180
                </div>
              </div>
              <div class="mt-1">
                <SimpleLineChart1 :height="58" class="-ml-1" />
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->


        <!-- section export pdf -->



        <!-- fin section export pdf -->


      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, provide, reactive, onMounted, onBeforeMount, computed, watch } from "vue";
import ReportLineChart from "@/components/report-line-chart/Main.vue";
import ReportDonutChart from "@/components/report-donut-chart/Main.vue";
import ReportPieChart from "@/components/report-pie-chart/Main.vue";
import ReportBarChart1 from "@/components/report-bar-chart-1/Main.vue";
import SimpleLineChart1 from "@/components/simple-line-chart-1/Main.vue";
import BsdService from "@/services/modules/bsd.service";
import CampagneService from "@/services/modules/campagne.service";
import XLSX from 'xlsx';
import { PUSHER_BASE_URL, PUSHER_APP_CLUSTER } from "@/services/configs/environment";
import { PUSHER_APP_KEY } from "@/services/configs/environment";
import Pusher from 'pusher-js';
import { helper as $h } from "@/utils/helper";


const defaultCampagneId = ref(Number)
const salesReportFilter = ref('');  // la variable pour la selection de 2 date
const isDisabled = ref(true)
const importantNotesRef = ref();
const statistique = ref({});
const campagnes = ref({});
const firstCampagnId = ref('')
const chartData = ref([])
const dayStatC = ref([])
const dayStatAllKit = ref([])
const dayStatAllQr = ref([])
const dayStatAllTab = ref([])
const toutCampagneJExcellentkitN = ref(0)
const toutCampagneJExcellentQrN = ref(0)
const toutCampagneJExcellentTabN = ref(0)
const dataExcel = reactive([])
const voirOptionExcel = ref(false) // voir option d'export excel
const closeExport = ref(false) // ferme le drowpdown export 

const toutCampagneJPasskitN = ref(0)
const toutCampagneJPassQrN = ref(0)
const toutCampagneJPassTabN = ref(0)

const toutCampagneJMedkitN = ref(0)
const toutCampagneJMedQrN = ref(0)
const toutCampagneJMedTabN = ref(0)


const showPicker = ref(false)
const selectedYear = ref()
const years = ref([])
const graphData = ref({})
const graphDataFac = ref({})
const resolutionEncour = ref(0)
const resolutionTerminer = ref(0)
const resolutionEnretard = ref(0)
const resolutionEncourNumber = ref(0)
const resolutionTerminerNumber = ref(0)
const resolutionEnretardNumber = ref(0)

const Qr = ref(0)
const Tablette = ref(0)
const kits = ref(0)
const jexcellent = ref(0)
const jpassable = ref(0)
const jmediocre = ref(0)

const jexcellentnumber = ref(0)
const jpassablenumber = ref(0)
const jmediocrenumber = ref(0)

const siteOfCampagnes = ref({})

const indicateurOfCampagnes = ref({})

const types = reactive([
  {
    nom: 'kit BSD',
    value: 1
  },
  {
    nom: 'Tablette',
    value: 2
  },
  {
    nom: 'Code Qr',
    value: 2
  }
])

//  filtrer les donner a afficher dans  le graphe




const selectedType = reactive({
  name: 'Type de BSD',
  id: null
})

const selectedIndicateur = reactive({
  name: 'Indicateur',
  id: null
})


const filtreSubmission = {
  siteId: null,
  annee: selectedYear.value,
  type: selectedType.id,
  indicateurId: selectedIndicateur.id,
  debut: null,
  fin: null

}
const selectedCampagne = reactive({
  name: 'Campagne',
  id: null
})
const selectedSite = reactive({
  name: 'Site',
  id: null
})
const showSelectSite = ref(false)
const messageForUser = ref(false)
const allStats = ref({})



onBeforeMount(function () {

  getCampagne();
  getstatGeneral();

  selectedYear.value = new Date().getFullYear()


})


onMounted(function () {

  if (!$h.getPermission('read.statistique')) {
    router.push('/error-page')
  }
  //getstatGeneral()
  const currentYear = new Date().getFullYear();

  //subscribe();

  for (let year = currentYear; year >= currentYear - 100; year--) {
    years.value.push(year);
  }


})



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
      markers: {
        size: 0,
      },



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

graphDataFac.value = {
  labels: [
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ],
  datasets: [

    {
      markers: {
        size: 0,
      },



      label: "Mediocre",
      data: [0, 200, 250, 200, 700],
      borderWidth: 3,
      borderColor: '#F39200',
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
    {
      label: "Passable",
      data: [0, 300, 400, 560, 320],
      borderWidth: 3,
      borderColor: '#BE1622',
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
    {
      label: "Excellent",
      data: [0, 100, 100, 100, 100],
      borderWidth: 3,
      borderColor: '#3AAA35',
      backgroundColor: "transparent",
      pointBorderColor: "transparent",
      tension: 0.4,
    },
  ],
}




chartData.value = [resolutionEncourNumber, resolutionEnretardNumber, resolutionTerminerNumber]
dayStatC.value = [jexcellentnumber, jpassablenumber, jmediocrenumber]
dayStatAllKit.value = [toutCampagneJExcellentkitN, toutCampagneJPasskitN, toutCampagneJMedkitN]
dayStatAllQr.value = [toutCampagneJExcellentQrN, toutCampagneJPassQrN, toutCampagneJMedQrN]
dayStatAllTab.value = [toutCampagneJExcellentTabN, toutCampagneJPassTabN, toutCampagneJMedTabN]


function exportToExcel(type) {
  if (type == "Indicateur") {
    var data = allStats.value[0].excelIndicateur
  }
  else if (type == "Campagne") {
    var data = allStats.value[0].excelCampagne
  }
  else {
    var data = allStats.value[0].excelSite
  }
  const worksheet = XLSX.utils.json_to_sheet(transformData(data, type));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Données");
  XLSX.writeFile(workbook, "donnees.xlsx");
}

function transformData(data, type) {
  const transformedData = data.map(item => {
    const transformedItem = {};
    transformedItem[type] = item[type];
    for (const month in item) {
      if (month !== type) {
        transformedItem[month] = `${item[month].Excellent}/${item[month].Mediocre}/${item[month].Passable}`;
      }
    }
    return transformedItem;
  });
  return transformedData;
}




function choixSite(data) {

  selectedSite.name = data.nom
  selectedSite.id = data.id

  filtreSubmission.indicateurId = selectedIndicateur.id
  filtreSubmission.siteId = selectedSite.id
  filtreSubmission.type = selectedType.id
  filtreSubmission.annee = selectedYear.value
  filtreSubmission.debut = selectedYear.value + '-01-01'
  filtreSubmission.fin = selectedYear.value + '-12-31'


  getCampagneStat(selectedCampagne.id, filtreSubmission)


}

function choixIndicateur(data) {

  selectedIndicateur.name = data.nom
  selectedIndicateur.id = data.id

  filtreSubmission.indicateurId = selectedIndicateur.id
  filtreSubmission.siteId = selectedSite.id
  filtreSubmission.type = selectedType.id
  filtreSubmission.annee = selectedYear.value
  filtreSubmission.debut = selectedYear.value + '-01-01'
  filtreSubmission.fin = selectedYear.value + '-12-31'



  getCampagneStat(selectedCampagne.id, filtreSubmission)

}

function choixtype(data) {
  selectedType.name = data.nom
  selectedType.id = data.value

  filtreSubmission.indicateurId = selectedIndicateur.id
  filtreSubmission.siteId = selectedSite.id
  filtreSubmission.type = selectedType.id
  filtreSubmission.annee = selectedYear.value
  filtreSubmission.debut = selectedYear.value + '-01-01'
  filtreSubmission.fin = selectedYear.value + '-12-31'


  getCampagneStat(selectedCampagne.id, filtreSubmission)


  // if (selectedSite.id == null) {

  //   filtreSubmission.siteId = campagnes.value[0].sites[0].id

  //   getCampagneStat(defaultCampagneId.value, filtreSubmission)

  // } else {
  //   filtreSubmission.siteId = selectedSite.id
  //   getCampagneStat(selectedCampagne.name, filtreSubmission)
  // }

}

function choixAnnee(data) {
  selectedYear.value = data

  filtreSubmission.indicateurId = selectedIndicateur.id
  filtreSubmission.siteId = selectedSite.id
  filtreSubmission.type = selectedType.id
  filtreSubmission.annee = selectedYear.value
  filtreSubmission.debut = selectedYear.value + '-01-01'
  filtreSubmission.fin = selectedYear.value + '-12-31'

  getCampagneStat(selectedCampagne.id, filtreSubmission)

}

function choixCampagne(campagne) {

  selectedCampagne.name = campagne.nom
  selectedCampagne.id = campagne.id

  //changement
  siteOfCampagnes.value = campagne.sites
  indicateurOfCampagnes.value = campagne.indicateurSelect

  filtreSubmission.indicateurId = selectedIndicateur.id
  filtreSubmission.siteId = selectedSite.id
  filtreSubmission.type = selectedType.id
  filtreSubmission.annee = selectedYear.value
  filtreSubmission.debut = selectedYear.value + '-01-01'
  filtreSubmission.fin = selectedYear.value + '-12-31'

  getCampagneStat(selectedCampagne.id, filtreSubmission)


}

// fonction pour convertir la date au format (YYYYMMDD)


function convert(value) {

  let date = new Date(Date.parse(value));
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let formattedDate = `${year}-${month}-${day}`;
  console.log();

  return formattedDate;

}

// filtre entre deux dates

function filterDate() {



  let parts = salesReportFilter.value.split('-');
  let debut = parts[0].trim();
  let fin = parts[1].trim();


  filtreSubmission.indicateurId = selectedIndicateur.id
  filtreSubmission.siteId = selectedSite.id
  filtreSubmission.type = selectedType.id
  filtreSubmission.annee = null
  filtreSubmission.debut = convert(debut)
  filtreSubmission.fin = convert(fin)

  if (selectedCampagne.id != null) {
    getCampagneStat(selectedCampagne.id, filtreSubmission)

  }


}

// fin filtre entre deux date

provide("bind[importantNotesRef]", (el) => {
  importantNotesRef.value = el;
});

const prevImportantNotes = () => {
  const el = importantNotesRef.value;
  el.tns.goTo("prev");
};

const nextImportantNotes = () => {
  const el = importantNotesRef.value;
  el.tns.goTo("next");
};

const subscribe = function () {
  var token = '';
  const getToken = JSON.parse(localStorage.getItem("bsdInfo"));
  if (getToken != undefined || getToken != null) {
    token = getToken.token
  }

  const usersInfo = JSON.parse(localStorage.getItem("bsdInfo"));
  var pusher = new Pusher(PUSHER_APP_KEY, {
    authEndpoint: PUSHER_BASE_URL + '/api/broadcasting/auth',
    cluster: PUSHER_APP_CLUSTER,
    encrypted: true,
    forceTLS: false,
    wsHost: PUSHER_BASE_URL,
    wsPort: 6001,
    wssPort: 6001,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    auth: {
      headers: {
        authorization: `Bearer ${token}`,
      }
    }
  });

  var channel = pusher.subscribe("private-statistique." + usersInfo.entrepriseId);

  channel.bind('statistique.posted', function (data) {
    statistique.value = data.data.data

    toutCampagneJExcellentkitN.value = statistique.value.toutCampagneJExcellentKit[0];
    toutCampagneJExcellentQrN.value = statistique.value.toutCampagneJExcellentQr[0];
    toutCampagneJExcellentTabN.value = statistique.value.toutCampagneJExcellentTablette[0];

    toutCampagneJPasskitN.value = statistique.value.toutCampagneJPassableKit[0];
    toutCampagneJPassQrN.value = statistique.value.toutCampagneJPassableQr[0];
    toutCampagneJPassTabN.value = statistique.value.toutCampagneJPassableTablette[0];

    toutCampagneJMedkitN.value = statistique.value.toutCampagneJMediocreKit[0];
    toutCampagneJMedQrN.value = statistique.value.toutCampagneJMediocreQr[0];
    toutCampagneJMedTabN.value = statistique.value.toutCampagneJMediocreTablette[0];

  });
}

const getstatGeneral = function () {
  BsdService.getStatistique().then((data) => {
    statistique.value = data.data.data

    toutCampagneJExcellentkitN.value = statistique.value.toutCampagneJExcellentKit[0];
    toutCampagneJExcellentQrN.value = statistique.value.toutCampagneJExcellentQr[0];
    toutCampagneJExcellentTabN.value = statistique.value.toutCampagneJExcellentTablette[0];

    toutCampagneJPasskitN.value = statistique.value.toutCampagneJPassableKit[0];
    toutCampagneJPassQrN.value = statistique.value.toutCampagneJPassableQr[0];
    toutCampagneJPassTabN.value = statistique.value.toutCampagneJPassableTablette[0];

    toutCampagneJMedkitN.value = statistique.value.toutCampagneJMediocreKit[0];
    toutCampagneJMedQrN.value = statistique.value.toutCampagneJMediocreQr[0];
    toutCampagneJMedTabN.value = statistique.value.toutCampagneJMediocreTablette[0];



  }).catch((e) => {
    // disabled()
    // alert(e)
  })
}

function getCampagneStat(id, formdata) {

  CampagneService.getCampagneStatistique(id, formdata).then((data) => {

    var response = data.data.data
    allStats.value = response
    graphData.value.datasets[0].data = allStats.value[0].mediocre
    graphData.value.datasets[1].data = allStats.value[0].passable
    graphData.value.datasets[2].data = allStats.value[0].excellent

    Qr.value = allStats.value[0].qr
    Tablette.value = allStats.value[0].tablette
    kits.value = allStats.value[0].kit


    resolutionEncour.value = allStats.value[0].enCours[1]
    resolutionEncourNumber.value = allStats.value[0].enCours[0]

    jexcellent.value = allStats.value[0].jexcellent[1]
    jexcellentnumber.value = allStats.value[0].jexcellent[0]


    resolutionTerminer.value = allStats.value[0].terminer[1]
    resolutionTerminerNumber.value = allStats.value[0].terminer[0]

    jpassable.value = allStats.value[0].jpassable[1]
    jpassablenumber.value = allStats.value[0].jpassable[0]


    resolutionEnretard.value = allStats.value[0].enRetard[1]
    resolutionEnretardNumber.value = allStats.value[0].enRetard[0]


    jmediocre.value = allStats.value[0].jmediocre[1]
    jmediocrenumber.value = allStats.value[0].jmediocre[0]


  }).catch((e) => {

    // alert(e)
  })


}

const getCampagne = function () {
  CampagneService.get().then((data) => {
    campagnes.value = data.data.data
    //charger premiere campagne comme par defaut et mettre son nom par defaut
    selectedCampagne.id = campagnes.value[0].id
    selectedCampagne.name = campagnes.value[0].nom
    // changes les selects qui correspond a la va leur par defaut 

    siteOfCampagnes.value = campagnes.value[0].sites
    indicateurOfCampagnes.value = campagnes.value[0].indicateurSelect

    getCampagneStat(selectedCampagne.id, {})

  })


}

// generer pdf

function generateReport() {
  // this.$refs.html2Pdf.generatePdf()
  console.log('ok')
};

</script>

<style scoped>
.tippy {
  font-size: 7px;
}

.excelent {
  background: #BE1622;
}

.mediocre {}

.min-card-height {
  min-height: 100px;
}
</style>
