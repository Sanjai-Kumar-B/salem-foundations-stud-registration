const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../College_list_csv/9_School_Block_Information.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n');
const schoolsByDistrict = {};

let currentDistrict = '';
let currentBlock = '';
let currentSchool = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim().replace(/^"|"$/g, ''); // Remove leading/trailing quotes
  
  if (!line || line.includes('TAMILNADU ENGINEERING') || line.includes('SCHOOL BLOCK') || line.includes('Page ')) {
    continue;
  }

  // Check if line contains district, block, and school info
  const parts = line.split(/\s{2,}/); // Split by 2 or more spaces
  
  if (parts.length >= 3) {
    // Try to extract district, block, and school name
    const potentialDistrict = parts[0]?.trim();
    const potentialBlock = parts[1]?.trim();
    const potentialSchool = parts[2]?.trim();
    
    // Check if it's a valid district (all Tamil Nadu districts)
    const validDistricts = [
      'ARIYALUR', 'CHENGALPATTU', 'CHENNAI', 'COIMBATORE', 'CUDDALORE', 'DHARMAPURI',
      'DINDIGUL', 'ERODE', 'KALLAKURICHI', 'KANCHIPURAM', 'KANYAKUMARI', 'KARUR',
      'KRISHNAGIRI', 'MADURAI', 'MAYILADUTHURAI', 'NAGAPATTINAM', 'NAMAKKAL',
      'NILGIRIS', 'PERAMBALUR', 'PUDUKKOTTAI', 'RAMANATHAPURAM', 'RANIPET',
      'SALEM', 'SIVAGANGA', 'TENKASI', 'THANJAVUR', 'THENI', 'THOOTHUKUDI',
      'TIRUCHIRAPPALLI', 'TIRUNELVELI', 'TIRUPATHUR', 'TIRUPPUR', 'TIRUVALLUR',
      'TIRUVANNAMALAI', 'TIRUVARUR', 'VELLORE', 'VILUPPURAM', 'VIRUDHUNAGAR'
    ];
    
    if (validDistricts.includes(potentialDistrict.toUpperCase())) {
      currentDistrict = potentialDistrict.toUpperCase();
      currentBlock = potentialBlock;
      currentSchool = potentialSchool;
      
      if (currentSchool && currentSchool.length > 3) {
        if (!schoolsByDistrict[currentDistrict]) {
          schoolsByDistrict[currentDistrict] = [];
        }
        
        // Add school if not already exists
        if (!schoolsByDistrict[currentDistrict].includes(currentSchool)) {
          schoolsByDistrict[currentDistrict].push(currentSchool);
        }
      }
    }
  } else if (currentDistrict && line.length > 5 && !line.match(/^\d+$/) && !line.includes('PINCODE')) {
    // This might be a continuation of school name or a standalone school name
    const cleanLine = line.replace(/^"|"$/g, '').trim();
    if (cleanLine.length > 3 && !cleanLine.match(/^\d{6}$/)) { // Not a pincode
      // Check if it looks like a school name
      if (cleanLine.includes('SCHOOL') || cleanLine.includes('HSS') || cleanLine.includes('GHS') || 
          cleanLine.includes('HIGHER') || cleanLine.includes('SECONDARY')) {
        if (!schoolsByDistrict[currentDistrict].includes(cleanLine)) {
          schoolsByDistrict[currentDistrict].push(cleanLine);
        }
      }
    }
  }
}

// Sort schools in each district
Object.keys(schoolsByDistrict).forEach(district => {
  schoolsByDistrict[district] = [...new Set(schoolsByDistrict[district])].sort();
});

// Write to TypeScript file
const tsContent = `// Auto-generated from school data
// Generated on ${new Date().toISOString()}

export const SCHOOLS_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(schoolsByDistrict, null, 2)};

export const TN_DISTRICTS_FOR_SCHOOLS = ${JSON.stringify(Object.keys(schoolsByDistrict).sort(), null, 2)};
`;

const outputPath = path.join(__dirname, '../src/data/schoolsByDistrict.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log('✅ Schools data generated successfully!');
console.log(`📊 Total districts: ${Object.keys(schoolsByDistrict).length}`);
console.log(`🏫 Total schools: ${Object.values(schoolsByDistrict).reduce((sum, schools) => sum + schools.length, 0)}`);
console.log(`📁 Output: ${outputPath}`);
