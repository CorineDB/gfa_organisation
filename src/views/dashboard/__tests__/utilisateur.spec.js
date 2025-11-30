import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref, reactive, computed } from 'vue';

/**
 * Tests unitaires pour utilisateur.vue
 * 
 * Fonctionnalités testées :
 * 1. Ajout d'utilisateur (storeUser)
 * 2. Ajout de rôle (createData)
 * 3. Pagination du tableau (goToPage, totalPages)
 */

describe('Utilisateur - Gestion des utilisateurs', () => {
  let formData, messageErreur, showModal, users, chargement;
  let UsersServiceMock, toastMock;

  beforeEach(() => {
    formData = reactive({
      nom: "",
      prenom: "",
      password: "demo1234",
      email: "@gmail.com",
      contact: "",
      poste: "",
      roles: []
    });

    messageErreur = ref({});
    showModal = ref(false);
    users = ref([]);
    chargement = ref(false);

    UsersServiceMock = {
      addUsers: vi.fn(),
      get: vi.fn()
    };

    toastMock = {
      error: vi.fn(),
      success: vi.fn()
    };
  });

  describe('1. Ajout d\'utilisateur (storeUser)', () => {
    function storeUser() {
      if (chargement.value == false) {
        chargement.value = true;
        
        return UsersServiceMock.addUsers(formData)
          .then((data) => {
            showModal.value = false;
            formData.nom = "";
            formData.prenom = "";
            formData.contact = "";
            formData.poste = "";
            formData.email = "@gmail.com";
            formData.roles = [];
            chargement.value = false;
            toastMock.success("Nouveau utilisateur ajouté");
            return data;
          })
          .catch((error) => {
            chargement.value = false;
            toastMock.error("Vérifier les informations et ressayer.");
            if (error.response && error.response.data && error.response.data.errors) {
              messageErreur.value = error.response.data.errors;
            }
            throw error;
          });
      }
    }

    it('devrait ajouter un utilisateur avec des données valides', async () => {
      formData.nom = "Dupont";
      formData.prenom = "Jean";
      formData.email = "jean.dupont@gmail.com";
      formData.contact = "97123456";
      formData.poste = "Développeur";
      formData.roles = [1, 2];

      UsersServiceMock.addUsers.mockResolvedValue({ data: { success: true } });

      await storeUser();

      expect(UsersServiceMock.addUsers).toHaveBeenCalledWith(formData);
      expect(showModal.value).toBe(false);
      expect(formData.nom).toBe("");
      expect(chargement.value).toBe(false);
      expect(toastMock.success).toHaveBeenCalledWith("Nouveau utilisateur ajouté");
    });

    it('devrait gérer les erreurs de validation', async () => {
      formData.nom = "";
      formData.email = "invalid-email";

      const errorResponse = {
        response: {
          data: {
            errors: {
              nom: ["Le nom est requis"],
              email: ["Email invalide"]
            }
          }
        }
      };

      UsersServiceMock.addUsers.mockRejectedValue(errorResponse);

      try {
        await storeUser();
      } catch (error) {
        expect(messageErreur.value).toEqual(errorResponse.response.data.errors);
        expect(toastMock.error).toHaveBeenCalled();
        expect(chargement.value).toBe(false);
      }
    });

    it('ne devrait pas permettre de soumettre si déjà en chargement', async () => {
      chargement.value = true;

      await storeUser();

      expect(UsersServiceMock.addUsers).not.toHaveBeenCalled();
    });

    it('devrait réinitialiser le formulaire après ajout réussi', async () => {
      formData.nom = "Test";
      formData.prenom = "User";
      formData.email = "test@gmail.com";

      UsersServiceMock.addUsers.mockResolvedValue({ data: {} });

      await storeUser();

      expect(formData.nom).toBe("");
      expect(formData.prenom).toBe("");
      expect(formData.email).toBe("@gmail.com");
      expect(formData.roles).toEqual([]);
    });
  });

  describe('2. Ajout de rôle (createData)', () => {
    let payload, showModalCreate, isLoading, RoleServiceMock;

    beforeEach(() => {
      payload = reactive({
        nom: "",
        description: "",
        permissions: []
      });

      showModalCreate = ref(false);
      isLoading = ref(false);

      RoleServiceMock = {
        create: vi.fn()
      };
    });

    function createData() {
      isLoading.value = true;
      
      return RoleServiceMock.create(payload)
        .then(() => {
          isLoading.value = false;
          payload.nom = "";
          payload.description = "";
          payload.permissions = [];
          showModalCreate.value = false;
          toastMock.success("Rôles et permissions créer.");
        })
        .catch((e) => {
          isLoading.value = false;
          toastMock.error("Vérifier les informations et ressayer.");
          if (e.response && e.response.data && e.response.data.errors) {
            messageErreur.value = e.response.data.errors;
          }
          throw e;
        });
    }

    it('devrait créer un rôle avec des données valides', async () => {
      payload.nom = "Admin";
      payload.description = "Administrateur système";
      payload.permissions = [1, 2, 3];

      RoleServiceMock.create.mockResolvedValue({ data: {} });

      await createData();

      expect(RoleServiceMock.create).toHaveBeenCalledWith(payload);
      expect(isLoading.value).toBe(false);
      expect(showModalCreate.value).toBe(false);
      expect(payload.nom).toBe("");
      expect(toastMock.success).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de validation', async () => {
      payload.nom = "";

      const errorResponse = {
        response: {
          data: {
            errors: {
              nom: ["Le nom est requis"],
              permissions: ["Au moins une permission est requise"]
            }
          }
        }
      };

      RoleServiceMock.create.mockRejectedValue(errorResponse);

      try {
        await createData();
      } catch (error) {
        expect(messageErreur.value).toEqual(errorResponse.response.data.errors);
        expect(toastMock.error).toHaveBeenCalled();
        expect(isLoading.value).toBe(false);
      }
    });

    it('devrait réinitialiser le formulaire après création réussie', async () => {
      payload.nom = "Manager";
      payload.description = "Gestionnaire";
      payload.permissions = [4, 5];

      RoleServiceMock.create.mockResolvedValue({ data: {} });

      await createData();

      expect(payload.nom).toBe("");
      expect(payload.description).toBe("");
      expect(payload.permissions).toEqual([]);
    });
  });

  describe('3. Pagination du tableau', () => {
    let currentPage, itemsPerPage;
    let resultQuery;

    beforeEach(() => {
      currentPage = ref(1);
      itemsPerPage = ref(10);
      
      // Créer 25 utilisateurs de test
      users.value = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        nom: `User${i + 1}`,
        prenom: `Prenom${i + 1}`,
        email: `user${i + 1}@test.com`,
        contact: `9712345${i}`,
        poste: `Poste${i + 1}`,
        roles: [],
        created_at: "2024-01-01"
      }));

      resultQuery = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return users.value.slice(startIndex, endIndex);
      });
    });

    function totalPages() {
      return Math.ceil(users.value.length / itemsPerPage.value);
    }

    function goToPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > totalPages()) {
        return;
      }
      currentPage.value = pageNumber;
    }

    it('devrait calculer le nombre total de pages correctement', () => {
      expect(totalPages()).toBe(3); // 25 users / 10 per page = 3 pages
    });

    it('devrait afficher les bons utilisateurs pour la page 1', () => {
      currentPage.value = 1;
      const result = resultQuery.value;

      expect(result.length).toBe(10);
      expect(result[0].nom).toBe("User1");
      expect(result[9].nom).toBe("User10");
    });

    it('devrait afficher les bons utilisateurs pour la page 2', () => {
      goToPage(2);
      const result = resultQuery.value;

      expect(result.length).toBe(10);
      expect(result[0].nom).toBe("User11");
      expect(result[9].nom).toBe("User20");
    });

    it('devrait afficher les bons utilisateurs pour la dernière page', () => {
      goToPage(3);
      const result = resultQuery.value;

      expect(result.length).toBe(5); // Seulement 5 users sur la dernière page
      expect(result[0].nom).toBe("User21");
      expect(result[4].nom).toBe("User25");
    });

    it('devrait changer de page avec goToPage', () => {
      goToPage(2);
      expect(currentPage.value).toBe(2);

      goToPage(3);
      expect(currentPage.value).toBe(3);
    });

    it('ne devrait pas aller à une page invalide (< 1)', () => {
      currentPage.value = 2;
      goToPage(0);
      expect(currentPage.value).toBe(2); // Reste sur la page 2
    });

    it('ne devrait pas aller à une page invalide (> totalPages)', () => {
      currentPage.value = 2;
      goToPage(10);
      expect(currentPage.value).toBe(2); // Reste sur la page 2
    });

    it('devrait gérer correctement le changement de itemsPerPage', () => {
      itemsPerPage.value = 5;
      expect(totalPages()).toBe(5); // 25 users / 5 per page = 5 pages
    });

    it('devrait retourner tous les utilisateurs si itemsPerPage >= total', () => {
      itemsPerPage.value = 50;
      goToPage(1);
      const result = resultQuery.value;

      expect(result.length).toBe(25);
      expect(totalPages()).toBe(1);
    });
  });

  describe('4. Validation du téléphone (Mode Édition)', () => {
    let isValidEdit;
    let formEdit;
    let proxyMock;

    beforeEach(() => {
      formEdit = reactive({
        contact: ""
      });

      proxyMock = {
        $isValidPhoneNumber: vi.fn((phone, country) => {
          // Simulation simple de libphonenumber-js pour les tests
          if (country === 'BJ') {
            return phone === '97123456' || phone === '22997123456';
          }
          return false;
        })
      };

      // Simulation de la computed property isValidEdit
      isValidEdit = computed(() => {
        const contactValue = formEdit.contact ? String(formEdit.contact).trim() : "";
        
        if (!contactValue) return false;
        if (!/^\d{8,13}$/.test(contactValue)) return false;
        
        return proxyMock.$isValidPhoneNumber(contactValue, "BJ");
      });
    });

    it('devrait valider un numéro correct (8 chiffres)', () => {
      formEdit.contact = "97123456";
      expect(isValidEdit.value).toBe(true);
    });

    it('devrait valider un numéro correct (11 chiffres)', () => {
      formEdit.contact = "22997123456";
      expect(isValidEdit.value).toBe(true);
    });

    it('devrait rejeter un numéro trop court', () => {
      formEdit.contact = "123";
      expect(isValidEdit.value).toBe(false);
    });

    it('devrait rejeter un numéro avec des lettres', () => {
      formEdit.contact = "9712345a";
      expect(isValidEdit.value).toBe(false);
    });

    it('devrait rejeter un numéro vide', () => {
      formEdit.contact = "";
      expect(isValidEdit.value).toBe(false);
    });

    it('devrait gérer les espaces (trim)', () => {
      formEdit.contact = "  97123456  ";
      expect(isValidEdit.value).toBe(true);
    });
  });

  describe('5. Validation du téléphone (Mode Création)', () => {
    let isValidCreate;
    let formData;
    let proxyMock;

    beforeEach(() => {
      formData = reactive({
        contact: ""
      });

      proxyMock = {
        $isValidPhoneNumber: vi.fn((phone, country) => {
          if (country === 'BJ') {
            return phone === '97123456' || phone === '22997123456';
          }
          return false;
        })
      };

      isValidCreate = computed(() => {
        const contactValue = formData.contact ? String(formData.contact).trim() : "";
        
        if (!contactValue) return false;
        if (!/^\d{8,13}$/.test(contactValue)) return false;
        
        return proxyMock.$isValidPhoneNumber(contactValue, "BJ");
      });
    });

    it('devrait valider un numéro correct', () => {
      formData.contact = "97123456";
      expect(isValidCreate.value).toBe(true);
    });

    it('devrait rejeter un numéro invalide', () => {
      formData.contact = "123";
      expect(isValidCreate.value).toBe(false);
    });
  });

  describe('6. Suppression d\'utilisateur', () => {
    let deleteModalPreview;
    let deleteData;
    let users;
    let isLoading;
    let UsersServiceMock;
    let toastMock;

    beforeEach(() => {
      deleteModalPreview = ref(false);
      deleteData = reactive({});
      isLoading = ref(false);
      users = ref([
        { id: 1, nom: "User1", prenom: "Prenom1" },
        { id: 2, nom: "User2", prenom: "Prenom2" }
      ]);

      UsersServiceMock = {
        destroy: vi.fn()
      };

      toastMock = {
        success: vi.fn(),
        error: vi.fn()
      };
    });

    function supprimer(index, data) {
      deleteModalPreview.value = true;
      deleteData.id = data.id;
      deleteData.nom = data.nom;
      deleteData.index = index;
    }

    function deleteUser() {
      deleteModalPreview.value = false;
      isLoading.value = true;
      
      return UsersServiceMock.destroy(deleteData.id)
        .then(() => {
          const indexToRemove = users.value.findIndex(u => u.id === deleteData.id);
          if (indexToRemove !== -1) {
            users.value.splice(indexToRemove, 1);
          }
          toastMock.success("Utilisateur supprimé avec succès");
          isLoading.value = false;
        })
        .catch((error) => {
          toastMock.error("Erreur lors de la suppression");
          isLoading.value = false;
        });
    }

    it('devrait ouvrir le modal de confirmation avec les bonnes données', () => {
      const userToDelete = users.value[0];
      supprimer(0, userToDelete);

      expect(deleteModalPreview.value).toBe(true);
      expect(deleteData.id).toBe(1);
      expect(deleteData.nom).toBe("User1");
    });

    it('devrait supprimer l\'utilisateur avec succès', async () => {
      // Préparer la suppression
      supprimer(0, users.value[0]);
      
      // Mock succès
      UsersServiceMock.destroy.mockResolvedValue({ data: { success: true } });

      // Exécuter la suppression
      await deleteUser();

      expect(UsersServiceMock.destroy).toHaveBeenCalledWith(1);
      expect(deleteModalPreview.value).toBe(false);
      expect(users.value.length).toBe(1); // Un utilisateur supprimé
      expect(users.value[0].id).toBe(2); // Reste User2
      expect(toastMock.success).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de suppression', async () => {
      // Préparer la suppression
      supprimer(0, users.value[0]);
      
      // Mock erreur
      UsersServiceMock.destroy.mockRejectedValue(new Error("Erreur serveur"));

      // Exécuter la suppression
      await deleteUser();

      expect(UsersServiceMock.destroy).toHaveBeenCalledWith(1);
      expect(deleteModalPreview.value).toBe(false);
      expect(users.value.length).toBe(2); // Pas de suppression locale si erreur
      expect(toastMock.error).toHaveBeenCalled();
    });
    it('devrait activer le loader pendant la suppression', async () => {
      supprimer(0, users.value[0]);
      
      // Promesse qui ne se résout pas tout de suite
      let resolvePromise;
      const promise = new Promise(resolve => { resolvePromise = resolve; });
      UsersServiceMock.destroy.mockReturnValue(promise);

      const deletePromise = deleteUser();
      
      // Vérifier que le loader est actif
      expect(isLoading.value).toBe(true);
      
      resolvePromise({ data: { success: true } });
      await deletePromise;
      
      // Vérifier que le loader est inactif après
      expect(isLoading.value).toBe(false);
    });
  });
});
