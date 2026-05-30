import apiClient from './apiClient';

export const updateProfileRequest = async (profile) => {
  const payload = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    profilePictureUrl: profile.profilePictureUrl,
    bio: profile.bio,
    city: profile.city,
    address: profile.address,
  };

  return apiClient.put('/auth/me', payload);
};
