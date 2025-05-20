// プレイヤーのステータス
const player = {
    level: 1,
    maxHp: 100,
    hp: 100,
    attack: 10,
    exp: 0,
    nextExp: 100,
    isAttacking: false,
    
    // レベルアップ処理
    levelUp() {
        this.level++;
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.attack += 5;
        this.nextExp = Math.floor(this.nextExp * 1.5);
        updatePlayerStatus();
        displayMessage(`レベルアップ！ レベル${this.level}になった！`);
    },
    
    // 経験値獲得処理
    gainExp(amount) {
        this.exp += amount;
        updatePlayerStatus();
        
        if (this.exp >= this.nextExp) {
            this.levelUp();
        }
    },
    
    // 回復処理
    heal() {
        const healAmount = Math.floor(this.maxHp * 0.3);
        this.hp = Math.min(this.maxHp, this.hp + healAmount);
        updatePlayerStatus();
        displayMessage(`${healAmount}ポイント回復した！`);
    },
    
    // 剣を振る処理
    swingSword() {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        swordImage.classList.remove('hidden');
        swordImage.classList.add('sword-swing');
        
        // スライムへの攻撃判定
        setTimeout(() => {
            if (currentEnemy) {
                // プレイヤーの攻撃
                const playerDamage = Math.max(1, this.attack + Math.floor(Math.random() * 6) - 3);
                currentEnemy.hp = Math.max(0, currentEnemy.hp - playerDamage);
                
                // 敵のダメージアニメーション
                enemyImageElement.classList.add('damage');
                setTimeout(() => {
                    enemyImageElement.classList.remove('damage');
                }, 300);
                
                updateEnemyStatus();
                displayMessage(`${currentEnemy.name}に${playerDamage}ダメージを与えた！`);
                
                // 敵を倒した場合
                if (currentEnemy.hp <= 0) {
                    handleEnemyDefeat();
                } else {
                    // 少し待ってから敵の攻撃
                    setTimeout(() => {
                        if (currentEnemy) {
                            enemyAttack();
                        }
                    }, 1000);
                }
            }
            
            // 剣を元に戻す
            setTimeout(() => {
                swordImage.classList.remove('sword-swing');
                swordImage.classList.add('hidden');
                this.isAttacking = false;
            }, 300);
        }, 150);
    }
};

// 敵のクラス
class Enemy {
    constructor(name, hp, attack, exp, imageSrc) {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.attack = attack;
        this.exp = exp;
        this.imageSrc = imageSrc;
        this.isAttacking = false;
    }
    
    attackPlayer() {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        enemyContainer.classList.add('enemy-attack');
        
        setTimeout(() => {
            enemyContainer.classList.remove('enemy-attack');
            this.isAttacking = false;
            
            const enemyDamage = Math.max(1, this.attack + Math.floor(Math.random() * 4) - 2);
            player.hp = Math.max(0, player.hp - enemyDamage);
            updatePlayerStatus();
            
            displayMessage(`${this.name}の攻撃！${enemyDamage}ダメージを受けた！`);
            
            // プレイヤーが倒れた場合
            if (player.hp <= 0) {
                handlePlayerDefeat();
            }
        }, 1000);
    }
}

// 敵の種類
const enemyTypes = [
    new Enemy("スライム", 50, 5, 20, "images/slime.svg"),
    new Enemy("レッドスライム", 80, 8, 35, "images/red_slime.svg"),
    new Enemy("キングスライム", 150, 15, 100, "images/king_slime.svg")
];

let currentEnemy = null;

// DOM要素の取得
const playerLevelElement = document.getElementById('player-level');
const playerHpElement = document.getElementById('player-hp');
const playerMaxHpElement = document.getElementById('player-max-hp');
const playerAttackElement = document.getElementById('player-attack');
const playerExpElement = document.getElementById('player-exp');
const playerNextExpElement = document.getElementById('player-next-exp');

const enemyNameElement = document.getElementById('enemy-name');
const enemyHpElement = document.getElementById('enemy-hp');
const enemyMaxHpElement = document.getElementById('enemy-max-hp');
const enemyImageElement = document.getElementById('enemy-image');
const enemyContainer = document.getElementById('enemy-container');

const battleMessageElement = document.getElementById('battle-message');
const attackButton = document.getElementById('attack-btn');
const healButton = document.getElementById('heal-btn');
const touchArea = document.getElementById('touch-area');
const swordImage = document.getElementById('sword-image');

