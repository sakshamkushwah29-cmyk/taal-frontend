"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

const AppDialogContext = createContext(null);

export const useAppDialog = () => {
  const context = useContext(AppDialogContext);
  if (!context) {
    throw new Error("useAppDialog must be used within AppDialogProvider");
  }
  return context;
};

export const AppDialogProvider = ({ children }) => {
  const [dialogConfig, setDialogConfig] = useState({
    visible: false,
    type: "info", // success | error | warning | info | custom
    title: null,
    description: null,
    buttons: [],
    autoCloseIn: null,
  });

  const timeoutRef = useRef(null);

  const hideDialog = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDialogConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const showDialog = useCallback(
    (config) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setDialogConfig({
        visible: true,
        type: config.type || "info",
        title: config.title || null,
        description: config.description || null,
        buttons: config.buttons || [],
        autoCloseIn: config.autoCloseIn || null,
      });

      if (config.autoCloseIn) {
        timeoutRef.current = setTimeout(() => {
          hideDialog();
        }, config.autoCloseIn);
      }
    },
    [hideDialog]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const value = useMemo(
    () => ({ showDialog, hideDialog }),
    [showDialog, hideDialog]
  );

  // Map type to icon + color
  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    },
    error: {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-500" />,
    },
    custom: {
      icon: null, // up to consumer
    },
  };

  return (
    <AppDialogContext.Provider value={value}>
      {children}

      <Dialog open={dialogConfig.visible} onOpenChange={hideDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Icon centered */}
            {dialogConfig.type !== "custom" &&
              typeConfig[dialogConfig.type]?.icon &&
              React.cloneElement(typeConfig[dialogConfig.type].icon, {
                className:
                  "w-12 h-12 sm:w-16 sm:h-16 " +
                  typeConfig[dialogConfig.type].icon.props.className,
              })}

            {/* Title & Description */}
            <DialogHeader className="space-y-2">
              {dialogConfig.title && (
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-center">
                  {dialogConfig.title}
                </DialogTitle>
              )}
              {dialogConfig.description && (
                <DialogDescription className="text-gray-600 text-sm sm:text-base">
                  {dialogConfig.description}
                </DialogDescription>
              )}
            </DialogHeader>
          </div>

          {/* Buttons */}
          {dialogConfig.buttons && dialogConfig.buttons.length > 0 && (
            <DialogFooter className="flex justify-center gap-2 mt-4">
              {dialogConfig.buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={btn.variant || "default"}
                  onClick={() => {
                    if (btn.onClick) btn.onClick();
                    hideDialog();
                  }}
                >
                  {btn.label}
                </Button>
              ))}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </AppDialogContext.Provider>
  );
};
