<template>
  <!-- BEGIN: Boxed Tab -->
  <PreviewComponent class="intro-y _box mt-5">
    <Preview>
      <TabGroup>
        <TabList class="nav-boxed-tabs uppercase font-bold space-x-4">
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>
        <TabPanels class="mt-5">

          <TabPanel class="leading-relaxed">

            <!-- Figure 3 : Grille de notation des indicateurs de la gouvernance politique -->
            <table class="w-full table-auto border-collapse mb-12" cellpadding="0" cellspacing="0">
              <thead class="bg-blue-900 text-left">
                <tr class="">
                  <th class="p-2 my-2 bg-yellow-300" _colspan="5">Indice factuel de Gouvernance politique (IFGP)</th>
                  <th class="p-2 bg-yellow-300 text-center">0.59</th>
                </tr>
                <!-- <tr class=" bg-slate-200 border-t-8 border-white">
                  <th class="p-2 my-2" _colspan="5">Score Factuel Redevabilité</th>
                  <th class="p-2 text-center">0.59</th>
                </tr> -->
              </thead>

              <tbody class=" bg-white">
                <tr class=" bg-slate-200 border-t-8 border-white font-bold">
                  <td class="p-2">Score Factuel Redevabilité</td>
                  <td class="p-2 text-center">0.59</td>
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Rôles et responsabilité clairement définis</td>
                  <!-- <td class="p-2 text-center">10</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1 ">Organes statutaires fonctionnels</td>
                  <!-- <td class="p-2 text-center">15</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Existence de statuts et règlement intérieur</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Rédaction et validation des rapports d’activités</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>

                <!-- row 2 -->
                <tr class=" bg-slate-200 border-t-8 border-white font-bold">
                  <td class="p-2">Score Factuel Transparence</td>
                  <td class="p-2 text-center">0.59</td>
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Informations accessibles</td>
                  <!-- <td class="p-2 text-center">10</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1 ">Rapports publiés</td>
                  <!-- <td class="p-2 text-center">15</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Procédures de prise de décision formalisées</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>
                <tr class="border-l-2">
                  <td class="px-4 py-1">Procédures de prise de décision respectées</td>
                  <!-- <td class="p-2 text-center">6</td> -->
                </tr>
              </tbody>
            </table>

            <div class="w-full bg-blue-900 text-white text-center p-4 font-bold rounded">
              FICHE SYNTHESE SCORE FACTUEL GOUVERNANCE
            </div>

            <table class="border-collapse table-fixed w-full text-sm mt-12">
              <tbody>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Structure :</td>
                  <td>Lorem ipsum dolor sit amet.</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Date d’auto-évaluation :</td>
                  <td>Lorem ipsum dolor sit.</td>
                </tr>
              </tbody>
            </table>

            <table class="border-collapse table-auto w-full text-sm mt-12">
              <thead class="bg-green-200 text-left">
                <th class="pl-2">Principe</th>
                <th>Indice Factuel</th>
              </thead>
              <tbody>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Redevabilité</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Transparence</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Participation</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Egalité et non-discrimination / inclusion</td>
                  <td>0.56</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="font-medium p-2">Efficacité et efficience</td>
                  <td>0.56</td>
                </tr>
              </tbody>
            </table>

            <table class="w-full table-auto border-collapse mt-12" border="0" cellpadding="0" cellspacing="0">
              <thead class="bg-blue-900 text-left">
                <tr>
                  <th scope="col" class="p-2 text-white">Principes</th>
                  <th scope="col" class="p-2 text-white">Critères</th>
                  <th scope="col" class="w-full p-2 text-white">Indicateurs</th>
                  <th scope="col" class="p-2 text-white whitespace-nowrap">Réponse <br>(Oui / Non)</th>
                  <th scope="col" class="p-2 text-white">Note</th>
                  <th scope="col" class="p-2 text-white whitespace-nowrap">Sources de vérification</th>
                </tr>
                <tr class="bg-white border-t-8 border-white">
                  <th class="p-2 my-2 bg-yellow-300 text-center" colspan="5">INDICE FACTUEL DE GOUVERNANCE</th>
                  <th class="p-2 bg-yellow-300 text-center">0.59</th>
                </tr>
                <tr class="bg-white border-t-8 border-white">
                  <th class="p-2 my-2 bg-yellow-300" colspan="5">Gouvernance politique</th>
                  <th class="p-2 bg-yellow-300 text-center">0.59</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="p-2 font-bold bg-yellow-500" rowspan="5">Redevabilité</td>
                  <td class="p-2 bg-yellow-500" rowspan="4">Légitimité/légalité</td>
                  <td class="p-2 bg-green-600">Rôles et responsabilité clairement définis</td>
                  <td class="p-2 bg-green-600 text-center">1</td>
                  <td class="p-2 bg-green-600">10</td>
                </tr>
                <tr class="bg-red-600 text-white">
                  <td class="p-2 ">Organes statutaires fonctionnels</td>
                  <td class="p-2 text-center">2</td>
                  <td class="p-2">15</td>
                </tr>
                <tr class="bg-yellow-500">
                  <td class="p-2">Existence de statuts et règlement intérieur</td>
                  <td class="p-2 text-center">3</td>
                  <td class="p-2">6</td>
                </tr>
                <tr class="bg-green-500">
                  <td class="p-2">Rédaction et validation des rapports d’activités</td>
                  <td class="p-2 text-center">3</td>
                  <td class="p-2">6</td>
                </tr>
                <tr class=" bg-yellow-500 font-bold">
                  <td colspan="2" class="px-2"></td>
                  <td class="px-2 text-xs whitespace-nowrap">Score Factuel</td>
                  <td class="px-2">0.43</td>
                </tr>
                <!-- row 2 -->


              </tbody>
            </table>

          </TabPanel>
          <!-- tab 2 -->
          <TabPanel class="leading-relaxed">

            <!-- Figure 8 : grille de notation et de détermination de la moyenne pondérée des questions opérationnelles -->
            <table class="w-full table-auto border-collapse mb-12" cellpadding="0" cellspacing="0">
              <thead class="bg-blue-900 text-left">
                <tr class="">
                  <th class="p-2 my-2 bg-blue-900 text-center text-white" colspan="12">Pondérations</th>
                </tr>
                <tr class="bg-blue-900 text-white border-t-2 border-white">
                  <th class="p-2 my-2 text-center" rowspan="2">Questions opérationnelles</th>
                  <th class="p-2 my-2 text-center" colspan="2">Pas du tout</th>
                  <th class="p-2 my-2 text-center" colspan="2">Faiblement</th>
                  <th class="p-2 my-2 text-center" colspan="2">Moyennement</th>
                  <th class="p-2 my-2 text-center" colspan="2">Dans une grande mesure</th>
                  <th class="p-2 my-2 text-center" colspan="2">Totalement</th>
                  <th class="p-2 my-2 text-center" rowspan="2">Moyenne pondérée</th>
                </tr>
                <tr class="bg-blue-900 text-white border-t border-white">
                  <th class="p-2 text-center">Note(a)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (a')</th>
                  <th class="p-2 text-center">Note(b)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (b')</th>
                  <th class="p-2 text-center">Note(c)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (c')</th>
                  <th class="p-2 text-center">Note(d)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (d')</th>
                  <th class="p-2 text-center">Note(e)</th>
                  <th class="p-2 my-2" _colspan="5">Nbre de reponses (e')</th>
                </tr>
                <tr class="bg-red-600 text-white border-t border-white">
                  <th class="p-2 text-center" colspan="11">Moyenne pondérée</th>
                  <th class="p-2 text-center">0.76</th>
                </tr>
              </thead>

              <tbody class=" bg-white">
                <tr class=" bg-blue-200 border-t-8 border-white font-bold">
                  <td class="px-2 " colspan="12">Redevabilité</td>
                </tr>
                <tr class="border-l-2 border-b pb-2">
                  <td class="px-4 py-1">Rôles et responsabilité clairement définis</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                </tr>

                <!-- row 2 -->
                <tr class="border-l-2 border-b">
                  <td class="px-4 py-1">Les différentes instances de prise de décision de l’organisation jouent pleinement
                    leur rôle</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                </tr>
                <!-- row 3 -->
                <tr class="border-l-2">
                  <td class="px-4 py-1">Les différentes instances de prise de décision de l’organisation jouent pleinement
                    leur rôle</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                  <td class="p-2 text-center border-l">10</td>
                </tr>

              </tbody>
            </table>

            <h2 class="text-lg font-medium mr-5 py-4">Indice de Gouvernace</h2>

            <table class="w-full table-auto border-collapse mb-12" cellpadding="0" cellspacing="0">
              <thead class="bg-blue-900 text-left">
                <tr class="bg-slate-600 text-white border-t border-white">
                  <th class="p-2 text-left" _colspan="11">Principes</th>
                  <th class="p-2 text-center">Indice de Perception</th>
                  <th class="p-2 text-center">Indice Synthétique</th>
                </tr>
              </thead>

              <tbody class=" bg-white">
                <tr class=" bg-blue-900 text-white border-t-8 border-white font-bold">
                  <td class="px-2 " colspan="12">Gouvernance politique</td>
                </tr>
                <tr class="border-l-2 border-b pb-2">
                  <td class="px-4 py-1 bg-sky-500 font-medium">Redevabilité</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="border-l-2 border-b pb-2">
                  <td class="px-4 py-1 bg-sky-500 font-medium">Transparence</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="border-l-2 border-b pb-2">
                  <td class="px-4 py-1 bg-sky-500 font-medium">Participation</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>

                <tr class="border-l-2 border-b pb-2">
                  <td class="px-4 py-1 bg-sky-500 font-medium">Egalité et non-discrimination / inclusion</td>
                  <td class="p-2 text-center">0.8</td>
                  <td class="p-2 text-center">0.15</td>
                </tr>
              </tbody>
            </table>



          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Preview>

  </PreviewComponent>
  <!-- END: Boxed Tab -->
</template>

<script setup>

</script>