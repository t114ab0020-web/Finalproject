// ==========================================
// TeamSync 模擬資料庫 - 課程資料 (Courses Mock Data)
// 已擴充為「正常可悲大學生」版本：更多課程、更多晚間課、更多爆炸課表來源
// bitmask：第1~10節 + A/B/C/D，共 14 bits，最大值 16383
// ==========================================

const COURSES_DATA = [
    {
        "id": "C001",
        "name": "軟體工程 (Software Engineering)",
        "instructor": "陳教授",
        "schedule": {
            "mon": 12,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C002",
        "name": "演算法與資料結構 (Algorithms & Data Structures)",
        "instructor": "林教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 96,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C003",
        "name": "網頁系統開發 (Web Development)",
        "instructor": "黃副教授",
        "schedule": {
            "mon": 0,
            "tue": 192,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C004",
        "name": "人工智慧導論 (Intro to AI)",
        "instructor": "張教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 6,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C005",
        "name": "電腦網路 (Computer Networks)",
        "instructor": "劉教授",
        "schedule": {
            "mon": 0,
            "tue": 12,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C006",
        "name": "系統分析與設計 (System Analysis)",
        "instructor": "鄭教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 96,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C007",
        "name": "資料庫系統概論 (Database Systems)",
        "instructor": "王教授",
        "schedule": {
            "mon": 192,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C008",
        "name": "作業系統 (Operating Systems)",
        "instructor": "蘇教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 192,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C009",
        "name": "機器學習導論 (Machine Learning)",
        "instructor": "葉教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 6,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C010",
        "name": "密碼學與資訊安全 (Cryptography)",
        "instructor": "賴教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 6,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C011",
        "name": "微積分 (Calculus)",
        "instructor": "吳教授",
        "schedule": {
            "mon": 3,
            "tue": 0,
            "wed": 3,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C012",
        "name": "線性代數 (Linear Algebra)",
        "instructor": "郭教授",
        "schedule": {
            "mon": 0,
            "tue": 48,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C013",
        "name": "離散數學 (Discrete Mathematics)",
        "instructor": "楊教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 48,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C014",
        "name": "大學英文 (College English)",
        "instructor": "李老師",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 12,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C015",
        "name": "體育 - 籃球 (PE Basketball)",
        "instructor": "何教練",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 192,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C016",
        "name": "通識 - 心理學導論 (General Psychology)",
        "instructor": "蔡教授",
        "schedule": {
            "mon": 48,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C017",
        "name": "經濟學原理 (Economics)",
        "instructor": "謝教授",
        "schedule": {
            "mon": 0,
            "tue": 192,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C018",
        "name": "程式設計一 (Programming I)",
        "instructor": "趙教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 192,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C019",
        "name": "人機互動設計 (Human-Computer Interaction)",
        "instructor": "馮教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 192,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C020",
        "name": "專題實作 (Capstone Project)",
        "instructor": "全體導師",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 3072,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C021",
        "name": "資料視覺化 (Data Visualization)",
        "instructor": "周教授",
        "schedule": {
            "mon": 768,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C022",
        "name": "雲端運算 (Cloud Computing)",
        "instructor": "吳副教授",
        "schedule": {
            "mon": 0,
            "tue": 3072,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C023",
        "name": "行動應用程式設計 (Mobile App Design)",
        "instructor": "許教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 768,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C024",
        "name": "軟體測試與品質保證 (Software Testing)",
        "instructor": "潘教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 768,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C025",
        "name": "編譯器設計 (Compiler Design)",
        "instructor": "高教授",
        "schedule": {
            "mon": 3072,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C026",
        "name": "自然語言處理 (Natural Language Processing)",
        "instructor": "宋教授",
        "schedule": {
            "mon": 0,
            "tue": 768,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C027",
        "name": "數位邏輯設計 (Digital Logic Design)",
        "instructor": "白教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 12,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C028",
        "name": "統計學 (Statistics)",
        "instructor": "范教授",
        "schedule": {
            "mon": 96,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C029",
        "name": "專業倫理與法律 (Tech Ethics and Law)",
        "instructor": "羅教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 48,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C030",
        "name": "創新創業實務 (Entrepreneurship Practice)",
        "instructor": "錢教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 768,
            "thu": 0,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C031",
        "name": "使用者研究方法 (User Research Methods)",
        "instructor": "蕭教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 3072,
            "fri": 0,
            "sat": 0,
            "sun": 0
        }
    },
    {
        "id": "C032",
        "name": "深度學習實務 (Deep Learning Practice)",
        "instructor": "洪教授",
        "schedule": {
            "mon": 0,
            "tue": 0,
            "wed": 0,
            "thu": 0,
            "fri": 3072,
            "sat": 0,
            "sun": 0
        }
    }
];
