package com.mano.iacc.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "transport_fleet")
public class TransportFleet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String plate;
    private String type; // Bus, Minibus, Truck
    private String primaryRoute;
    private Integer capacity;
    private String status; // Active, Out of Service, Maintenance
    private String driver;
    private String zone;
    private Integer mileage;
    private String lastService;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPrimaryRoute() {
        return primaryRoute;
    }

    public void setPrimaryRoute(String primaryRoute) {
        this.primaryRoute = primaryRoute;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public String getLastService() {
        return lastService;
    }

    public void setLastService(String lastService) {
        this.lastService = lastService;
    }
}
