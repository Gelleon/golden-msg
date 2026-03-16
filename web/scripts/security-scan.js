const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- GOLDEN RUSSIA SECURITY SCANNER ---');

const findings = [];

// 1. Check for hardcoded secrets
const secretsPatterns = [
  /API_KEY\s*=\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
  /SECRET\s*=\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
  /PASSWORD\s*=\s*['"][a-zA-Z0-9_-]{8,}['"]/gi,
  /NEXTAUTH_SECRET\s*=\s*['"][a-zA-Z0-9_-]{20,}['"]/gi
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        scanDir(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Pattern checks
      secretsPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          findings.push({
            type: 'HARDCODED_SECRET',
            file: fullPath,
            severity: 'CRITICAL',
            message: `Possible hardcoded secret found with pattern: ${pattern}`
          });
        }
      });

      // Vulnerable patterns
      if (content.includes('dangerouslySetInnerHTML')) {
        findings.push({
          type: 'XSS_RISK',
          file: fullPath,
          severity: 'HIGH',
          message: 'Usage of dangerouslySetInnerHTML detected. Ensure content is sanitized.'
        });
      }

      if (content.includes('eval(')) {
        findings.push({
          type: 'EVAL_RISK',
          file: fullPath,
          severity: 'CRITICAL',
          message: 'Usage of eval() detected. Avoid this at all costs.'
        });
      }

      if (content.includes('localStorage.set') || content.includes('sessionStorage.set')) {
        findings.push({
          type: 'SENSITIVE_DATA_STORAGE',
          file: fullPath,
          severity: 'MEDIUM',
          message: 'Sensitive data might be stored in browser storage. Prefer HTTP-only cookies.'
        });
      }

      // 4. Missing Authorization Check in Server Actions
      if (fullPath.includes('actions') && (content.includes('export async function') || content.includes('export const'))) {
        // Simple check for role validation or session check
        const hasSessionCheck = content.includes('auth()') || content.includes('getSession()') || content.includes('getServerSession()');
        const hasRoleCheck = content.includes('role') || content.includes('isAdmin');
        
        if (!hasSessionCheck && !hasRoleCheck) {
          findings.push({
            type: 'MISSING_AUTH_CHECK',
            file: fullPath,
            severity: 'HIGH',
            message: 'Server Action might be missing authentication/authorization checks.'
          });
        }
      }

      // 5. Unsafe Redirects
      if (content.includes('redirect(') && content.includes('url')) {
        findings.push({
          type: 'OPEN_REDIRECT_RISK',
          file: fullPath,
          severity: 'MEDIUM',
          message: 'Ensure redirects are validated to prevent open redirect vulnerabilities.'
        });
      }
    }
  }
}

console.log('Scanning for sensitive patterns and vulnerabilities...');
scanDir(path.join(__dirname, '../src'));

// 2. NPM Audit
console.log('Running npm audit...');
try {
  const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
  const audit = JSON.parse(auditOutput);
  if (audit.metadata.vulnerabilities.total > 0) {
    findings.push({
      type: 'NPM_VULNERABILITY',
      severity: 'VARIES',
      message: `Found ${audit.metadata.vulnerabilities.total} vulnerabilities in dependencies.`
    });
  }
} catch (error) {
  // npm audit exits with non-zero if vulnerabilities are found
  try {
    const audit = JSON.parse(error.stdout);
    findings.push({
      type: 'NPM_VULNERABILITY',
      severity: 'VARIES',
      message: `Found ${audit.metadata.vulnerabilities.total} vulnerabilities in dependencies.`
    });
  } catch (e) {
    console.error('Failed to run npm audit.');
  }
}

// 3. Final Report
console.log('\n--- SECURITY SCAN RESULTS ---');
if (findings.length === 0) {
  console.log('No major security issues found. Great job!');
} else {
  findings.forEach(f => {
    console.log(`[${f.severity}] ${f.type}: ${f.message}`);
    if (f.file) console.log(`  File: ${f.file}`);
  });
}

// Write to file
fs.writeFileSync(
  path.join(__dirname, '../security-report.json'),
  JSON.stringify({ date: new Date().toISOString(), findings }, null, 2)
);
console.log(`\nFull report saved to security-report.json`);
