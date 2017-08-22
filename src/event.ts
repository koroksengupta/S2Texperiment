import { Eventable, IEventable } from './utils';

export class ST2Event implements Eventable {
    constructor(private _listeners:any = []) {

    }
    public on(eventType: string, callFn: Function): void {
        let events:string[] = [].concat(this._listeners.map((evtObj: any) => Object.keys(evtObj)));
        if (events.indexOf(eventType) == -1) {
            let event: IEventable = {[eventType]: [callFn]}
            this._listeners.push(event);
        } else {
            let event = this._listeners.filter((evetObj: any) => evetObj[eventType] !== undefined)[0];
            event[eventType].push(callFn);
        }
    }

    public off(eventType: string, callFn: Function): void {
        let events:string[] = [].concat(this._listeners.map((evObj: any) => Object.keys(evObj)));
        if (events.indexOf(eventType) == -1) return;
        let event: any = this._listeners.filter((evtObj: any) => evtObj[eventType] !== undefined );
        let index: number = (<Array<any>>event[eventType]).indexOf(callFn);
        if (index >= 0) event[eventType].splice(index, 1);
    }

    public trigger(eventType: Event, ...values: Array<any>): void {
        let handlers:any = this._listeners.filter((listeners: any) => listeners[eventType.type] !== undefined)
        if (handlers.length == 0) return void 0;
        handlers = handlers[0][eventType.type];
        handlers.forEach((handeler: Function) => handeler(eventType, ...values));
    }
}
