
// obj holds key value pairs that we want to map.
const form_data_from_obj = (obj, label) => {
  return {
    labels: Object.keys(obj),
    datasets: [
      {
        label: label,
        data: Object.keys(obj).map((key) => {
          return obj[key]
        }),
        backgroundColor: [
          'rgba(255, 99, 99, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 99, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }
    ]
  }
}

// The array will be of the form:
// [{'enjoyment': true, key:value}, {same keys diff values}, {}], etc.
// key will be the key that we are looking at.
const form_data_from_arr = (arr, key, label) => {
  let labels = arr.filter((dict, idx) => {
    if (dict[key] !== null) {
      return true;
    }
    return false;
  });
  labels = labels.map((dict) => {
    return String(dict[key]);
  });
  labels = labels.filter((val, idx) => {
    return labels.indexOf(val) === idx;
  });
  console.log(labels);
  if (labels.length === 0) {
    return {}
  }
  const countArr = []
  labels.forEach((label) => {
    countArr.push(arr.reduce((prevVal, currVal) => {
                          if (String(currVal[key]) === label) {
                            return prevVal + 1;
                          }
                          return prevVal;
                        }, 0))
  });
  return {
    labels: labels,
    datasets:
    [
      {
        label: label,
        data: countArr,
        backgroundColor: [
          'rgba(255, 99, 99, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 99, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }
    ]
  }
}

const form_data_from_arr_days = (arr, label) => {
  const key = 'days_since_release';
  const labels = ['<10 days', '10-20 days', '21-50 days', '51-100 days', '100+ days']
  const countArr = [0, 0, 0, 0, 0];
  let nonNull = arr.filter((dict) => {
    if (dict[key] !== null) {
      return true;
    }
    return false;
  });
  const dayArray = nonNull.map((obj) => {
    return obj[key]
  });
  dayArray.forEach((obj) => {
    if (obj < 10) {
      countArr[0] += 1;
    } else if (obj >= 10 && obj <= 20) {
      countArr[1] += 1;
    } else if (obj >= 21 && obj <= 50) {
      countArr[2] += 1;
    } else if (obj >= 51 && obj <= 100) {
      countArr[3] += 1;
    } else {
      countArr[4] += 1;
    }
  });
  // If countArr adds up to 0, return {}
  if (countArr.reduce((partSum, val) => partSum + val, 0) === 0) {
    return {}
  }
  return {
    labels: labels,
    datasets:
    [
      {
        label: 'Days since release',
        data: countArr,
        backgroundColor: [
          'rgba(255, 99, 99, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 100, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 99, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 100, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      },
    ]
  }
}

export {form_data_from_obj, form_data_from_arr, form_data_from_arr_days}