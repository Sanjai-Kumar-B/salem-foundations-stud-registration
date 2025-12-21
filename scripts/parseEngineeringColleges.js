const fs = require('fs');
const path = require('path');

// Get all engineering college CSV files
const csvDir = path.join(__dirname, '../College_list_csv');
const files = fs.readdirSync(csvDir);
const engineeringFiles = files.filter(f => f.includes('Engineering_Colleges') || 
  (f.endsWith('.csv') && !f.includes('MBBS') && !f.includes('School')));

const collegesByDistrict = {};

engineeringFiles.forEach(fileName => {
  // Extract district name from filename
  let districtName = fileName
    .replace('_Engineering_Colleges.csv', '')
    .replace('_Updated', '')
    .replace('.csv', '')
    .toUpperCase();
  
  const csvPath = path.join(csvDir, fileName);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse CSV
  const lines = csvContent.split('\n');
  
  // Initialize district array
  if (!collegesByDistrict[districtName]) {
    collegesByDistrict[districtName] = [];
  }
  
  // Skip header row and parse
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line || line === ',') {
      continue;
    }
    
    // Try different parsing approaches
    let collegeName = '';
    
    // First try: comma-separated
    if (line.includes(',')) {
      const parts = line.split(',');
      // College name might be in different columns
      collegeName = parts.find(p => p.trim().length > 10)?.trim() || parts[0]?.trim();
    } else {
      // Single column
      collegeName = line.trim();
    }
    
    // Clean up college name
    collegeName = collegeName
      .replace(/^"|"$/g, '')
      .replace(/^\d+\.?\s*/, '') // Remove leading numbers
      .trim();
    
    // Skip if empty or too short
    if (!collegeName || collegeName.length < 5) {
      continue;
    }
    
    // Add college if not already exists
    if (!collegesByDistrict[districtName].includes(collegeName)) {
      collegesByDistrict[districtName].push(collegeName);
    }
  }
});

// Sort colleges in each district
Object.keys(collegesByDistrict).forEach(district => {
  collegesByDistrict[district] = [...new Set(collegesByDistrict[district])].sort();
});

// Write to TypeScript file
const tsContent = `// Auto-generated from engineering college data
// Generated on ${new Date().toISOString()}

export const ENGINEERING_COLLEGES_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(collegesByDistrict, null, 2)};

export const TN_DISTRICTS = ${JSON.stringify(Object.keys(collegesByDistrict).sort(), null, 2)};
`;

const outputPath = path.join(__dirname, '../src/data/engineeringCollegesByDistrict.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log('✅ Engineering colleges data generated successfully!');
console.log(`📊 Total districts: ${Object.keys(collegesByDistrict).length}`);
console.log(`🏫 Total colleges: ${Object.values(collegesByDistrict).reduce((sum, colleges) => sum + colleges.length, 0)}`);
