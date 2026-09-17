"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/_ui/toast-utils";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppNavbar from "@/components/common/AppNavbar";
import AppFooter from "@/components/common/AppFooter";
import { AppDialogProvider } from "@/contexts/AppDialogContext";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaWhatsapp } from "react-icons/fa";

export default function Providers({ children }) {
  const whatsappNumber = "917024570433"; // change to your support number

  return (
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <AppDialogProvider>
              <ProtectedRoute>
                <div className="flex min-h-screen flex-col">
                  <AppNavbar />
                  <main className="flex flex-1 flex-col bg-white text-gray-900">
                    {children}
                  </main>
                  <AppFooter />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* Use a single <a> as the child, styled directly */}
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat on WhatsApp"
                      className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        h-14 w-14 rounded-full
        bg-green-500 text-white
        shadow-lg hover:scale-110 hover:bg-green-600
        transition-transform duration-200
      "
                    >
                      <FaWhatsapp className="h-7 w-7" />
                      <span className="sr-only">Chat on WhatsApp</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="bg-green-600 text-white"
                  >
                    Chat on WhatsApp
                  </TooltipContent>
                </Tooltip>
              </ProtectedRoute>
            </AppDialogProvider>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  );
}
