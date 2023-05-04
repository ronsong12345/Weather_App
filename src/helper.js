
export function findIndex(array, property, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][property] === value) {
        return i;
      }
    }
    return -1;
  }

export function formatLocalDate(){
    const date = new Date();
    const formattedDateString = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).replace(/\//g, '-').replace(',', '');
    return formattedDateString
  }

export function formatInternationalDateWithOffset(timezoneOffset) {
    const date = new Date();
    const localTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const offset = timezoneOffset * 1000;
    const offsetDate = new Date(utc + offset);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    const formattedDate = offsetDate.toLocaleString('en-US', options);
    console.log(formattedDate)
    return formattedDate.replace(/\//g, '-').replace(',', '');
  }