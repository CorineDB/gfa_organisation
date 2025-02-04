function verifyPermission(permission) {
  if (JSON.parse(localStorage.getItem("authenticateUser"))) {
    var permissions = JSON.parse(localStorage.getItem("authenticateUser")).role[0].permissions;
  }
  var tab = permissions
    ? permissions.filter((item) => {
        return permission
          .toLowerCase()
          .split(" ")
          .every((v) => item.slug.toLowerCase().includes(v));
      })
    : [];

  return tab.length > 0;
}

export default verifyPermission;
