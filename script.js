// ESモジュールからアイテム、ステージ、エフェクトをインポート
import { playerInventory, calculateDrops } from './items.js';
import { getCurrentStage, generateEnemyForStage, returnToPreviousStage, advanceToNextStage, setStage, stages } from './stages.js';
import { effectManager } from './effects.js';

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
        
        // レベルアップエフェクト
        const playerRect = document.getElementById('player-character').getBoundingClientRect();
        effectManager.createLevelUpEffect(
            playerRect.left + playerRect.width / 2, 
            playerRect.top + playerRect.height / 2, 
            document.getElementById('effect-container')
        );
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
        
        // 回復エフェクト
        const playerRect = document.getElementById('player-character').getBoundingClientRect();
        effectManager.createHealEffect(
            playerRect.left + playerRect.width / 2, 
            playerRect.top + playerRect.height / 2, 
            document.getElementById('effect-container')
        );
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
                // 攻撃力の計算（装備アイテムのボーナスを適用）
                let totalAttack = this.attack;
                if (playerInventory.equippedWeapon) {
                    totalAttack += playerInventory.equippedWeapon.attack;
                }
                
                // クリティカルヒット判定
                let critRate = 0.05; // 基本クリティカル率
                if (playerInventory.equippedWeapon) {
                    critRate += playerInventory.equippedWeapon.critRate;
                }
                
                const isCritical = Math.random() < critRate;
                
                // プレイヤーの攻撃
                let playerDamage = Math.max(1, totalAttack + Math.floor(Math.random() * 6) - 3);
                
                if (isCritical) {
                    playerDamage = Math.floor(playerDamage * 1.5);
                    enemyImageElement.classList.add('critical');
                    setTimeout(() => {
                        enemyImageElement.classList.remove('critical');
                    }, 500);
                }
                
                currentEnemy.hp = Math.max(0, currentEnemy.hp - playerDamage);
                
                // 敵のダメージアニメーション
                enemyImageElement.classList.add('damage');
                setTimeout(() => {
                    enemyImageElement.classList.remove('damage');
                }, 300);
                
                // ヒットエフェクト
                const enemyRect = enemyContainer.getBoundingClientRect();
                effectManager.createHitEffect(
                    enemyRect.left + enemyRect.width / 2, 
                    enemyRect.top + enemyRect.height / 2, 
                    document.getElementById('effect-container')
                );
                
                updateEnemyStatus();
                
                if (isCritical) {
                    displayMessage(`クリティカルヒット！${currentEnemy.name}に${playerDamage}ダメージを与えた！`);
                } else {
                    displayMessage(`${currentEnemy.name}に${playerDamage}ダメージを与えた！`);
                }
                
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
    constructor(name, hp, attack, exp, imageSrc, level = 1) {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.attack = attack;
        this.exp = exp;
        this.imageSrc = imageSrc;
        this.isAttacking = false;
        this.level = level;
    }
    
    attackPlayer() {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        enemyContainer.classList.add('enemy-attack');
        
        setTimeout(() => {
            enemyContainer.classList.remove('enemy-attack');
            this.isAttacking = false;
            
            // 防御力の計算（装備アイテムのボーナスを適用）
            let defense = 0;
            if (playerInventory.equippedShield) {
                defense += playerInventory.equippedShield.defense;
            }
            if (playerInventory.equippedArmor) {
                defense += playerInventory.equippedArmor.defense;
            }
            
            const enemyDamage = Math.max(1, this.attack - defense + Math.floor(Math.random() * 4) - 2);
            player.hp = Math.max(0, player.hp - enemyDamage);
            
            // プレイヤーのダメージアニメーション
            document.getElementById('player-character').classList.add('damage');
            setTimeout(() => {
                document.getElementById('player-character').classList.remove('damage');
            }, 300);
            
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
const enemyTypes = {
    "slime": {
        constructor: (level) => new Enemy(
            "スライム", 
            50 + level * 5, 
            5 + level, 
            20 + level * 2, 
            "images/slime.svg",
            level
        )
    },
    "red_slime": {
        constructor: (level) => new Enemy(
            "レッドスライム", 
            80 + level * 8, 
            8 + level * 2, 
            35 + level * 3, 
            "images/red_slime.svg",
            level
        )
    },
    "king_slime": {
        constructor: (level) => new Enemy(
            "キングスライム", 
            150 + level * 15, 
            15 + level * 3, 
            100 + level * 5, 
            "images/king_slime.svg",
            level
        )
    }
};

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

// ステージ情報の更新
function updateStageInfo() {
    const currentStage = getCurrentStage();
    document.getElementById('stage-name').textContent = currentStage.name;
    document.getElementById('stage-description').textContent = currentStage.description;
    document.getElementById('background').style.backgroundImage = `url(${currentStage.background})`;
}

// プレイヤーのステータス更新
function updatePlayerStatus() {
    playerLevelElement.textContent = player.level;
    playerHpElement.textContent = player.hp;
    playerMaxHpElement.textContent = player.maxHp;
    
    // 装備アイテムのボーナスを表示に反映
    let totalAttack = player.attack;
    if (playerInventory.equippedWeapon) {
        totalAttack += playerInventory.equippedWeapon.attack;
    }
    playerAttackElement.textContent = totalAttack;
    
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
    
    // HPバーの更新
    const hpPercentage = (currentEnemy.hp / currentEnemy.maxHp) * 100;
    document.getElementById('enemy-hp-fill').style.width = `${hpPercentage}%`;
}

// メッセージ表示
function displayMessage(message) {
    battleMessageElement.textContent = message;
}

// 敵の出現
function spawnEnemy() {
    const currentStage = getCurrentStage();
    const enemyType = generateEnemyForStage(currentStage);
    
    if (!enemyType || !enemyTypes[enemyType]) {
        console.error("敵の種類が見つかりません:", enemyType);
        return;
    }
    
    // 敵のインスタンスを作成
    currentEnemy = enemyTypes[enemyType].constructor(currentStage.level);
    
    // 敵の登場アニメーション
    enemyContainer.style.opacity = "0";
    setTimeout(() => {
        enemyContainer.style.opacity = "1";
        enemyContainer.classList.add('flash');
        setTimeout(() => {
            enemyContainer.classList.remove('flash');
        }, 500);
    }, 300);
    
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
    // 敵の死亡アニメーション
    enemyContainer.classList.add('enemy-death');
    
    setTimeout(() => {
        enemyContainer.classList.remove('enemy-death');
        
        // 経験値獲得
        displayMessage(`${currentEnemy.name}を倒した！${currentEnemy.exp}の経験値を獲得！`);
        player.gainExp(currentEnemy.exp);
        
        // アイテムドロップ処理
        handleItemDrop(currentEnemy.level);
        
        // 少し待ってから次の敵を出現させる
        setTimeout(spawnEnemy, 1500);
    }, 500);
}

// アイテムドロップ処理
function handleItemDrop(enemyLevel) {
    // 簡素なドロップ率計算 (敵のレベルが高いほどドロップ率が上がる)
    const dropRate = 0.3 + (enemyLevel * 0.01); // 基本30%にレベルごとに1%ずつ上昇
    
    if (Math.random() > dropRate) {
        // ドロップなし
        return;
    }
    
    // アイテムドロップ - 直接items.jsからimportせずに同期的に処理
    const droppedItem = calculateDrops(enemyLevel);
    
    if (droppedItem) {
        // アイテムドロップウィンドウを表示
        const itemDropWindow = document.getElementById('item-drop-window');
        const droppedItemImg = document.getElementById('dropped-item-img');
        const droppedItemName = document.getElementById('dropped-item-name');
        const droppedItemDesc = document.getElementById('dropped-item-description');
        
        droppedItemImg.src = droppedItem.imgSrc;
        droppedItemName.textContent = droppedItem.name;
        droppedItemDesc.textContent = droppedItem.description;
        
        itemDropWindow.classList.remove('hidden');
        
        // 拾うボタンのイベントリスナー
        document.getElementById('pickup-item').onclick = () => {
            playerInventory.addItem(droppedItem);
            itemDropWindow.classList.add('hidden');
            
            // アイテム獲得エフェクト
            const rect = droppedItemImg.getBoundingClientRect();
            effectManager.createItemEffect(
                rect.left + rect.width / 2, 
                rect.top + rect.height / 2, 
                document.getElementById('effect-container')
            );
            
            displayMessage(`${droppedItem.name}を手に入れた！`);
        };
    }
}

// インベントリ関連の処理
function initInventory() {
    // インベントリボタンのイベントリスナー
    document.getElementById('inventory-btn').addEventListener('click', openInventory);
    
    // インベントリを閉じるボタン
    document.getElementById('close-inventory').addEventListener('click', () => {
        document.getElementById('inventory-window').classList.add('hidden');
    });
    
    // タブ切り替え
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // アクティブなタブを全て非アクティブにする
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // クリックされたタブをアクティブにする
            e.target.classList.add('active');
            const tabId = e.target.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // タブの内容を更新
            updateInventoryTab(tabId);
        });
    });
}

