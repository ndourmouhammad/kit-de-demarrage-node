const oneMinuteExpiry = async (otpTime) => {
  try {
    console.log("Timestamp is :- " + otpTime);

    const c_datetime = new Date();
    var differenceValue = (otpTime - c_datetime.getTime()) / 1000;
    differenceValue /= 60;

    console.log("Expiry :- " + Math.abs(differenceValue));

    if (Math.abs(differenceValue) > 1) {
      return true;
    }

    return false;
  } catch (e) {
    console.log(e);
  }
};

const threeMinuteExpiry = async (otpTime) => {
  try {
    console.log("Timestamp is :- " + otpTime);

    const c_datetime = new Date();
    var differenceValue = (otpTime - c_datetime.getTime()) / 1000;
    differenceValue /= 60;

    console.log("Expiry :- " + Math.abs(differenceValue));

    if (Math.abs(differenceValue) > 3) {
      return true;
    }

    return false;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  oneMinuteExpiry,
  threeMinuteExpiry,
};
