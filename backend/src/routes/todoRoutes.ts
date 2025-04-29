import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUserIdFromToken } from '../utils/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all todos for a user
router.get('/', async (_req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: 1 }, // This will be replaced with actual user ID from JWT
    });
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, privateNote } = req.body;
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        privateNote, // This will be encrypted later
        userId: 1, // This will be replaced with actual user ID from JWT
      },
    });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed, privateNote } = req.body;
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        completed,
        privateNote,
      },
    });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete todo' });
  }
});

// Get a specific todo
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Check if the todo belongs to the user
    if (todo.userId !== userId) {
      return res.status(400).json({ error: 'Access denied', privateNote: undefined });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch todo' });
  }
});

export default router; 