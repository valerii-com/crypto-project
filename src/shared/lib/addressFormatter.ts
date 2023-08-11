export const addressFormatter = (str: string, begIn = 16) => {
  const begin = str.slice(0, begIn);
  const end = str.slice(-4);

  return `${begin}...${end}`;
};
