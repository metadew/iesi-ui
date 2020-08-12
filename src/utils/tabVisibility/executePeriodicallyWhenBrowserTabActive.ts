import { isBrowserTabActive, onBrowserTabVisibilityChange, TStopListening } from './index';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const NO_INTERVAL_ID = null;

interface IExecutePeriodicallyConfig {
    toBeExecuted: () => void;
    intervalInMillis: number;
    executeImmediatelyInActiveTab?: boolean; // default false
}

export default function executePeriodicallyWhenBrowserTabActive(config: IExecutePeriodicallyConfig): TStopListening {
    let intervalId = executeWhenBrowserTabActive(config);

    const stopListeningToTabChanges = onBrowserTabVisibilityChange({
        onActivatedHandler: () => {
            clearIntervalIfSet();
            intervalId = executeWhenBrowserTabActive(config);
        },
        onDeactivatedHandler: () => clearIntervalIfSet(),
    });

    return () => {
        clearIntervalIfSet();
        stopListeningToTabChanges();
    };

    function clearIntervalIfSet() {
        if (intervalId !== NO_INTERVAL_ID) {
            window.clearInterval(intervalId);
            // tslint:disable-next-line:no-parameter-reassignment
            intervalId = NO_INTERVAL_ID;
        }
    }
}

function executeWhenBrowserTabActive({
    toBeExecuted,
    intervalInMillis,
    executeImmediatelyInActiveTab = false,
}: IExecutePeriodicallyConfig): number {
    if (isBrowserTabActive()) {
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
