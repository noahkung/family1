// client/src/App.tsx

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LandingPage } from "@/pages/LandingPage";
import { RoleSelection } from "@/pages/RoleSelection";
import { Assessment } from "@/pages/Assessment";
import { Results } from "@/pages/Results"; // <--- ตรวจสอบว่านี่คือ 'from' ไม่ใช่ '=>'
import { AdminPanel } from "@/pages/AdminPanel";
import { NameInputPage } from "@/pages/NameInputPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="relative min-h-screen">
      <LanguageToggle />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/name-input" component={NameInputPage} />
        <Route path="/role-selection" component={RoleSelection} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/results" component={Results} />

        <Route path="/admin" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;