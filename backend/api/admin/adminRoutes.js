import express from "express";
import { protect, adminOnly, viewOnlyAdmin, blockViewOnly } from "../../middleware/auth.js";
import {
  getAllUsers,
  blockOrUnblockUser,
} from "./userManagement.js";
import {
  getAdminStats,
  getSalesData,
  getRecentBuyers,
  getRecentOrders,
  getAdminBoostedProducts
} from "./analytics.js";
import {
  getVerificationRequests,
  approveVerification,
  rejectVerification,
  requestKycVerification
} from "./sellerVerification.js";
import {
  getPendingReports,
  resolveReport
} from "./reportManagement.js";
import { adminCategoryRouter } from "./categories.js";
import { adminSubCategoryRouter } from "./subcategories.js";
import {
  getAllSupportTickets,
  updateTicketStatus,
  deleteTicket
} from "./supportManagement.js";
import settingsRouter from "./settings.js";


const router = express.Router();

// Admin Dashboard Analytics (Read-only - all can view)
router.get("/stats", protect, viewOnlyAdmin, getAdminStats);
router.get("/sales-data", protect, viewOnlyAdmin, getSalesData);
router.get("/recent-buyers", protect, viewOnlyAdmin, getRecentBuyers);
router.get("/recent-orders", protect, viewOnlyAdmin, getRecentOrders);
router.get("/boosted-products", protect, viewOnlyAdmin, getAdminBoostedProducts);

// User Management (Read-only for view, write for real admin)
router.get("/users", protect, viewOnlyAdmin, getAllUsers);
router.put("/block/:id", protect, viewOnlyAdmin, blockViewOnly, blockOrUnblockUser);

// Seller Verification Management (Read-only for view, write for real admin)
router.get("/verifications", protect, viewOnlyAdmin, getVerificationRequests);
router.put("/verifications/:id/approve", protect, viewOnlyAdmin, blockViewOnly, approveVerification);
router.put("/verifications/:id/reject", protect, viewOnlyAdmin, blockViewOnly, rejectVerification);
router.post("/verifications/request-kyc", protect, viewOnlyAdmin, blockViewOnly, requestKycVerification);

// Report Management (Read-only for view, write for real admin)
router.get("/reports", protect, viewOnlyAdmin, getPendingReports);
router.put("/reports/:id/resolve", protect, viewOnlyAdmin, blockViewOnly, resolveReport);

// Support Ticket Management (Read-only for view, write for real admin)
router.get("/support", protect, viewOnlyAdmin, getAllSupportTickets);
router.put("/support/:id", protect, viewOnlyAdmin, blockViewOnly, updateTicketStatus);
router.delete("/support/:id", protect, viewOnlyAdmin, blockViewOnly, deleteTicket);

// Categories (Admin) - Read-only for view, write for real admin
router.use("/categories", protect, viewOnlyAdmin, adminCategoryRouter);
router.use("/subcategories", protect, viewOnlyAdmin, adminSubCategoryRouter);

// Settings (Logo, etc.)
router.use("/settings", settingsRouter);

export default router;
