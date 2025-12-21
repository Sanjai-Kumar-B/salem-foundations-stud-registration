const fs = require('fs');
const path = require('path');

// Read all three CSV files
const csvFiles = [
  'TamilNadu_MBBS_All_Colleges_Govt_Private_Deemed_FULL.csv',
  'TamilNadu_MBBS_All_Colleges_Private_FULL.csv',
  'TamilNadu_MBBS_All_Colleges_Deemed_FULL.csv'
];

const collegesByDistrict = {};

csvFiles.forEach(fileName => {
  const csvPath = path.join(__dirname, '../College_list_csv', fileName);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse CSV
  const lines = csvContent.split('\n');
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line || line === ',') {
      continue;
    }
    
    // Split by comma
    const parts = line.split(',');
    
    if (parts.length >= 2) {
      const district = parts[0]?.trim();
      const collegeName = parts[1]?.trim();
      
      // Skip if district or college name is empty
      if (!district || !collegeName || district === '' || collegeName === '') {
        continue;
      }
      
      // Normalize district name to uppercase
      const normalizedDistrict = district.toUpperCase();
      
      // Initialize array if district doesn't exist
      if (!collegesByDistrict[normalizedDistrict]) {
        collegesByDistrict[normalizedDistrict] = [];
      }
      
      // Add college if not already exists
      if (!collegesByDistrict[normalizedDistrict].includes(collegeName)) {
        collegesByDistrict[normalizedDistrict].push(collegeName);
      }
    }
  }
});

// Sort colleges in each district
Object.keys(collegesByDistrict).forEach(district => {
  collegesByDistrict[district] = [...new Set(collegesByDistrict[district])].sort();
});

// Write to TypeScript file
const tsContent = `// Auto-generated from MBBS college data
// Generated on ${new Date().toISOString()}

export const COLLEGES_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(collegesByDistrict, null, 2)};

export const TN_DISTRICTS_FOR_COLLEGES = ${JSON.stringify(Object.keys(collegesByDistrict).sort(), null, 2)};
`;

const outputPath = path.join(__dirname, '../src/data/collegesByDistrict.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log('✅ MBBS colleges data generated successfully!');
console.log(`📊 Total districts: ${Object.keys(collegesByDistrict).length}`);
console.log(`🏥 Total colleges: ${Object.values(collegesByDistrict).reduce((sum, colleges) => sum + colleges.length, 0)}`);
