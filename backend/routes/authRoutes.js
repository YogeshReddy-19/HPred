import {Router} from "express"
import { loginuser,logout,registeruser,getStatus } from "../controllers/authController.js"

const router = new Router();

router.post("/register",registeruser);
router.post("/login",loginuser);
router.post("/logout",logout);
router.get("/status", getStatus);

export default router;  