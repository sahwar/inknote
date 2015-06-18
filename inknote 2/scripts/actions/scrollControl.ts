﻿module Inknote {

    function canScroll(up: boolean): boolean {

        if (up && ScrollService.Instance.y - ScrollService.Instance.scrollSpeed < 0) {
            ScrollService.Instance.y = 0;
            return false;
        }
        else if (up) {
            return true;
        }

        switch (Managers.PageManager.Current.page) {
            case Managers.Page.File:
                var projects = Managers.ProjectManager.Instance.allProjects.length;
                var canvas = { x: window.innerWidth, y: window.innerHeight - 100 };
                var maxRowNo = Math.floor(canvas.x / 200);
                var maxHeight = Math.ceil(projects / maxRowNo) * 200 + 100;
                return maxHeight > ScrollService.Instance.y + ScrollService.Instance.scrollSpeed + canvas.y;
                break;
            case Managers.Page.Score:
                return false;
                break;
            default:
                return false;
        }
    }

    window.onmousewheel = function (ev: MouseWheelEvent) {

            var booler = false;
            var value = 1;
            if (ev.wheelDelta > 0) {
                value = -1;
                booler = true;
            }

            if (canScroll(booler)) {

            ScrollService.Instance.y = Math.max(0, value * ScrollService.Instance.scrollSpeed + ScrollService.Instance.y);

        }
    }

}