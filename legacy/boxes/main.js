/* Look into following to maybe replace events?
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event
 */
let grabOffset;
let selected = null;

function handleStart(event) {
    if (event.type === 'touchstart') {
        event.preventDefault();
    }

    selected = event.target;

    let x, y;
    switch (event.type) {
        case 'mousedown':
            x = selected.offsetLeft - event.clientX;
            y = selected.offsetTop - event.clientY;
            break;

        case 'touchstart':
            x = selected.offsetLeft - event.targetTouches[0].clientX;
            y = selected.offsetTop - event.targetTouches[0].clientY;
            break;

        default:
            return;
    }

    grabOffset = { x: x, y: y };
}

function handleStop(event) {
    if (event.type === 'touchstart') {
        event.preventDefault();
    }

    selected.classList.remove('bigger');
    selected = null;
}

function handleMove(event) {
    if (selected) {
        event.preventDefault();

        const parentRef = selected.offsetParent;
        const parent = {
            width: parentRef.offsetWidth - selected.offsetWidth,
            height: parentRef.offsetHeight - selected.offsetHeight,
        };

        let x, y;
        switch (event.type) {
            case 'mousemove':
                x = grabOffset.x + event.clientX;
                y = grabOffset.y + event.clientY;
                break;

            case 'touchmove':
                x = grabOffset.x + event.targetTouches[0].clientX;
                y = grabOffset.y + event.targetTouches[0].clientY;
                break;

            default:
                return;
        }

        selected.classList.add('bigger');
        selected.style.top = `${y}px`;
        selected.style.left = `${x}px`;

        // Get offset to parent element if selected is outside
        let parentOffset = {
            x: 0,
            y: 0
        };

        if (selected.offsetLeft < 0) {
            parentOffset.x = selected.offsetLeft;
        } else if (selected.offsetLeft > parent.width) {
            parentOffset.x = parent.width - selected.offsetLeft;
        }

        if (selected.offsetTop < 0) {
            parentOffset.y = selected.offsetTop;
        } else if (selected.offsetTop > parent.height) {
            parentOffset.y = parent.height - selected.offsetTop;
        }
    }
}

window.onload = function() {
    document.querySelectorAll('.draggable')
        .forEach(target => {
            target.addEventListener('mousedown', e => handleStart(e));
            target.addEventListener('touchstart', e => handleStart(e));

            target.addEventListener('mouseup', e => handleStop(e));
            target.addEventListener('touchend', e => handleStop(e));
        });

    document.addEventListener('mousemove', e => handleMove(e));
    document.addEventListener('touchmove', e => handleMove(e));
}
