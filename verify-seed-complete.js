const fs = require('fs');
const path = require('path');

console.log('🔍 Comprehensive Verification of supabase-seed-complete.sql\n');
console.log('='.repeat(70));

const seedFile = path.join(__dirname, 'supabase-seed-complete.sql');
const content = fs.readFileSync(seedFile, 'utf-8');
const lines = content.split('\n');

// Find all question insertions
const questions = [];
let currentQuestion = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect question insertion
  if (line.includes('INSERT INTO "Question"') && line.includes('VALUES')) {
    const match = line.match(/VALUES\s*\([^,]+,\s*[^,]+,\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([^)]+)\)/);
    if (match) {
      currentQuestion = {
        order: parseInt(match[1]),
        type: match[2],
        textEn: match[3],
        textAr: match[4],
        isRequired: match[5].trim(),
        line: i + 1,
        hasOptions: false
      };
    }
  }
  
  // Check if options follow (within next 10 lines)
  if (currentQuestion && i < lines.length - 1) {
    const nextLines = lines.slice(i + 1, i + 11).join('\n');
    
    if (currentQuestion.type === 'SCALE_1_5') {
      if (nextLines.includes('PERFORM create_scale_options(q_id);')) {
        currentQuestion.hasOptions = true;
        questions.push(currentQuestion);
        currentQuestion = null;
      }
    } else if (currentQuestion.type === 'MULTIPLE_CHOICE') {
      if (nextLines.includes('INSERT INTO "Option"')) {
        currentQuestion.hasOptions = true;
        questions.push(currentQuestion);
        currentQuestion = null;
      }
    } else if (currentQuestion.type === 'TEXT') {
      // TEXT questions don't need options
      currentQuestion.hasOptions = true;
      questions.push(currentQuestion);
      currentQuestion = null;
    }
  }
}

// Separate by type
const scaleQuestions = questions.filter(q => q.type === 'SCALE_1_5');
const mcQuestions = questions.filter(q => q.type === 'MULTIPLE_CHOICE');
const textQuestions = questions.filter(q => q.type === 'TEXT');

const scaleWithOptions = scaleQuestions.filter(q => q.hasOptions);
const scaleWithoutOptions = scaleQuestions.filter(q => !q.hasOptions);
const mcWithOptions = mcQuestions.filter(q => q.hasOptions);
const mcWithoutOptions = mcQuestions.filter(q => !q.hasOptions);

// Report
console.log('\n📊 VERIFICATION RESULTS:\n');

console.log(`✅ SCALE_1_5 Questions: ${scaleQuestions.length} total`);
console.log(`   ✓ With options: ${scaleWithOptions.length}`);
if (scaleWithoutOptions.length > 0) {
  console.log(`   ✗ Without options: ${scaleWithoutOptions.length}`);
  scaleWithoutOptions.forEach(q => {
    console.log(`      - Q${q.order} (Line ${q.line}): "${q.textEn.substring(0, 50)}..."`);
  });
} else {
  console.log(`   ✓ All have options!`);
}

console.log(`\n✅ MULTIPLE_CHOICE Questions: ${mcQuestions.length} total`);
console.log(`   ✓ With options: ${mcWithOptions.length}`);
if (mcWithoutOptions.length > 0) {
  console.log(`   ✗ Without options: ${mcWithoutOptions.length}`);
  mcWithoutOptions.forEach(q => {
    console.log(`      - Q${q.order} (Line ${q.line}): "${q.textEn.substring(0, 50)}..."`);
  });
} else {
  console.log(`   ✓ All have options!`);
}

console.log(`\n✅ TEXT Questions: ${textQuestions.length} total (don't need options)`);

// Count create_scale_options calls
const scaleOptionsCalls = (content.match(/PERFORM create_scale_options\(q_id\);/g) || []).length;
const directOptionInserts = (content.match(/INSERT INTO "Option"/g) || []).length;

console.log(`\n📈 COUNTS:`);
console.log(`   - create_scale_options() calls: ${scaleOptionsCalls}`);
console.log(`   - Direct INSERT INTO Option statements: ${directOptionInserts}`);

// Summary
const totalNeedingOptions = scaleQuestions.length + mcQuestions.length;
const totalWithOptions = scaleWithOptions.length + mcWithOptions.length;
const totalWithoutOptions = scaleWithoutOptions.length + mcWithoutOptions.length;

console.log('\n' + '='.repeat(70));
console.log('📋 SUMMARY:');
console.log(`   Total questions: ${questions.length}`);
console.log(`   Questions needing options: ${totalNeedingOptions}`);
console.log(`   Questions with options: ${totalWithOptions}`);
console.log(`   Questions without options: ${totalWithoutOptions}`);

if (totalWithoutOptions === 0) {
  console.log('\n✅ SUCCESS: All questions are properly configured!');
  console.log('   ✓ All SCALE_1_5 questions have create_scale_options() calls');
  console.log('   ✓ All MULTIPLE_CHOICE questions have INSERT INTO Option statements');
} else {
  console.log(`\n❌ ISSUE: ${totalWithoutOptions} question(s) missing options`);
}

console.log('='.repeat(70));

