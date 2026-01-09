const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      passwordHash: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User registered",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
