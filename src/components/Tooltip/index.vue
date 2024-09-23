<template>
  <button
    v-if="!$slots.default"
    :content="content"
    v-tippy="{
      placement: placement,
      arrow: arrow,
      theme: theme,
      animation: animation,
      trigger: trigger,
      interactive: interactive,
      delay: delay,
      duration: duration,
      allowHTML: allowHTML,
      distance: distance,
      offset: offset,
      maxWidth: maxWidth,
    }"
    class="btn"
    :class="btnClass"
  >
    {{ title }}
  </button>

  <tippy :placement="placement" :arrow="arrow" :theme="theme" :animation="animation" :trigger="trigger" :interactive="interactive" :delay="delay" :duration="duration" :allowHTML="allowHTML" :maxWidth="maxWidth" :distance="distance" :offset="offset" v-if="$slots.default">
    <button class="btn" :class="btnClass" v-if="!$slots.button">
      {{ title }}
    </button>

    <button v-if="$slots.button" class="inline-block">
      <slot name="button"></slot>
    </button>

    <template #content> <slot></slot> </template>
  </tippy>
</template>
<script>
import "tippy.js/animations/perspective-extreme.css";
import "tippy.js/animations/perspective-subtle.css";
import "tippy.js/animations/perspective.css";
import "tippy.js/animations/scale-extreme.css";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/animations/scale.css";
import "tippy.js/animations/shift-away-extreme.css";
import "tippy.js/animations/shift-away-subtle.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/shift-toward-extreme.css";
import "tippy.js/animations/shift-toward-subtle.css";
import "tippy.js/animations/shift-toward.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

export default {
  props: {
    title: {
      type: String,
      default: "Tooltip on top",
    },
    content: {
      type: String,
      default: "Tooltip on top!",
    },
    btnClass: {
      type: String,
      default: "btn-outline-dark",
    },
    placement: {
      type: String,
      default: "top",
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "",
    },
    animation: {
      type: String,
      default: "scale",
    },
    trigger: {
      type: String,
      default: "mouseenter",
    },
    interactive: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 200,
    },
    allowHTML: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: "",
    },
    distance: {
      type: String,
      default: "1rem",
    },
    offset: {
      type: Array,
      default: () => [0, 0],
    },
  },
};
</script>
<style>
.tippy-box {
  background-color: #0f172a; /* bg-slate-900 */
}

.tippy-arrow {
  color: #0f172a; /* text-slate-900 */
}

.tippy-box[data-theme~="primary-500"] {
  background-color: #3b82f6; /* bg-primary-500 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="secondary-500"] {
  background-color: #6b7280; /* bg-secondary-500 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="success-500"] {
  background-color: #22c55e; /* bg-success-500 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="info-500"] {
  background-color: #0ea5e9; /* bg-info-500 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="warning-500"] {
  background-color: #f59e0b; /* bg-warning-500 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="danger-500"] {
  background-color: #ef4444; /* bg-danger-500 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="dark"] {
  background-color: #0f172a; /* bg-slate-900 */
  color: #ffffff; /* text-white */
}

.tippy-box[data-theme~="custom-light"] {
  background-color: #ffffff; /* bg-white */
  color: #0f172a; /* text-slate-900 */
  background-color: #334155; /* dark:bg-slate-700 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-dropdown */
  border: 1px solid #334155; /* dark:border-slate-700 */
}

.tippy-box[data-theme~="custom-light2"] {
  background-color: #ffffff; /* bg-white */
  color: #0f172a; /* text-slate-900 */
  background-color: #334155; /* dark:bg-slate-700 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-dropdown */
  border: 1px solid #334155; /* dark:border-slate-700 */
  border-radius: 0.25rem; /* rounded */
}

.tippy-box[data-theme~="custom-light2"] .tippy-content {
  padding: 0; /* p-0 */
}

.tippy-box[data-theme~="custom-light"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #ffffff; /* border-t-white */
  border-top-color: #334155; /* dark:border-t-slate-700 */
}

.tippy-box[data-theme~="custom-light"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #ffffff; /* border-b-white */
  border-bottom-color: #334155; /* dark:border-b-slate-700 */
}

.tippy-box[data-theme~="custom-light"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #ffffff; /* border-l-white */
  border-left-color: #334155; /* dark:border-l-slate-700 */
}

.tippy-box[data-theme~="custom-light"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #ffffff; /* border-r-white */
  border-right-color: #334155; /* dark:border-r-slate-700 */
}

.tippy-box[data-theme~="primary-500"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #3b82f6; /* border-t-primary-500 */
}

.tippy-box[data-theme~="primary-500"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #3b82f6; /* border-b-primary-500 */
}

.tippy-box[data-theme~="primary-500"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #3b82f6; /* border-l-primary-500 */
}

.tippy-box[data-theme~="primary-500"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #3b82f6; /* border-r-primary-500 */
}

.tippy-box[data-theme~="secondary-500"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #6b7280; /* border-t-secondary-500 */
}

.tippy-box[data-theme~="secondary-500"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #6b7280; /* border-b-secondary-500 */
}

.tippy-box[data-theme~="secondary-500"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #6b7280; /* border-l-secondary-500 */
}

.tippy-box[data-theme~="secondary-500"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #6b7280; /* border-r-secondary-500 */
}

.tippy-box[data-theme~="success-500"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #22c55e; /* border-t-success-500 */
}

.tippy-box[data-theme~="success-500"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #22c55e; /* border-b-success-500 */
}

.tippy-box[data-theme~="success-500"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #22c55e; /* border-l-success-500 */
}

.tippy-box[data-theme~="success-500"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #22c55e; /* border-r-success-500 */
}

.tippy-box[data-theme~="info-500"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #0ea5e9; /* border-t-info-500 */
}

.tippy-box[data-theme~="info-500"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #0ea5e9; /* border-b-info-500 */
}

.tippy-box[data-theme~="info-500"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #0ea5e9; /* border-l-info-500 */
}

.tippy-box[data-theme~="info-500"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #0ea5e9; /* border-r-info-500 */
}

.tippy-box[data-theme~="warning-500"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #f59e0b; /* border-t-warning-500 */
}

.tippy-box[data-theme~="warning-500"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #f59e0b; /* border-b-warning-500 */
}

.tippy-box[data-theme~="warning-500"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #f59e0b; /* border-l-warning-500 */
}

.tippy-box[data-theme~="warning-500"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #f59e0b; /* border-r-warning-500 */
}

.tippy-box[data-theme~="danger-500"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #ef4444; /* border-t-danger-500 */
}

.tippy-box[data-theme~="danger-500"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #ef4444; /* border-b-danger-500 */
}

.tippy-box[data-theme~="danger-500"][data-placement^="left"] > .tippy-arrow::before {
  border-left-color: #ef4444; /* border-l-danger-500 */
}

.tippy-box[data-theme~="danger-500"][data-placement^="right"] > .tippy-arrow::before {
  border-right-color: #ef4444; /* border-r-danger-500 */
}

.tippy-box[data-theme~="dark"][data-placement^="top"] > .tippy-arrow::before {
  border-top-color: #000000; /* border-t-black-500 */
  border-top-color: #0f172a; /* dark:border-t-slate-900 */
}

.tippy-box[data-theme~="dark"][data-placement^="bottom"] > .tippy-arrow::before {
  border-bottom-color: #000000; /* border-b-black-500 */
  border-bottom-color: #0f172a; /* dark:border-b-slate-900 */
}
</style>
