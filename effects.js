// エフェクトシステム
class Effect {
    constructor(type, duration, element) {
        this.type = type;
        this.duration = duration; // ミリ秒
        this.element = element; // エフェクトを適用するDOM要素
        this.active = false;
    }
    
    play() {
        if (this.active) return;
        
        this.active = true;
        this.element.classList.add(this.type);
        
        setTimeout(() => {
            this.stop();
        }, this.duration);
    }
    
    stop() {
        if (!this.active) return;
        
        this.active = false;
        this.element.classList.remove(this.type);
    }
}

// エフェクトマネージャー
class EffectManager {
    constructor() {
        this.effects = {};
        this.particles = [];
    }
    
    // エフェクトを登録
    registerEffect(name, type, duration, element) {
        this.effects[name] = new Effect(type, duration, element);
    }
    
    // エフェクトを再生
    playEffect(name) {
        if (this.effects[name]) {
            this.effects[name].play();
        }
    }
    
    // エフェクトを停止
    stopEffect(name) {
        if (this.effects[name]) {
            this.effects[name].stop();
        }
    }
    
    // パーティクルエフェクトを作成（例：ヒット時、回復時）
    createParticle(x, y, color, size, duration, container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        container.appendChild(particle);
        
        // パーティクルのアニメーション
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 2; // 上向きのバイアス
        
        let opacity = 1;
        let posX = x;
        let posY = y;
        
        const particle_id = this.particles.length;
        this.particles.push(particle);
        
        const animate = () => {
            posX += vx;
            posY += vy;
            vy += 0.1; // 重力
            opacity -= 1.0 / (duration / 16); // フレームごとに不透明度を下げる
            
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                container.removeChild(particle);
                this.particles.splice(particle_id, 1);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // ヒットエフェクト
    createHitEffect(x, y, container) {
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb6b6'];
        for (let i = 0; i < 10; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 3 + Math.random() * 4;
            this.createParticle(x, y, color, size, 500, container);
        }
    }
    
    // 回復エフェクト
    createHealEffect(x, y, container) {
        const colors = ['#6bff6b', '#8eff8e', '#b6ffb6'];
        for (let i = 0; i < 10; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 3 + Math.random() * 4;
            this.createParticle(x, y, color, size, 500, container);
        }
    }
    
    // アイテム取得エフェクト
    createItemEffect(x, y, container) {
        const colors = ['#ffd700', '#ffec8e', '#fffab6'];
        for (let i = 0; i < 15; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 3 + Math.random() * 5;
            this.createParticle(x, y, color, size, 800, container);
        }
    }
    
    // レベルアップエフェクト
    createLevelUpEffect(x, y, container) {
        const colors = ['#6b6bff', '#8e8eff', '#b6b6ff'];
        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 4 + Math.random() * 6;
            this.createParticle(x, y, color, size, 1200, container);
        }
    }
    
    // 全パーティクルをクリア
    clearAllParticles(container) {
        this.particles.forEach(particle => {
            if (particle.parentNode === container) {
                container.removeChild(particle);
            }
        });
        this.particles = [];
    }
}

// グローバルエフェクトマネージャーを作成
const effectManager = new EffectManager();

// エクスポート
export { Effect, EffectManager, effectManager }; 