import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class MaintenanceHealthIndicator extends HealthIndicator {
  private maintenanceMode: boolean;

  async isMaintenanceModeActivated(
    key: string,
  ): Promise<HealthIndicatorResult> {
    const maintenanceMode = false;

    if (!maintenanceMode) {
      return this.getStatus(key, true);
    }

    throw new HealthCheckError(
      'Maintenance Mode On',
      this.getStatus(key, false),
    );
  }
}
