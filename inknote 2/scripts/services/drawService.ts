﻿module Inknote {

    export class DrawService {

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
                self._canvas.width = self._canvas.parentElement.clientWidth;
                self._canvas.height = self._canvas.parentElement.clientHeight - 50;

                self.arrange();

                sortByOrder(self._items);

                for (var i = 0; i < self._items.length; i++) {
                    if (self._items[i].draw(self._ctx, self._canvas) === false) {
                        log("Drawing failed on item " + self._items[i].ID);
                        return;
                    }
                }

                requestAnimationFrame(self.draw);
            };

            self.draw();
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

            this.items.push(Background.Instance);
        }
    }
}