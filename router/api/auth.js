const express = require('express');
const {
  Registration,
  LoginController,
  verifyEmailAddress,
  forgetPass,
  resetPass,
  Update,
} = require('../../controllers/authControllers');
const upload = require('../../helpers/multer');
const authMiddleware = require('../../middleware/authMiddleware');
const RoleCheck = require('../../middleware/roleMiddleware');

const router = express.Router();

router.post('/registration', Registration);
router.post('/verifyemail', verifyEmailAddress);
router.post('/login', LoginController);
router.post('/forgatpass', forgetPass);
router.post('/resetpassword/:randomstring', resetPass);
router.post('/update',authMiddleware, RoleCheck(["user","admin","stuff"]), upload.single('avatar'), Update);

module.exports = router;
