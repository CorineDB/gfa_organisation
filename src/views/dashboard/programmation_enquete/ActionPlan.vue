<template>
  <div class="action-plan">
    <!-- Progress Summary
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
    </div> -->

    <!-- Dropdown Filter -->
    <div class="filter-dropdown">
      <TomSelect
        v-model="selectedFilter"
        :options="{ placeholder: 'Sélectionnez une catégorie' }"
        class="w-full"
      >
        <option value="all">Toutes ({{ countActions("all") }})</option>
        <option
          v-for="filter in filters"
          :key="filter.label"
          :value="filter.value"
        >  {{ getCategoryIcon(filter.label) }}  
          {{ filter.label }} ({{ countActions(filter.value) }})
        </option>
      </TomSelect>
    </div>

    <!-- Actions Table -->
    <table class="actions-table">
      <thead>
        <tr>
          <th>Action</th>
          <th>Statut</th><!-- 
          <th>Priorité</th>
          <th>Responsable</th> -->
          <th>Deadline</th>
        </tr>
      </thead>
      <tbody v-if="filteredActions.length > 0">
        <tr v-for="(action, index) in filteredActions" :key="index">
          <td>{{ action.action }}</td>
          <td :class="`status ${String(getStatusLabel(action.statut)).toLowerCase().replace(' ', '-')}`">
            {{ getStatusLabel(action.statut) }}
          </td><!-- 
          <td>{{ action.priority }}</td>
          <td>{{ action.responsible }}</td> -->
          <td>{{ formatDate(action.end_at) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="3" class="no-actions">Aucune action disponible pour le moment.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ActionPlan",
  data() {
    return {/* 
      progressSummary: [
        { progressCategory: "Terminer", progressCurrent: countCompleted, progressTotal: actions.length },
        { progressCategory: "En cours", progressCurrent: countInProgress, progressTotal: actions.length },
        { progressCategory: "En retard", progressCurrent: countOverdue, progressTotal: actions.length },
      ] */
      selectedFilter: "in_progress",
      filters: [
        { label: "Toutes", value: "all" },
        { label: "Terminer", value: "completed" },
        { label: "En cours", value: "in_progress" },
        { label: "En retard", value: "overdue" },
      ],
    };
  },
  props:{
    actions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    countCompleted() {
      return this.actions.filter(action => action.statut === 2).length;
    },
    countInProgress() {
      return this.actions.filter(action => action.statut === 0).length;
    },
    countOverdue() {
      return this.actions.filter(action => action.statut === 1).length;
    },
    progressSummary() {
      return [
        { progressCategory: "Terminer", progressCurrent: this.countCompleted, progressTotal: this.actions.length },
        { progressCategory: "En cours", progressCurrent: this.countInProgress, progressTotal: this.actions.length },
        { progressCategory: "En retard", progressCurrent: this.countOverdue, progressTotal: this.actions.length },
      ];
    },
    filteredActions() {
      if (this.selectedFilter === "all") {
        return this.actions;
      }
      return this.actions.filter((action) => action.statut === this.selectedFilter);
    },
  },
  methods: {
    filterActions(filter) {
      this.selectedFilter = filter.value;
    },
    countActions(status) {
      if (status === "all") {
        return this.actions.length;
      }
      return this.actions.filter((action) => action.statut === status).length;
    },
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
    getStatusLabel(status) {
      const statusMap = {
        2: "Terminer",
        0: "En cours",
        1: "En retard",
      };
      return statusMap[status] || "Inconnu";
    },
  },
};
</script>

<style scoped>
/* Layout and Fonts */
.no-actions {
  text-align: center;
  font-style: italic;
  color: gray;
}

.action-plan {
  font-family: Arial, sans-serif;
  margin: 0px;
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