// インベントリを開く
function openInventory() {
    document.getElementById('inventory-window').classList.remove('hidden');
    
    // 最初のタブを更新
    updateInventoryTab('weapons');
}

// タブの内容を更新
function updateInventoryTab(tabId) {
    const listElement = document.getElementById(`${tabId}-list`);
    listElement.innerHTML = '';
    
    let items;
    let equippedItem;
    
    switch(tabId) {
        case 'weapons':
            items = playerInventory.weapons;
            equippedItem = playerInventory.equippedWeapon;
            document.getElementById('equipped-weapon').textContent = equippedItem ? equippedItem.name : 'なし';
            break;
        case 'shields':
            items = playerInventory.shields;
            equippedItem = playerInventory.equippedShield;
            document.getElementById('equipped-shield').textContent = equippedItem ? equippedItem.name : 'なし';
            break;
        case 'armors':
            items = playerInventory.armors;
            equippedItem = playerInventory.equippedArmor;
            document.getElementById('equipped-armor').textContent = equippedItem ? equippedItem.name : 'なし';
            break;
        case 'consumables':
            items = playerInventory.consumables;
            break;
        case 'valuables':
            items = [...playerInventory.valuables];
            // 鍵アイテムを追加
            items = [...items, ...playerInventory.keys];
            break;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        // 装備中のアイテムにはクラスを追加
        if (equippedItem && item.id === equippedItem.id) {
            itemCard.classList.add('equipped');
        }
        
        // 鍵アイテムにはクラスを追加
        if (item.isKey) {
            itemCard.classList.add('key-item');
        }
        
        const itemImg = document.createElement('img');
        itemImg.src = item.imgSrc;
        itemImg.alt = item.name;
        
        const itemName = document.createElement('h5');
        itemName.textContent = item.name;
        
        const itemRarity = document.createElement('div');
        itemRarity.className = `item-rarity rarity-${item.rarity}`;
        itemRarity.textContent = getRarityText(item.rarity);
        
        itemCard.appendChild(itemImg);
        itemCard.appendChild(itemName);
        itemCard.appendChild(itemRarity);
        
        // アイテムクリックイベント
        itemCard.addEventListener('click', () => {
            handleItemClick(item, tabId);
        });
        
        listElement.appendChild(itemCard);
    });
}

