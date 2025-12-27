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

// Valid Tamil Nadu districts
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
  'KALLAKURIC': 'KALLAKURICHI',
  'KALLAKURIC HI': 'KALLAKURICHI',
  'KANCHIPURAM': 'KANCHIPURAM',
  'KANCHEEPUR': 'KANCHIPURAM',
  'KANCHEEPUR AM': 'KANCHIPURAM',
  'KANNIYAKUMARI': 'KANNIYAKUMARI',
  'KANNIYAKU MARI': 'KANNIYAKUMARI',
  'KANNIYAKUM': 'KANNIYAKUMARI',
  'KANYAKUMARI': 'KANNIYAKUMARI',
  'KARUR': 'KARUR',
  'KRISHNAGIRI': 'KRISHNAGIRI',
  'MADURAI': 'MADURAI',
  'MAYILADUTHURAI': 'MAYILADUTHURAI',
  'MAYILADUT HURAI': 'MAYILADUTHURAI',
  'MAYILADUTH': 'MAYILADUTHURAI',
  'NAGAPATTINAM': 'NAGAPATTINAM',
  'NAGAPATTIN': 'NAGAPATTINAM',
  'NAGAPATTIN AM': 'NAGAPATTINAM',
  'NAMAKKAL': 'NAMAKKAL',
  'PERAMBALUR': 'PERAMBALUR',
  'PERAMBALU R': 'PERAMBALUR',
  'PUDUKKOTTAI': 'PUDUKKOTTAI',
  'PUDUKKOTTA': 'PUDUKKOTTAI',
  'PUDUKKOTT AI': 'PUDUKKOTTAI',
  'RAMANATHAPURAM': 'RAMANATHAPURAM',
  'RAMANATHAP': 'RAMANATHAPURAM',
  'RAMANATHA PURAM': 'RAMANATHAPURAM',
  'RANIPET': 'RANIPET',
  'SALEM': 'SALEM',
  'SIVAGANGAI': 'SIVAGANGAI',
  'TENKASI': 'TENKASI',
  'THANJAVUR': 'THANJAVUR',
  'THE NILGIRIS': 'THE NILGIRIS',
  'THENI': 'THENI',
  'THOOTHUKUDI': 'THOOTHUKUDI',
  'THOOTHUKKU': 'THOOTHUKUDI',
  'THOOTHUKK UDI': 'THOOTHUKUDI',
  'TIRUCHIRAPPALLI': 'TIRUCHIRAPPALLI',
  'TIRUCHIRAPP': 'TIRUCHIRAPPALLI',
  'TIRUCHIRAPP ALLI': 'TIRUCHIRAPPALLI',
  'TIRUNELVELI': 'TIRUNELVELI',
  'TIRUPATHUR': 'TIRUPATHUR',
  'TIRUPPUR': 'TIRUPPUR',
  'TIRUVALLUR': 'TIRUVALLUR',
  'THIRUVALLUR': 'TIRUVALLUR',
  'TIRUVANNAMALAI': 'TIRUVANNAMALAI',
  'TIRUVANNAM': 'TIRUVANNAMALAI',
  'TIRUVANNA MALAI': 'TIRUVANNAMALAI',
  'TIRUVARUR': 'TIRUVARUR',
  'VELLORE': 'VELLORE',
  'VILLUPURAM': 'VILLUPURAM',
  'VIRUDHUNAGAR': 'VIRUDHUNAGAR',
  'VIRUDHUNAG': 'VIRUDHUNAGAR',
  'VIRUDHUNA GAR': 'VIRUDHUNAGAR',
};

const csvDir = path.join(__dirname, '../School_list_csv');
const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

let stats = {
  totalLines: 0,
  emptyLines: 0,
  headerLines: 0,
  validSchools: 0,
  invalidDistrict: 0,
  noDistrict: 0,
  noSchoolName: 0,
  shortSchoolName: 0,
  duplicates: 0
};

