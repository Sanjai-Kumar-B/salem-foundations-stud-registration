const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

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

// Directory containing Excel files
const excelDir = path.join(__dirname, '../School_list_csv/School_list_xl');
const files = fs.readdirSync(excelDir).filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));

const schoolsByDistrict = {};
let totalRows = 0;
let validSchools = 0;
let skipped = 0;

console.log(`📁 Found ${files.length} Excel files to process...\n`);

files.forEach(fileName => {
  console.log(`Processing: ${fileName}`);
  const filePath = path.join(excelDir, fileName);
  
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    console.log(`   Found ${workbook.SheetNames.length} sheet(s): ${workbook.SheetNames.join(', ')}`);
    
    // Process each sheet
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with column headers
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(`     Sheet "${sheetName}": ${data.length} rows`);
      
      // Process each row
      data.forEach((row) => {
        totalRows++;
        
        // Extract district and school name from columns
        let rawDistrict = String(row['DISTRICT'] || row['District'] || '').trim().toUpperCase();
        let schoolName = String(row['SCHOOL NAME'] || row['School Name'] || row['SCHOOL_NAME'] || '').trim();
        
        // Skip if missing required fields
        if (!rawDistrict || !schoolName) {
          return;
        }
        
        // Validate school name length
        if (schoolName.length < 3) {
          return;
        }
        
        // Normalize district name
        let normalizedDistrict = VALID_DISTRICTS[rawDistrict];
        
        // Skip if still no valid district found
        if (!normalizedDistrict) {
          skipped++;
          return;
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
          validSchools++;
        }
      });
    });
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error.message);
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
const tsContent = `// Auto-generated from School_list_csv/School_list_xl folder
// Generated on ${new Date().toISOString()}
// Total districts: ${districtList.length}
// Total schools: ${Object.values(sortedDistricts).reduce((sum, schools) => sum + schools.length, 0)}

export const SCHOOLS_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(sortedDistricts, null, 2)};

export const TN_DISTRICTS_FOR_SCHOOLS = ${JSON.stringify(districtList, null, 2)};
`;

// Write to file
const outputPath = path.join(__dirname, '../src/data/schoolsByDistrict.ts');
fs.writeFileSync(outputPath, tsContent);

console.log('\n✅ Schools data generated successfully!');
console.log(`📊 Total districts: ${districtList.length}`);
console.log(`🏫 Total schools: ${Object.values(sortedDistricts).reduce((sum, schools) => sum + schools.length, 0)}`);
console.log(`📝 Total rows processed: ${totalRows}`);
console.log(`❌ Skipped entries: ${skipped}`);
console.log('\n📋 District-wise school count:');
districtList.forEach(district => {
  console.log(`   ${district}: ${sortedDistricts[district].length} schools`);
});
