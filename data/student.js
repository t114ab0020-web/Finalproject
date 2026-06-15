// ==========================================
// TeamSync 模擬資料庫 - 學生資料 (Student Mock Data)
// 已擴充為 30 位學生，讓好友搜尋、小組與喬時間更有真實感
// ==========================================

const STUDENTS_DATA = [
    {
        "id": "S001",
        "name": "王小明",
        "email": "xiaoming@example.edu",
        "friends": [
            "S002",
            "S003",
            "S005",
            "S006",
            "S008",
            "S010",
            "S017",
            "S022",
            "S023",
            "S026"
        ]
    },
    {
        "id": "S002",
        "name": "李小華",
        "email": "xiaohua@example.edu",
        "friends": [
            "S001",
            "S003",
            "S004",
            "S007",
            "S008",
            "S011",
            "S019",
            "S023",
            "S027",
            "S029"
        ]
    },
    {
        "id": "S003",
        "name": "張大同",
        "email": "datong@example.edu",
        "friends": [
            "S001",
            "S002",
            "S004",
            "S005",
            "S006",
            "S008",
            "S012",
            "S019",
            "S023",
            "S026"
        ]
    },
    {
        "id": "S004",
        "name": "陳阿花",
        "email": "ahua@example.edu",
        "friends": [
            "S002",
            "S003",
            "S005",
            "S006",
            "S009",
            "S011",
            "S013",
            "S016",
            "S023",
            "S025"
        ]
    },
    {
        "id": "S005",
        "name": "林俊傑",
        "email": "jun@example.edu",
        "friends": [
            "S001",
            "S003",
            "S004",
            "S006",
            "S007",
            "S010",
            "S014",
            "S020",
            "S026",
            "S028"
        ]
    },
    {
        "id": "S006",
        "name": "周杰倫",
        "email": "jay@example.edu",
        "friends": [
            "S001",
            "S003",
            "S004",
            "S007",
            "S008",
            "S011",
            "S015",
            "S018",
            "S027",
            "S030"
        ]
    },
    {
        "id": "S007",
        "name": "蔡依林",
        "email": "jolin@example.edu",
        "friends": [
            "S002",
            "S003",
            "S005",
            "S006",
            "S008",
            "S009",
            "S012",
            "S016",
            "S023",
            "S025"
        ]
    },
    {
        "id": "S008",
        "name": "蕭敬騰",
        "email": "jam@example.edu",
        "friends": [
            "S001",
            "S002",
            "S003",
            "S006",
            "S009",
            "S010",
            "S012",
            "S013",
            "S015",
            "S017"
        ]
    },
    {
        "id": "S009",
        "name": "田馥甄",
        "email": "hebe@example.edu",
        "friends": [
            "S004",
            "S006",
            "S007",
            "S010",
            "S011",
            "S013",
            "S014",
            "S018",
            "S020",
            "S023"
        ]
    },
    {
        "id": "S010",
        "name": "吳青峰",
        "email": "greeny@example.edu",
        "friends": [
            "S001",
            "S005",
            "S008",
            "S009",
            "S011",
            "S012",
            "S015",
            "S019",
            "S022",
            "S027"
        ]
    },
    {
        "id": "S011",
        "name": "鄧紫棋",
        "email": "gem@example.edu",
        "friends": [
            "S002",
            "S003",
            "S004",
            "S006",
            "S012",
            "S013",
            "S016",
            "S020",
            "S026",
            "S027"
        ]
    },
    {
        "id": "S012",
        "name": "陳奕迅",
        "email": "eason@example.edu",
        "friends": [
            "S003",
            "S005",
            "S007",
            "S008",
            "S013",
            "S014",
            "S017",
            "S021",
            "S024",
            "S029"
        ]
    },
    {
        "id": "S013",
        "name": "阿信",
        "email": "ashin@example.edu",
        "friends": [
            "S003",
            "S004",
            "S008",
            "S009",
            "S011",
            "S014",
            "S015",
            "S017",
            "S018",
            "S022"
        ]
    },
    {
        "id": "S014",
        "name": "蔡健雅",
        "email": "tanya@example.edu",
        "friends": [
            "S005",
            "S009",
            "S012",
            "S013",
            "S015",
            "S016",
            "S019",
            "S020",
            "S023",
            "S026"
        ]
    },
    {
        "id": "S015",
        "name": "張惠妹",
        "email": "amei@example.edu",
        "friends": [
            "S006",
            "S008",
            "S010",
            "S013",
            "S014",
            "S016",
            "S017",
            "S018",
            "S020",
            "S024"
        ]
    },
    {
        "id": "S016",
        "name": "伍佰",
        "email": "wubai@example.edu",
        "friends": [
            "S004",
            "S007",
            "S011",
            "S014",
            "S015",
            "S017",
            "S018",
            "S021",
            "S022",
            "S025"
        ]
    },
    {
        "id": "S017",
        "name": "韋禮安",
        "email": "weibird@example.edu",
        "friends": [
            "S001",
            "S008",
            "S012",
            "S013",
            "S018",
            "S019",
            "S022",
            "S026",
            "S027",
            "S028"
        ]
    },
    {
        "id": "S018",
        "name": "盧廣仲",
        "email": "crowd@example.edu",
        "friends": [
            "S006",
            "S009",
            "S012",
            "S013",
            "S015",
            "S016",
            "S019",
            "S020",
            "S023",
            "S027"
        ]
    },
    {
        "id": "S019",
        "name": "李榮浩",
        "email": "ronghao@example.edu",
        "friends": [
            "S002",
            "S003",
            "S008",
            "S010",
            "S020",
            "S021",
            "S024",
            "S028",
            "S029",
            "S030"
        ]
    },
    {
        "id": "S020",
        "name": "楊丞琳",
        "email": "rainie@example.edu",
        "friends": [
            "S003",
            "S005",
            "S009",
            "S011",
            "S014",
            "S021",
            "S022",
            "S025",
            "S027",
            "S029"
        ]
    },
    {
        "id": "S021",
        "name": "黃雨柔",
        "email": "yurou@example.edu",
        "friends": [
            "S005",
            "S007",
            "S009",
            "S012",
            "S016",
            "S018",
            "S022",
            "S023",
            "S026",
            "S030"
        ]
    },
    {
        "id": "S022",
        "name": "許柏翰",
        "email": "bohan@example.edu",
        "friends": [
            "S001",
            "S004",
            "S010",
            "S013",
            "S015",
            "S016",
            "S017",
            "S023",
            "S024",
            "S027"
        ]
    },
    {
        "id": "S023",
        "name": "林子晴",
        "email": "ziqing@example.edu",
        "friends": [
            "S001",
            "S002",
            "S003",
            "S004",
            "S007",
            "S009",
            "S019",
            "S024",
            "S025",
            "S028"
        ]
    },
    {
        "id": "S024",
        "name": "陳冠宇",
        "email": "guanyu@example.edu",
        "friends": [
            "S003",
            "S007",
            "S008",
            "S009",
            "S012",
            "S015",
            "S025",
            "S026",
            "S028",
            "S029"
        ]
    },
    {
        "id": "S025",
        "name": "吳庭安",
        "email": "tingan@example.edu",
        "friends": [
            "S004",
            "S007",
            "S008",
            "S016",
            "S020",
            "S023",
            "S024",
            "S026",
            "S027",
            "S030"
        ]
    },
    {
        "id": "S026",
        "name": "張哲瑋",
        "email": "zhewei@example.edu",
        "friends": [
            "S001",
            "S003",
            "S005",
            "S011",
            "S012",
            "S014",
            "S017",
            "S022",
            "S027",
            "S028"
        ]
    },
    {
        "id": "S027",
        "name": "何品萱",
        "email": "pinxuan@example.edu",
        "friends": [
            "S002",
            "S006",
            "S010",
            "S011",
            "S017",
            "S018",
            "S024",
            "S026",
            "S028",
            "S029"
        ]
    },
    {
        "id": "S028",
        "name": "郭彥廷",
        "email": "yanting@example.edu",
        "friends": [
            "S003",
            "S005",
            "S006",
            "S007",
            "S015",
            "S017",
            "S018",
            "S019",
            "S029",
            "S030"
        ]
    },
    {
        "id": "S029",
        "name": "羅家寧",
        "email": "jianing@example.edu",
        "friends": [
            "S001",
            "S002",
            "S004",
            "S008",
            "S012",
            "S015",
            "S019",
            "S020",
            "S024",
            "S030"
        ]
    },
    {
        "id": "S030",
        "name": "宋承恩",
        "email": "chengen@example.edu",
        "friends": [
            "S001",
            "S002",
            "S005",
            "S006",
            "S007",
            "S009",
            "S016",
            "S019",
            "S021",
            "S029"
        ]
    }
];
