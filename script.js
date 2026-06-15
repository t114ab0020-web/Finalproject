// ==========================================================================
// TeamSync 核心排程運算引擎 (Core Scheduler Logic Engine)
// 設計師：架構工程師 (Software Architect)
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

/**
 * 計算單一學生在特定天數的忙碌遮罩 (Busy Mask)
 * 運用位元或運算 (Bitwise OR) 合併必修課表與自訂忙碌時間
 * 
 * @param {string} studentId 學生 ID
 * @param {string} day 星期 (mon, tue, wed, thu, fri)
 * @param {boolean} includeClub 是否包含社團時間
 * @param {boolean} includeWork 是否包含打工時間
 * @returns {number} 14-bit 忙碌遮罩整數
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
 * 核心演算法：計算小組成員的共同空堂遮罩 (Group Free Mask)
 * 
 * 演算法說明：
 * 1. 取得所有小組成員。
 * 2. 遍歷週一至週五，對所有成員的 Busy Mask 進行位元或 (OR) 合併，求出小組忙碌聯集。
 * 3. 對忙碌聯集進行位元求反 (NOT)，並以 0x3FFF 進行遮罩，求出所有人皆有空的交集。
 * 
 * @param {string} groupId 小組 ID
 * @returns {Object} 包含各日空堂遮罩的物件，例如 { mon: 15603, tue: ... }
 */
function calculateGroupSync(groupId) {
    const group = GROUPS_DATA.find(g => g.id === groupId);
    if (!group) return null;

    const members = group.members;
    const result = {};

    DAYS.forEach(day => {
        let groupBusyMask = 0;
        members.forEach(memberId => {
            // 預設將打工與社團時間納入比對
            const memberBusy = getStudentBusyMask(memberId, day, true, true);
            groupBusyMask |= memberBusy;
        });

        // 取反並使用 0x3FFF (14 個 1) 限制為 14 位無號整數，求出交集
        const groupFreeMask = (~groupBusyMask) & 0x3FFF;
        result[day] = groupFreeMask;
    });

    return result;
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

    // 測試小組 G001 (組員：王小明, 李小華, 張大同)
    const groupId = "G001";
    const group = GROUPS_DATA.find(g => g.id === groupId);
    
    console.log(`【測試小組】: ${group.name}`);
    console.log(`【成員數】: ${group.members.length} 人`);

    const syncResult = calculateGroupSync(groupId);
    
    DAYS.forEach(day => {
        const freeMask = syncResult[day];
        console.log(`  週${day.toUpperCase()} 共同空堂遮罩: 0b${freeMask.toString(2).padStart(14, '0')} (十進位: ${freeMask})`);
    });

    // 驗證週一比對結果是否正確
    // 王小明週一忙碌: 268 (0b00010000001100)
    // 李小華週一忙碌: 780 (0b00110000001100)
    // 張大同週一忙碌: 12  (0b00000000001100)
    // 合併忙碌聯集: 780 (0b00110000001100)
    // 取反交集: ~780 & 0x3FFF = 15603 (0b11110011110011)
    const expectedMonFreeMask = 15603;
    const monPass = syncResult["mon"] === expectedMonFreeMask;
    
    console.log("----------------------------------------------------");
    console.log(`【驗證】週一比對結果: ${monPass ? "🏆 成功 (PASS)" : "❌ 失敗 (FAIL)"}`);
    console.log("====================================================");
}

// 載入時自動執行測試
runAlgorithmSelfTest();


// ==========================================
// UI 狀態變數與渲染引擎 (UI Render Engine)
// ==========================================

const currentUser = "S001";
let currentGroup = "G001";
let selectedMembers = ["S001"];
let hasRunSync = false; 

