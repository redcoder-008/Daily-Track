import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-8">
            <p><strong>Effective Date:</strong> October 4, 2025</p>
            <p><strong>Last Updated:</strong> October 4, 2025</p>
          </div>

          <p className="text-foreground/90">
            DailyTrack ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our website and application to manage tasks, to-do lists, expenses, notes, and scanned bills.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-foreground/90">We collect the following types of information:</p>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">User Input</h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Tasks, to-dos, expenses, notes, and scanned content that you add to the app.</li>
            <li>Scanned bills and images (if you use the scanning feature).</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Usage Data</h3>
          <p className="text-foreground/90">Non-personal technical data such as:</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Device type</li>
            <li>Operating system</li>
            <li>Browser type</li>
            <li>App interaction and usage analytics (if enabled)</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">No Account Required (Optional)</h3>
          <p className="text-foreground/90">DailyTrack can be used without creating an account.</p>
          <p className="text-foreground/90">If you choose to sign up (optional), we may collect:</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Email address (for sync and backup)</li>
            <li>Encrypted credentials</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-foreground/90">We use the collected data to:</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Store and manage your tasks, notes, expenses, and bills.</li>
            <li>Improve app performance and reliability.</li>
            <li>Provide features like reminders, expense tracking summaries, and note organization.</li>
            <li>Monitor crashes and fix technical issues.</li>
            <li>Securely scan and process uploaded images (e.g., bills or receipts) using OCR tools.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Sharing and Third Parties</h2>
          <p className="text-foreground/90">We do not sell, rent, or trade your personal information.</p>
          <p className="text-foreground/90">We may share limited data in the following ways:</p>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Third-party Services:</h3>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Hosting is provided by Vercel, which may log basic technical data for performance and security.</li>
            <li>OCR and Scanning features may use secure third-party APIs (e.g., Google Vision API) to extract data from images.</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Legal Compliance:</h3>
          <p className="text-foreground/90">If required by law, we may disclose information to comply with legal obligations.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
          <p className="text-foreground/90">
            We use industry-standard measures to protect your data, including encryption for stored content and secure HTTPS for data transmission. However, no method of data storage or transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Data Retention</h2>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Your data is stored locally in your browser or device unless cloud sync is enabled.</li>
            <li>If you delete your data or uninstall the app, associated local data is removed.</li>
            <li>Synced data (if used) is deleted upon account deletion or request.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Children's Privacy</h2>
          <p className="text-foreground/90">
            DailyTrack is not intended for children under the age of 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us to have it removed.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p className="text-foreground/90">
            We may update this Privacy Policy occasionally. Changes will be posted on this page with the updated effective date. We encourage you to review it regularly.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Contact Us</h2>
          <p className="text-foreground/90">
            If you have any questions, feedback, or requests related to this Privacy Policy, contact us at:
          </p>
          <p className="text-foreground/90 font-medium">📧 redcoder008@gmail.com</p>
          <p className="text-foreground/90 font-medium">🌐 <a href="https://karankamat.com.np" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">karankamat.com.np</a></p>

          <div className="mt-8 pt-6 border-t border-border">
            <Button onClick={() => navigate("/landing")} size="lg">
              ✅ Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
