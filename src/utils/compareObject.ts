export const compareObject = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => JSON.stringify(obj1[key]) === JSON.stringify(obj2[key]));
  };