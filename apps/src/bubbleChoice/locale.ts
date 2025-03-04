/**
 * A TypeScript wrapper for the StandaloneVideolocale object which casts
 * it to the {@link StandaloneVideoLocale} type.
 */
import {BubbleChoiceLocale} from './types';

const bubbleChoiceLocale = require('@cdo/bubbleChoice/locale');

export default bubbleChoiceLocale as BubbleChoiceLocale;
