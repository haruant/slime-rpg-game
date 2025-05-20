// アイテムの基本クラス
class Item {
    constructor(id, name, description, rarity, imgSrc) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.rarity = rarity; // 1-5 (コモン、アンコモン、レア、エピック、レジェンダリー)
        this.imgSrc = imgSrc;
    }
}

// 武器クラス
class Weapon extends Item {
    constructor(id, name, description, rarity, imgSrc, attack, critRate) {
        super(id, name, description, rarity, imgSrc);
        this.type = 'weapon';
        this.attack = attack;
        this.critRate = critRate || 0.05; // クリティカル率（デフォルト5%）
    }
}

// 盾クラス
class Shield extends Item {
    constructor(id, name, description, rarity, imgSrc, defense) {
        super(id, name, description, rarity, imgSrc);
        this.type = 'shield';
        this.defense = defense;
    }
}

// 防具クラス
class Armor extends Item {
    constructor(id, name, description, rarity, imgSrc, defense, hpBoost) {
        super(id, name, description, rarity, imgSrc);
        this.type = 'armor';
        this.defense = defense;
        this.hpBoost = hpBoost || 0; // HPボーナス
    }
}

// 消費アイテムクラス
class Consumable extends Item {
    constructor(id, name, description, rarity, imgSrc, effect, value) {
        super(id, name, description, rarity, imgSrc);
        this.type = 'consumable';
        this.effect = effect; // 'heal', 'attack_boost', 'defense_boost'など
        this.value = value; // 効果の値
    }
}

// 貴重品クラス
class Valuable extends Item {
    constructor(id, name, description, rarity, imgSrc, effect, value, isKey = false) {
        super(id, name, description, rarity, imgSrc);
        this.type = 'valuable';
        this.effect = effect; // 'permanent_hp', 'permanent_attack'など
        this.value = value; // 効果の値
        this.isKey = isKey; // 鍵かどうか
    }
}

// 剣のリスト
const weapons = [
    // コモン (レアリティ1)
    new Weapon('w1', '木の剣', '木で作られた基本的な剣', 1, 'images/items/weapon_1.svg', 5),
    new Weapon('w2', '石の剣', '石で作られた頑丈な剣', 1, 'images/items/weapon_2.svg', 8),
    new Weapon('w3', '銅の剣', '銅で作られた標準的な剣', 1, 'images/items/weapon_3.svg', 12),
    new Weapon('w4', '鉄の短剣', '鋭い短剣', 1, 'images/items/weapon_4.svg', 15),
    
    // アンコモン (レアリティ2)
    new Weapon('w5', '鉄の剣', '鉄で作られた標準的な剣', 2, 'images/items/weapon_5.svg', 20),
    new Weapon('w6', '兵士の大剣', '重くて強力な大剣', 2, 'images/items/weapon_6.svg', 25),
    new Weapon('w7', 'シルバーソード', '銀を混ぜた輝く剣', 2, 'images/items/weapon_7.svg', 28),
    new Weapon('w8', 'レイピア', '素早く突きを繰り出せる剣', 2, 'images/items/weapon_8.svg', 22, 0.08),
    
    // レア (レアリティ3)
    new Weapon('w9', 'ミスリルブレード', '魔法金属で作られた剣', 3, 'images/items/weapon_9.svg', 35),
    new Weapon('w10', 'フレイムソード', '炎をまとう魔法の剣', 3, 'images/items/weapon_10.svg', 40),
    new Weapon('w11', 'アイスブレード', '氷の力を宿した剣', 3, 'images/items/weapon_11.svg', 40),
    new Weapon('w12', 'サンダーソード', '雷の力を宿した剣', 3, 'images/items/weapon_12.svg', 40),
    
    // エピック (レアリティ4)
    new Weapon('w13', 'ドラゴンスレイヤー', 'ドラゴンを倒すための伝説の剣', 4, 'images/items/weapon_13.svg', 55),
    new Weapon('w14', 'デーモンブレード', '悪魔の力を宿した剣', 4, 'images/items/weapon_14.svg', 60),
    new Weapon('w15', '聖なる剣', '神聖な光の力を宿した剣', 4, 'images/items/weapon_15.svg', 60),
    new Weapon('w16', '風神の刃', '風の力を操る剣', 4, 'images/items/weapon_16.svg', 58, 0.12),
    
    // レジェンダリー (レアリティ5)
    new Weapon('w17', 'エクスカリバー', '選ばれし者だけが扱える伝説の剣', 5, 'images/items/weapon_17.svg', 80, 0.15),
    new Weapon('w18', '宇宙の剣', '宇宙の力を宿した剣', 5, 'images/items/weapon_18.svg', 85),
    new Weapon('w19', '英雄の剣', '多くの英雄が使ってきた伝説の剣', 5, 'images/items/weapon_19.svg', 90),
    new Weapon('w20', '真・神の剣', '神の力が宿る最強の剣', 5, 'images/items/weapon_20.svg', 100, 0.2)
];

