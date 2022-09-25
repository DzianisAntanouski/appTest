import { $ControlSettings } from 'sap/ui/core/Control';

declare module "./MyControl" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MyControlSettings extends $ControlSettings {
        text?: string;
        header?: string
        subheader?: string;
        flip?: boolean
    }

    export default interface MyControl {
        getHeader(): string;
        setHeader(header: string): this;
        getSubheader(): string;
        setSubheader(subheader: string): this;
        setAggregation(sAggregationName: string, oObject: ManagedObject): this
        getHighLight(): heightLight
        setHighLight(heightLight: boolean): this
        onPressRun(): void
    }
}
