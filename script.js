// ==========================================================================
// TeamSync 核心排程運算與網頁交互引擎 (Core Scheduler & UI Engine)
// 設計師：軟體工程師 (Software Engineer) & 架構工程師 (Software Architect)
// ==========================================================================

// 時間段對照表 (14 個時段)
const TIME_SLOTS = [
    { name: "第 1 節", time: "08:00 - 09:00" },
    { name: "第 2 節", time: "09:00 - 10:00" },
    { name: "第 3 節", time: "10:10 - 11:00" },
    { name: "第 4 節", time: "11:10 - 12:00" },
    { name: "第 5 節", time: "12:10 - 13:00" },
    { name: "第 6 節", time: "13:10 - 14:00" },
    { name: "第 7 節", time: "14:10 - 15:00" },
    { name: "第 8 節", time: "15:10 - 16:00" },
    { name: "第 9 節", time: "16:10 - 17:00" },
    { name: "第 10 節", time: "17:10 - 18:00" },
    { name: "第 A 節", time: "18:30 - 19:20" },
    { name: "第 B 節", time: "19:30 - 20:20" },
    { name: "第 C 節", time: "20:30 - 21:20" },
    { name: "第 D 節", time: "21:30 - 22:20" }
];

const DAYS = ["mon", "tue", "wed", "thu", "fri"];
const DAY_LABELS = {
    mon: "星期一",
    tue: "星期二",
    wed: "星期三",
    thu: "星期四",
    fri: "星期五"
};

// 全域狀態管理
let activeStudentId = "S001";
let selectedGroupId = "";
let lastSyncResults = null;
let lastMemberPreferences = null;

/**
 * 計算單一學生在特定天數的忙碌遮罩 (Busy Mask)
 * 運用位元或運算 (Bitwise OR) 合併必修課表與自訂忙碌時間
 */
function getStudentBusyMask(studentId, day, includeClub = true, includeWork = true) {
    const sch = SCHEDULES_DATA[studentId];
    if (!sch) return 0;

    let mask = sch.classes[day] || 0;

    // 若啟用社團開關，且該日有社團活動，以位元或 (OR) 合併
    if (includeClub && sch.customBusy && sch.customBusy.club && sch.customBusy.club.schedule[day]) {
        mask |= sch.customBusy.club.schedule[day];
    }

    // 若啟用打工開關，且該日有打工時間，以位元或 (OR) 合併
    if (includeWork && sch.customBusy && sch.customBusy.work && sch.customBusy.work.schedule[day]) {
        mask |= sch.customBusy.work.schedule[day];
    }

    return mask;
}

/**
 * 預設靜態計算 (原本架構工程師設計，保留相容)
 */
function calculateGroupSync(groupId) {
    const group = GROUPS_DATA.find(g => g.id === groupId);
    if (!group) return null;

    const members = group.members;
    const result = {};

    DAYS.forEach(day => {
        let groupBusyMask = 0;
        members.forEach(memberId => {
            const memberBusy = getStudentBusyMask(memberId, day, true, true);
            groupBusyMask |= memberBusy;
        });

        // 取反並使用 0x3FFF 限制，求出交集
        const groupFreeMask = (~groupBusyMask) & 0x3FFF;
        result[day] = groupFreeMask;
    });

    return result;
}

// ==========================================================================
// 前端互動介面控制邏輯 (UI & Event Handlers)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 執行演算法自我測試
    runAlgorithmSelfTest();
    
    // 初始化元件
    initSelectors();
    initTabs();
    initEventListeners();
    
    // 預設載入王小明
    loadStudentProfile("S001");
});

/**
 * 初始化下拉選單資料
 */
function initSelectors() {
    const userSelect = document.getElementById("user-select");
    const groupSelect = document.getElementById("group-select");

    // 填入學生選項
    STUDENTS_DATA.forEach(student => {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = `${student.name} (${student.id})`;
        userSelect.appendChild(option);
    });

    // 填入小組選項
    GROUPS_DATA.forEach(group => {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = group.name;
        groupSelect.appendChild(option);
    });
}

/**
 * 初始化頁籤切換
 */
function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-tab");
            document.getElementById(targetId).classList.add("active");
        });
    });
}

/**
 * 註冊事件監聽
 */
