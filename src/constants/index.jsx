// export const URL = "https://medical.deepcode.tk"
// export const URL_AVATAR = "https://medical.deepcode.tk/assets/avatar"
// export const URL_PRE = "https://medical.deepcode.tk/assets/prescription"

export const URL = "http://3.26.198.69:5050"
export const URL_AVATAR = "http://3.26.198.69:5050/assets/avatar"
export const URL_PRE = "http://3.26.198.69:5050/assets/prescription"

// export const URL = "http://localhost:5050"
// export const URL_AVATAR = "http://localhost:5050/assets/avatar"
// export const URL_PRE = "http://localhost:5050/assets/prescription"


export const MAX_ITEMS = 10;

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const getLinkAvatar = (name) => `${URL_AVATAR}/${name}`;
export const getLinkImage = (name) => `${URL_PRE}/${name}`;

export function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
