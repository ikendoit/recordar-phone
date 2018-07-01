exports.diff = (old_data, new_data) => {
  let arr1 = old_data.split("\n");
  let arr2 = new_data.split("\n");
  let arr3 = [];
  let cb = -1;
  let cm = 0;
  //logic:
  for (let i = 0; i < arr1.length; i++) {
    //iterate from check point onward in arr2
    let j = cm;
    while (true) {
      if (j >= arr2.length) {
        arr3.push(arr1[i]);
        break;
      }

      if (arr1[i] === arr2[j]) {
        cm = j + 1;
        if (cb !== -1) {
          arr3.push("<<--VS-->>");
          for (let k = cb; k < j; k++) {
            arr3.push(arr2[k]);
          }
          arr3.push("SomeOne:>>");
        }
        cb = -1;
        arr3.push(arr1[i]);
        break;
      }

      if (arr1[i] !== arr2[j]) {
        if (cb === -1) {
          arr3.push("<<:You");
          cb = j;
        }
      }

      if (j === arr2.length) {
        arr3.push(arr1[i]);
      }
      j++;
    }
  }
  console.log(">>>");
  console.log(arr1);
  console.log(arr2);
  console.log(arr3);
  console.log("<<<");
  return arr3.join("\n");
};
