import Vector from './vector';

export default class Suqare {
    constructor(x, y, diameter, target) {
        this.pos = new Vector(x, y);
        this.acc = new Vector();
        this.speed = new Vector();
        this.diameter = diameter;
        this.visible = true;
        this.active = true;
        this.maxSpeed = 10;
        this.target = target.copy();
        this.initialTarget = target.copy();
        this.color = 'black';
        this.rotate = 0;
    }

    update() {
        this.speed.add(this.acc);
        this.pos.add(this.speed);
        this.acc.set(0, 0);
        return this;
    }

    draw(ctx) {
        const { x, y } = this.pos;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.fillRect(x, y, this.diameter, this.diameter);
        ctx.restore();
        return this;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    force(f) {
        this.acc.add(f);
        return this;
    }

    lookFor(tar) {
        const dir = tar ? tar.copy() : this.target.copy();
        dir.sub(this.pos);
        const steer = dir.sub(this.speed);
        steer.limit(this.maxSpeed);
        this.force(steer);
        return this;
    }

    setTarget(tar) {
        this.target = tar;
    }

    resetTarget() {
        this.target = this.initialTarget.copy();
    }

    resetPos() {
        this.pos = this.initialTarget.copy();
    }

    setSpeed(speed) {
        this.maxSpeed = speed;
    }

    setColor(color) {
        this.color = color;
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    setX(x) {
        this.pos.x = x;
    }

    setY(y) {
        this.pos.y = y;
    }

    setAngle(a) {
        this.rotate = a;
    }
}
