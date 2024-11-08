<script setup>
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
});

const emit = defineEmits(["update:modelValue"]);

function updateValue(event) {
  const value = props.type === "number" ? Number(event.target.value) : event.target.value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div>
    <label :for="label" class="form-label">{{ label }}</label>
    <input :id="label" :type="type" :required="required" :value="modelValue" @input="updateValue" class="form-control" :placeholder="label" />
  </div>
</template>
