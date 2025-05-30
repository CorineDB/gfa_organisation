<script setup>
import { onMounted, ref } from "vue";
import SyntheseService from "@/services/modules/synthese.service";
import { toast } from "vue3-toastify";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import { getColorForValue } from "../../utils/findColorIndicator";
import { useRoute, useRouter } from "vue-router";
import ExportationSyntheseFactuel from "../../components/news/ExportationSyntheseFactuel.vue";
import TabulatorMarqueurFactuel from "../../components/news/TabulatorMarqueurFactuel.vue";
import { computed } from "vue";
import ExportationMarqueurPerception from "../../components/news/ExportationMarqueurPerception.vue";
import TabulatorMarqueurPerception from "../../components/news/TabulatorMarqueurPerception.vue";
import DownloadPDFButton from "../../components/DownloadPDFButton.vue";

const router = useRouter();
const route = useRoute();
// Il faudra faire les get des organisationId et enqueteDeCollecteId depuis l'url avec router
const idEvaluation = route.params.e;
const organizationId = ref("");
const idSelectStructure = ref("");
const dataForAllOrganisation = ref([]);
const datasFactuel = ref([]);
const datasPerception = ref([]);
const isLoadingData = ref(false);
const authUser = ref("");
const currentFactuel = ref("");
const currentPerception = ref("");
const currentProfileGouvernance = ref("");

const getDataCollection = async () => {
  isLoadingData.value = true;
  await SyntheseService.getForEvaluation(idEvaluation)
    .then((result) => {
      currentProfileGouvernance.value = result.data.data.profile_de_gouvernance;
      currentFactuel.value = result.data.data.factuel;
      currentPerception.value = result.data.data.perception;
      isLoadingData.value = false; /* 
      dataForAllOrganisation.value = result.data.data;
      datasFactuel.value = dataForAllOrganisation.value.analyse_factuel;
      datasPerception.value = dataForAllOrganisation.value.analyse_perception; */
    })
    .catch((e) => {
      isLoadingData.value = false;
      console.error(e);
      toast.error("Une erreur est survenue: Resultats des synthese .");
    });
};

const organisationsOfEvaluation = computed(() =>
  dataForAllOrganisation.value.map((org) => ({
    id: org.id,
    nom: org.nom,
    nom_point_focal: org.nom_point_focal,
    prenom_point_focal: org.prenom_point_focal,
  }))
);

const currentOrganisation = computed(() => dataForAllOrganisation.value.find((org) => org.id == idSelectStructure.value));

/* const currentFactuel = computed(() => currentOrganisation.value?.factuel);
const currentPerception = computed(() => currentOrganisation.value?.perception);
const currentProfileGouvernance = computed(() => currentOrganisation.value?.profile_de_gouvernance); */

const changeStructure = () => {
  organizationId.value = idSelectStructure.value;
};

