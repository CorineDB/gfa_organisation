<script setup>
const props = defineProps({
  modelValue: String,
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
});

const emit = defineEmits(["update:modelValue"]);

function updateValue(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <div>
    <label :for="label" class="form-label">{{ label }}</label>
    <input :id="label" :type="type" :required="required" :value="modelValue" @input="updateValue" class="form-control" :placeholder="label" />
  </div>
</template>
