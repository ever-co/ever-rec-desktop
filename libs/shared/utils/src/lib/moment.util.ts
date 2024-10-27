import 'moment-duration-format';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import moment from 'moment-timezone';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

export { moment };