function initEventListeners() {
    // 學生切換
    document.getElementById("user-select").addEventListener("change", (e) => {
        loadStudentProfile(e.target.value);
    });

    // 小組切換
    document.getElementById("group-select").addEventListener("change", (e) => {
        loadGroupSection(e.target.value);
    });

    // 一鍵比對按鈕
    document.getElementById("sync-btn").addEventListener("click", () => {
        performScheduleSync();
    });

    // 觀看星期切換 (位元解析器)
    document.getElementById("visualizer-day-select").addEventListener("change", () => {
        updateVisualizerLog();
    });
}

/**
 * 載入指定學生的個人資料、課表與好友名單
 */
function loadStudentProfile(studentId) {
    activeStudentId = studentId;
    const student = STUDENTS_DATA.find(s => s.id === studentId);
    if (!student) return;

    // 更新 Header 操作者名稱
    document.getElementById("active-user-name").textContent = student.name;
    document.getElementById("user-select").value = studentId;

    // 渲染好友清單
    const friendsList = document.getElementById("friends-list");
    const friendCount = document.getElementById("friend-count");
    friendsList.innerHTML = "";
    friendCount.textContent = student.friends.length;

    student.friends.forEach(friendId => {
        const friend = STUDENTS_DATA.find(s => s.id === friendId);
        if (friend) {
            const pill = document.createElement("div");
            pill.className = "friend-pill";
            pill.innerHTML = `<span class="avatar-dot"></span>${friend.name}`;
            friendsList.appendChild(pill);
        }
    });

    // 重設課表標題與狀態 (切換人時，回到個人課表檢視)
    lastSyncResults = null;
    lastMemberPreferences = null;
    document.getElementById("schedule-title").textContent = `${student.name} 的個人課表`;
    document.getElementById("schedule-subtitle").textContent = "顯示該生目前的必修課表與社團/打工時間";

    // 渲染個人課表
    renderSchedule(studentId);
}

/**
 * 載入小組資訊與組員設定開關
 */
function loadGroupSection(groupId) {
    selectedGroupId = groupId;
    const groupMembersSection = document.getElementById("group-members-section");
    const syncBtn = document.getElementById("sync-btn");
    const membersList = document.getElementById("members-list");

    if (!groupId) {
        groupMembersSection.classList.add("hidden");
        syncBtn.classList.add("disabled");
        syncBtn.disabled = true;
        // 重設日誌預設畫面
        document.getElementById("visualizer-members-log").innerHTML = 
            `<p class="placeholder-text">請在左側選擇「課程小組」並點擊「一鍵比對共時空堂」以檢視位元運算日誌。</p>`;
        document.getElementById("visualizer-result-log").classList.add("hidden");
        return;
    }

    groupMembersSection.classList.remove("hidden");
    syncBtn.classList.remove("disabled");
    syncBtn.disabled = false;
    membersList.innerHTML = "";

    const group = GROUPS_DATA.find(g => g.id === groupId);
    if (!group) return;

    group.members.forEach(memberId => {
        const member = STUDENTS_DATA.find(s => s.id === memberId);
        const sch = SCHEDULES_DATA[memberId];
        if (!member || !sch) return;

        // 組員項目區塊
        const item = document.createElement("div");
        item.className = "member-item";
        item.dataset.studentId = memberId;

        // 取得社團/打工的預設標題
        const clubName = sch.customBusy?.club?.name || "社團時間";
        const workName = sch.customBusy?.work?.name || "打工時間";

        item.innerHTML = `
            <div class="member-info">
                <span class="member-avatar">${member.name.charAt(0)}</span>
                <div>
                    <div class="member-name">${member.name} ${memberId === activeStudentId ? '<span class="badge">你</span>' : ''}</div>
                    <div class="member-email">${member.email}</div>
                </div>
            </div>
            <div class="member-toggles">
                <label class="toggle-switch" title="${clubName}">
                    <input type="checkbox" class="club-cb club-checkbox" checked>
                    <span class="slider"></span>
                    <span class="toggle-label">社團</span>
                </label>
                <label class="toggle-switch" title="${workName}">
                    <input type="checkbox" class="work-cb work-checkbox" checked>
                    <span class="slider"></span>
                    <span class="toggle-label">打工</span>
                </label>
            </div>
        `;
        
        // 當勾選狀態改變時，若已經同步過，自動重新比對
        item.querySelectorAll("input").forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                if (lastSyncResults) {
                    performScheduleSync();
                }
            });
        });

        membersList.appendChild(item);
    });
}