// 盾のリスト
const shields = [
    // コモン (レアリティ1)
    new Shield('s1', '木の盾', '木で作られた基本的な盾', 1, 'images/items/shield_1.svg', 3),
    new Shield('s2', '革の盾', '革で作られた軽い盾', 1, 'images/items/shield_2.svg', 5),
    new Shield('s3', '銅の盾', '銅で作られた標準的な盾', 1, 'images/items/shield_3.svg', 8),
    
    // アンコモン (レアリティ2)
    new Shield('s4', '鉄の盾', '鉄で作られた頑丈な盾', 2, 'images/items/shield_4.svg', 12),
    new Shield('s5', 'ナイトシールド', '騎士が使う高品質の盾', 2, 'images/items/shield_5.svg', 15),
    new Shield('s6', 'タワーシールド', '重いが非常に頑丈な盾', 2, 'images/items/shield_6.svg', 18),
    
    // レア (レアリティ3)
    new Shield('s7', 'ミスリルシールド', '魔法金属で作られた盾', 3, 'images/items/shield_7.svg', 22),
    new Shield('s8', 'フレイムシールド', '炎からの攻撃を防ぐ盾', 3, 'images/items/shield_8.svg', 25),
    new Shield('s9', 'アイスシールド', '氷からの攻撃を防ぐ盾', 3, 'images/items/shield_9.svg', 25),
    
    // エピック (レアリティ4)
    new Shield('s10', 'ドラゴンシールド', 'ドラゴンの鱗で作られた盾', 4, 'images/items/shield_10.svg', 30),
    new Shield('s11', 'デーモンシールド', '悪魔の力を宿した盾', 4, 'images/items/shield_11.svg', 35),
    new Shield('s12', '聖なる盾', '神聖な光の力を宿した盾', 4, 'images/items/shield_12.svg', 35),
    
    // レジェンダリー (レアリティ5)
    new Shield('s13', 'アイギスの盾', '神話に登場する無敵の盾', 5, 'images/items/shield_13.svg', 45),
    new Shield('s14', '宇宙の盾', '宇宙の力を宿した盾', 5, 'images/items/shield_14.svg', 50),
    new Shield('s15', '真・神の盾', '神の力が宿る最強の盾', 5, 'images/items/shield_15.svg', 60)
];

