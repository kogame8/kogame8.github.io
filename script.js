let mainStat = 0;
let subStat = 0;
let remaining = 20;

// 초기화 권유 기준표
const resetConditions = {
  10: { 0: 9, 1: 8, 2: 7, 4: 6, 6: 5, 9: 4, 10: 3 },
  9: { 0: 8, 1: 7, 2: 6, 4: 5, 7: 4, 10: 3 },
  8: { 0: 7, 1: 6, 3: 5, 6: 4, 10: 3 },
  7: { 0: 6, 1: 5, 3: 4, 8: 3, 10: 2 },
  6: { 0: 5, 1: 4, 5: 3, 9: 2, 10: 1 },
};

function updateUI() {
  document.getElementById("mainStat").textContent = mainStat;
  document.getElementById("subStat").textContent = subStat;
  document.getElementById("remaining").textContent = remaining;

  const goal = parseInt(document.getElementById("goalLevel").value);
  const messageEl = document.getElementById("message");
  messageEl.textContent = "";
  messageEl.style.color = "green";

  const conditions = resetConditions[goal];

  // 🎉 목표 도달
  if (mainStat >= goal) {
    messageEl.textContent = `🎉 목표 메인레벨 ${goal}에 도달했습니다!`;
    messageEl.style.color = "green";
    return;
  }

  // ❌ 최종 실패 조건
  if (remaining === 0 && mainStat < goal) {
    messageEl.textContent = `❌ 목표 메인레벨 ${goal} 미달성: 초기화 하십시오.`;
    messageEl.style.color = "red";
    return;
  }

  // ⚠ 초기화 권유: 조건 목록 중 현재 남은강화 이하 조건 중 가장 큰 기준 찾기
  if (conditions) {
    const validKeys = Object.keys(conditions)
      .map(Number)
      .filter((k) => remaining <= k) // 현재 남은 강화보다 큰 기준은 제외
      .sort((a, b) => a - b); // 가장 작은 값 우선

    for (let key of validKeys) {
      const requiredMain = conditions[key];
      if (mainStat <= requiredMain) {
        messageEl.textContent = `⚠ 메인스탯이 ${mainStat}레벨로 낮습니다. 초기화를 고려해보세요. (기준: 남은 ${key}강 이하 시 메인 ${requiredMain + 1} 이상 필요)`;
        messageEl.style.color = "orange";
        break;
      }
    }
  }
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