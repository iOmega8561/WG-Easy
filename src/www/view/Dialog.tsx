import React from "react";
import { AlertTriangle, Check, X } from "lucide-react";

import { translate } from "../data/Translator";
import Button from "./Button";
import Props from "../data/Props";

const Dialog: React.FC<Props.Dialog> = ({
  dismissAction,
  onConfirm
}) => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="p-6">

          <h3 className="
          flex items-center gap-4
          text-xl font-semibold 
          mb-4 dark:text-white">
            <AlertTriangle size={24}/>

            {translate("deleteClient")}
          </h3>

          <div className="mt-2">
            <p className="
            flex flex-col
            text-sm text-gray-500 
            dark:text-neutral-300">
              {translate("deleteDialog1")}

              <strong>{translate("deleteDialog2")}</strong>
            </p>
          </div>
        </div>

        <div className="
        flex justify-between
        py-2 px-6
        bg-gray-50 dark:bg-neutral-900
        border-t dark:border-neutral-600">
          <Button 
            onClick={dismissAction}
          >
            <X size={16} /> 
            {translate('cancel')}
          </Button>

          <Button 
            onClick={onConfirm}
          >
            <Check size={16} /> 
            {translate("deleteClient")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dialog;