const UI_DAYS = ["mon", "tue", "wed", "thu", "fri"];
const DAYS_MAP = { mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六', sun: '日' };
const COLORS = ['primary', 'secondary', 'tertiary'];

// --- Helper Functions ---

function updateTabActive(index) {
    for (let i = 0; i <= 4; i++) {
        const btn = document.getElementById(`tab-btn-${i}`);
        const icon = btn?.querySelector(".tab-icon");
        if (!btn) continue;

        btn.classList.remove(
            "text-primary",
            "bg-primary-container/20",
            "dark:text-primary-fixed-dim"
        );
        btn.classList.add("text-on-surface-variant");

        if (icon) {
            icon.classList.remove("icon-fill", "custom-style-2");
            icon.classList.add("custom-style-1");
        }

        if (i === index) {
            btn.classList.add(
                "text-primary",
                "bg-primary-container/20",
                "dark:text-primary-fixed-dim"
            );
            btn.classList.remove("text-on-surface-variant");

            if (icon) {
                icon.classList.add("icon-fill", "custom-style-2");
                icon.classList.remove("custom-style-1");
            }
        }
    }
}


function calculateSelectedMembersFreeTime(memberIds) {
    const result = {};
    DAYS.forEach(day => {
        let groupBusyMask = 0;
        memberIds.forEach(memberId => {
            const memberBusy = getStudentBusyMask(memberId, day, true, true);
            groupBusyMask |= memberBusy;
        });
        const groupFreeMask = (~groupBusyMask) & 0x3FFF;
        result[day] = groupFreeMask;
    });
    return result;
}





// 將數字轉成節次陣列 (支援到 14 節)
function bitmaskToPeriods(mask) {
    const periods = [];
    for (let i = 0; i < TIME_SLOTS.length; i++) {
        if ((mask & (1 << i)) !== 0) {
            periods.push({
                index: i,
                name: TIME_SLOTS[i].name,
                time: TIME_SLOTS[i].time
            });
        }
    }
    return periods;
}

// 格式化時間區塊文字
function formatScheduleTime(scheduleMasks) {
    const parts = [];
    for (const [day, mask] of Object.entries(scheduleMasks)) {
        if (mask > 0) {
            const periods = bitmaskToPeriods(mask);
            const periodNames = periods.map(p => p.name.replace('第 ', '').replace(' 節', ''));
            parts.push(`${DAYS_MAP[day]} ${periodNames.join(',')}`);
        }
    }
    return parts.join(' / ');
}

// --- Render Functions ---

function getShortCourseName(courseName) {
    if (!courseName) return "";
    return courseName.replace(/\s*\(.+?\)\s*/g, "").trim();
}

function getCourseNameAtSlot(day, maskVal) {
    const course = COURSES_DATA.find(course => (course.schedule[day] & maskVal) !== 0);
    if (!course) return "上課";
    return getShortCourseName(course.name);
}


function renderHome() {
    const coursesContainer = document.getElementById('home-courses-container');
    const groupsContainer = document.getElementById('home-groups-container');
    if (!coursesContainer || !groupsContainer) return;

    const userGroups = GROUPS_DATA.filter(g => g.members.includes(currentUser));
    const courseIds = [...new Set(userGroups.map(g => g.courseId))];
    const userCourses = COURSES_DATA.filter(c => courseIds.includes(c.id));

    coursesContainer.innerHTML = '';
    userCourses.forEach((course, i) => {
        const color = COLORS[i % COLORS.length];
        const timeStr = formatScheduleTime(course.schedule);
        coursesContainer.innerHTML += `
        <div class="snap-start shrink-0 w-[240px] bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between h-[140px] border border-surface-variant/50">
            <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-${color}"></div>
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="font-label-md text-label-md bg-${color}/10 text-${color} px-2 py-[2px] rounded-full">課程</span>
                </div>
                <h4 class="font-body-lg text-body-lg font-bold text-on-surface mb-1 truncate">${course.name}</h4>
            </div>
            <div class="flex items-center gap-1.5 text-on-surface-variant bg-surface-container-low/50 w-fit px-2 py-1 rounded-md">
                <span class="material-symbols-outlined text-[16px]">schedule</span>
                <span class="font-label-md text-label-md">${timeStr}</span>
            </div>
        </div>`;
    });

    groupsContainer.innerHTML = '';
    userGroups.slice(0, 3).forEach(group => {
        groupsContainer.innerHTML += `
        <div class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden flex items-center gap-4 border border-surface-variant/50 hover:bg-surface-container-low transition-colors cursor-pointer active:scale-[0.98]" onclick="openGroup('${group.id}')">
            <div class="absolute left-0 top-0 bottom-0 w-[4px] bg-primary-fixed-dim"></div>
            <div class="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 relative">
                <span class="material-symbols-outlined">group</span>
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="font-body-lg text-body-lg font-bold text-on-surface truncate">${group.name}</h4>
                <p class="font-body-md text-body-md text-on-surface-variant truncate mt-0.5">${group.members.length} 位成員</p>
            </div>
            <div class="flex-shrink-0 text-outline-variant">
                <span class="material-symbols-outlined">chevron_right</span>
            </div>
        </div>`;
    });
}

function renderCourses() {
    const listContainer = document.getElementById('courses-list-container');
    if (!listContainer) return;

    const userGroups = GROUPS_DATA.filter(g => g.members.includes(currentUser));
    const courseIds = [...new Set(userGroups.map(g => g.courseId))];
    const userCourses = COURSES_DATA.filter(c => courseIds.includes(c.id));

    listContainer.innerHTML = '';
    userCourses.forEach(course => {
        const groupsInCourse = GROUPS_DATA.filter(g => g.courseId === course.id);
        
        listContainer.innerHTML += `
        <div class="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant/30 relative overflow-hidden mb-4 shadow-sm">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">${course.instructor}</span>
                    </div>
                    <h3 class="font-headline-md text-headline-md text-on-surface">${course.name}</h3>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-sm">groups</span>
                    </div>
                    <div>
                        <p class="font-label-md text-label-md text-on-surface-variant">共計小組</p>
                        <p class="font-body-md text-body-md font-semibold">${groupsInCourse.length} 個</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
                        <span class="material-symbols-outlined text-sm">schedule</span>
                    </div>
                    <div>
                        <p class="font-label-md text-label-md text-on-surface-variant">上課時間</p>
                        <p class="font-body-md text-body-md font-semibold truncate max-w-[100px]">${formatScheduleTime(course.schedule)}</p>
                    </div>
                </div>
            </div>
            ${groupsInCourse.map(g => `
                <hr class="border-outline-variant/30 mb-4"/>
                <div class="bg-surface-container-low rounded-lg p-3 border border-outline-variant/20 flex justify-between items-center mb-2">
                    <h4 class="font-body-md text-body-md font-bold text-primary flex items-center gap-1">
                        <span class="material-symbols-outlined text-[18px]">group_work</span>
                        ${g.name}
                    </h4>
                    <button onclick="openGroup('${g.id}')" class="px-3 py-1 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors">
                        進入討論
                    </button>
                </div>
            `).join('')}
        </div>`;
    });
}

function renderGroupMembers() {
    const container = document.getElementById('group-members-container');
    const groupNameEl = document.getElementById('selected-group-name');
    const selectedCountEl = document.getElementById('selected-count');
    if (!container) return;

    const group = GROUPS_DATA.find(g => g.id === currentGroup);
    if (groupNameEl) groupNameEl.textContent = group ? group.name : '選擇成員';

    container.innerHTML = '';
    
    if (!selectedMembers.includes(currentUser)) {
        selectedMembers.push(currentUser);
    }

    if (selectedCountEl) {
        selectedCountEl.textContent = selectedMembers.filter(id => id !== currentUser).length;
    }

    if (!group) return;

    const members = group.members.map(id => STUDENTS_DATA.find(s => s.id === id)).filter(Boolean);

    members.forEach(member => {
        const isMe = member.id === currentUser;
        // The original script didn't use checkboxes, but user says "保留 checkbox, 勾選狀態要影響". Wait, user says "但共同空堂計算本身要用 calculateGroupSync(currentGroup)". 
        // So the calculation is for the whole group. The checkbox might just be UI dummy or we can leave it there.
        const isChecked = selectedMembers.includes(member.id);
        
        container.innerHTML += `
        <label class="bg-surface-container-lowest rounded-xl p-3 flex items-center justify-between shadow-sm border border-surface-variant/50 cursor-pointer hover:bg-surface-container-low transition-colors select-none ${isChecked ? 'ring-2 ring-primary border-transparent' : ''}">
            <div class="flex items-center gap-3">
                <div class="relative">
                    <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg">
                        ${member.name[0]}
                    </div>
                </div>
                <div>
                    <h4 class="font-body-lg text-body-lg font-bold text-on-surface">
                        ${member.name} ${isMe ? '<span class="text-xs font-normal text-on-surface-variant">(自己)</span>' : ''}
                    </h4>
                    <p class="font-body-md text-body-md text-on-surface-variant">${member.email}</p>
                </div>
            </div>
            <div class="relative flex items-center">
                <input type="checkbox" class="member-checkbox peer sr-only" value="${member.id}" ${isChecked ? 'checked' : ''} ${isMe ? 'disabled' : ''} onchange="toggleMember('${member.id}', this)"/>
                <div class="w-6 h-6 rounded border-2 border-outline-variant peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined text-on-primary text-[18px] opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                </div>
            </div>
        </label>`;
    });

    updateScheduleButton();
}

window.toggleMember = function(id, el) {
    if (id === currentUser) return; 
    if (el.checked) {
        if (!selectedMembers.includes(id)) selectedMembers.push(id);
    } else {
        selectedMembers = selectedMembers.filter(m => m !== id);
    }
    renderGroupMembers();
};

function updateScheduleButton() {
    const btn = document.getElementById('schedule-btn');
    if (!btn) return;
    if (selectedMembers.length > 1) {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('hover:bg-secondary');
        btn.onclick = () => switchTab(4);
    } else {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-secondary');
        btn.onclick = null;
    }
}

function renderSchedule() {
    const gridContainer = document.getElementById('schedule-grid-container');
    const ownerNameEl = document.getElementById('schedule-owner-name');
    if (!gridContainer) return;

    const user = STUDENTS_DATA.find(s => s.id === currentUser);
    if (ownerNameEl && user) ownerNameEl.textContent = `${user.name} 的課表`;

    const schedule = SCHEDULES_DATA[currentUser];
    if (!schedule) return;

    let html = `<div class="schedule-grid text-center text-xs">`;
    
    // Header
    html += `<div></div>`; 
    UI_DAYS.forEach(k => {
        html += `<div class="font-bold text-on-surface-variant py-2">${DAYS_MAP[k]}</div>`;
    });

    for (let i = 0; i < TIME_SLOTS.length; i++) {
        const slot = TIME_SLOTS[i];
        html += `<div class="flex flex-col items-end justify-center pr-2 font-label-md text-on-surface-variant h-10 whitespace-nowrap overflow-visible">
            <span>${slot.name}</span>
            <span class="text-[9px] opacity-60">${slot.time.split(' - ')[0]}</span>
        </div>`;
        const maskVal = 1 << i;

        UI_DAYS.forEach(day => {
            const hasClass = (schedule.classes && (schedule.classes[day] & maskVal)) > 0;
            const hasClub = (schedule.customBusy?.club?.schedule[day] & maskVal) > 0;
            const hasWork = (schedule.customBusy?.work?.schedule[day] & maskVal) > 0;

            let cellClass = "bg-surface-container rounded-md h-10 flex flex-col justify-center items-center overflow-hidden";
            let content = "";

            if (hasClass) {
                cellClass = "bg-primary-container text-on-primary-container rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                const cName = getCourseNameAtSlot(day, maskVal);
                content = `<span class="schedule-cell-label">${cName}</span>`;
            } else if (hasWork) {
                cellClass = "bg-error-container text-on-error-container rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                const wName = schedule.customBusy?.work?.name || "打工";
                content = `<span class="schedule-cell-label">${wName}</span>`;
            } else if (hasClub) {
                cellClass = "bg-tertiary-container text-on-tertiary-container rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                const clName = schedule.customBusy?.club?.name || "社團";
                content = `<span class="schedule-cell-label">${clName}</span>`;
            }

            html += `<div class="${cellClass}">${content}</div>`;
        });
    }

    html += `</div>`; 

    gridContainer.innerHTML = html;
    
}
function getCompareMemberIds() {
    const ids = [currentUser, ...selectedMembers];
    return [...new Set(ids)];
}

function getCompareMemberObjects() {
    return getCompareMemberIds().map(id => STUDENTS_DATA.find(s => s.id === id) || { id, name: id });
}

function groupConsecutiveSlots(day, freeMask) {
    const periods = bitmaskToPeriods(freeMask);
    if (periods.length === 0) return [];
    
    const grouped = [];
    let currentGroupList = [periods[0]];
    
    for (let i = 1; i < periods.length; i++) {
        if (periods[i].index === periods[i-1].index + 1) {
            currentGroupList.push(periods[i]);
        } else {
            grouped.push(currentGroupList);
            currentGroupList = [periods[i]];
        }
    }
    grouped.push(currentGroupList);
    return grouped;
}

function formatSlotRange(slotGroup) {
    if (!slotGroup || slotGroup.length === 0) return "";
    if (slotGroup.length === 1) return slotGroup[0].name;
    return `${slotGroup[0].name} - ${slotGroup[slotGroup.length - 1].name}`;
}

function formatSlotTimeRange(slotGroup) {
    const start = slotGroup[0].time.split(' - ')[0];
    const end = slotGroup[slotGroup.length - 1].time.split(' - ')[1];
    return `${start} - ${end}`;
}

function renderResultMembers() {
    const container = document.getElementById("sync-members-list");
    if (!container) return;
    container.innerHTML = "";
    
    const memberIds = getCompareMemberIds();
    
    memberIds.forEach(id => {
        const student = STUDENTS_DATA.find(s => s.id === id);
        const nameChar = student ? student.name.charAt(0) : "我";
        const isMe = id === currentUser;
        const bgClass = isMe ? "bg-[#3D786B] text-white" : "bg-surface-container-high text-on-surface-variant";
        
        container.innerHTML += `
            <div class="w-14 h-14 rounded-full ${bgClass} flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                ${isMe ? '我' : nameChar}
            </div>
        `;
    });
}

function renderSyncStatusCard() {
    const container = document.getElementById("sync-status-card");
    if (!container) return;
    
    const memberIds = getCompareMemberIds();
    const otherMembers = memberIds.filter(id => id !== currentUser);
    
    if (otherMembers.length === 0) {
        container.innerHTML = `
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative border border-surface-variant/50 mb-1">
                <div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-[32px] text-on-surface-variant">person_add</span>
                </div>
                <h3 class="font-headline-md text-headline-md font-bold text-on-surface mb-1">請先選擇至少一位組員</h3>
                <p class="font-body-md text-on-surface-variant text-center">到好友頁面勾選組員後，即可開始比對共同空堂。</p>
            </div>
            <div class="flex flex-col items-center gap-2">
                <button class="w-full bg-surface-container-high text-on-surface-variant font-headline-md text-headline-md py-4 rounded-xl flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                    <span class="material-symbols-outlined">how_to_reg</span>
                    一鍵喬時間
                </button>
            </div>
        `;
        return;
    }
    
    const names = getCompareMemberObjects().map(s => s.name).join('、');
    
    if (!hasRunSync) {
        container.innerHTML = `
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative border border-surface-variant/30 mb-1">
                <div class="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-[32px]">sync</span>
                </div>
                <h3 class="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary mb-1">準備比對</h3>
                <p class="font-body-md text-on-surface-variant text-center">已選擇 ${memberIds.length} 位成員，點擊下方按鈕開始比對共同空堂。</p>
            </div>
            <div class="flex flex-col items-center gap-2">
                <button onclick="hasRunSync = true; renderResultScreen();" class="w-full bg-[#3D786B] text-white font-headline-md text-headline-md py-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer hover:bg-[#2d584e]">
                    <span class="material-symbols-outlined">how_to_reg</span>
                    一鍵喬時間
                </button>
                <div class="flex items-center gap-1 text-on-surface-variant opacity-80 mt-1">
                    <span class="material-symbols-outlined text-[14px]">settings</span>
                    <p class="font-label-md text-[11px] uppercase tracking-wider">使用 Array / Bitwise 比對 ${TIME_SLOTS.length * 7} 個課表時段</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative border border-surface-variant/30 mb-1">
                <div class="relative w-24 h-24 flex items-center justify-center mb-2">
                    <div class="absolute inset-0 rounded-full border border-dashed border-outline-variant/50" style="padding: 4px;">
                        <div class="w-full h-full rounded-full border border-dashed border-outline-variant/30"></div>
                    </div>
                    <div class="w-14 h-14 rounded-full bg-[#00685F] flex items-center justify-center z-10 shadow-sm">
                        <span class="material-symbols-outlined text-white text-[28px]" style="font-variation-settings: 'FILL' 1;">check</span>
                    </div>
                </div>
                <h3 class="font-headline-lg-mobile text-headline-lg-mobile font-bold text-[#00685F] mb-1">比對完成</h3>
                <p class="font-body-md text-on-surface-variant text-center">已比對 ${memberIds.length} 位成員：${names}</p>
            </div>
            <div class="flex flex-col items-center gap-2">
                <button onclick="hasRunSync = true; renderResultScreen();" class="w-full bg-[#3D786B] text-white font-headline-md text-headline-md py-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer hover:bg-[#2d584e]">
                    <span class="material-symbols-outlined">how_to_reg</span>
                    一鍵喬時間
                </button>
                <div class="flex items-center gap-1 text-on-surface-variant opacity-80 mt-1">
                    <span class="material-symbols-outlined text-[14px]">settings</span>
                    <p class="font-label-md text-[11px] uppercase tracking-wider">使用 Array / Bitwise 比對 ${TIME_SLOTS.length * 7} 個課表時段</p>
                </div>
            </div>
        `;
    }
}

function renderFreeTimeScheduleGrid() {
    const container = document.getElementById("free-time-list");
    if (!container) return;
    container.innerHTML = "";
    
    if (!hasRunSync) return;

    const memberIds = getCompareMemberIds();
    const otherMembers = memberIds.filter(id => id !== currentUser);
    
    if (otherMembers.length === 0) {
        return;
    }
    
    const commonFreeTime = calculateSelectedMembersFreeTime(memberIds);
    let hasCommonFreeTime = false;

    DAYS.forEach(day => {
        if (commonFreeTime[day] > 0) hasCommonFreeTime = true;
    });

    if (!hasCommonFreeTime) {
        container.innerHTML = `
            <div class="mt-2 p-8 rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex flex-col items-center text-center gap-3">
                <div class="mb-1">
                    <span class="material-symbols-outlined text-on-surface-variant opacity-60 text-[32px]">event_busy</span>
                </div>
                <div>
                    <h4 class="font-bold text-on-surface text-lg">找不到共同空堂</h4>
                    <p class="font-body-md text-on-surface-variant mt-2 leading-relaxed">目前成員間沒有重疊的空閒時間。請嘗試減少比對人數，或私下聯繫組員協調討論時間。</p>
                </div>
            </div>
        `;
        return;
    }

    let recommendDay = null;
    let recommendStartIndex = -1;
    let recommendLength = 0;
    
    for (const day of UI_DAYS) {
        const mask = commonFreeTime[day];
        let currentStart = -1;
        let currentLength = 0;
        for (let i = 0; i < TIME_SLOTS.length; i++) {
            if ((mask & (1 << i)) !== 0) {
                if (currentLength === 0) currentStart = i;
                currentLength++;
                if (currentLength >= 2) {
                    recommendDay = day;
                    recommendStartIndex = currentStart;
                    recommendLength = currentLength;
                    break;
                }
            } else {
                currentLength = 0;
            }
        }
        if (recommendLength >= 2) break;
    }
    
    if (!recommendDay) {
        for (const day of UI_DAYS) {
            const mask = commonFreeTime[day];
            for (let i = 0; i < TIME_SLOTS.length; i++) {
                if ((mask & (1 << i)) !== 0) {
                    recommendDay = day;
                    recommendStartIndex = i;
                    recommendLength = 1;
                    break;
                }
            }
            if (recommendDay) break;
        }
    }

    let gridHtml = `
    <div class="result-schedule-wrapper">
        <div class="result-schedule-grid">
            <div class="result-schedule-header">時段</div>
    `;
    
    UI_DAYS.forEach(day => {
        gridHtml += `<div class="result-schedule-header">${DAYS_MAP[day]}</div>`;
    });
    
    for (let i = 0; i < TIME_SLOTS.length; i++) {
        const slot = TIME_SLOTS[i];
        gridHtml += `
            <div class="result-schedule-time">
                <span style="font-weight:700">${slot.name}</span>
                <span style="font-size:9px; opacity:0.8">${slot.time.split(' - ')[0]}</span>
            </div>
        `;
        
        UI_DAYS.forEach(day => {
            const isFree = (commonFreeTime[day] & (1 << i)) !== 0;
            
            let isRecommend = false;
            if (day === recommendDay && i >= recommendStartIndex && i < recommendStartIndex + recommendLength) {
                isRecommend = true;
            }
            
            if (isFree) {
                let badgeHtml = isRecommend && i === recommendStartIndex ? `<div class="result-recommend-badge">推薦</div>` : '';
                gridHtml += `
                    <div class="result-schedule-cell free">
                        <div class="flex flex-col items-center">
                            <span>有空</span>
                            ${badgeHtml}
                        </div>
                    </div>
                `;
            } else {
                gridHtml += `<div class="result-schedule-cell busy">忙碌</div>`;
            }
        });
    }
    
    gridHtml += `
        </div>
    </div>
    `;
    
    container.innerHTML = gridHtml;
}
function renderResultScreen() {
    renderResultMembers();
    renderSyncStatusCard();
    renderFreeTimeScheduleGrid();
}


function openGroup(groupId) {
    currentGroup = groupId;
    selectedMembers = [currentUser];
    renderGroupMembers();
    switchTab(2);
}

function switchTab(index) {
    const screens = ['home-screen', 'courses-screen', 'group-screen', 'schedule-screen', 'result-screen'];
    
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden-screen');
    });
    
    const targetScreen = document.getElementById(screens[index]);
    if (targetScreen) {
        targetScreen.classList.remove('hidden-screen');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    updateTabActive(index);

    if (index === 4) {
        hasRunSync = false;
        renderResultScreen();
    }
}

// ==========================================
// 4. Initialization (initApp / DOMContentLoaded)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    renderHome();
    renderCourses();
    renderGroupMembers();
    renderSchedule();
    switchTab(0);
});
