const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get directory path from command-line arguments
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Error: Directory path must be specified.');
  process.exit(1);
}

const targetPath = path.resolve(__dirname, inputPath);

function runGitCommand(command) {
  try {
    const output = execSync(command, { stdio: 'pipe' }).toString();
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
}

async function deleteArchivedCompanies(directory) {
  try {
    const companies = fs.readdirSync(directory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const company of companies) {
      const companyPath = path.join(directory, company);

      console.log(`Deleting directory: ${companyPath}`);
      fs.rmSync(companyPath, { recursive: true, force: true });

      // Commit changes
      const quotedPath = `"${path.resolve(directory)}"`;
      runGitCommand(`git add -A ${quotedPath}`);
      runGitCommand(`git commit -m "Deactivating ${company}"`);
      console.log(`Committed deletion for ${company}`);
    }
    console.log('All companies have been processed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

deleteArchivedCompanies(targetPath);