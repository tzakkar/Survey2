// Generate complete SQL seed from prisma/seed.ts
// This ensures all questions are included

const fs = require('fs');
const path = require('path');

// Read the seed.ts file
const seedContent = fs.readFileSync(path.join(__dirname, 'prisma/seed.ts'), 'utf8');

// Extract all questions using regex patterns
const staffMatch = seedContent.match(/\/\/ 1\. STAFF QUESTIONNAIRE[\s\S]*?\/\/ 2\. MANAGER QUESTIONNAIRE/);
const managerMatch = seedContent.match(/\/\/ 2\. MANAGER QUESTIONNAIRE[\s\S]*?\/\/ 3\. HR EMPLOYEE QUESTIONNAIRE/);
const hrMatch = seedContent.match(/\/\/ 3\. HR EMPLOYEE QUESTIONNAIRE[\s\S]*?console\.log\('Created questionnaires:'\)/);

console.log('Analyzing seed.ts file...\n');

// Count questions
const countQuestions = (text) => {
  const orderMatches = text.match(/order:\s*(\d+)/g);
  return orderMatches ? orderMatches.length : 0;
};

const staffCount = countQuestions(staffMatch ? staffMatch[0] : '');
const managerCount = countQuestions(managerMatch ? managerMatch[0] : '');
const hrCount = countQuestions(hrMatch ? hrMatch[0] : '');

console.log('Question counts found in seed.ts:');
console.log(`  Staff: ${staffCount} questions`);
console.log(`  Manager: ${managerCount} questions`);
console.log(`  HR: ${hrCount} questions`);
console.log(`  Total: ${staffCount + managerCount + hrCount} questions\n`);

// Check SQL file
const sqlContent = fs.readFileSync(path.join(__dirname, 'supabase-seed-complete.sql'), 'utf8');
const sqlStaffCount = (sqlContent.match(/staff_q_id, \d+, 'SCALE_1_5'/g) || []).length + 
                      (sqlContent.match(/staff_q_id, \d+, 'MULTIPLE_CHOICE'/g) || []).length +
                      (sqlContent.match(/staff_q_id, \d+, 'TEXT'/g) || []).length;
const sqlManagerCount = (sqlContent.match(/manager_q_id, \d+, 'SCALE_1_5'/g) || []).length + 
                        (sqlContent.match(/manager_q_id, \d+, 'MULTIPLE_CHOICE'/g) || []).length +
                        (sqlContent.match(/manager_q_id, \d+, 'TEXT'/g) || []).length;
const sqlHrCount = (sqlContent.match(/hr_q_id, \d+, 'SCALE_1_5'/g) || []).length + 
                   (sqlContent.match(/hr_q_id, \d+, 'MULTIPLE_CHOICE'/g) || []).length +
                   (sqlContent.match(/hr_q_id, \d+, 'TEXT'/g) || []).length;

console.log('Question counts in supabase-seed-complete.sql:');
console.log(`  Staff: ${sqlStaffCount} questions`);
console.log(`  Manager: ${sqlManagerCount} questions`);
console.log(`  HR: ${sqlHrCount} questions`);
console.log(`  Total: ${sqlStaffCount + sqlManagerCount + sqlHrCount} questions\n`);

if (staffCount !== sqlStaffCount || managerCount !== sqlManagerCount || hrCount !== sqlHrCount) {
  console.log('⚠️  MISMATCH DETECTED!');
  console.log(`  Staff: ${staffCount} in seed.ts vs ${sqlStaffCount} in SQL`);
  console.log(`  Manager: ${managerCount} in seed.ts vs ${sqlManagerCount} in SQL`);
  console.log(`  HR: ${hrCount} in seed.ts vs ${sqlHrCount} in SQL`);
} else {
  console.log('✅ Counts match!');
}

