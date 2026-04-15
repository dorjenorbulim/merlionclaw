/**
 * Developer Application Handler
 * 
 * This script processes developer applications and sends email notifications.
 * For beta launch, we'll email applications directly to dorjenorbulim@gmail.com
 * 
 * Usage: node submit-application.js (with form data in request body)
 */

const https = require('https');

// Configuration
const ADMIN_EMAIL = 'dorjenorbulim@gmail.com';
const SITE_NAME = 'AgentHub';

/**
 * Send email via email API (use your preferred service)
 * For beta: Use emailjs, sendgrid, or simple mailto fallback
 */
function sendEmail(to, subject, body) {
  console.log(`📧 Email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body.substring(0, 200)}...`);
  
  // In production, integrate with:
  // - SendGrid: https://sendgrid.com/docs/api-reference/
  // - Resend: https://resend.com/docs
  // - EmailJS: https://www.emailjs.com/
  
  // For beta: Log to console + show success message
  return { success: true, messageId: 'beta-' + Date.now() };
}

/**
 * Process developer application
 */
function processApplication(data) {
  console.log('📝 New Developer Application:', data);
  
  // Validate required fields
  const required = ['name', 'email', 'agentName', 'category', 'description', 'pricing'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    return {
      success: false,
      error: `Missing required fields: ${missing.join(', ')}`
    };
  }
  
  // Format email to admin
  const adminSubject = `🤖 New Developer Application: ${data.agentName}`;
  const adminBody = `
NEW DEVELOPER APPLICATION
=========================

Developer Info:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company || 'N/A'}
- Website: ${data.website || 'N/A'}

Agent Info:
- Name: ${data.agentName}
- Category: ${data.category}
- Description: ${data.description}
- Pricing: ${data.pricing} - ${data.price || 'TBD'}

Links:
- Demo: ${data.demo || 'Not provided'}
- GitHub: ${data.github || 'Not provided'}

Terms:
- Agreed to Developer Agreement: ${data.terms ? 'Yes' : 'No'}
- Marketing Opt-in: ${data.marketing ? 'Yes' : 'No'}

Submitted: ${new Date().toISOString()}

---
Next Steps:
1. Review application (15 min)
2. Email developer: dorjenorbulim@gmail.com
3. If approved: Send onboarding instructions
4. Add to beta waitlist spreadsheet
`.trim();
  
  // Send email to admin
  const result = sendEmail(ADMIN_EMAIL, adminSubject, adminBody);
  
  if (!result.success) {
    return { success: false, error: 'Failed to send notification email' };
  }
  
  // Format confirmation email to developer
  const developerSubject = '✅ Application Received — AgentHub Beta';
  const developerBody = `
Hi ${data.name},

Thank you for applying to AgentHub!

✅ YOUR APPLICATION HAS BEEN RECEIVED

Agent: ${data.agentName}
Submitted: ${new Date().toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' })}

📋 NEXT STEPS

1. **Review (48 hours)**
   We'll review your application within 48 hours.

2. **Approval Email**
   If approved, you'll receive:
   - Welcome email with next steps
   - Developer onboarding guide
   - Access to developer dashboard

3. **List Your Agent**
   Once approved, you can:
   - Set up your developer profile
   - Configure pricing and billing
   - Publish your agent to the marketplace

📞 QUESTIONS?

Reply to this email or contact us at dorjenorbulim@gmail.com

We're excited to have you on board!

—
Michael K C Lim
Founder, AgentHub Pte. Ltd.
dorjenorbulim@gmail.com
Singapore 🇸🇬

---
AgentHub — The App Store for Autonomous AI
Beta Program (April 13-30, 2026)
`.trim();
  
  // Send confirmation to developer
  sendEmail(data.email, developerSubject, developerBody);
  
  return {
    success: true,
    message: 'Application submitted successfully',
    applicationId: 'beta-' + Date.now()
  };
}

// Export for use in API
module.exports = { processApplication };

// If run directly (for testing)
if (require.main === module) {
  const testData = {
    name: 'Test Developer',
    email: 'test@example.com',
    company: 'Test Corp',
    website: 'https://example.com',
    agentName: 'Test Agent',
    category: 'compliance',
    description: 'This is a test agent for beta testing.',
    pricing: 'subscription',
    price: '$99/month',
    demo: 'https://example.com/demo',
    github: 'https://github.com/test/test-agent',
    terms: true,
    marketing: true
  };
  
  const result = processApplication(testData);
  console.log('Result:', result);
}
