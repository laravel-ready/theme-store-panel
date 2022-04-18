import Toastify from "toastify-js";

const successGradient = "linear-gradient(to right, #00b09b, #96c93d)",
    errorGradient = "linear-gradient(to right, #ac432d, #f86041)",
    infoGradient = "linear-gradient(to right, #174fa1, #2174ed)";

const gravity = "top"; // `top` or `bottom`
const position = "right"; // `left`, `center` or `right`

export default {
    notification(text, duration = 5000, callback = null, color = null) {
        Toastify({
            text: text,
            duration: duration,
            close: true,
            gravity: gravity,
            position: position,
            stopOnFocus: true,
            style: {
                background: color,
            },
            onClick: callback,
        }).showToast();
    },

    success(text, duration = 5000, callback = null) {
        this.notification(text, duration, callback, successGradient);
    },

    error(text, duration = 5000, callback = null) {
        this.notification(text, duration, callback, errorGradient);
    },

    info(text, duration = 5000, callback = null) {
        this.notification(text, duration, callback, infoGradient);
    },
};
