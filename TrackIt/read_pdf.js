import fs from 'fs';
import PDFParser from 'pdf2json';

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataReady', pdf => {
  // The JSON retains x & y coordinates, font size, and raw text
  fs.writeFileSync('./invoice.json', JSON.stringify(pdf, null, 2));
});

pdfParser.loadPDF('./SSR_TSRPT.pdf');

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

const parseJSON = (filePath) => {
  let to_return_data = []
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  if (data["Pages"].length === 0) {
    throw new Error("No pages found in the PDF.");
  }
  else {
    for(let i = 0; i < data["Pages"].length; i++) {
      if (!data["Pages"][i].hasOwnProperty("Texts")) {
        throw new Error(`No text found in page ${i} of the PDF.`);
      }
      const page = data["Pages"][i]["Texts"].map(text => {
        return text.R[0].T;
      });
      to_return_data = to_return_data.concat(page);
    }
  }
  
  return to_return_data;
};

// const data = parseJSON('./invoice.json');
// fs.writeFileSync('./grades.txt', data.join('\n'), 'utf-8');

function load_course_data(dataJSON) {
  const course_credit_legent =["AEG",
                              "AUD",
                              "CR",
                              "DNW",
                              "FTC",
                              "INC",
                              "IP",
                              "MM",
                              "NCR",
                              "NG",
                              "NMR",
                              "UR",
                              "WD",
                              "WF",];
  let grade_report = []
  let n = 0
  let current_term = ""
  for (let i = 0; i < dataJSON.length; i++) {

    let course = {
      "course_code": "",
      "course_number": "",
      "course_name": "",
      "grade": "",
      "credits_possible": "",
      "earned_credits": "",
      "term": ""
    }

    if (
      (dataJSON[i].includes("Fall") ||
        dataJSON[i].includes("Spring") ||
        dataJSON[i].includes("Winter")) &&
        dataJSON[i + 1]?.includes("Program:")) {
      current_term = dataJSON[i];
    }

    if ( (/\s$/.test(dataJSON[i]) && /^\s/.test(dataJSON[i + 1])) && dataJSON[i].length > 2 && dataJSON[i].length < 10 && dataJSON[i] != "COOP "){
      course.course_code = dataJSON[i];
      course.course_number = dataJSON[i + 1];
      course.course_name = dataJSON[i + 2];
      course.credits_possible = isNumeric(dataJSON[i + 3]) && dataJSON[i + 3] < 1 ? dataJSON[i + 3] : "";
      course.earned_credits = isNumeric(dataJSON[i + 4]) && dataJSON[i + 3] < 1 ? dataJSON[i + 4] : "";
      course.grade = (course_credit_legent.includes(dataJSON[i + 5]) || isNumeric(dataJSON[i + 5])) ? dataJSON[i + 5] : "";
      course.term = current_term;
      course = { ...course }; 
      grade_report[n] = course;
      n++;
    }
  }
  return grade_report;
}

