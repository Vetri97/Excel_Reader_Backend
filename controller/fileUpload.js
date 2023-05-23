var XLSX = require("xlsx");
var multer = require("multer");

const config = require("../app.config");

//saves file in temp dir
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("file");

// read  file from temp dir
exports.fileRead = async (req, res) => {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(501).json(err);
      } else if (err) {
        return res.status(501).json(err);
      }
      var filename = req.file.filename.toString().split("-");
      console.log(filename);
      console.log(filename[1]);
      createEntry(req.file.path, filename[1], res);
    });
  } catch (err) {
    res.status(500).send({
      status: true,
      message: err.message,
    });
  }
};
//creating an entry
async function createEntry(path, filename, res) {
  try {
    var read = await XLSX.readFile(path);
    var sheet_name_list = read.SheetNames;
    let rows = XLSX.utils.sheet_to_row_object_array(
      read.Sheets[sheet_name_list[0]],
      {
        header: 1,
      }
    );

    const jsonData = [];

    // Iterate over each row (starting from index 1)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip empty rows
      if (row.length === 0) {
        continue;
      }

      const rowData = {};

      // Iterate over each column and create key-value pairs in rowData object
      for (let j = 0; j < rows[0].length; j++) {
        const columnName = rows[0][j];
        const cellValue = row[j];
        rowData[columnName] = cellValue;
      }

      // Add the row rows to the JSON array
      jsonData.push(rowData);
    }

    res.status(200).send({
      status: true,
      data: [{ filename }],
      message: "Data entered created successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: false,
      message: "An error occurred while processing the file",
    });
  }
}
