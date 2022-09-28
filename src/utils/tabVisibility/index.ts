import isFunction from '@snipsonian/core/es/is/isFunction';
import { isSupported, IWithKeyIndex, VISIBILITY_BROWSER_SPECIFICS } from './visibilityBrowserSpecifics';

enum VISIBILITY_STATE {
    visible = 'visible',
    hidden = 'hidden',
    prerender = 'prerender', // not supported by all browsers
    unloaded = 'unloaded', // not supported by all browsers
}

export function isBrowserTabActive() {
    if (!isSupported) {
        return true;
    }

    return !(document as IWithKeyIndex)[VISIBILITY_BROWSER_SPECIFICS.hidden];
}

export function getBrowserTabVisibilityState(): VISIBILITY_STATE {
    return (document as IWithKeyIndex)[VISIBILITY_BROWSER_SPECIFICS.visibilityState];
}

/**
 * p.s. The tab's visibility will, at least in chrome, not change when another browser window becomes active.
 * This will only be triggered when:
 * a) the user switches between tabs within a single browser window
 * b) the user minifies/un-minifies the browser window containing the active tab
 */
export function onBrowserTabVisibilityChange({
    onActivatedHandler,
    onDeactivatedHandler,
}: {
    onActivatedHandler?: () => void;
    onDeactivatedHandler?: () => void;
}): TStopListening {
    if (!isSupported) {
        return () => {};
    }

    const listener = () => {
        if (isBrowserTabActive()) {
            if (isFunction(onActivatedHandler)) {
                onActivatedHandler();
            }
        } else if (isFunction(onDeactivatedHandler)) {
            onDeactivatedHandler();
        }
    };

    document.addEventListener(VISIBILITY_BROWSER_SPECIFICS.event, listener);

    return () => document.removeEventListener(VISIBILITY_BROWSER_SPECIFICS.event, listener);
}

export type TStopListening = () => void;
