import { Injectable, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';
import { Task } from '@prisma/client';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    if (!dto.name) {
      throw new BadRequestException('Task name is required.');
    }

    try {
      if (dto.id) {
        return await this.taskRepository.save(dto); 
      }

      const task = await this.taskRepository.save({ name: dto.name });
      return task;
    } catch (error) {
      throw new BadRequestException('Failed to save task: ' + error.message);
    }
  }
}
