// plugins/phoneValidator.js
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export default {
  install(app) {
    app.config.globalProperties.$isValidPhoneNumber = isValidPhoneNumber;
    app.config.globalProperties.$parsePhoneNumber = parsePhoneNumber;
  }
};
