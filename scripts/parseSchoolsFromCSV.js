const fs = require('fs');
const path = require('path');

// Proper CSV parser that handles quoted fields with commas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Valid Tamil Nadu districts (38 districts)
const VALID_DISTRICTS = {
  'ARIYALUR': 'ARIYALUR',
  'CHENGALPATTU': 'CHENGALPATTU',
  'CHENNAI': 'CHENNAI',
  'COIMBATORE': 'COIMBATORE',
  'CUDDALORE': 'CUDDALORE',
  'DHARMAPURI': 'DHARMAPURI',
  'DINDIGUL': 'DINDIGUL',
  'ERODE': 'ERODE',
  'KALLAKURICHI': 'KALLAKURICHI',
  'KALLAKURIC': 'KALLAKURICHI', // Variation
  'KALLAKURIC HI': 'KALLAKURICHI', // Variation
  'KANCHIPURAM': 'KANCHIPURAM',
  'KANCHEEPUR': 'KANCHIPURAM', // Variation
  'KANCHEEPUR AM': 'KANCHIPURAM', // Variation
  'KANNIYAKUMARI': 'KANNIYAKUMARI',
  'KANNIYAKU MARI': 'KANNIYAKUMARI', // Variation
  'KANNIYAKUM': 'KANNIYAKUMARI', // Variation
  'KANYAKUMARI': 'KANNIYAKUMARI', // Variation
  'KARUR': 'KARUR',
  'KRISHNAGIRI': 'KRISHNAGIRI',
  'MADURAI': 'MADURAI',
  'MAYILADUTHURAI': 'MAYILADUTHURAI',
  'MAYILADUT HURAI': 'MAYILADUTHURAI', // Variation
  'MAYILADUTH': 'MAYILADUTHURAI', // Variation
  'NAGAPATTINAM': 'NAGAPATTINAM',
  'NAGAPATTIN': 'NAGAPATTINAM', // Variation
  'NAGAPATTIN AM': 'NAGAPATTINAM', // Variation
  'NAMAKKAL': 'NAMAKKAL',
  'PERAMBALUR': 'PERAMBALUR',
  'PERAMBALU R': 'PERAMBALUR', // Variation
  'PUDUKKOTTAI': 'PUDUKKOTTAI',
  'PUDUKKOTTA': 'PUDUKKOTTAI', // Variation
  'PUDUKKOTT AI': 'PUDUKKOTTAI', // Variation
  'RAMANATHAPURAM': 'RAMANATHAPURAM',
  'RAMANATHAP': 'RAMANATHAPURAM', // Variation
  'RAMANATHA PURAM': 'RAMANATHAPURAM', // Variation
  'RANIPET': 'RANIPET',
  'SALEM': 'SALEM',
  'SIVAGANGAI': 'SIVAGANGAI',
  'TENKASI': 'TENKASI',
  'THANJAVUR': 'THANJAVUR',
  'THE NILGIRIS': 'THE NILGIRIS',
  'THENI': 'THENI',
  'THOOTHUKUDI': 'THOOTHUKUDI',
  'THOOTHUKKU': 'THOOTHUKUDI', // Variation
  'THOOTHUKK UDI': 'THOOTHUKUDI', // Variation
  'TIRUCHIRAPPALLI': 'TIRUCHIRAPPALLI',
  'TIRUCHIRAPP': 'TIRUCHIRAPPALLI', // Variation
  'TIRUCHIRAPP ALLI': 'TIRUCHIRAPPALLI', // Variation
  'TIRUNELVELI': 'TIRUNELVELI',
  'TIRUPATHUR': 'TIRUPATHUR',
  'TIRUPPUR': 'TIRUPPUR',
  'TIRUVALLUR': 'TIRUVALLUR',
  'THIRUVALLUR': 'TIRUVALLUR', // Variation
  'TIRUVANNAMALAI': 'TIRUVANNAMALAI',
  'TIRUVANNAM': 'TIRUVANNAMALAI', // Variation
  'TIRUVANNA MALAI': 'TIRUVANNAMALAI', // Variation
  'TIRUVARUR': 'TIRUVARUR',
  'VELLORE': 'VELLORE',
  'VILLUPURAM': 'VILLUPURAM',
  'VIRUDHUNAGAR': 'VIRUDHUNAGAR',
  'VIRUDHUNAG': 'VIRUDHUNAGAR', // Variation
  'VIRUDHUNA GAR': 'VIRUDHUNAGAR', // Variation
};

