package com.mano.iacc.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "revenue_properties")
public class RevenueProperty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String propertyId;
    private String owner;
    private String type; // Residential, Commercial, Agricultural, Industrial
    private Long taxAmount;
    private String status; // Paid, Pending, Overdue
    private String zone;
    private String address;
    private String assessedYear;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Long taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAssessedYear() {
        return assessedYear;
    }

    public void setAssessedYear(String assessedYear) {
        this.assessedYear = assessedYear;
    }
}
