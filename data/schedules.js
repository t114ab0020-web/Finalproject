// ==========================================
// TeamSync 模擬資料庫 - 個人課表與忙碌狀態 (Schedules Mock Data)
// 已擴充：每位學生 6~9 門課 + 社團 + 打工 + 部分額外不可用時間
// 注意：這是前端 mock data，不需後端或資料庫
// ==========================================

const SCHEDULES_DATA = {
    "S001": {
        "classes": {
            "mon": 207,
            "tue": 192,
            "wed": 3279,
            "thu": 966,
            "fri": 204,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "熱音社團練習",
                "schedule": {
                    "mon": 256,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "圖書館課外打工",
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
            "extra": [
                {
                    "id": "busy-S001-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "mon",
                    "mask": 16
                }
            ]
        }
    },
    "S002": {
        "classes": {
            "mon": 1004,
            "tue": 60,
            "wed": 230,
            "thu": 960,
            "fri": 768,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "吉他社社課",
                "schedule": {
                    "mon": 0,
                    "tue": 32,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "超商晚班打工",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S003": {
        "classes": {
            "mon": 3087,
            "tue": 192,
            "wed": 3843,
            "thu": 54,
            "fri": 198,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "學生會開會",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 256,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "家教工讀",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S004": {
        "classes": {
            "mon": 108,
            "tue": 3264,
            "wed": 3168,
            "thu": 3078,
            "fri": 62,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "排球社練球",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 64,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "餐廳外場服務",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S005": {
        "classes": {
            "mon": 783,
            "tue": 192,
            "wed": 231,
            "thu": 0,
            "fri": 3278,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "鋼琴社練習",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 1024,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "樂團演出彩排",
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
            "extra": [
                {
                    "id": "busy-S005-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "fri",
                    "mask": 1024
                }
            ]
        }
    },
    "S006": {
        "classes": {
            "mon": 96,
            "tue": 3084,
            "wed": 224,
            "thu": 198,
            "fri": 3852,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "魔術研究社",
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
            "work": {
                "name": "音樂工作室工讀",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S007": {
        "classes": {
            "mon": 771,
            "tue": 960,
            "wed": 3075,
            "thu": 960,
            "fri": 118,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "舞蹈社團練習",
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
            "work": {
                "name": "服裝設計兼職",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S008": {
        "classes": {
            "mon": 3888,
            "tue": 780,
            "wed": 0,
            "thu": 246,
            "fri": 870,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "籃球校隊訓練",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 256,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "錄音室助理",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S009": {
        "classes": {
            "mon": 96,
            "tue": 3084,
            "wed": 204,
            "thu": 774,
            "fri": 3182,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "登山健行社",
                "schedule": {
                    "mon": 256,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "文藝咖啡廳打工",
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
            "extra": [
                {
                    "id": "busy-S009-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "thu",
                    "mask": 128
                }
            ]
        }
    },
    "S010": {
        "classes": {
            "mon": 771,
            "tue": 192,
            "wed": 3171,
            "thu": 192,
            "fri": 3296,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "現代詩歌社",
                "schedule": {
                    "mon": 0,
                    "tue": 32,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "報社特約撰稿",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S011": {
        "classes": {
            "mon": 207,
            "tue": 3120,
            "wed": 3303,
            "thu": 768,
            "fri": 54,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "高音歌唱研習班",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 256,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "音樂節彩排",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S012": {
        "classes": {
            "mon": 1020,
            "tue": 3120,
            "wed": 96,
            "thu": 774,
            "fri": 96,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "英倫文化社",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 64,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "巡迴演唱會工讀",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S013": {
        "classes": {
            "mon": 192,
            "tue": 3072,
            "wed": 3174,
            "thu": 3312,
            "fri": 252,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "創意寫作社",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 1024,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "品牌會議工讀",
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
            "extra": [
                {
                    "id": "busy-S013-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "wed",
                    "mask": 64
                }
            ]
        }
    },
    "S014": {
        "classes": {
            "mon": 768,
            "tue": 3264,
            "wed": 774,
            "thu": 240,
            "fri": 12,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "手作烘焙社",
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
            "work": {
                "name": "甜點工作坊助教",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S015": {
        "classes": {
            "mon": 3,
            "tue": 3084,
            "wed": 995,
            "thu": 3264,
            "fri": 198,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "原住民文化社",
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
            "work": {
                "name": "酒吧駐唱",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S016": {
        "classes": {
            "mon": 3072,
            "tue": 60,
            "wed": 4032,
            "thu": 192,
            "fri": 960,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "攝影藝術社",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 256,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "Live House 音控實習",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S017": {
        "classes": {
            "mon": 0,
            "tue": 3072,
            "wed": 3086,
            "thu": 1008,
            "fri": 124,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "古典吉他社",
                "schedule": {
                    "mon": 256,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "錄音室歌曲剪輯",
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
            "extra": [
                {
                    "id": "busy-S017-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "tue",
                    "mask": 32
                }
            ]
        }
    },
    "S018": {
        "classes": {
            "mon": 1020,
            "tue": 816,
            "wed": 102,
            "thu": 192,
            "fri": 3264,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "太極拳與養生社",
                "schedule": {
                    "mon": 0,
                    "tue": 32,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "早餐店工讀",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S019": {
        "classes": {
            "mon": 192,
            "tue": 192,
            "wed": 3278,
            "thu": 3120,
            "fri": 3168,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "弦樂合奏團",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 256,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "詞曲外包編寫",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S020": {
        "classes": {
            "mon": 963,
            "tue": 3072,
            "wed": 3079,
            "thu": 198,
            "fri": 12,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "時尚彩妝社",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 64,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "時尚雜誌拍照",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S021": {
        "classes": {
            "mon": 15,
            "tue": 3072,
            "wed": 199,
            "thu": 3120,
            "fri": 3132,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "桌遊社策略夜",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 1024,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "補習班助教",
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
            "extra": [
                {
                    "id": "busy-S021-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "mon",
                    "mask": 16
                }
            ]
        }
    },
    "S022": {
        "classes": {
            "mon": 3315,
            "tue": 192,
            "wed": 3075,
            "thu": 0,
            "fri": 4032,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "志工服務隊",
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
            "work": {
                "name": "實驗室助理",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S023": {
        "classes": {
            "mon": 3843,
            "tue": 48,
            "wed": 771,
            "thu": 774,
            "fri": 96,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "動漫研究社",
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
            "work": {
                "name": "系辦行政工讀",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S024": {
        "classes": {
            "mon": 192,
            "tue": 3888,
            "wed": 198,
            "thu": 0,
            "fri": 3072,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "辯論社模擬賽",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 256,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "健身房櫃台",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S025": {
        "classes": {
            "mon": 3276,
            "tue": 816,
            "wed": 3840,
            "thu": 0,
            "fri": 12,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "咖啡研究社",
                "schedule": {
                    "mon": 256,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "設計接案",
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
            "extra": [
                {
                    "id": "busy-S025-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "fri",
                    "mask": 1024
                }
            ]
        }
    },
    "S026": {
        "classes": {
            "mon": 768,
            "tue": 768,
            "wed": 192,
            "thu": 246,
            "fri": 3072,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "瑜珈放鬆社",
                "schedule": {
                    "mon": 0,
                    "tue": 32,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "寵物咖啡廳打工",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S027": {
        "classes": {
            "mon": 3084,
            "tue": 48,
            "wed": 204,
            "thu": 240,
            "fri": 768,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "電影賞析社",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 256,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "活動場控工讀",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 960,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S028": {
        "classes": {
            "mon": 0,
            "tue": 828,
            "wed": 3072,
            "thu": 6,
            "fri": 780,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "資訊志工隊",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 64,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "攝影助理",
                "schedule": {
                    "mon": 768,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    },
    "S029": {
        "classes": {
            "mon": 3123,
            "tue": 12,
            "wed": 3,
            "thu": 3840,
            "fri": 108,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "烘豆社練習",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 0,
                    "thu": 0,
                    "fri": 1024,
                    "sat": 0,
                    "sun": 0
                }
            },
            "work": {
                "name": "外送兼職",
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
            "extra": [
                {
                    "id": "busy-S029-001",
                    "type": "other",
                    "name": "小組報告預備會",
                    "day": "thu",
                    "mask": 128
                }
            ]
        }
    },
    "S030": {
        "classes": {
            "mon": 960,
            "tue": 768,
            "wed": 192,
            "thu": 1008,
            "fri": 12,
            "sat": 0,
            "sun": 0
        },
        "customBusy": {
            "club": {
                "name": "羽球校隊",
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
            "work": {
                "name": "客服晚班",
                "schedule": {
                    "mon": 0,
                    "tue": 0,
                    "wed": 192,
                    "thu": 0,
                    "fri": 0,
                    "sat": 0,
                    "sun": 0
                }
            }
        }
    }
};
