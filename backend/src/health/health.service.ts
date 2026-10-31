import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async check() {
    const database = await this.getDatabaseStatus();
    const ok = database.connected;

    return {
      status: ok ? 'ok' : 'error',
      message: ok
        ? 'Product Health Intelligence API is running'
        : 'Product Health Intelligence API is running but the database is unavailable',
      database,
    };
  }

  private async getDatabaseStatus(): Promise<{
    connected: boolean;
    status: string;
  }> {
    try {
      if (
        this.connection.readyState !== ConnectionStates.connected ||
        !this.connection.db
      ) {
        return { connected: false, status: 'disconnected' };
      }

      await this.connection.db.admin().ping();
      return { connected: true, status: 'connected' };
    } catch {
      return { connected: false, status: 'error' };
    }
  }
}
