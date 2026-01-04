import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { StudentApplication } from '@/types';
import { formatDate } from './utils';

// Helper function to load image as base64
async function loadImageAsBase64(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the image as a blob to avoid CORS issues
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image data'));
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading image:', error);
      reject(error);
    }
  });
}

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
export async function exportSingleApplicationPDF(application: StudentApplication) {
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

  // Add student photo in top right if available (check both locations)
  const photoUrl = application.documents?.photo?.url || application.personalDetails.photoUrl;
  if (photoUrl) {
    console.log('Attempting to load photo from:', photoUrl);
    try {
      const photoBase64 = await loadImageAsBase64(photoUrl);
      console.log('Photo loaded successfully as base64');
      doc.addImage(photoBase64, 'JPEG', 165, 10, 30, 30);
      // Add border around photo
      doc.setDrawColor(200, 200, 200);
      doc.rect(165, 10, 30, 30);
    } catch (error) {
      console.error('Failed to load photo in PDF:', error);
    }
  } else {
    console.log('No photo URL found');
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
export async function exportStudentCertificatePDF(application: StudentApplication) {
  const doc = new jsPDF();

  // === HEADER SECTION ===
  // Dark blue header background (matching reference design)
  doc.setFillColor(0, 51, 102); // Dark blue #003366
  doc.rect(0, 0, 210, 25, 'F');
  
  // Organization name in header
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('SALEM FOUNDATIONS', 105, 16, { align: 'center' });

  // Blue information strip
  doc.setFillColor(0, 102, 204); // Bright blue #0066CC
  doc.rect(0, 25, 210, 13, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255); // White text on blue background
  doc.setFont('helvetica', 'normal');
  doc.text('Government Registered National Educational Support Organization', 105, 31, { align: 'center' });
  doc.text('Government Registration Number: 9/16', 105, 36, { align: 'center' });

  // Certificate title
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0); // Black text
  doc.setFont('helvetica', 'bold');
  doc.text('INDIA-WIDE STUDENT SUPPORT PROGRAM', 105, 45, { align: 'center' });
  doc.text('SELECTION CERTIFICATE', 105, 52, { align: 'center' });
  
  // Horizontal line under title
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(1);
  doc.line(35, 55, 175, 55);

  // === LOGO AND PHOTO SECTION ===
  let yPos = 62;
  
  // Add Logo on left side with circular frame design
  // Draw main circle border
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(1.5);
  doc.circle(40, yPos + 18, 20);
  
  // Add logo image in center
  try {
    const logoImg = document.createElement('img');
    logoImg.src = '/logo_eng.jpg';
    doc.addImage(logoImg, 'JPEG', 26, yPos + 4, 28, 28);
  } catch (error) {
    console.log('Logo not loaded in PDF');
  }
  
  // Logo text below with proper styling
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Govt. Registered', 40, yPos + 41, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Registration No: 9/16', 40, yPos + 46, { align: 'center' });

  // Add student photo on right side
  const photoUrl = application.documents?.photo?.url || application.personalDetails.photoUrl;
  if (photoUrl) {
    try {
      const photoBase64 = await loadImageAsBase64(photoUrl);
      // Photo with border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(160, yPos, 35, 35);
      doc.addImage(photoBase64, 'JPEG', 160, yPos, 35, 35);
    } catch (error) {
      console.error('Certificate: Failed to load photo in PDF:', error);
    }
  }
  
  // Photo label
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 51, 102);
  doc.text('Student Photograph', 177.5, yPos + 38, { align: 'center' });

  // === CERTIFICATE REFERENCE AND DATE ===
  yPos += 52;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  const refId = `SF2026-${application.applicationNumber.slice(-4)}`;
  const issueDate = formatDate(application.submittedAt.toDate());
  doc.text(`Certificate Reference ID: ${refId}`, 14, yPos);
  doc.text(`Date of Issue: ${issueDate}`, 140, yPos);

  // === STUDENT INFORMATION TABLE ===
  yPos += 8;
  const tableData = [
    ['Student Name:', `${application.personalDetails.firstName} ${application.personalDetails.lastName}`, 
     'Parent / Guardian Name:', application.personalDetails.fatherName],
    ['Contact Number:', application.personalDetails.mobile, 
     'Category:', application.communityScholarship.community],
    ['10th / 12th Status:', `${application.academicDetails.tenthPercentage}% / ${application.academicDetails.twelfthPercentage}%`, 
     'Preferred Course:', application.coursePreference.preferredCourse.replace(/_/g, ' ')],
    ['Specialization:', application.coursePreference.courseSpecialization || '-', 
     'Preferred State / City:', application.personalDetails.address.district],
  ];

  autoTable(doc, {
    body: tableData,
    startY: yPos,
    theme: 'grid',
    styles: { 
      fontSize: 8, 
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, fillColor: [245, 245, 245] },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 42, fillColor: [245, 245, 245] },
      3: { cellWidth: 56 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  // === CERTIFICATION TEXT ===
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const certText = `This is to certify that the above student has been officially selected under the Salem Foundations National Student Support Program and is eligible for free support benefits.`;
  const certLines = doc.splitTextToSize(certText, 182);
  doc.text(certLines, 14, yPos);

  yPos += certLines.length * 5 + 8;

  // === BENEFITS PROVIDED SECTION ===
  doc.setFontSize(11);
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.text('Benefits Provided (100% Free)', 14, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const benefits = [
    '• Real Scholarship Support',
    '• Free Counseling & Career Guidance',
    '• Government & Private College Admission Support',
    '• Course & College Selection Assistance',
    '• Documentation Support',
    '• Free Spoken English Training',
    '• Free Computer Skills Training',
    '• Job & Career Placement Support',
    '• Continuous Mentorship & Student Support',
  ];

  benefits.forEach(benefit => {
    doc.text(benefit, 14, yPos);
    yPos += 5;
  });

  yPos += 5;

  // === COURSES SUPPORTED SECTION ===
  doc.setFontSize(11);
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.text('Courses Supported (All India)', 14, yPos);

  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 6;
  }
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const courses = [
    'MBBS / BDS / Allied Health / Paramedical',
    'Engineering & Technology',
    'Law',
    'Agriculture & Veterinary',
    'Architecture',
    'Aviation & Airline Courses',
    'Hotel Management & Catering Science',
    'Arts & Science',
    'Polytechnic & Diploma Programs',
    'And Other Higher Education Programs',
  ];

  courses.forEach(course => {
    doc.text(course, 14, yPos);
    yPos += 5;
  });

  yPos += 8;

  // Check if we need page 2 for remaining content
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  // === IMPORTANT TERMS & CONDITIONS ===
  doc.setFontSize(11);
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.text('Important Terms & Conditions', 14, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const terms = [
    '• Selection means eligibility for support, not automatic admission guarantee.',
    '• Scholarships depend on Government / Private college rules & student eligibility.',
    '• Student must provide correct documents.',
    '• Support continues only while student cooperates with Salem Foundations.',
    '• No counseling fee or hidden charges.',
  ];

  terms.forEach(term => {
    const termLines = doc.splitTextToSize(term, 182);
    doc.text(termLines, 14, yPos);
    yPos += termLines.length * 5;
  });

  yPos += 6;

  // === CANCELLATION CLAUSE ===
  doc.setFontSize(11);
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.text('Cancellation Clause', 14, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const cancellationText = 'If the student joins another consultancy or proceeds with admission without informing Salem Foundations, all support and scholarship assistance will be cancelled.';
  const cancellationLines = doc.splitTextToSize(cancellationText, 182);
  doc.text(cancellationLines, 14, yPos);

  yPos += cancellationLines.length * 5 + 6;

  // === OFFICIAL ORGANIZATION DETAILS ===
  doc.setFontSize(11);
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.text('Official Organization Details', 14, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Salem Foundations (Government Registered)', 14, yPos);
  yPos += 5;
  doc.text('Head Office: Salem, Tamil Nadu – India', 14, yPos);
  yPos += 5;
  doc.text('Helpline / WhatsApp: +91 8838503547', 14, yPos);
  yPos += 5;
  doc.text('Email: admin@salemfoundations.com', 14, yPos);
  yPos += 5;
  doc.text('Website: www.salemfoundations.com', 14, yPos);

  yPos += 10;

  // === CERTIFICATE VERIFICATION ===
  doc.setFontSize(11);
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate Verification', 14, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan QR to verify authenticity', 14, yPos);
  yPos += 5;
  doc.text(`Or visit www.salemfoundations.com/verify and enter Reference ID`, 14, yPos);

  // QR Code placeholder box (left side)
  yPos += 8;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(14, yPos, 40, 40);
  doc.setFontSize(8);
  doc.text('Sample QR Verification Code', 34, yPos + 20, { align: 'center' });
  doc.setFontSize(7);
  doc.text('(QR code will be generated', 34, yPos + 30, { align: 'center' });
  doc.text('for actual certificate)', 34, yPos + 34, { align: 'center' });

  // Authorized signature on right side
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Sreeja', 155, yPos + 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Authorized Signatory', 155, yPos + 35);

  doc.save(`certificate_${application.applicationNumber}.pdf`);
}
