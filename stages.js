// ステージシステム
class Stage {
    constructor(id, name, description, level, background, enemies, requiredKeyLevel, nextStageId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.level = level; // 難易度レベル
        this.background = background; // 背景画像のパス
        this.enemies = enemies; // 出現する敵の配列
        this.requiredKeyLevel = requiredKeyLevel; // 必要な鍵のレベル
        this.nextStageId = nextStageId; // 次のステージID
        this.completed = false; // クリア済みかどうか
    }
}

// 全ステージリスト
const stages = [
    // 初期ステージ（鍵不要）
    new Stage(
        'stage1',
        'スライムの森',
        '弱いスライムが生息する森。初心者向け。',
        1,
        'images/backgrounds/forest.svg',
        ['slime'], // 通常のスライムのみ
        0, // 鍵不要
        'stage2'
    ),
    
    // 第2ステージ（銅の鍵が必要）
    new Stage(
        'stage2',
        '洞窟入口',
        'レッドスライムが現れる洞窟の入口。少し危険。',
        5,
        'images/backgrounds/cave_entrance.svg',
        ['slime', 'red_slime'], // 通常のスライムとレッドスライム
        1, // 銅の鍵が必要
        'stage3'
    ),
    
    // 第3ステージ（銀の鍵が必要）
    new Stage(
        'stage3',
        '深い洞窟',
        'キングスライムも生息する危険な洞窟。',
        10,
        'images/backgrounds/deep_cave.svg',
        ['slime', 'red_slime', 'king_slime'], // すべてのスライム
        2, // 銀の鍵が必要
        'stage4'
    ),
    
    // 第4ステージ（金の鍵が必要）
    new Stage(
        'stage4',
        '魔王の城',
        '強力なスライムたちが守る魔王の城。最大の難関。',
        15,
        'images/backgrounds/castle.svg',
        ['red_slime', 'king_slime'], // 強いスライムのみ
        3, // 金の鍵が必要
        'stage5'
    ),
    
    // 第5ステージ（隠された鉱山）
    new Stage(
        'stage5',
        '隠された鉱山',
        'メタルスライムが出現する鉱山。貴重な経験値を得られる。',
        20,
        'images/backgrounds/mine.svg',
        ['red_slime', 'metal_slime', 'king_slime'],
        3, // 金の鍵が必要
        'stage6'
    ),
    
    // 第6ステージ（毒の沼地）
    new Stage(
        'stage6',
        '毒の沼地',
        'ポイズンスライムが生息する危険な沼地。',
        25,
        'images/backgrounds/swamp.svg',
        ['poison_slime', 'king_slime', 'metal_slime'],
        3, // 金の鍵が必要
        'stage7'
    ),
    
    // 第7ステージ（古代遺跡）
    new Stage(
        'stage7',
        '古代遺跡',
        '最強のエンシェントスライムとクリスタルスライムが出現する最終試練の場。',
        30,
        'images/backgrounds/ruins.svg',
        ['crystal_slime', 'ancient_slime'],
        3, // 金の鍵が必要
        null // 最終ステージ
    )
];

// 現在のステージIDを保持する変数
let currentStageId = 'stage1';
let previousStageId = null;

// ステージIDからステージを取得
function getStage(stageId) {
    return stages.find(stage => stage.id === stageId);
}

// 現在のステージを取得
function getCurrentStage() {
    return getStage(currentStageId);
}

// 前のステージを取得
function getPreviousStage() {
    return previousStageId ? getStage(previousStageId) : null;
}

// 次のステージに進む（鍵のチェックあり）
function advanceToNextStage(inventory) {
    const currentStage = getCurrentStage();
    if (!currentStage) return false;
    
    const nextStageId = currentStage.nextStageId;
    if (!nextStageId) return false; // 次のステージがない
    
    const nextStage = getStage(nextStageId);
    
    // 鍵のチェック
    if (nextStage.requiredKeyLevel > 0) {
        if (!inventory.hasKey(nextStage.requiredKeyLevel)) {
            return false; // 必要な鍵を持っていない
        }
        // 鍵を消費
        inventory.useKey(nextStage.requiredKeyLevel);
    }
    
    // 現在のステージをクリア済みにする
    currentStage.completed = true;
    
    // 次のステージに進む
    previousStageId = currentStageId;
    currentStageId = nextStageId;
    
    return true;
}

// プレイヤーが死亡した場合、一つ前のステージに戻る
function returnToPreviousStage() {
    const prevStage = getPreviousStage();
    if (prevStage) {
        currentStageId = prevStage.id;
        return true;
    }
    return false;
}

// 特定のステージに移動（ゲーム開始時など）
function setStage(stageId) {
    const stage = getStage(stageId);
    if (stage) {
        previousStageId = currentStageId;
        currentStageId = stageId;
        return true;
    }
    return false;
}

// ステージに基づいて敵を生成
function generateEnemyForStage(stage) {
    if (!stage || !stage.enemies || stage.enemies.length === 0) {
        return null;
    }
    
    // ステージに登録されている敵からランダムに選択
    const enemyType = stage.enemies[Math.floor(Math.random() * stage.enemies.length)];
    return enemyType;
}

// ステージ情報とステージ関連関数をエクスポート
export {
    Stage, stages, currentStageId, 
    getStage, getCurrentStage, getPreviousStage,
    advanceToNextStage, returnToPreviousStage, setStage,
    generateEnemyForStage
}; 