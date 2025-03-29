const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const mailer = require("../helpers/mailer");
const randomstring = require("randomstring");
const PasswordReset = require("../models/passwordReset");
const jwt = require("jsonwebtoken");
const path = require("path");
const { deleteFile } = require("../helpers/deleteFile");

const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        success: false,
      });
    }

    const { name, email, mobile, password } = req.body;

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return res.status(400).send({
        error: "Email already exist",
        success: false,
      });
    }

    const isNumberExist = await User.findOne({ mobile });

    if (isNumberExist) {
      return res.status(400).send({
        error: "Number already exist",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      mobile,
      password: hashPassword,
      image: "images/" + req.file.filename,
    });

    const userData = await user.save();

    const msg = `<p>Dear ${name},</p> 
    <p>Thank you for registering with us. To complete your registration and activate your account, please verify your email address by clicking the link below:</p> 
    <p><a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}" style="color: blue; text-decoration: underline;">Verify Your Email</a></p>
    <p>If you did not create an account with us, please ignore this email.</p>
    <p>Best regards,</p>
    <p>Mouhammad Ndour</p>`;

    mailer.sendMail(email, "Mail verification", msg);

    return res.status(200).json({
      status: "success",
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const mailVerification = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(404).render("404");
    }

    // Récupérer l'utilisateur avec await
    const userData = await User.findOne({ _id: userId });

    if (!userData) {
      return res.render("mail-verification", { message: "User not found!" });
    }

    if (userData.is_verified === 1) {
      return res.render("mail-verification", {
        message: "Your email has already been verified.",
      });
    }

    // Mettre à jour l'utilisateur
    await User.updateOne({ _id: userId }, { $set: { is_verified: 1 } });

    return res.render("mail-verification", {
      message: "Your email has been successfully verified!",
    });
  } catch (e) {
    console.error("Verification error:", e.message);
    return res.status(500).render("404");
  }
};

const sendMailVerification = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array(),
        success: false,
        message: "Errors",
      });
    }

    const { email } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "Email does not exist",
      });
    }

    if (userData.is_verified == 1) {
      return res.status(400).send({
        success: false,
        message: userData.email + " mail is already verified",
      });
    }

    const msg = `<p>Dear ${userData.name},</p> 
    <p>Thank you for registering with us. To complete your registration and activate your account, please verify your email address by clicking the link below:</p> 
    <p><a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}" style="color: blue; text-decoration: underline;">Verify Your Email</a></p>
    <p>If you did not create an account with us, please ignore this email.</p>
    <p>Best regards,</p>
    <p>Mouhammad Ndour</p>`;

    mailer.sendMail(userData.email, "Mail verification", msg);

    return res.status(200).json({
      status: "success",
      message: "Verification link sent to your email, please check!",
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array(),
        success: false,
        message: "Errors",
      });
    }

    const { email } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "Email does not exist",
      });
    }

    const randomString = randomstring.generate();
    const msg = `
    <p>Hello ${userData.name},</p>
    <p>Please click <a href="http://127.0.0.1:3000/reset-password?token=${randomString}">here</a> to reset your password.</p>
    `;
    await PasswordReset.deleteMany({
      user_id: userData._id,
    });

    const passwordReset = new PasswordReset({
      user_id: userData._id,
      token: randomString,
    });

    await passwordReset.save();

    mailer.sendMail(userData.email, "Reset Password", msg);
    return res.status(201).json({
      status: "success",
      message: "Reset Password link sent to your email, please check!",
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (req.query.token == undefined) {
      return res.render("404");
    }

    const resetData = await PasswordReset.findOne({ token: req.query.token });
    if (!resetData) {
      return res.render("404");
    }

    return res.render("reset-password", {
      resetData,
    });
  } catch (e) {
    return res.render("404");
  }
};

const updatePassword = async (req, res) => {
  try {
    const { user_id, password, confirm_password } = req.body;

    // Vérifier si le token de réinitialisation existe
    const resetData = await PasswordReset.findOne({ user_id });

    if (!resetData) {
      return res.render("reset-password", {
        resetData: null,
        error: "Invalid or expired reset token",
      });
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirm_password) {
      return res.render("reset-password", {
        resetData,
        error: "Passwords do not match",
      });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour le mot de passe de l'utilisateur
    await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { password: hashedPassword } },
      { new: true }, // Assure que la mise à jour est prise en compte
    );

    // Supprimer toutes les entrées de réinitialisation du mot de passe pour cet utilisateur
    await PasswordReset.deleteMany({ user_id });

    // Rediriger vers la page de succès
    return res.redirect("/reset-success");
  } catch (e) {
    console.error("Error updating password:", e);
    return res.render("404");
  }
};

const resetSuccess = async (req, res) => {
  try {
    return res.render("reset-success");
  } catch (e) {
    return res.render("404");
  }
};

const generateAccessToken = async (user) => {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const loginUser = async (req, res) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Vérifier si le mot de passe correspond
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Vérifier si le compte est vérifié
    if (userData.is_verified === 0) {
      return res.status(401).json({
        success: false,
        message: "Please verify your account before logging in.",
      });
    }

    // Générer le token JWT
    const accessToken = await generateAccessToken({ userId: userData._id });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      },
      accessToken,
      tokenType: "Bearer",
    });
  } catch (error) {
    console.error("Login error:", error); // Debugging
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile data",
      data: userData,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { name, mobile } = req.body;
    const data = {
      name,
      mobile,
    };

    const user_id = req.user._id;

    if (req.file !== undefined) {
      data.image = "images/" + req.file.filename;

      const oldUser = await User.findOne({ _id: user_id });

      const oldFilePath = path.join(__dirname, "../public/", oldUser.image);

      await deleteFile(oldFilePath);
    }

    const userData = await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: data,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  userRegister,
  mailVerification,
  sendMailVerification,
  forgetPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
  loginUser,
  userProfile,
  updateProfile,
};