// 防具のリスト
const armors = [
    // コモン (レアリティ1)
    new Armor('a1', '布の服', '布で作られた基本的な服', 1, 'images/items/armor_1.svg', 2, 5),
    new Armor('a2', '革の鎧', '革で作られた軽い鎧', 1, 'images/items/armor_2.svg', 4, 10),
    new Armor('a3', '銅の鎧', '銅で作られた標準的な鎧', 1, 'images/items/armor_3.svg', 6, 15),
    new Armor('a4', '冒険者の服', '冒険に適した丈夫な服', 1, 'images/items/armor_4.svg', 5, 20),
    
    // アンコモン (レアリティ2)
    new Armor('a5', '鉄の鎧', '鉄で作られた頑丈な鎧', 2, 'images/items/armor_5.svg', 10, 25),
    new Armor('a6', 'チェインメイル', '鎖で編まれた防具', 2, 'images/items/armor_6.svg', 12, 30),
    new Armor('a7', 'スケイルアーマー', '鱗状の金属片で覆われた鎧', 2, 'images/items/armor_7.svg', 14, 35),
    new Armor('a8', 'プレートメイル', '金属板で作られた鎧', 2, 'images/items/armor_8.svg', 16, 40),
    
    // レア (レアリティ3)
    new Armor('a9', 'ミスリルアーマー', '魔法金属で作られた鎧', 3, 'images/items/armor_9.svg', 20, 50),
    new Armor('a10', 'フレイムアーマー', '炎からの攻撃を防ぐ鎧', 3, 'images/items/armor_10.svg', 22, 55),
    new Armor('a11', 'アイスアーマー', '氷からの攻撃を防ぐ鎧', 3, 'images/items/armor_11.svg', 22, 55),
    new Armor('a12', 'サンダーアーマー', '雷からの攻撃を防ぐ鎧', 3, 'images/items/armor_12.svg', 22, 55),
    
    // エピック (レアリティ4)
    new Armor('a13', 'ドラゴンアーマー', 'ドラゴンの鱗で作られた鎧', 4, 'images/items/armor_13.svg', 28, 70),
    new Armor('a14', 'デーモンアーマー', '悪魔の力を宿した鎧', 4, 'images/items/armor_14.svg', 30, 75),
    new Armor('a15', '聖なる鎧', '神聖な光の力を宿した鎧', 4, 'images/items/armor_15.svg', 30, 75),
    new Armor('a16', '風神の鎧', '風の力を宿した軽くて丈夫な鎧', 4, 'images/items/armor_16.svg', 26, 80),
    
    // レジェンダリー (レアリティ5)
    new Armor('a17', '不滅の鎧', '不死の力を宿した鎧', 5, 'images/items/armor_17.svg', 40, 100),
    new Armor('a18', '宇宙の鎧', '宇宙の力を宿した鎧', 5, 'images/items/armor_18.svg', 45, 110),
    new Armor('a19', '英雄の鎧', '多くの英雄が着てきた伝説の鎧', 5, 'images/items/armor_19.svg', 50, 120),
    new Armor('a20', '真・神の鎧', '神の力が宿る最強の鎧', 5, 'images/items/armor_20.svg', 60, 150)
];

// 消費アイテムのリスト
const consumables = [
    // HP回復アイテム
    new Consumable('c1', '薬草', '少しHPを回復する', 1, 'images/items/consumable_1.svg', 'heal', 20),
    new Consumable('c2', '回復薬', '中程度HPを回復する', 2, 'images/items/consumable_2.svg', 'heal', 50),
    new Consumable('c3', '上質な回復薬', '大量のHPを回復する', 3, 'images/items/consumable_3.svg', 'heal', 100),
    new Consumable('c4', '万能薬', 'HPを完全に回復する', 4, 'images/items/consumable_4.svg', 'heal', 999),
    
    // 攻撃力アップアイテム
    new Consumable('c5', '攻撃力の種', '一時的に攻撃力が上昇する', 2, 'images/items/consumable_5.svg', 'attack_boost', 10),
    new Consumable('c6', '力の実', '一時的に攻撃力が大きく上昇する', 3, 'images/items/consumable_6.svg', 'attack_boost', 20),
    
    // 防御力アップアイテム
    new Consumable('c7', '防御力の種', '一時的に防御力が上昇する', 2, 'images/items/consumable_7.svg', 'defense_boost', 10),
    new Consumable('c8', '盾の実', '一時的に防御力が大きく上昇する', 3, 'images/items/consumable_8.svg', 'defense_boost', 20)
];

