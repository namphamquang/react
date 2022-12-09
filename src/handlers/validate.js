/**
 * 
 * @param {*} str 
 * @returns 
 */
export const checkEmpty = (str) => {
  if (str.length == 0) return true;
  return false;
}

/**
 * 
 * @param {*} msv 
 * @returns 
 */
export const checkIdLength = (msv) => {
  if (msv.length < 8 || msv.length > 8 || !(msv.match(/^\d+$/))) return false;
  return true;
}
/**
 * 
 * @param {*} student 
 * @param {*} students 
 * @returns 
 */
export const checkIdExisted = (student, students) => {
  let i = 0;
  for (const x of students) {
    if (x.msv == student.msv) { i = 1; break; }
  }
  if (i == 0) { return false; }
  else { return true; }
}
/**
 * 
 * @param {*} student 
 * @param {*} students 
 * @returns 
 */
export const checkStudentExisted = (student, students) => {
  let i = 0;
  for (const x of students) {
    if ((x.ten == student.ten) && (x.que == student.que)) { i = 1; break; }
  }
  if (i == 0) { return false; }
  else { return true; }
}
/**
 * 
 * @param {*} str 
 * @returns 
 */
export const checkNameLength = (str) => {
  if (str.length > 100) return false;
  return true;
}
/**
 * 
 * @param {*} student 
 * @returns 
 */
export const checkBirthday = (student) => {
  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  if (student.nsinh.match(dateformat)) {
    //Test which seperator is used '/' or '-'
    var opera1 = student.nsinh.split('/');
    var opera2 = student.nsinh.split('-');
    var lopera1 = opera1.length;
    var lopera2 = opera2.length;
    // Extract the string into month, date and year
    if (lopera1 > 1) {
      var pdate = student.nsinh.split('/');
    }
    else if (lopera2 > 1) {
      var pdate = student.nsinh.split('-');
    }
    var dd = parseInt(pdate[0]);
    var mm = parseInt(pdate[1]);
    var yy = parseInt(pdate[2]);
    // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (mm == 1 || mm > 2) {
      if (dd > ListofDays[mm - 1]) {
        return false;
      }
    }
    if (mm == 2) {
      var lyear = false;
      if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
        lyear = true;
      }
      if ((lyear == false) && (dd >= 29)) {
        return false;
      }
      if ((lyear == true) && (dd > 29)) {
        return false;
      }
    }
  }
  else {
    return false;
  }
}