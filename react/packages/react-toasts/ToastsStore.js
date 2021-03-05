import {WatchableStore} from "watchable-stores";

class Store extends WatchableStore {
    constructor() {
        super({status: "", message: "", timer: 0, classNames: ""});
    }

    success(message, timer, classNames) {
        this._toast("success", message, timer, classNames);
    }

    info(message, timer, classNames) {
        this._toast("info", message, timer, classNames);
    }

    warning(message, timer, classNames) {
        this._toast("warning", message, timer, classNames);
    }

    error(message, timer, classNames) {
        this._toast("error", message, timer, classNames);
    }

    _toast(status, message,
                   timer, classNames) {
        this.data = {
            classNames: classNames || "",
            message,
            status,
            timer: timer || 3000,
        };
    }
}

export const ToastsStore = new Store();
