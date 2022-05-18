import { isBrowserTabActive, onBrowserTabVisibilityChange, TStopListening } from './index';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const NO_INTERVAL_ID = null;

interface IExecutePeriodicallyConfig {
    toBeExecuted: () => void;
    intervalInMillis: number;
    executeImmediatelyInActiveTab?: boolean; // default false
    onlyIfBrowserTabActive: boolean;
}

export default function executePeriodically(config: IExecutePeriodicallyConfig): TStopListening {
    let intervalId = execute(config);

    if (config.onlyIfBrowserTabActive) {
        const stopListeningToTabChanges = onBrowserTabVisibilityChange({
            onActivatedHandler: () => {
                clearIntervalIfSet();
                intervalId = execute(config);
            },
            onDeactivatedHandler: () => clearIntervalIfSet(),
        });
        return () => {
            clearIntervalIfSet();
            stopListeningToTabChanges();
        };
    }

    return () => {
        clearIntervalIfSet();
    };

    function clearIntervalIfSet() {
        if (intervalId !== NO_INTERVAL_ID) {
            window.clearInterval(intervalId);
            // tslint:disable-next-line:no-parameter-reassignment
            intervalId = NO_INTERVAL_ID;
        }
    }
}

function execute({
    toBeExecuted,
    intervalInMillis,
    executeImmediatelyInActiveTab = false,
    onlyIfBrowserTabActive,
}: IExecutePeriodicallyConfig): number {
    if (onlyIfBrowserTabActive && isBrowserTabActive()) {
        if (executeImmediatelyInActiveTab) {
            setTimeout(
                () => toBeExecuted(),
                0,
            );
        }

        return window.setInterval(toBeExecuted, intervalInMillis);
    } if (!onlyIfBrowserTabActive) {
        if (executeImmediatelyInActiveTab) {
            setTimeout(
                () => toBeExecuted(),
                0,
            );
        }

        return window.setInterval(toBeExecuted, intervalInMillis);
    }

    return NO_INTERVAL_ID;
}
