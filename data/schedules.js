// ==========================================
// TeamSync 模擬資料庫 - 個人課表與忙碌狀態 (Schedules Mock Data)
// ==========================================

const SCHEDULES_DATA = {
    "S001": { // 王小明
        classes: { mon: 12, tue: 768, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "熱音社團練習", schedule: { mon: 256, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } },
            work: { name: "圖書館課外打工", schedule: { mon: 0, tue: 0, wed: 0, thu: 48, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S002": { // 李小華
        classes: { mon: 12, tue: 0, wed: 96, thu: 0, fri: 6, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "吉他社社課", schedule: { mon: 0, tue: 0, wed: 0, thu: 32, fri: 0, sat: 0, sun: 0 } },
            work: { name: "超商晚班打工", schedule: { mon: 768, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S003": { // 張大同
        classes: { mon: 12, tue: 768, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "學生會開會", schedule: { mon: 0, tue: 256, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } },
            work: { name: "家教工讀", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 768, sat: 0, sun: 0 } }
        }
    },
    "S004": { // 陳阿花
        classes: { mon: 0, tue: 768, wed: 96, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "排球社練球", schedule: { mon: 0, tue: 0, wed: 0, thu: 4, fri: 0, sat: 0, sun: 0 } },
            work: { name: "餐廳外場服務", schedule: { mon: 0, tue: 0, wed: 192, thu: 0, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S005": { // 林俊傑
        classes: { mon: 0, tue: 768, wed: 96, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "鋼琴社團練習", schedule: { mon: 0, tue: 0, wed: 256, thu: 0, fri: 0, sat: 0, sun: 0 } },
            work: { name: "樂團演出彩排", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 448, sat: 0, sun: 0 } }
        }
    },
    "S006": { // 周杰倫
        classes: { mon: 0, tue: 12, wed: 96, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "魔術研究社", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 256, sat: 0, sun: 0 } },
            work: { name: "音樂工作室工讀", schedule: { mon: 192, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S007": { // 蔡依林
        classes: { mon: 0, tue: 768, wed: 0, thu: 0, fri: 96, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "舞蹈社團練", schedule: { mon: 0, tue: 32, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } },
            work: { name: "服裝設計兼職", schedule: { mon: 0, tue: 0, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S008": { // 蕭敬騰
        classes: { mon: 0, tue: 12, wed: 0, thu: 0, fri: 96, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "籃球校隊訓練", schedule: { mon: 0, tue: 0, wed: 16, thu: 0, fri: 0, sat: 0, sun: 0 } },
            work: { name: "錄音室助理", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 384, sat: 0, sun: 0 } }
        }
    },
    "S009": { // 田馥甄
        classes: { mon: 0, tue: 12, wed: 0, thu: 0, fri: 96, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "登山健行社", schedule: { mon: 0, tue: 0, wed: 0, thu: 64, fri: 0, sat: 0, sun: 0 } },
            work: { name: "文藝咖啡廳打工", schedule: { mon: 48, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S010": { // 吳青峰
        classes: { mon: 0, tue: 768, wed: 0, thu: 0, fri: 96, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "現代詩歌社", schedule: { mon: 64, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } },
            work: { name: "報社特約撰稿", schedule: { mon: 0, tue: 48, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }
        }
    },
    "S011": { // 鄧紫棋
        classes: { mon: 12, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "高音歌唱研習班", schedule: { mon: 0, tue: 192, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週二第 7, 8 節
            work: { name: "音樂節彩排", schedule: { mon: 0, tue: 0, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 } } // 週四第 9, 10 節
        }
    },
    "S012": { // 陳奕迅
        classes: { mon: 12, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "英倫文化社", schedule: { mon: 0, tue: 0, wed: 256, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週三第 9 節
            work: { name: "巡迴演唱會工讀", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 960, sat: 0, sun: 0 } } // 週五第 7, 8, 9, 10 節
        }
    },
    "S013": { // 阿信
        classes: { mon: 0, tue: 0, wed: 96, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "創意寫作社", schedule: { mon: 3, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週一第 1, 2 節
            work: { name: "STAYREAL 品牌開會", schedule: { mon: 0, tue: 96, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } } // 週二第 5, 6 節
        }
    },
    "S014": { // 蔡健雅
        classes: { mon: 0, tue: 768, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "手作烘焙社", schedule: { mon: 0, tue: 0, wed: 12, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週三第 3, 4 節
            work: { name: "甜點工作坊助教", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 192, sat: 0, sun: 0 } } // 週五第 7, 8 節
        }
    },
    "S015": { // 張惠妹
        classes: { mon: 0, tue: 0, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "原住民文化社", schedule: { mon: 0, tue: 192, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週二第 7, 8 節
            work: { name: "酒吧駐唱", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 960, sat: 0, sun: 0 } } // 週五晚間第 7-10 節
        }
    },
    "S016": { // 伍佰
        classes: { mon: 0, tue: 0, wed: 0, thu: 768, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "攝影藝術社", schedule: { mon: 0, tue: 0, wed: 48, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週三第 5, 6 節
            work: { name: "Live House 音控實習", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 768, sat: 0, sun: 0 } } // 週五第 9, 10 節
        }
    },
    "S017": { // 韋禮安
        classes: { mon: 0, tue: 0, wed: 6, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "古典吉他社", schedule: { mon: 0, tue: 3, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週二第 1, 2 節
            work: { name: "錄音室歌曲剪輯", schedule: { mon: 0, tue: 0, wed: 0, thu: 192, fri: 0, sat: 0, sun: 0 } } // 週四第 7, 8 節
        }
    },
    "S018": { // 盧廣仲
        classes: { mon: 0, tue: 0, wed: 6, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "太極拳與養生社", schedule: { mon: 3, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週一第 1, 2 節
            work: { name: "早餐店工讀", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 12, sat: 0, sun: 0 } } // 週五第 3, 4 節 (早餐忙碌)
        }
    },
    "S019": { // 李榮浩
        classes: { mon: 0, tue: 0, wed: 6, thu: 0, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "弦樂合奏團", schedule: { mon: 0, tue: 0, wed: 0, thu: 256, fri: 0, sat: 0, sun: 0 } }, // 週四第 9 節
            work: { name: "詞曲外包編寫", schedule: { mon: 768, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } } // 週一第 9, 10 節
        }
    },
    "S020": { // 楊丞琳
        classes: { mon: 0, tue: 0, wed: 6, thu: 768, fri: 0, sat: 0, sun: 0 },
        customBusy: {
            club: { name: "時尚彩妝社", schedule: { mon: 0, tue: 12, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } }, // 週二第 3, 4 節
            work: { name: "時尚雜誌拍照", schedule: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 192, sat: 0, sun: 0 } } // 週五第 7, 8 節
        }
    }
};
