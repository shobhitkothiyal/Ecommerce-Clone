import express from 'express';
import * as authController from '../controller/auth.controller.js';
const Router = express.Router();

Router.post("/signup", authController.register); //router  for signup 

Router.post("/signin",authController.login);

Router.post("/test-email",authController.testEmail); 

export default Router;