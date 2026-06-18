/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import * as Phaser from 'phaser';

export class GTOMatterScene extends Phaser.Scene {
    cadet!: MatterJS.BodyType;
    fatta!: MatterJS.BodyType;
    holdingFatta: boolean = false;
    g!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'GTOMatterScene' });
    }

    create() {
        // Init Matter.js Box2D engine
        this.matter.world.setGravity(0, 0);

        // Abstract Top-Down positions mapped perfectly to the Iso View
        // Start Plat: x=0..200. Red Zone: 200..300 (Gap 1: 100px <= 4ft, jumpable). Blue: 300..400. Red Zone: 400..600 (Gap 2: 200px > 4ft). Green: 600..800
        this.cadet = this.matter.add.circle(100, 166, 15, { label: 'CADET' });
        this.fatta = this.matter.add.rectangle(140, 166, 160, 20, { label: 'FATTA', isStatic: true });
        
        // Injecting Balli (log) to test Rule of Rigidity
        (this as any).balli = this.matter.add.rectangle(160, 166, 160, 10, { label: 'BALLI', isStatic: true });
        
        // Tying state
        (this as any).holdingMaterial = 'NONE'; // NONE | FATTA | BALLI | ROPE
        (this as any).tiedRigid = false;

        this.g = this.add.graphics();
        (window as unknown as { PhaserGtoScene: GTOMatterScene }).PhaserGtoScene = this;
    }

    move(velocity: number) {
        this.matter.body.setVelocity(this.cadet as unknown as MatterJS.BodyType, { x: velocity, y: 0 });
    }

    doAction() {
        if ((this as any).holdingMaterial === 'NONE') {
            const distFatta = Math.abs(this.cadet.position.x - this.fatta.position.x);
            const distBalli = Math.abs(this.cadet.position.x - (this as any).balli.position.x);
            
            // Rule of Rigidity Check: Attempting to tie Fatta + Balli
            if (distFatta < 80 && distBalli < 80 && !(this as any).tiedRigid) {
                // Rule of Rigidity strictly prohibits tying two rigid materials together
                window.dispatchEvent(new CustomEvent('GTO_PENALTY', { detail: 'Rule of Rigidity: Cannot tie two rigid materials (Fatta + Balli) together!' }));
                (this as any).tiedRigid = true; // Mark as tied so we don't spam
                return;
            }

            if (distFatta < 80) { (this as any).holdingMaterial = 'FATTA'; this.holdingFatta = true; }
            else if (distBalli < 80) { (this as any).holdingMaterial = 'BALLI'; }
        } else {
            // Drop Material
            if ((this as any).holdingMaterial === 'FATTA') {
                this.holdingFatta = false;
                this.matter.body.setPosition(this.fatta as unknown as MatterJS.BodyType, { x: this.cadet.position.x + 80, y: 166 });
            } else if ((this as any).holdingMaterial === 'BALLI') {
                this.matter.body.setPosition((this as any).balli as unknown as MatterJS.BodyType, { x: this.cadet.position.x + 80, y: 166 });
            }
            (this as any).holdingMaterial = 'NONE';
        }
    }

    getProximity() {
        if ((this as any).holdingMaterial !== 'NONE') return { label: `Drop ${(this as any).holdingMaterial}`, icon: '⬇️', action: 'DROP' };
        
        const distFatta = Math.abs(this.cadet.position.x - this.fatta.position.x);
        const distBalli = Math.abs(this.cadet.position.x - (this as any).balli.position.x);
        
        if (distFatta < 80 && distBalli < 80 && !(this as any).tiedRigid) {
            return { label: 'Tie Fatta & Balli', icon: '🪢', action: 'TIE' };
        }
        
        if (distFatta < 80) return { label: 'Pick Up Fatta', icon: '🪵', action: 'PICKUP' };
        if (distBalli < 80) return { label: 'Pick Up Balli', icon: '🪵', action: 'PICKUP' };
        
        return { label: 'Move Closer', icon: '👣', action: 'NONE' };
    }

    update() {
        const cx = this.cadet.position.x;

        // --- PHYSICS COLISSION DETECTION & DISTANCE (RULE OF COLORS & RULE OF DISTANCE) ---
        // Rule of Distance: Gaps > 4 feet (approx 100px logic units) cannot be jumped.
        // Gap between White (200) and Blue (300) = 100px (<= 4ft, jumpable)
        // Gap between Blue (400) and Green (600) = 200px (> 4ft, impossible to jump)
        let safe = false;
        let jumping = false;
        
        if (cx >= 0 && cx <= 200) safe = true; // Safe on White Start
        if (cx >= 200 && cx <= 300) { safe = true; jumping = true; } // Automatically jumps Gap 1 (< 4ft)
        if (cx >= 300 && cx <= 400) safe = true; // Safe on Blue Platform
        if (cx >= 600 && cx <= 800) safe = true; // Safe on Green Finish

        if (!this.holdingFatta) {
            // Can walk on Fatta bridge!
            const fMin = this.fatta.position.x - 80;
            const fMax = this.fatta.position.x + 80;
            if (cx >= fMin && cx <= fMax) { safe = true; jumping = false; }
        }
        
        // Similar check for Balli
        if ((this as any).holdingMaterial !== 'BALLI') {
            const bMin = (this as any).balli.position.x - 80;
            const bMax = (this as any).balli.position.x + 80;
            if (cx >= bMin && cx <= bMax) { safe = true; jumping = false; }
        }

        if (!safe) {
            // Rule of Distance violated (> 4 ft gap) or stepped off bridge -> Fall to Red!
            window.dispatchEvent(new CustomEvent('GTO_PENALTY', { detail: 'Rule of Distance Violation: You cannot jump more than 4 feet! Gap must be bridged.' }));
            // Box2D physics reset to start platform constraint
            this.matter.body.setPosition(this.cadet as unknown as MatterJS.BodyType, { x: 100, y: 166 });
            this.holdingFatta = false;
            (this as any).holdingMaterial = 'NONE';
            this.matter.body.setVelocity(this.cadet as unknown as MatterJS.BodyType, { x: 0, y: 0 });
        }

        // --- RULE OF RIGIDITY (FATTA FALL CHECK) ---
        if (!this.holdingFatta) {
            const fMin = this.fatta.position.x - 80;
            const fMax = this.fatta.position.x + 80;
            const leftSupp = (fMin <= 200) || (fMin >= 300 && fMin <= 400) || (fMin >= 600);
            const rightSupp = (fMax <= 200) || (fMax >= 300 && fMax <= 400) || (fMax >= 600);

            if (!leftSupp || !rightSupp) {
                if (!(window as unknown as { fattaFell?: boolean }).fattaFell) {
                    (window as unknown as { fattaFell?: boolean }).fattaFell = true;
                    // Rule of Colors violation -> material in red zone
                    window.dispatchEvent(new CustomEvent('GTO_PENALTY', { detail: 'Rule of Colors/Rigidity: Fatta dropped in Red Zone!' }));
                }
            } else {
                (window as unknown as { fattaFell?: boolean }).fattaFell = false;
            }
        }

        if (cx >= 650) {
            if (!(window as unknown as { missionLogged?: boolean }).missionLogged) {
                (window as unknown as { missionLogged?: boolean }).missionLogged = true;
                window.dispatchEvent(new CustomEvent('GTO_MISSION_ACCOMPLISHED'));
            }
        }

        // Drag physics deceleration (friction simulator)
        this.matter.body.setVelocity(this.cadet as unknown as MatterJS.BodyType, { x: this.cadet.velocity.x * 0.8, y: 0 });

        this.renderIso();
    }

    // --- 2.5D ISOMETRIC PARALLAX RENDERING OF THE LOGICAL PHYSICS WORLD ---
    renderIso() {
        this.g.clear();

        const TW = 72, TH = 36, BH = 40, OX = 400, OY = 140;
        const toIso = (col: number, row: number) => ({ sx: (col - row) * (TW / 2), sy: (col + row) * (TH / 2) });

        const drawIsoTile = (c: number, r: number, color: number) => {
            const { sx, sy } = toIso(c, r);
            this.g.fillStyle(color, 1).beginPath()
                .moveTo(OX + sx, OY + sy)
                .lineTo(OX + sx + TW / 2, OY + sy + TH / 2)
                .lineTo(OX + sx, OY + sy + TH)
                .lineTo(OX + sx - TW / 2, OY + sy + TH / 2)
                .closePath().fillPath();
        };

        const drawIsoBox = (c: number, r: number, boxH: number, tC: number, rC: number, lC: number) => {
            const { sx, sy } = toIso(c, r);
            const x = OX + sx, y = OY + sy;
            this.g.fillStyle(tC, 1).beginPath()
                .moveTo(x, y - boxH).lineTo(x + TW / 2, y + TH / 2 - boxH).lineTo(x, y + TH - boxH).lineTo(x - TW / 2, y + TH / 2 - boxH)
                .closePath().fillPath();
            this.g.fillStyle(rC, 1).beginPath()
                .moveTo(x + TW / 2, y + TH / 2 - boxH).lineTo(x + TW / 2, y + TH / 2).lineTo(x, y + TH).lineTo(x, y + TH - boxH)
                .closePath().fillPath();
            this.g.fillStyle(lC, 1).beginPath()
                .moveTo(x - TW / 2, y + TH / 2 - boxH).lineTo(x - TW / 2, y + TH / 2).lineTo(x, y + TH).lineTo(x, y + TH - boxH)
                .closePath().fillPath();
        };

        // Render Ground (Red Zone)
        for (let r = 0; r < 4; r++) {
            for (let c = 2; c < 6; c++) drawIsoTile(c, r, 0xdc2626);
        }

        // Render Structures mapped from Logic to Iso Canvas
        drawIsoBox(0.5, 1.5, BH, 0xf1f5f9, 0xcbd5e1, 0x94a3b8);
        drawIsoBox(1.5, 1.5, BH, 0xf1f5f9, 0xcbd5e1, 0x94a3b8);
        drawIsoBox(3, 1.5, BH + 10, 0x3b82f6, 0x1d4ed8, 0x1e40af);
        drawIsoBox(6.5, 1.5, BH, 0x10b981, 0x047857, 0x065f46);
        drawIsoBox(7.5, 1.5, BH, 0x10b981, 0x047857, 0x065f46);

        // Render Fatta (Physics Body interpolation)
        const fxRow = 1.5;
        const fxCol = this.fatta.position.x / 100;
        this.g.lineStyle(9, 0x92400e);
        let fY_offset = -BH;
        if ((this as any).holdingMaterial === 'FATTA') fY_offset = -BH - 20;
        else if ((window as unknown as { fattaFell?: boolean }).fattaFell) fY_offset = 0;
        const fS = toIso(fxCol - 0.8, fxRow), fE = toIso(fxCol + 0.8, fxRow);
        this.g.beginPath().moveTo(OX + fS.sx, OY + fS.sy + fY_offset).lineTo(OX + fE.sx, OY + fE.sy + fY_offset).strokePath();

        // Render Balli (Physics Body interpolation) - drawn as a cylindrical log
        const bxRow = 1.3;
        const bxCol = (this as any).balli.position.x / 100;
        this.g.lineStyle(7, 0x78350f); // Darker brown for Balli log
        let bY_offset = -BH;
        if ((this as any).holdingMaterial === 'BALLI') bY_offset = -BH - 20;
        // else if ((window as any).balliFell) bY_offset = 0; // if balli logic was added
        const bS = toIso(bxCol - 0.7, bxRow), bE = toIso(bxCol + 0.7, bxRow);
        this.g.beginPath().moveTo(OX + bS.sx, OY + bS.sy + bY_offset).lineTo(OX + bE.sx, OY + bE.sy + bY_offset).strokePath();

        // Render Cadet Avatar (Physics Body interpolation)
        const cc = this.cadet.position.x / 100;
        const cP = toIso(cc, 1.5);
        
        // If jumping gap, animate up a bit
        let jumpY = 0;
        if (cc > 2.0 && cc < 3.0 && !(this as any).holdingFatta && (this as any).holdingMaterial !== 'BALLI') {
            jumpY = -Math.sin(((cc - 2.0) / 1.0) * Math.PI) * 20;
        }

        this.g.fillStyle(0x4d783e).fillRect(OX + cP.sx - 7, OY + cP.sy - BH - 32 + jumpY, 14, 18);
        this.g.fillStyle(0xfbbf24).fillCircle(OX + cP.sx, OY + cP.sy - BH - 38 + jumpY, 7);
    }
}

export const initPhaserGame = (parent: string) => {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent,
        width: 800,
        height: 500,
        transparent: true,
        physics: { default: 'matter', matter: { gravity: { x: 0, y: 0 }, debug: false } },
        scene: [GTOMatterScene]
    });
}
