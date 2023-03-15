export const changeKind = (role) => {
  return {
    type: "kind",
    payload: role,
  };
};

export const saveId = (role) => {
  return {
    type: "id",
    payload: role,
  };
};
