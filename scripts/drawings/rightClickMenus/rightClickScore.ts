﻿module Inknote.Drawing.RightClickMenus {

    export class RightClickScore extends RightClickMenu {

        constructor() {
            super();

            this.items.unshift(new ClickableMenuItem("properties", function () {

                var project = Managers.ProjectManager.Instance.currentProject;

                ProjectOptionsService.Instance.open(project);

            }));
            this.items.unshift(new ClickableMenuItem("add a bar", function () {

                NoteControlService.Instance.addBar();
                ScoringService.Instance.refresh();

            }));
            this.items.unshift(new ClickableMenuItem("edit instruments", function () {

                InstrumentService.Instance.openInstrumentEditor();

            }));
            this.items.unshift(new ClickableMenuItem("add instrument", function () {

                InstrumentService.Instance.addInstrument();

            }));
            this.items.push(new ClickableMenuItem("print", function () {
                PrintService.Instance.print();
            }));
            this.items.push(new ClickableMenuItem("note count", function () {
                Modal.generateProjectReport();
            }));

        }

    }

} 