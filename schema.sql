-- ==========================================
-- TeamSync 跨堂分組共時排程引擎
-- 資料庫設計 (Relational Database Schema)
-- 設計師：架構工程師 (Software Architect)
-- ==========================================

-- 1. 學生資料表 (Students Profile)
CREATE TABLE students (
    student_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100)
);

-- 2. 好友關係多對多關聯表 (Friendships Junction Table)
CREATE TABLE friendships (
    student_id VARCHAR(50),
    friend_id VARCHAR(50),
    PRIMARY KEY (student_id, friend_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- 3. 課程資料表 (Courses)
CREATE TABLE courses (
    course_id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    instructor VARCHAR(100)
);

-- 4. 小組資料表 (Groups)
CREATE TABLE groups (
    group_id VARCHAR(50) PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    course_id VARCHAR(50),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 5. 小組成員多對多關聯表 (Group Members Junction Table)
CREATE TABLE group_members (
    group_id VARCHAR(50),
    student_id VARCHAR(50),
    PRIMARY KEY (group_id, student_id),
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- 6. 課表與時間狀態表 (Student Weekly Schedules)
-- 使用 7 個整數欄位分別儲存週一至週日 (Mon-Sun) 的忙碌狀態。
-- 每一天被劃分為 14 個時段 (例如 08:00 至 22:00)，以二進位整數 (Bitmask) 表示。
-- 0 代表有空 (Free)，1 代表忙碌 (Busy，如上課、打工或社團)。
CREATE TABLE student_schedules (
    student_id VARCHAR(50) PRIMARY KEY,
    mon_mask INT DEFAULT 0,
    tue_mask INT DEFAULT 0,
    wed_mask INT DEFAULT 0,
    thu_mask INT DEFAULT 0,
    fri_mask INT DEFAULT 0,
    sat_mask INT DEFAULT 0,
    sun_mask INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