// レアリティテキストを取得
function getRarityText(rarity) {
    switch(rarity) {
        case 1: return 'コモン';
        case 2: return 'アンコモン';
        case 3: return 'レア';
        case 4: return 'エピック';
        case 5: return 'レジェンダリー';
        default: return '';
    }
}

// アイテムクリック処理
function handleItemClick(item, tabId) {
    switch(tabId) {
        case 'weapons':
            playerInventory.equipWeapon(item.id);
            break;
        case 'shields':
            playerInventory.equipShield(item.id);
            break;
        case 'armors':
            playerInventory.equipArmor(item.id);
            break;
        case 'consumables':
            useConsumable(item);
            break;
        case 'valuables':
            if (item.isKey) {
                // 鍵の場合は何もしない
            } else {
                useValuable(item);
            }
            break;
    }
    
    // ステータスとインベントリを更新
    updatePlayerStatus();
    updateInventoryTab(tabId);
}

// 消費アイテムを使用
function useConsumable(item) {
    const usedItem = playerInventory.useConsumable(item.id);
    
    if (usedItem) {
        switch(usedItem.effect) {
            case 'heal':
                player.hp = Math.min(player.maxHp, player.hp + usedItem.value);
                displayMessage(`${usedItem.name}を使用して${usedItem.value}ポイント回復した！`);
                break;
            case 'attack_boost':
                // 一時的な攻撃力アップ処理（実装省略）
                displayMessage(`${usedItem.name}を使用して攻撃力が上昇した！`);
                break;
            case 'defense_boost':
                // 一時的な防御力アップ処理（実装省略）
                displayMessage(`${usedItem.name}を使用して防御力が上昇した！`);
                break;
        }
        
        updatePlayerStatus();
    }
}

