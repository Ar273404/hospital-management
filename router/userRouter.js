import express from 'express';
import { addNewAdmin, addNewDoctor, getAllDocters, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister } from '../controller/userController.js';
import { isAdminAuthenticated, isPatientAuthenticated } from '../middleware/auth.js';


const router = express.Router();
router.post("/patient/register",patientRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor);
router.get("/doctors",getAllDocters);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/logout",isPatientAuthenticated,logoutPatient);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);

export default router;