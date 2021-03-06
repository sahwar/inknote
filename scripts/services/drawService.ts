﻿module Inknote {

    export class DrawService {

        private static _instance: DrawService;

        static get Instance(): DrawService {
            return DrawService._instance;
        }

        private _canvas: HTMLCanvasElement;

        private _ctx: CanvasRenderingContext2D;

        private _items: IDrawable[];

        draw: () => void;

        setItems(items: IDrawable[]) {
            this._items = items;
        }

        get canvas() {
            return this._canvas;
        }

        get items() {
            return this._items;
        }

        constructor(canvasID: string) {
            this._items = [];
            this._canvas = <HTMLCanvasElement>document.getElementById(canvasID);
            this._ctx = this._canvas.getContext("2d");

            var self = this;

            this.draw = function () {
                // if landing open, don't draw;
                if (Landing.Landing.Instance.ended === false) {
                    requestAnimationFrame(self.draw);
                    return;
                }

                self._canvas.width = self._canvas.parentElement.clientWidth;
                self._canvas.height = self._canvas.parentElement.clientHeight - 50;

                if (Managers.SettingsManager.Current.displayID === true) {
                    if (Managers.PageManager.Current.page == Managers.Page.Score) {
                        self._ctx.fillText(ScoringService.Instance.selectID, 10, 10);
                    }
                }

                self.arrange();

                self._items.push(LicenceService.Instance.drawing);

                if (Managers.MachineManager.Instance.machineType == Managers.MachineType.Desktop && ScrollService.Instance.showScrollBar()) {
                    self._items.push(ScrollService.ScrollBar);
                    if (ScrollService.ScrollBar.scrollThumbnail.visible) {
                        self._items.push(ScrollService.ScrollBar.scrollThumbnail);
                    }
                }

                if (RightClickMenuService.Instance.visible == true) {
                    self._items.push(RightClickMenuService.Instance.Menu);
                }

                sortByOrder(self._items);

                // ensure is there to deal with dependency
                if (Managers.PluginManager) {
                    var plugins = <Inknote.Plugins.InknotePlugin[]>getItemsWhere(Managers.PluginManager.Instance.plugins, function (item: Plugins.InknotePlugin) {
                        return item.active && item.allowBeforeDraw && item.beforeDraw != null;
                    });

                    for (var i = 0; i < plugins.length; i++) {
                        plugins[i].beforeDraw(self._ctx, self._canvas);
                    }
                }

                for (var i = 0; i < self._items.length; i++) {
                    if (self._items[i].draw(self._ctx, self._canvas) === false) {
                        log("Drawing failed on item " + self._items[i].ID);
                        return;
                    }
                }

                // ensure is there to deal with dependency
                if (Managers.PluginManager) {
                    var plugins = <Inknote.Plugins.InknotePlugin[]>getItemsWhere(Managers.PluginManager.Instance.plugins, function (item: Plugins.InknotePlugin) {
                        return item.active && item.allowOnDraw && item.onDraw != null;
                    });

                    for (var i = 0; i < plugins.length; i++) {
                        plugins[i].onDraw(self._ctx, self._canvas);
                    }
                }

                if (Audio.AudioService) {
                    Audio.AudioService.Instance.update();
                }

                requestAnimationFrame(self.draw);
            };

            self.draw();

            DrawService._instance = self;
        }

        arrange() {
            switch (Managers.PageManager.Current.page) {
                case Managers.Page.Score:
                    this._items = ProjectConverter.toDrawing(this);
                    break;
                case Managers.Page.File:
                    this._items = FileConverter.toDrawing(this);
                    break;
            }

            this.items.push(Drawing.Background.Instance);
        }
    }
}