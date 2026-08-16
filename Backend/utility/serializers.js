const BACKEND_URL = (process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');

function toPublicPath(filePath) {
  if (!filePath) return '';
  const normalized = filePath.replace(/\\\\/g, '/');
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const relativePath = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `${BACKEND_URL}${relativePath}`;
}

export function serializeGuide(guide) {
  if (!guide) return null;
  return {
    id: guide._id.toString(),
    name: guide.name,
    bio: guide.bio || '',
    location: guide.location,
    pricePerHour: guide.pricePerHour,
    languages: guide.languages || [],
    specialties: guide.specialties || [],
    photo: toPublicPath(guide.photo),
    isAvailable: guide.isAvailable,
  };
}

export function serializeUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    profilePhoto: user.profilePhoto || '',
    favourites: Array.isArray(user.favourites) ? user.favourites.map((f) => f.toString()) : [],
  };
}

export function serializeBooking(booking) {
  if (!booking) return null;
  return {
    id: booking._id.toString(),
    guide: serializeGuide(booking.guideId),
    date: booking.date,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

export default {
  serializeGuide,
  serializeUser,
  serializeBooking,
};
