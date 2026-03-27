import transporter from '../src/lib/email';
async function test() {
  console.log('Testing SMTP connection...');
  try {
    const success = await transporter.verify();
    if (success) {
      console.log('SMTP connection successful!');
    }
  } catch (error) {
    console.error('SMTP connection failed:', error);
  }
}
test();