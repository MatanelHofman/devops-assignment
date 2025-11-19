const fs = require('fs');
const path = require('path');
const http = require('http');
const { timeStamp } = require('console');

const apiUrl = process.env['INPUT_API_URL'];



if (!apiUrl){
    console.error('api-url input is missing');
    process.exit(1);
}

http.get(apiUrl, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try{
            const json = JSON.parse(data);

            const markdown = `## API Status
            
            - Status: ${json.status}
            - Service: ${json.service}
            - Timestamp: ${json.timestamp}
            `;

            console.log('Generated Markdown:');
            console.log(markdown);

            
            updateReadme(markdown);
            
        } catch (err){
            console.error('Failed to parse API response as JSON:', err.message);
            process.exit(1);
        }
    });
}).on('error', (err) => {
    console.error('Error calling API:', err.message);
    process.exit(1);
});



function updateReadme(markdown){
    const readmePath = path.join(process.cwd(), 'README.md');

    const startTag = '<!-- API_STATUS_START -->';
    const endTag = '<!-- API_STATUS_START -->';

    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    const startIndex = readmeContent.indexOf(startTag);
    const endIndex = readmeContent.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex){
        console.error('Could not find API_STATUS placeholders in README.md');
        process.exit(1);
    }

    const before = readmeContent.slice(0,startIndex + startTag.length);
    const after = readmeContent.slice(endIndex);

    const newContent = `${before}\n\n${markdown}\n${after}`;

    fs.writeFileSync(readmePath, newContent, 'utf8');

    console.log('README.md updated successfully');
    
}