<template>
  <div>
    <h2 class="mt-10 text-lg font-medium intro-y">Enquête Individuelle</h2>
    <LoaderSnipper v-if="loading" />
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div v-show="!loading" class="col-span-12">
        <div class="box">
          <!-- Tabs Header -->
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-white border-b border-slate-200">
            <div class="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                class="tab-button flex-1 lg:flex-none min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base"
                :class="{ active: activeTab === 'design' }"
                @click="activeTab = 'design'"
              >
                <span class="hidden sm:inline">🎨 Conception</span>
                <span class="sm:hidden">🎨</span>
              </button>
              <button
                class="tab-button flex-1 lg:flex-none min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base"
                :class="{ active: activeTab === 'preview' }"
                @click="activeTab = 'preview'"
              >
                <span class="hidden sm:inline">👁️ Aperçu</span>
                <span class="sm:hidden">👁️</span>
              </button>
              <button
                class="tab-button flex-1 lg:flex-none min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base"
                :class="{ active: activeTab === 'json' }"
                @click="activeTab = 'json'"
              >
                <span class="hidden sm:inline">📄 JSON</span>
                <span class="sm:hidden">📄</span>
              </button>
            </div>
            <div v-if="activeTab === 'json' || activeTab === 'design'" class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                class="btn btn-secondary px-3 sm:px-4 py-2 text-sm sm:text-base"
                @click="clearForm"
              >
                <span class="hidden sm:inline">🗑️ Vider le formulaire</span>
                <span class="sm:hidden">🗑️ Vider</span>
              </button>
              <button
                class="btn btn-success px-3 sm:px-4 py-2 text-sm sm:text-base"
                @click="copyJson"
              >
                <span class="hidden sm:inline">📋 Copier JSON</span>
                <span class="sm:hidden">📋 Copier</span>
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="tab-content min-h-[70vh] max-h-[80vh] overflow-y-auto">
            <!-- Design Tab -->
            <div v-if="activeTab === 'design'" class="design-layout flex flex-col lg:flex-row gap-4 p-4">

              <!-- Left Sidebar - Input Tools -->
              <div class="left-sidebar w-full lg:w-80 xl:w-96 bg-white rounded-lg border border-slate-200 p-4">
                <h3 class="text-lg font-semibold mb-4">Outils de création</h3>

                <!-- Add Section Button -->
                <div class="section-controls mb-6">
                  <button
                    class="add-section-btn w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base"
                    @click="addSection"
                    type="button"
                  >
                    ➕ Ajouter une section
                  </button>
                </div>

                <!-- Quick Field Add -->
                <div class="quick-add-section mb-6 p-4 bg-slate-50 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Ajout rapide</h4>
                  <div class="grid grid-cols-1 gap-2">
                    <!-- Section selection -->
                    <div v-if="form.sections.length > 1">
                      <label class="block text-xs font-medium text-gray-600 mb-1">Section cible</label>
                      <select v-model="selectedSectionIndex" class="form-select text-sm">
                        <option v-for="(section, index) in form.sections" :key="section.id" :value="index">
                          {{ section.intitule }}
                        </option>
                      </select>
                    </div>

                    <select v-model="newField.type_champ" class="form-select text-sm">
                      <option value="">Sélectionner un type</option>
                      <option v-for="type in inputTypes" :key="type.type" :value="type.type">{{ type.label }}</option>
                    </select>
                    <input v-model="newField.attribut" type="text" class="form-control text-sm" placeholder="Nom du champ" />
                    <input v-model="newField.label" type="text" class="form-control text-sm" placeholder="Libellé" />
                    <button @click="addFieldToCurrentSection" class="btn btn-primary btn-sm w-full" :disabled="form.sections.length === 0">
                      <span v-if="form.sections.length === 0">Créer d'abord une section</span>
                      <span v-else>Ajouter à {{ form.sections[selectedSectionIndex]?.intitule || 'Section' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Input Types by Category -->
                <div class="input-categories space-y-4">
                  <div class="input-category">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">Champs de base</h4>
                    <div class="input-types grid grid-cols-1 gap-2">
                      <div
                        v-for="inputType in inputTypes.filter(t => t.category === 'basic')"
                        :key="inputType.type"
                        class="input-type-item flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white"
                        @click="selectInputType(inputType)"
                      >
                        <span class="input-icon text-lg">{{ inputType.icon }}</span>
                        <span class="text-sm">{{ inputType.label }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="input-category">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">Champs de choix</h4>
                    <div class="input-types grid grid-cols-1 gap-2">
                      <div
                        v-for="inputType in inputTypes.filter(t => t.category === 'choice')"
                        :key="inputType.type"
                        class="input-type-item flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white"
                        @click="selectInputType(inputType)"
                      >
                        <span class="input-icon text-lg">{{ inputType.icon }}</span>
                        <span class="text-sm">{{ inputType.label }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="input-category">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">Champs avancés</h4>
                    <div class="input-types grid grid-cols-1 gap-2">
                      <div
                        v-for="inputType in inputTypes.filter(t => t.category === 'advanced')"
                        :key="inputType.type"
                        class="input-type-item flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white"
                        @click="selectInputType(inputType)"
                      >
                        <span class="input-icon text-lg">{{ inputType.icon }}</span>
                        <span class="text-sm">{{ inputType.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Central Design Zone -->
              <div class="design-zone flex-1 bg-gray-50 rounded-lg border border-gray-300 p-4 min-h-96">
                <div v-if="form.sections.length === 0" class="empty-state text-center py-12">
                  <div class="text-gray-400 text-lg mb-2">📋</div>
                  <p class="text-gray-500 text-sm sm:text-base">Cliquez sur "Ajouter une section" pour commencer</p>
                </div>

                <!-- Form Sections -->
                <div v-for="(section, sectionIndex) in form.sections" :key="section.id"
                     class="form-section bg-white rounded-lg border mb-4"
                     :class="{
                       'border-primary border-2 shadow-lg': sectionIndex === selectedSectionIndex,
                       'border-gray-200': sectionIndex !== selectedSectionIndex
                     }">
                  <div class="section-header flex items-center justify-between p-4 border-b border-gray-200">
                    <div class="flex items-center flex-1">
                      <div v-if="sectionIndex === selectedSectionIndex" class="mr-2 text-primary">
                        <span class="text-sm font-medium">🎯 Section active</span>
                      </div>
                      <input
                        v-model="section.intitule"
                        type="text"
                        class="section-title-input flex-1 text-lg font-medium border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none"
                        placeholder="Titre de la section"
                        @click="selectSectionForFields(sectionIndex)"
                      />
                    </div>
                    <div class="flex items-center gap-2 ml-3">
                      <button
                        @click="selectSectionForFields(sectionIndex)"
                        class="btn btn-sm"
                        :class="sectionIndex === selectedSectionIndex ? 'btn-primary' : 'btn-outline-primary'"
                        title="Sélectionner cette section pour ajouter des champs"
                      >
                        🎯
                      </button>
                      <button @click="removeSection(sectionIndex)" class="remove-btn text-red-500 hover:text-red-700 text-xl font-bold">×</button>
                    </div>
                  </div>

                  <!-- Fields in Section -->
                  <div class="section-fields p-4 min-h-24">
                    <!-- Empty state for section -->
                    <div v-if="section.elements.length === 0" class="section-empty-state text-center py-8 border-2 border-dashed border-gray-200 rounded bg-gray-50">
                      <p class="text-gray-400 text-sm">Sélectionnez un type de champ dans la barre latérale</p>
                    </div>

                    <!-- Field list with arrows -->
                    <div
                      v-for="(field, fieldIndex) in section.elements.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage)"
                      :key="field.id"
                      class="field-item"
                      :class="{ selected: selectedField === field }"
                      @click="selectField(field)"
                    >
                      <div class="field-preview flex-1">
                        <label class="form-label">
                          {{ field.label }}
                          <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                        </label>

                        <!-- Field preview based on type -->
                        <input
                          v-if="['text', 'email', 'password', 'number', 'date', 'time', 'datetime-local', 'tel', 'url'].includes(field.type_champ)"
                          :type="field.type_champ"
                          :placeholder="field.placeholder"
                          class="form-control"
                          disabled
                        />

                        <textarea
                          v-else-if="field.type_champ === 'textarea'"
                          :placeholder="field.placeholder"
                          :rows="field.meta_options?.configs?.rows || 3"
                          class="form-control"
                          disabled
                        ></textarea>

                        <select
                          v-else-if="field.type_champ === 'select'"
                          class="form-select"
                          disabled
                        >
                          <option value="">{{ field.placeholder || 'Sélectionnez une option' }}</option>
                          <option
                            v-for="option in field.meta_options?.configs?.options || []"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>

                        <div v-else-if="field.type_champ === 'checkbox'" class="form-check">
                          <div
                            v-for="option in field.meta_options?.configs?.options || []"
                            :key="option.value"
                            class="form-check mb-2"
                          >
                            <input
                              type="checkbox"
                              :value="option.value"
                              class="form-check-input"
                              disabled
                            />
                            <label class="form-check-label ml-2">
                              {{ option.label }}
                            </label>
                          </div>
                        </div>

                        <div v-else-if="field.type_champ === 'radio'" class="form-check">
                          <div
                            v-for="option in field.meta_options?.configs?.options || []"
                            :key="option.value"
                            class="form-check mb-2"
                          >
                            <input
                              type="radio"
                              :name="field.id"
                              :value="option.value"
                              class="form-check-input"
                              disabled
                            />
                            <label class="form-check-label ml-2">
                              {{ option.label }}
                            </label>
                          </div>
                        </div>

                        <div v-if="field.info" class="form-help mt-1 text-sm text-gray-500">
                          {{ field.info }}
                        </div>
                      </div>

                      <!-- Field controls -->
                      <div class="field-controls flex flex-col gap-1 ml-3">
                        <button
                          @click.stop="moveFieldUp(sectionIndex, fieldIndex)"
                          :disabled="fieldIndex === 0"
                          class="btn btn-sm btn-secondary"
                          :class="{ 'opacity-50 cursor-not-allowed': fieldIndex === 0 }"
                        >
                          ↑
                        </button>
                        <button
                          @click.stop="moveFieldDown(sectionIndex, fieldIndex)"
                          :disabled="fieldIndex === section.elements.length - 1"
                          class="btn btn-sm btn-secondary"
                          :class="{ 'opacity-50 cursor-not-allowed': fieldIndex === section.elements.length - 1 }"
                        >
                          ↓
                        </button>
                        <button @click.stop="removeField(sectionIndex, fieldIndex)" class="btn btn-sm btn-danger">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar - Field Properties -->
              <div class="right-sidebar w-full lg:w-80 xl:w-96 bg-white rounded-lg border border-slate-200 p-4">
                <h3 class="text-lg font-semibold mb-4">Paramètres du champ</h3>
                <div v-if="selectedField" class="field-properties">
                  <!-- Basic Properties -->
                  <div class="property-group mb-4">
                    <label class="property-label">Label *</label>
                    <input v-model="selectedField.label" type="text" class="property-input" />
                  </div>

                  <div class="property-group mb-4">
                    <label class="property-label">Attribut (ID unique) *</label>
                    <input v-model="selectedField.attribut" type="text" class="property-input" placeholder="ex: nom_utilisateur" />
                    <small class="text-xs text-gray-500 mt-1">Cet attribut sert d'identifiant unique pour le champ</small>
                  </div>

                  <div class="property-group mb-4">
                    <label class="property-label">Placeholder</label>
                    <input v-model="selectedField.placeholder" type="text" class="property-input" />
                  </div>

                  <div class="property-group mb-4">
                    <label class="property-label">Texte d'aide</label>
                    <input v-model="selectedField.info" type="text" class="property-input" />
                  </div>

                  <div class="property-group mb-4">
                    <div class="form-check">
                      <input
                        v-model="selectedField.is_required"
                        type="checkbox"
                        class="form-check-input"
                        id="field-required"
                      />
                      <label for="field-required" class="form-check-label ml-2">Champ requis</label>
                    </div>
                  </div>

                  <!-- Type-specific configurations -->
                  <div v-if="['select', 'checkbox', 'radio'].includes(selectedField.type_champ)" class="config-section">
                    <h4 class="text-sm font-medium mb-3">Options de choix</h4>
                    <div class="options-manager">
                      <div
                        v-for="(option, index) in selectedField.meta_options.configs.options"
                        :key="index"
                        class="option-item flex gap-2 mb-2"
                      >
                        <input
                          v-model="option.label"
                          type="text"
                          placeholder="Libellé"
                          class="option-input flex-1"
                        />
                        <input
                          v-model="option.value"
                          type="text"
                          placeholder="Valeur"
                          class="option-input flex-1"
                        />
                        <button
                          @click="removeOption(selectedField, index)"
                          type="button"
                          class="btn btn-sm btn-danger"
                        >×</button>
                      </div>
                      <button
                        @click="addOption(selectedField)"
                        type="button"
                        class="btn btn-sm btn-success w-full mt-2"
                      >+ Ajouter une option</button>
                    </div>
                  </div>

                </div>
                <div v-else class="no-selection text-center py-8">
                  <p class="text-gray-500">Sélectionnez un champ pour modifier ses propriétés</p>
                </div>
              </div>
            </div>

            <!-- Preview Tab -->
            <div v-if="activeTab === 'preview'" class="preview-layout p-4">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h3 class="text-lg font-medium mb-4">{{ form.nom || 'Aperçu du formulaire' }}</h3>

                <form class="form-preview" v-if="form.sections.length > 0">
                  <div
                    v-for="(section, sectionIndex) in form.sections"
                    :key="section.id"
                    class="preview-section mb-6"
                  >
                    <div v-if="section.intitule" class="mb-4">
                      <h4 class="text-base font-medium">{{ section.intitule }}</h4>
                    </div>

                    <div class="preview-fields space-y-4">
                      <div
                        v-for="field in section.elements.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage)"
                        :key="field.id"
                        class="preview-field"
                      >
                        <!-- Field preview (interactive) -->
                        <div v-if="['text', 'email', 'password', 'number', 'date', 'time', 'datetime-local', 'tel', 'url'].includes(field.type_champ)">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            :type="field.type_champ"
                            :placeholder="field.placeholder"
                            :required="field.is_required"
                            class="form-control"
                          />
                          <div v-if="field.info" class="form-help mt-2 text-sm text-gray-500">
                            {{ field.info }}
                          </div>
                        </div>

                        <div v-else-if="field.type_champ === 'textarea'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <textarea
                            :placeholder="field.placeholder"
                            :required="field.is_required"
                            :rows="field.meta_options?.configs?.rows || 3"
                            class="form-control"
                          ></textarea>
                          <div v-if="field.info" class="form-help mt-2 text-sm text-gray-500">
                            {{ field.info }}
                          </div>
                        </div>

                        <div v-else-if="field.type_champ === 'select'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <select
                            :required="field.is_required"
                            class="form-select"
                          >
                            <option value="">{{ field.placeholder || 'Sélectionnez une option' }}</option>
                            <option
                              v-for="option in field.meta_options?.configs?.options || []"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </option>
                          </select>
                          <div v-if="field.info" class="form-help mt-2 text-sm text-gray-500">
                            {{ field.info }}
                          </div>
                        </div>

                        <div v-else-if="field.type_champ === 'checkbox'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <div class="flex flex-col mt-2">
                            <div
                              v-for="option in field.meta_options?.configs?.options || []"
                              :key="option.value"
                              class="form-check mt-2"
                            >
                              <input
                                type="checkbox"
                                :value="option.value"
                                class="form-check-input"
                              />
                              <label class="form-check-label ml-2">
                                {{ option.label }}
                              </label>
                            </div>
                          </div>
                          <div v-if="field.info" class="form-help mt-2 text-sm text-gray-500">
                            {{ field.info }}
                          </div>
                        </div>

                        <div v-else-if="field.type_champ === 'radio'">
                          <label class="form-label">
                            {{ field.label }}
                            <span v-if="field.is_required" class="text-red-500 ml-1">*</span>
                          </label>
                          <div class="flex flex-col mt-2">
                            <div
                              v-for="option in field.meta_options?.configs?.options || []"
                              :key="option.value"
                              class="form-check mt-2"
                            >
                              <input
                                type="radio"
                                :name="field.id"
                                :value="option.value"
                                class="form-check-input"
                              />
                              <label class="form-check-label ml-2">
                                {{ option.label }}
                              </label>
                            </div>
                          </div>
                          <div v-if="field.info" class="form-help mt-2 text-sm text-gray-500">
                            {{ field.info }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Submit button for demo -->
                  <div class="mt-6">
                    <button type="submit" class="btn btn-primary">Soumettre</button>
                    <button type="button" class="btn btn-outline-secondary ml-2">Annuler</button>
                  </div>
                </form>

                <div v-else class="text-center py-12">
                  <div class="text-gray-400 text-lg mb-2">👁️</div>
                  <p class="text-gray-500">Créez des champs dans l'onglet Conception pour voir l'aperçu</p>
                </div>
              </div>
            </div>

            <!-- JSON Tab -->
            <div v-if="activeTab === 'json'" class="json-layout p-4">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h3 class="text-lg font-medium mb-4">JSON du formulaire</h3>
                <div class="mb-4">
                  <button
                    @click="updateFormDataFromBuilder"
                    class="btn btn-secondary btn-sm"
                  >
                    📝 Mettre à jour les données du modal
                  </button>
                </div>
                <textarea
                  :value="formJson"
                  class="form-control font-mono text-sm"
                  style="min-height: 400px; font-family: 'Courier New', monospace;"
                  readonly
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ManagementEvaluationIndividuel :formulaires="datas" />
    <div v-show="!isLoadingData" class="!z-0 p-5 mt-4 box">
      <p class="mt-2 text-lg font-medium intro-y">Liste des formulaires</p>

      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tabulator" class="mt-5 table-report table-report--tabulator"></div>
      </div>
    </div>
    <LoaderSnipper v-if="isLoadingData" />
  </div>

  <button class="fixed !z-30 bottom-2 btn btn-primary right-5" @click="openCreateModal"><PlusIcon class="mr-3 size-5" /> Créer un formulaire</button>

  <!-- Modal for creating/updating -->
  <Modal backdrop="static" :show="showModalCreate" @hidden="closeModal">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ modeText }} un formulaire</h2>
    </ModalHeader>
    <form @submit.prevent="submitData">
      <ModalBody>
        <div class="grid grid-cols-1 gap-4">
          <InputForm label="Libelle" v-model="payload.libelle" :control="getFieldErrors(errors.libelle)" />
          <div class="flex-1">
            <label class="form-label" for="description">Description</label>
            <div class="">
              <textarea name="description" class="form-control" id="description" v-model="payload.description" cols="30" rows="3"></textarea>
              <div v-if="errors.description" class="mt-2 text-danger">{{ getFieldErrors(errors.description) }}</div>
            </div>
          </div>
          <div class="flex-1">
            <label class="form-label" for="description">Structure Formulaire <span class="text-danger">*</span> </label>
            <div class="">
              <div class="flex gap-2 mb-2">
                <button type="button" @click="updateFormDataFromBuilder" class="btn btn-secondary btn-sm">Récupérer depuis le créateur</button>
              </div>
              <textarea name="form_data" class="form-control" id="form_data" v-model="payload.form_data" cols="30" rows="3"></textarea>
              <div v-if="errors.form_data" class="mt-2 text-danger">{{ getFieldErrors(errors.form_data) }}</div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div class="flex gap-2">
          <button type="button" @click="resetForm" class="w-full px-2 py-2 my-3 btn btn-outline-secondary">Annuler</button>
          <VButton :loading="isLoading" :label="modeText" />
        </div>
      </ModalFooter>
    </form>
  </Modal>

  <!-- Modal for deleting -->
  <Modal :show="deleteModalPreview" @hidden="closeDeleteModal">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-lg">{{ nameSelect }}</div>
        <div class="mt-2 text-slate-500">Supprimer le formulaire?</div>
      </div>
      <div class="flex justify-center gap-3 py-4">
        <button type="button" @click="cancelDelete" class="btn btn-outline-secondary">Annuler</button>
        <DeleteButton :loading="isLoading" @click="deleteData" />
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" size="modal-xl" :show="showModalPreview" @hidden="showModalPreview = false">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">{{ currentForm.libelle }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="max-h-[65vh] h-[65vh] overflow-y-auto">
        <div class="p-4">
          <h3 class="text-lg font-medium mb-3">Aperçu du formulaire</h3>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(currentForm.form_data, null, 2) }}</pre>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="flex gap-2">
        <button type="button" @click="showModalPreview = false" class="flex-1 w-full px-2 py-2 my-3 btn btn-outline-secondary">Retour</button>
      </div>
    </ModalFooter>
  </Modal>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import LoaderSnipper from "@/components/LoaderSnipper.vue";
import VButton from "@/components/news/VButton.vue";
import InputForm from "@/components/news/InputForm.vue";
import { getAllErrorMessages } from "@/utils/gestion-error";
import { getFieldErrors } from "../../utils/helpers";
import { toast } from "vue3-toastify";
import Tabulator from "tabulator-tables";
import DeleteButton from "@/components/news/DeleteButton.vue";
import EnqueteIndividuelService from "../../services/modules/enquete.individuel.service";
import ManagementEvaluationIndividuel from "./ManagementEvaluationIndividuel.vue";
 

// Tab management
const activeTab = ref('design');

// Original variables
const payload = reactive({ libelle: "", description: "", form_data: "" });
const loading = ref(false);
const isLoading = ref(false);
const showModalCreate = ref(false);
const showModalPreview = ref(false);
const isLoadingData = ref(false);
const isCreate = ref(true);
const datas = ref([]);
const errors = ref({});
const currentForm = ref({});
const idSelect = ref("");
const nameSelect = ref("");
const deleteModalPreview = ref(false);
const tabulator = ref();

// Enhanced form builder variables
const selectedField = ref(null);
const selectedSectionIndex = ref(0); // Track which section is selected for adding fields
const newField = reactive({
  type_champ: "",
  attribut: "",
  label: "",
  value: "",
  options: "",
});

// Form structure with sections
const form = reactive({
  nom: "Enquête Individuelle",
  description: "Formulaire d'enquête individuelle",
  sections: []
});

let fieldCounter = 1;
let sectionCounter = 1;

// Input types with categories
const inputTypes = [
  { type: 'text', label: 'Texte', icon: '📝', category: 'basic' },
  { type: 'email', label: 'Email', icon: '📧', category: 'basic' },
  { type: 'number', label: 'Nombre', icon: '🔢', category: 'basic' },
  { type: 'date', label: 'Date', icon: '📅', category: 'basic' },
  { type: 'tel', label: 'Téléphone', icon: '📞', category: 'basic' },
  { type: 'url', label: 'URL', icon: '🌐', category: 'basic' },
  { type: 'textarea', label: 'Zone de texte', icon: '📄', category: 'basic' },
  { type: 'select', label: 'Liste déroulante', icon: '📋', category: 'choice' },
  { type: 'checkbox', label: 'Cases à cocher', icon: '☑️', category: 'choice' },
  { type: 'radio', label: 'Boutons radio', icon: '🔘', category: 'choice' },
  { type: 'password', label: 'Mot de passe', icon: '🔒', category: 'advanced' },
  { type: 'time', label: 'Heure', icon: '⏰', category: 'advanced' },
  { type: 'datetime-local', label: 'Date et Heure', icon: '📅⏰', category: 'advanced' }
];

// Legacy support - map form.sections to formFields for backward compatibility
const formFields = computed(() => {
  return form.sections.flatMap(section =>
    section.elements.map(field => ({
      type_champ: field.type_champ,
      attribut: field.attribut,
      label: field.label,
      value: field.default_value || "",
      options: field.meta_options?.configs?.options?.map(opt => opt.label) || []
    }))
  );
});

// Enhanced form builder methods with element_type structure
const addSection = () => {
  const sectionNumber = form.sections.length + 1;
  const newSection = {
    element_type: "section",
    ordre_affichage: sectionNumber,
    id: sectionCounter++,
    intitule: `Section ${sectionNumber}`,
    description: `Description de la section ${sectionNumber}`,
    info: "",
    key: `section-${sectionNumber}-${Date.now()}`,
    parentSectionId: null,
    type: "formulaire",
    elements: []
  };
  form.sections.push(newSection);

  // Set the newly created section as the target for new fields
  selectedSectionIndex.value = form.sections.length - 1;
};

const removeSection = (sectionIndex) => {
  form.sections.splice(sectionIndex, 1);
  selectedField.value = null;

  // Adjust selectedSectionIndex if needed
  if (selectedSectionIndex.value >= sectionIndex && selectedSectionIndex.value > 0) {
    selectedSectionIndex.value--;
  } else if (form.sections.length === 0) {
    selectedSectionIndex.value = 0;
  } else if (selectedSectionIndex.value >= form.sections.length) {
    selectedSectionIndex.value = form.sections.length - 1;
  }
};

const selectInputType = (inputType) => {
  newField.type_champ = inputType.type;
  newField.label = `Nouveau ${inputType.label}`;
  newField.attribut = `field_${fieldCounter}`;
};

const addFieldToCurrentSection = () => {
  if (!newField.type_champ || !newField.attribut) {
    toast.error("Type de champ et attribut sont requis");
    return;
  }

  // Create Section 1 automatically if no sections exist
  if (form.sections.length === 0) {
    addSection();
  }

  const newFieldObj = createNewField({
    type: newField.type_champ,
    label: newField.label || inputTypes.find(t => t.type === newField.type_champ)?.label || newField.type_champ
  });

  newFieldObj.attribut = newField.attribut;
  newFieldObj.label = newField.label || newField.attribut;
  newFieldObj.default_value = newField.value || "";

  // Add to the selected section (default to last section if index is invalid)
  let targetSectionIndex = selectedSectionIndex.value;
  if (targetSectionIndex >= form.sections.length || targetSectionIndex < 0) {
    targetSectionIndex = form.sections.length - 1;
    selectedSectionIndex.value = targetSectionIndex;
  }

  const targetSection = form.sections[targetSectionIndex];
  newFieldObj.ordre_affichage = targetSection.elements.length + 1;
  newFieldObj.sectionId = targetSection.id;
  targetSection.elements.push(newFieldObj);

  // Auto-select the new field
  selectedField.value = newFieldObj;

  // Reset form
  newField.type_champ = "";
  newField.attribut = "";
  newField.label = "";
  newField.value = "";
  newField.options = "";

  toast.success(`Champ ajouté avec succès à la section "${targetSection.intitule}"`);
};

// Add method to select which section to add fields to
const selectSectionForFields = (sectionIndex) => {
  selectedSectionIndex.value = sectionIndex;
};

const createNewField = (inputType) => {
  const baseField = {
    element_type: "field",
    ordre_affichage: 1,
    id: fieldCounter++,
    label: `Nouveau ${inputType.label}`,
    info: "",
    key: `field-${inputType.type}-${Date.now()}`,
    attribut: `field_${fieldCounter}`,
    placeholder: `Ex: ${inputType.label}`,
    is_required: false,
    default_value: null,
    isEvaluated: false,
    type_champ: inputType.type,
    sectionId: null,
    documentId: null,
    meta_options: {
      validations_rules: {
        min: null,
        max: null,
        required: false
      },
      conditions: {
        visible: true,
        disable: false,
        conditons: {}
      },
      configs: {}
    }
  };

  // Add type-specific configurations
  switch (inputType.type) {
    case 'text':
    case 'textarea':
      baseField.meta_options.configs = {
        max_length: 255,
        min_length: 1,
        ...(inputType.type === 'textarea' && { rows: 3 })
      };
      break;

    case 'number':
      baseField.meta_options.configs = {
        min: 0,
        max: 100,
        step: 1
      };
      break;

    case 'select':
    case 'checkbox':
    case 'radio':
      baseField.meta_options.configs = {
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ]
      };
      break;

    default:
      baseField.meta_options.configs = {
        max_length: 255,
        min_length: 1
      };
  }

  return baseField;
};

const selectField = (field) => {
  selectedField.value = field;
};

const removeField = (sectionIndex, fieldIndex) => {
  const section = form.sections[sectionIndex];
  const fieldToRemove = section.elements[fieldIndex];

  section.elements.splice(fieldIndex, 1);

  // Update order for remaining fields
  section.elements.forEach((field, index) => {
    field.ordre_affichage = index + 1;
  });

  // Clear selection if removed field was selected
  if (selectedField.value && selectedField.value.id === fieldToRemove?.id) {
    selectedField.value = null;
  }
};

const moveFieldUp = (sectionIndex, fieldIndex) => {
  if (fieldIndex === 0) return;

  const section = form.sections[sectionIndex];
  const sortedFields = section.elements.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage);
  const field = sortedFields[fieldIndex];
  const previousField = sortedFields[fieldIndex - 1];

  // Swap order values
  const tempOrder = field.ordre_affichage;
  field.ordre_affichage = previousField.ordre_affichage;
  previousField.ordre_affichage = tempOrder;
};

const moveFieldDown = (sectionIndex, fieldIndex) => {
  const section = form.sections[sectionIndex];
  const sortedFields = section.elements.slice().sort((a, b) => a.ordre_affichage - b.ordre_affichage);

  if (fieldIndex === sortedFields.length - 1) return;

  const field = sortedFields[fieldIndex];
  const nextField = sortedFields[fieldIndex + 1];

  // Swap order values
  const tempOrder = field.ordre_affichage;
  field.ordre_affichage = nextField.ordre_affichage;
  nextField.ordre_affichage = tempOrder;
};

const addOption = (field) => {
  if (!field.meta_options.configs.options) {
    field.meta_options.configs.options = [];
  }
  field.meta_options.configs.options.push({
    label: `Option ${field.meta_options.configs.options.length + 1}`,
    value: `option_${field.meta_options.configs.options.length + 1}`
  });
};

const removeOption = (field, index) => {
  field.meta_options.configs.options.splice(index, 1);
};

const clearForm = () => {
  form.sections = [];
  selectedField.value = null;
  newField.type_champ = "";
  newField.attribut = "";
  newField.label = "";
  newField.value = "";
  newField.options = "";
  toast.success("Formulaire vidé");
};

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(formJson.value);
    toast.success("JSON copié dans le presse-papier");
  } catch (err) {
    console.error("Erreur lors de la copie:", err);
    toast.error("Erreur lors de la copie du JSON");
  }
};

