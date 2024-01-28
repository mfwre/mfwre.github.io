class Field {
    constructor(n_cells) {
        this.n_cells = n_cells;
        this.boxes = [];
        this.field = Array(n_cells);
        for (const i of Array(n_cells).keys()) {
            this.field[i] = new Array();
        }
    }

    add_box(box) {
        let column = this.field[box.start_x];

        let boxes_ahead = column.filter(item => item.y > box.start_y);
        boxes_ahead.sort((a, b) => a.y >= b.y);


        if (boxes_ahead.length > 0) {
            box.y_limit = boxes_ahead[0].y_limit - 1;
        }

        column.push(box);
        this.boxes.push(box);

        box.fill();
    }

    update() {
        this.boxes.forEach(box => {
            box.move();
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
        /* this.id = Math.random().toString(16).slice(2); */
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

function spawn_box(x, y) {
    let box = new Box(x, y, new Date() - LOAD_TIME);
    FIELD.add_box(box);
}

function setup() {
    let container = document.getElementById("container");
    for (let y of Array(N_BOXES).keys()) {
        for (let x of Array(N_BOXES).keys()) {
            let element = document.createElement("div");
            element.setAttribute("id", `c${x}r${y}`);
            element.setAttribute("class", `cell r${y} c${x}`);
            element.setAttribute("x", x);
            element.setAttribute("y", y);

            element.addEventListener("mouseenter", () => spawn_box(x, y));

            container.append(element);
        }
    }

    let rect = container.getBoundingClientRect();
    container.addEventListener("touchmove", event => {
        event.preventDefault();

        // touches: https://developer.mozilla.org/en-US/docs/Web/API/TouchList
        // scrollX === pageXOffset (deprecated)
        let offset_x = (event.touches[0].clientX - window.scrollX - rect.left);
        let offset_y = (event.touches[0].clientY - window.scrollY - rect.top);

        let x = Math.floor(offset_x / 15);
        let y = Math.floor(offset_y / 15);

        spawn_box(x, y);
    })
}

window.onload = setup;

window.setInterval(() => {
    FIELD.update();
}, 100);
