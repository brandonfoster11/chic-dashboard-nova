import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Button variant="link">About</Button></li>
              <li><Button variant="link">Careers</Button></li>
              <li><Button variant="link">Contact</Button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><Button variant="link">Blog</Button></li>
              <li><Button variant="link">Style Guide</Button></li>
              <li><Button variant="link">Help Center</Button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><Button variant="link">Privacy</Button></li>
              <li><Button variant="link">Terms</Button></li>
              <li><Button variant="link">Cookie Policy</Button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social</h3>
            <ul className="space-y-2">
              <li><Button variant="link">Twitter</Button></li>
              <li><Button variant="link">Instagram</Button></li>
              <li><Button variant="link">LinkedIn</Button></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024 StyleAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};