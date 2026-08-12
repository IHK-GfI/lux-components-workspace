import { Component } from '@angular/core';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { LuxChatComponent, LuxChatData } from '@ihk-gfi/lux-components/lux-chat';
import { LuxChatPopupComponent } from '@ihk-gfi/lux-components/lux-chat-popup';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { CommonModule } from '@angular/common';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY_IN_MILLIS = 24 * HOUR;
const now = new Date();
const nowTime = now.getTime();

const startOfThisYear = new Date(now.getFullYear(), 0, 1).getTime();
const endOfLastYear = startOfThisYear - DAY_IN_MILLIS;

@Component({
  selector: 'app-chat-example',
  imports: [
    LuxChatComponent,
    LuxChatPopupComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent,
    CommonModule
],
  templateUrl: './chat-example.component.html',
  styleUrl: './chat-example.component.scss'
})
export class ChatExampleComponent {

    public exampleUsername = "Nutzer C";
    public showChatPopup = false;

    public chatData: LuxChatData = new LuxChatData("Neuer Chat", new Date(), [
        {user: "Nutzer A", content: "Erster Eintrag!", time: new Date("2024-11-05T10:30:00Z"), metadata: {}},
        {user: "Nutzer B", content: "Hey, ich bin Nutzer B.", time: new Date("2024-11-05T10:32:00Z"), metadata: {}},
        {user: "Nutzer B", content: "Wenn ich innerhalb von 10 Minuten schreibe, dann wird die Zeitangabe zusammengefasst.", time: new Date("2024-11-05T10:34:00Z"), metadata: {}},
        {user: "Nutzer B", content: "Die Nachricht vor dieser hat mehr als 10 Minuten Abstand und daher wird hier die Zeit angezeigt.", time: new Date("2024-11-05T10:45:00Z"), metadata: {}},
        {user: "Nutzer A", content: "...", time: new Date("2024-11-05T10:53:00Z"), metadata: {}},
        {user: "Nutzer C", content: "Hey, ich bin neu hier.", time: new Date("2024-11-06T08:21:00Z"), metadata: {}},
        {user: "Nutzer A", content: "Hallo Nutzer C.", time: new Date("2024-11-06T09:12:00Z"), metadata: {}},

        {user: "Nutzer A", content: "Ich freue mich schon auf das neue Jahr!", time: new Date(endOfLastYear + (20 * HOUR + 3 * MINUTE)), metadata: {}},
        {user: "Nutzer A", content: "Frohes neues !!!", time: new Date(startOfThisYear), metadata: {}},

        {user: "Nutzer B", content: "Wie ihr sehen könnt wird nun bei der \"Zeit-Trennlinie\" nicht mehr das Jahr angegeben, da wir uns nun im aktuellen Jahr befinden!", time: new Date(startOfThisYear + 2 * MINUTE), metadata: {}},
        {user: "Nutzer A", content: "?? Du wolltest 'Frohes neues' schreiben oder?", time: new Date(startOfThisYear + 5 * MINUTE), metadata: {}},
        
        {user: "Nutzer B", content: "Diese Nachricht wurde vor 2 Tagen geschrieben.", time: new Date(nowTime - 2 * DAY_IN_MILLIS), metadata: {}},
        {user: "Nutzer B", content: "Diese Nachricht wurde gestern geschrieben.", time: new Date(nowTime - 1 * DAY_IN_MILLIS), metadata: {}},
        {user: "Nutzer B", content: "Diese Nachricht wurde heute geschrieben.", time: new Date(nowTime - 1 * HOUR), metadata: {}},
        {user: "Nutzer B", content: "Wie ihr sehen könnt wird für heute und gestern eine relative Bezeichnung gewählt.", time: new Date(nowTime - 1 * HOUR + 2 * MINUTE), metadata: {}},
        {user: "Nutzer A", content: "... Ich habe mich das schon länger gefragt, aber wem erklärst du das eigentlich?!", time: new Date(nowTime - 10 * MINUTE), metadata: {}},
        {user: "Nutzer B", content: "Schreib du doch auch mal was, damit Nutzer A weiß, wen ich meine.", time: new Date(nowTime - 6 * MINUTE), metadata: {}},
    ]);

    public onMessageEntered(input: string) {
        this.chatData.addMessage({user: this.exampleUsername, content: input, time: new Date(), metadata: {}})
    }


}