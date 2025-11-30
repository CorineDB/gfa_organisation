import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';

/**
 * Tests unitaires pour la fonction validateMemberForm()
 * du composant EvaluationFactuel.vue
 * 
 * Cette fonction valide les données d'un membre du comité avant son ajout.
 * Elle vérifie que :
 * - Le nom est requis et non vide
 * - Le prénom est requis et non vide
 * - Le contact est requis et contient entre 8 et 13 chiffres
 */

describe('validateMemberForm', () => {
  let currentMember;
  let memberFormErrors;

  // Fonction à tester (extraite de EvaluationFactuel.vue)
  function validateMemberForm() {
    memberFormErrors.value = {};

    if (!currentMember.value.nom || currentMember.value.nom.trim() === "") {
      memberFormErrors.value.nom = ["Le nom est requis."];
    }

    if (!currentMember.value.prenom || currentMember.value.prenom.trim() === "") {
      memberFormErrors.value.prenom = ["Le prénom est requis."];
    }

    // Ensure contact is treated as a string for validation
    const contactValue = currentMember.value.contact ? String(currentMember.value.contact).trim() : "";

    if (!contactValue) {
      memberFormErrors.value.contact = ["Le contact est requis."];
    } else if (!/^\d{8,13}$/.test(contactValue)) {
      memberFormErrors.value.contact = ["Le contact doit contenir entre 8 et 13 chiffres."];
    }

    return Object.keys(memberFormErrors.value).length === 0;
  }

  beforeEach(() => {
    // Réinitialiser les données avant chaque test
    currentMember = ref({
      nom: "",
      prenom: "",
      contact: ""
    });
    memberFormErrors = ref({});
  });

  describe('Validation du nom', () => {
    it('devrait retourner false si le nom est vide', () => {
      currentMember.value = {
        nom: "",
        prenom: "Jean",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.nom).toEqual(["Le nom est requis."]);
    });

    it('devrait retourner false si le nom contient uniquement des espaces', () => {
      currentMember.value = {
        nom: "   ",
        prenom: "Jean",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.nom).toEqual(["Le nom est requis."]);
    });

    it('devrait retourner false si le nom est null', () => {
      currentMember.value = {
        nom: null,
        prenom: "Jean",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.nom).toEqual(["Le nom est requis."]);
    });

    it('devrait retourner false si le nom est undefined', () => {
      currentMember.value = {
        nom: undefined,
        prenom: "Jean",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.nom).toEqual(["Le nom est requis."]);
    });
  });

  describe('Validation du prénom', () => {
    it('devrait retourner false si le prénom est vide', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.prenom).toEqual(["Le prénom est requis."]);
    });

    it('devrait retourner false si le prénom contient uniquement des espaces', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "   ",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.prenom).toEqual(["Le prénom est requis."]);
    });

    it('devrait retourner false si le prénom est null', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: null,
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.prenom).toEqual(["Le prénom est requis."]);
    });
  });

  describe('Validation du contact', () => {
    it('devrait retourner false si le contact est vide', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: ""
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact est requis."]);
    });

    it('devrait retourner false si le contact est null', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: null
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact est requis."]);
    });

    it('devrait retourner false si le contact contient moins de 8 chiffres', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "1234567"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact doit contenir entre 8 et 13 chiffres."]);
    });

    it('devrait retourner false si le contact contient plus de 13 chiffres', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "12345678901234"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact doit contenir entre 8 et 13 chiffres."]);
    });

    it('devrait retourner false si le contact contient des lettres', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "12345abc"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact doit contenir entre 8 et 13 chiffres."]);
    });

    it('devrait retourner false si le contact contient des caractères spéciaux', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "1234-5678"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact doit contenir entre 8 et 13 chiffres."]);
    });

    it('devrait retourner true si le contact contient exactement 8 chiffres', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
      expect(Object.keys(memberFormErrors.value).length).toBe(0);
    });

    it('devrait retourner true si le contact contient exactement 13 chiffres', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "1234567890123"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
      expect(Object.keys(memberFormErrors.value).length).toBe(0);
    });

    it('devrait retourner true si le contact contient 10 chiffres (cas normal)', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "0123456789"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
      expect(Object.keys(memberFormErrors.value).length).toBe(0);
    });
  });

  describe('Validation complète du formulaire', () => {
    it('devrait retourner true si tous les champs sont valides', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "0123456789"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
      expect(Object.keys(memberFormErrors.value).length).toBe(0);
    });

    it('devrait retourner false et collecter toutes les erreurs si tous les champs sont invalides', () => {
      currentMember.value = {
        nom: "",
        prenom: "",
        contact: ""
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.nom).toEqual(["Le nom est requis."]);
      expect(memberFormErrors.value.prenom).toEqual(["Le prénom est requis."]);
      expect(memberFormErrors.value.contact).toEqual(["Le contact est requis."]);
      expect(Object.keys(memberFormErrors.value).length).toBe(3);
    });

    it('devrait retourner false si plusieurs champs sont invalides', () => {
      currentMember.value = {
        nom: "",
        prenom: "Jean",
        contact: "123"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.nom).toEqual(["Le nom est requis."]);
      expect(memberFormErrors.value.contact).toEqual(["Le contact doit contenir entre 8 et 13 chiffres."]);
      expect(Object.keys(memberFormErrors.value).length).toBe(2);
    });

    it('devrait réinitialiser les erreurs à chaque appel', () => {
      // Premier appel avec des erreurs
      currentMember.value = {
        nom: "",
        prenom: "",
        contact: ""
      };

      validateMemberForm();
      expect(Object.keys(memberFormErrors.value).length).toBe(3);

      // Deuxième appel avec des données valides
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "0123456789"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
      expect(Object.keys(memberFormErrors.value).length).toBe(0);
    });
  });

  describe('Cas limites et edge cases', () => {
    it('devrait accepter un nom avec des accents', () => {
      currentMember.value = {
        nom: "Dupônt",
        prenom: "Jéan",
        contact: "0123456789"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
    });

    it('devrait accepter un nom composé avec des espaces', () => {
      currentMember.value = {
        nom: "De La Fontaine",
        prenom: "Jean Marie",
        contact: "0123456789"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
    });

    it('devrait accepter un nom avec des tirets', () => {
      currentMember.value = {
        nom: "Dupont-Moretti",
        prenom: "Jean-Pierre",
        contact: "0123456789"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
    });

    it('devrait rejeter un contact avec des espaces', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "01 23 45 67 89"
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact doit contenir entre 8 et 13 chiffres."]);
    });

    it('devrait gérer un contact de type number', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: 123456789
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
    });

    it('devrait accepter un contact avec des espaces avant et après (trim)', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "  0123456789  "
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
      expect(Object.keys(memberFormErrors.value).length).toBe(0);
    });

    it('devrait retourner false si le contact ne contient que des espaces', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "     "
      };

      const result = validateMemberForm();

      expect(result).toBe(false);
      expect(memberFormErrors.value.contact).toEqual(["Le contact est requis."]);
    });

    it('devrait accepter un contact avec des espaces au début (trim)', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "   12345678"
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
    });

    it('devrait accepter un contact avec des espaces à la fin (trim)', () => {
      currentMember.value = {
        nom: "Dupont",
        prenom: "Jean",
        contact: "12345678   "
      };

      const result = validateMemberForm();

      expect(result).toBe(true);
    });
  });
});
