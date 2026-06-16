import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Charities API
export const charityAPI = {
  registerCharity: (data) => apiClient.post('/charities/register', data),
  getAllCharities: () => apiClient.get('/charities/all'),
  getCharityById: (id) => apiClient.get(`/charities/${id}`),
  updateCharity: (id, data) => apiClient.put(`/charities/${id}`, data),
  getCharityStats: (charityId) => apiClient.get(`/charities/stats/${charityId}`),
};

// Donations API
export const donationAPI = {
  recordDonation: (data) => apiClient.post('/donations/record', data),
  getAllDonations: () => apiClient.get('/donations/all'),
  getDonationsByCharity: (charityId) =>
    apiClient.get(`/donations/charity/${charityId}`),
  verifyDonation: (donationId, data) =>
    apiClient.put(`/donations/verify/${donationId}`, data),
  getDonationDetails: (donationId) => apiClient.get(`/donations/${donationId}`),
};

// Allocations API
export const allocationAPI = {
  createAllocation: (data) => apiClient.post('/allocations/create', data),
  getAllocationsByCharity: (charityId) =>
    apiClient.get(`/allocations/charity/${charityId}`),
  distributeFunds: (allocationId, data) =>
    apiClient.post(`/allocations/distribute/${allocationId}`, data),
  getAllocationDetails: (allocationId) =>
    apiClient.get(`/allocations/${allocationId}`),
};

export default apiClient;
