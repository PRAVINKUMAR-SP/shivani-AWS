package com.shivanitech.jobportal.service;

import org.springframework.stereotype.Service;

@Service
public class SystemStateService {
    private boolean maintenanceMode = false;

    public boolean isMaintenanceMode() {
        return maintenanceMode;
    }

    public void setMaintenanceMode(boolean maintenanceMode) {
        this.maintenanceMode = maintenanceMode;
    }
}