// 貴重品のリスト
const valuables = [
    // パワーアップアイテム
    new Valuable('v1', 'HP水晶', '最大HPが永続的に増加する', 3, 'images/items/valuable_1.svg', 'permanent_hp', 10),
    new Valuable('v2', '力の水晶', '攻撃力が永続的に増加する', 3, 'images/items/valuable_2.svg', 'permanent_attack', 2),
    new Valuable('v3', '守りの水晶', '防御力が永続的に増加する', 3, 'images/items/valuable_3.svg', 'permanent_defense', 2),
    new Valuable('v4', '幸運の水晶', 'クリティカル率が永続的に増加する', 3, 'images/items/valuable_4.svg', 'permanent_crit', 0.01),
    
    // ステージの鍵
    new Valuable('k1', '銅の鍵', '次のステージへの鍵', 3, 'images/items/key_1.svg', 'key', 1, true),
    new Valuable('k2', '銀の鍵', '中級ステージへの鍵', 4, 'images/items/key_2.svg', 'key', 2, true),
    new Valuable('k3', '金の鍵', '上級ステージへの鍵', 5, 'images/items/key_3.svg', 'key', 3, true)
];

// アイテムのドロップ確率計算
function calculateDrops(enemyLevel) {
    // ドロップ確率をレベルに基づいて調整
    const dropChance = 0.6 + (enemyLevel * 0.02); // 基本60%、レベルごとに2%上昇、上限95%
    const finalDropChance = Math.min(0.95, dropChance);
    
    // ドロップするかの判定
    if (Math.random() > finalDropChance) {
        return null; // ドロップなし
    }
    
    // 敵のレベルに基づいてレアリティの上限を決定
    let maxRarity;
    if (enemyLevel >= 25) maxRarity = 5;      // レベル25以上: レジェンダリーまで
    else if (enemyLevel >= 15) maxRarity = 4; // レベル15以上: エピックまで
    else if (enemyLevel >= 8) maxRarity = 3;  // レベル8以上: レアまで
    else if (enemyLevel >= 3) maxRarity = 2;  // レベル3以上: アンコモンまで
    else maxRarity = 1;                       // レベル3未満: コモンのみ
    
    // レアリティの決定（高レベルほど高レアリティが出やすい）
    let rarityRoll = Math.random();
    let selectedRarity;
    
    if (rarityRoll < 0.5) {
        // 50%: 基本レアリティ（敵レベルによって変動）
        selectedRarity = 1 + Math.floor(Math.random() * Math.min(2, maxRarity));
    } else if (rarityRoll < 0.85) {
        // 35%: 中間レアリティ
        selectedRarity = Math.min(maxRarity, 2 + Math.floor(Math.random() * 2));
    } else {
        // 15%: 最高レアリティ（低確率）
        selectedRarity = Math.min(maxRarity, 3 + Math.floor(Math.random() * 3));
    }
    
    // 特定の敵タイプによるボーナス（後で実装）
    
    // アイテムタイプの決定
    const typeRoll = Math.random();
    
    // アイテムタイプの確率配分
    // 5%: 鍵アイテム（特に高レベル敵から）
    // 30%: 消費アイテム/貴重品
    // 35%: 武器
    // 30%: 盾/防具
    let selectedType, selectedPool;
    
    if (typeRoll < 0.05 && enemyLevel >= 10) {
        // 鍵アイテム（レベル10以上の敵のみ）
        const keyLevel = Math.min(Math.ceil(enemyLevel / 10), 3);
        return valuables.find(v => v.isKey && v.value === keyLevel);
    } else if (typeRoll < 0.35) {
        // 消費アイテムまたは貴重品
        if (Math.random() < 0.8) {
            selectedPool = consumables.filter(c => c.rarity <= selectedRarity);
        } else {
            selectedPool = valuables.filter(v => !v.isKey && v.rarity <= selectedRarity);
        }
    } else if (typeRoll < 0.70) {
        // 武器
        selectedPool = weapons.filter(w => w.rarity <= selectedRarity);
    } else {
        // 盾/防具
        if (Math.random() < 0.5) {
            selectedPool = shields.filter(s => s.rarity <= selectedRarity);
        } else {
            selectedPool = armors.filter(a => a.rarity <= selectedRarity);
        }
    }
    
    // アイテムプールから選択
    if (selectedPool && selectedPool.length > 0) {
        return selectedPool[Math.floor(Math.random() * selectedPool.length)];
    }
    
    // フォールバック（何も選択されなかった場合は薬草）
    return consumables[0];
}

