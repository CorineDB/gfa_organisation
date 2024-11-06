import { useAuthStore } from "@/stores/modules/authentification";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, numeric, email, sameAs } from "@vuelidate/validators";
import { computed, reactive, ref, onMounted, provide } from "vue";
import { useRouter, useRoute } from "vue-router";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";

//props
const store = useAuthStore();
const router = useRouter();
const route = useRoute();
//emits

//datas
const statePassword = ref("password");
const show = ref(false);
const successNotification = ref();
const state = reactive({
  email: "",
  password: "",
});
const message = reactive({
  type: "success",
  message: "",
});

//computed
const year = computed(() => {
  const date = new Date();
  return date.getFullYear();
});

//hook life cycle

//methods
const login = () => {
  //alert("ok");
  //router.push("/dashboard");
  // console.log(state)

  v$.value.$validate(); // checks all inputs

  if (!v$.value.$error) {
    store
      .login(state)
      .then((payload) => {
        message.type = "success";
        message.message = "Vous etes connectées";
        successNotificationToggle();
        // alert("ok")
        router.push("/dashboard/ano");
      })
      .catch((err) => {
        message.type = "erreur";
        message.message = err;
        successNotificationToggle();
      });
  }
};

const invisible = () => {
  statePassword.value = !show.value ? "text" : "password";
  show.value = !show.value;
};

provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});
const successNotificationToggle = () => {
  // Show notification
  successNotification.value.showToast();
};

//validations
const rules = {
  password: { required, minLength: minLength(6) },
  email: { required, email },
};

const v$ = useVuelidate(rules, state);
onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});
