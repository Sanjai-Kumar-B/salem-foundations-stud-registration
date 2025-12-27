const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

// Read the PDF file
const pdfPath = path.join(__dirname, '../College_list_csv/9_School_Block_Information.pdf');

const schoolsByDistrict = {};

// Valid Tamil Nadu districts
const validDistricts = [
  'ARIYALUR', 'CHENGALPATTU', 'CHENNAI', 'COIMBATORE', 'CUDDALORE', 'DHARMAPURI',
  'DINDIGUL', 'ERODE', 'KALLAKURICHI', 'KANCHIPURAM', 'KANYAKUMARI', 'KARUR',
  'KRISHNAGIRI', 'MADURAI', 'MAYILADUTHURAI', 'NAGAPATTINAM', 'NAMAKKAL',
  'NILGIRIS', 'PERAMBALUR', 'PUDUKKOTTAI', 'RAMANATHAPURAM', 'RANIPET',
  'SALEM', 'SIVAGANGA', 'TENKASI', 'THANJAVUR', 'THENI', 'THOOTHUKUDI',
  'TIRUCHIRAPPALLI', 'TIRUNELVELI', 'TIRUPATHUR', 'TIRUPPUR', 'TIRUVALLUR',
  'TIRUVANNAMALAI', 'TIRUVARUR', 'VELLORE', 'VILUPPURAM', 'VIRUDHUNAGAR'
];

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => {
  console.error('❌ Error parsing PDF:', errData.parserError);
});

pdfParser.on('pdfParser_dataReady', pdfData => {
  try {
    // Get text content
    const text = pdfParser.getRawTextContent();
    
    // Debug: Show first 1000 characters
    console.log('📄 PDF Text Preview (first 1000 chars):');
    console.log(text.substring(0, 1000));
    console.log('\n' + '='.repeat(80) + '\n');
    
    const lines = text.split('\n');
  
  let currentDistrict = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and headers
    if (!line || line.includes('TAMILNADU ENGINEERING') || line.includes('SCHOOL BLOCK') || 
        line.includes('Page ') || line.includes('District') || line.includes('Block')) {
      continue;
    }
    
    // Check if this line contains a district name
    const upperLine = line.toUpperCase();
    let foundDistrict = '';
    
    for (const district of validDistricts) {
      if (upperLine.includes(district)) {
        foundDistrict = district;
        break;
      }
    }
    
    if (foundDistrict) {
      currentDistrict = foundDistrict;
      if (!schoolsByDistrict[currentDistrict]) {
        schoolsByDistrict[currentDistrict] = [];
      }
      
      // Try to extract school name from the same line or nearby lines
      // Pattern: District Block School
      const parts = line.split(/\s{2,}/); // Split by 2 or more spaces
      
      if (parts.length >= 3) {
        const schoolName = parts[2].trim();
        if (schoolName && schoolName.length > 5 && !schoolName.match(/^\d+$/)) {
          if (!schoolsByDistrict[currentDistrict].includes(schoolName)) {
            schoolsByDistrict[currentDistrict].push(schoolName);
          }
        }
      }
    } else if (currentDistrict) {
      // This might be a school name continuation or a standalone school name
      const cleanLine = line.replace(/^"|"$/g, '').trim();
      
      // Check if it looks like a school name
      if (cleanLine.length > 5 && 
          !cleanLine.match(/^\d+$/) && 
          !cleanLine.match(/^\d{6}$/) && // Not a pincode
          (cleanLine.includes('SCHOOL') || 
           cleanLine.includes('HSS') || 
           cleanLine.includes('GHS') || 
           cleanLine.includes('HIGHER') || 
           cleanLine.includes('SECONDARY') ||
           cleanLine.includes('HIGH') ||
           cleanLine.includes('PRIMARY') ||
           cleanLine.includes('MIDDLE'))) {
        
        if (!schoolsByDistrict[currentDistrict].includes(cleanLine)) {
          schoolsByDistrict[currentDistrict].push(cleanLine);
        }
      }
    }
  }
  
  // Sort schools in each district and remove duplicates
  Object.keys(schoolsByDistrict).forEach(district => {
    schoolsByDistrict[district] = [...new Set(schoolsByDistrict[district])].sort();
  });
  
  // Write to TypeScript file
  const tsContent = `// Auto-generated from school data (PDF)
// Generated on ${new Date().toISOString()}

export const SCHOOLS_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(schoolsByDistrict, null, 2)};

export const TN_DISTRICTS_FOR_SCHOOLS = ${JSON.stringify(Object.keys(schoolsByDistrict).sort(), null, 2)};
`;
  
  const outputPath = path.join(__dirname, '../src/data/schoolsByDistrict.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  
  console.log('✅ Schools data generated successfully from PDF!');
  console.log(`📊 Total districts: ${Object.keys(schoolsByDistrict).length}`);
  console.log(`🏫 Total schools: ${Object.values(schoolsByDistrict).reduce((sum, schools) => sum + schools.length, 0)}`);
  
  // Show sample data for verification
  console.log('\n📝 Sample data from first district:');
  const firstDistrict = Object.keys(schoolsByDistrict).sort()[0];
  console.log(`${firstDistrict}: ${schoolsByDistrict[firstDistrict].length} schools`);
  console.log('First 5 schools:', schoolsByDistrict[firstDistrict].slice(0, 5));
  
  } catch (error) {
    console.error('❌ Error processing data:', error);
  }
});

pdfParser.loadPDF(pdfPath);
