const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const archivedPath = path.join(__dirname, 'e_templates/templates/_archived');

function runGitCommand(command) {
  try {
    const output = execSync(command, { stdio: 'pipe' }).toString();
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
}

async function deleteArchivedCompanies() {
  try {
    const companies = fs.readdirSync(archivedPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const company of companies) {
      const companyPath = path.join(archivedPath, company);

      console.log(`Deleting directory: ${companyPath}`);
      fs.rmSync(companyPath, { recursive: true, force: true });

      // Commit changes
      const quotedPath = `"${path.resolve(archivedPath)}"`;
      runGitCommand(`git add -A ${quotedPath}`);
      runGitCommand(`git commit -m "Deactivating ${company}"`);
      console.log(`Committed deletion for ${company}`);
    }
    console.log('All companies have been processed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

deleteArchivedCompanies();