const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isContactType(type)) return type;
};

const parseBool = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;
  //false is not filters true value
  if (isFavourite === 'false') {
    isFavourite = false;
    return isFavourite;
  } else {
    isFavourite = true;
    return isFavourite;
  }
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
