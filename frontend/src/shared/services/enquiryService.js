import { apiFetch } from '../../utils/api';

/**
 * Unified Enquiry Lifecycle Service
 * Statuses: NEW -> ASSIGNED -> VIEWED -> RESPONDED -> IN_DISCUSSION -> RESOLVED -> CLOSED
 */
export const enquiryService = {
  async submitEnquiry(enquiryData) {
    const payload = {
      ...enquiryData,
      status: 'NEW',
      created_at: new Date().toISOString()
    };

    // Failsafe local persistence
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_enquiries') || '[]');
        stored.unshift({ id: Date.now(), ...payload });
        localStorage.setItem('adilabad_enquiries', JSON.stringify(stored));
      } catch (e) {}
    }

    return apiFetch('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getCustomerEnquiries(customerId) {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_enquiries') || '[]');
        if (stored.length > 0) return { success: true, data: stored };
      } catch (e) {}
    }
    return apiFetch('/customer/enquiries');
  },

  async getOwnerEnquiries(ownerId) {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_enquiries') || '[]');
        if (stored.length > 0) return { success: true, data: stored };
      } catch (e) {}
    }
    return apiFetch('/owner/enquiries');
  },

  async respondToEnquiry(enquiryId, message) {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_enquiries') || '[]');
        const updated = stored.map((e) =>
          e.id === enquiryId
            ? { ...e, status: 'RESPONDED', owner_response: message, responded_at: new Date().toISOString() }
            : e
        );
        localStorage.setItem('adilabad_enquiries', JSON.stringify(updated));
      } catch (e) {}
    }

    return apiFetch(`/enquiries/${enquiryId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
};
