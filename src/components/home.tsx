import React, { useState } from "react";
import ColorPickerPanel from "./ColorPickerPanel";
import TrendingGrid from "./TrendingGrid";
import CollectionsDrawer from "./CollectionsDrawer";
import { Button } from "./ui/button";
import { Folder, LogIn } from "lucide-react";
import AuthDialog from "./auth/AuthDialog";
import { useAuth } from "@/lib/auth";

interface HomeProps {
  initialCollectionsOpen?: boolean;
}

const Home = ({ initialCollectionsOpen = false }: HomeProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(
    initialCollectionsOpen,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Color Palette</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCollectionsOpen(true)}
                className="flex items-center gap-2"
              >
                <Folder className="h-5 w-5" />
                Collections
              </Button>
              {user ? (
                <Button variant="ghost" onClick={signOut}>
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Color Picker Section */}
          <div className="lg:w-[480px] flex-shrink-0">
            <ColorPickerPanel />
          </div>

          {/* Trending Grid Section */}
          <div className="flex-grow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Trending Palettes
              </h2>
              <p className="text-gray-500">
                Discover popular color combinations
              </p>
            </div>
            <TrendingGrid />
          </div>
        </div>
      </main>

      {/* Collections Drawer */}
      <CollectionsDrawer
        isOpen={isCollectionsOpen}
        onClose={() => setIsCollectionsOpen(false)}
      />

      {/* Auth Dialog */}
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Home;
