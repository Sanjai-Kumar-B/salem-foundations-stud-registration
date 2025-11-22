import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { StudentApplication } from '@/types';
import { formatDate } from './utils';

// Export to Excel
export function exportToExcel(applications: StudentApplication[], filename: string = 'applications') {
  const data = applications.map((app) => ({
    'Application No': app.applicationNumber,
    'First Name': app.personalDetails.firstName,
    'Last Name': app.personalDetails.lastName,
    'Email': app.personalDetails.email,
    'Mobile': app.personalDetails.mobile,
    'Date of Birth': app.personalDetails.dateOfBirth,
    'Gender': app.personalDetails.gender,
    'Aadhar': app.personalDetails.aadharNumber,
    'Address': `${app.personalDetails.address.line1}, ${app.personalDetails.address.city}`,
    'District': app.personalDetails.address.district,
    'State': app.personalDetails.address.state,
    'Pincode': app.personalDetails.address.pincode,
    'Father Name': app.personalDetails.fatherName,
    'Mother Name': app.personalDetails.motherName,
    '10th School': app.academicDetails.tenthSchool,
    '10th Board': app.academicDetails.tenthBoard,
    '10th Year': app.academicDetails.tenthYearOfPassing,
    '10th %': app.academicDetails.tenthPercentage,
    '10th Marks': `${app.academicDetails.tenthMarks}/${app.academicDetails.tenthTotalMarks}`,
    '12th School': app.academicDetails.twelfthSchool,
    '12th Board': app.academicDetails.twelfthBoard,
    '12th Year': app.academicDetails.twelfthYearOfPassing,
    '12th %': app.academicDetails.twelfthPercentage,
    '12th Marks': `${app.academicDetails.twelfthMarks}/${app.academicDetails.twelfthTotalMarks}`,
    '12th Group': app.academicDetails.twelfthGroup,
    'NEET Score': app.academicDetails.neetScore || '-',
    'NEET Rank': app.academicDetails.neetRank || '-',
    'JEE Score': app.academicDetails.jeeScore || '-',
    'JEE Rank': app.academicDetails.jeeRank || '-',
    'Preferred Course': app.coursePreference.preferredCourse,
    'Specialization': app.coursePreference.courseSpecialization || '-',
    'Additional Free Courses': app.coursePreference.additionalFreeCourses?.join(', ') || '-',
    'Community': app.communityScholarship.community,
    'Scholarship Type': app.communityScholarship.scholarshipType,
    'Annual Income': app.communityScholarship.annualFamilyIncome,
    'First Graduate': app.communityScholarship.firstGraduate ? 'Yes' : 'No',
    'Status': app.status,
    'Tags': app.tags.join(', '),
    'Submitted Date': formatDate(app.submittedAt.toDate()),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

  // Auto-size columns
  const maxWidth = 50;
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.min(Math.max(key.length, 10), maxWidth),
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Export to CSV
export function exportToCSV(applications: StudentApplication[], filename: string = 'applications') {
  const data = applications.map((app) => ({
    'Application No': app.applicationNumber,
    'First Name': app.personalDetails.firstName,
    'Last Name': app.personalDetails.lastName,
    'Email': app.personalDetails.email,
    'Mobile': app.personalDetails.mobile,
    'Date of Birth': app.personalDetails.dateOfBirth,
    'District': app.personalDetails.address.district,
    '10th %': app.academicDetails.tenthPercentage,
    '12th %': app.academicDetails.twelfthPercentage,
    '12th Group': app.academicDetails.twelfthGroup,
    'Preferred Course': app.coursePreference.preferredCourse,
    'Community': app.communityScholarship.community,
    'Status': app.status,
    'Submitted Date': formatDate(app.submittedAt.toDate()),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to PDF
export function exportToPDF(applications: StudentApplication[], filename: string = 'applications') {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text('Salem Foundations - Student Applications', 14, 22);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);
  doc.text(`Total Applications: ${applications.length}`, 14, 36);

  // Prepare table data
  const tableData = applications.map((app) => [
    app.applicationNumber,
    `${app.personalDetails.firstName} ${app.personalDetails.lastName}`,
    app.coursePreference.preferredCourse,
    `${app.academicDetails.twelfthPercentage}%`,
    app.personalDetails.address.district,
    app.status,
    formatDate(app.submittedAt.toDate()),
  ]);

  // Add table
  autoTable(doc, {
    head: [['App No.', 'Name', 'Course', '12th %', 'District', 'Status', 'Date']],
    body: tableData,
    startY: 42,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 42 },
  });

  doc.save(`${filename}.pdf`);
}

// Export single application as PDF
export function exportSingleApplicationPDF(application: StudentApplication) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('SALEM FOUNDATIONS', 105, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Student Application Form', 105, 28, { align: 'center' });

  // Application Number
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Application No: ${application.applicationNumber}`, 105, 35, { align: 'center' });

  let yPos = 45;

  // Personal Details Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Personal Details', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const personalDetails = [
    ['Name', `${application.personalDetails.firstName} ${application.personalDetails.lastName}`],
    ['Date of Birth', application.personalDetails.dateOfBirth],
    ['Gender', application.personalDetails.gender],
    ['Email', application.personalDetails.email],
    ['Mobile', application.personalDetails.mobile],
    ['Aadhar Number', application.personalDetails.aadharNumber],
    ['Father\'s Name', application.personalDetails.fatherName],
    ['Mother\'s Name', application.personalDetails.motherName],
    ['Address', `${application.personalDetails.address.line1}, ${application.personalDetails.address.city}`],
    ['District', application.personalDetails.address.district],
    ['State', application.personalDetails.address.state],
    ['Pincode', application.personalDetails.address.pincode],
  ];

  autoTable(doc, {
    body: personalDetails,
    startY: yPos,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Academic Details Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Academic Details', 14, yPos);
  yPos += 8;

  const academicDetails = [
    ['10th School', application.academicDetails.tenthSchool],
    ['10th Board', application.academicDetails.tenthBoard],
    ['10th Year', application.academicDetails.tenthYearOfPassing],
    ['10th Percentage', `${application.academicDetails.tenthPercentage}%`],
    ['10th Marks', `${application.academicDetails.tenthMarks}/${application.academicDetails.tenthTotalMarks}`],
    ['12th School', application.academicDetails.twelfthSchool],
    ['12th Board', application.academicDetails.twelfthBoard],
    ['12th Year', application.academicDetails.twelfthYearOfPassing],
    ['12th Percentage', `${application.academicDetails.twelfthPercentage}%`],
    ['12th Marks', `${application.academicDetails.twelfthMarks}/${application.academicDetails.twelfthTotalMarks}`],
    ['12th Group', application.academicDetails.twelfthGroup],
  ];

  if (application.academicDetails.neetScore) {
    academicDetails.push(
      ['NEET Score', application.academicDetails.neetScore.toString()],
      ['NEET Rank', application.academicDetails.neetRank?.toString() || '-']
    );
  }

  if (application.academicDetails.jeeScore) {
    academicDetails.push(
      ['JEE Score', application.academicDetails.jeeScore.toString()],
      ['JEE Rank', application.academicDetails.jeeRank?.toString() || '-']
    );
  }

  autoTable(doc, {
    body: academicDetails,
    startY: yPos,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  // Add new page if needed
  if ((doc as any).lastAutoTable.finalY > 250) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Course Preference Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Course Preference', 14, yPos);
  yPos += 8;

  const courseDetails = [
    ['Preferred Course', application.coursePreference.preferredCourse],
    ['Specialization', application.coursePreference.courseSpecialization || '-'],
    ['Preferred Colleges', application.coursePreference.preferredColleges.join(', ')],
    ['Additional Free Courses', application.coursePreference.additionalFreeCourses?.join(', ') || '-'],
  ];

  autoTable(doc, {
    body: courseDetails,
    startY: yPos,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Community & Scholarship Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Community & Scholarship', 14, yPos);
  yPos += 8;

  const communityDetails = [
    ['Community', application.communityScholarship.community],
    ['Scholarship Type', application.communityScholarship.scholarshipType],
    ['Annual Family Income', `₹${application.communityScholarship.annualFamilyIncome.toLocaleString()}`],
    ['First Graduate', application.communityScholarship.firstGraduate ? 'Yes' : 'No'],
  ];

  autoTable(doc, {
    body: communityDetails,
    startY: yPos,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Status Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Application Status', 14, yPos);
  yPos += 8;

  const statusDetails = [
    ['Status', application.status],
    ['Tags', application.tags.join(', ')],
    ['Submitted Date', formatDate(application.submittedAt.toDate())],
  ];

  autoTable(doc, {
    body: statusDetails,
    startY: yPos,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${formatDate(new Date())} | Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`application_${application.applicationNumber}.pdf`);
}
