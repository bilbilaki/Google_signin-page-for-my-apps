document.addEventListener('DOMContentLoaded', async () => {
    const policyContent = document.getElementById('policy-content');

    // If the `websim` runtime or its chat API is not available (for example when
    // opening the static HTML file in a browser), avoid throwing an error and
    // leave the server-generated/static HTML already present in the file.
    if (typeof window.websim === 'undefined' || !window.websim?.chat?.completions?.create) {
        // No runtime available; do nothing and keep the existing content.
        return;
    }

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Generate a boilerplate privacy policy for a fictional AI application called 'AI Box'. The app's source code is available at https://github.com/bilbilaki/flutter-gpt-box. The policy should be comprehensive but written in a way that is easy to understand. Format the output as clean HTML, using <h3> for section titles and <p> for paragraphs. The sections should be: "Effective Date", "Introduction", "Information We Collect", "How We Use Your Information", "Information Sharing and Disclosure", "Data Security", "Children's Privacy", "Links to Other Sites", "Changes to This Privacy Policy", and "Contact Us".`
                },
                {
                    role: 'user',
                    content: 'Generate the privacy policy now.'
                }
            ],
        });
        policyContent.innerHTML = completion.content;
    } catch (error) {
        console.error('Failed to generate privacy policy:', error);
        policyContent.innerHTML = '<p>Could not load the privacy policy at this time. Please try again later.</p>';
    }
});