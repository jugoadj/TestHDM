import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async save(data: Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>): Promise<Task> {
    // Création d'une nouvelle tâche si aucun id n'est fourni
    if (!data.id) {
      return this.prisma.task.create({
        data,
      });
    } else {
      // Si un id est fourni, il pourrait s'agir d'une mise à jour
      return this.prisma.task.update({
        where: { id: data.id },
        data,
      });
    }
  }
}