const updateFormDataFromBuilder = () => {
  if (form.sections.length > 0 && form.sections.some(section => section.elements.length > 0)) {
    payload.form_data = formJson.value;
    toast.success("Données du formulaire mises à jour depuis le créateur");
  } else {
    toast.error("Aucun champ créé dans le formulaire");
  }
};

const formJson = computed(() => {
  // Transform to the expected structure with forms array
  const transformedForm = {
    forms: form.sections.map(section => ({
      ...section,
      elements: section.elements || []
    }))
  };
  return JSON.stringify(transformedForm, null, 2);
});

const initTabulator = () => {
  tabulator.value = new Tabulator("#tabulator", {
    data: datas.value,
    placeholder: "Aucune donnée disponible.",
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: "local",
    paginationSize: 5,
    columns: [
      {
        title: "Libellé",
        field: "libelle",
        vertAlign: "middle",
      },

      // {
      //   title: "Auteur",
      //   field: "auteur",
      //   hozAlign: "center",
      // },
      {
        title: "Actions",
        field: "actions",
        vertAlign: "middle",
        hozAlign: "center",
        formatter: (cell) => {
          const container = document.createElement("div");
          container.className = "flex items-center justify-center gap-3";

          const createButton = (label, className, onClick) => {
            const button = document.createElement("button");
            button.className = className;
            button.innerText = label;
            button.addEventListener("click", onClick);
            return button;
          };

          const previewButton = createButton("voir", "btn btn-primary", () => {
            handlePreview(cell.getData());
          });

          const editButton = createButton("modifier", "btn btn-pending", () => {
            handleEdit(cell.getData());
          });

          const deleteButton = createButton("supprimer", "btn btn-danger", () => {
            handleDelete(cell.getData());
          });
          container.append(previewButton, editButton, deleteButton);
          return container;
        },
      },
    ],
  });
};
// Fetch data
const getDatas = async () => {
  isLoadingData.value = true;
  try {
    const { data } = await EnqueteIndividuelService.get();
    datas.value = data.data;
  } catch (e) {
    toast.error("Erreur lors de la récupération des données.");
  } finally {
    isLoadingData.value = false;
  }
  initTabulator();
};

