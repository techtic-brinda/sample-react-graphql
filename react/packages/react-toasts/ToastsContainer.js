import * as React from "react";
import { Component } from "react";
import * as ReactDOM from "react-dom";
import { DarkColors, LightColors } from "./DefaultColors";

export const ToastsContainerPosition = {
  BOTTOM_CENTER : "bottom_center",
  BOTTOM_LEFT : "bottom_left",
  BOTTOM_RIGHT : "bottom_right",
  TOP_CENTER : "top_center",
  TOP_LEFT : "top_left",
  TOP_RIGHT : "top_right",
}



export class ToastsContainer extends Component {
  storeSubscriptionId;
  timeoutArray = [];

  constructor(props) {
    super(props);

    this.state = {
      styles: {},
      toasts: [],
    };

    this.storeSubscriptionId = -1;
    this.timeoutArray = [];
  }

  componentDidMount() {
    this.storeSubscriptionId = this.props.store.watch((data) => {
      const toast = { ...data, id: Math.random() };
      this.setState({ toasts: [toast].concat(this.state.toasts) });
      this.timeoutArray.push(setTimeout(() => {
        this.setState({ toasts: this.state.toasts.filter((t) => t.id !== toast.id) });
      }, data.timer || 3000));
    });

    const styles = {};
    switch (this.props.position) {
      case ToastsContainerPosition.TOP_LEFT:
        styles.top = 10;
        styles.left = 10;
        break;
      case ToastsContainerPosition.TOP_RIGHT:
        styles.top = 10;
        styles.right = 10;
        break;
      case ToastsContainerPosition.TOP_CENTER:
        styles.top = 10;
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      case ToastsContainerPosition.BOTTOM_LEFT:
        styles.bottom = 10;
        styles.left = 10;
        break;
      case ToastsContainerPosition.BOTTOM_RIGHT:
        styles.bottom = 10;
        styles.right = 10;
        break;
      case ToastsContainerPosition.BOTTOM_CENTER:
        styles.bottom = 10;
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      default:
        styles.bottom = 10;
        styles.right = 10;
        break;
    }
    this.setState({ styles });
  }

  componentWillUnmount() {
    this.props.store.unwatch(this.storeSubscriptionId);
    this.timeoutArray.forEach(clearTimeout);
  }

  render() {
    return ReactDOM.createPortal(
      this._renderContainer(),
      document.body,
    );
  }

  _renderContainer() {
    const style = this.props.lightBackground ? LightColors : DarkColors;
    return (
      <div style={this.state.styles}
           className={"toasts-container " + (this.props.className || "")}>
        {
          this.state.toasts.map((toast) => {
            return (
              <div key={toast.id}
                   className={"toast toast-" + toast.status + " " + toast.classNames}
                   style={style[toast.status]}>
                {toast.message}
              </div>
            );
          })
        }
      </div>
    );
  }
}