// インベントリクラス
class Inventory {
    constructor() {
        this.weapons = [];
        this.shields = [];
        this.armors = [];
        this.consumables = [];
        this.valuables = [];
        this.keys = [];
        
        this.equippedWeapon = null;
        this.equippedShield = null;
        this.equippedArmor = null;
    }
    
    addItem(item) {
        if (item instanceof Weapon) {
            this.weapons.push(item);
        } else if (item instanceof Shield) {
            this.shields.push(item);
        } else if (item instanceof Armor) {
            this.armors.push(item);
        } else if (item instanceof Consumable) {
            this.consumables.push(item);
        } else if (item instanceof Valuable) {
            if (item.isKey) {
                this.keys.push(item);
            } else {
                this.valuables.push(item);
            }
        }
    }
    
    // アイテムをグループ化して個数を取得
    getGroupedItems(itemArray) {
        const groupedItems = [];
        const itemCounts = {};
        
        // アイテムを集計
        itemArray.forEach(item => {
            if (!itemCounts[item.id]) {
                itemCounts[item.id] = {
                    item: item,
                    count: 0
                };
                groupedItems.push(itemCounts[item.id]);
            }
            itemCounts[item.id].count++;
        });
        
        return groupedItems;
    }
    
    // グループ化されたアイテム配列を取得
    getGroupedWeapons() {
        return this.getGroupedItems(this.weapons);
    }
    
    getGroupedShields() {
        return this.getGroupedItems(this.shields);
    }
    
    getGroupedArmors() {
        return this.getGroupedItems(this.armors);
    }
    
    getGroupedConsumables() {
        return this.getGroupedItems(this.consumables);
    }
    
    getGroupedValuables() {
        return this.getGroupedItems(this.valuables);
    }
    
    getGroupedKeys() {
        return this.getGroupedItems(this.keys);
    }
    
    equipWeapon(weaponId) {
        const weapon = this.weapons.find(w => w.id === weaponId);
        if (weapon) {
            this.equippedWeapon = weapon;
            return true;
        }
        return false;
    }
    
    equipShield(shieldId) {
        const shield = this.shields.find(s => s.id === shieldId);
        if (shield) {
            this.equippedShield = shield;
            return true;
        }
        return false;
    }
    
    equipArmor(armorId) {
        const armor = this.armors.find(a => a.id === armorId);
        if (armor) {
            this.equippedArmor = armor;
            return true;
        }
        return false;
    }
    
    useConsumable(consumableId) {
        const index = this.consumables.findIndex(c => c.id === consumableId);
        if (index !== -1) {
            const consumable = this.consumables[index];
            this.consumables.splice(index, 1);
            return consumable;
        }
        return null;
    }
    
    useValuable(valuableId) {
        const index = this.valuables.findIndex(v => v.id === valuableId);
        if (index !== -1) {
            const valuable = this.valuables[index];
            this.valuables.splice(index, 1);
            return valuable;
        }
        return null;
    }
    
    hasKey(level) {
        return this.keys.some(k => k.value === level);
    }
    
    useKey(level) {
        const index = this.keys.findIndex(k => k.value === level);
        if (index !== -1) {
            const key = this.keys[index];
            this.keys.splice(index, 1);
            return true;
        }
        return false;
    }
}

// グローバルインベントリを作成
const playerInventory = new Inventory();

// デフォルト装備を追加
playerInventory.addItem(weapons[0]); // 木の剣
playerInventory.equipWeapon(weapons[0].id);

// アイテムのエクスポート
export { 
    Item, Weapon, Shield, Armor, Consumable, Valuable, 
    weapons, shields, armors, consumables, valuables, 
    calculateDrops, playerInventory, Inventory 
}; 