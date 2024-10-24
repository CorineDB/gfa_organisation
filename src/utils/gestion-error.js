export const CODE = {
  ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
};

export const messageError = (error) => {
  return error.response.data.message;
};

export function getAllErrorMessages(errorResponse) {
  return Object.values(errorResponse.response.data.errors)
    .flatMap((error) => error)
    .join(", ");
}
