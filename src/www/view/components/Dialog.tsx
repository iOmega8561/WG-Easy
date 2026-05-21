import React, { useEffect } from "react";
import { Check, X } from "lucide-react";

import { translate } from "../../data/Translator";
import Button from "./Button";
import Props from "../../data/Props";

const Dialog: React.FC<Props.Dialog> = ({
  titleIcon,
  titleText,
  content,
  onDismiss,
  onConfirm,
  onConfirmTitle,
  onConfirmDisabled
}) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismiss]);

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="p-6">

          {(titleIcon || titleText) && (
            <h3 className="
            flex items-center gap-4
            text-xl font-semibold 
            mb-4 dark:text-white">
              {titleIcon}
              {titleText}
            </h3>
          )}

          <div className="mt-2">
            <p className="
            flex flex-col
            text-sm text-gray-500 
            dark:text-neutral-300">
              {content}
            </p>
          </div>
        </div>

        <div className="
        flex justify-between
        py-2 px-6
        bg-gray-50 dark:bg-neutral-900
        border-t dark:border-neutral-600">
          <Button 
            onClick={onDismiss}
          >
            <X size={16} /> 
            {translate('cancel')}
          </Button>

          {onConfirm && onConfirmTitle && (
            <Button 
              disabled={onConfirmDisabled || false}
              onClick={() => { 
                onConfirm();
                onDismiss();
              }}
            >
              <Check size={16} /> 
              {onConfirmTitle}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dialog;