/**
 * 執行排程比對
 */
function performScheduleSync() {
    if (!selectedGroupId) return;
    const group = GROUPS_DATA.find(g => g.id === selectedGroupId);
    if (!group) return;

    // 收集所有成員的忙碌時間包含設定
    const memberPreferences = {};
    const memberItems = document.querySelectorAll(".member-item");
    
    memberItems.forEach(item => {
        const studentId = item.dataset.studentId;
        const includeClub = item.querySelector(".club-cb").checked;
        const includeWork = item.querySelector(".work-cb").checked;
        memberPreferences[studentId] = { includeClub, includeWork };
    });

    // 執行比對運算
    const syncResults = {};
    DAYS.forEach(day => {
        let groupBusyMask = 0;
        group.members.forEach(memberId => {
            const pref = memberPreferences[memberId] || { includeClub: true, includeWork: true };
            const memberBusy = getStudentBusyMask(memberId, day, pref.includeClub, pref.includeWork);
            groupBusyMask |= memberBusy;
        });

        // 共同空堂 = 忙碌聯集取反
        const groupFreeMask = (~groupBusyMask) & 0x3FFF;
        syncResults[day] = groupFreeMask;
    });

    // 儲存狀態以供切換面板時使用
    lastSyncResults = syncResults;
    lastMemberPreferences = memberPreferences;

    // 更新課表標題與狀態
    document.getElementById("schedule-title").textContent = `${group.name} - 共同空堂比對結果`;
    document.getElementById("schedule-subtitle").textContent = "已排除組員各自的課表與自訂忙碌時間，綠色高亮區塊為大家皆能配合的時段。";

    // 渲染排程 Grid (交集模式)
    renderSchedule(activeStudentId, syncResults, memberPreferences);
    
    // 更新位元解析器
    updateVisualizerLog();
}

/**
 * 渲染週課表 Grid
 * @param {string} studentId 當前操作學生 ID
 * @param {Object} syncedFreeMasks 是否傳入比對完成的空堂遮罩 (例：{ mon: 15603, tue: ... })
 * @param {Object} memberPreferences 每個組員的忙碌設定開關 (當 syncedFreeMasks 存在時使用)
 */
