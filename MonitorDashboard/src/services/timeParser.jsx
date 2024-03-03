export const calculateElapsedTime = (apiDateString) => {
    const apiDate = new Date(apiDateString.replace(/-/g, '/'));
    const currentDate = new Date();
    const timeDifference = currentDate - apiDate;
    const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);
    return timeDifferenceInSeconds;
};
  