import {
  Check,
  Delete,
  Edit,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [editableTaskId, setEditableTaskId] = useState<number | null>(null);
  const [editableTaskName, setEditableTaskName] = useState<string>('');
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
    if (confirmDelete) {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks();
    }
  };

  const handleSave = async () => {
    if (!newTaskName) {
      alert("Le nom de la tâche ne peut pas être vide !");
      return;
    }

    await api.post('/tasks', { name: newTaskName });
    handleFetchTasks();
    setNewTaskName(""); // Réinitialiser le champ de saisie
  };

  const handleEdit = (task: Task) => {
    setEditableTaskId(task.id);
    setEditableTaskName(task.name);
  };

  const handleUpdate = async () => {
    if (editableTaskName && editableTaskId) {
      const currentTask = tasks.find(task => task.id === editableTaskId);

      if (currentTask && editableTaskName !== currentTask.name) {
        await api.patch(`/tasks/${editableTaskId}`, { name: editableTaskName });
      }
      setEditableTaskId(null); 
      setEditableTaskName(''); 
      handleFetchTasks();
    }
  };

  const toggleCompleteTask = (id: number) => {
    const updatedCompletedTasks = new Set(completedTasks);
    if (completedTasks.has(id)) {
      updatedCompletedTasks.delete(id);
    } else {
      updatedCompletedTasks.add(id);
    }
    setCompletedTasks(updatedCompletedTasks);
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={5}
        p={2}
        sx={{
          backgroundColor: '#063865',
          color: '#01B0BD',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <img src="../../public/assets/images/hdm.png" alt="Logo" style={{ width: '60px', height: '40px' }} />
          <Typography variant="h4" fontWeight="bold">
            HDM Todo List
          </Typography>
        </Box>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.map((task) => (
          <Box
            key={task.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
            gap={1}
            width="100%"
          >
            <Checkbox
              checked={completedTasks.has(task.id)}
              onChange={() => toggleCompleteTask(task.id)}
              color="primary"
            />
            <TextField
              size="small"
              value={editableTaskId === task.id ? editableTaskName : task.name}
              onChange={(e) => editableTaskId === task.id && setEditableTaskName(e.target.value)}
              fullWidth
              sx={{ maxWidth: 350, textDecoration: completedTasks.has(task.id) ? 'line-through' : 'none' }}
              disabled={editableTaskId !== task.id}
            />
            <Box>
              {editableTaskId === task.id ? (
                <IconButton color="success" onClick={handleUpdate}>
                  <Check />
                </IconButton>
              ) : (
                <IconButton color="info" onClick={() => handleEdit(task)}>
                  <Edit />
                </IconButton>
              )}
              <IconButton color="error" onClick={() => handleDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
          <TextField
            size="small"
            placeholder="Nom de la nouvelle tâche"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            sx={{ maxWidth: 350 }}
            fullWidth
          />
          <Button variant="outlined" onClick={handleSave} disabled={newTaskName.trim() === ''}>
            Ajouter une tâche
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
