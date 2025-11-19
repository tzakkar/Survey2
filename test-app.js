// Simple test script to verify app structure
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Survey System Structure...\n');

const checks = [
  {
    name: 'Configuration Files',
    files: [
      'package.json',
      'tsconfig.json',
      'next.config.mjs',
      'tailwind.config.js',
      '.env.example',
    ],
  },
  {
    name: 'Prisma Files',
    files: [
      'prisma/schema.prisma',
      'prisma/seed.ts',
    ],
  },
  {
    name: 'Core Library Files',
    files: [
      'lib/db.ts',
      'lib/helpers/i18n.ts',
    ],
  },
  {
    name: 'Server Actions',
    files: [
      'app/actions/survey.ts',
      'app/actions/admin.ts',
    ],
  },
  {
    name: 'Public Pages',
    files: [
      'app/page.tsx',
      'app/layout.tsx',
      'app/globals.css',
      'app/survey/[slug]/page.tsx',
      'app/survey/[slug]/thank-you/page.tsx',
    ],
  },
  {
    name: 'Admin Pages',
    files: [
      'app/admin/page.tsx',
      'app/admin/questionnaires/page.tsx',
      'app/admin/questionnaires/new/page.tsx',
      'app/admin/questionnaires/[id]/edit/page.tsx',
      'app/admin/questionnaires/[id]/responses/page.tsx',
    ],
  },
  {
    name: 'Components',
    files: [
      'components/LanguageSwitch.tsx',
      'components/SurveyForm.tsx',
      'components/AdminQuestionnaireForm.tsx',
      'components/AdminQuestionList.tsx',
      'components/AdminQuestionForm.tsx',
      'components/AdminNewQuestionForm.tsx',
    ],
  },
];

let allPassed = true;

checks.forEach((check) => {
  console.log(`✓ Checking ${check.name}...`);
  check.files.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      allPassed = false;
    }
  });
  console.log('');
});

// Check package.json scripts
console.log('✓ Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'db:migrate', 'db:seed', 'db:generate'];
requiredScripts.forEach((script) => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ Script: ${script}`);
  } else {
    console.log(`  ❌ Script: ${script} - MISSING`);
    allPassed = false;
  }
});

// Check Prisma schema
console.log('\n✓ Checking Prisma schema...');
const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
const requiredModels = ['Questionnaire', 'Question', 'Option', 'Response', 'Answer'];
const requiredEnums = ['AudienceType', 'QuestionType', 'Language'];
requiredModels.forEach((model) => {
  if (schema.includes(`model ${model}`)) {
    console.log(`  ✅ Model: ${model}`);
  } else {
    console.log(`  ❌ Model: ${model} - MISSING`);
    allPassed = false;
  }
});
requiredEnums.forEach((enumName) => {
  if (schema.includes(`enum ${enumName}`)) {
    console.log(`  ✅ Enum: ${enumName}`);
  } else {
    console.log(`  ❌ Enum: ${enumName} - MISSING`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All structure checks passed!');
  console.log('\n📝 Note: Database connection test skipped (requires live database)');
  console.log('💡 To test with database:');
  console.log('   1. Ensure Supabase database is accessible');
  console.log('   2. Run: npm run db:migrate');
  console.log('   3. Run: npm run db:seed');
  console.log('   4. Run: npm run dev');
} else {
  console.log('❌ Some checks failed. Please review the output above.');
  process.exit(1);
}

