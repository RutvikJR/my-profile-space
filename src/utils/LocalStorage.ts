export const setLocalStorage = (name: string, items: any) => {
  localStorage.setItem(name, JSON.stringify(items));
};
export const getLocalStorage = (name: string) => {
  const data = localStorage.getItem(name);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
    return data;
  } else {
    return false;
  }
};
export const removeLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};
