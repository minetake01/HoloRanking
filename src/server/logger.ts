import {configure, getLogger} from 'log4js';
configure('log4j.config.json');

export const systemLogger = getLogger('system');

export const holodexLogger = getLogger('holodex');

export const youtubeLogger = getLogger('youtube');

export const accessInfoLogger = getLogger('access_info');
