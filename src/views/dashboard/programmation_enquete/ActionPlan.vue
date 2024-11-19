<template>
  <div class="action-plan">
    <!-- Progress Summary -->
    <div class="progress-summary">
      <div
        class="summary-item"
        v-for="(item, index) in progressSummary"
        :key="index"
      >
        <span
          :class="`status-icon ${item.progressCategory.toLowerCase().replace(' ', '-')}`"
        >
          {{ getCategoryIcon(item.progressCategory) }}
        </span>
        <div>
          <p class="category">{{ item.progressCategory }}</p>
          <p>{{ item.progressCurrent }} / {{ item.progressTotal }}</p>
        </div>
      </div>
    </div>

    <!-- Actions Table -->
    <table class="actions-table">
      <thead>
        <tr>
          <th>Action</th>
          <th>Statut</th>
          <th>Priorité</th>
          <th>Responsable</th>
          <th>Deadline</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(action, index) in actions" :key="index">
          <td>{{ action.actionDescription }}</td>
          <td :class="`status ${action.status.toLowerCase().replace(' ', '-')}`">
            {{ action.status }}
          </td>
          <td>{{ action.priority }}</td>
          <td>{{ action.responsible }}</td>
          <td>{{ formatDate(action.deadline) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ActionPlan",
  data() {
    return {
      progressSummary: [
        { progressCategory: "Terminer", progressCurrent: 0, progressTotal: 160 },
        { progressCategory: "En cours", progressCurrent: 139, progressTotal: 160 },
        { progressCategory: "En retard", progressCurrent: 0, progressTotal: 160 },
      ],
      actions: [
        {
          actionId: 1,
          actionDescription:
            "Recruter la mission de surveillance et contrôle général pour le suivi du PGES.",
          tepActuel: 8.75,
          status: "En cours",
          priority: "Haute",
          responsible: "Équipe Technique",
          deadline: "2024-12-15",
        },
        {
          actionId: 2,
          actionDescription:
            "Construire les collecteurs d'assainissement pluvial dans les bassins Pa3 et Y.",
          tepActuel: 21.0,
          status: "En cours",
          priority: "Moyenne",
          responsible: "Département Infrastructure",
          deadline: "2025-03-01",
        },
        {
          actionId: 3,
          actionDescription:
            "Aménager les voies connexes dans les bassins Pa3 et Y.",
          tepActuel: 19.0,
          status: "En cours",
          priority: "Basse",
          responsible: "Département Logistique",
          deadline: "2025-06-30",
        },
      ],
    };
  },
  methods: {
    getCategoryIcon(category) {
      switch (category) {
        case "Terminer":
          return "✔️";
        case "En cours":
          return "⏳";
        case "En retard":
          return "⏰";
        default:
          return "";
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    },
  },
};
</script>

<style scoped>
/* Layout and Fonts */
.action-plan {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.progress-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.summary-item {
  text-align: center;
  padding: 10px;
  flex: 1;
}

.status-icon {
  font-size: 30px;
}

.category {
  font-weight: bold;
}

.actions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.actions-table th,
.actions-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

/* Status Colors */
.status {
  font-weight: bold;
  text-transform: capitalize;
}

.status.en-cours {
  color: orange;
}

.status.terminer {
  color: green;
}

.status.en-retard {
  color: red;
}
</style>