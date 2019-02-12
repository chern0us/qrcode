export default class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        return this;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector) {
        if (typeof vector === 'object') {
            this.x -= vector.x;
            this.y -= vector.y;
        }
        if (typeof vector === 'number') {
            this.x -= vector;
            this.y -= vector;
        }
        return this;
    }

    mult(vector) {
        if (typeof vector === 'object') {
            this.x *= vector.x;
            this.y *= vector.y;
        } else if (typeof vector === 'number') {
            this.x *= vector;
            this.y *= vector;
        }
        return this;
    }

    div(vector) {
        if (typeof vector === 'object') {
            this.x /= vector.x;
            this.y /= vector.y;
        } else if (typeof vector === 'number') {
            this.x /= vector;
            this.y /= vector;
        }
        return this;
    }

    norm() {
        this.div(this.mag());
        return this;
    }

    setMag(e) {
        this.norm();
        this.mult(e);
        return this;
    }

    limit(max) {
        if (this.mag() > max) {
            this.setMag(max);
        } else {
            return this;
        }
        return this;
    }

    get direction() {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle) {
        const newDirection = this.direction() + angle;
        const mag = this.mag();

        this.x = Math.cos(newDirection) * mag;
        this.y = Math.sin(newDirection) * mag;
        return this;
    }

    mag() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    angleTo(vector) {
        const angle = Math.atan2(vector.x - this.x, vector.y - this.y);
        return angle;
    }

    distanceTo(vector) {
        return Math.sqrt(((vector.x - this.x) ** 2) + ((vector.y - this.y) ** 2));
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    set(argument) {
        const set = typeof argument === 'number' ? argument : { x: argument.x, y: argument.y };
        if (typeof set === 'number') {
            this.x = set;
            this.y = set;
        } else {
            this.x = set.x;
            this.y = set.y;
        }
        return this;
    }

    map(vXmin, vXmax, vYmin, vYmax) {
        if (vXmin < this.x < vXmax && vYmin < this.y < vYmax) {
            return this;
        }
        this.x = this.x < vXmin ? vXmin : this.x;
        this.x = this.x > vXmax ? vXmax : this.x;
        this.y = this.y < vYmin ? vYmin : this.y;
        this.y = this.y > vYmax ? vYmax : this.y;
        return this;
    }

    static radians(deg) {
        return deg * (Math.PI / 180);
    }

    static degrees(rad) {
        return rad * (180 / Math.PI);
    }
}
