// ==========================================
// TeamSync 模擬資料庫 - 課程資料 (Courses Mock Data)
// ==========================================

const COURSES_DATA = [
    {
        id: "C001",
        name: "軟體工程 (Software Engineering)",
        instructor: "陳教授",
        schedule: { mon: 12, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } // 週一第 3, 4 節 (12)
    },
    {
        id: "C002",
        name: "演算法與資料結構 (Algorithms)",
        instructor: "林教授",
        schedule: { mon: 0, tue: 0, wed: 96, thu: 0, fri: 0, sat: 0, sun: 0 } // 週三第 5, 6 節 (96)
    },
    {
        id: "C003",
        name: "網頁系統開發 (Web Development)",
        instructor: "黃副教授",
        schedule: { mon: 0, tue: 768, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } // 週二第 7, 8 節 (768)
    },
    {
        id: "C004",
        name: "人工智慧導論 (Intro to AI)",
        instructor: "張教授",
        schedule: { mon: 0, tue: 0, wed: 0, thu: 6, fri: 0, sat: 0, sun: 0 } // 週四第 2, 3 節 (6)
    },
    {
        id: "C005",
        name: "電腦網路 (Computer Networks)",
        instructor: "劉教授",
        schedule: { mon: 0, tue: 12, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } // 週二第 3, 4 節 (12)
    },
    {
        id: "C006",
        name: "系統分析與設計 (System Analysis)",
        instructor: "鄭教授",
        schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 96, sat: 0, sun: 0 } // 週五第 5, 6 節 (96)
    },
    {
        id: "C007",
        name: "資料庫系統概論 (Database Systems)",
        instructor: "王教授",
        schedule: { mon: 768, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } // 週一第 7, 8 節 (768)
    },
    {
        id: "C008",
        name: "作業系統 (Operating Systems)",
        instructor: "蘇教授",
        schedule: { mon: 0, tue: 0, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 } // 週四第 7, 8 節 (768)
    },
    {
        id: "C009",
        name: "機器學習導論 (Machine Learning)",
        instructor: "葉教授",
        schedule: { mon: 0, tue: 0, wed: 6, thu: 0, fri: 0, sat: 0, sun: 0 } // 週三第 2, 3 節 (6)
    },
    {
        id: "C010",
        name: "密碼學與資訊安全 (Cryptography)",
        instructor: "賴教授",
        schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 6, sat: 0, sun: 0 } // 週五第 2, 3 節 (6)
    }
];
