<script setup>
import { error } from "jquery";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: "text",
  },
  control: {
    type: String,
    required: false,
  },
   min: {
    type: String,
    required: false,
  },
  max: {
    type: String,
    required: false,
  }
});

const emit = defineEmits(["update:modelValue"]);

function updateValue(event) {
  const value = props.type === "number" ? Number(event.target.value) : event.target.value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div>
    <label :for="label" class="form-label">{{ label }} <span class="text-danger" v-if="required">*</span> </label>
    <input :id="label" :type="type" :required="required" :value="modelValue" @input="updateValue" class="form-control" :placeholder="label" :min="min" :max="max" />
    <div v-if="control" class="mt-2 text-danger">{{ control }}</div>
  </div>
</template>
