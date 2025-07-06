let mainStat = 0;
let subStat = 0;
let remaining = 20;

// 초기화 권유 기준표 (수정된 기준)
const resetConditions = {
  10: { 0: 9, 1: 8, 2: 7, 4: 6, 6: 5, 9: 4, 10: 3 },
  9: { 0: 8, 1: 7, 2: 6, 5: 5, 8: 4, 10: 3 },
  8: { 0: 7, 1: 6, 3: 5, 6: 4, 10: 3 },
  7: { 0: 6, 1: 5, 4: 4, 8: 3, 10: 2 },
  6: { 0: 5, 1: 4, 5: 3, 9: 2, 10: 1 },
};

// 메인 강화 확률 테이블
function getBaseMainProb(level) {
  if (level <= 2) return 35;
  if (level <= 6) return 20;
  if (level === 7) return 15;
  if (level === 8) return 10;
  if (level === 9) return 5;
  return 0;
}

// 썬데이 이벤트 적용된 확률
function getAdjustedMainProb(level, isSunday) {
  let base = getBaseMainProb(level);
  if (isSunday && level >= 5) {
    base = base * 1.2; // 20% 증가
  }
  return Math.min(base, 100); // 확률 최대 100 제한
}

function updateUI() {
  document.getElementById("mainStat").textContent = mainStat;
  document.getElementById("subStat").textContent = subStat;
  document.getElementById("remaining").textContent = remaining;

  const goal = parseInt(document.getElementById("goalLevel").value);
  const isSunday = document.getElementById("sundayEvent").checked;

  const messageEl = document.getElementById("message");
  const probEl = document.getElementById("mainProb");

  const currentProb = getAdjustedMainProb(mainStat, isSunday);
  probEl.textContent = currentProb.toFixed(1);

  messageEl.textContent = "";
  messageEl.style.color = "green";

  if (mainStat >= goal) {
  messageEl.textContent = `🎉 목표 메인레벨 ${goal}에 도달했습니다!`;
  messageEl.style.color = "green";
  document.getElementById("successRate").textContent = "100.0000"; // ✅ 확률도 반영
  return;
}

  if (remaining === 0 && mainStat < goal) {
    messageEl.textContent = `❌ 목표 메인레벨 ${goal} 미달성: 초기화 하십시오.`;
    messageEl.style.color = "red";
    return;
  }

  const conditions = resetConditions[goal];
  if (conditions) {
    const validKeys = Object.keys(conditions)
      .map(Number)
      .filter((k) => remaining <= k)
      .sort((a, b) => a - b);

    for (let key of validKeys) {
      const requiredMain = conditions[key];
      if (mainStat <= requiredMain) {
        messageEl.textContent = `⚠ 메인스탯이 ${mainStat}레벨로 낮습니다. 초기화를 고려해보세요. (기준: 남은 ${key}강 이하 시 메인 ${requiredMain + 1} 이상 필요)`;
        messageEl.style.color = "orange";
        break;
      }
    }
  }
 estimateSuccessRate();
}

function increaseMain() {
  if (remaining <= 0 || mainStat >= 10) return;
  mainStat++;
  remaining--;
  updateUI();
}

function increaseSub() {
  if (remaining <= 0) return;
  subStat++;
  remaining--;
  updateUI();
}

function reset() {
  mainStat = 0;
  subStat = 0;
  remaining = 20;
  document.getElementById("message").textContent = "";
  updateUI();
}

function estimateSuccessRate() {
  const trials = 10000;
  let success = 0;

  const goal = parseInt(document.getElementById("goalLevel").value);
  const isSunday = document.getElementById("sundayEvent").checked;

  // ✅ 현재 메인레벨이 목표 이상이면 바로 100%로 표시하고 종료
  if (mainStat >= goal) {
    document.getElementById("successRate").textContent = "100.0000";
    return;
  }

  for (let t = 0; t < trials; t++) {
    let tempMain = mainStat;
    let tempRemain = remaining;

    while (tempRemain > 0 && tempMain < 10) {
      const prob = getAdjustedMainProb(tempMain, isSunday) / 100;
      if (Math.random() < prob) {
        tempMain++;
      }
      tempRemain--;
    }

    if (tempMain >= goal) success++;
  }

  const result = (success / trials) * 100;
  const display = result === 100 ? "100.0000" : result.toFixed(4);

  document.getElementById("successRate").textContent = display;
}
window.onload = updateUI;