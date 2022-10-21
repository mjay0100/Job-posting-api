const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const job = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: job.length, job });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  const job = await Job.findById({ _id: id, createdBy: userId });
  if (!job) {
    throw new NotFoundError("No job found");
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("Company and position canno be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: id, createdBy: userId });
  if (!job) {
    throw new NotFoundError("No job found");
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