// Submit data (create or update)
const submitData = async () => {
  isLoading.value = true;
  payload.form_data = JSON.parse(payload.form_data);
  const action = isCreate.value ? EnqueteIndividuelService.create(payload) : EnqueteIndividuelService.update(idSelect.value, payload);
  try {
    await action;
    toast.success(`Formulaire ${isCreate.value ? "crée" : "modifié"} avec succès.`);
    getDatas();
    payload.form_data = JSON.stringify(payload.form_data);
    resetForm();
  } catch (e) {
    payload.form_data = JSON.stringify(payload.form_data);
    if (e.response && e.response.status === 422) {
      errors.value = e.response.data.errors;
    } else {
      toast.error(getAllErrorMessages(e));
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete data
const deleteData = async () => {
  try {
    isLoading.value = true;
    await EnqueteIndividuelService.destroy(idSelect.value);
    toast.success("Formulaire supprimé avec succès.");
    getDatas();
  } catch (e) {
    console.error(e);
    toast.error(getAllErrorMessages(e));
  } finally {
    isLoading.value = false;
    deleteModalPreview.value = false;
  }
};

// Handle edit action
const handleEdit = (data) => {
  isCreate.value = false;
  idSelect.value = data.id;
  payload.libelle = data.libelle;
  payload.form_data = JSON.stringify(data.form_data);
  payload.description = data.description ?? "";
  showModalCreate.value = true;
};

const handlePreview = (data) => {
  currentForm.value = data;
  showModalPreview.value = true;
};

// Handle delete action
const handleDelete = (data) => {
  idSelect.value = data.id;
  nameSelect.value = data.nom;
  deleteModalPreview.value = true;
};

// UI related functions
const resetForm = () => {
  Object.keys(payload).forEach((key) => {
    payload[key] = "";
  });
  errors.value = {};
  showModalCreate.value = false;
};
const openCreateModal = () => {
  // resetForm();
  isCreate.value = true;
  showModalCreate.value = true;
};
const cancelDelete = () => {
  idSelect.value = "";
  deleteModalPreview.value = false;
};
const closeModal = () => (showModalCreate.value = false);
const closeDeleteModal = () => (deleteModalPreview.value = false);

const modeText = computed(() => (isCreate.value ? "Ajouter" : "Modifier"));

onMounted(() => {
  getDatas();
});
</script>

<style scoped>
/* Tab styles */
.tab-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tab-button.active {
  background: #0E6258;
  color: white;
  border-color: #0E6258;
}

.tab-button:hover:not(.active) {
  background: #f8f9fa;
  border-color: #0E6258;
}

/* Form builder styles */
.design-layout {
  min-height: 60vh;
}

.left-sidebar, .right-sidebar {
  max-height: 70vh;
  overflow-y: auto;
}

.input-type-item {
  transition: all 0.2s ease;
}

.input-type-item:hover {
  background: #e9ecef !important;
  border-color: #0E6258 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.field-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.field-item.selected {
  border-color: #0E6258;
  background: #e7f3ff;
}

.field-preview {
  flex: 1;
  min-width: 0;
}

.field-preview label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.field-preview input,
.field-preview textarea,
.field-preview select {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.field-controls {
  min-width: 60px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.property-label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.property-input,
.option-input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.property-input:focus,
.option-input:focus {
  outline: none;
  border-color: #0E6258;
  box-shadow: 0 0 0 2px rgba(14, 98, 88, 0.25);
}

.section-title-input {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
}

.section-title-input:hover,
.section-title-input:focus {
  border-color: #0E6258;
  outline: none;
  background: #f8f9fa;
}

.form-section {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-empty-state {
  background: #fafafa;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.no-selection {
  color: #6c757d;
  font-style: italic;
  text-align: center;
}

/* Preview styles */
.preview-section {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.preview-section:hover {
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.preview-field .form-help {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Legacy styles (keep for compatibility) */
.iframe-container {
  position: relative !important;
  width: 82vw !important;
  display: flex;
  justify-content: center;
  max-width: 82vw !important;
  height: 85vh !important;
  padding-top: 56.25% !important;
}

iframe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  border: none !important;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 82vw !important;
  height: 95px;
  background-color: white;
  z-index: 10;
}

/* Responsive design */
@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }

  .left-sidebar, .right-sidebar {
    width: 100%;
    max-height: 300px;
  }

  .field-controls {
    flex-direction: row;
    min-width: auto;
    justify-content: flex-end;
  }
}
</style>
