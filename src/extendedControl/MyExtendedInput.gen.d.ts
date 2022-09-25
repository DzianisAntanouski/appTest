import { $InputSettings } from 'sap/m/Input';

declare module "./MyExtendedControl" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MyControlSettings extends $InputSettings {}

    export default interface MyExtendedControl {
        onPressInput(): void
    }
}