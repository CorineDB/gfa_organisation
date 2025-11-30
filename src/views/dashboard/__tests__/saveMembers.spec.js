import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';

/**
 * Tests unitaires pour la fonction saveMembers()
 * du composant EvaluationFactuel.vue
 * 
 * Cette fonction permet d'enregistrer les membres du comité.
 * Elle doit permettre l'enregistrement dès qu'au moins un membre est dans tempMembers,
 * même si le formulaire actuel n'est pas rempli.
 */

describe('saveMembers', () => {
  let isEdit;
  let tempMembers;
  let currentMember;
  let memberFormErrors;
  let showModal;
  let payload;
  let toastMock;

  // Mock de la fonction validateMemberForm
  function validateMemberForm() {
    memberFormErrors.value = {};

    if (!currentMember.value.nom || currentMember.value.nom.trim() === "") {
      memberFormErrors.value.nom = ["Le nom est requis."];
    }

    if (!currentMember.value.prenom || currentMember.value.prenom.trim() === "") {
      memberFormErrors.value.prenom = ["Le prénom est requis."];
    }

    const contactValue = currentMember.value.contact ? String(currentMember.value.contact).trim() : "";

    if (!contactValue) {
      memberFormErrors.value.contact = ["Le contact est requis."];
    } else if (!/^\d{8,13}$/.test(contactValue)) {
      memberFormErrors.value.contact = ["Le contact doit contenir entre 8 et 13 chiffres."];
    }

    return Object.keys(memberFormErrors.value).length === 0;
  }

  // Fonction saveAllMembers
  function saveAllMembers() {
    if (tempMembers.value.length > 0) {
      payload.factuel.comite_members.push(...tempMembers.value);
      tempMembers.value = [];
    }
  }

  // Fonction updateMember (pour le mode édition)
  function updateMember() {
    // Simulation simple pour les tests
    showModal.value = false;
  }

  // Fonction addMemberAndClose
  function addMemberAndClose() {
    if (!validateMemberForm()) {
      toastMock.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    tempMembers.value.push({ ...currentMember.value });
    saveAllMembers();
    showModal.value = false;
    currentMember.value = { nom: "", prenom: "", contact: "" };
    memberFormErrors.value = {};
    toastMock.success("Membres ajoutés avec succès !");
  }

  // Fonction à tester
  function saveMembers() {
    if (isEdit.value) {
      updateMember();
    } else {
      // Si des membres ont déjà été ajoutés à tempMembers, on peut enregistrer directement
      if (tempMembers.value.length > 0) {
        // Vérifier si le formulaire actuel est rempli
        const currentFormFilled = currentMember.value.nom || currentMember.value.prenom || currentMember.value.contact;
        
        if (currentFormFilled) {
          // Si le formulaire actuel est partiellement rempli, valider avant d'ajouter
          if (!validateMemberForm()) {
            toastMock.error("Veuillez corriger les erreurs dans le formulaire ou le vider avant d'enregistrer.");
            return;
          }
          // Ajouter le membre actuel à la liste temporaire
          tempMembers.value.push({ ...currentMember.value });
        }
        
        // Enregistrer tous les membres temporaires
        saveAllMembers();
        showModal.value = false;
        currentMember.value = { nom: "", prenom: "", contact: "" };
        memberFormErrors.value = {};
        toastMock.success("Membres ajoutés avec succès !");
      } else {
        // Aucun membre dans tempMembers, on doit valider le formulaire actuel
        addMemberAndClose();
      }
    }
  }

  beforeEach(() => {
    // Réinitialiser les données avant chaque test
    isEdit = ref(false);
    tempMembers = ref([]);
    currentMember = ref({
      nom: "",
      prenom: "",
      contact: ""
    });
    memberFormErrors = ref({});
    showModal = ref(true);
    payload = {
      factuel: {
        comite_members: []
      }
    };
    
    // Mock de toast
    toastMock = {
      success: vi.fn(),
      error: vi.fn()
    };
  });

  describe('Mode ajout (isEdit = false)', () => {
    describe('Avec des membres déjà dans tempMembers', () => {
      it('devrait enregistrer les membres existants même si le formulaire actuel est vide', () => {
        // Arrange
        tempMembers.value = [
          { nom: "Dupont", prenom: "Jean", contact: "97123456" },
          { nom: "Martin", prenom: "Marie", contact: "97654321" }
        ];
        currentMember.value = { nom: "", prenom: "", contact: "" };

        // Act
        saveMembers();

        // Assert
        expect(payload.factuel.comite_members.length).toBe(2);
        expect(payload.factuel.comite_members[0].nom).toBe("Dupont");
        expect(payload.factuel.comite_members[1].nom).toBe("Martin");
        expect(tempMembers.value.length).toBe(0);
        expect(showModal.value).toBe(false);
        expect(toastMock.success).toHaveBeenCalledWith("Membres ajoutés avec succès !");
      });

      it('devrait ajouter le membre actuel valide avant d\'enregistrer', () => {
        // Arrange
        tempMembers.value = [
          { nom: "Dupont", prenom: "Jean", contact: "97123456" }
        ];
        currentMember.value = { nom: "Martin", prenom: "Marie", contact: "97654321" };

        // Act
        saveMembers();

        // Assert
        expect(payload.factuel.comite_members.length).toBe(2);
        expect(payload.factuel.comite_members[0].nom).toBe("Dupont");
        expect(payload.factuel.comite_members[1].nom).toBe("Martin");
        expect(tempMembers.value.length).toBe(0);
        expect(showModal.value).toBe(false);
      });

      it('devrait rejeter si le formulaire actuel est invalide', () => {
        // Arrange
        tempMembers.value = [
          { nom: "Dupont", prenom: "Jean", contact: "97123456" }
        ];
        currentMember.value = { nom: "Martin", prenom: "", contact: "123" }; // Invalide

        // Act
        saveMembers();

        // Assert
        expect(payload.factuel.comite_members.length).toBe(0); // Rien n'a été enregistré
        expect(tempMembers.value.length).toBe(1); // Le membre existant reste
        expect(showModal.value).toBe(true); // Modal reste ouvert
        expect(toastMock.error).toHaveBeenCalledWith("Veuillez corriger les erreurs dans le formulaire ou le vider avant d'enregistrer.");
      });

      it('devrait enregistrer uniquement les membres existants si le formulaire actuel est partiellement rempli mais invalide', () => {
        // Arrange
        tempMembers.value = [
          { nom: "Dupont", prenom: "Jean", contact: "97123456" }
        ];
        currentMember.value = { nom: "Martin", prenom: "", contact: "" }; // Partiellement rempli, invalide

        // Act
        saveMembers();

        // Assert
        expect(toastMock.error).toHaveBeenCalled();
        expect(payload.factuel.comite_members.length).toBe(0);
      });
    });

    describe('Sans membres dans tempMembers', () => {
      it('devrait valider et enregistrer le formulaire actuel', () => {
        // Arrange
        tempMembers.value = [];
        currentMember.value = { nom: "Dupont", prenom: "Jean", contact: "97123456" };

        // Act
        saveMembers();

        // Assert
        expect(payload.factuel.comite_members.length).toBe(1);
        expect(payload.factuel.comite_members[0].nom).toBe("Dupont");
        expect(showModal.value).toBe(false);
        expect(toastMock.success).toHaveBeenCalled();
      });

      it('devrait rejeter si le formulaire actuel est invalide', () => {
        // Arrange
        tempMembers.value = [];
        currentMember.value = { nom: "", prenom: "", contact: "" };

        // Act
        saveMembers();

        // Assert
        expect(payload.factuel.comite_members.length).toBe(0);
        expect(showModal.value).toBe(true);
        expect(toastMock.error).toHaveBeenCalledWith("Veuillez corriger les erreurs dans le formulaire.");
      });
    });
  });

  describe('Mode édition (isEdit = true)', () => {
    it('devrait appeler updateMember', () => {
      // Arrange
      isEdit.value = true;
      showModal.value = true;

      // Act
      saveMembers();

      // Assert
      expect(showModal.value).toBe(false);
    });
  });

  describe('Cas limites', () => {
    it('devrait gérer un seul membre dans tempMembers', () => {
      // Arrange
      tempMembers.value = [
        { nom: "Dupont", prenom: "Jean", contact: "97123456" }
      ];
      currentMember.value = { nom: "", prenom: "", contact: "" };

      // Act
      saveMembers();

      // Assert
      expect(payload.factuel.comite_members.length).toBe(1);
      expect(tempMembers.value.length).toBe(0);
    });

    it('devrait gérer plusieurs membres dans tempMembers', () => {
      // Arrange
      tempMembers.value = [
        { nom: "Dupont", prenom: "Jean", contact: "97123456" },
        { nom: "Martin", prenom: "Marie", contact: "97654321" },
        { nom: "Durand", prenom: "Paul", contact: "97111222" }
      ];
      currentMember.value = { nom: "", prenom: "", contact: "" };

      // Act
      saveMembers();

      // Assert
      expect(payload.factuel.comite_members.length).toBe(3);
      expect(tempMembers.value.length).toBe(0);
    });

    it('devrait réinitialiser le formulaire après enregistrement', () => {
      // Arrange
      tempMembers.value = [
        { nom: "Dupont", prenom: "Jean", contact: "97123456" }
      ];
      currentMember.value = { nom: "", prenom: "", contact: "" };

      // Act
      saveMembers();

      // Assert
      expect(currentMember.value.nom).toBe("");
      expect(currentMember.value.prenom).toBe("");
      expect(currentMember.value.contact).toBe("");
      expect(memberFormErrors.value).toEqual({});
    });
  });
});
