const express = require('express');
const router = express.Router();
const rentalController = require('./rentalController');
const { authenticate, optionalAuthenticate } = require('../../middleware/authenticate');
const { requireRole, requirePermission } = require('../../middleware/authorize');
const { PERMISSIONS } = require('../../config/permissions');

// Public listing and single item
router.get('/', optionalAuthenticate, rentalController.getRentals);
router.get('/:slug', optionalAuthenticate, rentalController.getRentalBySlug);

// Create rental listing (Authenticated Owners / Admin)
router.post(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.RENTAL_LIST_CREATE),
  rentalController.createRentalListing
);

// Booking request (Authenticated Customer / Owners)
router.post(
  '/:id/book',
  authenticate,
  requirePermission(PERMISSIONS.RENTAL_BOOK_REQUEST),
  rentalController.requestRentalBooking
);

// Booking status update (Accept, Reject, Confirm, Handover, Return, Dispute)
router.patch(
  '/bookings/:id/status',
  authenticate,
  rentalController.updateBookingStatus
);

module.exports = router;
