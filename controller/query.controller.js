import Query from "../model/query.model.js";

const createQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newQuery = new Query({ name, email, subject, message });
    const savedQuery = await newQuery.save();
    res.status(201).send(savedQuery);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllQueries = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queries = await Query.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalQueries = await Query.countDocuments();
    const totalPages = Math.ceil(totalQueries / limit);

    res
      .status(200)
      .send({ queries, totalPages, currentPage: page, totalQueries });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateQueryStatus = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status } = req.body;
    const query = await Query.findByIdAndUpdate(
      queryId,
      { status },
      { new: true }
    );
    res.status(200).send(query);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    await Query.findByIdAndDelete(queryId);
    res.status(200).send({ message: "Query deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export default {
  createQuery,
  getAllQueries,
  updateQueryStatus,
  deleteQuery,
};