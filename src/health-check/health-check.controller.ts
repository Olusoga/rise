import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { MaintenanceHealthIndicator } from './maintenance.health';

@Controller('health')
export class HealthCheckController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private maintenanceCheck: MaintenanceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkHealth() {
    return this.healthCheckService.check([
      () => this.http.pingCheck('Basic Check', `${process.env.SERVER_HOST}`),
      () => this.db.pingCheck('TypeORM Check'),
      () =>
        this.maintenanceCheck.isMaintenanceModeActivated('maintenanceCheck'),
    ]);
  }
}
