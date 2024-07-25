import fs from "fs";

const unlinkTempFiles = (files) => {
  files.forEach((element) => {
    if (element) {
      fs.unlinkSync(element);
    }
  });
};

export { unlinkTempFiles };