function renderSchedule(studentId, syncedFreeMasks = null, memberPreferences = null) {
    const bodyContainer = document.getElementById("schedule-body-rows");
    bodyContainer.innerHTML = "";

    const activeSch = SCHEDULES_DATA[studentId];
    if (!activeSch) return;

    for (let slotIdx = 0; slotIdx < TIME_SLOTS.length; slotIdx++) {
        const slot = TIME_SLOTS[slotIdx];

        // 1. 建立左側時間軸欄位 (第 X 節)
        const labelCell = document.createElement("div");
        labelCell.className = "schedule-cell time-label-cell";
        labelCell.innerHTML = `
            <span class="period-name">${slot.name}</span>
            <span class="period-time">${slot.time}</span>
        `;
        bodyContainer.appendChild(labelCell);

        // 2. 建立週一至週五欄位
        DAYS.forEach(day => {
            const cell = document.createElement("div");
            cell.className = "schedule-cell";
            cell.dataset.day = day;
            cell.dataset.slot = slotIdx;

            // 判斷是否為「交集比對」結果模式
            if (syncedFreeMasks) {
                const isCommonFree = (syncedFreeMasks[day] & (1 << slotIdx)) !== 0;

                if (isCommonFree) {
                    // 大家都有空的共同空堂
                    cell.className += " status-synced-free";
                    cell.innerHTML = `
                        <div>共同空堂</div>
                        <span class="free-badge">Sync Free</span>
                    `;
                } else {
                    // 有人忙碌：搜集忙碌名單與原因
                    const group = GROUPS_DATA.find(g => g.id === selectedGroupId);
                    const busyDetails = [];

                    group.members.forEach(memberId => {
                        const member = STUDENTS_DATA.find(s => s.id === memberId);
                        const pref = memberPreferences[memberId] || { includeClub: true, includeWork: true };
                        const sch = SCHEDULES_DATA[memberId];

                        const hasClass = (sch.classes[day] & (1 << slotIdx)) !== 0;
                        const hasClub = pref.includeClub && sch.customBusy?.club && (sch.customBusy.club.schedule[day] & (1 << slotIdx)) !== 0;
                        const hasWork = pref.includeWork && sch.customBusy?.work && (sch.customBusy.work.schedule[day] & (1 << slotIdx)) !== 0;

                        if (hasClass || hasClub || hasWork) {
                            let reason = "";
                            if (hasClass) {
                                // 尋找對應的課程名稱
                                const course = COURSES_DATA.find(c => c.schedule[day] & (1 << slotIdx));
                                reason = course ? course.name.substring(0, 4) : "上課";
                            } else if (hasClub) {
                                reason = "社團";
                            } else if (hasWork) {
                                reason = "打工";
                            }
                            busyDetails.push(`${member.name}(${reason})`);
                        }
                    });

                    cell.className += " status-free";
                    if (busyDetails.length > 0) {
                        cell.style.color = "var(--text-muted)";
                        cell.style.fontSize = "9px";
                        cell.style.alignItems = "flex-start";
                        cell.style.justifyContent = "flex-start";
                        cell.style.overflow = "hidden";
                        
                        // 縮短顯示，避免塞爆格子
                        let displayText = busyDetails.join(", ");
                        if (displayText.length > 28) {
                            displayText = displayText.substring(0, 26) + "...";
                        }
                        cell.innerHTML = `<span style="opacity: 0.65;">❌ ${displayText}</span>`;
                    }
                }
            } else {
                // 一般模式：渲染操作者的個人課表狀態
                const hasClass = (activeSch.classes[day] & (1 << slotIdx)) !== 0;
                const hasClub = activeSch.customBusy?.club && (activeSch.customBusy.club.schedule[day] & (1 << slotIdx)) !== 0;
                const hasWork = activeSch.customBusy?.work && (activeSch.customBusy.work.schedule[day] & (1 << slotIdx)) !== 0;

                if (hasClass && hasClub && hasWork) {
                    cell.className += " status-busy-combined";
                    cell.innerHTML = `<div>多重忙碌</div><span class="tip-text" style="font-size: 8px;">課堂+社團+打工</span>`;
                } else if (hasClass) {
                    cell.className += " status-class";
                    const course = COURSES_DATA.find(c => c.schedule[day] & (1 << slotIdx));
                    cell.innerHTML = `<div>${course ? course.name : "必選修課"}</div>`;
                } else if (hasClub) {
                    cell.className += " status-club";
                    cell.innerHTML = `<div>${activeSch.customBusy.club.name}</div>`;
                } else if (hasWork) {
                    cell.className += " status-work";
                    cell.innerHTML = `<div>${activeSch.customBusy.work.name}</div>`;
                } else {
                    cell.className += " status-free";
                }
            }

            bodyContainer.appendChild(cell);
        });
    }
}

/**
 * 更新位元運算視覺解析器面版資料
 */