onMounted(async () => {
  authUser.value = JSON.parse(localStorage.getItem("authenticateUser"));
  await getDataCollection();
  //idSelectStructure.value = dataForAllOrganisation.value[0].id; */

  /* currentProfileGouvernance.value = [
    {
      "id": 34,
      "nom": "Efficacité et efficience",
      "indice_factuel": 0,
      "indice_de_perception": 0.2,
      "indice_synthetique": 0.2
    },
    {
      "id": 33,
      "nom": "Participation",
      "indice_factuel": 0,
      "indice_de_perception": 0.125,
      "indice_synthetique": 0.125
    },
    {
      "id": 32,
      "nom": "Transparence",
      "indice_factuel": 0,
      "indice_de_perception": 0.15,
      "indice_synthetique": 0.15
    }
  ];

  currentFactuel.value = {
    "id": "4rm0N6R9anBAY0qQPxbWk1gN6zE4vwMJPlpdL5Ky3Ge9DOjo7Zrm8RXJvL71ykgE",
    "type": "factuel",
    "indice_de_gouvernance": 0,
    "options_de_reponse": [
      {
        "id": "gm03MOVWNRp2mq0dW4XYywb5G7vAkxlLqEeaVOrMg1j83ZQ9Pn6LKJoDd9JjZrkG",
        "libelle": "Oui",
        "slug": "oui",
        "point": 0.15
      },
      {
        "id": "7WY5me2VdWywZNej85XMp3LkGg04mazjeBVq9xvQ6R7brDKoAYnOJ2P1bJLdNADk",
        "libelle": "Non",
        "slug": "non",
        "point": 0.25
      }
    ],
    "resultats": [
      {
        "id": 34,
        "nom": "Efficacité et efficience",
        "indice_factuel": 0
      },
      {
        "id": 33,
        "nom": "Participation",
        "indice_factuel": 0
      },
      {
        "id": 32,
        "nom": "Transparence",
        "indice_factuel": 0
      }
    ],
    "synthese": [
      {
        "id": "xpdy4rvap5KaAv0zkNLDRyJMGEm2oZgndVxOn3Y17bPWwrl846BXjedQe7AZoNQ5",
        "nom": "Gouvernance politique",
        "indice_factuel": 0,
        "categories_de_gouvernance": [
          {
            "id": "zX3POkN5MJpYaOG3wvN5jdnxk8K4Wl98P9Qe2LPz0bo6Ay7BZEr1RDXmrJ4aZLj6",
            "nom": "Efficacité et efficience",
            "score_factuel": 0,
            "categories_de_gouvernance": [
              {
                "id": "noxGpN3476b834KZz5rDOPo0AL1nm2gPYqyxWakpdNJvejlwEMYBXGQRwRrYJe0W",
                "nom": "Genre",
                "questions_de_gouvernance": [
                  {
                    "id": "nKXoYN1zN9zX86QoMRAGwY4anW5e7qDQ8mbk30rV2JyPBldvEgZxK1jpQRvVdx8g",
                    "nom": "L’information est accessible à tous au sein de l’organisation",
                    "type": "indicateur",
                    "moyenne_ponderee": [],
                    "options_de_reponse": [],
                    "reponse": {
                      "id": 20,
                      "nom": "Oui",
                      "type": "indicateur",
                      "point": 0.15,
                      "sourceDeVerification": "Rapport de reunion"
                    }
                  }
                ]
              }
            ]
          },
          {
            "id": "ba3zPdBKL4x8PomDW50YbajvArZJR29R7glKNQ3kOB1enp7dy6wXEzMGp67JoED0",
            "nom": "Participation",
            "score_factuel": 0,
            "categories_de_gouvernance": [
              {
                "id": "2KN7rjYPxYE4m16PrQBj0aKweWoJOXgNKqz72dlDNyZGRpkvbnM853LA0J8OaQlo",
                "nom": "Représentativité",
                "questions_de_gouvernance": [
                  {
                    "id": "9oXK5Z234y86kAgdzpPnRQoYeEW90xm3omBwM3Vlq57jJ2XZbarG1vNKV6qQyJ7B",
                    "nom": "Les procédures de passation de marché de l’organisation sont transparentes, connues de tous et encouragent la compétitivité",
                    "type": "indicateur",
                    "moyenne_ponderee": [],
                    "options_de_reponse": [],
                    "reponse": {
                      "id": 21,
                      "nom": "Oui",
                      "type": "indicateur",
                      "point": 0.15,
                      "sourceDeVerification": "Rapport de reunion"
                    }
                  }
                ]
              }
            ]
          },
          {
            "id": "6wNoYx7BrY38NvokWe0QOKEzlAd76yVkQgDpLRMXxBJwaGZm15j2bPn4M5yp0kzR",
            "nom": "Transparence",
            "score_factuel": 0,
            "categories_de_gouvernance": [
              {
                "id": "pmerELOQNL0G5dy1oDMPjemWAXkl6zqeNVKZ3aOBRrJ2nv7E8Yx4bpwQMlkPAK51",
                "nom": "Représentativité",
                "questions_de_gouvernance": [
                  {
                    "id": "R3bypNAV0K2eWXkA5EblN3Zx84adnROPBmV7Yrgq1jyozwQMP69GJBvp0zZJlwje",
                    "nom": "Les instances de prise de décision rende régulièrement compte",
                    "type": "indicateur",
                    "moyenne_ponderee": [],
                    "options_de_reponse": [],
                    "reponse": {
                      "id": 22,
                      "nom": "Oui",
                      "type": "indicateur",
                      "point": 0.15,
                      "sourceDeVerification": "Rapport de reunion"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "mvMxGJj0pw0835kPMn4W1GQzdREea6gwj97yNYjoJ2BXLvOxAlZbrDKmQaker3Ny",
        "nom": "Gouvernance managériale et administrative",
        "indice_factuel": 0,
        "categories_de_gouvernance": [
          {
            "id": "4rzJDZ0XlmM14GkjwndxbP3aZ7Ly6W9Awqr0e2v8DJRNYEAXKQzoOBp5LxbKYwWy",
            "nom": "Transparence",
            "score_factuel": 0,
            "categories_de_gouvernance": [
              {
                "id": "zyL6vmer7BkOAb43jNz81eEJ2ZlMWKg1egXxYdr6nGp5DawPy0LRQmvo5ldnD2JK",
                "nom": "Représentativité",
                "questions_de_gouvernance": [
                  {
                    "id": "JgxZ0ad8aK3Qp5nAXJG2lZ6NbdrjzkDNpL4M0oVg9EB1y7vPYxWw8qeRrYjRXGK5",
                    "nom": "Les services aux bénéficiaires sont conformes aux normes de qualité",
                    "type": "indicateur",
                    "moyenne_ponderee": [],
                    "options_de_reponse": [],
                    "reponse": {
                      "id": 23,
                      "nom": "Oui",
                      "type": "indicateur",
                      "point": 0.15,
                      "sourceDeVerification": "Rapport de reunion"
                    }
                  }
                ]
              }
            ]
          },
          {
            "id": "jzoZAmLJ2ZGlOKXxQkWPBry7nzaMdoVZ1qAJ8eLNbm4R105EDv6j3pwYNyQ2X8MK",
            "nom": "Participation",
            "score_factuel": 0,
            "categories_de_gouvernance": [
              {
                "id": "dxKM43mO7DRmZGW0eO5Lop6EzByXN89rOgPM4Kn1v2ajrlkbAYw3QxdJn5NbWGrv",
                "nom": "Représentativité",
                "questions_de_gouvernance": [
                  {
                    "id": "M7pKZXBA7j1Zy9rNE0gwdlpRn82Qk6Lg7LJqKPebYBaozXVMW3v4xA5GqoVyngkE",
                    "nom": "Les bénéficiaires connaissent la mission et les objectifs de l’organisation",
                    "type": "indicateur",
                    "moyenne_ponderee": [],
                    "options_de_reponse": [],
                    "reponse": {
                      "id": 24,
                      "nom": "Non",
                      "type": "indicateur",
                      "point": 0.25,
                      "sourceDeVerification": "Rapport de reunion"
                    }
                  }
                ]
              }
            ]
          },
          {
            "id": "R3DyZXLWR2Qj0rZWma34YkedE8bJyKqGM9zovMxp5AGLwB16PlND7nXOaKNwn8v0",
            "nom": "Efficacité et efficience",
            "score_factuel": 0,
            "categories_de_gouvernance": [
              {
                "id": "4d5MbQzW5rmelxBJP2ROzvb1QGYpLA90L936DZnX0odkEywK8NWa4M7jPGw0Kpjm",
                "nom": "Représentativité",
                "questions_de_gouvernance": [
                  {
                    "id": "7EVXnjYz5l1P0nryAvBdq9N4aWzwJMLbZLj8R2kXpQoY6gVb7ZExeGK3gaZ4501B",
                    "nom": "Les différentes instances de prise de décision de l’organisation jouent pleinement leur rôle",
                    "type": "indicateur",
                    "moyenne_ponderee": [],
                    "options_de_reponse": [],
                    "reponse": {
                      "id": 25,
                      "nom": "Non",
                      "type": "indicateur",
                      "point": 0.25,
                      "sourceDeVerification": "Rapport de reunion"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "evaluatedAt": "2024-11-12",
    "formulaireDeGouvernanceId": "pw59WAeVkvL5qZYnNJ2PzExbQd04OpmBrmKwolWy9RA3B618jarGgDeVbOanoBlE",
    "organisationId": "x0JMGN9oKr5lJkoBYbP0axOEmzVp8yQ5X3djD16XMgvL4n2wAGNeR9ZW14vV8KWE",
    "evaluationDeGouvernanceId": "WmdbEOP3Vw8mazrolOYnJkpGWQ9EdjDp9x4geB6b2PZ5LyRAvX013KNMRGLXBnl0",
    "programmeId": "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
    "created_at": "2024-11-11"
  };

  currentPerception.value = {
    "id": "5mwQ4pe1xLEv7rPmenGXZ50jpqKgo32LYMWa1BY6Dw4Rzy8QOb9dJkNAqNRWxyZX",
    "type": "perception",
    "indice_de_gouvernance": 0.16,
    "options_de_reponse": [
      {
        "id": "XrygdPKDKJVYOD5dL12joWw9rpMZQ4BpVly7xANR3qPave6XgG0b8knmGbAqo9Ym",
        "libelle": "Ne peux répondre",
        "slug": "ne-peux-repondre",
        "point": 0.1
      },
      {
        "id": "OkaNV4eKkbdZyY8O2w71xRMvgm05DVB3alnLr3NK49XqAe6GajJWpQoPqJZv9o7w",
        "libelle": "Pas du tout",
        "slug": "pas-du-tout",
        "point": 0.15
      },
      {
        "id": "0g6PdvN82Zrv08Gak5N1PKDA9wVOoYzkZByQ67Jnj3MdgXWpxe4RmqbLJWynD3xR",
        "libelle": "Faiblement",
        "slug": "faiblement",
        "point": 0.2
      },
      {
        "id": "gXGP92yKkq8pnX6wO0x73QZWm2ejLYzRDEv5aDVPo9MNRJdAgy4Gbr1KmdA3wr1V",
        "libelle": "Moyennement",
        "slug": "moyennement",
        "point": 0.25
      }
    ],
    "synthese": [
      {
        "id": "O27DEMPLR0kD7KJLBQ1W26Mowbmpl4qB7VOXvzPZrenjA8Exd3Gy5aNYByG35bxl",
        "nom": "Efficacité et efficience",
        "indice_de_perception": 0.2,
        "questions_de_gouvernance": [
          {
            "id": "yM1aQ3GzeqBp3lxjrd2XW5oQG1PAy9DlrLEnkJNY7ZVzR6baMv04wK8gkgeRZKPB",
            "nom": "L’information est accessible à tous au sein de l’organisation",
            "type": "question_operationnelle",
            "moyenne_ponderee": 0.2,
            "options_de_reponse": [
              {
                "id": "XrygdPKDKJVYOD5dL12joWw9rpMZQ4BpVly7xANR3qPave6XgG0b8knmGbAqo9Ym",
                "nom": "Ne peux répondre",
                "point": 0.1,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "OkaNV4eKkbdZyY8O2w71xRMvgm05DVB3alnLr3NK49XqAe6GajJWpQoPqJZv9o7w",
                "nom": "Pas du tout",
                "point": 0.15,
                "moyenne_ponderee_i": 0.3,
                "reponses_count": 2
              },
              {
                "id": "0g6PdvN82Zrv08Gak5N1PKDA9wVOoYzkZByQ67Jnj3MdgXWpxe4RmqbLJWynD3xR",
                "nom": "Faiblement",
                "point": 0.2,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "gXGP92yKkq8pnX6wO0x73QZWm2ejLYzRDEv5aDVPo9MNRJdAgy4Gbr1KmdA3wr1V",
                "nom": "Moyennement",
                "point": 0.25,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              }
            ],
            "reponse": []
          },

          {
            "id": "yM1aQ3GzeqBp3lxjrd2XW5oQG1PAy9DlrLEnkJNY7ZVzO6baMv04wK8gkgeRZKPB",
            "nom": "L’information est accessible à tous au sein de l’organisation",
            "type": "question_operationnelle",
            "moyenne_ponderee": 0.2,
            "options_de_reponse": [
              {
                "id": "XrygdPKDKJVYOD5dL12joWw9rpMZQ4BpVly7xANR3qPave6XgG0b8knmGbAqo9Ym",
                "nom": "Ne peux répondre",
                "point": 0.1,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "OkaNV4eKkbdZyY8O2w71xRMvgm05DVB3alnLr3NK49XqAe6GajJWpQoPqJZv9o7w",
                "nom": "Pas du tout",
                "point": 0.15,
                "moyenne_ponderee_i": 0.3,
                "reponses_count": 2
              },
              {
                "id": "0g6PdvN82Zrv08Gak5N1PKDA9wVOoYzkZByQ67Jnj3MdgXWpxe4RmqbLJWynD3xR",
                "nom": "Faiblement",
                "point": 0.2,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "gXGP92yKkq8pnX6wO0x73QZWm2ejLYzRDEv5aDVPo9MNRJdAgy4Gbr1KmdA3wr1V",
                "nom": "Moyennement",
                "point": 0.25,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              }
            ],
            "reponse": []
          }
        ]
      },
      {
        "id": "dLBJk4p2ev5ya1r4bwLM8Nko6O7xBAgDo9JEjpGWDmPznY0RZQK3l2dXZ0mYw638",
        "nom": "Participation",
        "indice_de_perception": 0.125,
        "questions_de_gouvernance": [
          {
            "id": "wY35PpqkR1BpGog6Y3xkdjM9b0wE4zm2gDQnyWaXZrqP7v52Vl8NKJeAJzeMAavN",
            "nom": "Les procédures de passation de marché de l’organisation sont transparentes, connues de tous et encouragent la compétitivité",
            "type": "question_operationnelle",
            "moyenne_ponderee": 0.125,
            "options_de_reponse": [
              {
                "id": "XrygdPKDKJVYOD5dL12joWw9rpMZQ4BpVly7xANR3qPave6XgG0b8knmGbAqo9Ym",
                "nom": "Ne peux répondre",
                "point": 0.1,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "OkaNV4eKkbdZyY8O2w71xRMvgm05DVB3alnLr3NK49XqAe6GajJWpQoPqJZv9o7w",
                "nom": "Pas du tout",
                "point": 0.15,
                "moyenne_ponderee_i": 0.3,
                "reponses_count": 2
              },
              {
                "id": "0g6PdvN82Zrv08Gak5N1PKDA9wVOoYzkZByQ67Jnj3MdgXWpxe4RmqbLJWynD3xR",
                "nom": "Faiblement",
                "point": 0.2,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "gXGP92yKkq8pnX6wO0x73QZWm2ejLYzRDEv5aDVPo9MNRJdAgy4Gbr1KmdA3wr1V",
                "nom": "Moyennement",
                "point": 0.25,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              }
            ],
            "reponse": []
          }
        ]
      },
      {
        "id": "lajn6v7556vY3jLP74dBxRzDmw0KrA9jdqaG2QEpZNX8oJnlykWeb1OMweJykRXW",
        "nom": "Transparence",
        "indice_de_perception": 0.15,
        "questions_de_gouvernance": [
          {
            "id": "9Pyg8qQAqpA4kBZrdRxJ23MYaVNb8eOkym7zjP9vQ1oElWXg0y56KnGwGEN20MR3",
            "nom": "Les instances de prise de décision rende régulièrement compte",
            "type": "question_operationnelle",
            "moyenne_ponderee": 0.15,
            "options_de_reponse": [
              {
                "id": "XrygdPKDKJVYOD5dL12joWw9rpMZQ4BpVly7xANR3qPave6XgG0b8knmGbAqo9Ym",
                "nom": "Ne peux répondre",
                "point": 0.1,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "OkaNV4eKkbdZyY8O2w71xRMvgm05DVB3alnLr3NK49XqAe6GajJWpQoPqJZv9o7w",
                "nom": "Pas du tout",
                "point": 0.15,
                "moyenne_ponderee_i": 0.3,
                "reponses_count": 2
              },
              {
                "id": "0g6PdvN82Zrv08Gak5N1PKDA9wVOoYzkZByQ67Jnj3MdgXWpxe4RmqbLJWynD3xR",
                "nom": "Faiblement",
                "point": 0.2,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              },
              {
                "id": "gXGP92yKkq8pnX6wO0x73QZWm2ejLYzRDEv5aDVPo9MNRJdAgy4Gbr1KmdA3wr1V",
                "nom": "Moyennement",
                "point": 0.25,
                "moyenne_ponderee_i": 0,
                "reponses_count": 0
              }
            ],
            "reponse": []
          }
        ]
      }
    ],
    "evaluatedAt": "2024-11-12",
    "formulaireDeGouvernanceId": "P0zE5rWo1PQ6zAepLDd2NBlOn5GgEWmOPMrKYwv948kjbVRoZa0qxJy38qk3D6Rn",
    "organisationId": "x0JMGN9oKr5lJkoBYbP0axOEmzVp8yQ5X3djD16XMgvL4n2wAGNeR9ZW14vV8KWE",
    "evaluationDeGouvernanceId": "WmdbEOP3Vw8mazrolOYnJkpGWQ9EdjDp9x4geB6b2PZ5LyRAvX013KNMRGLXBnl0",
    "programmeId": "Kd6Zov9ybW9PRxngKpQv81oeXMr6YOJgmV5ZlG47dkq2zjwABDLma3y0DGj3BP7w",
    "created_at": "2024-11-11"
  }; */
});
</script>

