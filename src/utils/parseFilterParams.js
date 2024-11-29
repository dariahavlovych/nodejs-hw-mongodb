const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isContactType(type)) return type;
};

const parseBool = (isFavourite) => {
  return typeof isFavourite === 'string' && isFavourite === 'true';
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  const paresdType = parseType(type);
  const parsedFavorite = parseBool(isFavourite);

  return {
    type: paresdType,
    isFavourite: parsedFavorite,
  };
};
