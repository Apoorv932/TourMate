const BACKEND_URL = (process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');

function toPublicPath(filePath) {
  if (!filePath) {
    return '';
  }

  const normalized = filePath.replace(/\\/g, '/');
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const relativePath = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `${BACKEND_URL}${relativePath}`;
}

function serializeHome(home) {
  if (!home) {
    return null;
  }

  return {
    id: home._id.toString(),
    houseName: home.houseName,
    price: home.price,
    location: home.location,
    photo: toPublicPath(home.photo),
    rulesPdf: toPublicPath(home.rulesPdf || ''),
    description: home.description || '',
  };
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    profilePhoto: user.profilePhoto || '',
    favourites: Array.isArray(user.favourites)
      ? user.favourites.map((favourite) => favourite.toString())
      : [],
  };
}

module.exports = {
  serializeHome,
  serializeUser,
};
