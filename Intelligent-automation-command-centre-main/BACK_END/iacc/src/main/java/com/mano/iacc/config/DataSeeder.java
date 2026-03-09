package com.mano.iacc.config;

import com.mano.iacc.entity.*;
import com.mano.iacc.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds all department mock data into MySQL on first startup.
 * Safe to run multiple times — checks if data already exists before inserting.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    EduDistrictRepository eduDistrictRepo;
    @Autowired
    EduHeadmasterRepository eduHeadmasterRepo;
    @Autowired
    EduTeacherRepository eduTeacherRepo;
    @Autowired
    EduStudentRepository eduStudentRepo;
    @Autowired
    HealthPatientRepository healthPatientRepo;
    @Autowired
    HealthDoctorRepository healthDoctorRepo;
    @Autowired
    TransportFleetRepository transportFleetRepo;
    @Autowired
    RevenuePropertyRepository revenuePropertyRepo;
    @Autowired
    FinanceTransactionRepository financeTransactionRepo;

    @Override
    public void run(String... args) {
        log.info("=== IACC DataSeeder starting ===");
        seedEducation();
        seedHealth();
        seedTransport();
        seedRevenue();
        seedFinance();
        log.info("=== IACC DataSeeder complete ===");
    }

    // ─── EDUCATION ────────────────────────────────────────────────────────────
    private void seedEducation() {
        if (eduDistrictRepo.count() == 0) {
            EduDistrict d = new EduDistrict();
            d.setTotalZones(5);
            d.setTotalSchools(1845);
            d.setTotalStudents(412500);
            d.setTotalTeachers(14230);
            d.setLiteracy("84.5%");
            d.setYear("2025-26");
            d.setState("Tamil Nadu");
            eduDistrictRepo.save(d);
            log.info("Seeded education district");
        }

        if (eduHeadmasterRepo.count() == 0) {
            List<Object[]> hms = Arrays.asList(
                    new Object[] { "HM001", "Anbu C.", "Govt Boys Hr Sec School, Namakkal", "Z1", "+91 94421-11001",
                            "hm001@tn.school.in", 22 },
                    new Object[] { "HM002", "Selvi M.", "Govt Girls Hr Sec School, Namakkal", "Z1", "+91 94421-11002",
                            "hm002@tn.school.in", 18 },
                    new Object[] { "HM003", "Raja K.", "Municipal High School, Fort", "Z1", "+91 94421-11003",
                            "hm003@tn.school.in", 15 },
                    new Object[] { "HM004", "Geetha R.", "Panchayat Union Middle School", "Z1", "+91 94421-11004",
                            "hm004@tn.school.in", 12 },
                    new Object[] { "HM005", "Dinesh V.", "Govt Hr Sec School, Tiruchengode", "Z2", "+91 94421-11005",
                            "hm005@tn.school.in", 20 },
                    new Object[] { "HM006", "Meena S.", "Govt Girls High School, Tiruchengode", "Z2", "+91 94421-11006",
                            "hm006@tn.school.in", 16 },
                    new Object[] { "HM007", "Kumar P.", "Govt Hr Sec School, Rasipuram", "Z3", "+91 94421-11007",
                            "hm007@tn.school.in", 19 });
            for (Object[] row : hms) {
                EduHeadmaster h = new EduHeadmaster();
                h.setHmId((String) row[0]);
                h.setName((String) row[1]);
                h.setSchool((String) row[2]);
                h.setZoneId((String) row[3]);
                h.setPhone((String) row[4]);
                h.setEmail((String) row[5]);
                h.setExperience((Integer) row[6]);
                eduHeadmasterRepo.save(h);
            }
            log.info("Seeded {} headmasters", hms.size());
        }

        if (eduTeacherRepo.count() == 0) {
            String school = "Govt Boys Hr Sec School, Namakkal";
            List<Object[]> teachers = Arrays.asList(
                    new Object[] { "T-001", "Selvaraj K.", "Tamil", "PG Teacher", "M.A., B.Ed", 18, "6A,6B,7A",
                            "active" },
                    new Object[] { "T-002", "Usha Rani M.", "English", "BT Asst", "B.A., B.Ed", 9, "6A,6B", "active" },
                    new Object[] { "T-003", "Murugan S.", "Mathematics", "PG Teacher", "M.Sc., B.Ed", 22, "9A,9B,10A",
                            "active" },
                    new Object[] { "T-004", "Kavitha P.", "Science", "BT Asst", "B.Sc., B.Ed", 14, "8A,8B",
                            "on-leave" },
                    new Object[] { "T-005", "Anbu Raj C.", "Social Science", "BT Asst", "B.A., B.Ed", 11, "7A,7B,8A",
                            "active" },
                    new Object[] { "T-006", "Vasantha Devi R.", "Tamil", "PG Teacher", "M.A., B.Ed", 24, "8A,9A,10A",
                            "active" },
                    new Object[] { "T-007", "Ramesh Kumar G.", "Mathematics", "PG Teacher", "M.Sc., B.Ed", 17,
                            "11A,12A", "active" },
                    new Object[] { "T-008", "Shanthi T.", "Biology", "PG Teacher", "M.Sc., B.Ed", 13, "11B,12B",
                            "active" },
                    new Object[] { "T-009", "Krishnan B.", "Physics", "PG Teacher", "M.Sc., B.Ed", 19, "11A,12A",
                            "active" },
                    new Object[] { "T-010", "Geetha R.", "Chemistry", "PG Teacher", "M.Sc., B.Ed", 15,
                            "11A,11B,12A,12B", "on-leave" },
                    new Object[] { "T-011", "Indira P.", "English", "BT Asst", "B.A., B.Ed", 8, "9A,9B,10B", "active" },
                    new Object[] { "T-012", "Rajendran S.", "Computer Science", "BT Asst", "B.Sc., B.Ed", 6,
                            "9A,10A,11A", "active" },
                    new Object[] { "T-013", "Meena D.", "Mathematics", "BT Asst", "B.Sc., B.Ed", 12, "6A,7A,8A",
                            "active" },
                    new Object[] { "T-014", "Senthil V.", "Social Science", "BT Asst", "B.A., B.Ed", 10, "9B,10B",
                            "active" },
                    new Object[] { "T-015", "Padma K.", "Science", "BT Asst", "B.Sc., B.Ed", 7, "6A,6B,7B", "active" },
                    new Object[] { "T-016", "Arjun M.", "Tamil", "BT Asst", "B.A., B.Ed", 5, "10A,10B,11A", "active" },
                    new Object[] { "T-017", "Lakshmi N.", "English", "PG Teacher", "M.A., B.Ed", 20, "11B,12B",
                            "active" },
                    new Object[] { "T-018", "Bala S.", "Mathematics", "BT Asst", "B.Sc., B.Ed", 3, "6B,7B",
                            "on-leave" },
                    new Object[] { "T-019", "Vijayalakshmi C.", "Physics", "PG Teacher", "M.Sc., B.Ed", 16, "11B,12B",
                            "active" },
                    new Object[] { "T-020", "Sundaram R.", "Social Science", "BT Asst", "B.A., B.Ed", 9, "6A,6B,8B",
                            "active" },
                    new Object[] { "T-021", "Dhanalakshmi A.", "Science", "BT Asst", "B.Sc., B.Ed", 11, "8A,9A",
                            "active" },
                    new Object[] { "T-022", "Prakash J.", "Mathematics", "PG Teacher", "M.Sc., B.Ed", 25, "10A,10B,12A",
                            "active" },
                    new Object[] { "T-023", "Hemalatha O.", "Tamil", "BT Asst", "B.A., B.Ed", 4, "7B,8B", "active" },
                    new Object[] { "T-024", "Natarajan P.", "Computer Science", "BT Asst", "B.Sc., B.Ed", 4,
                            "10B,11B,12B", "active" },
                    new Object[] { "T-025", "Saranya E.", "English", "BT Asst", "B.A., B.Ed", 3, "7A,7B", "active" },
                    new Object[] { "T-026", "Mohan K.", "Social Science", "BT Asst", "B.A., B.Ed", 8, "10A,11A",
                            "on-leave" },
                    new Object[] { "T-027", "Suresh B.", "Mathematics", "BT Asst", "B.Sc., B.Ed", 7, "9A,11B",
                            "active" },
                    new Object[] { "T-028", "Radha V.", "Science", "BT Asst", "B.Sc., B.Ed", 6, "7A,8B", "active" },
                    new Object[] { "T-029", "Arunachalam S.", "Chemistry", "PG Teacher", "M.Sc., B.Ed", 18, "11A,12A",
                            "active" },
                    new Object[] { "T-030", "Kamala D.", "Biology", "BT Asst", "B.Sc., B.Ed", 10, "9B,10B", "active" },
                    new Object[] { "T-031", "Manikandan R.", "Tamil", "BT Asst", "B.A., B.Ed", 2, "6B,7A", "active" },
                    new Object[] { "T-032", "Vimala T.", "English", "BT Asst", "B.A., B.Ed", 14, "8A,9B", "active" },
                    new Object[] { "T-033", "Govindasamy P.", "Social Science", "PG Teacher", "M.A., B.Ed", 21,
                            "11B,12B", "active" },
                    new Object[] { "T-034", "Uma Maheswari L.", "Science", "PG Teacher", "M.Sc., B.Ed", 15, "10A,11A",
                            "active" },
                    new Object[] { "T-035", "Kannan T.", "Computer Science", "BT Asst", "B.Sc., B.Ed", 5, "6A,7B,8B",
                            "on-leave" },
                    new Object[] { "T-036", "Saraswathi M.", "Mathematics", "PG Teacher", "M.Sc., B.Ed", 23, "12A,12B",
                            "active" },
                    new Object[] { "T-037", "Balaji C.", "Physics", "PG Teacher", "M.Sc., B.Ed", 12, "12A,12B",
                            "active" },
                    new Object[] { "T-038", "Devi P.", "Tamil", "BT Asst", "B.A., B.Ed", 9, "12A,12B", "active" },
                    new Object[] { "T-039", "Rajeswari N.", "Biology", "PG Teacher", "M.Sc., B.Ed", 17, "12B",
                            "active" },
                    new Object[] { "T-040", "Karthikeyan A.", "Social Science", "BT Asst", "B.A., B.Ed", 6, "6B,8A",
                            "active" });
            for (Object[] row : teachers) {
                EduTeacher t = new EduTeacher();
                t.setStaffId((String) row[0]);
                t.setName((String) row[1]);
                t.setSubject((String) row[2]);
                t.setDesignation((String) row[3]);
                t.setQualification((String) row[4]);
                t.setExperience((Integer) row[5]);
                t.setClasses((String) row[6]);
                t.setStatus((String) row[7]);
                t.setSchoolName(school);
                eduTeacherRepo.save(t);
            }
            log.info("Seeded {} teachers", teachers.size());
        }

        if (eduStudentRepo.count() == 0) {
            String[] maleNames = { "Aarav", "Arjun", "Karthik", "Selvam", "Dinesh", "Murugan", "Senthil", "Vijay",
                    "Raman", "Bala", "Kumar", "Surya", "Vasanth", "Gopal", "Harish", "Lokesh", "Naveen", "Prabhu",
                    "Rajesh", "Suresh" };
            String[] femaleNames = { "Aishwarya", "Bhavani", "Chitra", "Devi", "Eswari", "Fathima", "Geetha", "Hema",
                    "Indira", "Janaki", "Kavitha", "Lakshmi", "Meena", "Nithya", "Oviya", "Padma", "Radha", "Saranya",
                    "Tamilarasi", "Uma" };
            String[] surnames = { "Kumar", "Murugan", "Selvam", "Rajan", "Devi", "Pillai", "Nadar", "Gounder", "Iyer",
                    "Pandian" };
            int[][] classes = { { 6, 14 }, { 6, 14 }, { 7, 14 }, { 7, 14 }, { 8, 14 }, { 8, 14 }, { 9, 14 }, { 9, 14 },
                    { 10, 14 }, { 10, 14 }, { 11, 14 }, { 11, 14 }, { 12, 14 }, { 12, 14 } };
            String[] sections = { "A", "B", "A", "B", "A", "B", "A", "B", "A", "B", "A", "B", "A", "B" };
            int[] boyCounts = { 28, 25, 30, 27, 32, 29, 35, 33, 36, 34, 38, 20, 40, 22 };
            String school = "Govt Boys Hr Sec School, Namakkal";

            int studentCount = 0;
            for (int c = 0; c < classes.length; c++) {
                int grade = classes[c][0];
                String section = sections[c];
                int boys = boyCounts[c];
                int strength = 50;
                for (int i = 0; i < strength; i++) {
                    int seed = grade * 1000 + section.charAt(0) * 100 + i;
                    boolean isMale = i < boys;
                    String[] nameArr = isMale ? maleNames : femaleNames;
                    String fn = nameArr[Math.abs(seed) % nameArr.length];
                    String ln = surnames[Math.abs(seed + 7) % surnames.length];
                    EduStudent s = new EduStudent();
                    s.setRollNo(grade + section + "-" + String.format("%02d", i + 1));
                    s.setName(fn + " " + ln);
                    s.setGrade(grade);
                    s.setSection(section);
                    s.setGender(isMale ? "Male" : "Female");
                    s.setAttendance(65 + Math.abs((seed + 1) * 31) % 36);
                    s.setTamil(30 + Math.abs((seed + 2) * 37) % 71);
                    s.setEnglish(30 + Math.abs((seed + 3) * 41) % 71);
                    s.setMaths(25 + Math.abs((seed + 4) * 43) % 76);
                    s.setScience(30 + Math.abs((seed + 5) * 47) % 71);
                    s.setSocial(35 + Math.abs((seed + 6) * 53) % 66);
                    s.setSchoolName(school);
                    eduStudentRepo.save(s);
                    studentCount++;
                }
            }
            log.info("Seeded {} students", studentCount);
        }
    }

    // ─── HEALTH ───────────────────────────────────────────────────────────────
    private void seedHealth() {
        if (healthPatientRepo.count() == 0) {
            List<Object[]> patients = Arrays.asList(
                    new Object[] { "P-6615", "Varun Singh", 75, "F", "South Regional Clinic", "92", "135/72",
                            "Under Observation" },
                    new Object[] { "P-8291", "Priya Sinha", 6, "F", "District General Hospital", "87", "147/74",
                            "Critical" },
                    new Object[] { "P-2297", "Manish Verma", 61, "F", "City Maternity Center", "94", "115/87",
                            "Under Observation" },
                    new Object[] { "P-2649", "Ravi Roy", 47, "F", "District General Hospital", "93", "155/95",
                            "Critical" },
                    new Object[] { "P-9801", "Manish Shah", 27, "M", "City Maternity Center", "97", "108/61",
                            "Stable" },
                    new Object[] { "P-9569", "Kiran Agarwal", 27, "M", "City Maternity Center", "88", "160/89",
                            "Critical" },
                    new Object[] { "P-9134", "Gaurav Sharma", 45, "F", "South Regional Clinic", "97", "125/70",
                            "Stable" },
                    new Object[] { "P-3779", "Sameer Sinha", 43, "M", "District General Hospital", "94", "133/75",
                            "Stable" },
                    new Object[] { "P-1963", "Amit Khan", 7, "F", "City Maternity Center", "95", "102/68", "Critical" },
                    new Object[] { "P-2176", "Varun Roy", 73, "M", "District General Hospital", "86", "126/94",
                            "Critical" },
                    new Object[] { "P-7071", "Krishna Joshi", 39, "F", "South Regional Clinic", "96", "143/95",
                            "Critical" },
                    new Object[] { "P-1482", "Sameer Dixit", 52, "M", "District General Hospital", "92", "121/80",
                            "Under Observation" },
                    new Object[] { "P-7150", "Ashwin Mukherjee", 49, "F", "District General Hospital", "96", "160/74",
                            "Critical" },
                    new Object[] { "P-7278", "Hari Kumar", 67, "M", "District General Hospital", "95", "124/72",
                            "Critical" },
                    new Object[] { "P-3184", "Bhavya Garg", 82, "F", "District General Hospital", "91", "142/65",
                            "Critical" },
                    new Object[] { "P-8681", "Sneha Sen", 68, "M", "South Regional Clinic", "89", "159/70",
                            "Critical" },
                    new Object[] { "P-3965", "Arjun Verma", 71, "F", "District General Hospital", "95", "145/60",
                            "Critical" },
                    new Object[] { "P-7700", "Ashwin Chopra", 55, "M", "South Regional Clinic", "94", "103/90",
                            "Stable" },
                    new Object[] { "P-1485", "Lakshmi Sharma", 64, "F", "District General Hospital", "97", "154/91",
                            "Critical" },
                    new Object[] { "P-1709", "Anjali Srivastava", 40, "M", "City Maternity Center", "94", "156/75",
                            "Critical" },
                    new Object[] { "P-7045", "Neha Shah", 52, "F", "City Maternity Center", "93", "120/100", "Stable" },
                    new Object[] { "P-3329", "Priya Kapoor", 32, "M", "District General Hospital", "91", "150/100",
                            "Critical" },
                    new Object[] { "P-7322", "Maya Sharma", 46, "M", "City Maternity Center", "93", "120/96",
                            "Critical" },
                    new Object[] { "P-9378", "Zoya Dubey", 76, "F", "City Maternity Center", "85", "127/85",
                            "Critical" },
                    new Object[] { "P-5057", "Amit Kumar", 77, "M", "City Maternity Center", "96", "156/79",
                            "Critical" },
                    new Object[] { "P-6518", "Arjun Mukherjee", 46, "M", "South Regional Clinic", "92", "153/79",
                            "Critical" },
                    new Object[] { "P-6835", "Anjali Mukherjee", 41, "M", "South Regional Clinic", "89", "138/100",
                            "Critical" },
                    new Object[] { "P-7362", "Gita Khan", 36, "F", "City Maternity Center", "88", "160/71",
                            "Critical" },
                    new Object[] { "P-6160", "Seema Sahu", 69, "F", "District General Hospital", "94", "127/75",
                            "Under Observation" },
                    new Object[] { "P-1634", "Rani Yadav", 72, "M", "City Maternity Center", "100", "114/67",
                            "Stable" });
            for (Object[] row : patients) {
                HealthPatient p = new HealthPatient();
                p.setPatientId((String) row[0]);
                p.setName((String) row[1]);
                p.setAge((Integer) row[2]);
                p.setGender((String) row[3]);
                p.setHospital((String) row[4]);
                p.setOxygenLevel((String) row[5]);
                p.setBloodPressure((String) row[6]);
                p.setStatus((String) row[7]);
                healthPatientRepo.save(p);
            }
            log.info("Seeded {} patients", patients.size());
        }

        if (healthDoctorRepo.count() == 0) {
            List<Object[]> doctors = Arrays.asList(
                    new Object[] { "D-001", "Dr. Gita Verma", "MD Gastroenterology", "Gastroenterology",
                            "District General Hospital", 9, "On-Duty" },
                    new Object[] { "D-002", "Dr. Gita Roy", "MD Gynecology", "Gynecology", "City Maternity Center", 18,
                            "On-Duty" },
                    new Object[] { "D-003", "Dr. Tarun Malhotra", "MD Gynecology", "Gynecology",
                            "City Maternity Center", 14, "Available" },
                    new Object[] { "D-004", "Dr. Aditi Agarwal", "MD Psychiatry", "Psychiatry", "South Regional Clinic",
                            20, "Available" },
                    new Object[] { "D-005", "Dr. Kavya Joshi", "MD Neurology", "Neurology", "City Maternity Center", 23,
                            "Available" },
                    new Object[] { "D-006", "Dr. Jay Khan", "MD Gynecology", "Gynecology", "City Maternity Center", 15,
                            "On-Duty" },
                    new Object[] { "D-007", "Dr. Aarav Mehta", "MD Anesthesiology", "Anesthesiology",
                            "District General Hospital", 24, "Available" },
                    new Object[] { "D-008", "Dr. Vikram Kaur", "MD ENT", "ENT", "District General Hospital", 4,
                            "Unavailable" },
                    new Object[] { "D-009", "Dr. Bhavya Kumar", "MD Pediatrics", "Pediatrics",
                            "District General Hospital", 16, "Unavailable" },
                    new Object[] { "D-010", "Dr. Sneha Mishra", "MD Gynecology", "Gynecology",
                            "District General Hospital", 21, "On-Duty" },
                    new Object[] { "D-011", "Dr. Sameer Pandey", "MD Ophthalmology", "Ophthalmology",
                            "South Regional Clinic", 11, "Unavailable" },
                    new Object[] { "D-012", "Dr. Rahul Sharma", "MD Anesthesiology", "Anesthesiology",
                            "District General Hospital", 15, "Available" },
                    new Object[] { "D-013", "Dr. Kavya Sen", "MD Pediatrics", "Pediatrics", "District General Hospital",
                            22, "Available" },
                    new Object[] { "D-014", "Dr. Shiv Sahu", "MD Urology", "Urology", "South Regional Clinic", 22,
                            "Available" },
                    new Object[] { "D-015", "Dr. Naveen Roy", "MD ENT", "ENT", "South Regional Clinic", 11, "On-Duty" },
                    new Object[] { "D-016", "Dr. Sakshi Garg", "MD Pediatrics", "Pediatrics",
                            "District General Hospital", 4, "On-Duty" },
                    new Object[] { "D-017", "Dr. Deepa Mahajan", "MD Psychiatry", "Psychiatry", "City Maternity Center",
                            19, "Unavailable" },
                    new Object[] { "D-018", "Dr. Sameer Jha", "MD Psychiatry", "Psychiatry", "City Maternity Center",
                            19, "On-Duty" },
                    new Object[] { "D-019", "Dr. Zoya Rao", "MD Dermatology", "Dermatology", "South Regional Clinic", 5,
                            "On-Duty" },
                    new Object[] { "D-020", "Dr. Uma Sharma", "MD Psychiatry", "Psychiatry", "City Maternity Center",
                            17, "Unavailable" });
            for (Object[] row : doctors) {
                HealthDoctor d = new HealthDoctor();
                d.setDoctorId((String) row[0]);
                d.setName((String) row[1]);
                d.setQualification((String) row[2]);
                d.setDepartment((String) row[3]);
                d.setHospital((String) row[4]);
                d.setExperience((Integer) row[5]);
                d.setStatus((String) row[6]);
                healthDoctorRepo.save(d);
            }
            log.info("Seeded {} doctors", doctors.size());
        }
    }

    // ─── TRANSPORT ────────────────────────────────────────────────────────────
    private void seedTransport() {
        if (transportFleetRepo.count() == 0) {
            List<Object[]> fleet = Arrays.asList(
                    new Object[] { "TN-33 A 1001", "Bus", "Namakkal–Salem Route", 54, "Active", "Rajan K.",
                            "Namakkal Town", 145200, "2025-11-10" },
                    new Object[] { "TN-33 A 1002", "Bus", "Namakkal–Erode Route", 54, "Active", "Murugan S.",
                            "Namakkal Town", 98400, "2025-12-01" },
                    new Object[] { "TN-33 A 1003", "Minibus", "Tiruchengode Local", 30, "Maintenance", "Selvam P.",
                            "Tiruchengode", 220000, "2025-08-15" },
                    new Object[] { "TN-33 A 1004", "Bus", "Rasipuram–Namakkal", 54, "Active", "Kumar T.", "Rasipuram",
                            167000, "2025-10-22" },
                    new Object[] { "TN-33 A 1005", "Bus", "Kolli Hills Shuttle", 42, "Out of Service", "Babu R.",
                            "Kolli Hills", 312000, "2024-06-30" },
                    new Object[] { "TN-22 D 1860", "Minibus", "Central Loop", 57, "Active", "Suresh J.",
                            "Namakkal Town", 88000, "2026-01-12" },
                    new Object[] { "TN-33 B 2201", "Bus", "Paramathi–Namakkal", 54, "Active", "Arumugam M.",
                            "Paramathi Velur", 134500, "2025-09-18" },
                    new Object[] { "TN-33 B 2202", "Truck", "Goods – Namakkal North", null, "Active", "Soundarajan V.",
                            "Namakkal Town", 201000, "2025-07-05" },
                    new Object[] { "TN-33 B 2203", "Bus", "Tiruchengode–Erode", 54, "Out of Service", "Perumal C.",
                            "Tiruchengode", 445000, "2024-03-20" },
                    new Object[] { "TN-33 B 2204", "Minibus", "School Shuttle – Zone 2", 35, "Active", "Natarajan E.",
                            "Tiruchengode", 55000, "2025-12-20" },
                    new Object[] { "TN-33 C 3301", "Bus", "Rasipuram–Salem", 54, "Active", "Velmurugan A.", "Rasipuram",
                            192000, "2025-11-28" },
                    new Object[] { "TN-33 C 3302", "Bus", "Kolli Hills–Namakkal", 42, "Maintenance", "Ganesan B.",
                            "Kolli Hills", 278000, "2025-07-14" },
                    new Object[] { "TN-33 C 3303", "Minibus", "Paramathi Local", 30, "Active", "Kannan D.",
                            "Paramathi Velur", 63000, "2026-01-05" },
                    new Object[] { "TN-33 C 3304", "Bus", "Namakkal Town Circuit", 54, "Active", "Dharmaraj F.",
                            "Namakkal Town", 112000, "2025-10-30" },
                    new Object[] { "TN-33 D 4401", "Bus", "Night Service–Salem", 54, "Active", "Subramanian G.",
                            "Namakkal Town", 77000, "2026-02-10" });
            for (Object[] row : fleet) {
                TransportFleet f = new TransportFleet();
                f.setPlate((String) row[0]);
                f.setType((String) row[1]);
                f.setPrimaryRoute((String) row[2]);
                f.setCapacity(row[3] == null ? null : (Integer) row[3]);
                f.setStatus((String) row[4]);
                f.setDriver((String) row[5]);
                f.setZone((String) row[6]);
                f.setMileage(row[7] == null ? null : (Integer) row[7]);
                f.setLastService((String) row[8]);
                transportFleetRepo.save(f);
            }
            log.info("Seeded {} fleet vehicles", fleet.size());
        }
    }

    // ─── REVENUE ──────────────────────────────────────────────────────────────
    private void seedRevenue() {
        if (revenuePropertyRepo.count() == 0) {
            String[] types = { "Residential", "Commercial", "Agricultural", "Industrial" };
            String[] statuses = { "Paid", "Pending", "Overdue", "Paid", "Paid", "Pending", "Overdue" };
            String[] zones = { "Namakkal Town", "Tiruchengode", "Rasipuram", "Paramathi Velur", "Kolli Hills" };
            String[] owners = { "Rajan K.", "Meena S.", "Murugan P.", "Kavitha R.", "Anbu C.", "Selvi D.", "Dinesh V.",
                    "Geetha M.", "Kumar T.", "Priya B.",
                    "Divya Kumar", "Sakshi Gupta", "Divya Singh", "Harish Verma", "Lalitha Nair", "Divya Sharma",
                    "Kavya Pillai", "Meera Iyer", "Nandini Rajan", "Priya Gounder" };
            int count = 0;
            for (int i = 1; i <= 30; i++) {
                RevenueProperty p = new RevenueProperty();
                p.setPropertyId("PROP-" + (3000 + i * 17 % 7000));
                p.setOwner(owners[i % owners.length]);
                p.setType(types[i % types.length]);
                p.setTaxAmount(15000L + (i * 7777L) % 285000L);
                p.setStatus(statuses[i % statuses.length]);
                p.setZone(zones[i % zones.length]);
                p.setAddress(i + ", Main Street, " + zones[i % zones.length]);
                p.setAssessedYear("2025-26");
                revenuePropertyRepo.save(p);
                count++;
            }
            log.info("Seeded {} properties", count);
        }
    }

    // ─── FINANCE ──────────────────────────────────────────────────────────────
    private void seedFinance() {
        if (financeTransactionRepo.count() == 0) {
            List<Object[]> txns = Arrays.asList(
                    new Object[] { "TXN-001", "Salary", 4200000L, "EDUCATION", "Completed", "Collector Office",
                            "Teacher salary disbursement – March 2026" },
                    new Object[] { "TXN-002", "Infrastructure", 8500000L, "HEALTH", "Completed", "Finance Dept",
                            "ICU equipment upgrade – District General" },
                    new Object[] { "TXN-003", "Procurement", 1350000L, "TRANSPORT", "Pending", "Dept Head",
                            "Spare parts purchase for fleet maintenance" },
                    new Object[] { "TXN-004", "Welfare", 2800000L, "REVENUE", "Completed", "Collector Office",
                            "Property survey digitization project" },
                    new Object[] { "TXN-005", "Salary", 3600000L, "HEALTH", "Completed", "Finance Dept",
                            "Doctor & nurse salary – February 2026" },
                    new Object[] { "TXN-006", "Infrastructure", 12000000L, "EDUCATION", "Pending", "Collector Office",
                            "New school building – Kolli Hills Zone" },
                    new Object[] { "TXN-007", "Procurement", 950000L, "TRANSPORT", "Completed", "Dept Head",
                            "Fuel procurement Q1 2026" },
                    new Object[] { "TXN-008", "Welfare", 5200000L, "HEALTH", "Rejected", "Finance Dept",
                            "Mobile medical unit deployment" },
                    new Object[] { "TXN-009", "Salary", 2100000L, "TRANSPORT", "Completed", "Collector Office",
                            "Driver & staff salary – February 2026" },
                    new Object[] { "TXN-010", "Infrastructure", 6800000L, "REVENUE", "Pending", "Dept Head",
                            "Land records digitization software" },
                    new Object[] { "TXN-011", "Procurement", 780000L, "EDUCATION", "Completed", "Finance Dept",
                            "Text books & stationery Q1" },
                    new Object[] { "TXN-012", "Welfare", 3400000L, "HEALTH", "Completed", "Collector Office",
                            "Free medicine scheme distribution" },
                    new Object[] { "TXN-013", "Salary", 1800000L, "REVENUE", "Completed", "Finance Dept",
                            "Revenue inspector staff salary" },
                    new Object[] { "TXN-014", "Infrastructure", 9500000L, "TRANSPORT", "Pending", "Collector Office",
                            "New bus depot construction – Tiruchengode" },
                    new Object[] { "TXN-015", "Welfare", 4100000L, "EDUCATION", "Completed", "Dept Head",
                            "Scholarship disbursement – 2025-26" });
            for (Object[] row : txns) {
                FinanceTransaction t = new FinanceTransaction();
                t.setTransactionId((String) row[0]);
                t.setCategory((String) row[1]);
                t.setAmount((Long) row[2]);
                t.setDepartment((String) row[3]);
                t.setStatus((String) row[4]);
                t.setApprovedBy((String) row[5]);
                t.setDescription((String) row[6]);
                t.setTransactionDate(LocalDateTime.now().minusDays(txns.indexOf(row) * 3L));
                financeTransactionRepo.save(t);
            }
            log.info("Seeded {} finance transactions", txns.size());
        }
    }
}
