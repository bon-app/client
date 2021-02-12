import { Component, ComponentFactoryResolver, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewChild } from "@angular/core";
import { DynamicDirective } from "./dynamic.directive";


@Component({
    selector: "dynamic-factory",
    template: `<ng-template dynamic></ng-template>`
})
export class DynamicComponent implements OnInit, OnChanges {

    @ViewChild(DynamicDirective, { static: true }) dynamic: DynamicDirective;
    @Input() component: Type<any>;
    @Input() props: { [key: string]: any };

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
        this.updateProps(this.props);
    }

    updateProps(props: { [key: string]: any }) {
        if (!this.instance) return;
        Object.assign(this.instance, props);
    }
}