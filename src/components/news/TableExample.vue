<template>
  <div class="container p-4 mx-auto">
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="px-4 py-2 border">Principes</th>
          <th class="px-4 py-2 border">Critères</th>
          <th class="px-4 py-2 border">Indicateurs</th>
          <th class="px-4 py-2 border">Réponses</th>
          <th class="px-4 py-2 border">Note</th>
          <th class="px-4 py-2 border">Source de validation</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(gouvernance, gIndex) in datas" :key="gIndex">
          <template v-for="(principe, pIndex) in gouvernance.principes_de_gouvernance" :key="pIndex">
            <tr>
              <td :rowspan="getTotalIndicateurs(gouvernance.principes_de_gouvernance)">{{ gouvernance.principes_de_gouvernance[0].nom }}</td>
              <td :rowspan="gouvernance.principes_de_gouvernance[0].criteres_de_gouvernance[0].indicateurs_de_gouvernance.length">{{ gouvernance.principes_de_gouvernance[0].criteres_de_gouvernance[0].nom }}</td>
              <td>{{ gouvernance.principes_de_gouvernance[0].criteres_de_gouvernance[0].indicateurs_de_gouvernance[0].nom }}</td>
              <td>{{ gouvernance.principes_de_gouvernance[0].criteres_de_gouvernance[0].indicateurs_de_gouvernance[0].note ?? "" }}</td>
              <td>{{ gouvernance.principes_de_gouvernance[0].criteres_de_gouvernance[0].indicateurs_de_gouvernance[0].note ?? "" }}</td>
              <td>{{ gouvernance.principes_de_gouvernance[0].criteres_de_gouvernance[0].indicateurs_de_gouvernance[0].source ?? "" }}</td>
            </tr>

            <template v-for="(critere, cIndex) in removeFirstElement(principe.criteres_de_gouvernance)" :key="cIndex">
              <tr>
                <td :rowspan="critere.indicateurs_de_gouvernance.length">{{ critere.indicateurs_de_gouvernance[0].nom }}</td>
                <td>{{ critere.indicateurs_de_gouvernance[0].note }}</td>
                <td>{{ critere.indicateurs_de_gouvernance[0].note }}</td>
                <td>{{ critere.indicateurs_de_gouvernance[0].source }}</td>
              </tr>

              <tr v-for="(indicateur, iIndex) in removeFirstElement(critere.indicateurs_de_gouvernance)" :key="iIndex">
                <td>{{ indicateur.nom }}</td>
                <td>{{ indicateur.note }}</td>
                <td>{{ indicateur.note }}</td>
                <td>{{ indicateur.source }}</td>
              </tr>
            </template>
          </template>
        </template>
        <!-- <tr v-for="(principe, pIndex) in gouvernance.principes_de_gouvernance" :key="principe.id">
            <td class="px-4 py-2 border" :rowspan="calculateRowSpan(principe.criteres_de_gouvernance)">
              {{ principe.nom }}
            </td>

            <template v-for="(critere, cIndex) in principe.criteres_de_gouvernance" :key="critere.id">
              <td v-if="cIndex === 0" :rowspan="critere.indicateurs_de_gouvernance.length" class="px-4 py-2 border">
                {{ critere.nom }}
              </td>

              <template v-for="(indicateur, iIndex) in critere.indicateurs_de_gouvernance" :key="indicateur.id">
                <tr v-if="iIndex > 0">
                  <td class="px-4 py-2 border">{{ critere.nom }}</td>
                </tr>
                <td class="px-4 py-2 border">{{ indicateur.nom }}</td>
                <td class="px-4 py-2 border">{{ indicateur.can_have_multiple_reponse ? "Oui" : "Non" }}</td>
                <td class="px-4 py-2 border">{{ indicateur.note }}</td>
                <td class="px-4 py-2 border">Nom de la source</td>
              </template>
            </template>
          </tr> -->
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datas: [
        {
          id: "KJX3Od8nrE8lA0MQGK5jRvLwD43Yq6BbMy12gz7NkZXOVJnameobpWd9Rm6L419Y",
          nom: "Gouvernance 2",
          principes_de_gouvernance: [
            {
              id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
              nom: "Principes 1",
              criteres_de_gouvernance: [
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 1",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 2",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
              ],
            },
            {
              id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
              nom: "Principes 2",
              criteres_de_gouvernance: [
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 1",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 2",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "KJX3Od8nrE8lA0MQGK5jRvLwD43Yq6BbMy12gz7NkZXOVJnameobpWd9Rm6L419Y",
          nom: "Gouvernance 2",
          principes_de_gouvernance: [
            {
              id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
              nom: "Principes 1",
              criteres_de_gouvernance: [
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 1",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 2",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                // Critères suivants...
              ],
            },
            {
              id: "V0zMBvj6BY0m6lDbQ1dvLo54pZX9wPKo1x8ANnzE7eVGkMyOJqa2RjrgQDp5R4wq",
              nom: "Principes 2",
              criteres_de_gouvernance: [
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 1",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                {
                  id: "6w3x9VMdYlbqvG1nxmMN4zrD7PkZeW5d9QoVjKaEyd623JAp0w9gBL8XaXgoBKY2",
                  nom: "Critere 2",
                  indicateurs_de_gouvernance: [
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "xOkENaVZDkMb97L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Rôles et responsabilité clairement",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                    {
                      id: "rhuinkkn27jn7L30gE2BQ8jwYd6OnP9d8lqNGXpxza4AyZmoeR51VKrvpBj27DG",
                      nom: "Responsabilté",
                      can_have_multiple_reponse: false,
                      note: 0.3,
                    },
                  ],
                },
                // Critères suivants...
              ],
            },
            // Principes suivants...
          ],
        },
      ],
    };
  },
  methods: {
    getTotalCriteres(criteres) {
      return criteres.reduce((acc, critere) => acc + critere.indicateurs_de_gouvernance.length, 0);
    },

    getTotalIndicateurs(principes_de_gouvernance) {
      return principes_de_gouvernance.reduce((total, principe) => {
        return (
          total +
          principe.criteres_de_gouvernance.reduce((critereTotal, critere) => {
            return critereTotal + critere.indicateurs_de_gouvernance.length;
          }, 0)
        );
      }, 0);
    },

    removeFirstElement(array) {
      return array.slice(1);
    },
  },
};
</script>

<style scoped>
table td {
  border: 1px solid rgb(109, 109, 109);
}
</style>
