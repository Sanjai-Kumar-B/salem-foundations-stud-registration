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
    'Preferred Districts': app.coursePreference.preferredDistricts?.join(', ') || '-',
    'Preferred Colleges': app.coursePreference.preferredColleges?.join(', ') || '-',
    'Additional Free Courses': app.coursePreference.additionalFreeCourses?.join(', ') || '-',
    'Community': app.communityScholarship.community,
    'Scholarship Type': Array.isArray(app.communityScholarship.scholarshipType) ? app.communityScholarship.scholarshipType.join(', ') : app.communityScholarship.scholarshipType,
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

  // Enhanced Header with better design
  // Blue header background
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 38, 'F');

  // Add Logo (left side)
  try {
    const logoImg = document.createElement('img');
    logoImg.src = '/logo_eng.jpg';
    doc.addImage(logoImg, 'JPEG', 10, 8, 22, 22);
  } catch (error) {
    console.log('Logo not loaded in PDF');
  }

  // Organization Name
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('SALEM FOUNDATIONS', 105, 15, { align: 'center' });

  // Govt. Registered
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Govt. Registered', 105, 21, { align: 'center' });

  // Document Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Applications Report', 105, 28, { align: 'center' });

  // Report Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate(new Date())} | Total: ${applications.length}`, 105, 34, { align: 'center' });

  // Reset colors for content
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

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
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 42 },
  });

  doc.save(`${filename}.pdf`);
}

// Export single application as PDF
export function exportSingleApplicationPDF(application: StudentApplication) {
  const doc = new jsPDF();

  // Enhanced Header with better design
  // Blue header background
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 45, 'F');

  // Add Logo (left side)
  try {
    const logoImg = document.createElement('img');
    logoImg.src = '/logo_eng.jpg';
    doc.addImage(logoImg, 'JPEG', 10, 10, 25, 25);
  } catch (error) {
    console.log('Logo not loaded in PDF');
  }

  // Organization Name
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('SALEM FOUNDATIONS', 105, 18, { align: 'center' });

  // Govt. Registered
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Govt. Registered', 105, 25, { align: 'center' });

  // Document Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Application Form', 105, 33, { align: 'center' });

  // Application Number with background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(70, 37, 70, 6, 1, 1, 'F');
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text(`Application No: ${application.applicationNumber}`, 105, 41, { align: 'center' });

  // Add student photo in top right if available
  if (application.personalDetails.photoUrl) {
    try {
      doc.addImage(application.personalDetails.photoUrl, 'JPEG', 165, 10, 30, 30);
      // Add border around photo
      doc.setDrawColor(200, 200, 200);
      doc.rect(165, 10, 30, 30);
    } catch (error) {
      console.log('Photo not loaded in PDF:', error);
    }
  }

  // Reset colors for content
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  let yPos = 55;

  // Personal Details Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Details', 14, yPos);
  doc.setFont('helvetica', 'normal');
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
    ['Preferred Districts', application.coursePreference.preferredDistricts?.join(', ') || '-'],
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
    ['Scholarship Type', Array.isArray(application.communityScholarship.scholarshipType) ? application.communityScholarship.scholarshipType.join(', ') : application.communityScholarship.scholarshipType],
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

// Export Student Selection Certificate PDF
export function exportStudentCertificatePDF(application: StudentApplication) {
  const doc = new jsPDF();

  // Header with logo and title
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 50, 'F');

  // Add Logo
  try {
    const logoImg = document.createElement('img');
    logoImg.src = '/logo_eng.jpg';
    doc.addImage(logoImg, 'JPEG', 15, 10, 30, 30);
  } catch (error) {
    console.log('Logo not loaded in PDF');
  }

  // Organization Name and Title
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('SALEM FOUNDATIONS', 105, 22, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Govt. Registered', 105, 29, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SELECTION CERTIFICATE', 105, 43, { align: 'center' });

  // Add student photo in top right if available
  if (application.personalDetails.photoUrl) {
    try {
      doc.addImage(application.personalDetails.photoUrl, 'JPEG', 165, 10, 30, 30);
      // Add border around photo
      doc.setDrawColor(200, 200, 200);
      doc.rect(165, 10, 30, 30);
    } catch (error) {
      console.log('Photo not loaded in PDF:', error);
    }
  }

  // Reset colors for content
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  let yPos = 65;

  // Introduction text
  doc.setFontSize(11);
  doc.text('This is to certify that the student listed below has been successfully selected by Salem Foundations', 14, yPos);
  yPos += 6;
  doc.text('and is eligible for Salem Foundations full support.', 14, yPos);
  yPos += 15;

  // Student Details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  
  const details = [
    ['Name:', `${application.personalDetails.firstName} ${application.personalDetails.lastName}`],
    ['SF Reference Number:', application.applicationNumber],
    ['School:', application.academicDetails.twelfthSchool],
    ['Group/Stream:', application.academicDetails.twelfthGroup.replace(/_/g, ' ')],
    ['Community:', application.communityScholarship.community],
    ['Phone Number:', application.personalDetails.mobile],
    ['Preferred Course:', application.coursePreference.preferredCourse.replace(/_/g, ' ')],
    ['Course Specialization:', application.coursePreference.courseSpecialization || 
      application.coursePreference.collegeName || '-'],
    ['Date Applied:', formatDate(application.submittedAt.toDate())],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, yPos);
    doc.setFont('helvetica', 'normal');
    const textWidth = doc.getTextWidth(label);
    const valueLines = doc.splitTextToSize(value, 180 - textWidth - 5);
    doc.text(valueLines, 14 + textWidth + 3, yPos);
    yPos += 7 * valueLines.length;
  });

  yPos += 10;

  // Benefits Provided Section
  doc.setFont('helvetica', 'bold');
  doc.text('Benefits Provided:', 14, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  const benefits = [
    '• Scholarship Support',
    '• Counseling & Course Guidance',
    '• College Selection & Admission Support',
    '• Documentation Assistance',
    '• Job & Career Support',
    '• Long-term Guidance Until a Successful Career is Achieved',
  ];

  benefits.forEach(benefit => {
    doc.text(benefit, 20, yPos);
    yPos += 7;
  });

  yPos += 10;

  // Cancellation Clause Box
  doc.setFillColor(255, 245, 230);
  doc.rect(10, yPos, 190, 30, 'F');
  doc.setDrawColor(255, 200, 100);
  doc.setLineWidth(0.5);
  doc.rect(10, yPos, 190, 30);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('STRICT CANCELLATION CLAUSE:', 14, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const cancellationText = 'If the student joins any college, consultancy, or course without informing Salem Foundations, all benefits including scholarship, counseling, admission, and job support will be fully cancelled.';
  const cancellationLines = doc.splitTextToSize(cancellationText, 182);
  doc.text(cancellationLines, 14, yPos + 12);

  yPos += 40;

  // Authorization
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Authorized By:', 14, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Salem Foundations', 14, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${formatDate(new Date())}`,
    105,
    285,
    { align: 'center' }
  );

  doc.save(`certificate_${application.applicationNumber}.pdf`);
}
