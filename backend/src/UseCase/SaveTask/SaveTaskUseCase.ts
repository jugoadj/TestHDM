import { Injectable, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';
import { Task } from '@prisma/client';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    // Validation DTO
    if (!dto.name) {
      throw new BadRequestException('Task name is required.');
    }

    try {
      // Si l'ID est présent dans le DTO, on fait une mise à jour
      if (dto.id) {
        return await this.taskRepository.save(dto); // Cette méthode doit gérer la mise à jour
      }

      // Sinon, on crée une nouvelle tâche
      const task = await this.taskRepository.save({ name: dto.name });
      return task;
    } catch (error) {
      // Gestion des erreurs
      throw new BadRequestException('Failed to save task: ' + error.message);
    }
  }
}
