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

    if (sch.customBusy && sch.customBusy.extra) {
        sch.customBusy.extra.forEach(item => {
            if (item.day === day) {
                mask |= item.mask;
            }
        });
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

function getShortGroupName(groupName) {
    if (!groupName) return "小組討論";
    return groupName
        .replace(/\s*-\s*/g, " ")
        .replace("第一討論小組", "討論")
        .replace("奇蹟前後端小組", "討論")
        .trim();
}

function getScheduledMeetingsForStudent(studentId, excludeGroupId = null) {
    const meetings = [];
    Object.values(GROUP_SYNC_STATE).forEach(state => {
        if (!state || !state.voteEnded || !state.finalMeetingOptions || state.finalMeetingOptions.length === 0) return;
        if (excludeGroupId && state.groupId === excludeGroupId) return;
        
        const group = GROUPS_DATA.find(g => g.id === state.groupId);
        if (!group) return;

        const compareMembers = state.selectedMembers || [];
        const isRelated = group.members.includes(studentId) || compareMembers.includes(studentId);
        
        if (!isRelated) return;
        
        state.finalMeetingOptions.forEach(option => {
            meetings.push({
                id: `${state.groupId}-${option.id}`,
                groupId: state.groupId,
                groupName: group.name,
                courseId: group.courseId,
                day: option.day,
                slotIndexes: option.slotIndexes || [],
                label: option.label,
                timeLabel: option.timeLabel
            });
        });
    });
    return meetings;
}

function getStudentBusyMaskWithMeetings(studentId, day, excludeGroupId = null) {
    let mask = getStudentBusyMask(studentId, day, true, true);
    const meetings = getScheduledMeetingsForStudent(studentId, excludeGroupId);
    
    meetings.forEach(meeting => {
        if (meeting.day === day && Array.isArray(meeting.slotIndexes)) {
            meeting.slotIndexes.forEach(index => {
                mask |= (1 << index);
            });
        }
    });
    return mask;
}

function calculateSelectedMembersFreeTime(memberIds) {
    const result = {};
    DAYS.forEach(day => {
        let groupBusyMask = 0;
        memberIds.forEach(memberId => {
            const memberBusy = getStudentBusyMaskWithMeetings(memberId, day, currentGroup);
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
            ${groupsInCourse.map(g => {
                const savedState = GROUP_SYNC_STATE[g.id];
                let meetingInfoHtml = "";
                if (savedState && savedState.voteEnded && savedState.finalMeetingOptions && savedState.finalMeetingOptions.length > 0) {
                    const meetingTimesHtml = savedState.finalMeetingOptions
                        .map(opt => `<div class="text-sm font-medium mt-1">${formatMeetingOptionDisplay(opt)}</div>`)
                        .join("");
                    meetingInfoHtml = `
                    <div class="mt-2 p-2 bg-primary-container/20 rounded-md border border-primary/20">
                        <div class="flex items-center gap-1 text-primary text-xs font-bold mb-1">
                            <span class="material-symbols-outlined text-[14px]">event_available</span>
                            已排定
                        </div>
                        ${meetingTimesHtml}
                    </div>`;
                }

                return `
                <hr class="border-outline-variant/30 mb-4"/>
                <div class="bg-surface-container-low rounded-lg p-3 border border-outline-variant/20 mb-2">
                    <div class="flex justify-between items-center">
                        <h4 class="font-body-md text-body-md font-bold text-primary flex items-center gap-1">
                            <span class="material-symbols-outlined text-[18px]">group_work</span>
                            ${g.name}
                        </h4>
                        <button onclick="openGroup('${g.id}')" class="px-3 py-1 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors">
                            進入討論
                        </button>
                    </div>
                    ${meetingInfoHtml}
                </div>`;
            }).join('')}
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
    
    // 插入「已決定討論時間」提示
    const savedState = GROUP_SYNC_STATE[currentGroup];
    if (savedState && savedState.voteEnded && savedState.finalMeetingOptions && savedState.finalMeetingOptions.length > 0) {
        const meetingTimes = savedState.finalMeetingOptions
            .map(opt => formatMeetingOptionDisplay(opt))
            .join('<br>');
        container.innerHTML += `
        <div class="mb-4 p-4 bg-primary-container/20 rounded-xl border border-primary/20 text-center">
            <h4 class="font-body-md text-primary font-bold mb-1">本組已決定討論時間：</h4>
            <p class="font-body-lg text-on-surface font-semibold mt-2">${meetingTimes}</p>
        </div>`;
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
    saveCurrentGroupSyncState();
    renderGroupMembers();
};

function updateScheduleButton() {
    const btn = document.getElementById('schedule-btn');
    if (!btn) return;
    
    const savedState = GROUP_SYNC_STATE[currentGroup];
    const isFinished = savedState && savedState.voteEnded && savedState.finalMeetingOptions && savedState.finalMeetingOptions.length > 0;
    
    if (isFinished) {
        btn.innerHTML = `<span class="material-symbols-outlined">visibility</span> 查看喬時間結果`;
    } else {
        btn.innerHTML = `<span class="material-symbols-outlined">sync</span> 準備喬時間`;
    }
    
    if (selectedMembers.length > 1 || isFinished) {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('hover:bg-secondary');
        btn.onclick = () => goToSyncFromGroup();
    } else {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-secondary');
        btn.onclick = null;
    }
}

function getCheckedMemberIdsFromGroupPage() {
    const checked = Array.from(document.querySelectorAll(".member-checkbox:checked"))
        .map(input => input.value);

    return [...new Set([currentUser, ...checked])];
}

function goToSyncFromGroup() {
    if (!currentGroup) return;

    const savedState = GROUP_SYNC_STATE[currentGroup];
    const hasFinalResult =
        savedState &&
        savedState.voteEnded &&
        savedState.finalMeetingOptions &&
        savedState.finalMeetingOptions.length > 0;

    if (hasFinalResult) {
        loadGroupSyncState(currentGroup);
        switchTab(4, { preserveState: true });
        return;
    }

    selectedMembers = getCheckedMemberIdsFromGroupPage();

    if (selectedMembers.filter(id => id !== currentUser).length === 0) {
        renderGroupMembers();
        updateScheduleButton();
        return;
    }

    resetVoteState();
    hasRunSync = false;
    currentFreeTimeResult = null;

    saveCurrentGroupSyncState();
    switchTab(4, { preserveState: true });
}

function renderSchedule() {
    const gridContainer = document.getElementById('schedule-grid-container');
    const ownerNameEl = document.getElementById('schedule-owner-name');
    if (!gridContainer) return;

    const user = STUDENTS_DATA.find(s => s.id === currentUser);
    if (ownerNameEl && user) ownerNameEl.textContent = `${user.name} 的課表`;

    const schedule = SCHEDULES_DATA[currentUser];
    if (!schedule) return;

    const scheduledMeetings = getScheduledMeetingsForStudent(currentUser);

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

            const scheduledMeeting = scheduledMeetings.find(m => 
                m.day === day && m.slotIndexes && m.slotIndexes.includes(i)
            );

            let cellClass = "bg-surface-container rounded-md h-10 flex flex-col justify-center items-center overflow-hidden";
            let content = "";

            let hasExtra = false;
            let extraItem = null;
            if (schedule.customBusy?.extra) {
                const found = schedule.customBusy.extra.find(item => item.day === day && (item.mask & maskVal));
                if (found) {
                    hasExtra = true;
                    extraItem = found;
                }
            }

            if (hasClass) {
                cellClass = "bg-primary-container text-on-primary-container rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                const cName = getCourseNameAtSlot(day, maskVal);
                content = `<span class="schedule-cell-label">${cName}</span>`;
            } else if (scheduledMeeting) {
                cellClass = "schedule-meeting-cell rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                content = `<span class="schedule-cell-label" title="${scheduledMeeting.groupName}">${getShortGroupName(scheduledMeeting.groupName)}</span>`;
            } else if (hasExtra) {
                if (extraItem.type === 'club') {
                    cellClass = "bg-tertiary-container text-on-tertiary-container rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                } else if (extraItem.type === 'work') {
                    cellClass = "bg-error-container text-on-error-container rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                } else {
                    cellClass = "bg-surface-container-highest border border-surface-variant diagonal-stripes rounded-md h-10 flex flex-col justify-center items-center shadow-sm px-0.5";
                }
                content = `<span class="schedule-cell-label">${extraItem.name}</span>`;
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

function formatMeetingOptionDisplay(opt) {
    if (!opt) return "";

    if (opt.label && opt.timeLabel) {
        return `${opt.label}｜${opt.timeLabel}`;
    }

    if (opt.day && Array.isArray(opt.slotIndexes)) {
        const slotGroup = opt.slotIndexes.map(index => ({
            index,
            name: TIME_SLOTS[index].name,
            time: TIME_SLOTS[index].time
        }));

        return `週${DAYS_MAP[opt.day]} ${formatSlotRange(slotGroup)}｜${formatSlotTimeRange(slotGroup)}`;
    }

    return "尚未取得完整時間";
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
                <button onclick="runSyncAndGenerateVotes();" class="w-full bg-[#3D786B] text-white font-headline-md text-headline-md py-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer hover:bg-[#2d584e]">
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
                <button onclick="runSyncAndGenerateVotes();" class="w-full bg-[#3D786B] text-white font-headline-md text-headline-md py-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer hover:bg-[#2d584e]">
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
    renderVoteSettings();
    renderVoteSection();
}


function openGroup(groupId) {
    // 切換前，先讓 switchTab 保存當前 currentGroup 的狀態
    switchTab(2, { preserveState: true });
    
    currentGroup = groupId;
    
    const savedState = GROUP_SYNC_STATE[groupId];
    if (savedState) {
        loadGroupSyncState(groupId);
    } else {
        selectedMembers = [currentUser];
        resetVoteState();
        hasRunSync = false;
    }
    
    renderGroupMembers();
}

function switchTab(index, options = {}) {
    const preserveState = options.preserveState === true;
    
    if (currentGroup) {
        saveCurrentGroupSyncState();
    }
    
    const screens = ['home-screen', 'courses-screen', 'group-screen', 'schedule-screen', 'result-screen'];
    
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden-screen');
    });
    
    const notificationScreen = document.getElementById("notification-screen");
    if (notificationScreen) {
        notificationScreen.classList.add("hidden-screen");
    }
    
    document.querySelectorAll(".notification-card").forEach(card => {
        if (!card.closest("#notification-screen")) {
            card.remove();
        }
    });
    
    const targetScreen = document.getElementById(screens[index]);
    if (targetScreen) {
        targetScreen.classList.remove('hidden-screen');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    updateTabActive(index);

    if (index === 1) {
        renderCourses();
    }
    
    if (index === 2) {
        renderGroupMembers();
    }

    if (index === 3) {
        renderSchedule();
    }

    if (index === 4) {
        if (currentGroup && GROUP_SYNC_STATE[currentGroup]) {
            loadGroupSyncState(currentGroup);
        }
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
    renderFriendList();
    switchTab(0);
});

// ==========================================
// Friend Search and List Logic
// ==========================================

function isFriend(studentId) {
    const user = STUDENTS_DATA.find(s => s.id === currentUser);
    return user && user.friends.includes(studentId);
}

function addFriend(studentId) {
    const user = STUDENTS_DATA.find(s => s.id === currentUser);
    if (!user) return;
    if (!user.friends.includes(studentId) && studentId !== currentUser) {
        user.friends.push(studentId);
        renderFriendList();
        const keyword = document.getElementById("friend-search-input").value;
        if (keyword) renderFriendSearchResults(keyword);
    }
}

function renderFriendSearchResults(keyword) {
    const container = document.getElementById("friend-search-results");
    if (!container) return;
    
    keyword = keyword.trim().toLowerCase();
    if (!keyword) {
        container.innerHTML = "";
        container.classList.add("hidden");
        return;
    }
    
    const results = STUDENTS_DATA.filter(s => 
        s.name.toLowerCase().includes(keyword) || 
        s.email.toLowerCase().includes(keyword)
    );
    
    container.classList.remove("hidden");
    container.innerHTML = "";
    
    if (results.length === 0) {
        container.innerHTML = `<div class="bg-surface-container-lowest rounded-xl p-3 text-center text-on-surface-variant text-sm border border-surface-variant/30">找不到符合的同學</div>`;
        return;
    }
    
    results.forEach(student => {
        const isMe = student.id === currentUser;
        const alreadyFriend = isFriend(student.id);
        
        let btnHtml = "";
        if (isMe) {
            btnHtml = `<span class="text-xs text-outline font-medium px-2">這是你</span>`;
        } else if (alreadyFriend) {
            btnHtml = `<button disabled class="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-label-md cursor-not-allowed">已是好友</button>`;
        } else {
            btnHtml = `<button onclick="addFriend('${student.id}')" class="px-3 py-1 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-colors">加好友</button>`;
        }
        
        container.innerHTML += `
            <div class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex items-center justify-between border border-surface-variant/30">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                        ${student.name[0]}
                    </div>
                    <div>
                        <h4 class="font-body-md text-body-md font-bold text-on-surface">${student.name}</h4>
                        <p class="text-[11px] text-on-surface-variant">${student.email}</p>
                    </div>
                </div>
                <div>${btnHtml}</div>
            </div>
        `;
    });
}

function renderFriendList() {
    const container = document.getElementById("friend-list-container");
    if (!container) return;
    
    const user = STUDENTS_DATA.find(s => s.id === currentUser);
    if (!user || !user.friends || user.friends.length === 0) {
        container.innerHTML = `<div class="text-on-surface-variant text-sm py-4 text-center">目前尚未新增好友</div>`;
        return;
    }
    
    container.innerHTML = "";
    user.friends.forEach(friendId => {
        const friend = STUDENTS_DATA.find(s => s.id === friendId);
        if (!friend) return;
        
        container.innerHTML += `
            <div class="bg-surface-container-lowest rounded-xl p-card-padding shadow-sm flex items-center justify-between border-l-2 border-outline-variant">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-headline-md text-body-lg">
                        ${friend.name[0]}
                    </div>
                    <div>
                        <h3 class="font-headline-md text-body-md text-on-surface">${friend.name}</h3>
                    </div>
                </div>
            </div>
        `;
    });
}

// ==========================================
// Custom Busy Modal Logic
// ==========================================

function openBusyModal() {
    const modal = document.getElementById("busy-modal");
    if (modal) modal.classList.remove("hidden");
    const nameEl = document.getElementById("busy-name");
    if (nameEl) nameEl.value = "";
    const errorEl = document.getElementById("busy-error");
    if (errorEl) errorEl.classList.add("hidden");
}

function closeBusyModal() {
    const modal = document.getElementById("busy-modal");
    if (modal) modal.classList.add("hidden");
}

function createBusyMask(startIndex, endIndex) {
    let mask = 0;
    for (let i = startIndex; i <= endIndex; i++) {
        mask |= (1 << i);
    }
    return mask;
}

function saveCustomBusy() {
    const type = document.getElementById("busy-type").value;
    const name = document.getElementById("busy-name").value.trim();
    const day = document.getElementById("busy-day").value;
    const startIndex = parseInt(document.getElementById("busy-start").value);
    const endIndex = parseInt(document.getElementById("busy-end").value);
    const errorEl = document.getElementById("busy-error");
    
    if (!name) {
        errorEl.textContent = "請輸入名稱";
        errorEl.classList.remove("hidden");
        return;
    }
    if (!day) {
        errorEl.textContent = "請選擇星期";
        errorEl.classList.remove("hidden");
        return;
    }
    if (endIndex < startIndex) {
        errorEl.textContent = "結束節次不能早於開始節次";
        errorEl.classList.remove("hidden");
        return;
    }
    
    errorEl.classList.add("hidden");
    
    const mask = createBusyMask(startIndex, endIndex);
    
    const schedule = SCHEDULES_DATA[currentUser];
    if (!schedule.customBusy) schedule.customBusy = {};
    if (!schedule.customBusy.extra) schedule.customBusy.extra = [];
    
    schedule.customBusy.extra.push({
        id: "busy-" + Date.now(),
        type: type,
        name: name,
        day: day,
        mask: mask
    });
    
    closeBusyModal();
    renderSchedule();
    if(hasRunSync) renderResultScreen();
}

// ==========================================
// Vote Section Logic & State Persistence
// ==========================================

let GROUP_SYNC_STATE = {};
let currentFreeTimeResult = null;

function structuredCloneSafe(data) {
    return JSON.parse(JSON.stringify(data ?? null));
}

function saveCurrentGroupSyncState() {
    if (!currentGroup) return;

    GROUP_SYNC_STATE[currentGroup] = {
        groupId: currentGroup,
        selectedMembers: [...selectedMembers],
        hasRunSync: hasRunSync,
        freeTimeResult: structuredCloneSafe(currentFreeTimeResult),
        weeklyMeetingCount: weeklyMeetingCount,
        meetingDurationSlots: meetingDurationSlots,
        voteOptions: structuredCloneSafe(voteOptions),
        votesByOptionId: structuredCloneSafe(votesByOptionId),
        currentUserVotes: [...currentUserVotes],
        voteStarted: voteStarted,
        voteEnded: voteEnded,
        finalMeetingOptions: structuredCloneSafe(finalMeetingOptions),
        hasAttemptedGenerateVote: hasAttemptedGenerateVote
    };
}

function loadGroupSyncState(groupId) {
    const saved = GROUP_SYNC_STATE[groupId];
    if (!saved) return false;

    currentGroup = saved.groupId;
    selectedMembers = [...saved.selectedMembers];
    hasRunSync = saved.hasRunSync;
    currentFreeTimeResult = structuredCloneSafe(saved.freeTimeResult);
    weeklyMeetingCount = saved.weeklyMeetingCount;
    meetingDurationSlots = saved.meetingDurationSlots;
    voteOptions = structuredCloneSafe(saved.voteOptions);
    votesByOptionId = structuredCloneSafe(saved.votesByOptionId);
    currentUserVotes = [...saved.currentUserVotes];
    voteStarted = saved.voteStarted;
    voteEnded = saved.voteEnded;
    finalMeetingOptions = structuredCloneSafe(saved.finalMeetingOptions);
    hasAttemptedGenerateVote = saved.hasAttemptedGenerateVote;

    return true;
}

let voteOptions = [];
let votesByOptionId = {};
let currentUserVotes = []; // Array of voted option IDs
let weeklyMeetingCount = 1;
let meetingDurationSlots = 2;
let voteStarted = false;
let voteEnded = false;
let finalMeetingOptions = [];
let hasAttemptedGenerateVote = false;

function resetVoteState() {
    voteOptions = [];
    votesByOptionId = {};
    currentUserVotes = [];
    voteStarted = false;
    voteEnded = false;
    finalMeetingOptions = [];
    hasAttemptedGenerateVote = false;
}

function runSyncAndGenerateVotes() {
    hasRunSync = true;
    resetVoteState();
    
    const memberIds = getCompareMemberIds();
    currentFreeTimeResult = calculateSelectedMembersFreeTime(memberIds);
    
    saveCurrentGroupSyncState();
    renderResultScreen();
}

function createVoteOptions() {
    const weeklySelect = document.getElementById("weekly-meeting-count");
    const durationSelect = document.getElementById("meeting-duration-slots");
    
    if (weeklySelect) weeklyMeetingCount = parseInt(weeklySelect.value);
    if (durationSelect) meetingDurationSlots = parseInt(durationSelect.value);
    
    const memberIds = getCompareMemberIds();
    currentFreeTimeResult = calculateSelectedMembersFreeTime(memberIds);
    
    resetVoteState();
    hasAttemptedGenerateVote = true;
    
    // Remember the settings because reset cleared them!
    if (weeklySelect) weeklyMeetingCount = parseInt(weeklySelect.value);
    if (durationSelect) meetingDurationSlots = parseInt(durationSelect.value);
    
    voteOptions = generateVoteOptionsFromFreeTime(currentFreeTimeResult, weeklyMeetingCount, meetingDurationSlots);
    
    // Mock votes
    voteOptions.forEach(opt => {
        votesByOptionId[opt.id] = [];
    });
    
    const otherMembers = getCompareMemberIds().filter(id => id !== currentUser);
    otherMembers.forEach(mId => {
        if (voteOptions.length > 0 && Math.random() > 0.3) {
            // Give them some random votes up to weeklyMeetingCount
            for(let i=0; i<weeklyMeetingCount; i++) {
                if (Math.random() > 0.5) continue;
                const randomOpt = voteOptions[Math.floor(Math.random() * voteOptions.length)];
                if(!votesByOptionId[randomOpt.id].includes(mId)) {
                    votesByOptionId[randomOpt.id].push(mId);
                }
            }
        }
    });
    
    saveCurrentGroupSyncState();
    
    renderVoteSettings(); 
    renderVoteSection();
}

function generateVoteOptionsFromFreeTime(freeTimeResult, count, duration) {
    let options = [];
    
    for (const day of UI_DAYS) {
        const mask = freeTimeResult[day];
        if (mask > 0) {
            const grouped = groupConsecutiveSlots(day, mask);
            grouped.forEach(group => {
                if (group.length >= duration) {
                    for (let i = 0; i <= group.length - duration; i += duration) {
                        const chunk = group.slice(i, i + duration);
                        options.push({
                            id: `vote-${day}-${chunk[0].index}`,
                            day: day,
                            slotIndexes: chunk.map(g => g.index),
                            label: `週${DAYS_MAP[day]} ${formatSlotRange(chunk)}`,
                            timeLabel: formatSlotTimeRange(chunk),
                            length: chunk.length
                        });
                    }
                }
            });
        }
    }
    
    options.sort((a, b) => {
        const aStart = a.slotIndexes[0];
        const bStart = b.slotIndexes[0];
        const aIsNight = aStart > 9 ? 1 : 0;
        const bIsNight = bStart > 9 ? 1 : 0;
        
        if (aIsNight !== bIsNight) return aIsNight - bIsNight;
        const dayOrder = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
        if (dayOrder[a.day] !== dayOrder[b.day]) return dayOrder[a.day] - dayOrder[b.day];
        return aStart - bStart;
    });
    
    return options.slice(0, 6);
}

function getFinalMeetingOptions() {
    let optionsWithVotes = voteOptions.map(opt => ({
        ...opt,
        voteCount: votesByOptionId[opt.id] ? votesByOptionId[opt.id].length : 0
    }));

    const dayOrder = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
    
    optionsWithVotes.sort((a, b) => {
        if (b.voteCount !== a.voteCount) {
            return b.voteCount - a.voteCount;
        }
        if (dayOrder[a.day] !== dayOrder[b.day]) {
            return dayOrder[a.day] - dayOrder[b.day];
        }
        return a.slotIndexes[0] - b.slotIndexes[0];
    });

    return optionsWithVotes.slice(0, weeklyMeetingCount);
}

function startVote() {
    if (voteOptions.length === 0) return;
    voteStarted = true;
    voteEnded = false;
    
    const group = GROUPS_DATA.find(g => g.id === currentGroup) || { name: "目前小組" };
    addNotification(
        "vote-start",
        "小組討論時間投票開始",
        `${group.name} 已開始討論時間投票，請組員盡快投票。`,
        getCompareMemberIds()
    );
    
    renderVoteSettings();
    renderVoteSection();
}

function endVote() {
    voteEnded = true;
    finalMeetingOptions = getFinalMeetingOptions();
    
    const resultText = finalMeetingOptions.map(option => option.label).join("、");
    const group = GROUPS_DATA.find(g => g.id === currentGroup);
    const groupName = group ? group.name : "本小組";
    
    addNotification(
        "vote-result",
        "小組討論時間已決定",
        `${groupName} 的本週討論時間為：${resultText}。`,
        getCompareMemberIds()
    );
    
    saveCurrentGroupSyncState();
    renderVoteSection();
    renderSchedule();
}

function voteForOption(optionId) {
    if (!voteStarted || voteEnded) return;

    const isVoted = currentUserVotes.includes(optionId);
    
    if (isVoted) {
        // Cancel vote
        currentUserVotes = currentUserVotes.filter(id => id !== optionId);
        if (votesByOptionId[optionId]) {
            votesByOptionId[optionId] = votesByOptionId[optionId].filter(id => id !== currentUser);
        }
    } else {
        // Add vote
        if (currentUserVotes.length >= weeklyMeetingCount) {
            // Remove the oldest vote
            const oldVote = currentUserVotes.shift();
            if (votesByOptionId[oldVote]) {
                votesByOptionId[oldVote] = votesByOptionId[oldVote].filter(id => id !== currentUser);
            }
        }
        currentUserVotes.push(optionId);
        if (votesByOptionId[optionId]) {
            if (!votesByOptionId[optionId].includes(currentUser)) {
                votesByOptionId[optionId].push(currentUser);
            }
        }
    }
    
    renderVoteSection();
}

function renderVoteSettings() {
    const container = document.getElementById("vote-settings-container");
    if (!container) return;
    
    if (!hasRunSync) {
        container.classList.add("hidden");
        return;
    }
    
    container.classList.remove("hidden");
    
    const hasOptions = hasAttemptedGenerateVote;
    
    container.innerHTML = `
        <h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-surface-variant pb-2">投票設定</h2>
        <p class="font-body-md text-on-surface-variant mb-2">先設定本週需要討論的次數與每次討論長度，系統會從共同空堂中產生候選時段。</p>
        
        <div class="grid grid-cols-2 gap-3 mb-2">
            <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-on-surface-variant">一週討論幾次</label>
                <select id="weekly-meeting-count" class="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary" ${hasOptions ? 'disabled' : ''}>
                    <option value="1" ${weeklyMeetingCount === 1 ? 'selected' : ''}>1 次</option>
                    <option value="2" ${weeklyMeetingCount === 2 ? 'selected' : ''}>2 次</option>
                    <option value="3" ${weeklyMeetingCount === 3 ? 'selected' : ''}>3 次</option>
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-on-surface-variant">每次討論多久</label>
                <select id="meeting-duration-slots" class="w-full bg-surface-container-low border-none rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary" ${hasOptions ? 'disabled' : ''}>
                    <option value="1" ${meetingDurationSlots === 1 ? 'selected' : ''}>1 節</option>
                    <option value="2" ${meetingDurationSlots === 2 ? 'selected' : ''}>2 節</option>
                    <option value="3" ${meetingDurationSlots === 3 ? 'selected' : ''}>3 節</option>
                </select>
            </div>
        </div>
        <button onclick="createVoteOptions()" class="w-full ${hasOptions ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-primary text-on-primary'} font-headline-md text-body-lg py-3 rounded-xl mt-1 active:scale-95 transition-transform" ${voteStarted ? 'disabled style="opacity: 0.5;"' : ''}>
            ${hasOptions ? '重新產生投票選項' : '產生投票選項'}
        </button>
    `;
}

function renderVoteSection() {
    const container = document.getElementById("vote-options-container");
    if (!container) return;
    
    if (!hasRunSync || !hasAttemptedGenerateVote) {
        container.classList.add("hidden");
        return;
    }
    
    container.classList.remove("hidden");
    
    if (voteOptions.length === 0) {
        container.innerHTML = `
            <div class="mt-2 p-6 rounded-2xl bg-surface-container-lowest border border-surface-variant text-center shadow-sm">
                <span class="material-symbols-outlined text-outline text-3xl mb-2">error</span>
                <p class="font-body-md text-on-surface-variant">找不到符合討論長度的共同空堂，請改成較短討論時間或重新選擇組員。</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-surface-variant pb-2">投票選項</h2>
    `;
    
    if (!voteStarted) {
        html += `<button onclick="startVote()" class="w-full bg-primary text-on-primary font-headline-md text-body-lg py-3 rounded-xl mb-4 shadow-sm active:scale-95 transition-transform">開始投票</button>`;
    } else if (voteStarted && !voteEnded) {
        html += `<button onclick="endVote()" class="w-full bg-error text-on-error font-headline-md text-body-lg py-3 rounded-xl mb-4 shadow-sm active:scale-95 transition-transform">結束投票</button>`;
    } else {
        html += `<div class="w-full bg-surface-container-highest text-on-surface-variant font-headline-md text-body-lg py-3 rounded-xl mb-4 text-center">投票已結束</div>`;
    }
    
    html += `<div class="vote-section">`;
    
    const topIds = getFinalMeetingOptions().map(opt => opt.id);
    
    voteOptions.forEach(opt => {
        const votes = votesByOptionId[opt.id] ? votesByOptionId[opt.id].length : 0;
        const isSelected = currentUserVotes.includes(opt.id);
        const isFinal = voteEnded && finalMeetingOptions.some(f => f.id === opt.id);
        
        let btnHtml = "";
        if (!voteStarted) {
             btnHtml = `<button disabled class="px-4 py-2 bg-surface-container-highest text-on-surface-variant font-label-md rounded-lg cursor-not-allowed">尚未開始</button>`;
        } else if (voteEnded) {
             btnHtml = `<button disabled class="px-4 py-2 bg-surface-container-highest text-on-surface-variant font-label-md rounded-lg cursor-not-allowed border border-outline-variant">${isSelected ? '已投票' : '投票結束'}</button>`;
        } else {
             if (isSelected) {
                 btnHtml = `<button onclick="voteForOption('${opt.id}')" class="px-4 py-2 bg-primary-container text-on-primary-container font-label-md rounded-lg hover:bg-error-container hover:text-on-error-container active:scale-95 transition-all shadow-inner border border-primary">已投票 (取消)</button>`;
             } else {
                 btnHtml = `<button onclick="voteForOption('${opt.id}')" class="px-4 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary-container active:scale-95 transition-all shadow-sm">投這個</button>`;
             }
        }
        
        let badgeHtml = `<span class="vote-count-badge">${votes} 票</span>`;
        if (voteStarted && !voteEnded && votes > 0 && topIds.includes(opt.id)) {
            badgeHtml += `<span class="vote-count-badge top-vote-badge ml-2 inline-flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">star</span>目前最高票</span>`;
        } else if (voteEnded && isFinal) {
            badgeHtml += `<span class="vote-count-badge bg-primary text-white ml-2 inline-flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">event_available</span>已選為討論時間</span>`;
        }
        
        html += `
            <div class="vote-option-card ${isSelected || isFinal ? 'selected' : ''}">
                <div class="flex flex-col gap-1">
                    <h3 class="font-headline-md text-body-lg font-bold text-on-surface">${opt.label}</h3>
                    <p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">schedule</span>
                        ${opt.timeLabel}
                    </p>
                    <div class="mt-2 flex items-center">
                        ${badgeHtml}
                    </div>
                </div>
                <div>
                    ${btnHtml}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// ==========================================
// Notifications Logic
// ==========================================

let NOTIFICATIONS_DATA = [];
let preNotificationScreenId = "home-screen";

function addNotification(type, title, message, targetMemberIds) {
    const notif = {
        id: "N" + Date.now() + Math.floor(Math.random() * 1000),
        type: type,
        title: title,
        message: message,
        groupId: currentGroup,
        targetMemberIds: Array.from(new Set(targetMemberIds)),
        createdAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        read: false
    };
    NOTIFICATIONS_DATA.unshift(notif);
    updateNotificationBadges();
}

function updateNotificationBadges() {
    const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read && n.targetMemberIds.includes(currentUser)).length;
    const badges = document.querySelectorAll(".notification-badge");
    badges.forEach(badge => {
        if (unreadCount > 0) {
            badge.classList.remove("hidden");
            if (unreadCount > 1) {
                badge.classList.add("with-count");
                badge.textContent = unreadCount;
            } else {
                badge.classList.remove("with-count");
                badge.textContent = "";
            }
        } else {
            badge.classList.add("hidden");
        }
    });
}

function openNotifications() {
    document.querySelectorAll(".screen-content").forEach(el => {
        if(!el.classList.contains("hidden-screen") && el.id !== "notification-screen") {
            preNotificationScreenId = el.id;
        }
        el.classList.add("hidden-screen");
    });
    document.getElementById("notification-screen").classList.remove("hidden-screen");
    renderNotifications();
}

function closeNotifications() {
    document.getElementById("notification-screen").classList.add("hidden-screen");
    document.getElementById(preNotificationScreenId).classList.remove("hidden-screen");
}

function markNotificationRead(id) {
    const notif = NOTIFICATIONS_DATA.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        updateNotificationBadges();
        
        if (notif.type === "vote-start" || notif.type === "vote-result") {
            closeNotifications();
            switchTab(4, { preserveState: true }); 
        } else {
            renderNotifications();
        }
    }
}

function renderNotifications() {
    const container = document.getElementById("notifications-list");
    if (!container) return;
    
    const myNotifs = NOTIFICATIONS_DATA.filter(n => n.targetMemberIds.includes(currentUser));
    
    if (myNotifs.length === 0) {
        container.innerHTML = `
            <div class="mt-10 p-6 flex flex-col items-center justify-center text-on-surface-variant opacity-70">
                <span class="material-symbols-outlined text-5xl mb-2">notifications_off</span>
                <p>目前沒有通知</p>
            </div>
        `;
        return;
    }
    
    let html = "";
    myNotifs.forEach(n => {
        const typeBadgeClass = n.type === "vote-start" ? "vote-start" : "vote-result";
        const typeBadgeText = n.type === "vote-start" ? "投票開始" : "投票結果";
        
        html += `
            <div class="notification-card ${!n.read ? 'unread shadow-sm' : 'opacity-70'}" onclick="markNotificationRead('${n.id}')">
                <div class="flex justify-between items-start">
                    <span class="notification-type-badge ${typeBadgeClass}">${typeBadgeText}</span>
                    <span class="text-xs text-on-surface-variant">${n.createdAt}</span>
                </div>
                <h4 class="font-headline-md text-body-lg font-bold text-on-surface">${n.title}</h4>
                <p class="font-body-md text-body-md text-on-surface-variant">${n.message}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
