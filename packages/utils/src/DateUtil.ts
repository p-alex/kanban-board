class DateUtil {
  now() {
    return Date.now();
  }

  toUtcString(dateInMs: number) {
    return new Date(dateInMs).toUTCString();
  }

  toIsoString(dateInMs: number) {
    return new Date(dateInMs).toISOString();
  }

  toLocaleDateString(dateInMs: number) {
    return new Date(dateInMs).toLocaleDateString();
  }

  getUtcOfNow() {
    return new Date(Date.now()).toUTCString();
  }

  getIsoOfNow() {
    return new Date(Date.now()).toISOString();
  }
}

export default DateUtil;