// 貴重品を使用
function useValuable(item) {
    const usedItem = playerInventory.useValuable(item.id);
    
    if (usedItem) {
        switch(usedItem.effect) {
            case 'permanent_hp':
                player.maxHp += usedItem.value;
                player.hp += usedItem.value;
                displayMessage(`${usedItem.name}を使用して最大HPが${usedItem.value}増加した！`);
                break;
            case 'permanent_attack':
                player.attack += usedItem.value;
                displayMessage(`${usedItem.name}を使用して攻撃力が${usedItem.value}増加した！`);
                break;
            case 'permanent_defense':
                // 防御力が永続的に上昇（実装省略）
                displayMessage(`${usedItem.name}を使用して防御力が上昇した！`);
                break;
            case 'permanent_crit':
                // クリティカル率が永続的に上昇（実装省略）
                displayMessage(`${usedItem.name}を使用してクリティカル率が上昇した！`);
                break;
        }
        
        updatePlayerStatus();
    }
}

// ステージ選択ウィンドウの初期化
function initStageSelect() {
    // 閉じるボタン
    document.getElementById('close-stage').addEventListener('click', () => {
        document.getElementById('stage-window').classList.add('hidden');
    });
    
    // ステージ名クリックでステージ選択ウィンドウを開く
    document.getElementById('stage-name').addEventListener('click', openStageSelect);
    
    // ステージ選択ボタンでステージ選択ウィンドウを開く
    document.getElementById('stage-select-btn').addEventListener('click', openStageSelect);
    
    // 鍵を使うボタンのイベントリスナー
    document.getElementById('use-key-btn').addEventListener('click', useKeyForNextStage);
}

// ステージ選択ウィンドウを開く
function openStageSelect() {
    document.getElementById('stage-window').classList.remove('hidden');
    updateStageList();
    updateNextStageInfo();
}

// 次のステージ情報の更新
function updateNextStageInfo() {
    const currentStage = getCurrentStage();
    
    // 次のステージがない場合
    if (!currentStage.nextStageId) {
        document.getElementById('next-stage-section').classList.add('hidden');
        return;
    }
    
    document.getElementById('next-stage-section').classList.remove('hidden');
    
    // 次のステージ情報を取得
    const nextStage = getStage(currentStage.nextStageId);
    
    // 情報を更新
    document.getElementById('current-stage-name').textContent = currentStage.name;
    document.getElementById('next-stage-name').textContent = nextStage.name;
    
    // 必要な鍵の情報
    let keyName = '必要なし';
    let keyLevelRequired = nextStage.requiredKeyLevel;
    
    if (keyLevelRequired > 0) {
        // 対応する鍵を探す
        const keyItem = valuables.find(v => v.isKey && v.value === keyLevelRequired);
        keyName = keyItem ? keyItem.name : `レベル${keyLevelRequired}の鍵`;
    }
    
    document.getElementById('required-key').textContent = keyName;
    
    // 鍵を使うボタンの状態を更新
    const useKeyBtn = document.getElementById('use-key-btn');
    
    if (keyLevelRequired === 0) {
        // 鍵が不要な場合
        useKeyBtn.disabled = false;
        useKeyBtn.textContent = '次のステージへ進む';
    } else if (playerInventory.hasKey(keyLevelRequired)) {
        // 鍵を持っている場合
        useKeyBtn.disabled = false;
        useKeyBtn.textContent = '鍵を使う';
    } else {
        // 鍵を持っていない場合
        useKeyBtn.disabled = true;
        useKeyBtn.textContent = '鍵を持っていません';
    }
}

