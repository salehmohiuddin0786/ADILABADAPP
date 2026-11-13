import { apiFetch } from '../../utils/api';

/**
 * Unified Rental & Booking Service
 * Manages equipment listing, availability validation, and booking lifecycle:
 * PENDING -> ACCEPTED / REVISED -> CONFIRMED -> IN_USE -> RETURNED / DISPUTED
 */
export const rentalService = {
  async getRentals(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiFetch(`/api/v1/rentals${params ? `?${params}` : ''}`);
  },

  async getRentalBySlug(slug) {
    return apiFetch(`/api/v1/rentals/${slug}`);
  },

  async createRental(formData) {
    return apiFetch('/api/v1/rentals', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  },

  async requestBooking(rentalId, bookingDetails) {
    return apiFetch(`/api/v1/rentals/${rentalId}/book`, {
      method: 'POST',
      body: JSON.stringify(bookingDetails)
    });
  },

  async updateBookingStatus(bookingId, status, notes = '') {
    return apiFetch(`/api/v1/rentals/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  }
};