<template>
  <div class="flex justify-between my-4 items-center">
    <h2 class="text-lg font-medium intro-y">Marqueur de gouvernance</h2>
    <button class="btn btn-primary" @click="router.go(-1)">Retour <CornerDownLeftIcon class="w-4 h-4 ml-2" /></button>
  </div>
  <PreviewComponent class="mt-5 intro-y _box">
    <Preview>
      <TabGroup>
        <TabList class="space-x-4 font-bold uppercase nav-boxed-tabs">
          <Tab class="w-full py-2 bg-white" tag="button">Profil de gouvernance</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil Factuel</Tab>
          <Tab class="w-full py-2 bg-white" tag="button">Outil de Perception</Tab>
        </TabList>

        <TabPanels v-show="!isLoadingData" class="mt-5">
          <!-- Synthétique -->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">RÉSULTATS SYNTHÉTIQUE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationResultatSynthese v-if="!isLoadingData && currentProfileGouvernance" :org="authUser?.nom" :pointfocal="`${authUser?.profil?.nom_point_focal}  ${authUser?.profil?.prenom_point_focal}`" :dateevaluation="currentFactuel?.evaluatedAt" :datas="currentProfileGouvernance" />
                <DownloadPDFButton :tableIds="['table2AZA', 'tableKJIT']" pageName="RÉSULTATS SYNTHÉTIQUE" format="a4" />
              </div>
            </div>
            <table id="table2AZA" class="w-full my-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    {{ authUser?.nom }}
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ authUser?.profil?.nom_point_focal }} {{ authUser?.profil?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2"></td>
                </tr>
              </tbody>
            </table>
            <table id="tableKJIT" class="w-full mb-12 border-collapse table-auto" cellpadding="4" cellspacing="0">
              <thead class="text-left bg-blue-900">
                <tr class="text-slate-800 bg-slate-300">
                  <th class="py-2 text-left border border-slate-900">Principes</th>
                  <th class="py-2 text-center border border-slate-900">Indice factuel</th>
                  <th class="py-2 text-center border border-slate-900">Indice de Perception</th>
                  <th class="py-2 text-center border border-slate-900">Indice Synthétique</th>
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-for="(synthese, index) in currentProfileGouvernance" :key="index" class="pb-2 border border-slate-900">
                  <td class="py-1 font-">{{ synthese.nom }}</td>
                  <td class="py-1 text-right" :style="{ 'background-color': getColorForValue(synthese.indice_factuel) }">{{ synthese.indice_factuel }}</td>
                  <td class="py-1 text-right" :style="{ 'background-color': getColorForValue(synthese.indice_de_perception) }">{{ synthese.indice_de_perception }}</td>
                  <td class="py-1 text-right" :style="{ 'background-color': getColorForValue(synthese.indice_synthetique) }">{{ synthese.indice_synthetique }}</td>
                </tr>
              </tbody>
            </table>
            <!-- <ChartScroreByPrincipe />
            <ChartOptionResponseByCategorieAndMember />
            <ChartProgressionByTime />
            <ChartScorePerceptionByPrincipe /> -->
          </TabPanel>
          <!-- Factuel -->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">MARQUEUR FACTUEL GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <DownloadPDFButton :tableIds="['table2AZA98', 'tableKJITNB']" pageName="MARQUEUR FACTUEL GOUVERNANCE" format="a4" />
                <!-- <ExportationSyntheseFactuel v-if="!isLoadingData" :datas="currentFactuel" /> -->
              </div>
            </div>

            <table id="table2AZA98" class="w-full my-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    {{ authUser?.nom }}
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ authUser?.profil?.nom_point_focal }} {{ authUser?.profil?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2">{{ currentFactuel?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <!-- Tableau de marqueur Factuel -->
            <TabulatorMarqueurFactuel v-if="!isLoadingData" :data="currentFactuel?.synthese" :indicegouvernace="currentFactuel?.indice_de_gouvernance" />
          </TabPanel>
          <!-- Perception-->
          <TabPanel class="leading-relaxed">
            <div class="w-full py-2 font-bold text-center text-white rounded bg-primary">MARQUEUR PERCEPTION GOUVERNANCE</div>
            <div class="flex justify-end my-4 sm:flex-row sm:items-end xl:items-start">
              <div class="flex mt-5 sm:mt-0">
                <ExportationMarqueurPerception v-if="!isLoadingData && currentPerception" :org="authUser?.nom" :pointfocal="`${authUser?.profil?.nom_point_focal}  ${authUser?.profil?.prenom_point_focal}`" :dateevaluation="currentPerception?.evaluatedAt" :datas="currentPerception" />
                <DownloadPDFButton :tableIds="['tableA98R', 'tableKNOB']" pageName="MARQUEUR PERCEPTION GOUVERNANCE" format="a4" />
              </div>
            </div>

            <table id="tableA98R" class="w-full my-12 text-sm border-collapse table-fixed">
              <tbody>
                <tr class="border-b rounded-sm border-slate-300 bg-slate-300">
                  <td class="p-2 font-medium">Structure :</td>
                  <td>
                    {{ authUser?.nom }}
                  </td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Nom, Prénom et qualité du point focal Gouvernance :</td>
                  <td>{{ authUser?.profil?.nom_point_focal }} {{ authUser?.profil?.prenom_point_focal }}</td>
                </tr>
                <tr class="border-b border-slate-300">
                  <td class="p-2 font-medium">Date d’auto-évaluation :</td>
                  <td class="pl-2">{{ currentPerception?.evaluatedAt }}</td>
                </tr>
              </tbody>
            </table>
            <!-- Tableau de synthese Perception -->
            <TabulatorMarqueurPerception :data="currentPerception?.synthese" :indicegouvernace="currentPerception?.indice_de_gouvernance" v-if="!isLoadingData" />
          </TabPanel>
        </TabPanels>
        <LoaderSnipper v-if="isLoadingData" />
      </TabGroup>
    </Preview>
  </PreviewComponent>
</template>

<style scoped>
table td {
  border: 1px solid rgb(0, 0, 0);
}
</style>
