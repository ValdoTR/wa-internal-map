/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import {bootstrapExtra} from '@workadventure/scripting-api-extra'

console.log('Script started successfully');

async function extendedFeatures() {
    try {
        await bootstrapExtra()
        console.log('Scripting API Extra loaded successfully');

        // Place the countdown GIF inside of the cinema screen
        const countdown = await WA.room.website.get('cinemaScreen');
        countdown.x = 1670;
        countdown.y = 802;
        countdown.width = 320;
        countdown.height = 240;

        // Place the countdown GIF inside of the cinema screen
        const githubRepository = await WA.room.website.get('githubRepository');
        githubRepository.x = 3328;
        githubRepository.y = 1120;
        githubRepository.width = 300;
        githubRepository.height = 300;
    } catch (error) {
        console.error('Scripting API Extra ERROR',error);
    }
}
extendedFeatures();

// Manage the scrolling effect on the public monitor in the office
WA.room.onEnterZone('scrollMonitor', () => {
    WA.room.hideLayer('inactiveMonitor')
});
WA.room.onLeaveZone('scrollMonitor', () => {
    WA.room.showLayer('inactiveMonitor')
});

// Manage the animated CTAs
WA.room.onEnterZone('toRoom3', () => {
    WA.room.hideLayer('doorTipSwitch')
});
WA.room.onLeaveZone('toRoom3', () => {
    WA.room.showLayer('doorTipSwitch')
});

WA.room.onEnterZone('doorCode', () => {
    WA.room.hideLayer('ctaDigitCodeSwitch')
});
WA.room.onLeaveZone('doorCode', () => {
    WA.room.showLayer('ctaDigitCodeSwitch')
});

// Manage popups
let currentZone: string;
let currentPopup: any;

const config = [
    {
        zone: 'needHelp',
        message: 'Do you need some guidance? We are happy to help you out.',
        cta: [
            {
                label: 'Meet us',
                className: 'primary',
                callback: () => WA.nav.openTab('https://play.workadventu.re/@/tcm/workadventure/welcome#meet-us'),
            }
        ]
    },
    {
        zone: 'followUs',
        message: 'Hey! Have you already started following us?',
        cta: [
            {
                label: 'LinkedIn',
                className: 'primary',
                callback: () => WA.nav.openTab('https://www.linkedin.com/company/workadventu-re'),
            },
            {
                label: 'Twitter',
                className: 'primary',
                callback: () => WA.nav.openTab('https://twitter.com/workadventure_'),
            }
        ]
    },
    {
        zone: 'doorCode',
        message: 'Hello, I\'m Mr Robot. The code is 5300.',
        cta: []
    },
    {
        zone: 'toRoom3',
        message: 'Want to access the gaming room? Mr Robot can help you!',
        cta: []
    },
    {
        zone: 'gatherDesk',
        message: 'Learn more about WorkAdventure events and our ProductHunt launch!',
        cta: [
            {
                label: 'Dismiss',
                className: 'normal',
                callback: () => WA.state.saveVariable('dontShowGatherPopup', true).then(() => closePopup()),
            }
        ]
    },
    {
        zone: 'workDesk',
        message: 'Learn more!',
        cta: [
            {
                label: 'Dismiss',
                className: 'normal',
                callback: () => WA.state.saveVariable('dontShowWorkPopup', true).then(() => closePopup()),
            }
        ]
    },
    {
        zone: 'collaborateDesk',
        message: 'Learn more!',
        cta: [
            {
                label: 'Dismiss',
                className: 'normal',
                callback: () => WA.state.saveVariable('dontShowCollaboratePopup', true).then(() => closePopup()),
            }
        ]
    },
    {
        zone: 'playDesk',
        message: 'Learn more!',
        cta: [
            {
                label: 'Dismiss',
                className: 'normal',
                callback: () => WA.state.saveVariable('dontShowPlayPopup', true).then(() => closePopup()),
            }
        ]
    },
    {
        zone: 'createDesk',
        message: 'Learn more!',
        cta: [
            {
                label: 'Dismiss',
                className: 'normal',
                callback: () => WA.state.saveVariable('dontShowCreatePopup', true).then(() => closePopup()),
            }
        ]
    }
]

// Need Help / Follow Us
WA.room.onEnterZone('needHelp', () => {
    openPopup('needHelp')
});
WA.room.onLeaveZone('needHelp', closePopup);

WA.room.onEnterZone('followUs', () => {
    openPopup('followUs')
});
WA.room.onLeaveZone('followUs', closePopup);

// Room desks
WA.room.onEnterZone('gatherDesk', () => {
    const dontShow = WA.state.loadVariable('dontShowGatherPopup')
    if (dontShow) return;

    openPopup('gatherDesk')
});
WA.room.onLeaveZone('gatherDesk', closePopup);

WA.room.onEnterZone('workDesk', () => {
    const dontShow = WA.state.loadVariable('dontShowWorkPopup')
    if (dontShow) return;

    openPopup('workDesk')
});
WA.room.onLeaveZone('workDesk', closePopup);

WA.room.onEnterZone('collaborateDesk', () => {
    const dontShow = WA.state.loadVariable('dontShowCollaboratePopup')
    if (dontShow) return;

    openPopup('collaborateDesk')
});
WA.room.onLeaveZone('collaborateDesk', closePopup);

WA.room.onEnterZone('playDesk', () => {
    const dontShow = WA.state.loadVariable('dontShowPlayPopup')
    if (dontShow) return;

    openPopup('playDesk')
});
WA.room.onLeaveZone('playDesk', closePopup);

WA.room.onEnterZone('createDesk', () => {
    const dontShow = WA.state.loadVariable('dontShowCreatePopup')
    if (dontShow) return;

    openPopup('createDesk')
});
WA.room.onLeaveZone('createDesk', closePopup);

// Manage the popups to open the Room3 door
WA.room.onEnterZone('doorCode', () => {
    openPopup('doorCode')
});
WA.room.onLeaveZone('doorCode', closePopup);

WA.room.onEnterZone('toRoom3', () => {
    const isDoorOpen = WA.state.loadVariable('room3Door')
    if (isDoorOpen) return;

    openPopup('toRoom3')
});
WA.room.onLeaveZone('toRoom3', closePopup);

// Popup management functions
function openPopup(zoneName: string) {
    currentZone = zoneName
    const popupName = zoneName + 'Popup'
    const zone = config.find((item) => {
        return item.zone == zoneName
    });

    if (typeof zone !== 'undefined') {
        // @ts-ignore otherwise we can't use zone.cta object
        currentPopup = WA.ui.openPopup(popupName, zone.message, zone.cta)
    }
}
function closePopup(){
    if (typeof currentPopup !== 'undefined') {
        currentPopup.close();
        currentPopup = undefined;
    }
}