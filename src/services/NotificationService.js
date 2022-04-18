import Toastify from "toastify-js";

const successGradient = "linear-gradient(to right, #00b09b, #96c93d)",
    errorGradient = "linear-gradient(to right, #ac432d, #f86041)";

const gravity = "top"; // `top` or `bottom`
const position = "right"; // `left`, `center` or `right`

export default {
    success(text, duration = 5000, callback = null) {
        Toastify({
            text: text,
            duration: duration,
            close: true,
            gravity: gravity,
            position: position,
            stopOnFocus: true,
            style: {
                background: successGradient,
            },
            onClick: callback,
        }).showToast();
    },

    error(text, duration = 5000, callback = null) {
        Toastify({
            text: text,
            duration: duration,
            close: true,
            gravity: gravity,
            position: position,
            stopOnFocus: true,
            style: {
                background: errorGradient,
            },
            onClick: callback,
        }).showToast();
    },
};
