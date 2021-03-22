import { Component, ComponentFactoryResolver, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, ViewChild } from "@angular/core";
import { DynamicDirective } from "./dynamic.directive";


@Component({
    selector: "dynamic-factory",
    template: `<ng-template dynamic></ng-template>`
})
export class DynamicFactory implements OnInit, OnChanges {

    @ViewChild(DynamicDirective, { static: true }) dynamic: DynamicDirective;
    @Input() component: Type<any>;
    @Input() props: { [key: string]: any };
    @Input() debugging: { showComponentOutputs: boolean } = { showComponentOutputs: false };
    @Output() catchEvent: EventEmitter<{ key: string, $event: any }> = new EventEmitter<{ key: string, $event: any }>();

    private instance: any

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private ngZone: NgZone) { }

    ngOnInit() {
        this.loadComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateProps(this.props);
        this.ngZone.run(() => { })
    }

    loadComponent() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);

        const viewContainerRef = this.dynamic.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent<any>(componentFactory);
        this.instance = componentRef.instance;
        for (let k in componentRef.instance) {
            if (componentRef.instance[k] instanceof EventEmitter) {
                if (this.debugging && this.debugging.showComponentOutputs) {
                    console.log(`[${this.component.name}] => ${k} event`);
                }
                componentRef.instance[k].subscribe(res => {
                    this.catchEvent.emit({ key: k, $event: res });
                })
            }
        }
        this.updateProps(this.props);
    }

    updateProps(props: { [key: string]: any }) {
        if (!this.instance) return;
        Object.assign(this.instance, props);
    }
}