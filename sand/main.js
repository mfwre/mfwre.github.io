class Field {
    constructor(n_cells) {
        this.n_cells = n_cells;
        this.boxes = [];
        this.field = Array(n_cells);
        for (const i of Array(n_cells).keys()) {
            this.field[i] = Array(n_cells).fill(null);
        }
    }

    add_box(box) {
        let column = this.field[box.start_x];
        if (column[box.start_y] == null) {
            column[box.start_y] = box;
            this.boxes.push(box);
        } else {
            return;
        }

        for (let col_index of Array(N_BOXES - box.start_y).keys()) {
            let next_box = column[1 + col_index + box.start_y];
            if (next_box) {
                box.y_limit = next_box.y_limit - 1;
                break;
            }
        }

        box.y_limit = this.columns[box.start_y];
        this.columns[box.start_y] -= 1;
        box.fill();
    }

    update() {
        this.boxes.forEach(box => {
            let column = this.field[box.start_x];
            column[box.y] = null;
            box.move();
            column[box.y] = box;

            if (box.arrived) {
                this.boxes.splice(this.boxes.indexOf(box), 1);
            }
        });
    }
}

class Box {
    constructor(x, y) {
        this.start_x = x;
        this.start_y = y;
        this.ticks = 0;
        this.y_limit = N_BOXES - 1;
        this.arrived = false;
        this.id = Math.random().toString(16).slice(2);
    }

    get y() {
        let y = this.start_y + Math.floor(Math.pow(this.ticks, 2) * 9.81);
        if (y >= this.y_limit) {
            this.arrived = true;
            return this.y_limit;
        }

        return y;
    }

    get color() {
        return COLORS[parseInt(this.ticks % 0.5 * 10)];
    }

    reset() {
        document
            .getElementById(`c${this.start_x}r${this.y}`)
            .style.background = null;
    }

    fill() {
        document
            .getElementById(`c${this.start_x}r${this.y}`)
            .style.background = this.color;
    }

    move() {
        if (this.arrived) {
            return;
        }

        this.reset();
        this.ticks += 0.1;
        this.fill();
    }
}

const LOAD_TIME = new Date();
const N_BOXES = 50;
const FIELD = new Field(N_BOXES);

const COLORS = {
    0: "#0B2732",
    1: "#18445D",
    2: "#1F7698",
    3: "#04C2D7",
    4: "#78E6F2",
};

function spawn_box(event) {
    let x = parseInt(event.target.getAttribute("x"));
    let y = parseInt(event.target.getAttribute("y"));

    let box = new Box(x, y, new Date() - LOAD_TIME);
    FIELD.add_box(box);
}

function setup() {
    let container = document.getElementById("container");
    for (let i of Array(N_BOXES).keys()) {
        for (let j of Array(N_BOXES).keys()) {
            let element = document.createElement("div");
            element.setAttribute("id", `c${j}r${i}`);
            element.setAttribute("class", `cell r${i} c${j}`);
            element.setAttribute("x", j);
            element.setAttribute("y", i);

            element.addEventListener("mouseenter", e => spawn_box(e));
            element.addEventListener("touchend", e => spawn_box(e));

            container.append(element);
        }
    }
}

window.onload = setup;

window.setInterval(() => {
    FIELD.update();
}, 100);
