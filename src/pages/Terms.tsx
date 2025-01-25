import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="container py-8 space-y-8 animate-fade-up">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 15, 2024</p>
        </div>

        <Card className="p-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Terms of Use</h2>
            <p className="text-muted-foreground">
              By accessing and using StyleAI, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and
              password. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Privacy Policy</h2>
            <p className="text-muted-foreground">
              Your privacy is important to us. Our Privacy Policy explains how we collect,
              use, and protect your personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Content</h2>
            <p className="text-muted-foreground">
              Users retain all rights to their uploaded content. By uploading content,
              you grant StyleAI a license to use, modify, and display the content for
              the purpose of providing our services.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default Terms;