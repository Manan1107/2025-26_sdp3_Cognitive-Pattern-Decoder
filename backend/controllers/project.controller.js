const Project = require("../models/Project.model");

exports.createProject = async (req, res) => {
  try {
    const { name, type, userId } = req.body;

    const project = new Project({
      name,
      type,
      userId
    });

    await project.save();

    res.status(201).json({
      message: "Project created",
      project
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({ userId });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};