// Directory containing school CSV files
const csvDir = path.join(__dirname, '../School_list_csv');
const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

const schoolsByDistrict = {};

let skipped = 0;
let recovered = 0;

console.log(`📁 Found ${files.length} CSV files to process...\n`);

files.forEach(fileName => {
  const csvPath = path.join(csvDir, fileName);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse CSV
  const lines = csvContent.split('\n');
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Parse CSV properly (handles quoted fields)
    const parts = parseCSVLine(line);
    
    if (parts.length < 4) continue;
    
    // Check if this is a header row
    const col0 = parts[0]?.toUpperCase() || '';
    const col1 = parts[1]?.toUpperCase() || '';
    const col3 = parts[3]?.toUpperCase() || '';
    
    if (col0.includes('SNO') || col0.includes('S NO') ||
        col1 === 'DISTRICT' || col1.includes('DISTRICT') ||
        col3 === 'SCHOOL NAME' || col3.includes('SCHOOL')) {
      continue;
    }
    
    // Extract District (column 2, index 1) and School Name (column 4, index 3)
    let rawDistrict = parts[1]?.trim().toUpperCase();
    let schoolName = parts[3]?.trim();
    
    // Check if district is valid
    let normalizedDistrict = VALID_DISTRICTS[rawDistrict];
    
    // If district is invalid, try to find the district in other columns (data may be shifted)
    if (!normalizedDistrict && parts.length > 4) {
      // Try to find a valid district in columns 2-5
      for (let col = 2; col <= Math.min(parts.length - 2, 5); col++) {
        const testDistrict = parts[col]?.trim().toUpperCase();
        if (VALID_DISTRICTS[testDistrict]) {
          normalizedDistrict = VALID_DISTRICTS[testDistrict];
          // School name would be 2 columns after district
          schoolName = parts[col + 2]?.trim();
          recovered++;
          break;
        }
      }
    }
    
    // Validate
    if (!rawDistrict || !schoolName || schoolName.length < 5) {
      continue;
    }
    
    // Skip if still no valid district found
    if (!normalizedDistrict) {
      skipped++;
      continue;
    }
    
    // Initialize district array if it doesn't exist
    if (!schoolsByDistrict[normalizedDistrict]) {
      schoolsByDistrict[normalizedDistrict] = [];
    }
    
    // Add school if not already exists (case-insensitive check)
    const exists = schoolsByDistrict[normalizedDistrict].some(
      s => s.toUpperCase() === schoolName.toUpperCase()
    );
    
    if (!exists) {
      schoolsByDistrict[normalizedDistrict].push(schoolName);
    }
  }
});

// Sort schools alphabetically in each district
Object.keys(schoolsByDistrict).forEach(district => {
  schoolsByDistrict[district].sort((a, b) => a.localeCompare(b));
});

// Sort districts alphabetically
const sortedDistricts = {};
Object.keys(schoolsByDistrict).sort().forEach(district => {
  sortedDistricts[district] = schoolsByDistrict[district];
});

// Extract unique district list
const districtList = Object.keys(sortedDistricts).sort();

// Generate TypeScript content
const tsContent = `// Auto-generated from School_list_csv folder
// Generated on ${new Date().toISOString()}
// Total districts: ${districtList.length}
// Total schools: ${Object.values(sortedDistricts).reduce((sum, schools) => sum + schools.length, 0)}

export const SCHOOLS_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(sortedDistricts, null, 2)};

export const TN_DISTRICTS_FOR_SCHOOLS = ${JSON.stringify(districtList, null, 2)};
`;

// Write to file
const outputPath = path.join(__dirname, '../src/data/schoolsByDistrict.ts');
fs.writeFileSync(outputPath, tsContent);

console.log('✅ Schools data generated successfully!');
console.log(`📊 Total districts: ${districtList.length}`);
console.log(`🏫 Total schools: ${Object.values(sortedDistricts).reduce((sum, schools) => sum + schools.length, 0)}`);
console.log(`🔄 Recovered schools from shifted columns: ${recovered}`);
console.log(`❌ Skipped entries: ${skipped}`);
console.log('\n📋 District-wise school count:');
districtList.forEach(district => {
  console.log(`   ${district}: ${sortedDistricts[district].length} schools`);
});
