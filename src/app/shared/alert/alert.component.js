"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AlertComponent = (function () {
    function AlertComponent(meditor) {
        var _this = this;
        this.meditor = meditor;
        this.state = null;
        this.hidden = true;
        this.subscription = null;
        this.subscription = meditor.getObservable().subscribe(function (msg) {
            if (msg.id === 'alert') {
                _this.state = msg.body;
                _this.state.hidden = false;
                _this.hidden = false;
            }
        });
    }
    AlertComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    // 按取消按钮
    AlertComponent.prototype.clickCancel = function () {
        if (this.state.cancelEvn) {
            this.state.cancelEvn();
        }
        this.state.hidden = true;
        this.hidden = true;
    };
    // 按确定按钮
    AlertComponent.prototype.clickConfirm = function () {
        if (this.state.confirmEvn) {
            this.state.confirmEvn();
        }
        this.state.hidden = true;
        this.hidden = true;
    };
    // 关闭窗口
    AlertComponent.prototype.close = function () {
        if (this.state.closeEvn) {
            this.state.closeEvn();
        }
        this.state.hidden = true;
        this.hidden = true;
    };
    // 点击了非内容区
    AlertComponent.prototype.click_outside = function () {
        if (this.state.outsideEvn) {
            this.state.outsideEvn();
        }
        else {
            this.state.hidden = true;
            this.hidden = true;
        }
    };
    return AlertComponent;
}());
AlertComponent = __decorate([
    core_1.Component({
        selector: 'app-alert',
        templateUrl: './alert.component.html',
        styleUrls: ['./alert.component.css']
    })
], AlertComponent);
exports.AlertComponent = AlertComponent;
