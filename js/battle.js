import { CONFIG } from "./config.js";
import { Sound } from "./audio.js";
import { Particles } from "./particles.js";

export const Battle = {
    resolvePlayerAttack(player, enemies, questLog){

        if(!player.attacking || player.attackHasHit) return;

        const box = player.getAttackPoint();
        let hitSomething = false;
        
        

        for(const enemy of enemies){
            if(!enemy || enemy.state === "dead") continue;

            if(rectOverlap(box, enemy.body)){

                const wasAlive = enemy.hp > 0;

                enemy.takeDamage(player.attackDamage);
                hitSomething = true;

                if(wasAlive && enemy.hp <= 0){
                    questLog.onDefeat(enemy.type);
                    player.gainXP(enemy.xpReward);
                    Particles.burst(enemy.centerX, enemy.centerY, "#9ad9b0", 22);
                }
            }
        }

        if(hitSomething){
            player.attackHasHit = true;
        }
    }
};

function rectOverlap(a, b){
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}