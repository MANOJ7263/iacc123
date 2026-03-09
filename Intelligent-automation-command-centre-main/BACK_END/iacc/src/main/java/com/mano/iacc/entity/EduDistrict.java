package com.mano.iacc.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "edu_districts")
public class EduDistrict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer totalZones;
    private Integer totalSchools;
    private Integer totalStudents;
    private Integer totalTeachers;
    private String literacy;
    private String year;
    private String state;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTotalZones() {
        return totalZones;
    }

    public void setTotalZones(Integer totalZones) {
        this.totalZones = totalZones;
    }

    public Integer getTotalSchools() {
        return totalSchools;
    }

    public void setTotalSchools(Integer totalSchools) {
        this.totalSchools = totalSchools;
    }

    public Integer getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Integer getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(Integer totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public String getLiteracy() {
        return literacy;
    }

    public void setLiteracy(String literacy) {
        this.literacy = literacy;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
