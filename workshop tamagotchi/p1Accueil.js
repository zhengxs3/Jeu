const totalBlocks = 8; 
let activeBlocksFood = 3;
let activeBlocksSport = 3;
let activeBlocksHealth = 3;

const food = document.getElementById('progress-food');
const sport = document.getElementById('progress-sport');
const health = document.getElementById('progress-health');

function initProgress() {
    updateProgress(food, activeBlocksFood);
    updateProgress(sport, activeBlocksSport);
    updateProgress(health, activeBlocksHealth);
}

document.addEventListener('DOMContentLoaded', initProgress);

/***************************************按钮逻辑**************************************************************/

function updateProgress(element, activeBlocks) {
    element.innerHTML = ''; // 清空当前的进度

    const progressColor = activeBlocks > 2 ? 'green' : 'red';
    element.style.borderColor = progressColor; 

    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.classList.add('progress-block');
        if (i < activeBlocks) {
            block.classList.add('active');
            block.style.backgroundColor = progressColor;
        }
        element.appendChild(block);
    }
}

// 跳转到运动页面
function exercise() {
    window.location.href = 'p2Sport.html';    
}

// 增加食物进度块
function feed() {
    if (activeBlocksFood < totalBlocks) {
        activeBlocksFood += 1;
        updateProgress(food, activeBlocksFood);
    }
}

// 增加健康进度块
function heal() {
    if (activeBlocksHealth < totalBlocks) {
        activeBlocksHealth += 1;
        updateProgress(health, activeBlocksHealth);
    }
}

/***************************************时间显示逻辑**************************************************************/

function showTime() {
    let now = new Date();
    let time = now.toLocaleTimeString(); // 使用更简洁的时间格式化方式
    console.log(time);
    setTimeout(showTime, 1000); // 每秒更新一次时间
}

/***************************************进度减少逻辑**************************************************************/

function decreaseFeed() {
    if (activeBlocksFood > 0) activeBlocksFood--;
    if (activeBlocksSport > 0) activeBlocksSport--;
    if (activeBlocksHealth > 0) activeBlocksHealth--;

    updateProgress(food, activeBlocksFood);
    updateProgress(sport, activeBlocksSport);
    updateProgress(health, activeBlocksHealth);

    setTimeout(decreaseFeed, 18000); // 每 18 秒减少一次进度块
}

showTime();
decreaseFeed();

/***************************************处理游戏得分逻辑**********************************************************/

// 从 sessionStorage 中读取用户数据
const userData = JSON.parse(sessionStorage.getItem('userData')) || {};

if (userData && typeof userData.score === 'number') {
    console.log('User game:', userData.game);
    console.log('User score:', userData.score);

    // 根据游戏得分更新运动进度
    if (userData.score >= 5) {
        if (activeBlocksSport < totalBlocks) {
            activeBlocksSport += 1;
            updateProgress(sport, activeBlocksSport);
        }
    }
} else {
    console.log('User data or score is not available');
}

/********************************************************************************************/

