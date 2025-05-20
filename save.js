// セーブ/ロード機能
// LocalStorageを使用してゲームデータを保存・読み込み

// セーブデータの構造
class SaveData {
    constructor(player, inventory, currentStageId, completedStages) {
        this.player = player;
        this.inventory = inventory;
        this.currentStageId = currentStageId;
        this.completedStages = completedStages;
        this.saveDate = new Date().toISOString();
    }
}

// ゲームデータを保存
function saveGame(player, inventory, currentStageId, stages) {
    try {
        // 完了したステージのIDを抽出
        const completedStages = stages
            .filter(stage => stage.completed)
            .map(stage => stage.id);
        
        // セーブデータを作成
        const saveData = new SaveData(
            {
                level: player.level,
                maxHp: player.maxHp,
                hp: player.hp,
                attack: player.attack,
                exp: player.exp,
                nextExp: player.nextExp
            },
            {
                weapons: inventory.weapons.map(item => item.id),
                shields: inventory.shields.map(item => item.id),
                armors: inventory.armors.map(item => item.id),
                consumables: inventory.consumables.map(item => item.id),
                valuables: inventory.valuables.map(item => item.id),
                keys: inventory.keys.map(item => item.id),
                equippedWeapon: inventory.equippedWeapon ? inventory.equippedWeapon.id : null,
                equippedShield: inventory.equippedShield ? inventory.equippedShield.id : null,
                equippedArmor: inventory.equippedArmor ? inventory.equippedArmor.id : null
            },
            currentStageId,
            completedStages
        );
        
        // LocalStorageに保存
        localStorage.setItem('slimeRpgSaveData', JSON.stringify(saveData));
        
        console.log('ゲームデータを保存しました');
        return true;
    } catch (error) {
        console.error('ゲームデータの保存に失敗しました:', error);
        return false;
    }
}

// ゲームデータをロード
function loadGame() {
    try {
        // LocalStorageからデータを取得
        const saveDataJson = localStorage.getItem('slimeRpgSaveData');
        if (!saveDataJson) {
            console.log('セーブデータが見つかりません');
            return null;
        }
        
        // JSONをパース
        const saveData = JSON.parse(saveDataJson);
        
        console.log('ゲームデータをロードしました');
        return saveData;
    } catch (error) {
        console.error('ゲームデータのロードに失敗しました:', error);
        return null;
    }
}

// セーブデータを削除
function deleteSaveData() {
    try {
        localStorage.removeItem('slimeRpgSaveData');
        console.log('セーブデータを削除しました');
        return true;
    } catch (error) {
        console.error('セーブデータの削除に失敗しました:', error);
        return false;
    }
}

// セーブデータが存在するか確認
function hasSaveData() {
    return localStorage.getItem('slimeRpgSaveData') !== null;
}

// セーブデータの日時を取得
function getSaveDateTime() {
    try {
        const saveDataJson = localStorage.getItem('slimeRpgSaveData');
        if (!saveDataJson) return null;
        
        const saveData = JSON.parse(saveDataJson);
        return new Date(saveData.saveDate);
    } catch (error) {
        console.error('セーブデータの日時取得に失敗しました:', error);
        return null;
    }
}

// エクスポート
export {
    SaveData,
    saveGame,
    loadGame,
    deleteSaveData,
    hasSaveData,
    getSaveDateTime
}; 