export const groupBySeveralKeys = <T>(arr: T[], keys: (keyof T)[]): { [key: string]: T[] } => {
  return arr.reduce((storage, item) => {
    const objKey = keys.map((key) => `${item[key]}`).join(":");
    if (storage[objKey]) {
      storage[objKey].push(item);
    } else {
      storage[objKey] = [item]; // <- fijate que tiene que ser un arreglo
    }
    return storage;
  }, {} as { [key: string]: T[] });
};

export const groupByOneKey = <T>(arr: T[], key: keyof T): { [key: string]: T[] } => {
  return arr.reduce((storage, item) => {
    // sobreescribo la key a lo que quiera(el concat me puede sobrar)
    // const objKey = `${item[key]}`.concat(":");
    const objKey = `${item[key]}`;
    if (storage[objKey]) {
      storage[objKey].push(item);
    } else {
      storage[objKey] = [item]; // <- fijate que tiene que ser un arreglo
    }
    return storage;
  }, {} as { [key: string]: T[] });
};

