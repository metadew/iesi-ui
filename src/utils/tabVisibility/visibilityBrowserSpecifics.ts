interface IVisibilityBrowserSpecifics {
    hidden: string;
    visibilityState: string;
    event: string;
}

export interface IWithKeyIndex {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const VISIBILITY_BROWSER_SPECIFICS = getVisibilityBrowserSpecifics();

export const isSupported = VISIBILITY_BROWSER_SPECIFICS !== null;

function getVisibilityBrowserSpecifics(): IVisibilityBrowserSpecifics {
    if (typeof document.hidden !== 'undefined') {
        return {
            hidden: 'hidden',
            visibilityState: 'visibilityState',
            event: 'visibilitychange',
        };
    }

    if (typeof (document as IWithKeyIndex).mozHidden !== 'undefined') {
        return {
            hidden: 'mozHidden',
            visibilityState: 'mozVisibilityState',
            event: 'mozvisibilitychange',
        };
    }

    if (typeof (document as IWithKeyIndex).msHidden !== 'undefined') {
        return {
            hidden: 'msHidden',
            visibilityState: 'msVisibilityState',
            event: 'msvisibilitychange',
        };
    }

    if (typeof (document as IWithKeyIndex).webkitHidden !== 'undefined') {
        return {
            hidden: 'webkitHidden',
            visibilityState: 'webkitVisibilityState',
            event: 'webkitvisibilitychange',
        };
    }

    return null;
}