function updateVisualizerLog() {
    const logList = document.getElementById("visualizer-members-log");
    const resultArea = document.getElementById("visualizer-result-log");
    const selectedDay = document.getElementById("visualizer-day-select").value;

    if (!selectedGroupId || !lastSyncResults) {
        logList.innerHTML = `<p class="placeholder-text">請在左側選擇「課程小組」並點擊「一鍵比對共時空堂」以檢視位元運算日誌。</p>`;
        resultArea.classList.add("hidden");
        return;
    }

    const group = GROUPS_DATA.find(g => g.id === selectedGroupId);
    if (!group) return;

    logList.innerHTML = "";
    resultArea.classList.remove("hidden");

    let groupBusyMask = 0;

    // 1. 渲染各組員的忙碌遮罩
    group.members.forEach(memberId => {
        const member = STUDENTS_DATA.find(s => s.id === memberId);
        const pref = lastMemberPreferences[memberId] || { includeClub: true, includeWork: true };
        
        // 取得該組員在選擇星期的 Busy Mask
        const mask = getStudentBusyMask(memberId, selectedDay, pref.includeClub, pref.includeWork);
        groupBusyMask |= mask;

        // 轉換為 14 欄的二進位陣列
        const binStr = mask.toString(2).padStart(14, "0");
        let bitsHtml = "";
        
        for (let i = 13; i >= 0; i--) {
            const bit = binStr.charAt(13 - i);
            const isBusy = bit === "1";
            bitsHtml += `<span class="${isBusy ? 'bit-busy' : 'bit-free'}">${bit}</span>`;
        }

        const logRow = document.createElement("div");
        logRow.className = "log-row";
        logRow.innerHTML = `
            <span class="log-label"><span class="avatar-letter">${member.name.charAt(0)}</span>${member.name}</span>
            <div class="log-binary-wrapper">${bitsHtml}</div>
            <span class="log-binary-val">(十進位: ${mask})</span>
        `;
        logList.appendChild(logRow);
    });

    // 2. 渲染小組聯集結果 (Group Busy Mask)
    const busyBinStr = groupBusyMask.toString(2).padStart(14, "0");
    let busyBitsHtml = "";
    for (let i = 13; i >= 0; i--) {
        const bit = busyBinStr.charAt(13 - i);
        const isBusy = bit === "1";
        busyBitsHtml += `<span class="${isBusy ? 'bit-busy' : 'bit-free'}">${bit}</span>`;
    }

    const unionRow = document.createElement("div");
    unionRow.className = "log-row";
    unionRow.style.marginTop = "8px";
    unionRow.style.paddingTop = "8px";
    unionRow.style.borderTop = "1px solid rgba(255,255,255,0.06)";
    unionRow.innerHTML = `
        <span class="log-label" style="font-weight:600;">小組忙碌聯集 (OR)</span>
        <div class="log-binary-wrapper">${busyBitsHtml}</div>
        <span class="log-binary-val">(十進位: ${groupBusyMask})</span>
    `;
    logList.appendChild(unionRow);

    // 3. 渲染小組交集結果 (Group Free Mask)
    const freeMask = lastSyncResults[selectedDay];
    const freeBinStr = freeMask.toString(2).padStart(14, "0");
    let freeBitsHtml = "";
    for (let i = 13; i >= 0; i--) {
        const bit = freeBinStr.charAt(13 - i);
        const isFree = bit === "1";
        // 如果是 1 代表有空，以綠色亮起；如果是 0 代表忙碌，設為灰色 0
        freeBitsHtml += `<span class="${isFree ? '' : 'bit-zero'}">${bit}</span>`;
    }

    // 4. 計算文字報告
    const freeSlotsTextList = [];
    for (let i = 0; i < 14; i++) {
        if (freeMask & (1 << i)) {
            freeSlotsTextList.push(TIME_SLOTS[i].name);
        }
    }

    let reportSummary = "";
    if (freeSlotsTextList.length > 0) {
        reportSummary = `${DAY_LABELS[selectedDay]} 大家都有空的時段為：<strong>${freeSlotsTextList.join("、")}</strong>，共 ${freeSlotsTextList.length} 個小時。`;
    } else {
        reportSummary = `${DAY_LABELS[selectedDay]} 很遺憾，大家找不到共同有空的討論時間。`;
    }

    resultArea.innerHTML = `
        <div class="result-row highlighted">
            <span class="log-label">共同空堂交集 (NOT)</span>
            <div class="log-binary-wrapper">${freeBitsHtml}</div>
            <span class="log-binary-val">(十進位: ${freeMask})</span>
        </div>
        <div class="result-text-summary">
            💡 ${reportSummary}
        </div>
    `;
}

/**
 * 控制台演算法正確性自測函數
 * 用於在無前端介面時，自動驗證位元排程比對之正確性
 */
function runAlgorithmSelfTest() {
    console.log("====================================================");
    console.log("   TeamSync 跨堂排程引擎控制台自測 (Self-Test)");
    console.log("   架構工程師 (Software Architect) 核心演算法驗證");
    console.log("====================================================");

    const groupId = "G001";
    const group = GROUPS_DATA.find(g => g.id === groupId);
    
    console.log(`【測試小組】: ${group.name}`);
    console.log(`【成員數】: ${group.members.length} 人`);

    const syncResult = calculateGroupSync(groupId);
    
    DAYS.forEach(day => {
        const freeMask = syncResult[day];
        console.log(`  週${day.toUpperCase()} 共同空堂遮罩: 0b${freeMask.toString(2).padStart(14, '0')} (十進位: ${freeMask})`);
    });

    const expectedMonFreeMask = 15603; // ~780 & 0x3FFF
    const monPass = syncResult["mon"] === expectedMonFreeMask;
    
    console.log("----------------------------------------------------");
    console.log(`【驗證】週一比對結果: ${monPass ? "🏆 成功 (PASS)" : "❌ 失敗 (FAIL)"}`);
    console.log("====================================================");
}
