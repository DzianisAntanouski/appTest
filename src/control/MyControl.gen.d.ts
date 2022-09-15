import { $GenericTileSettings } from "sap/m/GenericTile";

declare module "./MyControl" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MyControlSettings extends $GenericTileSettings {
        text?: string;
        header: string
    }

    export default interface MyControl  {

        // property: text
        getText(): string;
        setText(text: string): this;


    }
}