// 鍵を使って次のステージへ進む
function useKeyForNextStage() {
    const currentStage = getCurrentStage();
    
    // 次のステージがない場合
    if (!currentStage.nextStageId) {
        return;
    }
    
    const nextStage = getStage(currentStage.nextStageId);
    const keyLevelRequired = nextStage.requiredKeyLevel;
    
    // 鍵が必要で、持っていない場合
    if (keyLevelRequired > 0 && !playerInventory.hasKey(keyLevelRequired)) {
        displayMessage('次のステージに必要な鍵を持っていません！');
        return;
    }
    
    // 鍵を使って次のステージへ
    if (advanceToNextStage(playerInventory)) {
        // ステージクリアウィンドウを表示
        showStageClearWindow(currentStage.name, nextStage.name);
        
        // ステージ選択ウィンドウを閉じる
        document.getElementById('stage-window').classList.add('hidden');
    } else {
        displayMessage('次のステージに進めませんでした...');
    }
}

// ステージクリアウィンドウを表示
function showStageClearWindow(clearedStageName, nextStageName) {
    const stageClearWindow = document.getElementById('stage-clear-window');
    
    // 情報を更新
    document.getElementById('cleared-stage-name').textContent = clearedStageName;
    document.getElementById('cleared-next-stage').textContent = nextStageName;
    
    // イベントリスナーを設定
    document.getElementById('continue-current-stage').onclick = () => {
        stageClearWindow.classList.add('hidden');
    };
    
    document.getElementById('proceed-next-stage').onclick = () => {
        stageClearWindow.classList.add('hidden');
        
        // ステージ情報の更新
        updateStageInfo();
        
        // 新しい敵を出現
        spawnEnemy();
    };
    
    // ウィンドウを表示
    stageClearWindow.classList.remove('hidden');
}

// ステージリストの更新
function updateStageList() {
    const stagesList = document.getElementById('stages-list');
    stagesList.innerHTML = '';
    
    const currentStage = getCurrentStage();
    
    // stagesモジュールから直接インポートしているため、ここでは同期的に処理できる
    stages.forEach(stage => {
        const stageCard = document.createElement('div');
        stageCard.className = 'stage-card';
        
        // 完了したステージにはクラスを追加
        if (stage.completed) {
            stageCard.classList.add('stage-completed');
        }
        
        // 現在のステージにはクラスを追加
        if (currentStage.id === stage.id) {
            stageCard.classList.add('current-stage');
        }
        
        // 鍵が必要なステージでまだ開放されていない場合
        if (stage.requiredKeyLevel > 0 && !stage.completed && !playerInventory.hasKey(stage.requiredKeyLevel)) {
            stageCard.classList.add('stage-locked');
        }
        
        const stageName = document.createElement('h4');
        stageName.textContent = stage.name;
        
        const stageDesc = document.createElement('p');
        stageDesc.textContent = stage.description;
        
        const stageDifficulty = document.createElement('p');
        stageDifficulty.textContent = `難易度: ${stage.level}`;
        
        stageCard.appendChild(stageName);
        stageCard.appendChild(stageDesc);
        stageCard.appendChild(stageDifficulty);
        
        // ステージクリックイベント
        stageCard.addEventListener('click', () => {
            // ロックされていないステージのみ選択可能
            if (!stageCard.classList.contains('stage-locked')) {
                selectStage(stage.id);
                document.getElementById('stage-window').classList.add('hidden');
            }
        });
        
        stagesList.appendChild(stageCard);
    });
}

// ステージ選択
function selectStage(stageId) {
    setStage(stageId);
    updateStageInfo();
    spawnEnemy();
}

// プレイヤーが倒れた時の処理
function handlePlayerDefeat() {
    // ゲームオーバーウィンドウを表示
    document.getElementById('game-over-window').classList.remove('hidden');
    
    // リスタートボタンのイベントリスナー
    document.getElementById('restart-game').onclick = () => {
        // 前のステージに戻る
        returnToPreviousStage();
        
        // プレイヤーを回復
        player.hp = player.maxHp;
        updatePlayerStatus();
        
        // 新しい敵を出現
        updateStageInfo();
        spawnEnemy();
        
        // ゲームオーバーウィンドウを閉じる
        document.getElementById('game-over-window').classList.add('hidden');
    };
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
    
    // インベントリとステージ選択の初期化
    initInventory();
    initStageSelect();
    
    // ステージ情報の更新
    updateStageInfo();
    
    // エフェクトの初期化
    effectManager.registerEffect('shake', 'shake', 500, document.getElementById('game-field'));
    effectManager.registerEffect('flash', 'flash', 500, document.getElementById('enemy-container'));
    
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