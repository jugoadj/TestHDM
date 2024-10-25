import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import SaveTaskUseCase from '../UseCase/SaveTask/SaveTaskUseCase';
import DeleteTask from '../UseCase/DeleteTask/DeleteTask';
import GetAllTasksUseCase from '../UseCase/GetAllTasks/GetAllTasksUseCase';
import SaveTaskDto from '../UseCase/SaveTask/SaveTaskDto';
import UseCaseFactory from '../UseCase/UseCaseFactory';

@Controller()
export default class TaskController {
  constructor(private readonly useCaseFactory: UseCaseFactory) {}

  @Get('/tasks')
  async getAll() {
    return (await this.useCaseFactory.create(GetAllTasksUseCase)).handle();
  }

  @Post('/tasks')
  async create(@Body() dto: SaveTaskDto) {
    const saveTaskUseCase = await this.useCaseFactory.create(SaveTaskUseCase);
    const task = await saveTaskUseCase.handle(dto);
    return {
      message: 'Task created successfully',
      task,
    };
  }
 


  @Patch('/tasks/:id')
  async update(@Param('id') id: string, @Body() dto: SaveTaskDto) {
    // Créer une instance du SaveTaskUseCase
    const saveTaskUseCase = await this.useCaseFactory.create(SaveTaskUseCase);
    
    // Ajoutez l'ID au DTO
    const taskToUpdate = { ...dto, id: Number(id) };
    
    // Appeler la méthode handle pour mettre à jour la tâche
    const updatedTask = await saveTaskUseCase.handle(taskToUpdate);
    
    return {
      message: 'Task updated successfully',
      task: updatedTask,
    };
  }
  


  @Delete('/tasks/:id')
  async delete(@Param('id') id: string) {
    return (await this.useCaseFactory.create(DeleteTask)).handle(Number(id));
  }
}
