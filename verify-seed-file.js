const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying supabase-seed-complete.sql file...\n');

const seedFile = path.join(__dirname, 'supabase-seed-complete.sql');
const content = fs.readFileSync(seedFile, 'utf-8');

// Find all SCALE_1_5 questions
const scaleQuestions = [];
const scaleMatches = content.matchAll(/SCALE_1_5.*?'([^']+)'/g);
for (const match of scaleMatches) {
  const questionText = match[1];
  const lines = content.substring(0, match.index).split('\n');
  const lineNumber = lines.length;
  scaleQuestions.push({ text: questionText, line: lineNumber });
}

// Find all MULTIPLE_CHOICE questions
const multipleChoiceQuestions = [];
const mcMatches = content.matchAll(/MULTIPLE_CHOICE.*?'([^']+)'/g);
for (const match of mcMatches) {
  const questionText = match[1];
  const lines = content.substring(0, match.index).split('\n');
  const lineNumber = lines.length;
  multipleChoiceQuestions.push({ text: questionText, line: lineNumber });
}

// Count create_scale_options calls
const scaleOptionsCalls = (content.match(/PERFORM create_scale_options\(q_id\);/g) || []).length;

// Count direct INSERT INTO Option statements
const directOptionInserts = (content.match(/INSERT INTO "Option"/g) || []).length;

// Check each SCALE_1_5 question has create_scale_options call after it
const scaleQuestionsWithOptions = [];
const scaleQuestionsWithoutOptions = [];

scaleQuestions.forEach((q, index) => {
  const questionIndex = content.indexOf(`'${q.text}'`);
  if (questionIndex === -1) return;
  
  const afterQuestion = content.substring(questionIndex);
  const hasOptionsCall = afterQuestion.includes('PERFORM create_scale_options(q_id);');
  
  if (hasOptionsCall) {
    scaleQuestionsWithOptions.push(q);
  } else {
    scaleQuestionsWithoutOptions.push(q);
  }
});

// Check MULTIPLE_CHOICE questions have INSERT INTO Option after them
const mcQuestionsWithOptions = [];
const mcQuestionsWithoutOptions = [];

multipleChoiceQuestions.forEach((q) => {
  const questionIndex = content.indexOf(`'${q.text}'`);
  if (questionIndex === -1) return;
  
  const afterQuestion = content.substring(questionIndex, questionIndex + 2000);
  const hasOptionsInsert = afterQuestion.includes('INSERT INTO "Option"');
  
  if (hasOptionsInsert) {
    mcQuestionsWithOptions.push(q);
  } else {
    mcQuestionsWithoutOptions.push(q);
  }
});

// Report results
console.log('='.repeat(70));
console.log('📊 VERIFICATION RESULTS\n');

console.log(`✅ SCALE_1_5 Questions: ${scaleQuestions.length} total`);
console.log(`   - With options: ${scaleQuestionsWithOptions.length}`);
console.log(`   - Without options: ${scaleQuestionsWithoutOptions.length}`);
console.log(`   - create_scale_options() calls: ${scaleOptionsCalls}\n`);

console.log(`✅ MULTIPLE_CHOICE Questions: ${multipleChoiceQuestions.length} total`);
console.log(`   - With options: ${mcQuestionsWithOptions.length}`);
console.log(`   - Without options: ${mcQuestionsWithoutOptions.length}`);
console.log(`   - Direct INSERT INTO Option: ${directOptionInserts}\n`);

if (scaleQuestionsWithoutOptions.length > 0) {
  console.log('❌ SCALE_1_5 Questions MISSING options:');
  scaleQuestionsWithoutOptions.forEach(q => {
    console.log(`   - Line ${q.line}: "${q.text.substring(0, 60)}..."`);
  });
  console.log('');
}

if (mcQuestionsWithoutOptions.length > 0) {
  console.log('❌ MULTIPLE_CHOICE Questions MISSING options:');
  mcQuestionsWithoutOptions.forEach(q => {
    console.log(`   - Line ${q.line}: "${q.text.substring(0, 60)}..."`);
  });
  console.log('');
}

// Check if counts match
const expectedScaleOptions = scaleQuestions.length;
if (scaleOptionsCalls !== expectedScaleOptions) {
  console.log(`⚠️  WARNING: Expected ${expectedScaleOptions} create_scale_options() calls, found ${scaleOptionsCalls}`);
  console.log(`   Difference: ${expectedScaleOptions - scaleOptionsCalls}\n`);
}

// Summary
const totalQuestionsNeedingOptions = scaleQuestions.length + multipleChoiceQuestions.length;
const questionsWithOptions = scaleQuestionsWithOptions.length + mcQuestionsWithOptions.length;
const questionsWithoutOptions = scaleQuestionsWithoutOptions.length + mcQuestionsWithoutOptions.length;

console.log('='.repeat(70));
console.log('📈 SUMMARY');
console.log(`Total questions needing options: ${totalQuestionsNeedingOptions}`);
console.log(`Questions with options: ${questionsWithOptions}`);
console.log(`Questions without options: ${questionsWithoutOptions}`);

if (questionsWithoutOptions === 0) {
  console.log('\n✅ SUCCESS: All questions have options configured!');
} else {
  console.log(`\n❌ ISSUE: ${questionsWithoutOptions} question(s) missing options`);
  console.log('💡 Fix: Add PERFORM create_scale_options(q_id); after SCALE_1_5 questions');
  console.log('💡 Fix: Add INSERT INTO "Option" statements after MULTIPLE_CHOICE questions');
}

console.log('='.repeat(70));

