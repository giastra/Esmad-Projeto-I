const Task = require('../Models/TasksModel');


// GET /api/tasks
exports.getMinhasTarefas = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tarefas = await Task.find(filter)
      .populate('category')
      .sort({ startDate: 1 });

    res.json({ success: true, data: tarefas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/tasks/:id
exports.getTarefaById = async (req, res) => {
  try {
    const tarefa = await Task.findOne({ _id: req.params.id, user: req.user._id })
      .populate('category');

    if (!tarefa)
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada.' });

    res.json({ success: true, data: tarefa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/tasks
exports.criar = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, priority, category } = req.body;

    const tarefa = await Task.create({
      name,
      description,
      startDate,
      endDate,
      status,
      priority,
      category,
      user: req.user._id
    });

    res.status(201).json({ success: true, data: tarefa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// PUT /api/tasks/:id
exports.atualizar = async (req, res) => {
  try {
    const tarefa = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!tarefa)
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada.' });

    const campos = ['name', 'description', 'startDate', 'endDate', 'status', 'priority', 'category'];
    campos.forEach(c => { if (req.body[c] !== undefined) tarefa[c] = req.body[c]; });

    await tarefa.save();
    res.json({ success: true, data: tarefa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/tasks/:id
exports.apagar = async (req, res) => {
  try {
    const tarefa = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!tarefa)
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada.' });

    res.json({ success: true, message: 'Tarefa eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};