// プレイヤーのステータス更新
function updatePlayerStatus() {
    playerLevelElement.textContent = player.level;
    playerHpElement.textContent = player.hp;
    playerMaxHpElement.textContent = player.maxHp;
    playerAttackElement.textContent = player.attack;
    playerExpElement.textContent = player.exp;
    playerNextExpElement.textContent = player.nextExp;
}

// 敵のステータス更新
function updateEnemyStatus() {
    if (!currentEnemy) return;
    
    enemyNameElement.textContent = currentEnemy.name;
    enemyHpElement.textContent = currentEnemy.hp;
    enemyMaxHpElement.textContent = currentEnemy.maxHp;
    enemyImageElement.src = currentEnemy.imageSrc;
}

// メッセージ表示
function displayMessage(message) {
    battleMessageElement.textContent = message;
}

// 敵の出現
function spawnEnemy() {
    // プレイヤーのレベルに応じて敵の出現確率を変える
    let enemyPool;
    
    if (player.level >= 10) {
        // レベル10以上: すべての敵が出現
        enemyPool = enemyTypes;
    } else if (player.level >= 5) {
        // レベル5以上: スライムとレッドスライム
        enemyPool = [enemyTypes[0], enemyTypes[1]];
    } else {
        // レベル5未満: スライムのみ
        enemyPool = [enemyTypes[0]];
    }
    
    // ランダムに敵を選択
    const randomIndex = Math.floor(Math.random() * enemyPool.length);
    const selectedEnemy = enemyPool[randomIndex];
    
    // 敵のインスタンスを作成（ディープコピー）
    currentEnemy = new Enemy(
        selectedEnemy.name,
        selectedEnemy.maxHp,
        selectedEnemy.attack,
        selectedEnemy.exp,
        selectedEnemy.imageSrc
    );
    
    updateEnemyStatus();
    displayMessage(`${currentEnemy.name}が現れた！画面をタップして攻撃！`);
}

// 敵の攻撃
function enemyAttack() {
    if (currentEnemy && !currentEnemy.isAttacking) {
        currentEnemy.attackPlayer();
    }
}

// 敵を倒した時の処理
function handleEnemyDefeat() {
    setTimeout(() => {
        displayMessage(`${currentEnemy.name}を倒した！${currentEnemy.exp}の経験値を獲得！`);
        player.gainExp(currentEnemy.exp);
        
        // 少し待ってから次の敵を出現させる
        setTimeout(spawnEnemy, 1500);
    }, 500);
}

// プレイヤーが倒れた時の処理
function handlePlayerDefeat() {
    setTimeout(() => {
        displayMessage('あなたは倒れてしまった...');
        attackButton.disabled = true;
        healButton.disabled = true;
        
        // リスタートボタンを作成
        const restartButton = document.createElement('button');
        restartButton.textContent = 'リスタート';
        restartButton.addEventListener('click', () => {
            restartGame();
            document.getElementById('action-buttons').removeChild(restartButton);
        });
        document.getElementById('action-buttons').appendChild(restartButton);
    }, 1000);
}

// ゲームのリスタート
function restartGame() {
    player.level = 1;
    player.maxHp = 100;
    player.hp = 100;
    player.attack = 10;
    player.exp = 0;
    player.nextExp = 100;
    player.isAttacking = false;
    
    updatePlayerStatus();
    attackButton.disabled = false;
    healButton.disabled = false;
    
    spawnEnemy();
}

// タッチ操作 - 剣を振る
touchArea.addEventListener('click', () => {
    player.swingSword();
});

// タッチデバイス対応
touchArea.addEventListener('touchstart', (e) => {
    e.preventDefault(); // デフォルトの動作を防ぐ
    player.swingSword();
});

// 攻撃ボタンの処理
attackButton.addEventListener('click', () => {
    player.swingSword();
});

// 回復ボタンの処理
healButton.addEventListener('click', () => {
    player.heal();
    
    // 少し待ってから敵の攻撃
    setTimeout(() => {
        if (currentEnemy) {
            enemyAttack();
        }
    }, 1000);
});

// ゲーム初期化
function initGame() {
    // ブラウザのサイズ調整
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
    
    // ゲーム開始
    updatePlayerStatus();
    spawnEnemy();
}

// モバイル向け調整
function adjustForMobile() {
    // タッチデバイスかどうかを検出
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.remove('touch-device');
    }
}

// ゲーム開始
window.addEventListener('load', initGame); 