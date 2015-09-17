﻿module FrontEnd {

    export function toggleElement(item: HTMLElement) {
        var classes = item.className;

        var isHidden = classes.indexOf("hidden") != -1;

        if (isHidden) {
            showElement(item);
        }
        else {
            hideElement(item);
        }
    }

    export function hideElement(item: HTMLElement) {
        var classes = item.className;

        var isHidden = classes.indexOf("hidden") != -1;

        if (!isHidden) {
            item.className = item.className.trim();
            item.className = item.className + " hidden";
        }
    }

    export function showElement(item: HTMLElement) {
        var classes = item.className;

        var isHidden = classes.indexOf("hidden") != -1;

        if (isHidden) {
            item.className = item.className.replace("hidden", "");
        }
    }

    export function deSelect(item: HTMLElement) {

        var classes = item.className;

        var isHidden = classes.indexOf("select") != -1;

        if (isHidden) {
            item.className = item.className.replace("select", "");
        }
    }

    export function select(item: HTMLElement) {
        var classes = item.className;

        var isHidden = classes.indexOf("select") != -1;

        if (!isHidden) {
            item.className = item.className + " select";
        }
    }

    export function toggleClass(item: HTMLElement, className: string) {
        var classes = item.className;

        var isClass = classes.indexOf(className) != -1;

        if (isClass) {
            item.className = item.className.replace(className, "");
        }
        else {
            item.className = item.className + " " + className;
        }
    }

}

module Menu {

    export var isMenuOpen = false;
    export var scoreItems = document.getElementsByClassName("score-item");

    var menuButton = <HTMLDivElement>document.getElementsByClassName("menu-button")[0];
    var menu = <HTMLDivElement>document.getElementsByClassName("menu")[0];

    export function updateMenuItems() {
        for (var i = 0; i < scoreItems.length; i++) {

            if (Inknote.Managers.PageManager.Current.page == Inknote.Managers.Page.Score) {
                FrontEnd.showElement(<HTMLElement>scoreItems[i]);
            }
            else {
                FrontEnd.hideElement(<HTMLElement>scoreItems[i]);
            }
        }
    }

    export function toggle() {
        isMenuOpen = !isMenuOpen;

        updateMenuItems();

        FrontEnd.toggleClass(menuButton, "open");
        FrontEnd.toggleClass(menu, "open");
    }

}

module Modal {

    export var isModalOpen = false;

    export function toggle(ID: string) {
        var item = document.getElementById(ID);

        isModalOpen = !isModalOpen;

        FrontEnd.toggleElement(item);
        FrontEnd.toggleElement(document.getElementById("modal-cover"));
    }

    export function hideAllModals() {
        var modals = document.getElementsByClassName("modal");

        for (var i = 0; i < modals.length; i++) {
            if ((<HTMLElement>modals[i]).className.indexOf("hidden") == -1) {
                FrontEnd.hideElement(<HTMLElement>modals[i]);
            }
        }

        isModalOpen = false;

        FrontEnd.hideElement(document.getElementById("modal-cover"));
    }

    export function hide(ID: string) {
        var item = document.getElementById(ID);

        isModalOpen = false;

        FrontEnd.hideElement(item);
        FrontEnd.hideElement(document.getElementById("modal-cover"));
    }

    export function show(ID: string) {
        var item = document.getElementById(ID);

        isModalOpen = true;

        FrontEnd.showElement(item);

        FrontEnd.showElement(document.getElementById("modal-cover"));
    }

    export function cancelReport() {
        var textElement = <HTMLTextAreaElement>document.getElementById("report-text");
        var checkElement = <HTMLInputElement>document.getElementById("report-checkbox");

        textElement.value = "";
        checkElement.checked = false;

        hide("report");
    }

    export function submitReport() {
        var textElement = <HTMLTextAreaElement>document.getElementById("report-text");
        var checkElement = <HTMLInputElement>document.getElementById("report-checkbox");

        var text = textElement.value;
        var check = checkElement.checked;

        if (!check) {
            Inknote.log("a robot is trying to submit a bug report", Inknote.MessageType.Warning);
            return;
        }

        var relevantThreadID = Inknote.getID();

        var threadObject = {
            id: relevantThreadID,
            subject: "Bug: #" + relevantThreadID,
            posts: []
        };
        var postObject = {
            user: "Anonymous",
            threadID: relevantThreadID,
            message: text,
            time: (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '')
        };        

        Inknote.HttpService.Instance.post(Inknote.Managers.SettingsManager.Current.serverURL + "/threads", JSON.stringify(threadObject),
            function (e) {
                Inknote.log("bug report thread created", Inknote.MessageType.Text);

                Inknote.HttpService.Instance.post(Inknote.Managers.SettingsManager.Current.serverURL + "/posts", JSON.stringify(postObject),
                    function (e) {
                        Inknote.log("bug report submitted", Inknote.MessageType.Text);
                    }, function (e) {
                        Inknote.log("sending bug report failed", Inknote.MessageType.Error);
                    });
            }, function (e) {
                Inknote.log("failed to create thread", Inknote.MessageType.Error);
            });

        textElement.value = "";
        checkElement.checked = false;

        hide("report");
    }

}

module Actions.Plugins {

    export function PluginMenuClick(ev: HTMLElement, ID: string) {

        var target = <HTMLDivElement>ev;

        var menuItems = document.getElementsByClassName("plugin-menu-item");

        var pageItems = [
            "plugin-list",
            "plugin-event-list",
            "plugin-advanced"
        ];

        for (var item = 0; item < menuItems.length; item++) {
            FrontEnd.deSelect(<HTMLElement>menuItems[item]);
        }

        for (var item = 0; item < pageItems.length; item++) {
            var pageItem = document.getElementById(pageItems[item]);

            FrontEnd.hideElement(pageItem);
        }

        var openItem = document.getElementById(ID);

        FrontEnd.showElement(openItem);

        FrontEnd.select(target);

    }

}