const invalidDistricts = new Set();
const skippedSchools = [];
const schoolsByDistrict = {};

console.log('📊 Analyzing CSV data...\n');

files.forEach(fileName => {
  const csvPath = path.join(csvDir, fileName);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    stats.totalLines++;
    
    if (!line) {
      stats.emptyLines++;
      continue;
    }
    
    const parts = parseCSVLine(line);
    
    if (parts.length < 4) {
      stats.emptyLines++;
      continue;
    }
    
    const col0 = parts[0]?.toUpperCase() || '';
    const col1 = parts[1]?.toUpperCase() || '';
    const col3 = parts[3]?.toUpperCase() || '';
    
    if (col0.includes('SNO') || col0.includes('S NO') ||
        col1 === 'DISTRICT' || col1.includes('DISTRICT') ||
        col3 === 'SCHOOL NAME' || col3.includes('SCHOOL')) {
      stats.headerLines++;
      continue;
    }
    
    const rawDistrict = parts[1]?.trim().toUpperCase();
    const schoolName = parts[3]?.trim();
    
    if (!rawDistrict) {
      stats.noDistrict++;
      skippedSchools.push({ file: fileName, line: i + 1, reason: 'No district', school: schoolName });
      continue;
    }
    
    if (!schoolName) {
      stats.noSchoolName++;
      continue;
    }
    
    if (schoolName.length < 5) {
      stats.shortSchoolName++;
      skippedSchools.push({ file: fileName, line: i + 1, reason: 'School name too short', district: rawDistrict, school: schoolName });
      continue;
    }
    
    const normalizedDistrict = VALID_DISTRICTS[rawDistrict];
    if (!normalizedDistrict) {
      stats.invalidDistrict++;
      invalidDistricts.add(rawDistrict);
      skippedSchools.push({ file: fileName, line: i + 1, reason: 'Invalid district', district: rawDistrict, school: schoolName });
      continue;
    }
    
    if (!schoolsByDistrict[normalizedDistrict]) {
      schoolsByDistrict[normalizedDistrict] = [];
    }
    
    const exists = schoolsByDistrict[normalizedDistrict].some(
      s => s.toUpperCase() === schoolName.toUpperCase()
    );
    
    if (exists) {
      stats.duplicates++;
      continue;
    }
    
    schoolsByDistrict[normalizedDistrict].push(schoolName);
    stats.validSchools++;
  }
});

console.log('📋 Statistics:');
console.log(`   Total lines: ${stats.totalLines}`);
console.log(`   Empty lines: ${stats.emptyLines}`);
console.log(`   Header lines: ${stats.headerLines}`);
console.log(`   Valid schools: ${stats.validSchools}`);
console.log(`   Duplicates removed: ${stats.duplicates}`);
console.log(`   Invalid district: ${stats.invalidDistrict}`);
console.log(`   No district: ${stats.noDistrict}`);
console.log(`   No school name: ${stats.noSchoolName}`);
console.log(`   Short school name (<5 chars): ${stats.shortSchoolName}`);

console.log(`\n❌ Top 20 Invalid Districts (${invalidDistricts.size} unique):`);
Array.from(invalidDistricts).slice(0, 20).forEach(dist => {
  console.log(`   ${dist}`);
});

console.log(`\n📝 First 30 Skipped Schools:`);
skippedSchools.slice(0, 30).forEach((item, idx) => {
  console.log(`   ${idx + 1}. ${item.reason}: "${item.school || 'N/A'}" [District: ${item.district || 'N/A'}] (${item.file}:${item.line})`);
});

if (invalidDistricts.size > 0) {
  console.log(`\n\n💡 Consider adding these district variations to VALID_DISTRICTS if they are valid:`);
  Array.from(invalidDistricts).slice(0, 10).forEach(dist => {
    console.log(`   '${dist}': 'PROPER_DISTRICT_NAME',`);
  });
}
