/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import type * as PhaserTypes from 'phaser';

// ─── Types ─────────────────────────────────────────────────────────────────
interface LevelPlatform {
    x: number;
    w: number;
    color: number;
    type: string;
}

interface LevelData {
    name?: string;
    startX?: number;
    finishX?: number;
    platforms?: LevelPlatform[];
    hint?: string;
}

interface PhaserGameProps {
    levelData: LevelData;
    onComplete: (timeElapsed: number, penalties: number) => void;
    onPenalty: (count: number, reason: string) => void;
    onGtoMessage: (msg: string) => void;
    onTimeOut: () => void;
}

export default function PhaserGame({ levelData, onComplete, onPenalty, onGtoMessage, onTimeOut }: PhaserGameProps) {
    const gameRef = useRef<PhaserTypes.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Stable callback refs so Phaser closures always call the latest version
    const completeRef = useRef(onComplete);
    const penaltyRef = useRef(onPenalty);
    const gtoMsgRef = useRef(onGtoMessage);
    const timeoutRef = useRef(onTimeOut);

    useEffect(() => {
        completeRef.current = onComplete;
        penaltyRef.current = onPenalty;
        gtoMsgRef.current = onGtoMessage;
        timeoutRef.current = onTimeOut;
    }, [onComplete, onPenalty, onGtoMessage, onTimeOut]);

    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current || gameRef.current) return;

        // Phaser uses browser globals — must be loaded dynamically
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Phaser: typeof PhaserTypes = require('phaser');

        class GtoScene extends Phaser.Scene {
            private violations: number = 0;
            private warningText!: PhaserTypes.GameObjects.Text;
            private timerText!: PhaserTypes.GameObjects.Text;
            private completed: boolean = false;
            private timeRemaining: number = 300;

            constructor() {
                super({ key: 'GtoScene' });
            }

            create() {
                this.cameras.main.setBackgroundColor('#2d3748');

                const startX: number = levelData?.startX ?? 75;
                const finishX: number = levelData?.finishX ?? 725;

                // Ground — Red Zone
                this.add.rectangle(400, 300, 800, 200, 0x991b1b).setAlpha(0.8);
                // Start Line (Yellow)
                this.add.rectangle(startX, 300, 100, 200, 0xfacc15).setStrokeStyle(4, 0xffffff);
                // Finish Line (Green)
                this.add.rectangle(finishX, 300, 100, 200, 0x10b981).setStrokeStyle(4, 0xffffff);

                const platforms: LevelPlatform[] = levelData?.platforms ?? [
                    { x: 250, w: 50, color: 0xffffff, type: 'white' },
                    { x: 550, w: 50, color: 0x3b82f6, type: 'blue' },
                ];

                platforms.forEach((p: LevelPlatform) => {
                    this.add.rectangle(p.x, 300, p.w, 200, p.color).setStrokeStyle(2, 0x000000);
                });

                // Materials
                const fatta = this.add.rectangle(100, 150, 220, 15, 0x8b4513).setInteractive();
                fatta.setData('type', 'rigid');
                const balli = this.add.rectangle(100, 180, 150, 20, 0x654321).setInteractive();
                balli.setData('type', 'rigid');
                const rope = this.add.rectangle(100, 120, 80, 5, 0xeeeeee).setInteractive();
                rope.setData('type', 'flexible');

                this.input.setDraggable(fatta);
                this.input.setDraggable(balli);
                this.input.setDraggable(rope);

                this.warningText = this.add
                    .text(400, 50, '', { fontSize: '24px', fontStyle: 'bold', color: '#fff', backgroundColor: '#ef4444', padding: { x: 10, y: 5 } })
                    .setOrigin(0.5)
                    .setVisible(false);
                this.timerText = this.add
                    .text(780, 20, 'Time: 05:00', { fontSize: '20px', fontStyle: 'bold', color: '#ef4444', fontFamily: 'monospace' })
                    .setOrigin(1, 0);

                this.add.text(20, 20, `LEVEL: ${levelData?.name ?? 'Command Task 1'}`, { fontSize: '18px', color: '#10b981', fontStyle: 'bold' });
                this.add.text(20, 45, 'Drag materials to build a bridge.', { fontSize: '12px', color: '#94a3b8' });

                this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
                this.time.addEvent({ delay: 20000, callback: this.applyGtoPressure, callbackScope: this, loop: true });

                // Arrow functions avoid 'unused' pointer lint while satisfying Phaser API signature
                this.input.on('drag', (_p: any, go: PhaserTypes.GameObjects.Rectangle, dx: number, dy: number) => {
                    go.x = dx; go.y = dy;
                });
                this.input.on('dragend', (_p: any, go: PhaserTypes.GameObjects.Rectangle) => {
                    this.checkRules(go, platforms, startX, finishX);
                });

                gtoMsgRef.current('GTO: Gentleman, you have 5 minutes. The obstacles ahead are painted according to standard rules. Begin.');
            }

            applyGtoPressure() {
                if (this.completed || this.timeRemaining <= 0) return;
                const messages = [
                    'GTO: Chest number 12, why are you staring? Keep moving!',
                    `GTO: Less than ${Math.ceil(this.timeRemaining / 60)} minutes remaining. Show workable ideas!`,
                    "GTO: Subordinates, implement what the Commander says. Don't just stand there.",
                    'GTO: If your idea is not working, apply Effective Intelligence. Change approach!',
                ];
                if (Math.random() < 0.3) gtoMsgRef.current(messages[Math.floor(Math.random() * messages.length)]);
            }

            updateTimer() {
                if (this.completed) return;
                this.timeRemaining--;
                const m = Math.floor(this.timeRemaining / 60);
                const s = this.timeRemaining % 60;
                this.timerText.setText(`Time: 0${m}:${s < 10 ? '0' : ''}${s}`);
                if (this.timeRemaining <= 0) {
                    this.completed = true;
                    this.timerText.setText('TIME UP');
                    gtoMsgRef.current('GTO: Time is up! Drop everything. Fall in.');
                    timeoutRef.current();
                }
            }

            checkRules(item: PhaserTypes.GameObjects.Rectangle, platforms: LevelPlatform[], startX: number, finishX: number) {
                if (this.completed) return;

                const hw = item.width / 2;
                const leftX = item.x - hw;
                const rightX = item.x + hw;
                const itemType = item.getData('type') as string;

                const isSupported = (x: number): { safe: boolean; type: string } => {
                    if (x >= startX - 50 && x <= startX + 50) return { safe: true, type: 'start' };
                    if (x >= finishX - 50 && x <= finishX + 50) return { safe: true, type: 'finish' };
                    for (const p of platforms) {
                        if (x >= p.x - p.w / 2 && x <= p.x + p.w / 2) return { safe: true, type: p.type };
                    }
                    return { safe: false, type: 'red' };
                };

                const leftSupport = isSupported(leftX);
                const rightSupport = isSupported(rightX);

                let violation = false;
                let violationMsg = '';

                // Rule of Rigidity check
                const otherItems = this.children.list.filter(
                    (c: any) => c instanceof Phaser.GameObjects.Rectangle && c !== item && c.getData('type') === 'rigid'
                );
                const touchingRigid = otherItems.some((other: any) => {
                    const oi = other as PhaserTypes.GameObjects.Rectangle;
                    return Phaser.Geom.Intersects.RectangleToRectangle(item.getBounds(), oi.getBounds());
                });

                if (itemType === 'rigid' && touchingRigid && (!leftSupport.safe || !rightSupport.safe)) {
                    violation = true; violationMsg = 'Rule of Rigidity Violation! Materials tied.';
                } else if (!leftSupport.safe || !rightSupport.safe) {
                    violation = true; violationMsg = 'Color Rule Violation! Dropped in Red Zone.';
                } else if (leftSupport.type === 'blue' || rightSupport.type === 'blue') {
                    violation = true; violationMsg = 'Color Rule Violation! Material touched Blue Platform.';
                }

                if (violation) {
                    this.violations++;
                    penaltyRef.current(this.violations, violationMsg);
                    this.showWarning(violationMsg);
                    gtoMsgRef.current("GTO: Watch the colors! That's a penalty. Start that segment again.");
                    item.x = 100;
                    item.y = itemType === 'rigid' ? 150 : 120;
                } else if (rightX >= finishX - 50) {
                    this.completed = true;
                    const timeElapsed = 300 - this.timeRemaining;
                    this.showWarning('Task Completed Successfully!');
                    this.warningText.setBackgroundColor('#10b981');
                    gtoMsgRef.current("GTO: Task completed. Well done. Let's move to the next structure.");
                    completeRef.current(timeElapsed, this.violations);
                }
            }

            showWarning(msg: string) {
                this.warningText.setText(msg).setVisible(true);
                setTimeout(() => {
                    if (this.warningText?.active) this.warningText.setVisible(false);
                }, 3000);
            }
        }

        const config: PhaserTypes.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 400,
            parent: containerRef.current as HTMLElement,
            physics: { default: 'arcade', arcade: { debug: false } },
            scene: [GtoScene],
            backgroundColor: '#2d3748',
            transparent: true,
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, [levelData]);

    return <div ref={containerRef} className="rounded-lg cursor-pointer overflow-hidden w-[800px] h-[400px]" />;
}
