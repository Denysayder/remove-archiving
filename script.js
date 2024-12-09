const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const archivedPath = path.join(__dirname, 'e_templates/templates/_archived');

// Function to execute a Git command
function runGitCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
}

// Main function
async function deleteArchivedCompanies() {
  try {
    // Read the contents of the _archived directory
    const companies = fs.readdirSync(archivedPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const company of companies) {
      const companyPath = path.join(archivedPath, company);

      console.log(`Deleting directory: ${companyPath}`);

      // Delete the directory
      fs.rmSync(companyPath, { recursive: true, force: true });

      console.log(`Directory deleted: ${companyPath}`);

      // Commit the deletion with a message
      runGitCommand(`git add -A ${archivedPath}`);
      runGitCommand(`git commit -m "Deactivating ${company}"`);

      console.log(`Committed deletion for ${company}`);
    }

    console.log('All companies have been processed.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Execute the function
deleteArchivedCompanies();
